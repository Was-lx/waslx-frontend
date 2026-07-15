import { ChangeDetectionStrategy, Component, computed, inject, input, output, signal } from '@angular/core';

import { LanguageService, type TranslationKey } from '../../../../core/services/language.service';
import { IconComponent } from '../../../../shared/components/icon/icon.component';
import { TagChipComponent } from '../../../../shared/components/tag-chip/tag-chip.component';
import type { Assignment } from '../../../../core/api/assignment-api.service';
import type { Tag } from '../../../../core/api/tags-api.service';
import type { User } from '../../../../core/api/users-api.service';
import type { ConversationDetail } from '../../models/conversation.model';

export interface AssignEvent {
  userId: string;
  reason: string | null;
}

/** An applied tag resolved against the tenant tag list (so we know its id + colour to remove it). */
interface AppliedTag {
  name: string;
  color: string | null;
  id: number | null;
}

/**
 * Compact icon toolbar shown at the end of the chat header: quick actions for the open
 * conversation — assignee (assign / reassign), tags (apply / remove), status transitions,
 * assignment history — plus a toggle for the full customer/context drawer. Each action is a
 * single icon button that reveals a small popover; only one popover is open at a time.
 */
@Component({
  selector: 'app-assignment-bar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconComponent, TagChipComponent],
  template: `
    @if (detail(); as d) {
      <div class="ctb" [attr.dir]="direction()">
        <!-- Customer / context drawer toggle -->
        <button
          type="button"
          class="ctb__btn ctb__btn--info"
          [class.is-on]="infoOpen()"
          [title]="t('ctxProfileToggle')"
          [attr.aria-label]="t('ctxProfileToggle')"
          [attr.aria-pressed]="infoOpen()"
          (click)="toggleInfo.emit()"
        >
          <app-icon name="user" [size]="17" />
        </button>

        <span class="ctb__sep"></span>

        <!-- Assignee -->
        <div class="ctb__slot">
          <button
            type="button"
            class="ctb__btn"
            [class.is-open]="assignOpen()"
            [title]="t('assignAssignee') + ' · ' + (d.assignedUserName || t('unassigned'))"
            [attr.aria-label]="t('assignAssignee')"
            (click)="toggleAssign()"
          >
            <app-icon name="user-check" [size]="17" />
            @if (!d.assignedUserName) { <span class="ctb__dot" aria-hidden="true"></span> }
          </button>

          @if (assignOpen()) {
            <div class="ctb__pop">
              <div class="ctb__pop-title">{{ t('assignAssignee') }}</div>
              <div class="ctb__pop-current">
                <app-icon name="user-check" [size]="13" />
                <span [class.is-unassigned]="!d.assignedUserName">{{ d.assignedUserName || t('unassigned') }}</span>
              </div>
              <select class="ui-select" [value]="selectedAgent()" (change)="selectedAgent.set(pickStr($event))">
                <option value="">{{ t('assignSelectAgent') }}</option>
                @for (u of users(); track u.id) { <option [value]="u.id">{{ u.name }}</option> }
              </select>
              <input
                type="text"
                class="ui-input ctb__reason"
                [placeholder]="t('assignReasonPlaceholder')"
                [value]="reason()"
                (input)="reason.set(inputVal($event))"
              />
              <button
                type="button"
                class="ui-btn ui-btn--primary ui-btn--sm ui-btn--block"
                [disabled]="assigning() || !selectedAgent()"
                (click)="confirmAssign()"
              >
                {{ d.assignedUserId ? t('assignReassign') : t('assignAssign') }}
              </button>
            </div>
          }
        </div>

        <!-- Tags -->
        <div class="ctb__slot">
          <button
            type="button"
            class="ctb__btn"
            [class.is-open]="tagOpen()"
            [title]="t('ctxTags')"
            [attr.aria-label]="t('ctxTags')"
            (click)="toggleTag()"
          >
            <app-icon name="tag" [size]="16" />
            @if (appliedTags().length > 0) { <span class="ctb__count">{{ appliedTags().length }}</span> }
          </button>

          @if (tagOpen()) {
            <div class="ctb__pop ctb__pop--tags">
              <div class="ctb__pop-title">{{ t('ctxTags') }}</div>
              @if (appliedTags().length > 0) {
                <div class="ctb__tag-applied">
                  @for (tag of appliedTags(); track tag.name) {
                    <app-tag-chip
                      [name]="tag.name"
                      [color]="tag.color"
                      size="sm"
                      [removable]="tag.id !== null"
                      [removeLabel]="t('inboxRemoveAttachment')"
                      (remove)="tag.id !== null && removeTag.emit(tag.id)"
                    />
                  }
                </div>
              }
              @if (availableTags().length === 0) {
                <p class="ctb__muted">{{ t('tagNoneAvailable') }}</p>
              } @else {
                <div class="ctb__tag-list">
                  @for (tg of availableTags(); track tg.id) {
                    <button type="button" class="ctb__tag-opt" (click)="pickTag(tg.id)">
                      <span class="ctb__tag-dot" [style.background]="tg.color || 'var(--primary)'"></span>
                      {{ tg.name }}
                    </button>
                  }
                </div>
              }
            </div>
          }
        </div>

        <!-- Status -->
        <div class="ctb__slot">
          <button
            type="button"
            class="ctb__btn"
            [class.is-open]="statusOpen()"
            [title]="t('ctxStatus') + ' · ' + statusLabel(d.status)"
            [attr.aria-label]="t('ctxStatus')"
            (click)="toggleStatus()"
          >
            <app-icon name="check-circle" [size]="17" />
          </button>

          @if (statusOpen()) {
            <div class="ctb__pop">
              <div class="ctb__pop-title">{{ t('ctxStatus') }}</div>
              <span class="ctb__status" [class]="'ctb__status--' + d.status.toLowerCase()">{{ statusLabel(d.status) }}</span>
              @if (d.allowedTransitions.length > 0) {
                <span class="ctb__pop-sub">{{ t('statusChange') }}</span>
                <div class="ctb__status-grid">
                  @for (s of d.allowedTransitions; track s) {
                    <button type="button" class="ctb__status-opt" [disabled]="statusChanging()" (click)="pickStatus(s)">
                      {{ statusLabel(s) }}
                    </button>
                  }
                </div>
              } @else {
                <p class="ctb__muted">{{ t('statusNoTransitions') }}</p>
              }
            </div>
          }
        </div>

        <!-- Assignment history -->
        <div class="ctb__slot">
          <button
            type="button"
            class="ctb__btn"
            [class.is-open]="historyOpen()"
            [title]="t('assignHistory')"
            [attr.aria-label]="t('assignHistory')"
            (click)="toggleHistory()"
          >
            <app-icon name="history" [size]="16" />
          </button>

          @if (historyOpen()) {
            <div class="ctb__pop ctb__pop--history">
              <div class="ctb__pop-title">{{ t('assignHistory') }}</div>
              @if (loadingHistory()) {
                <p class="ctb__muted">{{ t('inboxLoading') }}</p>
              } @else if (assignments().length === 0) {
                <p class="ctb__muted">{{ t('assignHistoryEmpty') }}</p>
              } @else {
                <ul class="ctb__hist">
                  @for (a of assignments(); track a.id) {
                    <li class="ctb__hist-item">
                      <div class="ctb__hist-top">
                        <span class="ctb__hist-to">{{ a.assignedToName }}</span>
                        <span class="ctb__hist-method">{{ methodLabel(a.method) }}</span>
                      </div>
                      <div class="ctb__hist-meta">
                        {{ shortDateTime(a.assignedAt) }}
                        @if (a.assignedByName) { · {{ t('assignBy') }} {{ a.assignedByName }} }
                      </div>
                      @if (a.reason) { <div class="ctb__hist-reason">“{{ a.reason }}”</div> }
                    </li>
                  }
                </ul>
              }
            </div>
          }
        </div>
      </div>

      @if (anyOpen()) {
        <div class="ctb__scrim" (click)="closeAll()" aria-hidden="true"></div>
      }
    }
  `,
  styles: [`
    :host { display: block; }
    .ctb {
      position: relative;
      z-index: 6;
      display: inline-flex;
      align-items: center;
      gap: 4px;
    }
    .ctb__sep { width: 1px; height: 22px; background: var(--border-subtle); margin: 0 3px; }
    .ctb__slot { position: relative; display: inline-flex; }
    .ctb__btn {
      position: relative;
      display: grid; place-items: center;
      width: 36px; height: 36px;
      border: 1px solid var(--border-soft);
      border-radius: 10px;
      background: var(--surface);
      color: var(--text-muted);
      cursor: pointer;
      transition: border-color 150ms ease, color 150ms ease, background-color 150ms ease;
    }
    .ctb__btn:hover { border-color: color-mix(in srgb, var(--primary) 42%, var(--border-soft)); color: var(--primary); }
    .ctb__btn.is-open,
    .ctb__btn.is-on {
      border-color: color-mix(in srgb, var(--primary) 55%, var(--border-soft));
      color: var(--primary);
      background: color-mix(in srgb, var(--primary) 9%, var(--surface));
    }
    .ctb__btn svg { fill: none; stroke: currentColor; stroke-width: 2; }
    /* Little amber dot: this conversation has no assignee yet. */
    .ctb__dot {
      position: absolute; top: 6px; inset-inline-end: 6px;
      width: 7px; height: 7px; border-radius: 50%;
      background: #d97706; box-shadow: 0 0 0 2px var(--surface);
    }
    /* Count pill on the tag button. */
    .ctb__count {
      position: absolute; top: -5px; inset-inline-end: -5px;
      min-width: 16px; height: 16px; padding: 0 4px;
      display: grid; place-items: center;
      border-radius: 999px;
      background: var(--accent); color: #fff;
      font-size: 0.6rem; font-weight: 800; line-height: 1;
      box-shadow: 0 0 0 2px var(--surface);
    }

    /* ── Popovers ──────────────────────────────────────────────────────────── */
    .ctb__pop {
      position: absolute;
      top: calc(100% + 8px);
      inset-inline-end: 0;
      z-index: 30;
      width: 264px;
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding: 12px;
      border: 1px solid var(--border-subtle);
      border-radius: 14px;
      background: var(--surface);
      box-shadow: var(--shadow-float);
      animation: ctb-in 150ms var(--ease-out, ease);
    }
    @keyframes ctb-in { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: translateY(0); } }
    .ctb__pop--history { width: 300px; max-height: 340px; overflow-y: auto; }
    .ctb__pop--tags { width: 240px; }
    .ctb__pop-title { font-size: 0.68rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-muted); }
    .ctb__pop-sub { font-size: 0.72rem; color: var(--text-muted); }
    .ctb__pop-current {
      display: inline-flex; align-items: center; gap: 6px;
      font-size: 0.84rem; font-weight: 650; color: var(--text-primary);
    }
    .ctb__pop-current app-icon { color: var(--primary); }
    .ctb__pop-current svg { fill: none; stroke: currentColor; stroke-width: 2; }
    .ctb__pop-current .is-unassigned { color: var(--text-muted); font-weight: 600; }
    .ctb__reason, .ctb__pop .ui-select { height: 36px; font-size: 0.84rem; }
    .ctb__muted { margin: 4px 2px; font-size: 0.8rem; color: var(--text-muted); }

    /* Status popover */
    .ctb__status { align-self: flex-start; font-size: 0.76rem; font-weight: 700; padding: 4px 12px; border-radius: 999px;
      background: color-mix(in srgb, var(--primary) 14%, transparent); color: var(--primary); }
    .ctb__status--resolved { background: color-mix(in srgb, #16a34a 16%, transparent); color: #16a34a; }
    .ctb__status--pending { background: color-mix(in srgb, #d97706 16%, transparent); color: #d97706; }
    .ctb__status--reopened { background: color-mix(in srgb, #7c3aed 16%, transparent); color: #7c3aed; }
    .ctb__status-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; }
    .ctb__status-opt {
      font-size: 0.78rem; font-weight: 650; padding: 7px 10px; border-radius: 9px;
      border: 1px solid var(--border-soft); background: var(--surface-soft); color: var(--text-secondary); cursor: pointer;
      transition: border-color 140ms ease, color 140ms ease, background-color 140ms ease;
    }
    .ctb__status-opt:hover:not(:disabled) { border-color: color-mix(in srgb, var(--primary) 45%, var(--border-soft)); color: var(--primary); background: color-mix(in srgb, var(--primary) 6%, var(--surface)); }
    .ctb__status-opt:disabled { opacity: .5; cursor: not-allowed; }

    /* Tag popover */
    .ctb__tag-applied { display: flex; flex-wrap: wrap; gap: 6px; padding-bottom: 8px; border-bottom: 1px solid var(--border-subtle); }
    .ctb__tag-list { display: flex; flex-direction: column; gap: 2px; max-height: 220px; overflow-y: auto; margin: 0 -4px -4px; }
    .ctb__tag-opt {
      display: flex; align-items: center; gap: 8px; width: 100%;
      padding: 8px 10px; border: 0; border-radius: 8px;
      background: transparent; color: var(--text-secondary);
      font: inherit; font-size: 0.82rem; font-weight: 600; text-align: start; cursor: pointer;
      transition: background-color 130ms ease, color 130ms ease;
    }
    .ctb__tag-opt:hover { background: var(--surface-soft); color: var(--text-primary); }
    .ctb__tag-dot { width: 8px; height: 8px; border-radius: 50%; flex: 0 0 auto; }

    /* History popover */
    .ctb__hist { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 8px; }
    .ctb__hist-item { padding: 8px 10px; border-radius: 10px; background: var(--surface-soft); border: 1px solid var(--border-soft); }
    .ctb__hist-top { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
    .ctb__hist-to { font-size: 0.82rem; font-weight: 700; color: var(--text-primary); }
    .ctb__hist-method { font-size: 0.64rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.03em; padding: 2px 7px; border-radius: 999px; background: color-mix(in srgb, var(--primary) 12%, var(--surface)); color: var(--primary); }
    .ctb__hist-meta { margin-top: 3px; font-size: 0.72rem; color: var(--text-muted); }
    .ctb__hist-reason { margin-top: 4px; font-size: 0.78rem; color: var(--text-secondary); font-style: italic; }

    .ctb__scrim { position: fixed; inset: 0; z-index: 5; }
  `]
})
export class AssignmentBarComponent {
  private readonly language = inject(LanguageService);

  readonly detail = input<ConversationDetail | null>(null);
  readonly users = input<User[]>([]);
  readonly tags = input<Tag[]>([]);
  readonly assignments = input<Assignment[]>([]);
  readonly assigning = input(false);
  readonly loadingHistory = input(false);
  readonly statusChanging = input(false);
  readonly infoOpen = input(false);

  readonly assign = output<AssignEvent>();
  readonly applyTag = output<number>();
  readonly removeTag = output<number>();
  readonly openHistory = output<void>();
  readonly changeStatus = output<string>();
  readonly toggleInfo = output<void>();

  protected readonly assignOpen = signal(false);
  protected readonly historyOpen = signal(false);
  protected readonly tagOpen = signal(false);
  protected readonly statusOpen = signal(false);
  protected readonly selectedAgent = signal('');
  protected readonly reason = signal('');

  protected readonly anyOpen = computed(
    () => this.assignOpen() || this.historyOpen() || this.tagOpen() || this.statusOpen()
  );

  /** Tags applied to this conversation, resolved to id + colour from the tenant tag list. */
  protected readonly appliedTags = computed<AppliedTag[]>(() => {
    const names = this.detail()?.tags ?? [];
    const lookup = new Map(this.tags().map((t) => [t.name, t]));
    return names.map((name) => {
      const t = lookup.get(name);
      return { name, color: t?.color ?? null, id: t?.id ?? null };
    });
  });

  /** Tenant tags not yet applied to this conversation. */
  protected readonly availableTags = computed<Tag[]>(() => {
    const applied = new Set(this.detail()?.tags ?? []);
    return this.tags().filter((t) => !applied.has(t.name));
  });

  protected t = (key: TranslationKey): string => this.language.text(key);
  protected direction = (): 'rtl' | 'ltr' => this.language.getDirection();

  protected toggleAssign(): void {
    const open = !this.assignOpen();
    this.closeAll();
    if (open) {
      // App user ids are GUID strings while detail.assignedUserId is numeric, so we can't preselect
      // the current assignee reliably — start empty and let the agent choose.
      this.selectedAgent.set('');
      this.reason.set('');
    }
    this.assignOpen.set(open);
  }

  protected toggleHistory(): void {
    const open = !this.historyOpen();
    this.closeAll();
    this.historyOpen.set(open);
    if (open) this.openHistory.emit();
  }

  protected toggleTag(): void {
    const open = !this.tagOpen();
    this.closeAll();
    this.tagOpen.set(open);
  }

  protected toggleStatus(): void {
    const open = !this.statusOpen();
    this.closeAll();
    this.statusOpen.set(open);
  }

  protected closeAll(): void {
    this.assignOpen.set(false);
    this.historyOpen.set(false);
    this.tagOpen.set(false);
    this.statusOpen.set(false);
  }

  protected confirmAssign(): void {
    const userId = this.selectedAgent();
    if (!userId || this.assigning()) return;
    const reason = this.reason().trim();
    this.assign.emit({ userId, reason: reason || null });
    this.closeAll();
  }

  protected pickTag(tagId: number): void {
    this.applyTag.emit(tagId);
    this.closeAll();
  }

  protected pickStatus(status: string): void {
    if (this.statusChanging()) return;
    this.changeStatus.emit(status);
    this.closeAll();
  }

  protected methodLabel(method: string): string {
    const map: Record<string, TranslationKey> = {
      Manual: 'assignMethodManual', RoundRobin: 'assignMethodRoundRobin', AI: 'assignMethodAI'
    };
    const key = map[method];
    return key ? this.t(key) : method;
  }

  protected statusLabel(status: string): string {
    const map: Record<string, TranslationKey> = {
      New: 'statusNew', Assigned: 'statusAssigned', InProgress: 'statusInProgress',
      Pending: 'statusPending', Resolved: 'statusResolved', Reopened: 'statusReopened'
    };
    return this.t(map[status] ?? 'statusNew');
  }

  protected inputVal(event: Event): string {
    return (event.target as HTMLInputElement).value;
  }

  protected pickStr(event: Event): string {
    return (event.target as HTMLSelectElement).value;
  }

  protected shortDateTime(value: string | null): string {
    if (!value) return '';
    return new Date(value).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  }
}
