import { Component, DestroyRef, OnDestroy, OnInit, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { LanguageService, type TranslationKey } from '../../../../core/services/language.service';
import { ToastService } from '../../../../core/services/toast.service';
import { AuthSessionService } from '../../../../core/services/auth-session.service';
import { InboxRealtimeService, type RealtimeAiModeChanged, type RealtimeConversation, type RealtimeMessage, type RealtimeNote, type RealtimeStatus } from '../../../../core/services/inbox-realtime.service';
import { WhatsAppApiService, type WhatsAppAccountSummary } from '../../../../core/api/whatsapp-api.service';
import { AssignmentApiService, type Assignment, type UnassignedConversation } from '../../../../core/api/assignment-api.service';
import { TagsApiService, type Tag } from '../../../../core/api/tags-api.service';
import { GroupsApiService, type Group } from '../../../../core/api/groups-api.service';
import { UsersApiService, type User } from '../../../../core/api/users-api.service';
import { AiAgentApiService } from '../../../../core/api/ai-agent-api.service';
import { EscalationStore } from '../../store/escalation.store';
import { ConversationBadgesStore } from '../../store/conversation-badges.store';
import { EscalationRealtimeService } from '../../services/escalation-realtime.service';
import { EscalationApiService } from '../../services/escalation-api.service';
import type { OwnershipTransferredPayload } from '../../models/escalation-recommendation.model';
import type { AgentOption } from '../../components/escalation-override-dialog/escalation-override-dialog.component';
import { apiError, apiErrorMessage } from '../../../../core/utils/api-error';
import { IconComponent } from '../../../../shared/components/icon/icon.component';
import { ConversationCardComponent } from '../../components/conversation-card/conversation-card.component';
import { ChatViewComponent } from '../../components/chat-view/chat-view.component';
import { NumberRailComponent } from '../../components/number-rail/number-rail.component';
import { InboxFiltersComponent, EMPTY_INBOX_FILTER, type InboxFilterValue } from '../../components/inbox-filters/inbox-filters.component';
import type { AssignEvent } from '../../components/assignment-bar/assignment-bar.component';
import { ConversationsApiService, type ConversationListFilters } from '../../services/conversations-api.service';
import type { ConversationClassificationBadgeData } from '../../models/conversation-classification.model';
import type { ConversationDetail, ConversationListItem, ConversationNote, ConversationSummary } from '../../models/conversation.model';
import type { ConversationMessage } from '../../models/message.model';
import type { TemplateSendPayload } from '../../components/template-picker/template-picker.component';
import { NewConversationDialogComponent, type NewConversationSend } from '../../components/new-conversation-dialog/new-conversation-dialog.component';
import { TemplatesApiService } from '../../../../core/api/templates-api.service';
import type { Template } from '../../../templates/models/template.model';

// SignalR pushes changes live; this slow sweep only backstops a missed event / dropped connection.
const FALLBACK_REFRESH_MS = 60_000;
// Debounce for filter-driven list reloads (covers text search typing without hammering the API).
const FILTER_DEBOUNCE_MS = 220;

/** The conversation currently open in the thread pane (from either the inbox list or the queue). */
interface OpenConversation {
  id: number;
  customerName: string;
  customerPhone: string;
  unreadCount: number;
}

@Component({
  selector: 'app-inbox',
  standalone: true,
  imports: [ConversationCardComponent, ChatViewComponent, NumberRailComponent, InboxFiltersComponent, IconComponent, NewConversationDialogComponent],
  templateUrl: './inbox.page.html',
  styleUrl: './inbox.page.css'
})
export class InboxPageComponent implements OnInit, OnDestroy {
  private readonly api = inject(ConversationsApiService);
  private readonly whatsapp = inject(WhatsAppApiService);
  private readonly assignmentApi = inject(AssignmentApiService);
  private readonly tagsApi = inject(TagsApiService);
  private readonly groupsApi = inject(GroupsApiService);
  private readonly usersApi = inject(UsersApiService);
  private readonly templatesApi = inject(TemplatesApiService);
  private readonly realtime = inject(InboxRealtimeService);
  private readonly language = inject(LanguageService);
  private readonly toast = inject(ToastService);
  private readonly auth = inject(AuthSessionService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly conversations = signal<ConversationListItem[]>([]);
  protected readonly selectedId = signal<number | null>(null);
  protected readonly openConv = signal<OpenConversation | null>(null);
  protected readonly messages = signal<ConversationMessage[]>([]);
  protected readonly detail = signal<ConversationDetail | null>(null);
  protected readonly notes = signal<ConversationNote[]>([]);
  protected readonly listLoading = signal(true);
  protected readonly threadLoading = signal(false);
  protected readonly sending = signal(false);
  protected readonly addingNote = signal(false);
  protected readonly statusChanging = signal(false);
  protected readonly uploadProgress = signal<number | null>(null);
  protected readonly hasMore = signal(false);
  protected readonly scrollUnreadCount = signal(0);

  // ── AI conversation summary (FE-4.3 / US-4.7) ───────────────────────────────
  protected readonly summary = signal<ConversationSummary | null>(null);
  protected readonly summaryLoading = signal(false);
  protected readonly summaryFullLoading = signal(false);
  protected readonly summaryError = signal(false);
  protected readonly summarySlow = signal(false);
  private summarySlowTimer: ReturnType<typeof setTimeout> | null = null;

  // ── AI Agent presence (FE-4.1) ──────────────────────────────────────────────
  // `aiTyping` is driven by a future realtime "AI Agent typing" event (US-4.6); kept wired for later.
  protected readonly aiTyping = signal(false);
  protected readonly aiModeChanging = signal(false);

  // ── Escalation screening (FE-4.2) ────────────────────────────────────────────
  private readonly escalationStore = inject(EscalationStore);
  private readonly badgesStore = inject(ConversationBadgesStore);
  private readonly escalationRealtime = inject(EscalationRealtimeService);
  private readonly escalationApi = inject(EscalationApiService);
  protected readonly escalationRecommendation = computed(() => {
    const id = this.selectedId();
    return id != null ? this.escalationStore.getRecommendation(id) ?? null : null;
  });
  protected readonly escalationOwnershipTransfer = computed<OwnershipTransferredPayload | null>(() => {
    const id = this.selectedId();
    return id != null ? this.escalationStore.getOwnershipTransfer(id) ?? null : null;
  });
  protected readonly isManagerOrAdmin = computed(() => {
    const role = this.auth.userProfile()?.role;
    return role === 'Admin' || role === 'Manager';
  });
  protected readonly escalationAgents = computed<AgentOption[]>(() =>
    this.users().map((u) => ({ id: Number(u.id), name: u.name }))
  );
  protected readonly escalationConfirming = signal(false);
  protected readonly showOverrideDialog = signal(false);

  // Badges (FE-4.4)
  protected readonly badgeData = computed(() => {
    const id = this.selectedId();
    return id != null ? this.badgesStore.getBadgeData(id) ?? null : null;
  });
  protected badgeFor(id: number): ConversationClassificationBadgeData | null {
    return this.badgesStore.getBadgeData(id);
  }

  // ── Number rail + filters + views ───────────────────────────────────────────
  protected readonly accounts = signal<WhatsAppAccountSummary[]>([]);
  protected readonly selectedAccountId = signal<number | null>(null);
  protected readonly filter = signal<InboxFilterValue>({ ...EMPTY_INBOX_FILTER });
  protected readonly view = signal<'inbox' | 'queue'>('inbox');
  protected readonly queue = signal<UnassignedConversation[]>([]);
  protected readonly queueLoading = signal(false);

  // ── Facets (assignment + tagging + filters) ─────────────────────────────────
  protected readonly groups = signal<Group[]>([]);
  protected readonly tags = signal<Tag[]>([]);
  protected readonly users = signal<User[]>([]);
  protected readonly assignments = signal<Assignment[]>([]);
  protected readonly assigning = signal(false);
  protected readonly loadingAssignments = signal(false);

  // ── New-conversation dialog (message a brand-new number) ────────────────────
  protected readonly templates = signal<Template[]>([]);
  protected readonly newConvOpen = signal(false);
  protected readonly newConvSending = signal(false);
  // After a "+" send, remember the number so the reloaded list auto-opens that new conversation.
  private pendingSelectPhone: string | null = null;

  // ── Team routing / cross-team handoff ───────────────────────────────────────
  // The detail endpoint doesn't carry the current group, so we track the last team the
  // conversation was routed / handed off to in-session to reflect it in the context panel.
  protected readonly routedGroupId = signal<number | null>(null);
  protected readonly routing = signal(false);

  protected readonly queueFiltered = computed(() => {
    const acc = this.selectedAccountId();
    const items = this.queue();
    return acc == null ? items : items.filter((i) => i.whatsAppAccountId === acc);
  });

  private fallback: ReturnType<typeof setInterval> | null = null;
  private filterTimer: ReturnType<typeof setTimeout> | null = null;

  protected t = (key: TranslationKey): string => this.language.text(key);
  protected direction = (): 'rtl' | 'ltr' => this.language.getDirection();

  ngOnInit(): void {
    this.loadList(true);
    this.loadAccounts();
    this.loadFacets();

    void this.realtime.start();
    this.realtime.messageReceived.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((m) => this.onRealtimeMessage(m));
    this.realtime.messageStatusChanged.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((s) => this.onRealtimeStatus(s));
    this.realtime.conversationChanged.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((c) => this.onRealtimeConversation(c));
    this.realtime.conversationAiModeChanged.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((p) => this.onConversationAiModeChanged(p));
    this.realtime.noteAdded.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((n) => this.onRealtimeNote(n));

    this.escalationStore.init();
    this.badgesStore.init();
    void this.escalationStore.loadSettings();
    this.escalationRealtime.escalationRecommendationUpdated.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((r) => this.onEscalationRecommendation(r));
    this.escalationRealtime.escalationAutoAssigned.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((r) => this.onEscalationAutoAssigned(r));
    this.escalationRealtime.conversationOwnershipTransferred.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((p) => this.onOwnershipTransferred(p));

    this.fallback = setInterval(() => this.refresh(), FALLBACK_REFRESH_MS);
  }

  ngOnDestroy(): void {
    if (this.fallback) clearInterval(this.fallback);
    if (this.filterTimer) clearTimeout(this.filterTimer);
    this.disarmSummarySlow();
    void this.realtime.stop();
  }

  // ── Number rail + filters + view switching ──────────────────────────────────
  protected onSelectAccount(id: number | null): void {
    this.selectedAccountId.set(id);
    if (this.view() === 'inbox') this.loadList(true);
  }

  protected onFilterChange(value: InboxFilterValue): void {
    this.filter.set(value);
    this.debouncedReload();
  }

  protected onClearFilters(): void {
    this.filter.set({ ...EMPTY_INBOX_FILTER });
    this.loadList(true);
  }

  protected setView(view: 'inbox' | 'queue'): void {
    if (this.view() === view) return;
    this.view.set(view);
    if (view === 'queue') this.loadQueue();
    else this.loadList(true);
  }

  private debouncedReload(): void {
    if (this.view() !== 'inbox') return;
    if (this.filterTimer) clearTimeout(this.filterTimer);
    this.filterTimer = setTimeout(() => this.loadList(true), FILTER_DEBOUNCE_MS);
  }

  /** Maps the number rail + UI filter model into the API query params. */
  private buildFilters(): ConversationListFilters {
    const f = this.filter();
    const filters: ConversationListFilters = {
      status: f.status,
      groupId: f.groupId,
      tagId: f.tagId,
      dateFrom: f.dateFrom,
      dateTo: f.dateTo,
      search: f.search,
      whatsAppAccountId: this.selectedAccountId(),
    };
    if (f.assignee === 'unassigned') filters.unassigned = true;
    else if (f.assignee === 'me') filters.assignedUserId = this.auth.userProfile()?.id ?? null;
    else if (f.assignee && f.assignee !== 'all') filters.assignedUserId = f.assignee;
    return filters;
  }

  // ── Selection ───────────────────────────────────────────────────────────────
  protected select(item: OpenConversation): void {
    const id = item.id;
    if (this.selectedId() === id) return;
    this.scrollUnreadCount.set(item.unreadCount);
    this.openConv.set(item);
    this.selectedId.set(id);
    this.messages.set([]);
    this.detail.set(null);
    this.notes.set([]);
    this.assignments.set([]);
    this.routedGroupId.set(null);
    this.resetSummary();
    this.loadMessages(id);
    this.loadDetail(id);
    this.loadNotes(id);
    this.loadSummary(id);
    this.markRead(id);
    this.realtime.joinConversation(id);
    void this.escalationStore.loadRecommendation(id);
  }

  protected selectCard(id: number): void {
    const c = this.conversations().find((x) => x.id === id);
    if (c) this.select({ id: c.id, customerName: c.customerName, customerPhone: c.customerPhone, unreadCount: c.unreadCount });
  }

  protected selectQueue(item: UnassignedConversation): void {
    this.select({
      id: item.conversationId,
      customerName: item.customerName || item.customerPhone,
      customerPhone: item.customerPhone,
      unreadCount: 0,
    });
  }

  /** Advances the server read-cursor and optimistically zeroes the local unread badge. */
  private markRead(id: number): void {
    this.zeroUnread(id);
    this.api.markRead(id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({ error: () => {} });
  }

  private zeroUnread(id: number): void {
    this.conversations.update((list) =>
      list.map((c) => (c.id === id && c.unreadCount > 0 ? { ...c, unreadCount: 0 } : c))
    );
  }

  // ── Send (unchanged behaviour) ──────────────────────────────────────────────
  protected onSend(text: string): void {
    const id = this.selectedId();
    if (id == null || this.sending()) return;

    const temp = this.optimistic(text, 'Text');
    this.messages.update((m) => [...m, temp]);
    this.sending.set(true);

    this.api.sendText(id, text).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => { this.sending.set(false); this.loadMessages(id); this.loadList(false); },
      error: (err) => {
        this.sending.set(false);
        this.markTempFailed(temp.id);
        if (!this.handledWindowClosed(err, id))
          this.toast.error(this.t('inboxSendErrorTitle'), this.t('inboxSendErrorMsg'));
      }
    });
  }

  protected onSendMedia({ file, caption }: { file: File; caption: string }): void {
    const id = this.selectedId();
    if (id == null || this.sending()) return;

    const previewUrl = URL.createObjectURL(file);
    const temp: ConversationMessage = { ...this.optimistic(caption, mapMediaKind(file.type)), mediaUrl: previewUrl, mediaMimeType: file.type, mediaFileName: file.name };
    this.messages.update((m) => [...m, temp]);
    this.sending.set(true);
    this.uploadProgress.set(0);

    this.api.sendMedia(id, file, caption).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (event) => {
        if (event.kind === 'progress') {
          this.uploadProgress.set(event.progress);
          return;
        }
        this.sending.set(false);
        this.uploadProgress.set(null);
        URL.revokeObjectURL(previewUrl);
        this.loadMessages(id);
        this.loadList(false);
      },
      error: (err) => {
        this.sending.set(false);
        this.uploadProgress.set(null);
        this.markTempFailed(temp.id);
        if (!this.handledWindowClosed(err, id))
          this.toast.error(this.t('inboxSendErrorTitle'), this.t('inboxMediaSendErrorMsg'));
      }
    });
  }

  protected onSendTemplate(payload: TemplateSendPayload): void {
    const id = this.selectedId();
    const toPhone = this.detail()?.customerPhone ?? this.openConv()?.customerPhone;
    if (id == null || !toPhone || this.sending()) return;

    const temp = this.optimistic(`[${payload.templateName}]`, 'Template');
    this.messages.update((m) => [...m, temp]);
    this.sending.set(true);

    this.whatsapp.sendTemplate({
      toPhone,
      templateName: payload.templateName,
      languageCode: payload.languageCode,
      header: payload.header,
      body: payload.body,
      buttons: payload.buttons
    }).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => { this.sending.set(false); this.loadMessages(id); this.loadList(false); },
      error: (err) => {
        this.sending.set(false);
        this.markTempFailed(temp.id);
        this.toast.error(this.t('pickerSendError'), apiErrorMessage(err, this.t('pickerSendError')));
      }
    });
  }

  protected onChangeStatus(status: string): void {
    const id = this.selectedId();
    if (id == null || this.statusChanging()) return;

    this.statusChanging.set(true);
    this.api.changeStatus(id, status).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        this.statusChanging.set(false);
        this.detail.update((d) => (d ? { ...d, status: res.status, allowedTransitions: res.allowedTransitions } : d));
        this.loadList(false);
      },
      error: (err) => {
        this.statusChanging.set(false);
        this.toast.error(this.t('statusChangeError'), apiErrorMessage(err, this.t('statusChangeError')));
      }
    });
  }

  protected onAddNote(content: string): void {
    const id = this.selectedId();
    if (id == null || this.addingNote()) return;

    this.addingNote.set(true);
    this.api.addNote(id, content).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (note) => { this.addingNote.set(false); this.appendNote(note); },
      error: (err) => {
        this.addingNote.set(false);
        this.toast.error(this.t('notesAddError'), apiErrorMessage(err, this.t('notesAddError')));
      }
    });
  }

  protected onAttachError(kind: 'too-large' | 'unsupported-type'): void {
    const msg = kind === 'too-large' ? this.t('inboxFileTooLarge') : this.t('mediaUnsupportedType');
    this.toast.error(this.t('inboxSendErrorTitle'), msg);
  }

  protected onLoadOlder(): void {
    const id = this.selectedId();
    const current = this.messages();
    if (id == null || current.length === 0) return;
    const oldest = current[0].id;

    this.api.messages(id, oldest).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (page) => {
        const older = [...page.items].reverse();
        this.messages.update((list) => [...older, ...list]);
        this.hasMore.set(page.hasMore);
      }
    });
  }

  protected onDelete(id: number): void {
    if (!confirm(this.t('inboxDeleteConfirm'))) return;

    this.api.delete(id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => {
        this.conversations.update((list) => list.filter((c) => c.id !== id));
        if (this.selectedId() === id) this.clearOpen();
      },
      error: () => this.toast.error(this.t('inboxDeleteErrorTitle'), this.t('inboxDeleteErrorMsg'))
    });
  }

  protected onRetry(): void {
    const id = this.selectedId();
    if (id != null) this.loadMessages(id);
  }

  // ── Assignment + tagging ────────────────────────────────────────────────────
  protected onAssign(event: AssignEvent): void {
    const id = this.selectedId();
    if (id == null || this.assigning()) return;
    const isReassign = this.detail()?.assignedUserId != null;

    this.assigning.set(true);
    const request = { targetUserId: event.userId, reason: event.reason ?? undefined };
    const call = isReassign
      ? this.assignmentApi.reassign(id, request)
      : this.assignmentApi.assign(id, request);

    call.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => {
        this.assigning.set(false);
        this.toast.success(this.t('assignSuccessTitle'), this.t('assignSuccessMsg'));
        this.loadDetail(id);
        this.loadAssignments();
        this.loadList(false);
        if (this.view() === 'queue') this.loadQueue();
      },
      error: (err) => {
        this.assigning.set(false);
        this.toast.error(this.t('assignErrorTitle'), apiErrorMessage(err, this.t('assignErrorMsg')));
      }
    });
  }

  protected onApplyTag(tagId: number): void {
    const id = this.selectedId();
    if (id == null) return;
    this.tagsApi.applyToConversation(id, tagId).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => this.loadDetail(id),
      error: (err) => this.toast.error(this.t('tagApplyError'), apiErrorMessage(err, this.t('tagApplyError')))
    });
  }

  protected onRemoveTag(tagId: number): void {
    const id = this.selectedId();
    if (id == null) return;
    this.tagsApi.removeFromConversation(id, tagId).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => this.loadDetail(id),
      error: (err) => this.toast.error(this.t('tagRemoveError'), apiErrorMessage(err, this.t('tagRemoveError')))
    });
  }

  // ── Team routing / cross-team handoff ───────────────────────────────────────
  protected onRouteToGroup(groupId: number): void {
    const id = this.selectedId();
    if (id == null || this.routing()) return;
    this.routing.set(true);
    this.api.routeToGroup(id, groupId).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => {
        this.routing.set(false);
        this.routedGroupId.set(groupId);
        this.toast.success(this.t('ctxRoutedToast'), '');
        this.loadDetail(id);
        this.loadList(false);
      },
      error: (err) => {
        this.routing.set(false);
        this.toast.error(this.t('ctxRouteError'), apiErrorMessage(err, this.t('ctxRouteError')));
      }
    });
  }

  protected onHandoff(targetGroupId: number): void {
    const id = this.selectedId();
    if (id == null || this.routing()) return;
    this.routing.set(true);
    this.api.handoff(id, targetGroupId).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => {
        this.routing.set(false);
        this.routedGroupId.set(targetGroupId);
        this.toast.success(this.t('ctxHandoffToast'), '');
        this.loadDetail(id);
        this.loadAssignments();
        this.loadList(false);
      },
      error: (err) => {
        this.routing.set(false);
        this.toast.error(this.t('ctxHandoffError'), apiErrorMessage(err, this.t('ctxHandoffError')));
      }
    });
  }

  protected loadAssignments(): void {
    const id = this.selectedId();
    if (id == null) return;
    this.loadingAssignments.set(true);
    this.assignmentApi.getAssignments(id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (list) => { if (this.selectedId() === id) this.assignments.set(list); this.loadingAssignments.set(false); },
      error: () => this.loadingAssignments.set(false)
    });
  }

  // ── Realtime handlers (unchanged behaviour) ─────────────────────────────────
  private onRealtimeMessage(m: RealtimeMessage): void {
    this.loadList(false);
    if (m.conversationId === this.selectedId()) {
      this.loadDetail(m.conversationId);
      if (!this.sending()) {
        this.loadMessages(m.conversationId);
        this.markRead(m.conversationId);
      }
    }
  }

  private onRealtimeStatus(s: RealtimeStatus): void {
    if (s.conversationId !== this.selectedId()) return;
    this.messages.update((list) => list.map((msg) => (msg.id === s.messageId ? { ...msg, status: s.status } : msg)));
  }

  private onRealtimeConversation(c: RealtimeConversation): void {
    this.loadList(false);
    if (this.view() === 'queue') this.loadQueue();
    if (c.conversationId === this.selectedId()) this.loadDetail(c.conversationId);
  }

  private onConversationAiModeChanged(p: RealtimeAiModeChanged): void {
    this.conversations.update((list) => list.map(c => c.id === p.conversationId ? { ...c, aiMode: p.aiMode } : c));
    if (p.conversationId === this.selectedId()) {
      this.detail.update(d => d ? { ...d, aiMode: p.aiMode } : d);
    }
  }

  // ── Escalation realtime handlers (FE-4.2) ────────────────────────────────────
  private onEscalationRecommendation(r: import('../../models/escalation-recommendation.model').EscalationRecommendation): void {
    this.loadList(false);
  }

  private onEscalationAutoAssigned(r: import('../../models/escalation-recommendation.model').EscalationRecommendation): void {
    this.loadList(false);
    if (this.auth.userProfile() && Number(this.auth.userProfile()!.id) === r.assignedToId) {
      this.toast.info('', this.t('escalationAssignedToast'));
    }
  }

  private onOwnershipTransferred(p: OwnershipTransferredPayload): void {
    this.loadList(false);
    const id = this.selectedId();
    if (id != null) {
      this.loadDetail(id);
      this.loadAssignments();
    }
    if (this.view() === 'queue') this.loadQueue();
  }

  // ── Escalation actions (FE-4.2) ──────────────────────────────────────────────
  protected onEscalationConfirm(event: { escalationId: number; assigneeId: number }): void {
    this.escalationConfirming.set(true);
    this.escalationApi.confirm(event.escalationId, event.assigneeId).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (rec) => {
        this.escalationConfirming.set(false);
        this.escalationStore.setRecommendation(this.selectedId()!, rec);
        this.loadDetail(this.selectedId()!);
        this.loadList(false);
      },
      error: (err) => {
        this.escalationConfirming.set(false);
        this.toast.error(this.t('assignErrorTitle'), apiErrorMessage(err, this.t('assignErrorMsg')));
      }
    });
  }

  protected onEscalationOverrideOpen(): void {
    this.showOverrideDialog.set(true);
  }

  protected onEscalationOverrideSubmit(event: { escalationId: number; assigneeId: number; reason: string }): void {
    this.showOverrideDialog.set(false);
    this.escalationApi.override(event.escalationId, event.assigneeId, event.reason).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (rec) => {
        this.escalationStore.setRecommendation(this.selectedId()!, rec);
        this.loadDetail(this.selectedId()!);
        this.loadList(false);
      },
      error: (err) => {
        this.toast.error(this.t('assignErrorTitle'), apiErrorMessage(err, this.t('assignErrorMsg')));
      }
    });
  }

  protected onEscalationOverrideCancel(): void {
    this.showOverrideDialog.set(false);
  }

  protected onEscalationReject(event: { escalationId: number; reason: string | null }): void {
    this.escalationConfirming.set(true);
    this.escalationApi.reject(event.escalationId, event.reason).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (rec) => {
        this.escalationConfirming.set(false);
        this.escalationStore.setRecommendation(this.selectedId()!, rec);
        this.loadList(false);
      },
      error: (err) => {
        this.escalationConfirming.set(false);
        this.toast.error(this.t('assignErrorTitle'), apiErrorMessage(err, this.t('assignErrorMsg')));
      }
    });
  }

  private onRealtimeNote(n: RealtimeNote): void {
    if (n.conversationId !== this.selectedId()) return;
    this.appendNote({ id: n.id, conversationId: n.conversationId, content: n.content, authorName: n.authorName, createdAt: n.createdAt });
  }

  // ── Loaders ─────────────────────────────────────────────────────────────────
  private loadList(showSpinner: boolean): void {
    if (this.view() !== 'inbox') return;
    if (showSpinner) this.listLoading.set(true);
    this.api.list(this.buildFilters()).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (page) => {
        this.conversations.set(page.items);
        const openId = this.selectedId();
        if (openId != null) this.zeroUnread(openId);
        this.listLoading.set(false);
        // Auto-open the conversation a "+" send just created (best-effort match on the number).
        if (this.pendingSelectPhone) {
          const wanted = this.pendingSelectPhone.replace(/\D/g, '');
          const target = page.items.find((c) => c.customerPhone.replace(/\D/g, '') === wanted);
          this.pendingSelectPhone = null;
          if (target) this.selectCard(target.id);
        }
      },
      error: () => this.listLoading.set(false)
    });
  }

  // ── New-conversation dialog (message a brand-new number) ────────────────────
  protected openNewConversation(): void {
    this.newConvOpen.set(true);
  }

  protected closeNewConversation(): void {
    this.newConvOpen.set(false);
  }

  protected onSendNewConversation(payload: NewConversationSend): void {
    if (this.newConvSending()) return;
    this.newConvSending.set(true);

    this.whatsapp.sendTemplate({
      toPhone: payload.toPhone,
      templateName: payload.templateName,
      languageCode: payload.languageCode,
    }).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => {
        this.newConvSending.set(false);
        this.newConvOpen.set(false);
        this.toast.success(this.t('newConvSuccessTitle'), this.t('newConvSuccessMsg'));
        // Make sure we're on the inbox view, then reload so the new conversation surfaces and opens.
        if (this.view() !== 'inbox') this.view.set('inbox');
        this.pendingSelectPhone = payload.toPhone;
        this.loadList(true);
      },
      error: (err) => {
        this.newConvSending.set(false);
        this.toast.error(this.t('newConvErrorTitle'), apiErrorMessage(err, this.t('newConvErrorTitle')));
      },
    });
  }

  private loadQueue(): void {
    this.queueLoading.set(true);
    this.assignmentApi.getUnassigned().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (items) => { this.queue.set(items); this.queueLoading.set(false); },
      error: () => this.queueLoading.set(false)
    });
  }

  private loadAccounts(): void {
    this.whatsapp.getAccounts().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (accounts) => this.accounts.set(accounts),
      error: () => {}
    });
  }

  private loadFacets(): void {
    this.groupsApi.getGroups().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({ next: (g) => this.groups.set(g), error: () => {} });
    this.tagsApi.getTags().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({ next: (tg) => this.tags.set(tg), error: () => {} });
    this.usersApi.getUsers().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({ next: (u) => this.users.set(u.filter((x) => x.isActive)), error: () => {} });
    this.templatesApi.list('APPROVED').pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (tpls) => this.templates.set((tpls ?? []).filter((t) => (t.status ?? '').toUpperCase() === 'APPROVED')),
      error: () => {},
    });
  }

  private loadMessages(id: number): void {
    this.threadLoading.set(true);
    this.api.messages(id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (page) => {
        this.messages.set([...page.items].reverse());
        this.hasMore.set(page.hasMore);
        this.threadLoading.set(false);
      },
      error: () => this.threadLoading.set(false)
    });
  }

  private loadDetail(id: number): void {
    this.api.detail(id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (detail) => { if (this.selectedId() === id) { this.detail.set(detail); this.routedGroupId.set(detail.groupId); } },
      error: () => {}
    });
  }

  private loadNotes(id: number): void {
    this.api.notes(id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (notes) => { if (this.selectedId() === id) this.notes.set(notes); },
      error: () => {}
    });
  }

  // ── AI conversation summary (FE-4.3 / US-4.7) ───────────────────────────────
  private loadSummary(id: number): void {
    this.summaryLoading.set(true);
    this.summaryError.set(false);
    this.armSummarySlow();
    this.api.summary(id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (s) => {
        if (this.selectedId() !== id) return;
        this.summary.set(s);
        this.summaryLoading.set(false);
        this.disarmSummarySlow();
      },
      error: () => {
        if (this.selectedId() !== id) return;
        this.summaryLoading.set(false);
        this.summaryError.set(true);
        this.disarmSummarySlow();
      }
    });
  }

  /** Regenerates the short summary (used by both the refresh and error-retry affordances). */
  protected onRefreshSummary(): void {
    const id = this.selectedId();
    if (id != null) this.loadSummary(id);
  }

  /** Generates the full structured summary on demand. */
  protected onGenerateFullSummary(): void {
    const id = this.selectedId();
    if (id == null || this.summaryFullLoading()) return;
    this.summaryFullLoading.set(true);
    this.api.generateFullSummary(id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (s) => {
        if (this.selectedId() === id) this.summary.set(s);
        this.summaryFullLoading.set(false);
      },
      error: (err) => {
        this.summaryFullLoading.set(false);
        this.toast.error(this.t('aiSummaryTitle'), apiErrorMessage(err, this.t('aiSummaryError')));
      }
    });
  }

  /** Human explicitly controls the AI Mode for a conversation. */
  protected onChangeAiMode(mode: 'Active' | 'Human' | 'Paused'): void {
    const id = this.selectedId();
    if (id == null || this.aiModeChanging()) return;
    this.aiModeChanging.set(true);
    this.api.changeAiMode(id, mode).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => {
        this.aiModeChanging.set(false);
        this.detail.update(d => d ? { ...d, aiMode: mode } : d);
        // Toast is optional here; realtime event will also sync state
        this.toast.success('AI Mode Updated', `Conversation AI mode changed to ${mode}.`);
      },
      error: (err) => {
        this.aiModeChanging.set(false);
        if (err.status === 403 && apiError(err).code === 'AI.NumberDisabled') {
          this.toast.error('AI Disabled', 'AI is disabled for this WhatsApp number by the administrator.');
        } else {
          this.toast.error('Update Failed', apiErrorMessage(err, 'Failed to update AI mode.'));
        }
      }
    });
  }

  private resetSummary(): void {
    this.summary.set(null);
    this.summaryLoading.set(false);
    this.summaryFullLoading.set(false);
    this.summaryError.set(false);
    this.disarmSummarySlow();
  }

  private armSummarySlow(): void {
    this.disarmSummarySlow();
    this.summarySlow.set(false);
    this.summarySlowTimer = setTimeout(() => this.summarySlow.set(true), 4000);
  }

  private disarmSummarySlow(): void {
    this.summarySlow.set(false);
    if (this.summarySlowTimer) { clearTimeout(this.summarySlowTimer); this.summarySlowTimer = null; }
  }

  private refresh(): void {
    this.loadList(false);
    if (this.view() === 'queue') this.loadQueue();
    const id = this.selectedId();
    if (id != null && !this.sending()) {
      this.loadMessages(id);
      this.loadDetail(id);
      this.markRead(id);
    }
  }

  // ── Helpers ─────────────────────────────────────────────────────────────────
  private clearOpen(): void {
    this.selectedId.set(null);
    this.openConv.set(null);
    this.messages.set([]);
    this.detail.set(null);
    this.notes.set([]);
    this.assignments.set([]);
    this.resetSummary();
  }

  private handledWindowClosed(err: unknown, conversationId: number): boolean {
    if (apiError(err).code !== 'WhatsApp.WindowClosed') return false;
    this.loadDetail(conversationId);
    this.toast.error(this.t('windowClosedTitle'), this.t('windowClosedHint'));
    return true;
  }

  private optimistic(content: string, kind: string): ConversationMessage {
    return {
      id: -Date.now(),
      senderType: 'Agent',
      content,
      messageType: kind,
      status: 'Queued',
      timestamp: new Date().toISOString(),
      senderUserId: null,
      mediaUrl: null,
      mediaMimeType: null,
      mediaFileName: null
    };
  }

  private markTempFailed(tempId: number): void {
    this.messages.update((list) => list.map((msg) => (msg.id === tempId ? { ...msg, status: 'Failed' } : msg)));
  }

  private appendNote(note: ConversationNote): void {
    this.notes.update((list) => (list.some((x) => x.id === note.id) ? list : [...list, note]));
  }
}

/** Local guess at the message kind for the optimistic bubble (server re-derives it authoritatively). */
function mapMediaKind(mimeType: string): string {
  if (mimeType === 'image/webp') return 'Sticker';
  if (mimeType.startsWith('image/')) return 'Image';
  if (mimeType.startsWith('video/')) return 'Video';
  if (mimeType.startsWith('audio/')) return 'Audio';
  return 'Document';
}
