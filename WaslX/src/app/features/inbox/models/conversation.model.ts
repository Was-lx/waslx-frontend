// ─────────────────────────────────────────────────────────────────────────────
// Shared-inbox conversation models (mirror WaslX.Application Conversations DTOs).
// ─────────────────────────────────────────────────────────────────────────────

export type ConversationStatus = 'New' | 'Assigned' | 'InProgress' | 'Pending' | 'Resolved' | 'Reopened';

export interface ConversationListItem {
  id: number;
  customerName: string;
  customerPhone: string;
  status: string;
  lastMessagePreview: string | null;
  lastMessageAt: string | null;
  assignedUserId: number | null;
}

/** Cursor-paginated slice returned by the inbox read endpoints. */
export interface PagedResult<T> {
  items: T[];
  hasMore: boolean;
}
