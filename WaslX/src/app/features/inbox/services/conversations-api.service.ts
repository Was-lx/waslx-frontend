import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiClientService } from '../../../core/api/api-client.service';
import type { ConversationListItem, PagedResult } from '../models/conversation.model';
import type { ConversationMessage, SendMessageResult } from '../models/message.model';

@Injectable({ providedIn: 'root' })
export class ConversationsApiService {
  private readonly api = inject(ApiClientService);

  /** Role-filtered, paginated conversation list (agents see own; managers/admins see all). */
  list(page = 1, pageSize = 30): Observable<PagedResult<ConversationListItem>> {
    return this.api.get<PagedResult<ConversationListItem>>('/conversations', { params: { page, pageSize } });
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
}
