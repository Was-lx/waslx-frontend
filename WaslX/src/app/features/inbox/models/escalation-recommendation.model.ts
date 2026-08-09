// Escalations now always auto-assign (no more AI-suggests / Manager-confirms step), so this model
// only carries what the "conversation was transferred" UI needs — never a pending recommendation.
export type EscalationStatus = 'open' | 'assigned' | 'resolved' | 'cancelled';

export interface EscalationRecommendation {
  escalationId: number;
  conversationId: number;
  suggestedAssigneeId: number | null;
  suggestedAssigneeName: string | null;
  reason: string;
  score?: number;
  status: EscalationStatus;
  assignedToId: number | null;
  assignedToName: string | null;
  previousOwnerId: number | null;
  previousOwnerName: string | null;
  ownershipTransferredAtUtc: string | null;
  assignedAtUtc: string | null;
  createdAtUtc: string;
}

export interface OwnershipTransferredPayload {
  conversationId: number;
  previousOwnerId: number | null;
  newOwnerId: number;
  transitionType: string;
  occurredAtUtc: string;
  ownershipTransferredAtUtc: string | null;
}
