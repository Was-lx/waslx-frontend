import { Component, HostListener, OnInit, computed, inject, signal } from '@angular/core';

import { type TranslationKey, LanguageService } from '../../../../core/services/language.service';
import {
  AuditApiService,
  auditVerb,
  type AuditLog,
  type AuditPage,
  type AuditVerb,
  type AuditAction,
} from '../../../../core/api/audit-api.service';
import { UsersApiService, type User } from '../../../../core/api/users-api.service';
import { IconComponent } from '../../../../shared/components/icon/icon.component';

type RangePreset = '7d' | '30d' | '90d' | 'all' | 'custom';

/** Entity types the tenant audit trail emits — drives the entity filter select. */
const ENTITY_TYPES = [
  'Conversation',
  'Message',
  'Assignment',
  'User',
  'Campaign',
  'Group',
  'Stage',
  'Tag',
  'WhatsAppAccount',
] as const;

@Component({
  selector: 'app-audit-log-page',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './audit-log.page.html',
  styleUrl: './audit-log.page.css',
})
export class AuditLogPageComponent implements OnInit {
  private readonly languageService = inject(LanguageService);
  private readonly api = inject(AuditApiService);
  private readonly usersApi = inject(UsersApiService);

  readonly t = (key: TranslationKey) => this.languageService.text(key);
  readonly direction = () => this.languageService.getDirection();

  // ── Data ──
  readonly page = signal<AuditPage>({ items: [], page: 1, pageSize: 25, total: 0 });
  readonly loading = signal(true);
  readonly refreshing = signal(false);
  readonly error = signal(false);

  readonly users = signal<User[]>([]);
  readonly entityTypes = ENTITY_TYPES;

  readonly skeletonRows = Array.from({ length: 8 });

  // ── Filters ──
  readonly actorId = signal<string>('');
  readonly action = signal<AuditAction | ''>('');
  readonly entityType = signal<string>('');
  readonly search = signal<string>('');

  readonly preset = signal<RangePreset>('30d');
  readonly customFrom = signal<string>(isoDaysAgo(29));
  readonly customTo = signal<string>(isoToday());
  readonly rangePopoverOpen = signal(false);

  readonly pageIndex = signal(1);
  readonly pageSize = signal(25);

  private searchDebounce: ReturnType<typeof setTimeout> | null = null;

  // ── Detail drawer ──
  readonly selected = signal<AuditLog | null>(null);

  readonly presets: readonly { value: RangePreset; key: TranslationKey }[] = [
    { value: '7d', key: 'rptRange7d' },
    { value: '30d', key: 'rptRange30d' },
    { value: '90d', key: 'auditRange90d' },
    { value: 'all', key: 'auditRangeAll' },
    { value: 'custom', key: 'rptRangeCustom' },
  ];

  private range(): { from: string | null; to: string | null } {
    switch (this.preset()) {
      case '7d':
        return { from: isoDaysAgo(6), to: isoToday() };
      case '90d':
        return { from: isoDaysAgo(89), to: isoToday() };
      case 'all':
        return { from: null, to: null };
      case 'custom':
        return { from: this.customFrom(), to: this.customTo() };
      case '30d':
      default:
        return { from: isoDaysAgo(29), to: isoToday() };
    }
  }

  // ── Derived ──
  readonly hasActiveFilters = computed(
    () =>
      this.actorId() !== '' ||
      this.action() !== '' ||
      this.entityType() !== '' ||
      this.search().trim() !== '' ||
      this.preset() !== '30d',
  );

  readonly totalPages = computed(() =>
    Math.max(1, Math.ceil(this.page().total / Math.max(1, this.page().pageSize))),
  );

  readonly rangeStart = computed(() =>
    this.page().total === 0 ? 0 : (this.page().page - 1) * this.page().pageSize + 1,
  );
  readonly rangeEnd = computed(() =>
    Math.min(this.page().page * this.page().pageSize, this.page().total),
  );

  ngOnInit(): void {
    this.usersApi.getUsers().subscribe({
      next: (list) => this.users.set(list),
      error: () => {},
    });
    this.load(true);
  }

  // ── Loading ──
  load(initial = false): void {
    if (initial) {
      this.loading.set(true);
    } else {
      this.refreshing.set(true);
    }
    this.error.set(false);
    const r = this.range();
    this.api
      .getAuditLogs({
        actorUserId: this.actorId() || null,
        action: this.action() || null,
        entityType: this.entityType() || null,
        from: r.from,
        to: r.to,
        search: this.search(),
        page: this.pageIndex(),
        pageSize: this.pageSize(),
      })
      .subscribe({
        next: (p) => {
          this.page.set(p);
          this.loading.set(false);
          this.refreshing.set(false);
        },
        error: () => {
          this.loading.set(false);
          this.refreshing.set(false);
          this.error.set(true);
        },
      });
  }

  /** Any filter change resets to the first page then reloads. */
  private reloadFromFirstPage(): void {
    this.pageIndex.set(1);
    this.load();
  }

  // ── Filter actions ──
  onActorChange(value: string): void {
    this.actorId.set(value);
    this.reloadFromFirstPage();
  }

  onActionChange(value: string): void {
    this.action.set((value as AuditAction) || '');
    this.reloadFromFirstPage();
  }

  onEntityChange(value: string): void {
    this.entityType.set(value);
    this.reloadFromFirstPage();
  }

  onSearchChange(value: string): void {
    this.search.set(value);
    if (this.searchDebounce) {
      clearTimeout(this.searchDebounce);
    }
    this.searchDebounce = setTimeout(() => this.reloadFromFirstPage(), 300);
  }

  selectPreset(value: RangePreset): void {
    if (value === 'custom') {
      this.preset.set('custom');
      this.rangePopoverOpen.set(true);
      return;
    }
    this.rangePopoverOpen.set(false);
    if (this.preset() === value) {
      return;
    }
    this.preset.set(value);
    this.reloadFromFirstPage();
  }

  applyCustomRange(): void {
    this.rangePopoverOpen.set(false);
    this.reloadFromFirstPage();
  }

  setCustomFrom(value: string): void {
    this.customFrom.set(value);
  }
  setCustomTo(value: string): void {
    this.customTo.set(value);
  }

  clearFilters(): void {
    this.actorId.set('');
    this.action.set('');
    this.entityType.set('');
    this.search.set('');
    this.preset.set('30d');
    this.rangePopoverOpen.set(false);
    this.reloadFromFirstPage();
  }

  // ── Pagination ──
  prevPage(): void {
    if (this.page().page <= 1) {
      return;
    }
    this.pageIndex.set(this.page().page - 1);
    this.load();
  }

  nextPage(): void {
    if (this.page().page >= this.totalPages()) {
      return;
    }
    this.pageIndex.set(this.page().page + 1);
    this.load();
  }

  // ── Drawer ──
  openDetail(log: AuditLog): void {
    this.selected.set(log);
  }

  closeDetail(): void {
    this.selected.set(null);
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.selected()) {
      this.closeDetail();
    } else if (this.rangePopoverOpen()) {
      this.rangePopoverOpen.set(false);
    }
  }

  @HostListener('document:click')
  closeOverlays(): void {
    this.rangePopoverOpen.set(false);
  }

  stop(event: Event): void {
    event.stopPropagation();
  }

  toggleRangePopover(event: Event): void {
    event.stopPropagation();
    this.rangePopoverOpen.update((v) => !v);
  }

  // ── Presentation ──
  verb(action: AuditAction): AuditVerb {
    return auditVerb(action);
  }

  pillClass(action: AuditAction): string {
    switch (auditVerb(action)) {
      case 'create':
        return 'ui-pill ui-pill--success';
      case 'update':
        return 'ui-pill ui-pill--info';
      case 'delete':
        return 'ui-pill ui-pill--danger';
      default:
        return 'ui-pill';
    }
  }

  actionLabel(action: AuditAction): string {
    const map: Record<string, TranslationKey> = {
      Created: 'auditActionCreated',
      Updated: 'auditActionUpdated',
      Deleted: 'auditActionDeleted',
      StatusChanged: 'auditActionStatusChanged',
      Login: 'auditActionLogin',
      Logout: 'auditActionLogout',
      Impersonated: 'auditActionImpersonated',
    };
    const key = map[action];
    return key ? this.t(key) : action;
  }

  actorName(log: AuditLog): string {
    return log.actorName?.trim() || this.t('auditSystemActor');
  }

  actorInitials(log: AuditLog): string {
    const name = log.actorName?.trim();
    if (!name) {
      return '·';
    }
    const parts = name.split(/\s+/).filter(Boolean);
    const first = parts[0]?.[0] ?? '';
    const second = parts.length > 1 ? parts[parts.length - 1][0] : '';
    return (first + second).toUpperCase() || '·';
  }

  entityLabel(log: AuditLog): string {
    if (!log.entityType) {
      return '—';
    }
    return log.entityId != null ? `${log.entityType} #${log.entityId}` : log.entityType;
  }

  formatTimestamp(iso: string): string {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) {
      return iso;
    }
    return d.toLocaleString(this.languageService.language() === 'ar' ? 'ar-EG' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  }

  pageInfo(): string {
    return this.t('auditPageInfo')
      .replace('{from}', String(this.rangeStart()))
      .replace('{to}', String(this.rangeEnd()))
      .replace('{total}', String(this.page().total));
  }
}

// ─── Pure helpers ────────────────────────────────────────────────────────────

function isoToday(): string {
  return toIso(new Date());
}

function isoDaysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return toIso(d);
}

function toIso(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}
