import { Component, OnDestroy, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { type TranslationKey, LanguageService } from '../../../../core/services/language.service';
import { ToastService } from '../../../../core/services/toast.service';
import {
  Faq,
  KnowledgeApiService,
  KnowledgeDocument,
  UpsertFaqRequest,
} from '../../../../core/api/knowledge-api.service';
import { apiErrorMessage } from '../../../../core/utils/api-error';
import { IconComponent } from '../../../../shared/components/icon/icon.component';

type Tab = 'faqs' | 'documents' | 'websites';

const IN_FLIGHT_STATUSES = new Set(['Pending', 'Processing']);
const POLL_INTERVAL_MS = 3000;

@Component({
  selector: 'app-knowledge-base-page',
  standalone: true,
  imports: [FormsModule, IconComponent],
  templateUrl: './knowledge-base.page.html',
  styleUrl: './knowledge-base.page.css',
})
export class KnowledgeBasePageComponent implements OnInit, OnDestroy {
  private readonly languageService = inject(LanguageService);
  private readonly api = inject(KnowledgeApiService);
  private readonly toast = inject(ToastService);

  readonly t = (key: TranslationKey) => this.languageService.text(key);
  readonly direction = () => this.languageService.getDirection();

  readonly tab = signal<Tab>('faqs');

  // ── FAQs ──
  readonly faqs = signal<Faq[]>([]);
  readonly faqsLoading = signal(true);
  readonly faqsError = signal(false);
  readonly faqSearch = signal('');
  readonly filteredFaqs = computed(() => {
    const term = this.faqSearch().trim().toLowerCase();
    if (!term) return this.faqs();
    return this.faqs().filter(
      (f) => f.question.toLowerCase().includes(term) || f.answer.toLowerCase().includes(term)
    );
  });

  readonly faqEditorOpen = signal(false);
  readonly editingFaq = signal<Faq | null>(null);
  readonly faqSaving = signal(false);
  readonly faqFormError = signal<string | null>(null);
  faqForm: UpsertFaqRequest = { question: '', answer: '', language: 'English', isActive: true };

  readonly pendingDeleteFaq = signal<Faq | null>(null);
  readonly deletingFaq = signal(false);

  // ── Documents ──
  readonly documents = signal<KnowledgeDocument[]>([]);
  readonly documentsLoading = signal(true);
  readonly documentUploadOpen = signal(false);
  readonly documentUploading = signal(false);
  readonly selectedFile = signal<File | null>(null);
  docTitle = '';
  docLanguage = 'English';
  readonly pendingDeleteDocument = signal<KnowledgeDocument | null>(null);
  readonly deletingDocument = signal(false);

  // ── Websites ──
  readonly websites = signal<KnowledgeDocument[]>([]);
  readonly websitesLoading = signal(true);
  readonly websiteAddOpen = signal(false);
  readonly websiteAdding = signal(false);
  readonly websiteFormError = signal<string | null>(null);
  webUrl = '';
  webTitle = '';
  webLanguage = 'English';
  readonly pendingDeleteWebsite = signal<KnowledgeDocument | null>(null);
  readonly deletingWebsite = signal(false);

  private faqsPollTimer: ReturnType<typeof setTimeout> | null = null;
  private documentsPollTimer: ReturnType<typeof setTimeout> | null = null;
  private websitesPollTimer: ReturnType<typeof setTimeout> | null = null;

  ngOnInit(): void {
    this.loadFaqs();
    this.loadDocuments();
    this.loadWebsites();
  }

  ngOnDestroy(): void {
    if (this.faqsPollTimer) clearTimeout(this.faqsPollTimer);
    if (this.documentsPollTimer) clearTimeout(this.documentsPollTimer);
    if (this.websitesPollTimer) clearTimeout(this.websitesPollTimer);
  }

  selectTab(tab: Tab): void {
    this.tab.set(tab);
  }

  // ───────────────────────────────────────────── FAQs ─────────────────────────

  loadFaqs(): void {
    this.faqsLoading.set(true);
    this.faqsError.set(false);
    this.api.getFaqs().subscribe({
      next: (page) => {
        this.faqs.set(page.items);
        this.faqsLoading.set(false);
        this.scheduleFaqsPoll(page.items.some((f) => IN_FLIGHT_STATUSES.has(f.indexStatus ?? '')));
      },
      error: () => {
        this.faqsError.set(true);
        this.faqsLoading.set(false);
      },
    });
  }

  private scheduleFaqsPoll(needed: boolean): void {
    if (this.faqsPollTimer) clearTimeout(this.faqsPollTimer);
    this.faqsPollTimer = needed ? setTimeout(() => this.loadFaqs(), POLL_INTERVAL_MS) : null;
  }

  openCreateFaq(): void {
    this.editingFaq.set(null);
    this.faqForm = { question: '', answer: '', language: 'English', isActive: true };
    this.faqFormError.set(null);
    this.faqEditorOpen.set(true);
  }

  openEditFaq(faq: Faq): void {
    this.editingFaq.set(faq);
    this.faqForm = { question: faq.question, answer: faq.answer, language: faq.language, isActive: faq.isActive };
    this.faqFormError.set(null);
    this.faqEditorOpen.set(true);
  }

  closeFaqEditor(): void {
    if (this.faqSaving()) return;
    this.faqEditorOpen.set(false);
  }

  saveFaq(): void {
    const question = this.faqForm.question.trim();
    const answer = this.faqForm.answer.trim();
    if (!question || !answer) {
      this.faqFormError.set(this.t('kbFaqRequired'));
      return;
    }

    const payload: UpsertFaqRequest = { ...this.faqForm, question, answer };
    this.faqSaving.set(true);
    const editing = this.editingFaq();
    const request$ = editing ? this.api.updateFaq(editing.id, payload) : this.api.createFaq(payload);

    request$.subscribe({
      next: () => {
        this.faqSaving.set(false);
        this.faqEditorOpen.set(false);
        this.toast.success(editing ? this.t('kbFaqUpdatedToast') : this.t('kbFaqCreatedToast'), '');
        this.loadFaqs();
      },
      error: (err) => {
        this.faqSaving.set(false);
        this.toast.error(this.t('kbErrorToast'), apiErrorMessage(err, this.t('kbErrorToast')));
      },
    });
  }

  requestDeleteFaq(faq: Faq): void {
    this.pendingDeleteFaq.set(faq);
  }

  cancelDeleteFaq(): void {
    if (this.deletingFaq()) return;
    this.pendingDeleteFaq.set(null);
  }

  confirmDeleteFaq(): void {
    const faq = this.pendingDeleteFaq();
    if (!faq) return;
    this.deletingFaq.set(true);
    this.api.deleteFaq(faq.id).subscribe({
      next: () => {
        this.faqs.update((list) => list.filter((f) => f.id !== faq.id));
        this.deletingFaq.set(false);
        this.pendingDeleteFaq.set(null);
        this.toast.success(this.t('kbFaqDeletedToast'), '');
      },
      error: (err) => {
        this.deletingFaq.set(false);
        this.pendingDeleteFaq.set(null);
        this.toast.error(this.t('kbErrorToast'), apiErrorMessage(err, this.t('kbErrorToast')));
      },
    });
  }

  // ───────────────────────────────────────────── Documents ────────────────────

  loadDocuments(): void {
    this.documentsLoading.set(true);
    this.api.getDocuments('Document').subscribe({
      next: (page) => {
        this.documents.set(page.items);
        this.documentsLoading.set(false);
        this.scheduleDocumentsPoll(page.items.some((d) => IN_FLIGHT_STATUSES.has(d.status)));
      },
      error: () => this.documentsLoading.set(false),
    });
  }

  private scheduleDocumentsPoll(needed: boolean): void {
    if (this.documentsPollTimer) clearTimeout(this.documentsPollTimer);
    this.documentsPollTimer = needed ? setTimeout(() => this.loadDocuments(), POLL_INTERVAL_MS) : null;
  }

  openUploadDocument(): void {
    this.selectedFile.set(null);
    this.docTitle = '';
    this.docLanguage = 'English';
    this.documentUploadOpen.set(true);
  }

  closeUploadDocument(): void {
    if (this.documentUploading()) return;
    this.documentUploadOpen.set(false);
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.selectedFile.set(input.files?.[0] ?? null);
  }

  uploadDocument(): void {
    const file = this.selectedFile();
    if (!file) return;

    this.documentUploading.set(true);
    this.api.uploadDocument(file, this.docTitle.trim(), this.docLanguage).subscribe({
      next: () => {
        this.documentUploading.set(false);
        this.documentUploadOpen.set(false);
        this.toast.success(this.t('kbDocUploadedToast'), '');
        this.loadDocuments();
      },
      error: (err) => {
        this.documentUploading.set(false);
        this.toast.error(this.t('kbErrorToast'), apiErrorMessage(err, this.t('kbErrorToast')));
      },
    });
  }

  requestDeleteDocument(doc: KnowledgeDocument): void {
    this.pendingDeleteDocument.set(doc);
  }

  cancelDeleteDocument(): void {
    if (this.deletingDocument()) return;
    this.pendingDeleteDocument.set(null);
  }

  confirmDeleteDocument(): void {
    const doc = this.pendingDeleteDocument();
    if (!doc) return;
    this.deletingDocument.set(true);
    this.api.deleteDocument(doc.id).subscribe({
      next: () => {
        this.documents.update((list) => list.filter((d) => d.id !== doc.id));
        this.deletingDocument.set(false);
        this.pendingDeleteDocument.set(null);
        this.toast.success(this.t('kbDocDeletedToast'), '');
      },
      error: (err) => {
        this.deletingDocument.set(false);
        this.pendingDeleteDocument.set(null);
        this.toast.error(this.t('kbErrorToast'), apiErrorMessage(err, this.t('kbErrorToast')));
      },
    });
  }

  reindexDocument(doc: KnowledgeDocument): void {
    this.api.reindexDocument(doc.id).subscribe({
      next: () => {
        this.toast.success(this.t('kbReindexToast'), '');
        this.loadDocuments();
      },
      error: (err) => this.toast.error(this.t('kbErrorToast'), apiErrorMessage(err, this.t('kbErrorToast'))),
    });
  }

  // ───────────────────────────────────────────── Websites ─────────────────────

  loadWebsites(): void {
    this.websitesLoading.set(true);
    this.api.getDocuments('Website').subscribe({
      next: (page) => {
        this.websites.set(page.items);
        this.websitesLoading.set(false);
        this.scheduleWebsitesPoll(page.items.some((d) => IN_FLIGHT_STATUSES.has(d.status)));
      },
      error: () => this.websitesLoading.set(false),
    });
  }

  private scheduleWebsitesPoll(needed: boolean): void {
    if (this.websitesPollTimer) clearTimeout(this.websitesPollTimer);
    this.websitesPollTimer = needed ? setTimeout(() => this.loadWebsites(), POLL_INTERVAL_MS) : null;
  }

  openAddWebsite(): void {
    this.webUrl = '';
    this.webTitle = '';
    this.webLanguage = 'English';
    this.websiteFormError.set(null);
    this.websiteAddOpen.set(true);
  }

  closeAddWebsite(): void {
    if (this.websiteAdding()) return;
    this.websiteAddOpen.set(false);
  }

  addWebsite(): void {
    const url = this.webUrl.trim();
    if (!/^https?:\/\/.+/i.test(url)) {
      this.websiteFormError.set(this.t('kbWebUrlInvalid'));
      return;
    }

    this.websiteAdding.set(true);
    this.api.addWebsite(url, this.webTitle.trim(), this.webLanguage).subscribe({
      next: () => {
        this.websiteAdding.set(false);
        this.websiteAddOpen.set(false);
        this.toast.success(this.t('kbWebAddedToast'), '');
        this.loadWebsites();
      },
      error: (err) => {
        this.websiteAdding.set(false);
        this.toast.error(this.t('kbErrorToast'), apiErrorMessage(err, this.t('kbErrorToast')));
      },
    });
  }

  requestDeleteWebsite(doc: KnowledgeDocument): void {
    this.pendingDeleteWebsite.set(doc);
  }

  cancelDeleteWebsite(): void {
    if (this.deletingWebsite()) return;
    this.pendingDeleteWebsite.set(null);
  }

  confirmDeleteWebsite(): void {
    const doc = this.pendingDeleteWebsite();
    if (!doc) return;
    this.deletingWebsite.set(true);
    this.api.deleteDocument(doc.id).subscribe({
      next: () => {
        this.websites.update((list) => list.filter((d) => d.id !== doc.id));
        this.deletingWebsite.set(false);
        this.pendingDeleteWebsite.set(null);
        this.toast.success(this.t('kbWebDeletedToast'), '');
      },
      error: (err) => {
        this.deletingWebsite.set(false);
        this.pendingDeleteWebsite.set(null);
        this.toast.error(this.t('kbErrorToast'), apiErrorMessage(err, this.t('kbErrorToast')));
      },
    });
  }

  reindexWebsite(doc: KnowledgeDocument): void {
    this.api.reindexDocument(doc.id).subscribe({
      next: () => {
        this.toast.success(this.t('kbReindexToast'), '');
        this.loadWebsites();
      },
      error: (err) => this.toast.error(this.t('kbErrorToast'), apiErrorMessage(err, this.t('kbErrorToast'))),
    });
  }

  // ───────────────────────────────────────────── Shared helpers ───────────────

  statusPillClass(status: string): string {
    switch (status) {
      case 'Indexed': return 'ui-pill--success';
      case 'Processing': return 'ui-pill--info';
      case 'Failed': return 'ui-pill--danger';
      default: return 'ui-pill--warning';
    }
  }

  statusLabel(status: string): string {
    switch (status) {
      case 'Indexed': return this.t('kbStatusIndexed');
      case 'Processing': return this.t('kbStatusProcessing');
      case 'Failed': return this.t('kbStatusFailed');
      default: return this.t('kbStatusPending');
    }
  }
}
