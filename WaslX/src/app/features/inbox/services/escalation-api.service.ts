import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiClientService } from '../../../core/api/api-client.service';
import type {
  EscalationRecommendation,
  EscalationModeSettings,
  ConfirmRequest,
  OverrideRequest
} from '../models/escalation-recommendation.model';

@Injectable({ providedIn: 'root' })
export class EscalationApiService {
  private readonly api = inject(ApiClientService);

  getRecommendation(conversationId: number): Observable<EscalationRecommendation> {
    return this.api.get<EscalationRecommendation>(`/conversations/${conversationId}/escalation-recommendation`);
  }

  confirm(escalationId: number, assigneeId: number): Observable<EscalationRecommendation> {
    return this.api.post<EscalationRecommendation>(`/escalation/escalations/${escalationId}/confirm`, { assigneeId } satisfies ConfirmRequest);
  }

  override(escalationId: number, assigneeId: number, reason: string): Observable<EscalationRecommendation> {
    return this.api.post<EscalationRecommendation>(`/escalation/escalations/${escalationId}/override`, { assigneeId, reason } satisfies OverrideRequest);
  }

  getSettings(): Observable<EscalationModeSettings> {
    return this.api.get<EscalationModeSettings>('/escalation/settings');
  }

  updateSettings(mode: string): Observable<EscalationModeSettings> {
    return this.api.put<EscalationModeSettings>('/escalation/settings', { mode });
  }
}
