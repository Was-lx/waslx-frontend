import { ChangeDetectionStrategy, Component, computed, inject, input, output, signal } from '@angular/core';

import { LanguageService, type TranslationKey } from '../../../../core/services/language.service';
import { IconComponent } from '../../../../shared/components/icon/icon.component';
import type { Group } from '../../../../core/api/groups-api.service';
import type { Tag } from '../../../../core/api/tags-api.service';
import type { User } from '../../../../core/api/users-api.service';

/** UI-facing filter model (mapped to the API query params by the inbox page). */
export interface InboxFilterValue {
  status: string | null;
  groupId: number | null;
  tagId: number | null;
  /** 'all' | 'unassigned' | 'me' | <userId> */
  assignee: string;
  dateFrom: string | null;
  dateTo: string | null;
  search: string;
}

export const EMPTY_INBOX_FILTER: InboxFilterValue = {
  status: null, groupId: null, tagId: null, assignee: 'all', dateFrom: null, dateTo: null, search: ''
};

const STATUSES = ['New', 'Assigned', 'InProgress', 'Pending', 'Resolved', 'Reopened'] as const;

/** A named, saved filter combination (persisted in localStorage, per browser). */
export interface SavedInboxView { name: string; value: InboxFilterValue; }
const SAVED_VIEWS_KEY = 'waslx.inbox.savedViews';

/** Search + faceted filter bar above the conversation list; emits the whole model on any change. */
@Component({
  selector: 'app-inbox-filters',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconComponent],
  template: `
    <div class="flt" [attr.dir]="direction()">
      <div class="flt__search">
        <app-icon name="search" [size]="16" />
        <input
          type="search"
          class="flt__search-input"
          [placeholder]="t('searchConversations')"
          [value]="value().search"
          (input)="patch({ search: input($event) })"
        />
      </div>

      <button
        type="button"
        class="flt__toggle"
        [class.is-active]="expanded() || activeCount() > 0"
        [title]="t('filterToggle')"
        [attr.aria-label]="t('filterToggle')"
        [attr.aria-expanded]="expanded()"
        (click)="expanded.set(!expanded())"
      >
        <app-icon name="filter" [size]="16" />
        @if (activeCount() > 0) { <span class="flt__count">{{ activeCount() }}</span> }
      </button>

      @if (activeCount() > 0) {
        <button type="button" class="flt__clear" [title]="t('filterClear')" [attr.aria-label]="t('filterClear')" (click)="clear.emit()">
          <app-icon name="x" [size]="15" />
        </button>
      }
    </div>

    @if (savedViews().length > 0) {
      <div class="flt__views" [attr.dir]="direction()">
        <span class="flt__views-label">{{ t('savedViewsLabel') }}</span>
        @for (v of savedViews(); track v.name) {
          <span class="flt__view">
            <button type="button" class="flt__view-apply" (click)="applyView(v)">{{ v.name }}</button>
            <button type="button" class="flt__view-del" [attr.aria-label]="t('saveViewDelete')" (click)="deleteView(v.name)">
              <app-icon name="x" [size]="11" />
            </button>
          </span>
        }
      </div>
    }

    @if (expanded()) {
      <div class="flt__panel" [attr.dir]="direction()">
        <label class="flt__field">
          <span class="flt__label">{{ t('filterStatus') }}</span>
          <select class="ui-select" [value]="value().status ?? ''" (change)="patch({ status: pick($event) })">
            <option value="">{{ t('filterAll') }}</option>
            @for (s of statuses; track s) { <option [value]="s">{{ statusLabel(s) }}</option> }
          </select>
        </label>

        <label class="flt__field">
          <span class="flt__label">{{ t('filterAssignee') }}</span>
          <select class="ui-select" [value]="value().assignee" (change)="patch({ assignee: pickStr($event) })">
            <option value="all">{{ t('filterAll') }}</option>
            <option value="unassigned">{{ t('unassigned') }}</option>
            <option value="me">{{ t('filterAssignedToMe') }}</option>
            @for (u of users(); track u.id) { <option [value]="u.id">{{ u.name }}</option> }
          </select>
        </label>

        <label class="flt__field">
          <span class="flt__label">{{ t('filterGroup') }}</span>
          <select class="ui-select" [value]="value().groupId ?? ''" (change)="patch({ groupId: pickNum($event) })">
            <option value="">{{ t('filterAll') }}</option>
            @for (g of groups(); track g.id) { <option [value]="g.id">{{ g.name }}</option> }
          </select>
        </label>

        <label class="flt__field">
          <span class="flt__label">{{ t('filterTag') }}</span>
          <select class="ui-select" [value]="value().tagId ?? ''" (change)="patch({ tagId: pickNum($event) })">
            <option value="">{{ t('filterAll') }}</option>
            @for (tg of tags(); track tg.id) { <option [value]="tg.id">{{ tg.name }}</option> }
          </select>
        </label>

        <label class="flt__field">
          <span class="flt__label">{{ t('filterDateFrom') }}</span>
          <input type="date" class="ui-input" [value]="value().dateFrom ?? ''" (change)="patch({ dateFrom: pick($event) })" />
        </label>

        <label class="flt__field">
          <span class="flt__label">{{ t('filterDateTo') }}</span>
          <input type="date" class="ui-input" [value]="value().dateTo ?? ''" (change)="patch({ dateTo: pick($event) })" />
        </label>

        @if (activeCount() > 0) {
          <div class="flt__save">
            <input type="text" class="ui-input flt__save-input" [placeholder]="t('saveViewNamePlaceholder')"
                   [value]="newViewName()" (input)="newViewName.set(input($event))" (keydown.enter)="saveCurrentView()" />
            <button type="button" class="ui-btn ui-btn--primary ui-btn--sm" [disabled]="!newViewName().trim()" (click)="saveCurrentView()">
              {{ t('saveViewBtn') }}
            </button>
          </div>
        }
      </div>
    }
  `,
  styles: [`
    :host { display: block; }
    .flt { display: flex; align-items: center; gap: 8px; padding: 12px 12px 8px; }
    .flt__search {
      flex: 1 1 auto;
      display: flex; align-items: center; gap: 9px;
      height: 38px; padding: 0 12px;
      border-radius: 11px;
      border: 1px solid var(--border-soft);
      background: var(--surface-soft);
      color: var(--text-muted);
      transition: border-color 150ms ease, box-shadow 150ms ease;
    }
    .flt__search:focus-within { border-color: color-mix(in srgb, var(--primary) 45%, var(--border-soft)); box-shadow: var(--focus-ring); background: var(--surface); }
    .flt__search svg { flex: 0 0 auto; fill: none; stroke: currentColor; stroke-width: 2; }
    .flt__search-input { flex: 1 1 auto; min-width: 0; border: 0; outline: none; background: transparent; color: var(--text-primary); font: inherit; font-size: 0.85rem; }
    .flt__toggle, .flt__clear {
      position: relative;
      flex: 0 0 auto;
      display: grid; place-items: center;
      width: 38px; height: 38px;
      border-radius: 11px;
      border: 1px solid var(--border-soft);
      background: var(--surface);
      color: var(--text-secondary);
      cursor: pointer;
      transition: border-color 150ms ease, color 150ms ease, background-color 150ms ease;
    }
    .flt__toggle:hover, .flt__clear:hover { border-color: color-mix(in srgb, var(--primary) 40%, var(--border-soft)); color: var(--primary); }
    .flt__toggle.is-active {
      border-color: color-mix(in srgb, var(--primary) 50%, var(--border-soft));
      color: var(--primary);
      background: color-mix(in srgb, var(--primary) 8%, var(--surface));
    }
    .flt__clear:hover { border-color: color-mix(in srgb, var(--danger, #ef4444) 40%, var(--border-soft)); color: var(--danger, #ef4444); }
    .flt__toggle svg, .flt__clear svg { fill: none; stroke: currentColor; stroke-width: 2; }
    /* Active-filter count — a small overlay badge on the corner of the filter icon. */
    .flt__count {
      position: absolute; top: -5px; inset-inline-end: -5px;
      display: inline-grid; place-items: center;
      min-width: 16px; height: 16px; padding: 0 4px;
      border-radius: 999px;
      background: var(--accent); color: #fff;
      font-size: 0.6rem; font-weight: 800; line-height: 1;
      box-shadow: 0 0 0 2px var(--surface);
    }
    .flt__panel {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 9px 10px;
      padding: 4px 12px 12px;
      border-bottom: 1px solid var(--border-subtle);
      animation: flt-in 160ms var(--ease-out, ease);
    }
    @keyframes flt-in { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: translateY(0); } }
    .flt__field { display: flex; flex-direction: column; gap: 5px; min-width: 0; }
    .flt__label { font-size: 0.68rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.04em; color: var(--text-muted); }
    .flt__field .ui-select, .flt__field .ui-input { height: 36px; font-size: 0.82rem; }
    .flt__views { display: flex; align-items: center; flex-wrap: wrap; gap: 6px; padding: 0 12px 8px; }
    .flt__views-label { font-size: 0.68rem; font-weight: 700; text-transform: uppercase; letter-spacing: .04em; color: var(--text-muted); }
    .flt__view { display: inline-flex; align-items: center; border-radius: 999px; border: 1px solid var(--border-soft); background: var(--surface-soft); overflow: hidden; }
    .flt__view-apply { border: 0; background: transparent; font: inherit; font-size: 0.76rem; font-weight: 600; color: var(--text-secondary); padding-block: 4px; padding-inline: 10px 4px; cursor: pointer; }
    .flt__view-apply:hover { color: var(--primary); }
    .flt__view-del { border: 0; background: transparent; color: var(--text-muted); padding-block: 4px; padding-inline: 3px 7px; cursor: pointer; display: inline-flex; }
    .flt__view-del:hover { color: var(--danger); }
    .flt__view-del svg { fill: none; stroke: currentColor; stroke-width: 2.5; }
    .flt__save { grid-column: 1 / -1; display: flex; gap: 6px; margin-top: 2px; }
    .flt__save-input { flex: 1 1 auto; min-width: 0; height: 36px; font-size: 0.82rem; }
    .flt__save .ui-btn { flex: 0 0 auto; }
  `]
})
export class InboxFiltersComponent {
  private readonly language = inject(LanguageService);

  readonly value = input<InboxFilterValue>(EMPTY_INBOX_FILTER);
  readonly groups = input<Group[]>([]);
  readonly tags = input<Tag[]>([]);
  readonly users = input<User[]>([]);

  readonly valueChange = output<InboxFilterValue>();
  readonly clear = output<void>();

  protected readonly expanded = signal(false);
  protected readonly statuses = STATUSES;
  protected readonly savedViews = signal<SavedInboxView[]>(this.loadViews());
  protected readonly newViewName = signal('');

  protected readonly activeCount = computed(() => {
    const v = this.value();
    let n = 0;
    if (v.status) n++;
    if (v.groupId != null) n++;
    if (v.tagId != null) n++;
    if (v.assignee && v.assignee !== 'all') n++;
    if (v.dateFrom) n++;
    if (v.dateTo) n++;
    return n;
  });

  protected t = (key: TranslationKey): string => this.language.text(key);
  protected direction = (): 'rtl' | 'ltr' => this.language.getDirection();

  protected patch(part: Partial<InboxFilterValue>): void {
    this.valueChange.emit({ ...this.value(), ...part });
  }

  // ── Saved views (client-side, localStorage) ──
  private loadViews(): SavedInboxView[] {
    try {
      const parsed = JSON.parse(localStorage.getItem(SAVED_VIEWS_KEY) ?? '[]');
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  private persistViews(views: SavedInboxView[]): void {
    this.savedViews.set(views);
    try { localStorage.setItem(SAVED_VIEWS_KEY, JSON.stringify(views)); } catch { /* ignore quota/private-mode */ }
  }

  protected saveCurrentView(): void {
    const name = this.newViewName().trim();
    if (!name || this.activeCount() === 0) return;
    const views = [...this.savedViews().filter((v) => v.name !== name), { name, value: { ...this.value() } }];
    this.persistViews(views);
    this.newViewName.set('');
  }

  protected applyView(view: SavedInboxView): void {
    this.valueChange.emit({ ...EMPTY_INBOX_FILTER, ...view.value });
  }

  protected deleteView(name: string): void {
    this.persistViews(this.savedViews().filter((v) => v.name !== name));
  }

  protected input(event: Event): string {
    return (event.target as HTMLInputElement).value;
  }

  protected pick(event: Event): string | null {
    const v = (event.target as HTMLInputElement | HTMLSelectElement).value;
    return v ? v : null;
  }

  protected pickStr(event: Event): string {
    return (event.target as HTMLSelectElement).value;
  }

  protected pickNum(event: Event): number | null {
    const v = (event.target as HTMLSelectElement).value;
    return v ? Number(v) : null;
  }

  protected statusLabel(status: string): string {
    const map: Record<string, TranslationKey> = {
      New: 'statusNew', Assigned: 'statusAssigned', InProgress: 'statusInProgress',
      Pending: 'statusPending', Resolved: 'statusResolved', Reopened: 'statusReopened'
    };
    return this.t(map[status] ?? 'statusNew');
  }
}
