import { ChangeDetectionStrategy, Component, computed, inject, input, output, signal } from '@angular/core';

import { LanguageService, type TranslationKey } from '../../../../core/services/language.service';
import { AvatarComponent } from '../../../../shared/components/avatar/avatar.component';
import { IconComponent } from '../../../../shared/components/icon/icon.component';
import type { Group } from '../../../../core/api/groups-api.service';
import type { ConversationDetail, ConversationNote } from '../../models/conversation.model';

/**
 * Right-hand customer context panel (FE-2.8): phone, tags, status + status controls (FE-2.12),
 * assignment, a history snapshot, and the internal-notes thread (FE-2.9) styled distinctly so a
 * note is never confused with a customer message and can never be sent to the customer.
 */
@Component({
  selector: 'app-context-panel',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AvatarComponent, IconComponent],
  template: `
    @if (detail(); as d) {
      <aside class="ctx" [attr.dir]="direction()">
        <div class="ctx__bar">
          <span class="ctx__bar-title">{{ t('ctxDrawerTitle') }}</span>
          <button type="button" class="ctx__close" [title]="t('ctxClose')" [attr.aria-label]="t('ctxClose')" (click)="close.emit()">
            <app-icon name="x" [size]="17" />
          </button>
        </div>

        <section class="ctx__block ctx__customer">
          <app-avatar [name]="d.customerName" [size]="48" />
          <div class="ctx__who">
            <span class="ctx__name">
              {{ d.customerName }}
              @if (d.customerVip) { <span class="ctx__vip">{{ t('ctxVip') }}</span> }
            </span>
            <span class="ctx__phone">{{ d.customerPhone }}</span>
          </div>
        </section>

        <section class="ctx__block ctx__duo">
          <div>
            <h4 class="ctx__label">{{ t('ctxStatus') }}</h4>
            <span class="ctx__status" [class]="'ctx__status--' + d.status.toLowerCase()">{{ statusLabel(d.status) }}</span>
          </div>
          <div>
            <h4 class="ctx__label">{{ t('ctxAssigned') }}</h4>
            <p class="ctx__value">{{ d.assignedUserName || t('ctxUnassigned') }}</p>
          </div>
        </section>

        <section class="ctx__block ctx__team">
          <h4 class="ctx__label">{{ t('ctxTeamTitle') }}</h4>
          <p class="ctx__team-current">
            <app-icon name="shield" [size]="13" />
            <span [class.ctx__value--muted]="!currentGroupName()">{{ currentGroupName() || t('ctxNoGroup') }}</span>
            @if (d.currentStageName) { <span class="ctx__team-stage">{{ d.currentStageName }}</span> }
          </p>

          <div class="ctx__team-action">
            <span class="ctx__actions-label">{{ t('ctxRouteLabel') }}</span>
            <div class="ctx__team-row">
              <select class="ui-select ctx__team-select" [value]="routeSel()" [disabled]="routing()"
                      (change)="routeSel.set(pickVal($event))">
                <option value="">{{ t('ctxRouteSelect') }}</option>
                @for (g of groups(); track g.id) { <option [value]="g.id">{{ g.name }}</option> }
              </select>
              <button type="button" class="ui-btn ui-btn--primary ui-btn--sm"
                      [disabled]="routing() || !routeSel()" (click)="submitRoute()">
                {{ routing() ? t('ctxRouting') : t('ctxRouteBtn') }}
              </button>
            </div>
          </div>

          <div class="ctx__team-action">
            <span class="ctx__actions-label">{{ t('ctxHandoffLabel') }}</span>
            <p class="ctx__team-hint">{{ t('ctxHandoffHint') }}</p>
            <div class="ctx__team-row">
              <select class="ui-select ctx__team-select" [value]="handoffSel()" [disabled]="routing()"
                      (change)="handoffSel.set(pickVal($event))">
                <option value="">{{ t('ctxHandoffSelect') }}</option>
                @for (g of handoffTargets(); track g.id) { <option [value]="g.id">{{ g.name }}</option> }
              </select>
              <button type="button" class="ui-btn ui-btn--ghost ui-btn--sm"
                      [disabled]="routing() || !handoffSel()" (click)="requestHandoff()">
                {{ t('ctxHandoffBtn') }}
              </button>
            </div>
          </div>
        </section>

        <section class="ctx__block">
          <h4 class="ctx__label">{{ t('ctxTags') }}</h4>
          @if (d.tags.length > 0) {
            <div class="ctx__tags">
              @for (tag of d.tags; track tag) { <span class="ctx__tag">{{ tag }}</span> }
            </div>
          } @else {
            <p class="ctx__value ctx__value--muted">{{ t('ctxNoTags') }}</p>
          }
        </section>

        <section class="ctx__block ctx__snapshot">
          <div><span class="ctx__label">{{ t('ctxMessages') }}</span><span class="ctx__stat">{{ d.messageCount }}</span></div>
          <div><span class="ctx__label">{{ t('ctxCreated') }}</span><span class="ctx__stat">{{ shortDate(d.createdAt) }}</span></div>
          <div><span class="ctx__label">{{ t('ctxLastActive') }}</span><span class="ctx__stat">{{ shortDate(d.lastMessageAt) }}</span></div>
        </section>

        <section class="ctx__block ctx__notes">
          <div class="ctx__notes-head">
            <h4 class="ctx__label">{{ t('notesTitle') }}</h4>
            <span class="ctx__internal"><app-icon name="lock" [size]="11" /> {{ t('notesInternalOnly') }}</span>
          </div>

          @if (notes().length === 0) {
            <p class="ctx__value ctx__value--muted">{{ t('notesEmpty') }}</p>
          } @else {
            <ul class="ctx__note-list">
              @for (note of notes(); track note.id) {
                <li class="ctx__note">
                  <div class="ctx__note-meta">
                    <span class="ctx__note-author">{{ note.authorName }}</span>
                    <span class="ctx__note-time">{{ shortDateTime(note.createdAt) }}</span>
                  </div>
                  <p class="ctx__note-body">{{ note.content }}</p>
                </li>
              }
            </ul>
          }

          <div class="ctx__note-add">
            <textarea class="ui-input ctx__note-input" rows="2" [value]="draft()" [placeholder]="t('notesPlaceholder')"
                      [disabled]="addingNote()" (input)="onDraft($event)" (keydown)="onKeydown($event)"></textarea>
            <button type="button" class="ui-btn ui-btn--primary ctx__note-btn"
                    [disabled]="addingNote() || draft().trim().length === 0" (click)="submitNote()">
              {{ addingNote() ? t('notesAdding') : t('notesAdd') }}
            </button>
          </div>
        </section>
      </aside>

      @if (pendingHandoff(); as target) {
        <div class="ui-overlay" (click)="cancelHandoff()">
          <div class="ui-modal ui-confirm" [attr.dir]="direction()" (click)="$event.stopPropagation()">
            <div class="ui-confirm__icon">
              <svg viewBox="0 0 24 24"><circle cx="6" cy="19" r="3"/><path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15"/><circle cx="18" cy="5" r="3"/></svg>
            </div>
            <h3>{{ t('ctxHandoffTitle') }}</h3>
            <p>{{ t('ctxHandoffBody') }} <strong>{{ target.name }}</strong>.</p>
            <p class="ctx__handoff-note">
              <app-icon name="history" [size]="14" /> {{ t('ctxHandoffHistoryNote') }}
            </p>
            <div class="ui-confirm__actions">
              <button type="button" class="ui-btn ui-btn--ghost" [disabled]="routing()" (click)="cancelHandoff()">
                {{ t('ctxHandoffCancel') }}
              </button>
              <button type="button" class="ui-btn ui-btn--primary" [disabled]="routing()" (click)="confirmHandoff()">
                {{ routing() ? t('ctxRouting') : t('ctxHandoffConfirm') }}
              </button>
            </div>
          </div>
        </div>
      }
    }
  `,
  styles: [`
    :host { display: block; height: 100%; overflow-y: auto; background: var(--surface); border-inline-start: 1px solid var(--border-subtle); }
    .ctx { display: flex; flex-direction: column; }
    .ctx__bar {
      position: sticky; top: 0; z-index: 2;
      display: flex; align-items: center; justify-content: space-between; gap: 8px;
      padding: 12px 14px 12px 18px;
      background: color-mix(in srgb, var(--primary) 4%, var(--surface));
      border-bottom: 1px solid var(--border-subtle);
      backdrop-filter: blur(6px);
    }
    .ctx__bar-title { font-size: 0.74rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-secondary); }
    .ctx__close {
      display: grid; place-items: center; width: 30px; height: 30px;
      border: 1px solid var(--border-soft); border-radius: 9px;
      background: var(--surface); color: var(--text-muted); cursor: pointer;
      transition: border-color 140ms ease, color 140ms ease;
    }
    .ctx__close:hover { border-color: color-mix(in srgb, var(--primary) 40%, var(--border-soft)); color: var(--primary); }
    .ctx__close svg { fill: none; stroke: currentColor; stroke-width: 2; }
    .ctx__block { padding: 16px 18px; border-bottom: 1px solid var(--border-subtle); }
    .ctx__duo { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; align-items: start; }
    .ctx__customer { display: flex; align-items: center; gap: 12px; }
    .ctx__who { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
    .ctx__name { font-weight: 700; color: var(--text-primary); display: inline-flex; align-items: center; gap: 6px; }
    .ctx__vip { font-size: 0.62rem; font-weight: 800; letter-spacing: .04em; padding: 1px 6px; border-radius: 6px;
      background: color-mix(in srgb, #d97706 20%, transparent); color: #d97706; }
    .ctx__phone { font-size: 0.78rem; color: var(--text-muted); font-variant-numeric: tabular-nums; }
    .ctx__label { margin: 0 0 6px; font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: .05em; color: var(--text-muted); }
    .ctx__value { margin: 0; font-size: 0.88rem; color: var(--text-primary); }
    .ctx__value--muted { color: var(--text-muted); }
    .ctx__status { display: inline-block; font-size: 0.76rem; font-weight: 700; padding: 4px 12px; border-radius: 999px;
      background: color-mix(in srgb, var(--primary) 14%, transparent); color: var(--primary); }
    .ctx__status--resolved { background: color-mix(in srgb, #16a34a 16%, transparent); color: #16a34a; }
    .ctx__status--pending { background: color-mix(in srgb, #d97706 16%, transparent); color: #d97706; }
    .ctx__status--reopened { background: color-mix(in srgb, #7c3aed 16%, transparent); color: #7c3aed; }
    .ctx__actions { margin-top: 10px; }
    .ctx__actions-label { font-size: 0.72rem; color: var(--text-muted); }
    .ctx__transitions { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 6px; }
    .ctx__transition { font-size: 0.76rem; font-weight: 600; padding: 5px 11px; border-radius: 8px;
      border: 1px solid var(--border-soft); background: var(--surface-soft); color: var(--text-secondary); cursor: pointer; }
    .ctx__transition:hover:not(:disabled) { border-color: color-mix(in srgb, var(--primary) 45%, var(--border-soft)); color: var(--primary); }
    .ctx__transition:disabled { opacity: .5; cursor: not-allowed; }
    .ctx__tags { display: flex; flex-wrap: wrap; gap: 6px; }
    .ctx__tag { font-size: 0.74rem; font-weight: 600; padding: 3px 10px; border-radius: 8px;
      background: var(--surface-soft); border: 1px solid var(--border-soft); color: var(--text-secondary); }
    .ctx__snapshot { display: flex; justify-content: space-between; gap: 8px; }
    .ctx__snapshot > div { display: flex; flex-direction: column; gap: 3px; }
    .ctx__stat { font-size: 0.86rem; font-weight: 700; color: var(--text-primary); font-variant-numeric: tabular-nums; }
    /* Internal notes — deliberately distinct (amber, left-accent) so they read as team-only. */
    .ctx__notes { background: color-mix(in srgb, #d97706 6%, var(--surface)); }
    .ctx__notes-head { display: flex; flex-direction: column; gap: 4px; margin-bottom: 10px; }
    .ctx__internal { display: inline-flex; align-items: center; gap: 4px; font-size: 0.68rem; font-weight: 700; color: #b45309; }
    .ctx__internal svg { fill: none; stroke: currentColor; stroke-width: 2; }
    .ctx__note-list { list-style: none; margin: 0 0 12px; padding: 0; display: flex; flex-direction: column; gap: 8px; }
    .ctx__note { padding: 8px 10px; border-radius: 10px; background: color-mix(in srgb, #d97706 12%, var(--surface));
      border-inline-start: 3px solid #d97706; }
    .ctx__note-meta { display: flex; justify-content: space-between; gap: 8px; margin-bottom: 3px; }
    .ctx__note-author { font-size: 0.76rem; font-weight: 700; color: var(--text-primary); }
    .ctx__note-time { font-size: 0.68rem; color: var(--text-muted); }
    .ctx__note-body { margin: 0; font-size: 0.84rem; color: var(--text-primary); white-space: pre-wrap; word-break: break-word; line-height: 1.45; }
    .ctx__note-add { display: flex; flex-direction: column; gap: 8px; }
    .ctx__note-input { resize: none; }
    .ctx__note-btn { align-self: flex-end; }
    /* Team & pipeline — routing + cross-team handoff */
    .ctx__team-current { margin: 0 0 12px; display: inline-flex; align-items: center; gap: 6px; font-size: 0.86rem; font-weight: 650; color: var(--text-primary); }
    .ctx__team-current app-icon { color: var(--primary); }
    .ctx__team-stage { font-size: 0.7rem; font-weight: 700; padding: 2px 8px; border-radius: 999px;
      background: color-mix(in srgb, var(--accent) 14%, transparent); color: var(--accent); }
    .ctx__team-current svg { fill: none; stroke: currentColor; stroke-width: 2; }
    .ctx__team-action { margin-top: 12px; }
    .ctx__team-action:first-of-type { margin-top: 0; }
    .ctx__team-hint { margin: 3px 0 6px; font-size: 0.72rem; color: var(--text-muted); line-height: 1.45; }
    .ctx__team-row { display: flex; gap: 6px; margin-top: 6px; }
    .ctx__team-select { flex: 1 1 auto; min-width: 0; height: 34px; font-size: 0.82rem; }
    .ctx__team-row .ui-btn { flex: 0 0 auto; }
    .ctx__handoff-note { display: flex; align-items: flex-start; gap: 6px; margin: 4px 0 0; padding: 8px 10px; border-radius: 10px;
      font-size: 0.78rem; line-height: 1.45; color: var(--text-secondary);
      background: color-mix(in srgb, var(--primary) 7%, var(--surface-soft)); border: 1px solid color-mix(in srgb, var(--primary) 16%, var(--border-subtle)); }
    .ctx__handoff-note app-icon { flex: 0 0 auto; color: var(--primary); margin-top: 1px; }
    .ctx__handoff-note svg { fill: none; stroke: currentColor; stroke-width: 2; }
  `]
})
export class ContextPanelComponent {
  private readonly language = inject(LanguageService);

  readonly detail = input<ConversationDetail | null>(null);
  readonly notes = input<ConversationNote[]>([]);
  readonly addingNote = input(false);
  readonly statusChanging = input(false);
  // Team routing / cross-team handoff
  readonly groups = input<Group[]>([]);
  readonly currentGroupId = input<number | null>(null);
  readonly routing = input(false);

  readonly changeStatus = output<string>();
  readonly addNote = output<string>();
  readonly route = output<number>();
  readonly handoff = output<number>();
  readonly close = output<void>();

  protected readonly draft = signal('');
  protected readonly routeSel = signal('');
  protected readonly handoffSel = signal('');
  protected readonly pendingHandoff = signal<Group | null>(null);

  /** Name of the conversation's current team, resolved from the tenant group list. */
  protected readonly currentGroupName = computed<string | null>(() => {
    // Prefer the authoritative name from the conversation detail (works even for agents whose
    // groups list is empty); fall back to resolving the id against the tenant group list.
    const fromDetail = this.detail()?.groupName;
    if (fromDetail) return fromDetail;
    const id = this.currentGroupId();
    if (id == null) return null;
    return this.groups().find((g) => g.id === id)?.name ?? null;
  });

  /** Handoff can target any team other than the current one. */
  protected readonly handoffTargets = computed<Group[]>(() => {
    const current = this.currentGroupId();
    return this.groups().filter((g) => g.id !== current);
  });

  protected t = (key: TranslationKey): string => this.language.text(key);
  protected direction = (): 'rtl' | 'ltr' => this.language.getDirection();

  protected onDraft(event: Event): void {
    this.draft.set((event.target as HTMLTextAreaElement).value);
  }

  protected onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
      event.preventDefault();
      this.submitNote();
    }
  }

  protected submitNote(): void {
    const content = this.draft().trim();
    if (!content || this.addingNote()) return;
    this.addNote.emit(content);
    this.draft.set('');
  }

  protected pickVal(event: Event): string {
    return (event.target as HTMLSelectElement).value;
  }

  protected submitRoute(): void {
    const groupId = Number(this.routeSel());
    if (!groupId || this.routing()) return;
    this.route.emit(groupId);
    this.routeSel.set('');
  }

  protected requestHandoff(): void {
    const groupId = Number(this.handoffSel());
    if (!groupId || this.routing()) return;
    const target = this.groups().find((g) => g.id === groupId) ?? null;
    if (target) this.pendingHandoff.set(target);
  }

  protected confirmHandoff(): void {
    const target = this.pendingHandoff();
    if (!target || this.routing()) return;
    this.handoff.emit(target.id);
    this.pendingHandoff.set(null);
    this.handoffSel.set('');
  }

  protected cancelHandoff(): void {
    if (this.routing()) return;
    this.pendingHandoff.set(null);
  }

  protected statusLabel(status: string): string {
    const map: Record<string, TranslationKey> = {
      New: 'statusNew', Assigned: 'statusAssigned', InProgress: 'statusInProgress',
      Pending: 'statusPending', Resolved: 'statusResolved', Reopened: 'statusReopened'
    };
    return this.t(map[status] ?? 'statusNew');
  }

  protected shortDate(value: string | null): string {
    if (!value) return '—';
    return new Date(value).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  }

  protected shortDateTime(value: string | null): string {
    if (!value) return '';
    return new Date(value).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  }
}
