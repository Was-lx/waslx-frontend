// ─────────────────────────────────────────────────────────────────────────────
// Conversation message models (mirror WaslX.Application Conversations DTOs).
// ─────────────────────────────────────────────────────────────────────────────

export type MessageSenderType = 'Customer' | 'Agent' | 'System' | 'AI';
export type MessageDeliveryStatus = 'Queued' | 'Sent' | 'Delivered' | 'Read' | 'Failed';
export type MessageKind = 'Text' | 'Image' | 'Document' | 'Audio' | 'Video' | 'Template' | 'Location' | 'Sticker';

export interface ConversationMessage {
  id: number;
  senderType: string;
  content: string;
  messageType: string;
  status: string;
  timestamp: string;
  senderUserId: number | null;
  mediaUrl: string | null;
  mediaMimeType: string | null;
  mediaFileName: string | null;
}

/** Result of an outbound send (mirrors SendMessageResult). */
export interface SendMessageResult {
  messageId: number;
  conversationId: number;
  whatsAppMessageId: string;
  status: string;
}
