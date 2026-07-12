import { ChangeDetectionStrategy, Component, inject, input, output, signal } from '@angular/core';

import { LanguageService, type TranslationKey } from '../../../../core/services/language.service';
import { AvatarComponent } from '../../../../shared/components/avatar/avatar.component';
import { IconComponent } from '../../../../shared/components/icon/icon.component';
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

        <section class="ctx__block">
          <h4 class="ctx__label">{{ t('ctxStatus') }}</h4>
          <span class="ctx__status" [class]="'ctx__status--' + d.status.toLowerCase()">{{ statusLabel(d.status) }}</span>
          @if (d.allowedTransitions.length > 0) {
            <div class="ctx__actions">
              <span class="ctx__actions-label">{{ t('statusChange') }}</span>
              <div class="ctx__transitions">
                @for (s of d.allowedTransitions; track s) {
                  <button type="button" class="ctx__transition" [disabled]="statusChanging()" (click)="changeStatus.emit(s)">
                    {{ statusLabel(s) }}
                  </button>
                }
              </div>
            </div>
          }
        </section>

        <section class="ctx__block">
          <h4 class="ctx__label">{{ t('ctxAssigned') }}</h4>
          <p class="ctx__value">{{ d.assignedUserName || t('ctxUnassigned') }}</p>
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
    }
  `,
  styles: [`
    :host { display: block; height: 100%; overflow-y: auto; background: var(--surface); border-inline-start: 1px solid var(--border-subtle); }
    .ctx { display: flex; flex-direction: column; }
    .ctx__block { padding: 16px 18px; border-bottom: 1px solid var(--border-subtle); }
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
  `]
})
export class ContextPanelComponent {
  private readonly language = inject(LanguageService);

  readonly detail = input<ConversationDetail | null>(null);
  readonly notes = input<ConversationNote[]>([]);
  readonly addingNote = input(false);
  readonly statusChanging = input(false);

  readonly changeStatus = output<string>();
  readonly addNote = output<string>();

  protected readonly draft = signal('');

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
