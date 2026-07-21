import { Component, HostListener, OnInit, computed, inject, signal } from '@angular/core';

import { type TranslationKey, LanguageService } from '../../../../core/services/language.service';
import { auditVerb, type AuditAction, type AuditVerb } from '../../../../core/api/audit-api.service';
import { SuperAdminApiService } from '../../../../core/api/superadmin-api.service';
import type { GlobalAuditLog, GlobalAuditPage, TenantSummary } from '../../../../core/models/platform.models';
import { IconComponent } from '../../../../shared/components/icon/icon.component';

type RangePreset = '7d' | '30d' | '90d' | 'all' | 'custom';

/** Platform-scoped entity types the cross-tenant audit stream emits. */
const ENTITY_TYPES = [
  'Tenant',
  'User',
  'Plan',
  'Invoice',
  'Credential',
  'FeatureFlag',
  'Announcement',
  'Impersonation',
  'Conversation',
  'Campaign'
] as const;

/**
 * FE-6.9 · Global (cross-tenant) audit viewer. Adapts the tenant audit UI to
 * platform scope: adds a Tenant filter + column and keeps the same append-only
 * immutability language. Read-only throughout — no edit/delete anywhere.
 */
@Component({
  selector: 'app-superadmin-audit-page',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './audit.page.html',
  styleUrl: './audit.page.css'
})
export class SuperAdminAuditPageComponent implements OnInit {
  private readonly languageService = inject(LanguageService);
  private readonly api = inject(SuperAdminApiService);

  readonly t = (key: TranslationKey) => this.languageService.text(key);
  readonly direction = () => this.languageService.getDirection();

  // ── Data ──
  readonly page = signal<GlobalAuditPage>({ items: [], page: 1, pageSize: 25, total: 0 });
  readonly loading = signal(true);
  readonly refreshing = signal(false);
  readonly error = signal(false);

  readonly tenants = signal<TenantSummary[]>([]);
  readonly entityTypes = ENTITY_TYPES;
  readonly skeletonRows = Array.from({ length: 8 });

  // ── Filters ──
  readonly actor = signal<string>('');
  readonly tenantId = signal<string>('');
  readonly action = signal<AuditAction | ''>('');
  readonly entityType = signal<string>('');
  readonly search = signal<string>('');

  readonly preset = signal<RangePreset>('30d');
  readonly customFrom = signal<string>(isoDaysAgo(29));
  readonly customTo = signal<string>(isoToday());
  readonly rangePopoverOpen = signal(false);

  readonly pageIndex = signal(1);
  readonly pageSize = signal(25);

  private actorDebounce: ReturnType<typeof setTimeout> | null = null;
  private searchDebounce: ReturnType<typeof setTimeout> | null = null;

  // ── Detail drawer ──
  readonly selected = signal<GlobalAuditLog | null>(null);

  readonly presets: readonly { value: RangePreset; key: TranslationKey }[] = [
    { value: '7d', key: 'gaRange7d' },
    { value: '30d', key: 'gaRange30d' },
    { value: '90d', key: 'gaRange90d' },
    { value: 'all', key: 'gaRangeAll' },
    { value: 'custom', key: 'gaRangeCustom' }
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

  readonly hasActiveFilters = computed(
    () =>
      this.actor().trim() !== '' ||
      this.tenantId() !== '' ||
      this.action() !== '' ||
      this.entityType() !== '' ||
      this.search().trim() !== '' ||
      this.preset() !== '30d'
  );

  readonly totalPages = computed(() =>
    Math.max(1, Math.ceil(this.page().total / Math.max(1, this.page().pageSize)))
  );
  readonly rangeStart = computed(() =>
    this.page().total === 0 ? 0 : (this.page().page - 1) * this.page().pageSize + 1
  );
  readonly rangeEnd = computed(() => Math.min(this.page().page * this.page().pageSize, this.page().total));

  ngOnInit(): void {
    this.api.getTenants().subscribe({
      next: (list) => this.tenants.set(list ?? []),
      error: () => {}
    });
    this.load(true);
  }

  load(initial = false): void {
    if (initial) {
      this.loading.set(true);
    } else {
      this.refreshing.set(true);
    }
    this.error.set(false);
    const r = this.range();
    this.api
      .getGlobalAuditLogs({
        actorUserId: this.actor().trim() || null,
        tenantId: this.tenantId() || null,
        action: this.action() || null,
        entityType: this.entityType() || null,
        from: r.from,
        to: r.to,
        search: this.search(),
        page: this.pageIndex(),
        pageSize: this.pageSize()
      })
      .subscribe({
        next: (p) => {
          this.page.set(normalizePage(p));
          this.loading.set(false);
          this.refreshing.set(false);
        },
        error: () => {
          this.loading.set(false);
          this.refreshing.set(false);
          this.error.set(true);
        }
      });
  }

  private reloadFromFirstPage(): void {
    this.pageIndex.set(1);
    this.load();
  }

  onActorChange(value: string): void {
    this.actor.set(value);
    if (this.actorDebounce) {
      clearTimeout(this.actorDebounce);
    }
    this.actorDebounce = setTimeout(() => this.reloadFromFirstPage(), 300);
  }

  onTenantChange(value: string): void {
    this.tenantId.set(value);
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
    this.actor.set('');
    this.tenantId.set('');
    this.action.set('');
    this.entityType.set('');
    this.search.set('');
    this.preset.set('30d');
    this.rangePopoverOpen.set(false);
    this.reloadFromFirstPage();
  }

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

  openDetail(log: GlobalAuditLog): void {
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
      Impersonated: 'auditActionImpersonated'
    };
    const key = map[action];
    return key ? this.t(key) : action;
  }

  actorName(log: GlobalAuditLog): string {
    return log.actorName?.trim() || this.t('gaPlatformActor');
  }

  actorInitials(log: GlobalAuditLog): string {
    const name = log.actorName?.trim();
    if (!name) {
      return '·';
    }
    const parts = name.split(/\s+/).filter(Boolean);
    const first = parts[0]?.[0] ?? '';
    const second = parts.length > 1 ? parts[parts.length - 1][0] : '';
    return (first + second).toUpperCase() || '·';
  }

  tenantName(log: GlobalAuditLog): string {
    return log.tenantName?.trim() || this.t('gaPlatformTenant');
  }

  isPlatformRow(log: GlobalAuditLog): boolean {
    return !log.tenantName?.trim();
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
      second: '2-digit'
    });
  }

  pageInfo(): string {
    return this.t('gaPageInfo')
      .replace('{from}', String(this.rangeStart()))
      .replace('{to}', String(this.rangeEnd()))
      .replace('{total}', String(this.page().total));
  }
}

// ─── Pure helpers ────────────────────────────────────────────────────────────

function normalizePage(p: GlobalAuditPage): GlobalAuditPage {
  const items = p?.items ?? [];
  return {
    items,
    page: p?.page ?? 1,
    pageSize: p?.pageSize ?? 25,
    total: p?.total ?? items.length
  };
}

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
