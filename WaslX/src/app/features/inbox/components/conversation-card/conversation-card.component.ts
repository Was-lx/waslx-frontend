import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';

import { AvatarComponent } from '../../../../shared/components/avatar/avatar.component';
import type { ConversationListItem } from '../../models/conversation.model';

/** One row in the inbox conversation list. */
@Component({
  selector: 'app-conversation-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AvatarComponent],
  template: `
    <button
      type="button"
      class="conv"
      [class.conv--active]="selected()"
      (click)="selectCard.emit(item().id)"
    >
      <app-avatar [name]="item().customerName" [size]="40" />
      <span class="conv__body">
        <span class="conv__top">
          <span class="conv__name">{{ item().customerName }}</span>
          <span class="conv__time">{{ relativeTime() }}</span>
        </span>
        <span class="conv__bottom">
          <span class="conv__preview">{{ item().lastMessagePreview || '—' }}</span>
          <span class="ui-pill" [class]="statusClass()">{{ item().status }}</span>
        </span>
      </span>
    </button>
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
    .conv__bottom .ui-pill { flex: 0 0 auto; font-size: 0.66rem; padding: 2px 8px; }
  `]
})
export class ConversationCardComponent {
  readonly item = input.required<ConversationListItem>();
  readonly selected = input(false);
  readonly selectCard = output<number>();

  protected readonly statusClass = computed(() => {
    switch (this.item().status) {
      case 'Resolved': return 'ui-pill--success';
      case 'Pending': return 'ui-pill--warning';
      case 'New':
      case 'Reopened': return 'ui-pill--info';
      default: return 'ui-pill--muted';
    }
  });

  protected readonly relativeTime = computed(() => formatRelative(this.item().lastMessageAt));
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
