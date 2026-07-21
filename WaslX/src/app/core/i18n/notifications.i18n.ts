import type { AppLanguage } from './language.types';

// ─── Notifications translations (FR-NOTIF · FE-5.7) ──────────────────────────
// Bell + panel, the /notifications center, and browser-notification opt-in.

export type NotificationsKey =
  // ── Bell / panel ──
  | 'notifBell'
  | 'notifPanelTitle'
  | 'notifMarkAllRead'
  | 'notifSeeAll'
  | 'notifToday'
  | 'notifEarlier'
  | 'notifPanelEmpty'
  | 'notifPanelEmptyHint'
  // ── Browser opt-in ──
  | 'notifEnableBrowser'
  | 'notifBrowserOn'
  | 'notifBrowserDenied'
  | 'notifBrowserHint'
  // ── Center page ──
  | 'notifEyebrow'
  | 'notifTitle'
  | 'notifLead'
  | 'notifFilterAll'
  | 'notifFilterUnread'
  | 'notifRefresh'
  | 'notifLoading'
  | 'notifErrorTitle'
  | 'notifErrorBody'
  | 'notifRetry'
  | 'notifEmptyTitle'
  | 'notifEmptyBody'
  | 'notifUnreadEmptyTitle'
  | 'notifUnreadEmptyBody'
  | 'notifMarkRead'
  | 'notifUnreadBadge'
  // ── Type labels (chip aria) ──
  | 'notifTypeAssignment'
  | 'notifTypeConversation'
  | 'notifTypeCampaign'
  | 'notifTypeMention'
  | 'notifTypeSystem';

export const notificationsTranslations: Record<AppLanguage, Record<NotificationsKey, string>> = {
  en: {
    notifBell: 'Notifications',
    notifPanelTitle: 'Notifications',
    notifMarkAllRead: 'Mark all read',
    notifSeeAll: 'See all',
    notifToday: 'Today',
    notifEarlier: 'Earlier',
    notifPanelEmpty: "You're all caught up",
    notifPanelEmptyHint: 'New activity will show up here.',
    notifEnableBrowser: 'Enable browser notifications',
    notifBrowserOn: 'Browser notifications on',
    notifBrowserDenied: 'Browser notifications blocked',
    notifBrowserHint: 'Get alerted even when this tab is in the background.',
    notifEyebrow: 'Activity',
    notifTitle: 'Notifications',
    notifLead: 'Everything that happened across your workspace, newest first.',
    notifFilterAll: 'All',
    notifFilterUnread: 'Unread',
    notifRefresh: 'Refresh',
    notifLoading: 'Loading notifications…',
    notifErrorTitle: 'Could not load notifications',
    notifErrorBody: 'Something interrupted the request. Try again in a moment.',
    notifRetry: 'Try again',
    notifEmptyTitle: 'Nothing here yet',
    notifEmptyBody: "When something needs your attention, it'll appear here.",
    notifUnreadEmptyTitle: 'No unread notifications',
    notifUnreadEmptyBody: "You've read everything. Switch to All to see your history.",
    notifMarkRead: 'Mark read',
    notifUnreadBadge: 'unread',
    notifTypeAssignment: 'Assignment',
    notifTypeConversation: 'Conversation',
    notifTypeCampaign: 'Campaign',
    notifTypeMention: 'Mention',
    notifTypeSystem: 'System',
  },
  ar: {
    notifBell: 'الإشعارات',
    notifPanelTitle: 'الإشعارات',
    notifMarkAllRead: 'تعليم الكل كمقروء',
    notifSeeAll: 'عرض الكل',
    notifToday: 'اليوم',
    notifEarlier: 'سابقاً',
    notifPanelEmpty: 'مفيش جديد دلوقتي',
    notifPanelEmptyHint: 'أي نشاط جديد هيظهر هنا.',
    notifEnableBrowser: 'تفعيل إشعارات المتصفح',
    notifBrowserOn: 'إشعارات المتصفح مفعّلة',
    notifBrowserDenied: 'إشعارات المتصفح محظورة',
    notifBrowserHint: 'يصلك تنبيه حتى لو التبويب في الخلفية.',
    notifEyebrow: 'النشاط',
    notifTitle: 'الإشعارات',
    notifLead: 'كل ما حدث في مساحة عملك، الأحدث أولاً.',
    notifFilterAll: 'الكل',
    notifFilterUnread: 'غير المقروء',
    notifRefresh: 'تحديث',
    notifLoading: 'جارٍ تحميل الإشعارات…',
    notifErrorTitle: 'تعذّر تحميل الإشعارات',
    notifErrorBody: 'حدث ما قطع الطلب. أعد المحاولة بعد لحظة.',
    notifRetry: 'إعادة المحاولة',
    notifEmptyTitle: 'لا يوجد شيء بعد',
    notifEmptyBody: 'عندما يحتاج شيء لانتباهك، سيظهر هنا.',
    notifUnreadEmptyTitle: 'لا إشعارات غير مقروءة',
    notifUnreadEmptyBody: 'قرأت كل شيء. بدّل إلى «الكل» لرؤية السجل.',
    notifMarkRead: 'تعليم كمقروء',
    notifUnreadBadge: 'غير مقروء',
    notifTypeAssignment: 'إسناد',
    notifTypeConversation: 'محادثة',
    notifTypeCampaign: 'حملة',
    notifTypeMention: 'إشارة',
    notifTypeSystem: 'النظام',
  },
};
