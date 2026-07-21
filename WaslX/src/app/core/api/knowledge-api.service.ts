import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiClientService } from './api-client.service';

export interface Faq {
  id: number;
  question: string;
  answer: string;
  language: string;
  isActive: boolean;
  documentId: number | null;
  indexStatus: string | null;
}

export interface UpsertFaqRequest {
  question: string;
  answer: string;
  language: string;
  isActive: boolean;
}

export interface KnowledgeDocument {
  id: number;
  sourceType: string;
  title: string;
  language: string;
  status: string;
  errorMessage: string | null;
  chunkCount: number;
  version: number;
  updatedAt: string | null;
  fileUrl: string | null;
  fileName: string | null;
  sourceUrl: string | null;
}

interface PagedResult<T> {
  items: T[];
  hasMore: boolean;
}

export interface KnowledgeMutationResult {
  entityId: number;
  documentId: number;
}

@Injectable({ providedIn: 'root' })
export class KnowledgeApiService {
  private readonly api = inject(ApiClientService);

  // ── FAQs ──
  getFaqs(page = 1, pageSize = 100): Observable<PagedResult<Faq>> {
    return this.api.get<PagedResult<Faq>>('/knowledge/faqs', { params: { page, pageSize } });
  }

  createFaq(request: UpsertFaqRequest): Observable<KnowledgeMutationResult> {
    return this.api.post<KnowledgeMutationResult>('/knowledge/faqs', request);
  }

  updateFaq(id: number, request: UpsertFaqRequest): Observable<KnowledgeMutationResult> {
    return this.api.put<KnowledgeMutationResult>(`/knowledge/faqs/${id}`, request);
  }

  deleteFaq(id: number): Observable<void> {
    return this.api.delete<void>(`/knowledge/faqs/${id}`);
  }

  // ── Documents (generic: Document / Website) ──
  getDocuments(sourceType: 'Document' | 'Website', page = 1, pageSize = 100): Observable<PagedResult<KnowledgeDocument>> {
    return this.api.get<PagedResult<KnowledgeDocument>>('/knowledge/documents', { params: { sourceType, page, pageSize } });
  }

  deleteDocument(id: number): Observable<void> {
    return this.api.delete<void>(`/knowledge/documents/${id}`);
  }

  reindexDocument(id: number): Observable<void> {
    return this.api.post<void>(`/knowledge/documents/${id}/reindex`, {});
  }

  uploadDocument(file: File, title: string, language: string): Observable<KnowledgeMutationResult> {
    const form = new FormData();
    form.append('file', file, file.name);
    if (title) form.append('title', title);
    form.append('language', language);
    return this.api.post<KnowledgeMutationResult>('/knowledge/documents/upload', form);
  }

  addWebsite(url: string, title: string, language: string): Observable<KnowledgeMutationResult> {
    return this.api.post<KnowledgeMutationResult>('/knowledge/websites', { url, title: title || null, language });
  }
}
