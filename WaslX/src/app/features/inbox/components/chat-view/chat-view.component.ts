import {
  AfterViewChecked,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  input,
  output,
  viewChild
} from '@angular/core';

import { LanguageService, type TranslationKey } from '../../../../core/services/language.service';
import { AvatarComponent } from '../../../../shared/components/avatar/avatar.component';
import { IconComponent } from '../../../../shared/components/icon/icon.component';
import { MessageBubbleComponent } from '../message-bubble/message-bubble.component';
import { MessageComposerComponent } from '../message-composer/message-composer.component';
import type { ConversationMessage } from '../../models/message.model';

/** Right pane: conversation header, message thread (oldest→newest), and composer. */
@Component({
  selector: 'app-chat-view',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AvatarComponent, IconComponent, MessageBubbleComponent, MessageComposerComponent],
  template: `
    <section class="chat">
      <header class="chat__head">
        <app-avatar [name]="customerName()" [size]="42" />
        <div class="chat__who">
          <span class="chat__name">{{ customerName() }}</span>
          <span class="chat__phone">{{ customerPhone() }}</span>
        </div>
      </header>

      <div class="chat__scroll" #scroll>
        @if (hasMore()) {
          <button type="button" class="chat__older" (click)="loadOlder.emit()">{{ t('inboxLoadOlder') }}</button>
        }
        @if (loading() && messages().length === 0) {
          <div class="chat__state">{{ t('inboxLoading') }}</div>
        } @else if (messages().length === 0) {
          <div class="chat__state">{{ t('inboxThreadEmpty') }}</div>
        } @else {
          @for (m of messages(); track m.id) {
            <app-message-bubble
              [message]="m"
              [retryLabel]="t('inboxRetry')"
              [mediaUnavailableLabel]="t('inboxMediaUnavailable')"
              (retry)="retry.emit($event)"
            />
          }
        }
      </div>

      <app-message-composer
        [placeholder]="t('inboxComposerPlaceholder')"
        [captionPlaceholder]="t('inboxCaptionPlaceholder')"
        [attachLabel]="t('inboxAttachFile')"
        [removeAttachmentLabel]="t('inboxRemoveAttachment')"
        [sending]="sending()"
        (send)="send.emit($event)"
        (sendMedia)="sendMedia.emit($event)"
        (attachError)="attachError.emit($event)"
      />
    </section>
  `,
  styles: [`
    :host { display: block; height: 100%; }
    .chat { display: flex; flex-direction: column; height: 100%; min-width: 0; background: var(--surface-soft); }
    .chat__head {
      display: flex; align-items: center; gap: 12px;
      padding: 14px 18px;
      border-bottom: 1px solid var(--border-subtle);
      background: var(--surface);
    }
    .chat__who { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
    .chat__name { font-size: 0.96rem; font-weight: 700; color: var(--text-primary); }
    .chat__phone { font-size: 0.76rem; color: var(--text-muted); font-variant-numeric: tabular-nums; }
    .chat__scroll {
      flex: 1 1 auto;
      display: flex;
      flex-direction: column;
      gap: 10px;
      padding: 20px;
      overflow-y: auto;
      min-height: 0;
    }
    .chat__older {
      align-self: center;
      margin-bottom: 4px;
      padding: 6px 14px;
      border: 1px solid var(--border-subtle);
      border-radius: 999px;
      background: var(--surface);
      color: var(--text-secondary);
      font-size: 0.78rem;
      font-weight: 600;
      cursor: pointer;
    }
    .chat__state {
      margin: auto;
      color: var(--text-muted);
      font-size: 0.88rem;
    }
  `]
})
export class ChatViewComponent implements AfterViewChecked {
  private readonly language = inject(LanguageService);

  readonly customerName = input('');
  readonly customerPhone = input('');
  readonly conversationId = input<number | null>(null);
  /** Unread count captured at the moment this conversation was opened (0 = no override). */
  readonly initialUnreadCount = input(0);
  readonly messages = input<ConversationMessage[]>([]);
  readonly loading = input(false);
  readonly sending = input(false);
  readonly hasMore = input(false);

  readonly send = output<string>();
  readonly sendMedia = output<{ file: File; caption: string }>();
  readonly attachError = output<'too-large'>();
  readonly loadOlder = output<void>();
  readonly retry = output<number>();

  private readonly scrollRef = viewChild<ElementRef<HTMLElement>>('scroll');
  private lastCount = 0;
  private lastConversationId: number | null = null;
  private armedUnread = 0;

  protected t = (key: TranslationKey): string => this.language.text(key);

  // Keep the thread pinned to the latest message when new ones arrive and the agent
  // was already near the bottom (don't yank their position while reading history).
  // On first opening a conversation with unread messages, scroll to the earliest unread
  // one instead (WhatsApp-style) rather than always landing at the top of the whole thread.
  ngAfterViewChecked(): void {
    const el = this.scrollRef()?.nativeElement;
    if (!el) return;

    const convId = this.conversationId();
    if (convId !== this.lastConversationId) {
      this.lastConversationId = convId;
      this.lastCount = 0;
      this.armedUnread = this.initialUnreadCount();
    }

    const count = this.messages().length;
    if (count === this.lastCount) return;
    const grew = count > this.lastCount;
    this.lastCount = count;

    if (grew && count > 0 && this.armedUnread > 0) {
      const unread = this.armedUnread;
      this.armedUnread = 0; // one-shot
      const targetId = this.findFirstUnreadId(unread);
      const target = targetId != null ? (el.querySelector(`[data-mid="${targetId}"]`) as HTMLElement | null) : null;
      if (target) {
        target.scrollIntoView({ block: 'start' });
      } else {
        el.scrollTop = el.scrollHeight;
      }
      return;
    }

    const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 160;
    if (grew && nearBottom) {
      el.scrollTop = el.scrollHeight;
    }
  }

  /** Walks messages (oldest→newest) from the end to find the earliest of the last N inbound (Customer) messages. */
  private findFirstUnreadId(unreadCount: number): number | null {
    const msgs = this.messages();
    let seen = 0;
    for (let i = msgs.length - 1; i >= 0; i--) {
      if (msgs[i].senderType === 'Customer') {
        seen++;
        if (seen === unreadCount) return msgs[i].id;
      }
    }
    return null;
  }
}
