import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

import { ApiClientService } from './api-client.service';

/** Backend AgentAccessResponse shape. */
interface ApiAgentAccess {
  userId: string;
  channelIds: number[];
  distributionWhatsAppAccountIds: number[];
  groupIds: number[];
  shiftIds: number[];
}

/** View-model describing what an agent has access to (channels, numbers, groups, shifts). */
export interface AgentAccess {
  userId: string;
  channelIds: number[];
  distributionWhatsAppAccountIds: number[];
  groupIds: number[];
  shiftIds: number[];
}

/** Update payload for an agent's access. */
export interface UpdateAgentAccessRequest {
  channelIds: number[];
  distributionWhatsAppAccountIds: number[];
  groupIds: number[];
  shiftIds: number[];
}

@Injectable({ providedIn: 'root' })
export class AgentAccessApiService {
  private readonly api = inject(ApiClientService);

  getAccess(appUserId: string): Observable<AgentAccess> {
    return this.api.get<ApiAgentAccess>(`/users/${appUserId}/access`).pipe(map(toAgentAccess));
  }

  updateAccess(appUserId: string, request: UpdateAgentAccessRequest): Observable<void> {
    return this.api.put<void>(`/users/${appUserId}/access`, request);
  }
}

function toAgentAccess(a: ApiAgentAccess): AgentAccess {
  return {
    userId: a.userId,
    channelIds: a.channelIds ?? [],
    distributionWhatsAppAccountIds: a.distributionWhatsAppAccountIds ?? [],
    groupIds: a.groupIds ?? [],
    shiftIds: a.shiftIds ?? [],
  };
}
