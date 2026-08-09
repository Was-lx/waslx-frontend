import { Injectable, inject, signal } from '@angular/core';
import { Subject } from 'rxjs';

import { InboxRealtimeService } from '../../../core/services/inbox-realtime.service';
import type { ConversationEscalatedPayload } from '../models/conversation-classification.model';
import type { EscalationRecommendation, OwnershipTransferredPayload } from '../models/escalation-recommendation.model';

@Injectable({ providedIn: 'root' })
export class EscalationRealtimeService {
  private readonly realtime = inject(InboxRealtimeService);

  // Escalations now always auto-assign — there's no more "recommended, awaiting Manager confirm/
  // override" state, so those events are no longer emitted by the backend and aren't listened for here.
  readonly escalationAutoAssigned = new Subject<EscalationRecommendation>();
  readonly conversationOwnershipTransferred = new Subject<OwnershipTransferredPayload>();
  readonly conversationEscalated = new Subject<ConversationEscalatedPayload>();

  private initialized = signal(false);

  init(): void {
    if (this.initialized()) return;
    this.initialized.set(true);

    this.realtime['hub']?.on('EscalationAutoAssigned', (r: EscalationRecommendation) =>
      this.escalationAutoAssigned.next(r));
    this.realtime['hub']?.on('ConversationOwnershipTransferred', (p: OwnershipTransferredPayload) =>
      this.conversationOwnershipTransferred.next(p));
    this.realtime['hub']?.on('ConversationEscalated', (p: ConversationEscalatedPayload) =>
      this.conversationEscalated.next(p));
  }
}
