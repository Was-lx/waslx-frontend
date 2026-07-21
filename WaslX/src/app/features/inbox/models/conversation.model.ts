
export type ConversationStatus = 'New' | 'Assigned' | 'InProgress' | 'Pending' | 'Resolved' | 'Reopened';

export interface ConversationListItem {
  id: number;
  customerName: string;
  customerPhone: string;
  status: string;
  lastMessagePreview: string | null;
  lastMessageAt: string | null;
  assignedUserId: number | null;
  unreadCount: number;
}

/** Rich detail for the customer-context panel + status controls (mirrors ConversationDetailResponse). */
export interface ConversationDetail {
  id: number;
  customerName: string;
  customerPhone: string;
  status: string;
  allowedTransitions: string[];
  assignedUserId: number | null;
  assignedUserName: string | null;
  tags: string[];
  createdAt: string;
  lastMessageAt: string | null;
  lastInboundAt: string | null;
  windowExpiresAt: string | null;
  isWindowOpen: boolean;
  windowType: string;
  remainingSeconds: number;
  messageCount: number;
  groupId: number | null;
  groupName: string | null;
  currentStageId: number | null;
  currentStageName: string | null;
}

/** Result of a status change (mirrors ConversationStatusResponse). */
export interface ConversationStatusResult {
  id: number;
  status: string;
  allowedTransitions: string[];
}

/** An internal team note (mirrors NoteDto). */
export interface ConversationNote {
  id: number;
  conversationId: number;
  content: string;
  authorName: string;
  createdAt: string;
}

/** Cursor-paginated slice returned by the inbox read endpoints. */
export interface PagedResult<T> {
  items: T[];
  hasMore: boolean;
}
