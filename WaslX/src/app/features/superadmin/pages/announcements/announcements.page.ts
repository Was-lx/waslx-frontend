import { DatePipe } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';

import { type TranslationKey, LanguageService } from '../../../../core/services/language.service';
import { PlansApiService } from '../../../../core/api/plans-api.service';
import { SuperAdminApiService } from '../../../../core/api/superadmin-api.service';
import { ToastService } from '../../../../core/services/toast.service';
import type {
  Announcement,
  AnnouncementAudience,
  AnnouncementSeverity,
  CreateAnnouncement,
  Plan
} from '../../../../core/models/platform.models';
import { IconComponent } from '../../../../shared/components/icon/icon.component';

const SEVERITIES: AnnouncementSeverity[] = ['Info', 'Warning', 'Critical'];
const AUDIENCES: AnnouncementAudience[] = ['All', 'Plan', 'SpecificTenants'];

/**
 * FE-6.9 · Announcements composer. A form (title, body, severity, audience,
 * optional schedule) with a LIVE preview reusing the campaign preview aesthetic,
 * plus a list of past announcements with publish + delete actions.
 */
@Component({
  selector: 'app-superadmin-announcements-page',
  standalone: true,
  imports: [ReactiveFormsModule, DatePipe, IconComponent],
  templateUrl: './announcements.page.html',
  styleUrl: './announcements.page.css'
})
export class SuperAdminAnnouncementsPageComponent implements OnInit {
  private readonly languageService = inject(LanguageService);
  private readonly api = inject(SuperAdminApiService);
  private readonly plansApi = inject(PlansApiService);
  private readonly fb = inject(FormBuilder);
  private readonly toast = inject(ToastService);

  readonly t = (key: TranslationKey) => this.languageService.text(key);
  readonly direction = () => this.languageService.getDirection();

  readonly severities = SEVERITIES;
  readonly audiences = AUDIENCES;

  readonly announcements = signal<Announcement[]>([]);
  readonly plans = signal<Plan[]>([]);
  readonly loading = signal(true);
  readonly error = signal(false);
  readonly saving = signal(false);
  readonly submitted = signal(false);
  readonly publishingId = signal<number | null>(null);

  // Confirm (delete)
  readonly confirmDelete = signal<Announcement | null>(null);
  readonly deleting = signal(false);

  readonly form = this.fb.group({
    title: ['', [Validators.required, Validators.maxLength(120)]],
    body: ['', [Validators.required, Validators.maxLength(2000)]],
    severity: ['Info' as AnnouncementSeverity, Validators.required],
    audience: ['All' as AnnouncementAudience, Validators.required],
    planId: [null as number | null],
    tenantIds: [''],
    scheduledAt: ['']
  });

  // Reactive mirror of the form so the preview updates live.
  private readonly formValue = toSignal(this.form.valueChanges, { initialValue: this.form.getRawValue() });

  readonly previewTitle = computed(() => (this.formValue().title ?? '').trim());
  readonly previewBody = computed(() => (this.formValue().body ?? '').trim());
  readonly previewSeverity = computed<AnnouncementSeverity>(() => this.formValue().severity ?? 'Info');
  readonly previewAudience = computed<AnnouncementAudience>(() => this.formValue().audience ?? 'All');
  readonly hasPreview = computed(() => this.previewTitle() !== '' || this.previewBody() !== '');

  ngOnInit(): void {
    this.loadAnnouncements();
    this.plansApi.getAll().subscribe({
      next: (data) => this.plans.set(data ?? []),
      error: () => this.plans.set([])
    });
  }

  loadAnnouncements(): void {
    this.loading.set(true);
    this.error.set(false);
    this.api.getAnnouncements().subscribe({
      next: (data) => {
        this.announcements.set(data ?? []);
        this.loading.set(false);
      },
      error: () => {
        this.error.set(true);
        this.loading.set(false);
      }
    });
  }

  onAudienceChange(value: string): void {
    this.form.controls.audience.setValue(value as AnnouncementAudience);
  }

  onSeverityChange(value: AnnouncementSeverity): void {
    this.form.controls.severity.setValue(value);
  }

  submit(): void {
    this.submitted.set(true);
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const raw = this.form.getRawValue();
    const audience = (raw.audience ?? 'All') as AnnouncementAudience;
    const input: CreateAnnouncement = {
      title: (raw.title ?? '').trim(),
      body: (raw.body ?? '').trim(),
      severity: (raw.severity ?? 'Info') as AnnouncementSeverity,
      audience,
      planId: audience === 'Plan' ? (raw.planId != null ? Number(raw.planId) : null) : null,
      tenantIds: audience === 'SpecificTenants' ? this.parseTenantIds(raw.tenantIds) : null,
      scheduledAt: this.nullable(raw.scheduledAt)
    };

    this.saving.set(true);
    this.api.createAnnouncement(input).subscribe({
      next: (created) => {
        this.saving.set(false);
        this.submitted.set(false);
        this.announcements.update((list) => [created, ...list]);
        this.form.reset({ title: '', body: '', severity: 'Info', audience: 'All', planId: null, tenantIds: '', scheduledAt: '' });
        this.toast.success(this.t('annCreateToast'), created.title);
      },
      error: () => {
        this.saving.set(false);
        this.toast.error(this.t('annErrorTitle'), this.t('annErrorBody'));
      }
    });
  }

  publish(a: Announcement): void {
    this.publishingId.set(a.id);
    this.api.publishAnnouncement(a.id).subscribe({
      next: (updated) => {
        this.publishingId.set(null);
        this.announcements.update((list) => list.map((x) => (x.id === a.id ? updated : x)));
        this.toast.success(this.t('annPublishToast'), a.title);
      },
      error: () => {
        this.publishingId.set(null);
        this.toast.error(this.t('annErrorTitle'), this.t('annErrorBody'));
      }
    });
  }

  askDelete(a: Announcement): void {
    this.confirmDelete.set(a);
  }

  cancelDelete(): void {
    if (this.deleting()) {
      return;
    }
    this.confirmDelete.set(null);
  }

  doDelete(): void {
    const a = this.confirmDelete();
    if (!a) {
      return;
    }
    this.deleting.set(true);
    this.api.deleteAnnouncement(a.id).subscribe({
      next: () => {
        this.deleting.set(false);
        this.confirmDelete.set(null);
        this.announcements.update((list) => list.filter((x) => x.id !== a.id));
        this.toast.success(this.t('annDeleteToast'), a.title);
      },
      error: () => {
        this.deleting.set(false);
        this.toast.error(this.t('annErrorTitle'), this.t('annErrorBody'));
      }
    });
  }

  // ── Presentation ──
  severityLabel(sev: AnnouncementSeverity): string {
    const map: Record<AnnouncementSeverity, TranslationKey> = {
      Info: 'annSevInfo',
      Warning: 'annSevWarning',
      Critical: 'annSevCritical'
    };
    return this.t(map[sev]);
  }

  /** Maps severity onto the .ui-banner variant used in the preview. */
  severityVariant(sev: AnnouncementSeverity): string {
    switch (sev) {
      case 'Warning':
        return 'ui-banner--warning';
      case 'Critical':
        return 'ui-banner--critical';
      default:
        return 'ui-banner--info';
    }
  }

  severityIcon(sev: AnnouncementSeverity): string {
    switch (sev) {
      case 'Warning':
        return 'bell';
      case 'Critical':
        return 'zap';
      default:
        return 'megaphone';
    }
  }

  audienceLabel(a: AnnouncementAudience): string {
    const map: Record<AnnouncementAudience, TranslationKey> = {
      All: 'annAudAll',
      Plan: 'annAudPlan',
      SpecificTenants: 'annAudTenants'
    };
    return this.t(map[a]);
  }

  audienceSummary(a: Announcement): string {
    if (a.audience === 'Plan' && a.planName) {
      return `${this.audienceLabel('Plan')} · ${a.planName}`;
    }
    if (a.audience === 'SpecificTenants') {
      const n = a.tenantIds?.length ?? 0;
      return `${this.audienceLabel('SpecificTenants')} · ${n}`;
    }
    return this.audienceLabel(a.audience);
  }

  statusLabel(status: string): string {
    const map: Record<string, TranslationKey> = {
      Draft: 'annStatusDraft',
      Scheduled: 'annStatusScheduled',
      Published: 'annStatusPublished',
      Archived: 'annStatusArchived'
    };
    return map[status] ? this.t(map[status]) : status;
  }

  statusPillClass(status: string): string {
    switch (status) {
      case 'Published':
        return 'ui-pill ui-pill--success';
      case 'Scheduled':
        return 'ui-pill ui-pill--info';
      case 'Archived':
        return 'ui-pill';
      default:
        return 'ui-pill ui-pill--warning';
    }
  }

  canPublish(a: Announcement): boolean {
    return a.status === 'Draft' || a.status === 'Scheduled';
  }

  reachLabel(a: Announcement): string | null {
    if (a.reach == null) {
      return null;
    }
    return this.t('annReach').replace('{n}', String(a.reach));
  }

  invalid(control: string): boolean {
    const c = this.form.get(control);
    return !!c && c.invalid && (c.touched || this.submitted());
  }

  private parseTenantIds(value: string | null | undefined): number[] | null {
    const ids = (value ?? '')
      .split(/[,\s]+/)
      .map((s) => Number(s.trim()))
      .filter((n) => Number.isFinite(n) && n > 0);
    return ids.length ? ids : null;
  }

  private nullable(value: string | null | undefined): string | null {
    const v = (value ?? '').trim();
    return v.length ? v : null;
  }
}
