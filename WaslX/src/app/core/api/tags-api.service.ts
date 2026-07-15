import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

import { ApiClientService } from './api-client.service';

/** Backend TagResponse shape. */
interface ApiTag {
  id: number;
  name: string;
  color: string;
  description: string | null;
}

/** View-model used by the Tags screens. */
export interface Tag {
  id: number;
  name: string;
  color: string;
  description: string | null;
}

/** Create / update payload for a tag. */
export interface UpsertTagRequest {
  name: string;
  color: string;
  description: string | null;
}

@Injectable({ providedIn: 'root' })
export class TagsApiService {
  private readonly api = inject(ApiClientService);

  getTags(): Observable<Tag[]> {
    return this.api.get<ApiTag[]>('/tags').pipe(map((list) => list.map(toTag)));
  }

  createTag(request: UpsertTagRequest): Observable<Tag> {
    return this.api.post<ApiTag>('/tags', request).pipe(map(toTag));
  }

  updateTag(id: number, request: UpsertTagRequest): Observable<Tag> {
    return this.api.put<ApiTag>(`/tags/${id}`, request).pipe(map(toTag));
  }

  deleteTag(id: number): Observable<void> {
    return this.api.delete<void>(`/tags/${id}`);
  }

  /** Applies an existing tag to a conversation. */
  applyToConversation(conversationId: number, tagId: number): Observable<void> {
    return this.api.post<void>(`/conversations/${conversationId}/tags/${tagId}`);
  }

  /** Removes a tag from a conversation. */
  removeFromConversation(conversationId: number, tagId: number): Observable<void> {
    return this.api.delete<void>(`/conversations/${conversationId}/tags/${tagId}`);
  }
}

function toTag(t: ApiTag): Tag {
  return {
    id: t.id,
    name: t.name,
    color: t.color,
    description: t.description ?? null,
  };
}
