export type SentimentLabel = 'positive' | 'neutral' | 'negative' | 'angry';
export type PriorityLabel = 'low' | 'normal' | 'high' | 'urgent';
export type EscalationStatus = 'none' | 'open' | 'recommended' | 'assigned' | 'resolved';

export interface ConversationClassificationBadgeData {
  conversationId: number;
  messageId?: number;
  topic?: string;
  language?: 'arabic' | 'english' | 'mixed' | 'unknown';
  sentiment?: SentimentLabel;
  priority?: PriorityLabel;
  escalate?: boolean;
  escalationStatus?: EscalationStatus;
  reason?: string;
  updatedAtUtc?: string;
}

export interface MessageClassificationPayload {
  conversationId: number;
  messageId: number;
  classification: ClassificationDto;
}

export interface ClassificationDto {
  topic: string;
  language: string;
  sentiment: string;
  priority: string;
  escalate: boolean;
  reason: string;
}

export interface ConversationEscalatedPayload {
  escalationId: number;
  conversationId: number;
  tenantId: number;
  reason: string;
  priority: string;
  sentiment: string;
  status: string;
  occurredAtUtc: string;
}
