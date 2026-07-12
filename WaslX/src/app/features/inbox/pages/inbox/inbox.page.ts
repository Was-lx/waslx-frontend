import { Component, DestroyRef, OnDestroy, OnInit, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { LanguageService, type TranslationKey } from '../../../../core/services/language.service';
import { ToastService } from '../../../../core/services/toast.service';
import { InboxRealtimeService, type RealtimeConversation, type RealtimeMessage, type RealtimeNote, type RealtimeStatus } from '../../../../core/services/inbox-realtime.service';
import { WhatsAppApiService } from '../../../../core/api/whatsapp-api.service';
import { apiErrorMessage } from '../../../../core/utils/api-error';
import { ConversationCardComponent } from '../../components/conversation-card/conversation-card.component';
import { ChatViewComponent } from '../../components/chat-view/chat-view.component';
import { ConversationsApiService } from '../../services/conversations-api.service';
import type { ConversationDetail, ConversationListItem, ConversationNote } from '../../models/conversation.model';
import type { ConversationMessage } from '../../models/message.model';
import type { TemplateSendPayload } from '../../components/template-picker/template-picker.component';

// SignalR pushes changes live; this slow sweep only backstops a missed event / dropped connection.
const FALLBACK_REFRESH_MS = 60_000;

@Component({
  selector: 'app-inbox',
  standalone: true,
  imports: [ConversationCardComponent, ChatViewComponent],
  templateUrl: './inbox.page.html',
  styleUrl: './inbox.page.css'
})
export class InboxPageComponent implements OnInit, OnDestroy {
  private readonly api = inject(ConversationsApiService);
  private readonly whatsapp = inject(WhatsAppApiService);
  private readonly realtime = inject(InboxRealtimeService);
  private readonly language = inject(LanguageService);
  private readonly toast = inject(ToastService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly conversations = signal<ConversationListItem[]>([]);
  protected readonly selectedId = signal<number | null>(null);
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
  protected readonly search = signal('');
  protected readonly scrollUnreadCount = signal(0);

  protected readonly selected = computed(() =>
    this.conversations().find((c) => c.id === this.selectedId()) ?? null
  );

  protected readonly filtered = computed(() => {
    const q = this.search().trim().toLowerCase();
    if (!q) return this.conversations();
    return this.conversations().filter(
      (c) =>
        c.customerName.toLowerCase().includes(q) ||
        c.customerPhone.toLowerCase().includes(q) ||
        (c.lastMessagePreview ?? '').toLowerCase().includes(q)
    );
  });

  private fallback: ReturnType<typeof setInterval> | null = null;

  protected t = (key: TranslationKey): string => this.language.text(key);
  protected direction = (): 'rtl' | 'ltr' => this.language.getDirection();

  ngOnInit(): void {
    this.loadList(true);

    void this.realtime.start();
    this.realtime.messageReceived.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((m) => this.onRealtimeMessage(m));
    this.realtime.messageStatusChanged.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((s) => this.onRealtimeStatus(s));
    this.realtime.conversationChanged.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((c) => this.onRealtimeConversation(c));
    this.realtime.noteAdded.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((n) => this.onRealtimeNote(n));

    this.fallback = setInterval(() => this.refresh(), FALLBACK_REFRESH_MS);
  }

  ngOnDestroy(): void {
    if (this.fallback) clearInterval(this.fallback);
    void this.realtime.stop();
  }

  protected onSearch(event: Event): void {
    this.search.set((event.target as HTMLInputElement).value);
  }

  protected select(id: number): void {
    if (this.selectedId() === id) return;
    this.scrollUnreadCount.set(this.conversations().find((c) => c.id === id)?.unreadCount ?? 0);
    this.selectedId.set(id);
    this.messages.set([]);
    this.detail.set(null);
    this.notes.set([]);
    this.loadMessages(id);
    this.loadDetail(id);
    this.loadNotes(id);
    this.markRead(id);
    this.realtime.joinConversation(id);
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

  protected onSend(text: string): void {
    const id = this.selectedId();
    if (id == null || this.sending()) return;

    const temp = this.optimistic(text, 'Text');
    this.messages.update((m) => [...m, temp]);
    this.sending.set(true);

    this.api.sendText(id, text).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => { this.sending.set(false); this.loadMessages(id); this.loadList(false); },
      error: () => {
        this.sending.set(false);
        this.markTempFailed(temp.id);
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
      error: () => {
        this.sending.set(false);
        this.uploadProgress.set(null);
        this.markTempFailed(temp.id);
        this.toast.error(this.t('inboxSendErrorTitle'), this.t('inboxMediaSendErrorMsg'));
      }
    });
  }

  protected onSendTemplate(payload: TemplateSendPayload): void {
    const id = this.selectedId();
    const toPhone = this.detail()?.customerPhone ?? this.selected()?.customerPhone;
    if (id == null || !toPhone || this.sending()) return;

    const temp = this.optimistic(`[${payload.templateName}]`, 'Template');
    this.messages.update((m) => [...m, temp]);
    this.sending.set(true);

    this.whatsapp.sendTemplate({
      toPhone,
      templateName: payload.templateName,
      languageCode: payload.languageCode,
      variables: payload.variables
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
        if (this.selectedId() === id) {
          this.selectedId.set(null);
          this.messages.set([]);
          this.detail.set(null);
          this.notes.set([]);
        }
      },
      error: () => this.toast.error(this.t('inboxDeleteErrorTitle'), this.t('inboxDeleteErrorMsg'))
    });
  }

  protected onRetry(): void {
    const id = this.selectedId();
    if (id != null) this.loadMessages(id);
  }

  // ── Realtime handlers ───────────────────────────────────────────────────────
  private onRealtimeMessage(m: RealtimeMessage): void {
    this.loadList(false);
    if (m.conversationId === this.selectedId()) {
      // Refresh the 24h-window anchor (lastInboundAt) + status the instant a message arrives, so a
      // customer reply unlocks the composer immediately — no manual/hard refresh required.
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
    if (c.conversationId === this.selectedId()) this.loadDetail(c.conversationId);
  }

  private onRealtimeNote(n: RealtimeNote): void {
    if (n.conversationId !== this.selectedId()) return;
    this.appendNote({ id: n.id, conversationId: n.conversationId, content: n.content, authorName: n.authorName, createdAt: n.createdAt });
  }

  // ── Loaders ─────────────────────────────────────────────────────────────────
  private loadList(showSpinner: boolean): void {
    if (showSpinner) this.listLoading.set(true);
    this.api.list().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (page) => {
        this.conversations.set(page.items);
        const openId = this.selectedId();
        if (openId != null) this.zeroUnread(openId);
        this.listLoading.set(false);
      },
      error: () => this.listLoading.set(false)
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
      next: (detail) => { if (this.selectedId() === id) this.detail.set(detail); },
      error: () => {}
    });
  }

  private loadNotes(id: number): void {
    this.api.notes(id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (notes) => { if (this.selectedId() === id) this.notes.set(notes); },
      error: () => {}
    });
  }

  private refresh(): void {
    this.loadList(false);
    const id = this.selectedId();
    if (id != null && !this.sending()) {
      this.loadMessages(id);
      this.loadDetail(id);
      this.markRead(id);
    }
  }

  // ── Helpers ─────────────────────────────────────────────────────────────────
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
  return 'Document';
}
