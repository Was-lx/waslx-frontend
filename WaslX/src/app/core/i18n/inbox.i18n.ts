import type { AppLanguage } from './language.types';

// ─── Inbox page translations ──────────────────────────────────────────────────

export type InboxKey =
  | 'allConversations'
  | 'assignedToMe'
  | 'unassigned'
  | 'searchConversations';

export const inboxTranslations: Record<AppLanguage, Record<InboxKey, string>> = {
  en: {
    allConversations: 'All Conversations',
    assignedToMe: 'Assigned to me',
    unassigned: 'Unassigned',
    searchConversations: 'Search conversations…',
  },
  ar: {
    allConversations: 'كل المحادثات',
    assignedToMe: 'المعيّنة لي',
    unassigned: 'غير معيّنة',
    searchConversations: 'ابحث في المحادثات…',
  },
};
