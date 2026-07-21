import { Injectable, inject, signal } from '@angular/core';
import { Subject } from 'rxjs';

import { AuthSessionService } from './auth-session.service';
import { InboxRealtimeService } from './inbox-realtime.service';
import { ToastService } from './toast.service';
import {
  NotificationsApiService,
  toNotification,
  type AppNotification,
} from '../api/notifications-api.service';

/** How many recent notifications the bell panel keeps in memory. */
const PANEL_CAP = 30;

export type BrowserNotifState = 'unsupported' | 'default' | 'granted' | 'denied';

/**
 * App-wide notification state (FR-NOTIF · FE-5.7). A single root store that:
 *  - loads the unread count + recent items for the topbar bell,
 *  - reuses the shared inbox SignalR connection to receive `NotificationCreated`,
 *    filters each push to the signed-in user (matched via the JWT `duid` claim),
 *  - raises a toast through the EXISTING ToastService and, when opted-in and the tab
 *    is hidden, a native browser Notification,
 *  - exposes an `incoming$` stream so the full-page center can live-prepend too.
 */
@Injectable({ providedIn: 'root' })
export class NotificationsStore {
  private readonly api = inject(NotificationsApiService);
  private readonly realtime = inject(InboxRealtimeService);
  private readonly toast = inject(ToastService);
  private readonly auth = inject(AuthSessionService);

  /** Unread count for the bell badge. */
  readonly unreadCount = signal(0);
  /** Recent notifications shown in the bell panel (newest first, capped). */
  readonly items = signal<AppNotification[]>([]);
  /** Current browser-notification permission state. */
  readonly browserState = signal<BrowserNotifState>(this.readBrowserState());

  /** Live pushes for the signed-in user, already mapped — consumed by the center page. */
  readonly incoming$ = new Subject<AppNotification>();

  private started = false;
  private myUserId: number | null = null;

  /** Idempotent bootstrap — called from the topbar once the shell mounts. */
  init(): void {
    if (this.started) {
      return;
    }
    this.started = true;

    this.myUserId = this.resolveDomainUserId();

    // Share the inbox hub connection (start is a no-op if already connected).
    void this.realtime.start();
    this.realtime.notificationCreated.subscribe((payload) => this.onPush(payload.userId, payload.notification));

    this.reload();
  }

  /** Reload the panel list + unread count from the server. */
  reload(): void {
    this.api.getNotifications(false, PANEL_CAP).subscribe({
      next: (list) => this.items.set(list),
      error: () => {},
    });
    this.api.getUnreadCount().subscribe({
      next: (n) => this.unreadCount.set(n),
      error: () => {},
    });
  }

  /** Optimistically mark one notification read, then persist. */
  markRead(id: number): void {
    let wasUnread = false;
    this.items.update((list) =>
      list.map((n) => {
        if (n.id === id && !n.isRead) {
          wasUnread = true;
          return { ...n, isRead: true };
        }
        return n;
      }),
    );
    if (wasUnread) {
      this.unreadCount.update((c) => Math.max(0, c - 1));
      this.api.markRead(id).subscribe({ next: () => {}, error: () => this.reload() });
    }
  }

  /** Optimistically mark everything read, then persist. */
  markAllRead(): void {
    if (this.unreadCount() === 0 && this.items().every((n) => n.isRead)) {
      return;
    }
    this.items.update((list) => list.map((n) => ({ ...n, isRead: true })));
    this.unreadCount.set(0);
    this.api.markAllRead().subscribe({ next: () => {}, error: () => this.reload() });
  }

  /** Prompt for browser-notification permission; resolves the resulting state. */
  async requestBrowserPermission(): Promise<void> {
    if (typeof Notification === 'undefined') {
      this.browserState.set('unsupported');
      return;
    }
    if (Notification.permission === 'granted' || Notification.permission === 'denied') {
      this.browserState.set(Notification.permission);
      return;
    }
    try {
      const result = await Notification.requestPermission();
      this.browserState.set(result as BrowserNotifState);
    } catch {
      this.browserState.set('default');
    }
  }

  // ─── Internals ──────────────────────────────────────────────────────────────

  private onPush(userId: number, raw: AppNotification): void {
    // The push is broadcast to the whole tenant; act only on mine.
    if (this.myUserId !== null && userId !== this.myUserId) {
      return;
    }
    const notif = toNotification(raw);

    // Prepend (dedupe by id) and cap the panel list.
    this.items.update((list) => [notif, ...list.filter((n) => n.id !== notif.id)].slice(0, PANEL_CAP));
    if (!notif.isRead) {
      this.unreadCount.update((c) => c + 1);
    }
    this.incoming$.next(notif);

    // Ephemeral toast via the existing system.
    this.toast.info(notif.title || '', notif.body || '');

    // Native notification only when the tab is backgrounded and the user opted in.
    this.maybeNativeNotification(notif);
  }

  private maybeNativeNotification(notif: AppNotification): void {
    if (typeof document === 'undefined' || typeof Notification === 'undefined') {
      return;
    }
    if (Notification.permission !== 'granted' || !document.hidden) {
      return;
    }
    try {
      const n = new Notification(notif.title || 'WaslX', {
        body: notif.body || '',
        tag: `waslx-notif-${notif.id}`,
      });
      n.onclick = () => {
        window.focus();
        n.close();
      };
    } catch {
      // Some browsers throw for non-persistent notifications; ignore.
    }
  }

  private readBrowserState(): BrowserNotifState {
    if (typeof Notification === 'undefined') {
      return 'unsupported';
    }
    return Notification.permission as BrowserNotifState;
  }

  /**
   * The realtime payload carries the recipient's DOMAIN user id (`duid`), which the
   * JWT access token embeds as a claim. `/me` returns the Identity GUID instead, so we
   * read `duid` straight from the token to match pushes. Returns null if unavailable
   * (then we fall back to trusting the server-scoped read endpoints).
   */
  private resolveDomainUserId(): number | null {
    const token = this.auth.getAccessToken();
    if (!token) {
      return null;
    }
    try {
      const part = token.split('.')[1];
      if (!part) {
        return null;
      }
      const json = atob(part.replace(/-/g, '+').replace(/_/g, '/'));
      const claims = JSON.parse(json) as Record<string, unknown>;
      const raw = claims['duid'];
      const value = typeof raw === 'string' ? Number(raw) : typeof raw === 'number' ? raw : NaN;
      return Number.isFinite(value) ? value : null;
    } catch {
      return null;
    }
  }
}
