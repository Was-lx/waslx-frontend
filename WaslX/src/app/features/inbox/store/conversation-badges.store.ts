import { Injectable, inject, signal, computed } from '@angular/core';

import { InboxRealtimeService } from '../../../core/services/inbox-realtime.service';
import { EscalationRealtimeService } from '../services/escalation-realtime.service';
import type {
  ConversationClassificationBadgeData,
  MessageClassificationPayload,
  ConversationEscalatedPayload,
  EscalationStatus,
} from '../models/conversation-classification.model';

export interface BadgesState {
  classifications: Record<number, ConversationClassificationBadgeData>;
}

const initial: BadgesState = { classifications: {} };

@Injectable({ providedIn: 'root' })
export class ConversationBadgesStore {
  private readonly realtime = inject(InboxRealtimeService);
  private readonly escalationRealtime = inject(EscalationRealtimeService);

  private readonly state = signal<BadgesState>(initial);

  readonly allBadges = computed(() => this.state().classifications);

  getBadgeData(conversationId: number): ConversationClassificationBadgeData | null {
    return this.state().classifications[conversationId] ?? null;
  }

  private setBadgeData(conversationId: number, data: Partial<ConversationClassificationBadgeData>): void {
    this.state.update(s => {
      const existing = s.classifications[conversationId] ?? { conversationId };
      return {
        ...s,
        classifications: {
          ...s.classifications,
          [conversationId]: { ...existing, ...data, conversationId }
        }
      };
    });
  }

  init(): void {
    this.realtime.messageClassificationUpdated.subscribe((p: MessageClassificationPayload) => {
      this.setBadgeData(p.conversationId, {
        conversationId: p.conversationId,
        messageId: p.messageId,
        topic: p.classification.topic,
        language: p.classification.language as any,
        sentiment: p.classification.sentiment as any,
        priority: p.classification.priority as any,
        escalate: p.classification.escalate,
        reason: p.classification.reason,
        updatedAtUtc: new Date().toISOString(),
      });
    });

    this.escalationRealtime.conversationEscalated.subscribe((p: ConversationEscalatedPayload) => {
      this.setBadgeData(p.conversationId, {
        conversationId: p.conversationId,
        priority: p.priority as any,
        sentiment: p.sentiment as any,
        escalate: true,
        escalationStatus: p.status as EscalationStatus,
        reason: p.reason,
        updatedAtUtc: p.occurredAtUtc,
      });
    });

    this.escalationRealtime.escalationRecommendationUpdated.subscribe(r => {
      this.setBadgeData(r.conversationId, {
        escalate: true,
        escalationStatus: r.status as EscalationStatus,
        updatedAtUtc: r.createdAtUtc,
      });
    });
  }
}
