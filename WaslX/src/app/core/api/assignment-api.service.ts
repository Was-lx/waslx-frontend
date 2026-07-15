import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

import { ApiClientService } from './api-client.service';

/** How a conversation was assigned. */
export type AssignmentMethod = 'Manual' | 'RoundRobin' | 'AI' | string;

/** Backend AssignmentResponse shape (assignment history entry). */
interface ApiAssignment {
  id: number;
  assignedToName: string;
  assignedByName: string | null;
  method: string;
  reason: string | null;
  assignedAt: string;
}

/** Backend UnassignedConversationResponse shape. */
interface ApiUnassignedConversation {
  conversationId: number;
  customerName: string | null;
  customerPhone: string;
  lastMessageAt: string;
  whatsAppAccountId: number;
}

/** A single entry in a conversation's assignment history. */
export interface Assignment {
  id: number;
  assignedToName: string;
  assignedByName: string | null;
  method: AssignmentMethod;
  reason: string | null;
  assignedAt: string;
}

/** A conversation currently waiting for assignment. */
export interface UnassignedConversation {
  conversationId: number;
  customerName: string | null;
  customerPhone: string;
  lastMessageAt: string;
  whatsAppAccountId: number;
}

/** Assign / reassign payload. */
export interface AssignRequest {
  targetUserId: string;
  reason?: string;
}

@Injectable({ providedIn: 'root' })
export class AssignmentApiService {
  private readonly api = inject(ApiClientService);

  assign(conversationId: number, request: AssignRequest): Observable<void> {
    return this.api.post<void>(`/conversations/${conversationId}/assign`, request);
  }

  reassign(conversationId: number, request: AssignRequest): Observable<void> {
    return this.api.post<void>(`/conversations/${conversationId}/reassign`, request);
  }

  getAssignments(conversationId: number): Observable<Assignment[]> {
    return this.api
      .get<ApiAssignment[]>(`/conversations/${conversationId}/assignments`)
      .pipe(map((list) => list.map(toAssignment)));
  }

  getUnassigned(): Observable<UnassignedConversation[]> {
    return this.api
      .get<ApiUnassignedConversation[]>('/conversations/unassigned')
      .pipe(map((list) => list.map(toUnassignedConversation)));
  }
}

function toAssignment(a: ApiAssignment): Assignment {
  return {
    id: a.id,
    assignedToName: a.assignedToName,
    assignedByName: a.assignedByName ?? null,
    method: a.method,
    reason: a.reason ?? null,
    assignedAt: a.assignedAt,
  };
}

function toUnassignedConversation(c: ApiUnassignedConversation): UnassignedConversation {
  return {
    conversationId: c.conversationId,
    customerName: c.customerName ?? null,
    customerPhone: c.customerPhone,
    lastMessageAt: c.lastMessageAt,
    whatsAppAccountId: c.whatsAppAccountId,
  };
}
