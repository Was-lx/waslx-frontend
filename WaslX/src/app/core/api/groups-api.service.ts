import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

import { ApiClientService } from './api-client.service';

/** Backend stage shape nested inside a group. */
interface ApiStage {
  id: number;
  name: string;
  sequenceOrder: number;
}

/** Backend GroupResponse shape. */
interface ApiGroup {
  id: number;
  name: string;
  description: string | null;
  isDefault: boolean;
  isAssignableByDistribution: boolean;
  stages: ApiStage[];
  memberCount: number;
}

/** A stage (pipeline step) inside a group. */
export interface Stage {
  id: number;
  name: string;
  sequenceOrder: number;
}

/** View-model used by the Groups screens. */
export interface Group {
  id: number;
  name: string;
  description: string | null;
  isDefault: boolean;
  isAssignableByDistribution: boolean;
  stages: Stage[];
  memberCount: number;
}

/** Create / update payload for a group. */
export interface UpsertGroupRequest {
  name: string;
  description: string | null;
  isAssignableByDistribution: boolean;
}

/** Backend BoardConversationItem shape (light projection for the pipeline board). */
interface ApiBoardConversation {
  id: number;
  customerName: string;
  customerPhone: string;
  status: string;
  assignedUserName: string | null;
  lastMessageAt: string | null;
}

/** Backend StageBoardColumn shape. `stageId` is null for the synthetic "Unstaged" column. */
interface ApiBoardColumn {
  stageId: number | null;
  stageName: string;
  sequenceOrder: number;
  conversations: ApiBoardConversation[];
}

/** A conversation card on the pipeline board. */
export interface BoardConversation {
  id: number;
  customerName: string;
  customerPhone: string;
  status: string;
  assignedUserName: string | null;
  lastMessageAt: string | null;
}

/** One column (stage) of a group's pipeline board with the conversations sitting in it. */
export interface BoardColumn {
  stageId: number | null;
  stageName: string;
  sequenceOrder: number;
  conversations: BoardConversation[];
}

@Injectable({ providedIn: 'root' })
export class GroupsApiService {
  private readonly api = inject(ApiClientService);

  getGroups(): Observable<Group[]> {
    return this.api.get<ApiGroup[]>('/groups').pipe(map((list) => list.map(toGroup)));
  }

  createGroup(request: UpsertGroupRequest): Observable<Group> {
    return this.api.post<ApiGroup>('/groups', request).pipe(map(toGroup));
  }

  updateGroup(id: number, request: UpsertGroupRequest): Observable<Group> {
    return this.api.put<ApiGroup>(`/groups/${id}`, request).pipe(map(toGroup));
  }

  deleteGroup(id: number): Observable<void> {
    return this.api.delete<void>(`/groups/${id}`);
  }

  // ── Pipeline board ──

  /**
   * The stage pipeline board for a group: columns = stages (plus a synthetic "Unstaged" column),
   * each with the conversations currently sitting in it. Tenant- and role-scoped server-side
   * (agents see only their own conversations; managers/admins see the whole team).
   */
  getBoard(groupId: number): Observable<BoardColumn[]> {
    return this.api
      .get<ApiBoardColumn[]>(`/groups/${groupId}/board`)
      .pipe(map((cols) => (cols ?? []).map(toBoardColumn).sort((a, b) => a.sequenceOrder - b.sequenceOrder)));
  }

  // ── Stages ──

  addStage(groupId: number, name: string): Observable<Stage> {
    return this.api.post<ApiStage>(`/groups/${groupId}/stages`, { name }).pipe(map(toStage));
  }

  renameStage(groupId: number, stageId: number, name: string): Observable<Stage> {
    return this.api.put<ApiStage>(`/groups/${groupId}/stages/${stageId}`, { name }).pipe(map(toStage));
  }

  deleteStage(groupId: number, stageId: number): Observable<void> {
    return this.api.delete<void>(`/groups/${groupId}/stages/${stageId}`);
  }

  reorderStages(groupId: number, stageIdsInOrder: number[]): Observable<void> {
    return this.api.put<void>(`/groups/${groupId}/stages/reorder`, { stageIdsInOrder });
  }

  // ── Members ──

  addMember(groupId: number, userId: string): Observable<void> {
    return this.api.post<void>(`/groups/${groupId}/members`, { userId });
  }

  removeMember(groupId: number, userId: string): Observable<void> {
    return this.api.delete<void>(`/groups/${groupId}/members/${userId}`);
  }
}

function toBoardColumn(c: ApiBoardColumn): BoardColumn {
  return {
    stageId: c.stageId ?? null,
    stageName: c.stageName,
    sequenceOrder: c.sequenceOrder,
    conversations: (c.conversations ?? []).map((conv) => ({
      id: conv.id,
      customerName: conv.customerName,
      customerPhone: conv.customerPhone,
      status: conv.status,
      assignedUserName: conv.assignedUserName ?? null,
      lastMessageAt: conv.lastMessageAt ?? null,
    })),
  };
}

function toStage(s: ApiStage): Stage {
  return {
    id: s.id,
    name: s.name,
    sequenceOrder: s.sequenceOrder,
  };
}

function toGroup(g: ApiGroup): Group {
  return {
    id: g.id,
    name: g.name,
    description: g.description ?? null,
    isDefault: g.isDefault,
    isAssignableByDistribution: g.isAssignableByDistribution,
    stages: (g.stages ?? []).map(toStage).sort((a, b) => a.sequenceOrder - b.sequenceOrder),
    memberCount: g.memberCount ?? 0,
  };
}
