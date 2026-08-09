import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';

import { LanguageService } from '../../../../core/services/language.service';
import { AvatarComponent } from '../../../../shared/components/avatar/avatar.component';
import { IconComponent } from '../../../../shared/components/icon/icon.component';
import { ConversationBadgesComponent } from '../conversation-badges/conversation-badges.component';
import type { ConversationListItem } from '../../models/conversation.model';
import type { ConversationClassificationBadgeData } from '../../models/conversation-classification.model';

/** One row in the inbox conversation list. */
@Component({
  selector: 'app-conversation-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AvatarComponent, IconComponent, ConversationBadgesComponent],
  template: `
    <div
      class="conv"
      role="button"
      tabindex="0"
      [class.conv--active]="selected()"
      [class.conv--unread]="hasUnread()"
      [class.conv--escalated]="isEscalated()"
      (click)="selectCard.emit(item().id)"
      (keydown.enter)="selectCard.emit(item().id)"
    >
      <app-avatar [name]="item().customerName" [size]="40" />
      <span class="conv__body">
        <span class="conv__top">
          <span class="conv__name">{{ item().customerName }}</span>
          <span class="conv__time">{{ relativeTime() }}</span>
        </span>
        <app-conversation-badges [data]="badgeData()" />
        <span class="conv__bottom">
          <span class="conv__preview">
            @if (item().handledByAi) {
              <app-icon name="sparkles" [size]="14" style="color: #8b5cf6; margin-inline-end: 4px; vertical-align: text-bottom;" />
            }
            {{ item().lastMessagePreview || '—' }}
          </span>
          @if (hasUnread()) {
            <span class="conv__unread" [attr.aria-label]="unreadLabel()">{{ item().unreadCount }}</span>
          }
        </span>
      </span>
      <button
        type="button"
        class="conv__delete"
        [attr.aria-label]="deleteLabel()"
        [title]="deleteLabel()"
        (click)="onDeleteClick($event)"
      >
        <app-icon name="trash" [size]="15" />
      </button>
    </div>
  `,
  styles: [`
    .conv {
      display: flex;
      align-items: center;
      gap: 12px;
      width: 100%;
      padding: 11px 12px;
      border: 0;
      border-radius: 13px;
      background: transparent;
      cursor: pointer;
      text-align: start;
      position: relative;
      transition: background-color 140ms ease;
    }
    .conv:hover { background: color-mix(in srgb, var(--primary) 5%, var(--surface)); }
    .conv--active {
      background: color-mix(in srgb, var(--primary) 8%, var(--surface));
      box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--primary) 18%, transparent);
    }
    .conv--active::before {
      content: '';
      position: absolute;
      inset-inline-start: 0;
      top: 14px;
      bottom: 14px;
      width: 3px;
      border-radius: 999px;
      background: linear-gradient(180deg, var(--primary), var(--accent));
    }
    .conv--escalated { background: color-mix(in srgb, #EF4444 4%, var(--surface)); }
    .conv--escalated:hover { background: color-mix(in srgb, #EF4444 8%, var(--surface)); }
    .conv--escalated::before {
      content: '';
      position: absolute;
      inset-inline-start: 0;
      top: 14px;
      bottom: 14px;
      width: 3px;
      border-radius: 999px;
      background: #EF4444;
    }
    .conv--escalated.conv--active { background: color-mix(in srgb, #EF4444 6%, var(--surface)); }
    .conv--escalated.conv--active::before { background: linear-gradient(180deg, #EF4444, var(--accent)); }
    .conv__body { min-width: 0; flex: 1 1 auto; display: flex; flex-direction: column; gap: 3px; }
    .conv__top { display: flex; align-items: baseline; justify-content: space-between; gap: 8px; }
    .conv__name {
      font-size: 0.9rem; font-weight: 650; color: var(--text-primary);
      white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    }
    .conv__time { font-size: 0.72rem; color: var(--text-muted); font-variant-numeric: tabular-nums; flex: 0 0 auto; }
    .conv__bottom { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
    .conv__preview {
      font-size: 0.82rem; color: var(--text-muted);
      white-space: nowrap; overflow: hidden; text-overflow: ellipsis; flex: 1 1 auto;
    }
    /* WhatsApp-style unread count badge. */
    .conv__unread {
      flex: 0 0 auto;
      display: inline-flex; align-items: center; justify-content: center;
      min-width: 20px; height: 20px; padding: 0 6px;
      border-radius: 999px;
      background: var(--accent);
      color: #fff;
      font-size: 0.68rem; font-weight: 700; line-height: 1;
      font-variant-numeric: tabular-nums;
    }
    /* Unread conversations get emphasised name + preview (WhatsApp cue). */
    .conv--unread .conv__name { font-weight: 750; }
    .conv--unread .conv__preview { color: var(--text-primary); font-weight: 550; }
    .conv__delete {
      flex: 0 0 auto;
      display: none;
      align-items: center;
      justify-content: center;
      width: 28px; height: 28px;
      border: 0;
      border-radius: 8px;
      background: transparent;
      color: var(--text-muted);
      cursor: pointer;
    }
    .conv:hover .conv__delete,
    .conv:focus-within .conv__delete { display: inline-flex; }
    .conv__delete:hover { background: color-mix(in srgb, var(--danger, #ef4444) 12%, transparent); color: var(--danger, #ef4444); }
  `]
})
export class ConversationCardComponent {
  private readonly language = inject(LanguageService);

  readonly item = input.required<ConversationListItem>();
  readonly selected = input(false);
  readonly badgeData = input<ConversationClassificationBadgeData | null>(null);
  readonly selectCard = output<number>();
  readonly deleteCard = output<number>();

  protected readonly hasUnread = computed(() => this.item().unreadCount > 0);
  protected readonly isEscalated = computed(() => {
    const d = this.badgeData();
    if (!d) return false;
    if (d.escalate) return true;
    const s = d.escalationStatus;
    return s === 'open' || s === 'assigned';
  });
  protected readonly unreadLabel = computed(() => `${this.item().unreadCount} ${this.language.text('inboxUnread')}`);
  protected readonly deleteLabel = computed(() => this.language.text('inboxDeleteChat'));

  protected readonly relativeTime = computed(() => formatRelative(this.item().lastMessageAt));

  protected onDeleteClick(event: Event): void {
    event.stopPropagation();
    this.deleteCard.emit(this.item().id);
  }
}

/** Compact relative time for the list ("2m", "3h", "Jul 9"). */
function formatRelative(iso: string | null): string {
  if (!iso) return '';
  const d = new Date(iso);
  const diffMs = Date.now() - d.getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return 'now';
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d`;
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}
