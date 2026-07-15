import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpEvent, HttpEventType } from '@angular/common/http';
import { Observable, filter, map } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { ApiClientService } from '../../../core/api/api-client.service';
import type {
  ConversationDetail,
  ConversationListItem,
  ConversationNote,
  ConversationStatusResult,
  PagedResult
} from '../models/conversation.model';
import type { ConversationMessage, SendMessageResult } from '../models/message.model';

/** A media upload in flight: either progress (0–100) or the final send result. */
export type MediaUploadEvent =
  | { kind: 'progress'; progress: number }
  | { kind: 'done'; result: SendMessageResult };

/**
 * Optional server-side filters for the conversation list (all additive query params).
 * Empty / null values are omitted so the list falls back to the role-scoped default.
 */
export interface ConversationListFilters {
  status?: string | null;
  assignedUserId?: string | null;
  unassigned?: boolean | null;
  groupId?: number | null;
  tagId?: number | null;
  whatsAppAccountId?: number | null;
  customerId?: number | null;
  dateFrom?: string | null;
  dateTo?: string | null;
  search?: string | null;
}

@Injectable({ providedIn: 'root' })
export class ConversationsApiService {
  private readonly api = inject(ApiClientService);
  private readonly http = inject(HttpClient);

  /**
   * Role-filtered, paginated conversation list (agents see own; managers/admins see all).
   * Any provided {@link ConversationListFilters} are forwarded as additive query params.
   */
  list(filters: ConversationListFilters = {}, page = 1, pageSize = 30): Observable<PagedResult<ConversationListItem>> {
    const params: Record<string, string | number | boolean> = { page, pageSize };
    if (filters.status) params['status'] = filters.status;
    if (filters.assignedUserId) params['assignedUserId'] = filters.assignedUserId;
    if (filters.unassigned) params['unassigned'] = true;
    if (filters.groupId != null) params['groupId'] = filters.groupId;
    if (filters.tagId != null) params['tagId'] = filters.tagId;
    if (filters.whatsAppAccountId != null) params['whatsAppAccountId'] = filters.whatsAppAccountId;
    if (filters.customerId != null) params['customerId'] = filters.customerId;
    if (filters.dateFrom) params['dateFrom'] = filters.dateFrom;
    if (filters.dateTo) params['dateTo'] = filters.dateTo;
    if (filters.search && filters.search.trim()) params['search'] = filters.search.trim();
    return this.api.get<PagedResult<ConversationListItem>>('/conversations', { params });
  }

  /** Rich detail for the customer-context panel + status controls. */
  detail(conversationId: number): Observable<ConversationDetail> {
    return this.api.get<ConversationDetail>(`/conversations/${conversationId}`);
  }

  /** Cursor-paginated message history; `before` is a message id for loading older history. */
  messages(conversationId: number, before?: number, pageSize = 30): Observable<PagedResult<ConversationMessage>> {
    const params: Record<string, string | number | boolean> = { pageSize };
    if (before != null) {
      params['before'] = before;
    }
    return this.api.get<PagedResult<ConversationMessage>>(`/conversations/${conversationId}/messages`, { params });
  }

  /** Sends a text reply within a conversation. */
  sendText(conversationId: number, text: string): Observable<SendMessageResult> {
    return this.api.post<SendMessageResult>(`/conversations/${conversationId}/messages`, { text });
  }

  /** Marks a conversation read (clears its unread count). Internal only — no WhatsApp read receipt. */
  markRead(conversationId: number): Observable<void> {
    return this.api.post<void>(`/conversations/${conversationId}/read`, {});
  }

  /** Soft-deletes a conversation; a future inbound message from the same customer starts a new one. */
  delete(conversationId: number): Observable<void> {
    return this.api.delete<void>(`/conversations/${conversationId}`);
  }

  /** Applies a manual lifecycle transition (server-side state machine rejects invalid moves). */
  changeStatus(conversationId: number, status: string): Observable<ConversationStatusResult> {
    return this.api.post<ConversationStatusResult>(`/conversations/${conversationId}/status`, { status });
  }

  /**
   * Routes a conversation into a group / team; it lands on that group's first stage.
   * (FR-GRP cross-team routing.)
   */
  routeToGroup(conversationId: number, groupId: number): Observable<void> {
    return this.api.post<void>(`/conversations/${conversationId}/route`, { groupId });
  }

  /** Moves a conversation to a stage within its CURRENT group's pipeline (used by the board). */
  moveToStage(conversationId: number, stageId: number): Observable<void> {
    return this.api.post<void>(`/conversations/${conversationId}/stage`, { stageId });
  }

  /**
   * Cross-team handoff: transfers a conversation to another team and clears its current assignment.
   * The full message history, notes and timeline are preserved.
   */
  handoff(conversationId: number, targetGroupId: number): Observable<void> {
    return this.api.post<void>(`/conversations/${conversationId}/handoff`, { targetGroupId });
  }

  /** Lists a conversation's internal team notes. */
  notes(conversationId: number): Observable<ConversationNote[]> {
    return this.api.get<ConversationNote[]>(`/conversations/${conversationId}/notes`);
  }

  /** Adds an internal team note (never sent to the customer). */
  addNote(conversationId: number, content: string): Observable<ConversationNote> {
    return this.api.post<ConversationNote>(`/conversations/${conversationId}/notes`, { content });
  }

  /**
   * Uploads a file (image/video/document) and sends it as a reply, reporting upload progress.
   * Emits `{kind:'progress'}` events then a final `{kind:'done'}` with the send result.
   */
  sendMedia(conversationId: number, file: File, caption: string): Observable<MediaUploadEvent> {
    const form = new FormData();
    form.append('file', file, file.name);
    if (caption) form.append('caption', caption);

    return this.http.post<SendMessageResult>(
      `${environment.apiUrl}/conversations/${conversationId}/media`,
      form,
      { reportProgress: true, observe: 'events' }
    ).pipe(
      filter((event: HttpEvent<SendMessageResult>) =>
        event.type === HttpEventType.UploadProgress || event.type === HttpEventType.Response),
      map((event: HttpEvent<SendMessageResult>): MediaUploadEvent => {
        if (event.type === HttpEventType.UploadProgress) {
          const progress = event.total ? Math.round((event.loaded / event.total) * 100) : 0;
          return { kind: 'progress', progress };
        }
        return { kind: 'done', result: (event as { body: SendMessageResult }).body };
      })
    );
  }
}
