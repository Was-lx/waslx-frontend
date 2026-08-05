import { Component, HostListener, OnDestroy, OnInit, computed, inject, signal } from '@angular/core';

import { LanguageService, type TranslationKey } from '../../../../core/services/language.service';
import { ToastService } from '../../../../core/services/toast.service';
import { CustomersApiService, type Contact, type ContactFilters } from '../../../../core/api/customers-api.service';
import { TagsApiService, type Tag } from '../../../../core/api/tags-api.service';
import { UsersApiService, type User } from '../../../../core/api/users-api.service';
import { IconComponent } from '../../../../shared/components/icon/icon.component';
import * as XLSX from 'xlsx';

const PAGE_SIZE = 25;
const SEARCH_DEBOUNCE_MS = 260;

@Component({
  selector: 'app-contacts-page',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './contacts.page.html',
  styleUrl: './contacts.page.css',
})
export class ContactsPageComponent implements OnInit, OnDestroy {
  private readonly api = inject(CustomersApiService);
  private readonly tagsApi = inject(TagsApiService);
  private readonly usersApi = inject(UsersApiService);
  readonly languageService = inject(LanguageService);
  private readonly toast = inject(ToastService);

  readonly t = (key: TranslationKey) => this.languageService.text(key);
  readonly direction = () => this.languageService.getDirection();

  // ── Data ──
  readonly contacts = signal<Contact[]>([]);
  readonly total = signal(0);
  readonly loading = signal(true);
  readonly exporting = signal(false);

  // ── Facets ──
  readonly tags = signal<Tag[]>([]);
  readonly users = signal<User[]>([]);
  readonly exportMenuOpen = signal(false);

  // ── Filters ──
  readonly search = signal('');
  readonly tagId = signal<number | null>(null);
  readonly assignedUserId = signal<string | null>(null);
  readonly dateFrom = signal<string | null>(null);
  readonly dateTo = signal<string | null>(null);

  // ── Pagination ──
  readonly page = signal(1);
  readonly pageSize = PAGE_SIZE;
  readonly totalPages = computed(() => Math.max(1, Math.ceil(this.total() / this.pageSize)));
  readonly rangeStart = computed(() => (this.total() === 0 ? 0 : (this.page() - 1) * this.pageSize + 1));
  readonly rangeEnd = computed(() => Math.min(this.page() * this.pageSize, this.total()));

  readonly hasFilters = computed(
    () =>
      !!this.search().trim() ||
      this.tagId() !== null ||
      this.assignedUserId() !== null ||
      !!this.dateFrom() ||
      !!this.dateTo(),
  );

  private searchTimer: ReturnType<typeof setTimeout> | null = null;

  ngOnInit(): void {
    this.loadTags();
    this.loadUsers();
    this.load();
  }

  private loadUsers(): void {
    this.usersApi.getUsers().subscribe({
      next: (users) => this.users.set(users.filter((u) => u.isActive)),
      error: () => this.users.set([]),
    });
  }

  ngOnDestroy(): void {
    if (this.searchTimer) {
      clearTimeout(this.searchTimer);
    }
  }

  private loadTags(): void {
    this.tagsApi.getTags().subscribe({
      next: (tags) => this.tags.set(tags),
      error: () => this.tags.set([]),
    });
  }

  private currentFilters(): ContactFilters {
    return {
      search: this.search().trim() || null,
      tagId: this.tagId(),
      assignedUserId: this.assignedUserId(),
      dateFrom: this.dateFrom(),
      dateTo: this.dateTo(),
    };
  }

  load(): void {
    this.loading.set(true);
    this.api.list(this.currentFilters(), this.page(), this.pageSize).subscribe({
      next: (p) => {
        this.contacts.set(p.items);
        this.total.set(p.total);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.toast.error(this.t('contactsLoadErrorTitle'), this.t('contactsLoadErrorMsg'));
      },
    });
  }

  private reload(): void {
    this.page.set(1);
    this.load();
  }

  // ── Filter handlers ──
  onSearchInput(value: string): void {
    this.search.set(value);
    if (this.searchTimer) {
      clearTimeout(this.searchTimer);
    }
    this.searchTimer = setTimeout(() => this.reload(), SEARCH_DEBOUNCE_MS);
  }

  onTagChange(value: string): void {
    this.tagId.set(value ? Number(value) : null);
    this.reload();
  }

  onAssigneeChange(value: string): void {
    this.assignedUserId.set(value || null);
    this.reload();
  }

  onDateFromChange(value: string): void {
    this.dateFrom.set(value || null);
    this.reload();
  }

  onDateToChange(value: string): void {
    this.dateTo.set(value || null);
    this.reload();
  }

  clearFilters(): void {
    this.search.set('');
    this.tagId.set(null);
    this.assignedUserId.set(null);
    this.dateFrom.set(null);
    this.dateTo.set(null);
    this.reload();
  }

  // ── Pagination ──
  prevPage(): void {
    if (this.page() > 1) {
      this.page.update((p) => p - 1);
      this.load();
    }
  }

  nextPage(): void {
    if (this.page() < this.totalPages()) {
      this.page.update((p) => p + 1);
      this.load();
    }
  }

  // ── Export (client-side CSV / Excel via SheetJS) ──
  toggleExportMenu(event: Event): void {
    event.stopPropagation();
    this.exportMenuOpen.update((v) => !v);
  }

  /** Keep clicks inside the export control from bubbling to the document-close handler. */
  stop(event: Event): void {
    event.stopPropagation();
  }

  /** Any click outside the export control closes the menu. */
  @HostListener('document:click')
  closeExportMenu(): void {
    if (this.exportMenuOpen()) {
      this.exportMenuOpen.set(false);
    }
  }

  exportContacts(format: 'csv' | 'xlsx'): void {
    this.exportMenuOpen.set(false);
    if (this.exporting()) {
      return;
    }
    this.exporting.set(true);
    // Pull the full filtered set (not just the current page) for the file.
    this.api.list(this.currentFilters(), 1, 2000).subscribe({
      next: (p) => {
        const header = [
          this.t('contactsColName'),
          this.t('contactsColPhone'),
          this.t('contactsColConv'),
          this.t('contactsColLast'),
          this.t('contactsColAssigned'),
          this.t('contactsColTags'),
        ];
        const rows = p.items.map((c) => [
          c.name || c.phone,
          c.phone,
          c.conversationCount,
          this.formatDate(c.lastContactAt),
          c.assignedUserName ?? '',
          c.tags.join(', '),
        ]);
        const sheet = XLSX.utils.aoa_to_sheet([header, ...rows]);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, sheet, 'Contacts');
        XLSX.writeFile(
          workbook,
          format === 'xlsx' ? 'waslx-contacts.xlsx' : 'waslx-contacts.csv',
          format === 'csv' ? { bookType: 'csv' } : undefined,
        );
        this.exporting.set(false);
      },
      error: () => {
        this.exporting.set(false);
        this.toast.error(this.t('contactsExportErrorTitle'), this.t('contactsExportErrorMsg'));
      },
    });
  }

  // ── Presentation helpers ──
  initial(name: string, phone: string): string {
    const source = (name || phone || '?').trim();
    return source.charAt(0).toUpperCase();
  }

  formatDate(iso: string | null): string {
    if (!iso) {
      return '—';
    }
    const d = new Date(iso);
    return Number.isNaN(d.getTime())
      ? '—'
      : d.toLocaleDateString(this.languageService.language() === 'ar' ? 'ar' : 'en', {
          dateStyle: 'medium',
        });
  }
}
