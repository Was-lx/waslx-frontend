import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiClientService } from '../../../core/api/api-client.service';
import type { EscalationRecommendation } from '../models/escalation-recommendation.model';

@Injectable({ providedIn: 'root' })
export class EscalationApiService {
  private readonly api = inject(ApiClientService);

  getRecommendation(conversationId: number): Observable<EscalationRecommendation> {
    return this.api.get<EscalationRecommendation>(`/conversations/${conversationId}/escalation-recommendation`);
  }
}
