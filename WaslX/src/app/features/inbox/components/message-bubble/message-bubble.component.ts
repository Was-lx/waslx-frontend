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
    <div
      class="bubble"
      [attr.data-mid]="message().id"
      [class.bubble--in]="incoming()"
      [class.bubble--out]="!incoming()"
      [class.bubble--sticker]="kind() === 'Sticker'"
    >
      @if (message().mediaUrl; as url) {
        @switch (kind()) {
          @case ('Image') {
            <a class="bubble__media-link" [href]="url" target="_blank" rel="noopener">
              <img class="bubble__media" [src]="url" [alt]="message().mediaFileName || 'image'" />
            </a>
          }
          @case ('Sticker') {
            <img class="bubble__sticker-img" [src]="url" alt="sticker" />
          }
          @case ('Video') {
            <video class="bubble__media" [src]="url" controls></video>
          }
          @case ('Audio') {
            <audio class="bubble__audio" [src]="url" controls></audio>
          }
          @case ('Document') {
            <a class="bubble__doc" [href]="url" target="_blank" rel="noopener" [download]="message().mediaFileName || true">
              <app-icon name="folder" [size]="18" />
              <span class="bubble__doc-name">{{ message().mediaFileName || url }}</span>
            </a>
          }
        }
      } @else if (isMediaKind()) {
        <p class="bubble__text bubble__text--muted">{{ mediaUnavailableLabel() }}</p>
      }
      @if (message().content) {
        <p class="bubble__text">{{ message().content }}</p>
      }
      <span class="bubble__foot">
        <span class="bubble__time">{{ time() }}</span>
        @if (!incoming()) {
          <span class="bubble__status" [class]="statusClass()" [attr.aria-label]="statusLabel()" [title]="statusLabel()">
            @switch (message().status) {
              @case ('Failed') { <app-icon name="x" [size]="13" /> }
              @case ('Queued') { <app-icon name="clock" [size]="12" /> }
              @case ('Sent') { <app-icon name="check" [size]="13" /> }
              @case ('Delivered') { <app-icon name="check-check" [size]="15" /> }
              @case ('Read') { <app-icon name="check-check" [size]="15" /> }
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
    .bubble__text--muted { opacity: 0.75; font-style: italic; }
    .bubble__media-link { display: block; }
    .bubble__media {
      display: block;
      max-width: 100%;
      max-height: 320px;
      border-radius: 10px;
      margin-bottom: 4px;
    }
    .bubble--sticker {
      background: transparent !important;
      border: 0 !important;
      box-shadow: none !important;
      padding: 2px !important;
    }
    .bubble__sticker-img { display: block; width: 120px; height: 120px; object-fit: contain; }
    .bubble__audio { display: block; max-width: 260px; margin-bottom: 4px; }
    .bubble__doc {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 10px;
      border-radius: 10px;
      background: color-mix(in srgb, currentColor 8%, transparent);
      text-decoration: none;
      color: inherit;
      margin-bottom: 4px;
    }
    .bubble__doc-name {
      font-size: 0.82rem;
      font-weight: 600;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      max-width: 220px;
    }
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
  /** Localised label shown when a media message failed to download/store. */
  readonly mediaUnavailableLabel = input('Media unavailable');
  readonly retry = output<number>();

  protected readonly incoming = computed(() => this.message().senderType === 'Customer');

  protected readonly kind = computed(() => this.message().messageType);
  protected readonly isMediaKind = computed(() =>
    ['Image', 'Document', 'Audio', 'Video', 'Sticker'].includes(this.kind())
  );

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
