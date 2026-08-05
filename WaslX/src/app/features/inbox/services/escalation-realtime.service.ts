import { Injectable, inject, signal } from '@angular/core';
import { Subject } from 'rxjs';

import { InboxRealtimeService } from '../../../core/services/inbox-realtime.service';
import type { ConversationEscalatedPayload } from '../models/conversation-classification.model';
import type { EscalationRecommendation, OwnershipTransferredPayload } from '../models/escalation-recommendation.model';

@Injectable({ providedIn: 'root' })
export class EscalationRealtimeService {
  private readonly realtime = inject(InboxRealtimeService);

  readonly escalationRecommendationUpdated = new Subject<EscalationRecommendation>();
  readonly escalationAssignmentConfirmed = new Subject<EscalationRecommendation>();
  readonly escalationAutoAssigned = new Subject<EscalationRecommendation>();
  readonly escalationOverrideApplied = new Subject<EscalationRecommendation>();
  readonly escalationRejected = new Subject<EscalationRecommendation>();
  readonly conversationOwnershipTransferred = new Subject<OwnershipTransferredPayload>();
  readonly conversationEscalated = new Subject<ConversationEscalatedPayload>();

  private initialized = signal(false);

  init(): void {
    if (this.initialized()) return;
    this.initialized.set(true);

    this.realtime['hub']?.on('EscalationRecommendationUpdated', (r: EscalationRecommendation) =>
      this.escalationRecommendationUpdated.next(r));
    this.realtime['hub']?.on('EscalationAssignmentConfirmed', (r: EscalationRecommendation) =>
      this.escalationAssignmentConfirmed.next(r));
    this.realtime['hub']?.on('EscalationAutoAssigned', (r: EscalationRecommendation) =>
      this.escalationAutoAssigned.next(r));
    this.realtime['hub']?.on('EscalationOverrideApplied', (r: EscalationRecommendation) =>
      this.escalationOverrideApplied.next(r));
    this.realtime['hub']?.on('EscalationRejected', (r: EscalationRecommendation) =>
      this.escalationRejected.next(r));
    this.realtime['hub']?.on('ConversationOwnershipTransferred', (p: OwnershipTransferredPayload) =>
      this.conversationOwnershipTransferred.next(p));
    this.realtime['hub']?.on('ConversationEscalated', (p: ConversationEscalatedPayload) =>
      this.conversationEscalated.next(p));
  }
}
