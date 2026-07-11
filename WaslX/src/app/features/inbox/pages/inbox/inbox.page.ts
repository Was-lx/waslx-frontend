import { Component, DestroyRef, OnDestroy, OnInit, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { LanguageService, type TranslationKey } from '../../../../core/services/language.service';
import { ToastService } from '../../../../core/services/toast.service';
import { ConversationCardComponent } from '../../components/conversation-card/conversation-card.component';
import { ChatViewComponent } from '../../components/chat-view/chat-view.component';
import { ConversationsApiService } from '../../services/conversations-api.service';
import type { ConversationListItem } from '../../models/conversation.model';
import type { ConversationMessage } from '../../models/message.model';

const POLL_INTERVAL_MS = 10_000; // Stopgap until SignalR real-time push lands (follow-up story).

@Component({
  selector: 'app-inbox',
  standalone: true,
  imports: [ConversationCardComponent, ChatViewComponent],
  templateUrl: './inbox.page.html',
  styleUrl: './inbox.page.css'
})
export class InboxPageComponent implements OnInit, OnDestroy {
  private readonly api = inject(ConversationsApiService);
  private readonly language = inject(LanguageService);
  private readonly toast = inject(ToastService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly conversations = signal<ConversationListItem[]>([]);
  protected readonly selectedId = signal<number | null>(null);
  protected readonly messages = signal<ConversationMessage[]>([]);
  protected readonly listLoading = signal(true);
  protected readonly threadLoading = signal(false);
  protected readonly sending = signal(false);
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

  private poll: ReturnType<typeof setInterval> | null = null;

  protected t = (key: TranslationKey): string => this.language.text(key);
  protected direction = (): 'rtl' | 'ltr' => this.language.getDirection();

  ngOnInit(): void {
    this.loadList(true);
    this.poll = setInterval(() => this.refresh(), POLL_INTERVAL_MS);
  }

  ngOnDestroy(): void {
    if (this.poll) clearInterval(this.poll);
  }

  protected onSearch(event: Event): void {
    this.search.set((event.target as HTMLInputElement).value);
  }

  protected select(id: number): void {
    if (this.selectedId() === id) return;
    // Capture the unread count before markRead() zeroes it, so the chat view can scroll
    // to the first unread message instead of always landing at the top of the thread.
    this.scrollUnreadCount.set(this.conversations().find((c) => c.id === id)?.unreadCount ?? 0);
    this.selectedId.set(id);
    this.messages.set([]);
    this.loadMessages(id);
    this.markRead(id);
  }

  /** Advances the server read-cursor and optimistically zeroes the local unread badge. */
  private markRead(id: number): void {
    this.zeroUnread(id);
    this.api.markRead(id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      // Best-effort: on failure the next poll re-derives the true count from the server.
      error: () => {}
    });
  }

  private zeroUnread(id: number): void {
    this.conversations.update((list) =>
      list.map((c) => (c.id === id && c.unreadCount > 0 ? { ...c, unreadCount: 0 } : c))
    );
  }

  protected onSend(text: string): void {
    const id = this.selectedId();
    if (id == null || this.sending()) return;

    // Optimistic append with a temporary negative id in a "queued" state.
    const temp: ConversationMessage = {
      id: -Date.now(),
      senderType: 'Agent',
      content: text,
      messageType: 'Text',
      status: 'Queued',
      timestamp: new Date().toISOString(),
      senderUserId: null,
      mediaUrl: null,
      mediaMimeType: null,
      mediaFileName: null
    };
    this.messages.update((m) => [...m, temp]);
    this.sending.set(true);

    this.api.sendText(id, text).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => {
        this.sending.set(false);
        this.loadMessages(id); // reconcile with the persisted message
        this.loadList(false); // bump the conversation up the list
      },
      error: () => {
        this.sending.set(false);
        this.messages.update((list) =>
          list.map((msg) => (msg.id === temp.id ? { ...msg, status: 'Failed' } : msg))
        );
        this.toast.error(this.t('inboxSendErrorTitle'), this.t('inboxSendErrorMsg'));
      }
    });
  }

  protected onSendMedia({ file, caption }: { file: File; caption: string }): void {
    const id = this.selectedId();
    if (id == null || this.sending()) return;

    const previewUrl = URL.createObjectURL(file);
    const temp: ConversationMessage = {
      id: -Date.now(),
      senderType: 'Agent',
      content: caption,
      messageType: mapMediaKind(file.type),
      status: 'Queued',
      timestamp: new Date().toISOString(),
      senderUserId: null,
      mediaUrl: previewUrl,
      mediaMimeType: file.type,
      mediaFileName: file.name
    };
    this.messages.update((m) => [...m, temp]);
    this.sending.set(true);

    this.api.sendMedia(id, file, caption).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => {
        this.sending.set(false);
        URL.revokeObjectURL(previewUrl);
        this.loadMessages(id); // reconcile with the persisted message
        this.loadList(false); // bump the conversation up the list
      },
      error: () => {
        this.sending.set(false);
        this.messages.update((list) =>
          list.map((msg) => (msg.id === temp.id ? { ...msg, status: 'Failed' } : msg))
        );
        this.toast.error(this.t('inboxSendErrorTitle'), this.t('inboxMediaSendErrorMsg'));
      }
    });
  }

  protected onAttachError(kind: 'too-large'): void {
    if (kind === 'too-large') {
      this.toast.error(this.t('inboxSendErrorTitle'), this.t('inboxFileTooLarge'));
    }
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
        }
      },
      error: () => this.toast.error(this.t('inboxDeleteErrorTitle'), this.t('inboxDeleteErrorMsg'))
    });
  }

  protected onRetry(): void {
    // Retrying a failed send re-uses the composer path; for the slice, prompt a fresh reply.
    const id = this.selectedId();
    if (id != null) this.loadMessages(id);
  }

  private loadList(showSpinner: boolean): void {
    if (showSpinner) this.listLoading.set(true);
    this.api.list().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (page) => {
        this.conversations.set(page.items);
        // The open thread is being read live, so don't let a stale server count re-show its badge.
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
        // API returns newest-first; display oldest-first (top → bottom).
        this.messages.set([...page.items].reverse());
        this.hasMore.set(page.hasMore);
        this.threadLoading.set(false);
      },
      error: () => this.threadLoading.set(false)
    });
  }

  private refresh(): void {
    this.loadList(false);
    const id = this.selectedId();
    if (id != null && !this.sending()) {
      this.loadMessages(id);
      // Keep the open thread at zero unread as new inbound messages arrive.
      this.markRead(id);
    }
  }
}

/** Local guess at the message kind for the optimistic bubble (server re-derives it authoritatively). */
function mapMediaKind(mimeType: string): string {
  if (mimeType.startsWith('image/')) return 'Image';
  if (mimeType.startsWith('video/')) return 'Video';
  return 'Document';
}
