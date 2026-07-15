import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

import { ApiClientService } from './api-client.service';

/** Backend AgentAvailabilityResponse shape. */
interface ApiAgentAvailability {
  isOnline: boolean;
  isOnBreak: boolean;
  lastSeenAt: string | null;
}

/** View-model for the current agent's presence / break state. */
export interface AgentAvailability {
  isOnline: boolean;
  isOnBreak: boolean;
  lastSeenAt: string | null;
}

@Injectable({ providedIn: 'root' })
export class AgentsApiService {
  private readonly api = inject(ApiClientService);

  /** Current agent's presence and break status. */
  getMyAvailability(): Observable<AgentAvailability> {
    return this.api.get<ApiAgentAvailability>('/agents/me/availability').pipe(map(toAgentAvailability));
  }

  /** Toggles the current agent's break state. */
  setMyBreak(onBreak: boolean): Observable<void> {
    return this.api.patch<void>('/agents/me/break', { onBreak });
  }
}

function toAgentAvailability(a: ApiAgentAvailability): AgentAvailability {
  return {
    isOnline: a.isOnline,
    isOnBreak: a.isOnBreak,
    lastSeenAt: a.lastSeenAt ?? null,
  };
}
