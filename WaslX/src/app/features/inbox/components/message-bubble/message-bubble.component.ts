import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';

import { IconComponent } from '../../../../shared/components/icon/icon.component';
import type { ConversationMessage } from '../../models/message.model';

/**
 * A single chat bubble. Incoming (customer) aligns start; outgoing (agent/AI/system)
 * aligns end and shows a delivery-status tick. Failed exposes a Retry action.
 * Status is conveyed by icon shape + aria-label, never colour alone (a11y).
 */
@Component({
  selector: 'app-message-bubble',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconComponent],
  template: `
    <div class="bubble" [class.bubble--in]="incoming()" [class.bubble--out]="!incoming()">
      <p class="bubble__text">{{ message().content }}</p>
      <span class="bubble__foot">
        <span class="bubble__time">{{ time() }}</span>
        @if (!incoming()) {
          <span class="bubble__status" [class]="statusClass()" [attr.aria-label]="statusLabel()" [title]="statusLabel()">
            @switch (message().status) {
              @case ('Failed') { <app-icon name="x" [size]="13" /> }
              @case ('Queued') { <app-icon name="clock" [size]="12" /> }
              @default { <app-icon name="check" [size]="13" /> }
            }
          </span>
        }
      </span>
      @if (!incoming() && message().status === 'Failed') {
        <button type="button" class="bubble__retry" (click)="retry.emit(message().id)">
          {{ retryLabel() }}
        </button>
      }
    </div>
  `,
  styles: [`
    :host { display: contents; }
    .bubble {
      position: relative;
      max-width: 68%;
      padding: 10px 13px;
      border-radius: 16px;
      font-size: 0.88rem;
      line-height: 1.5;
      box-shadow: var(--shadow-xs);
    }
    .bubble__text { margin: 0; white-space: pre-wrap; word-break: break-word; color: inherit; }
    .bubble__foot { display: flex; align-items: center; justify-content: flex-end; gap: 5px; margin-top: 4px; }
    .bubble__time { font-size: 0.66rem; opacity: 0.7; font-variant-numeric: tabular-nums; }
    .bubble__status { display: inline-flex; opacity: 0.85; }
    .bubble__status svg { fill: none; stroke: currentColor; stroke-width: 2.4; stroke-linecap: round; stroke-linejoin: round; }
    .bubble__status--read { color: var(--accent); opacity: 1; }
    .bubble__status--failed { color: var(--danger, #ef4444); opacity: 1; }
    .bubble__retry {
      margin-top: 6px;
      border: 0;
      background: transparent;
      padding: 0;
      font-size: 0.72rem;
      font-weight: 700;
      color: var(--danger, #ef4444);
      cursor: pointer;
      text-decoration: underline;
    }
    .bubble--in {
      align-self: flex-start;
      background: var(--surface);
      color: var(--text-primary);
      border: 1px solid var(--border-soft);
      border-start-start-radius: 5px;
    }
    .bubble--out {
      align-self: flex-end;
      background: linear-gradient(135deg, var(--primary), var(--accent));
      color: #fff;
      border-start-end-radius: 5px;
    }
  `]
})
export class MessageBubbleComponent {
  readonly message = input.required<ConversationMessage>();
  /** Localised label for the retry affordance (kept out of the component for i18n). */
  readonly retryLabel = input('Retry');
  readonly retry = output<number>();

  protected readonly incoming = computed(() => this.message().senderType === 'Customer');

  protected readonly statusClass = computed(() => {
    switch (this.message().status) {
      case 'Read': return 'bubble__status--read';
      case 'Failed': return 'bubble__status--failed';
      default: return '';
    }
  });

  protected readonly statusLabel = computed(() => this.message().status);

  protected readonly time = computed(() =>
    new Date(this.message().timestamp).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
  );
}
