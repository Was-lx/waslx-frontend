import { Injectable, inject, signal, computed } from '@angular/core';

import { EscalationApiService } from '../services/escalation-api.service';
import { EscalationRealtimeService } from '../services/escalation-realtime.service';
import type { EscalationRecommendation, OwnershipTransferredPayload } from '../models/escalation-recommendation.model';

export interface EscalationState {
  recommendations: Record<number, EscalationRecommendation>;
  ownershipTransfers: Record<number, OwnershipTransferredPayload>;
}

const initialState: EscalationState = {
  recommendations: {},
  ownershipTransfers: {},
};

@Injectable({ providedIn: 'root' })
export class EscalationStore {
  private readonly api = inject(EscalationApiService);
  private readonly realtime = inject(EscalationRealtimeService);

  private readonly state = signal<EscalationState>(initialState);

  readonly recommendations = computed(() => this.state().recommendations);
  readonly ownershipTransfers = computed(() => this.state().ownershipTransfers);

  getRecommendation(conversationId: number): EscalationRecommendation | undefined {
    return this.state().recommendations[conversationId];
  }

  getOwnershipTransfer(conversationId: number): OwnershipTransferredPayload | undefined {
    return this.state().ownershipTransfers[conversationId];
  }

  async loadRecommendation(conversationId: number): Promise<void> {
    try {
      const recommendation = await this.api.getRecommendation(conversationId).toPromise();
      if (recommendation) {
        this.state.update(s => ({
          ...s,
          recommendations: { ...s.recommendations, [conversationId]: recommendation }
        }));
      }
    } catch {
      // Not found is acceptable — no escalation exists
    }
  }

  setRecommendation(conversationId: number, recommendation: EscalationRecommendation): void {
    this.state.update(s => ({
      ...s,
      recommendations: { ...s.recommendations, [conversationId]: recommendation }
    }));
  }

  setOwnershipTransfer(payload: OwnershipTransferredPayload): void {
    this.state.update(s => ({
      ...s,
      ownershipTransfers: {
        ...s.ownershipTransfers,
        [payload.conversationId]: payload
      }
    }));
  }

  init(): void {
    this.realtime.init();

    // Escalations always auto-assign now — this is the only assignment-result event left.
    this.realtime.escalationAutoAssigned.subscribe(r => {
      this.setRecommendation(r.conversationId, r);
    });

    this.realtime.conversationOwnershipTransferred.subscribe(p => {
      this.setOwnershipTransfer(p);
    });
  }
}
