import { Injectable, inject, signal } from '@angular/core';
import { HubConnection, HubConnectionBuilder, HubConnectionState, LogLevel } from '@microsoft/signalr';
import { Subject } from 'rxjs';

import { environment } from '../../../environments/environment';
import { AuthSessionService } from './auth-session.service';

// Realtime payloads (camelCase — see SignalR JSON protocol config on the backend).
export interface RealtimeMessage {
  id: number;
  conversationId: number;
  senderType: string;
  content: string;
  messageType: string;
  status: string;
  timestamp: string;
  senderUserId: number | null;
  mediaUrl: string | null;
  mediaMimeType: string | null;
  mediaFileName: string | null;
}

export interface RealtimeStatus {
  conversationId: number;
  messageId: number;
  status: string;
}

export interface RealtimeConversation {
  conversationId: number;
  status: string;
  lastMessageAt: string | null;
  handledByAi: boolean;
  aiMode: 'Active' | 'Human' | 'Paused';
}

export interface RealtimeAiModeChanged {
  conversationId: number;
  aiMode: 'Active' | 'Human' | 'Paused';
}

export interface RealtimeNote {
  id: number;
  conversationId: number;
  content: string;
  authorName: string;
  createdAt: string;
}

/** Presence / availability push for the current agent (break started/ended, went online/offline). */
export interface RealtimePresence {
  isOnline: boolean;
  isOnBreak: boolean;
  lastSeenAt: string | null;
}

/**
 * A per-user notification push (FR-NOTIF). Broadcast to the tenant group with the recipient's
 * domain user id, so every client must filter on `userId` before acting on it.
 */
export interface RealtimeNotification {
  userId: number;
  notification: {
    id: number;
    type: string;
    title: string;
    body: string;
    entityType: string | null;
    entityId: number | null;
    isRead: boolean;
    createdAt: string;
  };
}

/**
 * SignalR client for the shared inbox. Connects to /hubs/inbox with the JWT, auto-reconnects,
 * and fans hub events out as RxJS subjects the inbox page subscribes to. One shared connection
 * per app (providedIn: root).
 */
@Injectable({ providedIn: 'root' })
export class InboxRealtimeService {
  private readonly auth = inject(AuthSessionService);
  private hub: HubConnection | null = null;

  readonly connected = signal(false);
  readonly messageReceived = new Subject<RealtimeMessage>();
  readonly messageStatusChanged = new Subject<RealtimeStatus>();
  readonly conversationChanged = new Subject<RealtimeConversation>();
  readonly conversationAiModeChanged = new Subject<RealtimeAiModeChanged>();
  readonly noteAdded = new Subject<RealtimeNote>();
  readonly presenceChanged = new Subject<RealtimePresence>();
  readonly notificationCreated = new Subject<RealtimeNotification>();

  private hubUrl(): string {
    // environment.apiUrl ends with "/api"; the hub is served at the host root under /hubs/inbox.
    return environment.apiUrl.replace(/\/api\/?$/, '') + '/hubs/inbox';
  }

  async start(): Promise<void> {
    if (this.hub && this.hub.state !== HubConnectionState.Disconnected) return;

    this.hub = new HubConnectionBuilder()
      .withUrl(this.hubUrl(), { accessTokenFactory: () => this.auth.getAccessToken() ?? '' })
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Warning)
      .build();

    this.hub.on('MessageReceived', (m: RealtimeMessage) => this.messageReceived.next(m));
    this.hub.on('MessageStatusChanged', (s: RealtimeStatus) => this.messageStatusChanged.next(s));
    this.hub.on('ConversationChanged', (c: RealtimeConversation) => this.conversationChanged.next(c));
    this.hub.on('ConversationAiModeChanged', (payload: RealtimeAiModeChanged) => this.conversationAiModeChanged.next(payload));
    this.hub.on('NoteAdded', (n: RealtimeNote) => this.noteAdded.next(n));
    this.hub.on('PresenceChanged', (p: RealtimePresence) => this.presenceChanged.next(p));
    this.hub.on('NotificationCreated', (n: RealtimeNotification) => this.notificationCreated.next(n));

    this.hub.onreconnected(() => this.connected.set(true));
    this.hub.onclose(() => this.connected.set(false));

    try {
      await this.hub.start();
      this.connected.set(true);
    } catch {
      // Non-fatal: the inbox still works via its read endpoints; a later start() retries.
      this.connected.set(false);
    }
  }

  async stop(): Promise<void> {
    await this.hub?.stop();
    this.hub = null;
    this.connected.set(false);
  }

  joinConversation(conversationId: number): void {
    if (this.hub?.state === HubConnectionState.Connected) {
      void this.hub.invoke('JoinConversation', conversationId).catch(() => {});
    }
  }
}
