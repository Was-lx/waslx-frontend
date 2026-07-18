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
import { AssignmentBarComponent, type AssignEvent } from '../assignment-bar/assignment-bar.component';
import { ConversationSummaryComponent } from '../conversation-summary/conversation-summary.component';
import { AiSkeletonComponent } from '../ai-skeleton/ai-skeleton.component';
import { IconComponent } from '../../../../shared/components/icon/icon.component';
import { EscalationRecommendationComponent } from '../escalation-recommendation/escalation-recommendation.component';
import { EscalationOwnershipTransferredComponent } from '../escalation-ownership-transferred/escalation-ownership-transferred.component';
import { EscalationOverrideDialogComponent, type AgentOption } from '../escalation-override-dialog/escalation-override-dialog.component';
import { ConversationBadgesComponent } from '../conversation-badges/conversation-badges.component';
import { EscalationStatusChipComponent } from '../escalation-status-chip/escalation-status-chip.component';
import type { ConversationDetail, ConversationNote, ConversationSummary } from '../../models/conversation.model';
import type { ConversationMessage } from '../../models/message.model';
import type { ConversationClassificationBadgeData } from '../../models/conversation-classification.model';
import type { EscalationRecommendation, OwnershipTransferredPayload } from '../../models/escalation-recommendation.model';
import type { Assignment } from '../../../../core/api/assignment-api.service';
import type { Tag } from '../../../../core/api/tags-api.service';
import type { User } from '../../../../core/api/users-api.service';
import type { Group } from '../../../../core/api/groups-api.service';

/** Right pane: conversation header, message thread, composer, template picker, and context panel. */
@Component({
  selector: 'app-chat-view',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AvatarComponent, MessageBubbleComponent, MessageComposerComponent,
    ContextPanelComponent, TemplatePickerComponent, AssignmentBarComponent,
    ConversationSummaryComponent, AiSkeletonComponent, IconComponent,
    EscalationRecommendationComponent, EscalationOwnershipTransferredComponent, EscalationOverrideDialogComponent,
    ConversationBadgesComponent, EscalationStatusChipComponent
  ],
  template: `
    <div class="chat-wrap">
      <section class="chat">
        <header class="chat__head">
          <app-avatar [name]="customerName()" [size]="42" />
          <div class="chat__who">
            <span class="chat__name">{{ customerName() }}</span>
            <span class="chat__phone">{{ customerPhone() }}</span>
            <div class="chat__badges">
              <app-escalation-status-chip
                [status]="badgeData()?.escalationStatus"
                [escalate]="badgeData()?.escalate"
              />
              <app-conversation-badges [data]="badgeData()" />
            </div>
          </div>

          @if (aiActive()) {
            <button type="button" class="chat__takeover" [title]="t('aiTakeOverTitle')"
                    [disabled]="takingOver()" (click)="takeOver.emit()">
              <app-icon name="sparkles" [size]="14" />
              <span>{{ t('aiTakeOver') }}</span>
            </button>
          }

          <app-assignment-bar
            class="chat__tools"
            [detail]="detail()"
            [users]="users()"
            [tags]="tags()"
            [assignments]="assignments()"
            [assigning]="assigning()"
            [loadingHistory]="loadingAssignments()"
            [statusChanging]="statusChanging()"
            [infoOpen]="infoOpen()"
            (assign)="assign.emit($event)"
            (applyTag)="applyTag.emit($event)"
            (removeTag)="removeTag.emit($event)"
            (openHistory)="loadAssignments.emit()"
            (changeStatus)="changeStatus.emit($event)"
            (toggleInfo)="infoOpen.set(!infoOpen())"
          />
        </header>

        @if (detail()) {
          <div class="chat__window" [class.chat__window--closed]="windowClosed()" [class.chat__window--open]="!windowClosed()">
            <span class="chat__window-dot"></span>
            @if (!windowClosed()) {
              <span class="chat__window-label">
                @if (detail()?.windowType === 'FreeEntryPoint72h') { 72h Free Entry } @else { 24h Customer Service }
              </span>
              @if (countdown()) {
                <span class="chat__window-time">{{ t('windowRemaining') }} {{ countdown() }}</span>
              }
            } @else {
              <span class="chat__window-label">{{ t('windowClosed') }}</span>
            }
          </div>
        }

        @if (detail() || summary() || summaryLoading()) {
          <app-conversation-summary
            [summary]="summary()"
            [loading]="summaryLoading()"
            [fullLoading]="summaryFullLoading()"
            [error]="summaryError()"
            [slow]="summarySlow()"
            (generateFull)="generateSummary.emit()"
            (refresh)="refreshSummary.emit()"
            (retry)="retrySummary.emit()"
          />
        }

        <div class="chat__escalation">
          <app-escalation-ownership-transferred
            [isWaiting]="!!escalationOwnershipTransfer() && escalationOwnershipTransfer()!.transitionType === 'Recommend'"
            [isTransferred]="!!escalationOwnershipTransfer() && escalationOwnershipTransfer()!.transitionType !== 'Recommend'"
          />
          <app-escalation-recommendation
            [recommendation]="escalationRecommendation()"
            [isManagerOrAdmin]="isManagerOrAdmin()"
            (confirm)="escalationConfirm.emit($event)"
            (override)="escalationOverride.emit()"
          />
        </div>

        @if (showOverrideDialog()) {
          <app-escalation-override-dialog
            [recommendation]="escalationRecommendation()"
            [agents]="escalationAgents()"
            (confirm)="escalationOverrideSubmit.emit($event)"
            (cancel)="onOverrideCancel()"
          />
        }

        <div class="chat__body">
        <div class="chat__scroll" #scroll>
          @if (hasMore()) {
            <button type="button" class="chat__older" (click)="loadOlder.emit()">{{ t('inboxLoadOlder') }}</button>
          }
          @if (loading() && messages().length === 0) {
            <div class="chat__state">{{ t('inboxLoading') }}</div>
          } @else if (messages().length === 0) {
            <div class="chat__state">{{ t('inboxThreadEmpty') }}</div>
          } @else {
            @for (m of messages(); track m.id; let idx = $index) {
              @if (showDaySep(idx)) {
                <div class="chat__daysep"><span>{{ daySepLabel(m) }}</span></div>
              }
              <app-message-bubble
                [message]="m"
                [retryLabel]="t('inboxRetry')"
                [mediaUnavailableLabel]="t('inboxMediaUnavailable')"
                [aiLabel]="t('aiRepliedBy')"
                (retry)="retry.emit($event)"
              />
            }
          }
          @if (aiTyping()) {
            <div class="chat__ai-typing">
              <app-ai-skeleton variant="typing" [label]="t('aiTyping')" />
            </div>
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

          <!-- Customer / context drawer — overlays the thread body only (header + toolbar stay clickable) -->
          @if (infoOpen()) {
            <div class="chat__scrim" (click)="infoOpen.set(false)" aria-hidden="true"></div>
            <app-context-panel
              class="chat__drawer"
              [detail]="detail()"
              [notes]="notes()"
              [addingNote]="addingNote()"
              [statusChanging]="statusChanging()"
              [groups]="groups()"
              [currentGroupId]="currentGroupId()"
              [routing]="routing()"
              (changeStatus)="changeStatus.emit($event)"
              (addNote)="addNote.emit($event)"
              (route)="route.emit($event)"
              (handoff)="handoff.emit($event)"
              (close)="infoOpen.set(false)"
            />
          }
        </div>
      </section>
    </div>
  `,
  styles: [`
    :host { display: block; height: 100%; }
    .chat-wrap { position: relative; display: flex; height: 100%; min-width: 0; overflow: hidden; }
    .chat { position: relative; flex: 1 1 auto; display: flex; flex-direction: column; height: 100%; min-width: 0; background: var(--surface-soft); }
    /* Thread body — messages + composer; the context drawer overlays only this region (not the header). */
    .chat__body { position: relative; flex: 1 1 auto; min-height: 0; display: flex; flex-direction: column; overflow: hidden; }
    .chat__head {
      display: flex; align-items: center; gap: 12px;
      padding: 12px 18px;
      border-bottom: 1px solid var(--border-subtle);
      background: var(--surface);
    }
    .chat__who { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
    .chat__name { font-size: 0.98rem; font-weight: 700; color: var(--text-primary); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .chat__phone { font-size: 0.76rem; color: var(--text-muted); font-variant-numeric: tabular-nums; }
    .chat__badges { display: flex; align-items: center; gap: 6px; margin-top: 2px; }
    .chat__tools { flex: 0 0 auto; }
    /* "Take over from AI" — pinned to the header inline-end, before the tools bar (FE-4.1). */
    .chat__takeover {
      margin-inline-start: auto; flex: 0 0 auto;
      display: inline-flex; align-items: center; gap: 6px;
      padding: 7px 12px; border-radius: 10px;
      border: 1px solid color-mix(in srgb, var(--accent) 45%, var(--border-soft));
      background: color-mix(in srgb, var(--accent) 10%, var(--surface));
      color: var(--accent); font-size: 0.8rem; font-weight: 700; cursor: pointer;
      transition: background-color 150ms ease, border-color 150ms ease;
    }
    .chat__takeover:hover:not(:disabled) { background: color-mix(in srgb, var(--accent) 16%, var(--surface)); }
    .chat__takeover:disabled { opacity: 0.55; cursor: not-allowed; }
    .chat__takeover svg { fill: none; stroke: currentColor; stroke-width: 2; }
    /* When no take-over button is present the tools bar carries the auto-margin instead. */
    .chat__head:not(:has(.chat__takeover)) .chat__tools { margin-inline-start: auto; }
    .chat__ai-typing { align-self: flex-start; padding: 6px 4px; }
    /* Slim 24/72h window strip below the header (full width, subtle) */
    .chat__window {
      display: flex; align-items: center; gap: 8px;
      padding: 6px 20px;
      font-size: 0.75rem; font-weight: 650;
      border-bottom: 1px solid var(--border-subtle);
    }
    .chat__window-dot { width: 8px; height: 8px; border-radius: 50%; flex: 0 0 auto; }
    .chat__window-label { white-space: nowrap; }
    .chat__window-time { margin-inline-start: auto; font-variant-numeric: tabular-nums; font-weight: 600; opacity: 0.9; }
    .chat__window--open { background: color-mix(in srgb, #16a34a 8%, var(--surface)); color: #15803d; }
    .chat__window--open .chat__window-dot { background: #16a34a; box-shadow: 0 0 0 3px color-mix(in srgb, #16a34a 20%, transparent); }
    .chat__window--closed { background: color-mix(in srgb, #d97706 9%, var(--surface)); color: #b45309; }
    .chat__window--closed .chat__window-dot { background: #d97706; }
    /* Context drawer — slides over the thread from the inline-end edge */
    .chat__drawer {
      position: absolute; inset-block: 0; inset-inline-end: 0;
      z-index: 8; width: min(360px, 88%);
      box-shadow: -14px 0 40px -18px color-mix(in srgb, var(--text-primary) 40%, transparent);
      animation: drawer-in 200ms var(--ease-out, ease);
    }
    .chat__scrim { position: absolute; inset: 0; z-index: 7; background: color-mix(in srgb, var(--text-primary) 12%, transparent); animation: scrim-in 200ms ease; }
    @keyframes drawer-in { from { transform: translateX(var(--drawer-from, 12px)); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
    @keyframes scrim-in { from { opacity: 0; } to { opacity: 1; } }
    :host-context([dir="rtl"]) .chat__drawer { --drawer-from: -12px; }
    .chat__scroll {
      flex: 1 1 auto;
      display: flex;
      flex-direction: column;
      gap: 10px;
      padding: 22px 24px;
      overflow-y: auto;
      min-height: 0;
      /* Warm, WhatsApp-like canvas: a whisper-faint dot texture over a soft vertical wash,
         so the thread never reads as a flat empty void. Pure CSS (CSP-safe). */
      background-color: var(--surface-soft);
      background-image:
        radial-gradient(circle, color-mix(in srgb, var(--text-primary) 4.5%, transparent) 1px, transparent 1.4px),
        linear-gradient(180deg, color-mix(in srgb, var(--primary) 3%, transparent), transparent 220px);
      background-size: 22px 22px, 100% 100%;
      background-attachment: local, local;
    }
    /* Day divider between message groups (Today / Yesterday / date). */
    .chat__daysep { display: flex; align-items: center; gap: 12px; margin: 8px 2px; }
    .chat__daysep::before, .chat__daysep::after {
      content: ''; flex: 1 1 auto; height: 1px;
      background: linear-gradient(90deg, transparent, color-mix(in srgb, var(--text-primary) 10%, transparent), transparent);
    }
    .chat__daysep span {
      flex: 0 0 auto; padding: 4px 12px; border-radius: 999px;
      font-size: 0.68rem; font-weight: 700; letter-spacing: 0.01em;
      color: var(--text-secondary);
      background: color-mix(in srgb, var(--surface) 82%, transparent);
      border: 1px solid var(--border-subtle);
      box-shadow: var(--shadow-xs);
      backdrop-filter: blur(4px);
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
    .chat__escalation {
      padding: 8px 24px 0;
      display: flex;
      flex-direction: column;
      gap: 8px;
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
  // Assignment + tagging
  readonly users = input<User[]>([]);
  readonly tags = input<Tag[]>([]);
  readonly assignments = input<Assignment[]>([]);
  readonly assigning = input(false);
  readonly loadingAssignments = input(false);
  // Team routing / cross-team handoff
  readonly groups = input<Group[]>([]);
  readonly currentGroupId = input<number | null>(null);
  readonly routing = input(false);
  // AI conversation summary (FE-4.3)
  readonly summary = input<ConversationSummary | null>(null);
  readonly summaryLoading = input(false);
  readonly summaryFullLoading = input(false);
  readonly summaryError = input(false);
  readonly summarySlow = input(false);
  // AI Agent presence (FE-4.1)
  readonly aiTyping = input(false);
  readonly takingOver = input(false);
  // Badges (FE-4.4)
  readonly badgeData = input<ConversationClassificationBadgeData | null>(null);

  // Escalation screening (FE-4.2)
  readonly escalationRecommendation = input<EscalationRecommendation | null>(null);
  readonly escalationOwnershipTransfer = input<OwnershipTransferredPayload | null>(null);
  readonly isManagerOrAdmin = input(false);
  readonly escalationAgents = input<AgentOption[]>([]);
  readonly escalationConfirming = input(false);
  readonly showOverrideDialog = input(false);

  readonly send = output<string>();
  readonly sendMedia = output<{ file: File; caption: string }>();
  readonly attachError = output<'too-large' | 'unsupported-type'>();
  readonly loadOlder = output<void>();
  readonly retry = output<number>();
  readonly changeStatus = output<string>();
  readonly addNote = output<string>();
  readonly sendTemplate = output<TemplateSendPayload>();
  readonly assign = output<AssignEvent>();
  readonly applyTag = output<number>();
  readonly removeTag = output<number>();
  readonly loadAssignments = output<void>();
  readonly route = output<number>();
  readonly handoff = output<number>();
  // AI conversation summary (FE-4.3)
  readonly generateSummary = output<void>();
  readonly refreshSummary = output<void>();
  readonly retrySummary = output<void>();
  // AI Agent presence (FE-4.1)
  readonly takeOver = output<void>();
  // Escalation screening (FE-4.2)
  readonly escalationConfirm = output<{ escalationId: number; assigneeId: number }>();
  readonly escalationOverride = output<void>();
  readonly escalationOverrideSubmit = output<{ escalationId: number; assigneeId: number; reason: string }>();
  readonly escalationOverrideCancel = output<void>();

  /** True while the AI Agent is the most recent responder — surfaces the "Take over" affordance. */
  protected readonly aiActive = computed(() => {
    const msgs = this.messages();
    for (let i = msgs.length - 1; i >= 0; i--) {
      if (msgs[i].senderType === 'Customer') return false;
      if (msgs[i].senderType === 'AI') return true;
    }
    return false;
  });

  protected readonly showPicker = signal(false);
  /** Whether the customer/context drawer is open (toggled by the profile button in the header toolbar). */
  protected readonly infoOpen = signal(false);

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

  /** Milliseconds left in the 24/72-hour window (0 when closed / never opened). */
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

  protected onOverrideCancel(): void {
    this.escalationOverrideCancel.emit();
  }

  /** True for the first message and whenever the calendar day changes from the previous message. */
  protected showDaySep(idx: number): boolean {
    if (idx <= 0) return true;
    const msgs = this.messages();
    const cur = msgs[idx]?.timestamp;
    const prev = msgs[idx - 1]?.timestamp;
    if (!cur || !prev) return false;
    return !this.sameDay(new Date(cur), new Date(prev));
  }

  private sameDay(a: Date, b: Date): boolean {
    return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
  }

  /** "Today" / "Yesterday" / a short weekday-date label for the day divider. */
  protected daySepLabel(m: ConversationMessage): string {
    const d = new Date(m.timestamp);
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    if (this.sameDay(d, now)) return this.t('inboxToday');
    if (this.sameDay(d, yesterday)) return this.t('inboxYesterday');
    return d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
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
      this.infoOpen.set(false);
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
