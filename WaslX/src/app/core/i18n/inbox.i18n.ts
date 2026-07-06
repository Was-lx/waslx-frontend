import type { AppLanguage } from './language.types';

// ─── Inbox page translations ──────────────────────────────────────────────────

export type InboxKey =
  | 'allConversations'
  | 'assignedToMe'
  | 'unassigned'
  | 'searchConversations'
  // Live-inbox preview (placeholder / connect state)
  | 'inboxPreviewBadge'
  | 'inboxConnectTitle'
  | 'inboxConnectDesc'
  | 'inboxConnectCta'
  | 'inboxPreviewNote'
  | 'inboxQueue'
  | 'inboxOpen'
  | 'inboxWaiting'
  | 'inboxResolved'
  | 'inboxAiRouting'
  | 'inboxSampleName1'
  | 'inboxSampleMsg1'
  | 'inboxSampleName2'
  | 'inboxSampleMsg2'
  | 'inboxSampleName3'
  | 'inboxSampleMsg3'
  | 'inboxSampleName4'
  | 'inboxSampleMsg4'
  | 'inboxSampleName5'
  | 'inboxSampleMsg5'
  | 'inboxThreadCustomer'
  | 'inboxThreadBubbleIn'
  | 'inboxThreadBubbleOut'
  | 'inboxThreadSuggestion'
  | 'inboxComposerPlaceholder';

export const inboxTranslations: Record<AppLanguage, Record<InboxKey, string>> = {
  en: {
    allConversations: 'All Conversations',
    assignedToMe: 'Assigned to me',
    unassigned: 'Unassigned',
    searchConversations: 'Search conversations…',
    inboxPreviewBadge: 'Live inbox preview',
    inboxConnectTitle: 'Connect WhatsApp to go live',
    inboxConnectDesc:
      'Link your WhatsApp Business number and every customer message lands here — routed to the right agent, summarized, and ready to reply in seconds.',
    inboxConnectCta: 'Connect WhatsApp',
    inboxPreviewNote: 'Sample data shown for preview',
    inboxQueue: 'Queue',
    inboxOpen: 'Open',
    inboxWaiting: 'Waiting',
    inboxResolved: 'Resolved',
    inboxAiRouting: 'AI routing',
    inboxSampleName1: 'Layla Hassan',
    inboxSampleMsg1: 'Hi! Is the order arriving today?',
    inboxSampleName2: 'Omar Khalil',
    inboxSampleMsg2: 'I need to change my delivery address',
    inboxSampleName3: 'Sara Nabil',
    inboxSampleMsg3: 'Thank you, that solved it! 🙏',
    inboxSampleName4: 'Youssef Adel',
    inboxSampleMsg4: 'Do you offer installment plans?',
    inboxSampleName5: 'Nour Fahmy',
    inboxSampleMsg5: 'Can I get an invoice for order #4821?',
    inboxThreadCustomer: 'Layla Hassan',
    inboxThreadBubbleIn: 'Hi! Is the order arriving today?',
    inboxThreadBubbleOut: 'Hello Layla! Yes, it is out for delivery and should reach you by 6 PM.',
    inboxThreadSuggestion: 'Your order #4821 is out for delivery, arriving by 6 PM today.',
    inboxComposerPlaceholder: 'Type a reply…',
  },
  ar: {
    allConversations: 'كل المحادثات',
    assignedToMe: 'المعيّنة لي',
    unassigned: 'غير معيّنة',
    searchConversations: 'ابحث في المحادثات…',
    inboxPreviewBadge: 'معاينة البريد المباشر',
    inboxConnectTitle: 'اربط واتساب لبدء الاستقبال',
    inboxConnectDesc:
      'اربط رقم واتساب للأعمال لتصل كل رسائل العملاء هنا — موجّهة للوكيل المناسب، ملخّصة، وجاهزة للرد في ثوانٍ.',
    inboxConnectCta: 'ربط واتساب',
    inboxPreviewNote: 'بيانات تجريبية للعرض فقط',
    inboxQueue: 'الطابور',
    inboxOpen: 'مفتوحة',
    inboxWaiting: 'بالانتظار',
    inboxResolved: 'محلولة',
    inboxAiRouting: 'توجيه ذكي',
    inboxSampleName1: 'ليلى حسن',
    inboxSampleMsg1: 'مرحباً! هل سيصل الطلب اليوم؟',
    inboxSampleName2: 'عمر خليل',
    inboxSampleMsg2: 'أحتاج تغيير عنوان التوصيل',
    inboxSampleName3: 'سارة نبيل',
    inboxSampleMsg3: 'شكراً، تم حل المشكلة! 🙏',
    inboxSampleName4: 'يوسف عادل',
    inboxSampleMsg4: 'هل لديكم خطط تقسيط؟',
    inboxSampleName5: 'نور فهمي',
    inboxSampleMsg5: 'هل يمكنني الحصول على فاتورة للطلب رقم 4821؟',
    inboxThreadCustomer: 'ليلى حسن',
    inboxThreadBubbleIn: 'مرحباً! هل سيصل الطلب اليوم؟',
    inboxThreadBubbleOut: 'أهلاً ليلى! نعم، الطلب في الطريق وسيصلك قبل الساعة 6 مساءً.',
    inboxThreadSuggestion: 'طلبك رقم 4821 في طريقه إليك وسيصل قبل الساعة 6 مساءً اليوم.',
    inboxComposerPlaceholder: 'اكتب رداً…',
  },
};
