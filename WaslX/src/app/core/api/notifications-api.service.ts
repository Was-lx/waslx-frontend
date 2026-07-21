import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

import { ApiClientService } from './api-client.service';

// ─── Backend DTO (internal) ──────────────────────────────────────────────────

/** Server NotificationResponse row (see WaslX.Application Features/Notifications). */
interface ApiNotification {
  id: number;
  type: string;
  title: string;
  body: string;
  entityType: string | null;
  entityId: number | null;
  isRead: boolean;
  createdAt: string;
}

// ─── View-model (exported) ───────────────────────────────────────────────────

/** Known notification types the backend emits; kept open for forward-compat. */
export type NotificationType =
  | 'assignment'
  | 'conversation'
  | 'message'
  | 'campaign'
  | 'mention'
  | 'system'
  | (string & {});

/** A single in-app notification as shown in the bell panel and the /notifications center. */
export interface AppNotification {
  id: number;
  type: NotificationType;
  title: string;
  body: string;
  entityType: string | null;
  entityId: number | null;
  isRead: boolean;
  createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class NotificationsApiService {
  private readonly api = inject(ApiClientService);

  /** Recent notifications for the signed-in user, newest first. */
  getNotifications(unreadOnly = false, take = 50): Observable<AppNotification[]> {
    return this.api
      .get<ApiNotification[]>('/notifications', { params: { unreadOnly, take } })
      .pipe(map((list) => (list ?? []).map(toNotification)));
  }

  /** Count of unread notifications (drives the bell badge). */
  getUnreadCount(): Observable<number> {
    return this.api.get<number>('/notifications/unread-count').pipe(map((n) => n ?? 0));
  }

  /** Mark a single notification read. */
  markRead(id: number): Observable<void> {
    return this.api.post<void>(`/notifications/${id}/read`);
  }

  /** Mark every unread notification read. */
  markAllRead(): Observable<void> {
    return this.api.post<void>('/notifications/read-all');
  }
}

// ─── Mapper ──────────────────────────────────────────────────────────────────

/** Map a raw server row (or a SignalR payload) into the view-model shape. */
export function toNotification(n: ApiNotification): AppNotification {
  return {
    id: n.id,
    type: (n.type ?? 'system') as NotificationType,
    title: n.title ?? '',
    body: n.body ?? '',
    entityType: n.entityType ?? null,
    entityId: n.entityId ?? null,
    isRead: n.isRead ?? false,
    createdAt: n.createdAt,
  };
}

// ─── Presentation helpers (shared by the bell panel + the center page) ───────

export type NotificationTint = 'primary' | 'success' | 'warning' | 'accent' | 'danger';

/** Icon name + tinted-chip variant for a notification type. Icons ∈ IconComponent set. */
export function notificationVisual(type: string): { icon: string; tint: NotificationTint } {
  switch ((type ?? '').toLowerCase()) {
    case 'assignment':
      return { icon: 'route', tint: 'primary' };
    case 'conversation':
    case 'message':
      return { icon: 'message', tint: 'primary' };
    case 'campaign':
      return { icon: 'megaphone', tint: 'accent' };
    case 'mention':
      return { icon: 'user', tint: 'accent' };
    case 'system':
      return { icon: 'bell', tint: 'warning' };
    default:
      return { icon: 'bell', tint: 'primary' };
  }
}

/** Router target for a notification's related entity, or null when it isn't deep-linkable. */
export function notificationTarget(
  n: AppNotification,
): { commands: unknown[]; query?: Record<string, string> } | null {
  const entity = (n.entityType ?? '').toLowerCase();
  if (!n.entityId) {
    return null;
  }
  switch (entity) {
    case 'conversation':
      return { commands: ['/app/inbox'], query: { conversation: String(n.entityId) } };
    case 'campaign':
      return { commands: ['/app/campaigns', n.entityId] };
    default:
      return null;
  }
}
