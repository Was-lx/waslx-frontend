import { Injectable, inject, signal, computed } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Subject, merge } from 'rxjs';
import { scan, startWith } from 'rxjs/operators';

import { EscalationApiService } from '../services/escalation-api.service';
import { EscalationRealtimeService } from '../services/escalation-realtime.service';
import type {
  EscalationRecommendation,
  EscalationModeSettings,
  OwnershipTransferredPayload
} from '../models/escalation-recommendation.model';

export interface EscalationState {
  recommendations: Record<number, EscalationRecommendation>;
  settings: EscalationModeSettings | null;
  ownershipTransfers: Record<number, OwnershipTransferredPayload>;
}

const initialState: EscalationState = {
  recommendations: {},
  settings: null,
  ownershipTransfers: {},
};

@Injectable({ providedIn: 'root' })
export class EscalationStore {
  private readonly api = inject(EscalationApiService);
  private readonly realtime = inject(EscalationRealtimeService);

  private readonly state = signal<EscalationState>(initialState);

  readonly recommendations = computed(() => this.state().recommendations);
  readonly settings = computed(() => this.state().settings);
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

  async loadSettings(): Promise<void> {
    try {
      const settings = await this.api.getSettings().toPromise();
      if (settings) {
        this.state.update(s => ({ ...s, settings }));
      }
    } catch {
      // Default to recommend
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

    this.realtime.escalationRecommendationUpdated.subscribe(r => {
      this.setRecommendation(r.conversationId, r);
    });

    this.realtime.escalationAssignmentConfirmed.subscribe(r => {
      this.setRecommendation(r.conversationId, r);
    });

    this.realtime.escalationAutoAssigned.subscribe(r => {
      this.setRecommendation(r.conversationId, r);
    });

    this.realtime.escalationOverrideApplied.subscribe(r => {
      this.setRecommendation(r.conversationId, r);
    });

    this.realtime.escalationRejected.subscribe(r => {
      this.setRecommendation(r.conversationId, r);
    });

    this.realtime.conversationOwnershipTransferred.subscribe(p => {
      this.setOwnershipTransfer(p);
    });
  }
}
