import {
  AfterViewChecked,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  computed,
  inject,
  input,
  output,
  signal,
  viewChild
} from '@angular/core';

import { LanguageService, type TranslationKey } from '../../../../core/services/language.service';
import { AvatarComponent } from '../../../../shared/components/avatar/avatar.component';
import { MessageBubbleComponent } from '../message-bubble/message-bubble.component';
import { MessageComposerComponent } from '../message-composer/message-composer.component';
import { ContextPanelComponent } from '../context-panel/context-panel.component';
import { TemplatePickerComponent, type TemplateSendPayload } from '../template-picker/template-picker.component';
import type { ConversationDetail, ConversationNote } from '../../models/conversation.model';
import type { ConversationMessage } from '../../models/message.model';

const WINDOW_MS = 24 * 60 * 60 * 1000;

/** Right pane: conversation header, message thread, composer, template picker, and context panel. */
@Component({
  selector: 'app-chat-view',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AvatarComponent, MessageBubbleComponent, MessageComposerComponent,
    ContextPanelComponent, TemplatePickerComponent
  ],
  template: `
    <div class="chat-wrap">
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

        @if (showPicker()) {
          <app-template-picker [sending]="sending()" (close)="showPicker.set(false)" (send)="onPickerSend($event)" />
        }

        <app-message-composer
          [placeholder]="t('inboxComposerPlaceholder')"
          [captionPlaceholder]="t('inboxCaptionPlaceholder')"
          [attachLabel]="t('inboxAttachFile')"
          [templateLabel]="t('pickerButton')"
          [removeAttachmentLabel]="t('inboxRemoveAttachment')"
          [windowClosedTitle]="t('windowClosedTitle')"
          [windowClosedHint]="t('windowClosedHint')"
          [sending]="sending()"
          [windowClosed]="windowClosed()"
          [uploadProgress]="uploadProgress()"
          (send)="send.emit($event)"
          (sendMedia)="sendMedia.emit($event)"
          (attachError)="attachError.emit($event)"
          (openTemplates)="showPicker.set(true)"
        />
      </section>

      <app-context-panel
        class="chat__context"
        [detail]="detail()"
        [notes]="notes()"
        [addingNote]="addingNote()"
        [statusChanging]="statusChanging()"
        (changeStatus)="changeStatus.emit($event)"
        (addNote)="addNote.emit($event)"
      />
    </div>
  `,
  styles: [`
    :host { display: block; height: 100%; }
    .chat-wrap { display: flex; height: 100%; min-width: 0; }
    .chat { position: relative; flex: 1 1 auto; display: flex; flex-direction: column; height: 100%; min-width: 0; background: var(--surface-soft); }
    .chat__context { flex: 0 0 300px; }
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
    @media (max-width: 1100px) {
      .chat__context { display: none; }
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
  readonly detail = input<ConversationDetail | null>(null);
  readonly notes = input<ConversationNote[]>([]);
  readonly addingNote = input(false);
  readonly statusChanging = input(false);
  readonly uploadProgress = input<number | null>(null);

  readonly send = output<string>();
  readonly sendMedia = output<{ file: File; caption: string }>();
  readonly attachError = output<'too-large' | 'unsupported-type'>();
  readonly loadOlder = output<void>();
  readonly retry = output<number>();
  readonly changeStatus = output<string>();
  readonly addNote = output<string>();
  readonly sendTemplate = output<TemplateSendPayload>();

  protected readonly showPicker = signal(false);

  /** 24-hour window is closed when the customer hasn't messaged in the last 24h (or never has). */
  protected readonly windowClosed = computed(() => {
    const d = this.detail();
    if (!d || !d.lastInboundAt) return true;
    return Date.now() - new Date(d.lastInboundAt).getTime() >= WINDOW_MS;
  });

  private readonly scrollRef = viewChild<ElementRef<HTMLElement>>('scroll');
  private lastCount = 0;
  private lastConversationId: number | null = null;
  private armedUnread = 0;

  protected t = (key: TranslationKey): string => this.language.text(key);

  protected onPickerSend(payload: TemplateSendPayload): void {
    this.sendTemplate.emit(payload);
    this.showPicker.set(false);
  }

  ngAfterViewChecked(): void {
    const el = this.scrollRef()?.nativeElement;
    if (!el) return;

    const convId = this.conversationId();
    if (convId !== this.lastConversationId) {
      this.lastConversationId = convId;
      this.lastCount = 0;
      this.armedUnread = this.initialUnreadCount();
      this.showPicker.set(false);
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
