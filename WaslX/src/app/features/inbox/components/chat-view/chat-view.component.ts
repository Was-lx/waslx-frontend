import {
  AfterViewChecked,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
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
          @if (detail()) {
            @if (!windowClosed()) {
              <span class="chat__window chat__window--open" [title]="t('windowOpen')">
                <span class="chat__window-dot"></span>
                {{ t('windowOpen') }}
                @if (countdown()) {
                  <span class="chat__window-time">{{ t('windowRemaining') }} {{ countdown() }}</span>
                }
              </span>
            } @else {
              <span class="chat__window chat__window--closed" [title]="t('windowClosed')">
                <span class="chat__window-dot"></span>
                {{ t('windowClosed') }}
              </span>
            }
          }
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
          [loading]="detailLoading()"
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
    .chat__window {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      margin-inline-start: auto;
      padding: 5px 11px;
      border-radius: 999px;
      font-size: 0.74rem;
      font-weight: 600;
      white-space: nowrap;
    }
    .chat__window-dot { width: 8px; height: 8px; border-radius: 50%; flex: 0 0 auto; }
    .chat__window--open { background: color-mix(in srgb, #16a34a 12%, var(--surface)); color: #15803d; }
    .chat__window--open .chat__window-dot { background: #16a34a; }
    .chat__window--closed { background: color-mix(in srgb, #d97706 12%, var(--surface)); color: #b45309; }
    .chat__window--closed .chat__window-dot { background: #d97706; }
    .chat__window-time { font-variant-numeric: tabular-nums; font-weight: 500; opacity: 0.85; }
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

  // Ticks on an interval so the 24h window also CLOSES on its own the moment it expires — without
  // needing a new server event or a manual refresh. The instant a customer reply arrives, the parent
  // reloads `detail` (fresh lastInboundAt), which re-opens the window immediately.
  private readonly nowTick = signal(Date.now());

  constructor() {
    const destroyRef = inject(DestroyRef);
    const timer = setInterval(() => this.nowTick.set(Date.now()), 30_000);
    destroyRef.onDestroy(() => clearInterval(timer));
  }

  /** True until the conversation detail (and thus the window state) has loaded — composer stays neutral. */
  protected readonly detailLoading = computed(() => this.detail() === null);

  /**
   * 24-hour window is closed once now passes the server's WindowExpiresAt (a Meta-sourced mirror:
   * customer's last inbound + 24h, extended by the status-webhook expiry), or when it was never
   * opened. While detail is still loading we return false (not "closed") so the composer doesn't
   * flash the templates-only banner — the neutral loading state handles that instead. This is a
   * proactive UX hint only — Meta is the real authority: the backend always attempts the send and,
   * if Meta rejects with WhatsApp.WindowClosed, handledWindowClosed() locks the composer on the
   * corrected value.
   */
  protected readonly windowClosed = computed(() => {
    const d = this.detail();
    if (!d) return false;            // still loading — see detailLoading()
    if (!d.windowExpiresAt) return true;
    return this.nowTick() >= new Date(d.windowExpiresAt).getTime();
  });

  /** Milliseconds left in the 24-hour window (0 when closed / never opened). */
  protected readonly remainingMs = computed(() => {
    const d = this.detail();
    if (!d?.windowExpiresAt) return 0;
    return Math.max(0, new Date(d.windowExpiresAt).getTime() - this.nowTick());
  });

  /** Compact "Xh Ym" / "Ym" countdown shown beside the open-window status. */
  protected readonly countdown = computed(() => {
    const ms = this.remainingMs();
    if (ms <= 0) return '';
    const totalMin = Math.floor(ms / 60000);
    const h = Math.floor(totalMin / 60);
    const m = totalMin % 60;
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
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
