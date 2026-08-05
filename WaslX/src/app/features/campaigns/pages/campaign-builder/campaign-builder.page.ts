import { Component, OnDestroy, OnInit, computed, inject, signal } from '@angular/core';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import * as XLSX from 'xlsx';

import { type TranslationKey, LanguageService } from '../../../../core/services/language.service';
import { ToastService } from '../../../../core/services/toast.service';
import {
  AudienceContact,
  AudienceFilter,
  Campaign,
  CampaignsApiService,
  UpsertCampaignRequest,
} from '../../../../core/api/campaigns-api.service';
import { Tag, TagsApiService } from '../../../../core/api/tags-api.service';
import { TemplatesApiService } from '../../../../core/api/templates-api.service';
import { WhatsAppAccountSummary, WhatsAppApiService } from '../../../../core/api/whatsapp-api.service';
import type { Template } from '../../../templates/models/template.model';
import { apiErrorMessage } from '../../../../core/utils/api-error';
import { IconComponent } from '../../../../shared/components/icon/icon.component';

type ScheduleMode = 'now' | 'later';

@Component({
  selector: 'app-campaign-builder-page',
  standalone: true,
  imports: [RouterLink, IconComponent],
  templateUrl: './campaign-builder.page.html',
  styleUrl: './campaign-builder.page.css',
})
export class CampaignBuilderPageComponent implements OnInit, OnDestroy {
  private readonly languageService = inject(LanguageService);
  private readonly api = inject(CampaignsApiService);
  private readonly tagsApi = inject(TagsApiService);
  private readonly templatesApi = inject(TemplatesApiService);
  private readonly whatsAppApi = inject(WhatsAppApiService);
  private readonly toast = inject(ToastService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly t = (key: TranslationKey) => this.languageService.text(key);
  readonly direction = () => this.languageService.getDirection();

  // ── Wizard state ──
  readonly steps: readonly { key: TranslationKey }[] = [
    { key: 'cmpStepAudience' },
    { key: 'cmpStepMessage' },
    { key: 'cmpStepSchedule' },
    { key: 'cmpStepReview' },
  ];
  readonly step = signal(0);

  readonly editingId = signal<number | null>(null);
  readonly persistedId = signal<number | null>(null);
  readonly loadingExisting = signal(false);
  readonly notFound = signal(false);

  // ── Form model ──
  readonly name = signal('');

  // Recipients — the final phone list (from an uploaded file OR picked contacts).
  readonly recipients = signal<string[]>([]);
  readonly fileName = signal<string | null>(null);
  readonly parsing = signal(false);
  readonly parseError = signal<string | null>(null);

  // Audience mode: upload a CSV/Excel file, or pick from existing contacts.
  readonly audienceMode = signal<'upload' | 'contacts'>('upload');
  readonly tags = signal<Tag[]>([]);
  readonly contacts = signal<AudienceContact[]>([]);
  readonly contactsLoading = signal(false);
  readonly selectedContactIds = signal<number[]>([]);
  readonly filterTagId = signal<number | null>(null);
  readonly filterDateFrom = signal<string | null>(null);
  readonly filterDateTo = signal<string | null>(null);
  readonly allVisibleSelected = computed(
    () => this.contacts().length > 0 && this.contacts().every((c) => this.selectedContactIds().includes(c.id)),
  );

  readonly waAccountId = signal<number | null>(null);
  readonly templateName = signal<string | null>(null);
  readonly messageBody = signal('');

  readonly scheduleMode = signal<ScheduleMode>('now');
  readonly scheduledAt = signal<string>(''); // datetime-local value

  // ── Reference data ──
  readonly templates = signal<Template[]>([]);
  readonly accounts = signal<WhatsAppAccountSummary[]>([]);
  readonly refLoading = signal(true);

  // ── Audience size = number of valid, de-duplicated recipients ──
  readonly audienceCount = computed(() => this.recipients().length);

  // ── Busy flags ──
  readonly savingDraft = signal(false);
  readonly launching = signal(false);
  readonly formError = signal<string | null>(null);

  readonly currentFilter = computed<AudienceFilter>(() => ({
    phoneNumbers: this.recipients(),
  }));

  readonly selectedAccount = computed(() =>
    this.accounts().find((a) => a.id === this.waAccountId()) ?? null,
  );

  ngOnInit(): void {
    this.loadReferenceData();

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const id = Number(idParam);
      this.editingId.set(id);
      this.persistedId.set(id);
      this.loadExisting(id);
    }
  }

  ngOnDestroy(): void {
    // no timers to clean up
  }

  private loadReferenceData(): void {
    this.refLoading.set(true);
    forkJoin({
      templates: this.templatesApi.list('APPROVED').pipe(catchError(() => of<Template[]>([]))),
      accounts: this.whatsAppApi.getAccounts().pipe(catchError(() => of<WhatsAppAccountSummary[]>([]))),
      tags: this.tagsApi.getTags().pipe(catchError(() => of<Tag[]>([]))),
    }).subscribe({
      next: ({ templates, accounts, tags }) => {
        this.templates.set((templates ?? []).filter((tpl) => (tpl.status ?? '').toUpperCase() === 'APPROVED'));
        this.accounts.set(accounts);
        this.tags.set(tags ?? []);
        // Default to the single connected number when there is exactly one.
        if (accounts.length === 1 && this.waAccountId() === null) {
          this.waAccountId.set(accounts[0].id);
        }
        this.refLoading.set(false);
      },
      error: () => this.refLoading.set(false),
    });
  }

  private loadExisting(id: number): void {
    this.loadingExisting.set(true);
    this.api.getCampaign(id).subscribe({
      next: (c) => {
        this.hydrate(c);
        this.loadingExisting.set(false);
      },
      error: () => {
        this.notFound.set(true);
        this.loadingExisting.set(false);
      },
    });
  }

  private hydrate(c: Campaign): void {
    this.name.set(c.name);
    this.recipients.set(c.audienceFilter.phoneNumbers);
    this.waAccountId.set(c.waAccountId);
    this.templateName.set(c.templateName);
    this.messageBody.set(c.messageBody ?? '');
    if (c.scheduledAt) {
      this.scheduleMode.set('later');
      this.scheduledAt.set(toDateTimeLocal(c.scheduledAt));
    }
  }

  // ── Recipients: upload + parse a CSV/Excel file ──
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) {
      return;
    }
    this.parseError.set(null);
    this.formError.set(null);
    this.parsing.set(true);
    this.fileName.set(file.name);

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = new Uint8Array(reader.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        // header:1 → raw 2D array of every cell (works for CSV or XLSX, header row or not).
        const rows = XLSX.utils.sheet_to_json<unknown[]>(sheet, { header: 1, blankrows: false });
        const numbers = extractPhoneNumbers(rows);
        this.recipients.set(numbers);
        this.parsing.set(false);
        if (numbers.length === 0) {
          this.parseError.set(this.t('cmpNoRecipientsParsed'));
        }
      } catch {
        this.parsing.set(false);
        this.recipients.set([]);
        this.parseError.set(this.t('cmpParseError'));
      }
    };
    reader.onerror = () => {
      this.parsing.set(false);
      this.recipients.set([]);
      this.parseError.set(this.t('cmpParseError'));
    };
    reader.readAsArrayBuffer(file);
    // Let the user re-pick the same file (onchange won't fire otherwise).
    input.value = '';
  }

  clearRecipients(): void {
    this.recipients.set([]);
    this.fileName.set(null);
    this.parseError.set(null);
  }

  /** Generates and downloads a sample .xlsx showing the expected shape (a column of phone numbers). */
  downloadSampleFile(): void {
    const rows = [['phone'], ['201001234567'], ['201009998888'], ['201007776666']];
    const sheet = XLSX.utils.aoa_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, sheet, 'Recipients');
    XLSX.writeFile(workbook, 'waslx-recipients-sample.xlsx');
  }

  // ── Pick from existing contacts ──
  setAudienceMode(mode: 'upload' | 'contacts'): void {
    if (this.audienceMode() === mode) {
      return;
    }
    this.audienceMode.set(mode);
    // Reset the audience when switching so the two sources never mix.
    this.recipients.set([]);
    this.fileName.set(null);
    this.parseError.set(null);
    this.selectedContactIds.set([]);
    this.formError.set(null);
    if (mode === 'contacts') {
      this.loadContacts();
    }
  }

  loadContacts(): void {
    this.contactsLoading.set(true);
    this.api.getAudienceContacts(this.filterTagId(), this.filterDateFrom(), this.filterDateTo()).subscribe({
      next: (list: AudienceContact[]) => {
        this.contacts.set(list);
        // Drop any selection no longer in the filtered list, then re-sync the recipient phones.
        const visible = new Set(list.map((c) => c.id));
        this.selectedContactIds.update((ids) => ids.filter((id) => visible.has(id)));
        this.syncContactRecipients();
        this.contactsLoading.set(false);
      },
      error: () => {
        this.contacts.set([]);
        this.contactsLoading.set(false);
      },
    });
  }

  onFilterTagChange(value: string): void {
    this.filterTagId.set(value ? Number(value) : null);
    this.loadContacts();
  }

  onFilterDateFromChange(value: string): void {
    this.filterDateFrom.set(value || null);
    this.loadContacts();
  }

  onFilterDateToChange(value: string): void {
    this.filterDateTo.set(value || null);
    this.loadContacts();
  }

  isContactSelected(id: number): boolean {
    return this.selectedContactIds().includes(id);
  }

  toggleContact(id: number): void {
    this.selectedContactIds.update((ids) => (ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id]));
    this.syncContactRecipients();
    this.formError.set(null);
  }

  toggleSelectAll(): void {
    this.selectedContactIds.set(this.allVisibleSelected() ? [] : this.contacts().map((c) => c.id));
    this.syncContactRecipients();
    this.formError.set(null);
  }

  /** Mirrors the checked contacts into the recipient phone list (the source of truth for the send). */
  private syncContactRecipients(): void {
    const selected = new Set(this.selectedContactIds());
    this.recipients.set(this.contacts().filter((c) => selected.has(c.id)).map((c) => c.phone));
  }

  // ── Message step ──
  onTemplateChange(name: string): void {
    this.templateName.set(name || null);
    const tpl = this.templates().find((x) => x.name === name);
    if (tpl && tpl.bodyText) {
      this.messageBody.set(tpl.bodyText);
    }
  }

  onAccountChange(value: string): void {
    this.waAccountId.set(value ? Number(value) : null);
  }

  // ── Stepper navigation ──
  goToStep(index: number): void {
    if (index <= this.step()) {
      this.step.set(index);
      this.formError.set(null);
    }
  }

  next(): void {
    if (!this.validateStep(this.step())) {
      return;
    }
    this.formError.set(null);
    this.step.update((s) => Math.min(s + 1, this.steps.length - 1));
  }

  back(): void {
    this.formError.set(null);
    this.step.update((s) => Math.max(s - 1, 0));
  }

  private validateStep(index: number): boolean {
    if (index === 0) {
      if (!this.name().trim()) {
        this.formError.set(this.t('cmpNeedName'));
        return false;
      }
      if (this.audienceCount() <= 0) {
        this.formError.set(this.t('cmpNeedRecipients'));
        return false;
      }
      return true;
    }
    if (index === 1) {
      if (this.waAccountId() === null) {
        this.formError.set(this.t('cmpNeedChannel'));
        return false;
      }
      if (!this.templateName() || !this.messageBody().trim()) {
        this.formError.set(this.t('cmpNeedMessage'));
        return false;
      }
      return true;
    }
    if (index === 2) {
      if (this.scheduleMode() === 'later') {
        const when = new Date(this.scheduledAt());
        if (!this.scheduledAt() || Number.isNaN(when.getTime()) || when.getTime() <= Date.now()) {
          this.formError.set(this.t('cmpNeedSchedule'));
          return false;
        }
      }
      return true;
    }
    return true;
  }

  private buildRequest(): UpsertCampaignRequest {
    const scheduledAt =
      this.scheduleMode() === 'later' && this.scheduledAt()
        ? new Date(this.scheduledAt()).toISOString()
        : null;
    return {
      name: this.name().trim(),
      templateName: this.templateName(),
      messageBody: this.messageBody().trim() || null,
      waAccountId: this.waAccountId(),
      audienceFilter: this.currentFilter(),
      scheduledAt,
    };
  }

  // ── Persistence ──
  saveDraft(): void {
    if (!this.name().trim()) {
      this.formError.set(this.t('cmpNeedName'));
      this.step.set(0);
      return;
    }
    if (this.savingDraft() || this.launching()) {
      return;
    }
    this.savingDraft.set(true);
    this.persist().then(
      () => {
        this.savingDraft.set(false);
        this.toast.success(this.t('cmpDraftSavedToast'), '');
      },
      (err) => {
        this.savingDraft.set(false);
        this.formError.set(apiErrorMessage(err, this.t('cmpErrorToast')));
      },
    );
  }

  launch(): void {
    if (this.savingDraft() || this.launching()) {
      return;
    }
    // Final guard across all steps.
    for (let i = 0; i < 3; i++) {
      if (!this.validateStep(i)) {
        this.step.set(i);
        return;
      }
    }
    this.launching.set(true);
    this.persist().then(
      (id) => {
        this.api.launch(id).subscribe({
          next: () => {
            this.launching.set(false);
            this.toast.success(this.t('cmpLaunchedToast'), '');
            void this.router.navigate(['/app/campaigns', id]);
          },
          error: (err) => {
            this.launching.set(false);
            this.formError.set(apiErrorMessage(err, this.t('cmpErrorToast')));
          },
        });
      },
      (err) => {
        this.launching.set(false);
        this.formError.set(apiErrorMessage(err, this.t('cmpErrorToast')));
      },
    );
  }

  /** Create or update the campaign, returning the persisted id. */
  private persist(): Promise<number> {
    const request = this.buildRequest();
    const existing = this.persistedId();
    return new Promise((resolve, reject) => {
      const obs = existing
        ? this.api.updateCampaign(existing, request)
        : this.api.createCampaign(request);
      obs.subscribe({
        next: (saved) => {
          this.persistedId.set(saved.id);
          resolve(saved.id);
        },
        error: reject,
      });
    });
  }

  // ── Review helpers ──
  audienceSummary(): string {
    return this.fileName() ?? '';
  }

  scheduleSummary(): string {
    if (this.scheduleMode() === 'now') {
      return this.t('cmpSendNow');
    }
    const d = new Date(this.scheduledAt());
    return Number.isNaN(d.getTime())
      ? this.t('cmpScheduleLater')
      : d.toLocaleString(this.languageService.language() === 'ar' ? 'ar' : 'en', {
          dateStyle: 'medium',
          timeStyle: 'short',
        });
  }
}

/** Convert an ISO string to a `datetime-local`-compatible value (local time, no seconds). */
function toDateTimeLocal(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) {
    return '';
  }
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

/**
 * Pulls phone-like tokens out of every cell of a parsed sheet, normalises each to digits-only,
 * and de-duplicates. A phone is 8–15 digits after stripping non-digits (E.164 max is 15), so
 * headers, names and ids are naturally skipped. Works for CSV or Excel, one column or many,
 * with or without a header row.
 */
function extractPhoneNumbers(rows: unknown[][]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const row of rows) {
    if (!Array.isArray(row)) {
      continue;
    }
    for (const cell of row) {
      if (cell === null || cell === undefined) {
        continue;
      }
      const digits = String(cell).replace(/\D/g, '');
      if (digits.length >= 8 && digits.length <= 15 && !seen.has(digits)) {
        seen.add(digits);
        out.push(digits);
      }
    }
  }
  return out;
}
