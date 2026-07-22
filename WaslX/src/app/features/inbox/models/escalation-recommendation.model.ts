export type EscalationMode = 'recommend' | 'autoAssign';
export type EscalationStatus = 'open' | 'recommended' | 'confirmed' | 'assigned' | 'resolved' | 'cancelled';

export interface EscalationCandidateSnapshot {
  agentId: number;
  agentName: string;
  overallScore: number;
  performanceScore: number;
  responseSpeedScore: number;
  workloadScore: number;
  activeChats: number;
  rankingOrder: number;
  status: string;
  reason: string;
}

export interface EscalationRecommendation {
  escalationId: number;
  conversationId: number;
  suggestedAssigneeId: number | null;
  suggestedAssigneeName: string | null;
  reason: string;
  score: number | null;
  mode: EscalationMode;
  status: EscalationStatus;
  assignedToId: number | null;
  assignedToName: string | null;
  previousOwnerId: number | null;
  previousOwnerName: string | null;
  overrideReason: string | null;
  ownershipTransferredAtUtc: string | null;
  confirmedAtUtc: string | null;
  assignedAtUtc: string | null;
  createdAtUtc: string;
  priority: string | null;
  topic: string | null;
  sentiment: string | null;
  candidates: EscalationCandidateSnapshot[];
}

export interface EscalationModeSettings {
  mode: EscalationMode;
}

export interface OwnershipTransferredPayload {
  conversationId: number;
  previousOwnerId: number | null;
  newOwnerId: number;
  transitionType: string;
  occurredAtUtc: string;
  ownershipTransferredAtUtc: string | null;
}

export interface ConfirmRequest {
  assigneeId: number;
}

export interface OverrideRequest {
  assigneeId: number;
  reason: string;
}

export interface RejectRequest {
  reason: string | null;
}
