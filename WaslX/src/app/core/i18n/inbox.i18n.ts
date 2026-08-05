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
  | 'inboxComposerPlaceholder'
  // Live shared-inbox (real, wired)
  | 'inboxTitle'
  | 'inboxLead'
  | 'inboxEmptyTitle'
  | 'inboxEmptyDesc'
  | 'inboxSelectPrompt'
  | 'inboxThreadEmpty'
  | 'inboxLoadOlder'
  | 'inboxToday'
  | 'inboxYesterday'
  | 'inboxLoading'
  | 'inboxSendErrorTitle'
  | 'inboxSendErrorMsg'
  | 'inboxRetry'
  | 'inboxUnread'
  | 'inboxDeleteChat'
  | 'inboxDeleteConfirm'
  | 'inboxDeleteErrorTitle'
  | 'inboxDeleteErrorMsg'
  | 'inboxMediaUnavailable'
  | 'inboxAttachFile'
  | 'inboxRemoveAttachment'
  | 'inboxCaptionPlaceholder'
  | 'inboxFileTooLarge'
  | 'inboxMediaSendErrorMsg'
  // Number rail
  | 'inboxAllNumbers'
  | 'inboxNumbersTitle'
  // Views + filters bar
  | 'inboxViewInbox'
  | 'inboxViewQueue'
  | 'newConvButton'
  | 'newConvTitle'
  | 'newConvSubtitle'
  | 'newConvCountry'
  | 'newConvPhone'
  | 'newConvPhonePh'
  | 'newConvHint'
  | 'newConvTemplate'
  | 'newConvTemplatePh'
  | 'newConvNoTemplates'
  | 'newConvSend'
  | 'newConvSending'
  | 'newConvCancel'
  | 'newConvNeedPhone'
  | 'newConvNeedTemplate'
  | 'newConvSuccessTitle'
  | 'newConvSuccessMsg'
  | 'newConvErrorTitle'
  | 'filterStatus'
  | 'filterGroup'
  | 'filterTag'
  | 'filterAssignee'
  | 'filterDateFrom'
  | 'filterDateTo'
  | 'filterAll'
  | 'filterAssignedToMe'
  | 'filterClear'
  | 'filterToggle'
  | 'savedViewsLabel'
  | 'saveViewBtn'
  | 'saveViewNamePlaceholder'
  | 'saveViewDelete'
  // Unassigned queue
  | 'queueEmpty'
  | 'queueAssign'
  // Assignment controls
  | 'assignAssignee'
  | 'assignSelectAgent'
  | 'assignAssign'
  | 'assignReassign'
  | 'assignReasonPlaceholder'
  | 'assignHistory'
  | 'assignHistoryEmpty'
  | 'assignBy'
  | 'assignSuccessTitle'
  | 'assignSuccessMsg'
  | 'assignErrorTitle'
  | 'assignErrorMsg'
  | 'assignMethodManual'
  | 'assignMethodRoundRobin'
  | 'assignMethodAI'
  // Tag management on a conversation
  | 'tagAdd'
  | 'tagApplyError'
  | 'tagRemoveError'
  | 'tagNoneAvailable'
  // Escalation screening (FE-4.2)
  | 'escalationAiSuggestion'
  | 'escalationSuggestedAgent'
  | 'escalationReasonLabel'
  | 'escalationConfirm'
  | 'escalationOverride'
  | 'escalationNoTarget'
  | 'escalationWaitingApproval'
  | 'escalationTransferred'
  | 'escalationAssignedToast'
  | 'escalationSelectAgent'
  | 'escalationOverrideReason'
  | 'escalationEnterDetails'
  | 'escalationCancel'
  | 'escalationAutoAssigned'
  | 'escalationReject'
  | 'escalationRejected'
  | 'escalationScore'
  | 'escalationCandidates'
  | 'escalationRankedCandidates'
  | 'escalationActiveChats'
  // Badges (FE-4.4)
  | 'sentimentPositive'
  | 'sentimentNeutral'
  | 'sentimentNegative'
  | 'sentimentAngry'
  | 'priorityLow'
  | 'priorityNormal'
  | 'priorityHigh'
  | 'priorityUrgent'
  | 'badgeEscalated'
  | 'badgePending'
  | 'badgeAssigned';

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
    inboxTitle: 'Shared Inbox',
    inboxLead: 'Every WhatsApp conversation your team handles, in one place.',
    inboxEmptyTitle: 'No conversations yet',
    inboxEmptyDesc: 'Incoming WhatsApp messages will appear here as customers reach out.',
    inboxSelectPrompt: 'Select a conversation to view the thread',
    inboxThreadEmpty: 'No messages in this conversation yet',
    inboxLoadOlder: 'Load older messages',
    inboxToday: 'Today',
    inboxYesterday: 'Yesterday',
    inboxLoading: 'Loading…',
    inboxSendErrorTitle: 'Message not sent',
    inboxSendErrorMsg: 'Could not send your reply. Please try again.',
    inboxRetry: 'Retry',
    inboxUnread: 'unread messages',
    inboxDeleteChat: 'Delete chat',
    inboxDeleteConfirm: 'Delete this conversation? It will disappear from your inbox.',
    inboxDeleteErrorTitle: 'Could not delete',
    inboxDeleteErrorMsg: 'Something went wrong deleting the conversation. Please try again.',
    inboxMediaUnavailable: 'Media unavailable',
    inboxAttachFile: 'Attach a file',
    inboxRemoveAttachment: 'Remove attachment',
    inboxCaptionPlaceholder: 'Add a caption…',
    inboxFileTooLarge: 'File is too large (max 20 MB)',
    inboxMediaSendErrorMsg: 'Could not send the file. Please try again.',
    inboxAllNumbers: 'All numbers',
    inboxNumbersTitle: 'WhatsApp numbers',
    inboxViewInbox: 'Inbox',
    inboxViewQueue: 'Unassigned',
    newConvButton: 'New conversation',
    newConvTitle: 'New conversation',
    newConvSubtitle: 'Message a new number. WhatsApp requires the first message to be an approved template.',
    newConvCountry: 'Country code',
    newConvPhone: 'Phone number',
    newConvPhonePh: 'e.g. 1001234567',
    newConvHint: 'Will send to',
    newConvTemplate: 'Template',
    newConvTemplatePh: 'Select an approved template',
    newConvNoTemplates: 'No approved templates yet. Create and get one approved first.',
    newConvSend: 'Send',
    newConvSending: 'Sending…',
    newConvCancel: 'Cancel',
    newConvNeedPhone: 'Enter a valid phone number.',
    newConvNeedTemplate: 'Choose a template to send.',
    newConvSuccessTitle: 'Message sent',
    newConvSuccessMsg: 'The conversation now appears in your inbox.',
    newConvErrorTitle: 'Could not send',
    filterStatus: 'Status',
    filterGroup: 'Group',
    filterTag: 'Tag',
    filterAssignee: 'Assignee',
    filterDateFrom: 'From',
    filterDateTo: 'To',
    filterAll: 'All',
    filterAssignedToMe: 'Assigned to me',
    filterClear: 'Clear',
    filterToggle: 'Filters',
    savedViewsLabel: 'Saved views',
    saveViewBtn: 'Save view',
    saveViewNamePlaceholder: 'Name this view…',
    saveViewDelete: 'Remove view',
    queueEmpty: 'The unassigned queue is empty.',
    queueAssign: 'Assign',
    assignAssignee: 'Assignee',
    assignSelectAgent: 'Select agent…',
    assignAssign: 'Assign',
    assignReassign: 'Reassign',
    assignReasonPlaceholder: 'Reason (optional)',
    assignHistory: 'Assignment history',
    assignHistoryEmpty: 'No assignment history yet.',
    assignBy: 'by',
    assignSuccessTitle: 'Conversation assigned',
    assignSuccessMsg: 'The conversation was assigned successfully.',
    assignErrorTitle: 'Could not assign',
    assignErrorMsg: 'Something went wrong assigning the conversation. Please try again.',
    assignMethodManual: 'Manual',
    assignMethodRoundRobin: 'Round Robin',
    assignMethodAI: 'AI',
    tagAdd: 'Add tag',
    tagApplyError: 'Could not add the tag. Please try again.',
    tagRemoveError: 'Could not remove the tag. Please try again.',
    tagNoneAvailable: 'No more tags to add.',
    escalationAiSuggestion: 'AI Suggestion',
    escalationSuggestedAgent: 'Suggested Agent',
    escalationReasonLabel: 'Reason',
    escalationConfirm: 'Confirm',
    escalationOverride: 'Override',
    escalationNoTarget: 'No target available',
    escalationWaitingApproval: 'Waiting for Manager approval.',
    escalationTransferred: 'Conversation transferred.',
    escalationAssignedToast: 'Conversation assigned to you.',
    escalationSelectAgent: 'Select Agent',
    escalationOverrideReason: 'Reason for override',
    escalationEnterDetails: 'Enter details...',
    escalationCancel: 'Cancel',
    escalationAutoAssigned: 'Auto-assigned',
    escalationReject: 'Reject',
    escalationRejected: 'Recommendation rejected',
    escalationScore: 'Score',
    escalationCandidates: 'Candidates',
    escalationRankedCandidates: 'Ranked candidates',
    escalationActiveChats: 'active chats',
    sentimentPositive: 'Positive',
    sentimentNeutral: 'Neutral',
    sentimentNegative: 'Negative',
    sentimentAngry: 'Angry',
    priorityLow: 'Low',
    priorityNormal: 'Normal',
    priorityHigh: 'High',
    priorityUrgent: 'Urgent',
    badgeEscalated: 'Escalated',
    badgePending: 'Pending',
    badgeAssigned: 'Assigned',
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
    inboxTitle: 'البريد المشترك',
    inboxLead: 'كل محادثات واتساب اللي فريقك بيتعامل معاها، في مكان واحد.',
    inboxEmptyTitle: 'لا توجد محادثات بعد',
    inboxEmptyDesc: 'رسائل واتساب الواردة هتظهر هنا أول ما العملاء يتواصلوا.',
    inboxSelectPrompt: 'اختر محادثة لعرض الرسائل',
    inboxThreadEmpty: 'لا توجد رسائل في هذه المحادثة بعد',
    inboxLoadOlder: 'تحميل رسائل أقدم',
    inboxToday: 'اليوم',
    inboxYesterday: 'أمس',
    inboxLoading: 'جاري التحميل…',
    inboxSendErrorTitle: 'لم يتم إرسال الرسالة',
    inboxSendErrorMsg: 'تعذّر إرسال ردّك. حاول مرة أخرى.',
    inboxRetry: 'إعادة المحاولة',
    inboxUnread: 'رسائل غير مقروءة',
    inboxDeleteChat: 'حذف المحادثة',
    inboxDeleteConfirm: 'هل تريد حذف هذه المحادثة؟ ستختفي من صندوق الوارد.',
    inboxDeleteErrorTitle: 'تعذّر الحذف',
    inboxDeleteErrorMsg: 'حدث خطأ أثناء حذف المحادثة. حاول مرة أخرى.',
    inboxMediaUnavailable: 'الوسائط غير متاحة',
    inboxAttachFile: 'إرفاق ملف',
    inboxRemoveAttachment: 'إزالة المرفق',
    inboxCaptionPlaceholder: 'أضف تعليق…',
    inboxFileTooLarge: 'حجم الملف كبير جدًا (الحد الأقصى 20 ميجابايت)',
    inboxMediaSendErrorMsg: 'تعذّر إرسال الملف. حاول مرة أخرى.',
    inboxAllNumbers: 'كل الأرقام',
    inboxNumbersTitle: 'أرقام واتساب',
    inboxViewInbox: 'الوارد',
    inboxViewQueue: 'غير المعيّنة',
    newConvButton: 'محادثة جديدة',
    newConvTitle: 'محادثة جديدة',
    newConvSubtitle: 'ابعت لرقم جديد. واتساب بيطلب إن أول رسالة تكون قالب معتمد.',
    newConvCountry: 'كود الدولة',
    newConvPhone: 'رقم الهاتف',
    newConvPhonePh: 'مثال: 1001234567',
    newConvHint: 'هيتبعت إلى',
    newConvTemplate: 'القالب',
    newConvTemplatePh: 'اختر قالباً معتمداً',
    newConvNoTemplates: 'لا توجد قوالب معتمدة بعد. أنشئ قالباً واعتمده أولاً.',
    newConvSend: 'إرسال',
    newConvSending: 'جارٍ الإرسال…',
    newConvCancel: 'إلغاء',
    newConvNeedPhone: 'اكتب رقم هاتف صحيح.',
    newConvNeedTemplate: 'اختر قالباً للإرسال.',
    newConvSuccessTitle: 'تم الإرسال',
    newConvSuccessMsg: 'المحادثة ظهرت في صندوقك الآن.',
    newConvErrorTitle: 'تعذّر الإرسال',
    filterStatus: 'الحالة',
    filterGroup: 'المجموعة',
    filterTag: 'الوسم',
    filterAssignee: 'المسؤول',
    filterDateFrom: 'من',
    filterDateTo: 'إلى',
    filterAll: 'الكل',
    filterAssignedToMe: 'المعيّنة لي',
    filterClear: 'مسح',
    filterToggle: 'الفلاتر',
    savedViewsLabel: 'العروض المحفوظة',
    saveViewBtn: 'حفظ العرض',
    saveViewNamePlaceholder: 'سمِّ العرض…',
    saveViewDelete: 'حذف العرض',
    queueEmpty: 'طابور غير المعيّنة فارغ.',
    queueAssign: 'تعيين',
    assignAssignee: 'المسؤول',
    assignSelectAgent: 'اختر وكيلاً…',
    assignAssign: 'تعيين',
    assignReassign: 'إعادة تعيين',
    assignReasonPlaceholder: 'السبب (اختياري)',
    assignHistory: 'سجل التعيين',
    assignHistoryEmpty: 'لا يوجد سجل تعيين بعد.',
    assignBy: 'بواسطة',
    assignSuccessTitle: 'تم تعيين المحادثة',
    assignSuccessMsg: 'تم تعيين المحادثة بنجاح.',
    assignErrorTitle: 'تعذّر التعيين',
    assignErrorMsg: 'حدث خطأ أثناء تعيين المحادثة. حاول مرة أخرى.',
    assignMethodManual: 'يدوي',
    assignMethodRoundRobin: 'بالتناوب',
    assignMethodAI: 'ذكاء اصطناعي',
    tagAdd: 'إضافة وسم',
    tagApplyError: 'تعذّر إضافة الوسم. حاول مرة أخرى.',
    tagRemoveError: 'تعذّر إزالة الوسم. حاول مرة أخرى.',
    tagNoneAvailable: 'لا مزيد من الوسوم للإضافة.',
    escalationAiSuggestion: 'اقتراح الذكاء الاصطناعي',
    escalationSuggestedAgent: 'العميل المقترح',
    escalationReasonLabel: 'السبب',
    escalationConfirm: 'تأكيد',
    escalationOverride: 'تعديل',
    escalationNoTarget: 'لا يوجد مستهدف متاح',
    escalationWaitingApproval: 'بانتظار موافقة المدير.',
    escalationTransferred: 'تم تحويل المحادثة.',
    escalationAssignedToast: 'تم تعيين المحادثة لك.',
    escalationSelectAgent: 'اختر العميل',
    escalationOverrideReason: 'سبب التعديل',
    escalationEnterDetails: 'أدخل التفاصيل...',
    escalationCancel: 'إلغاء',
    escalationAutoAssigned: 'تعيين تلقائي',
    escalationReject: 'رفض',
    escalationRejected: 'تم رفض الاقتراح',
    escalationScore: 'النتيجة',
    escalationCandidates: 'المرشحون',
    escalationRankedCandidates: 'المرشحون حسب الترتيب',
    escalationActiveChats: 'محادثات نشطة',
    sentimentPositive: 'إيجابي',
    sentimentNeutral: 'حيادي',
    sentimentNegative: 'سلبي',
    sentimentAngry: 'غاضب',
    priorityLow: 'منخفض',
    priorityNormal: 'عادي',
    priorityHigh: 'مرتفع',
    priorityUrgent: 'عاجل',
    badgeEscalated: 'تم تصعيدها',
    badgePending: 'معلق',
    badgeAssigned: 'تم التعيين',
  },
};
