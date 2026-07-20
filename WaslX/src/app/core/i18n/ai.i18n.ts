import type { AppLanguage } from './language.types';

// ─── Sprint 4 — AI pipeline UI translations (FE-4.1 … FE-4.5) ─────────────────

export type AiKey =
  // Summary card (FE-4.3)
  | 'aiSummaryTitle'
  | 'aiSummaryGenerating'
  | 'aiSummaryGenerateFull'
  | 'aiSummaryFullTitle'
  | 'aiSummaryRefresh'
  | 'aiSummaryStale'
  | 'aiSummaryEmpty'
  | 'aiSummaryError'
  | 'aiSummaryUnavailable'
  | 'aiSummaryShow'
  | 'aiSummaryHide'
  | 'aiSummaryRetry'
  | 'aiSummarySlow'
  | 'aiSummaryUpdated'
  // In-chat AI presence (FE-4.1)
  | 'aiRepliedBy'
  | 'aiTakeOver'
  | 'aiTakeOverTitle'
  | 'aiTakeOverDone'
  | 'aiTakeOverError'
  | 'aiActive'
  | 'aiActiveTitle'
  | 'aiPaused'
  | 'aiPausedTitle'
  | 'aiHuman'
  | 'aiHumanTitle'
  | 'aiTyping'
  // Control panel (FE-4.1)
  | 'aiAgentNav'
  | 'aiAgentNavDesc'
  | 'aiPanelTitle'
  | 'aiPanelLead'
  | 'aiEnableTitle'
  | 'aiEnableDesc'
  | 'aiEnabled'
  | 'aiDisabled'
  | 'aiScopeTenant'
  | 'aiScopePerNumber'
  | 'aiPersonaTitle'
  | 'aiPersonaDesc'
  | 'aiPersonaName'
  | 'aiPersonaNamePlaceholder'
  | 'aiPersonaTone'
  | 'aiTonePlaceholder'
  | 'aiKnowledgeTitle'
  | 'aiKnowledgeDesc'
  | 'aiKnowledgeUpload'
  | 'aiKnowledgeEmpty'
  | 'aiKnowledgeRemove'
  | 'aiThresholdTitle'
  | 'aiThresholdDesc'
  | 'aiMonitorTitle'
  | 'aiMonitorDesc'
  | 'aiMonitorEmpty'
  | 'aiMonitorColCustomer'
  | 'aiMonitorColStatus'
  | 'aiSaveSettings'
  | 'aiSettingsSaved'
  | 'aiSettingsError'
  | 'aiUnavailableHint'
  // Escalation recommendation (FE-4.2)
  | 'aiEscTitle'
  | 'aiEscReasonLabel'
  | 'aiEscSuggestedLabel'
  | 'aiEscConfirm'
  | 'aiEscOverride'
  | 'aiEscConfirmed'
  | 'aiEscOverridden'
  | 'aiEscError'
  | 'aiEscSelectAgent'
  // Badges (FE-4.4)
  | 'aiBadgeVip'
  | 'aiBadgeUrgent'
  | 'aiBadgeAngry'
  | 'aiBadgePositive'
  | 'aiBadgeNeutral'
  | 'aiBadgeEscalated'
  | 'aiSentimentLabel'
  // Loading / latency (FE-4.5)
  | 'aiLoading'
  | 'aiSlow'
  | 'aiRetry';

export const aiTranslations: Record<AppLanguage, Record<AiKey, string>> = {
  en: {
    // Summary card
    aiSummaryTitle: 'Conversation summary',
    aiSummaryGenerating: 'Summarizing…',
    aiSummaryGenerateFull: 'Generate full summary',
    aiSummaryFullTitle: 'Full summary',
    aiSummaryRefresh: 'Refresh',
    aiSummaryStale: 'New messages since this summary',
    aiSummaryEmpty: 'No summary yet',
    aiSummaryError: "Couldn't generate the summary",
    aiSummaryUnavailable: 'AI summary is currently unavailable',
    aiSummaryShow: 'Show summary',
    aiSummaryHide: 'Hide summary',
    aiSummaryRetry: 'Retry',
    aiSummarySlow: 'This is taking longer than usual…',
    aiSummaryUpdated: 'Updated',
    // In-chat AI presence
    aiRepliedBy: 'Replied by AI Agent',
    aiTakeOver: 'Take over',
    aiTakeOverTitle: 'Take over this conversation from the AI Agent',
    aiTakeOverDone: 'You have taken over this conversation',
    aiTakeOverError: 'Could not take over the conversation',
    aiActive: 'AI Active',
    aiActiveTitle: 'AI is automatically replying. Click to pause.',
    aiPaused: 'AI Paused',
    aiPausedTitle: 'AI is paused for this conversation. Click to resume.',
    aiHuman: 'Human',
    aiHumanTitle: 'AI is disabled. Click to enable AI.',
    aiTyping: 'AI Agent is typing…',
    // Control panel
    aiAgentNav: 'AI Agent',
    aiAgentNavDesc: 'Control the autonomous AI Agent',
    aiPanelTitle: 'AI Agent Control Panel',
    aiPanelLead: 'Turn the AI Agent on or off, shape its behaviour, and oversee the conversations it handles.',
    aiEnableTitle: 'AI Agent',
    aiEnableDesc: 'When enabled, the Agent replies to customers autonomously until a human takes over.',
    aiEnabled: 'Enabled',
    aiDisabled: 'Disabled',
    aiScopeTenant: 'Whole workspace',
    aiScopePerNumber: 'Per WhatsApp number',
    aiPersonaTitle: 'Persona & tone',
    aiPersonaDesc: 'How the Agent introduces itself and the style of its replies.',
    aiPersonaName: 'Agent name',
    aiPersonaNamePlaceholder: 'e.g. Salma from Support',
    aiPersonaTone: 'Tone & instructions',
    aiTonePlaceholder: 'Friendly, concise, Egyptian Arabic first; never promise refunds…',
    aiKnowledgeTitle: 'Business knowledge',
    aiKnowledgeDesc: 'Upload FAQs, a catalog, or documents the Agent can draw on to answer.',
    aiKnowledgeUpload: 'Upload files',
    aiKnowledgeEmpty: 'No knowledge files uploaded yet.',
    aiKnowledgeRemove: 'Remove',
    aiThresholdTitle: 'Confidence threshold for handoff',
    aiThresholdDesc: 'Below this confidence the Agent hands the conversation to a human.',
    aiMonitorTitle: 'Handled by the Agent',
    aiMonitorDesc: 'Conversations the AI Agent is currently handling.',
    aiMonitorEmpty: 'The Agent is not handling any conversations right now.',
    aiMonitorColCustomer: 'Customer',
    aiMonitorColStatus: 'Status',
    aiSaveSettings: 'Save changes',
    aiSettingsSaved: 'AI Agent settings saved',
    aiSettingsError: 'Could not save the AI Agent settings',
    aiUnavailableHint: 'The AI Agent service is not connected yet.',
    // Escalation
    aiEscTitle: 'Escalation recommended',
    aiEscReasonLabel: 'Reason',
    aiEscSuggestedLabel: 'Suggested senior agent',
    aiEscConfirm: 'Confirm escalation',
    aiEscOverride: 'Override',
    aiEscConfirmed: 'Escalation confirmed',
    aiEscOverridden: 'Recommendation overridden',
    aiEscError: 'Could not update the escalation',
    aiEscSelectAgent: 'Choose a different agent',
    // Badges
    aiBadgeVip: 'VIP',
    aiBadgeUrgent: 'Urgent',
    aiBadgeAngry: 'Angry',
    aiBadgePositive: 'Positive',
    aiBadgeNeutral: 'Neutral',
    aiBadgeEscalated: 'Escalated',
    aiSentimentLabel: 'Sentiment',
    // Loading
    aiLoading: 'Working…',
    aiSlow: 'Taking longer than usual',
    aiRetry: 'Retry',
  },
  ar: {
    // Summary card
    aiSummaryTitle: 'ملخص المحادثة',
    aiSummaryGenerating: 'جارٍ التلخيص…',
    aiSummaryGenerateFull: 'إنشاء ملخص كامل',
    aiSummaryFullTitle: 'الملخص الكامل',
    aiSummaryRefresh: 'تحديث',
    aiSummaryStale: 'وصلت رسائل جديدة بعد هذا الملخص',
    aiSummaryEmpty: 'لا يوجد ملخص بعد',
    aiSummaryError: 'تعذّر إنشاء الملخص',
    aiSummaryUnavailable: 'ملخص الذكاء الاصطناعي غير متاح حاليًا',
    aiSummaryShow: 'عرض الملخص',
    aiSummaryHide: 'إخفاء الملخص',
    aiSummaryRetry: 'إعادة المحاولة',
    aiSummarySlow: 'يستغرق هذا وقتًا أطول من المعتاد…',
    aiSummaryUpdated: 'محدّث',
    // In-chat AI presence
    aiRepliedBy: 'رد بواسطة الوكيل الذكي',
    aiTakeOver: 'تولّي المحادثة',
    aiTakeOverTitle: 'تولّي هذه المحادثة من الوكيل الذكي',
    aiTakeOverDone: 'لقد تولّيت هذه المحادثة',
    aiTakeOverError: 'تعذّر تولّي المحادثة',
    aiActive: 'الذكاء الاصطناعي نشط',
    aiActiveTitle: 'الذكاء الاصطناعي يرد تلقائياً. انقر للإيقاف المؤقت.',
    aiPaused: 'الذكاء الاصطناعي متوقف مؤقتاً',
    aiPausedTitle: 'الذكاء الاصطناعي متوقف مؤقتاً لهذه المحادثة. انقر للاستئناف.',
    aiHuman: 'بشري',
    aiHumanTitle: 'الذكاء الاصطناعي معطل. انقر لتفعيله.',
    aiTyping: 'الوكيل الذكي يكتب…',
    // Control panel
    aiAgentNav: 'الوكيل الذكي',
    aiAgentNavDesc: 'التحكم في الوكيل الذكي المستقل',
    aiPanelTitle: 'لوحة التحكم في الوكيل الذكي',
    aiPanelLead: 'شغّل الوكيل الذكي أو أوقفه، واضبط سلوكه، وراقب المحادثات التي يتولّاها.',
    aiEnableTitle: 'الوكيل الذكي',
    aiEnableDesc: 'عند التفعيل، يرد الوكيل على العملاء تلقائيًا حتى يتولّى موظف بشري المحادثة.',
    aiEnabled: 'مفعّل',
    aiDisabled: 'متوقّف',
    aiScopeTenant: 'كامل مساحة العمل',
    aiScopePerNumber: 'لكل رقم واتساب',
    aiPersonaTitle: 'الشخصية والنبرة',
    aiPersonaDesc: 'كيف يعرّف الوكيل عن نفسه وأسلوب ردوده.',
    aiPersonaName: 'اسم الوكيل',
    aiPersonaNamePlaceholder: 'مثال: سلمى من الدعم',
    aiPersonaTone: 'النبرة والتعليمات',
    aiTonePlaceholder: 'ودود، مختصر، بالعامية المصرية أولًا؛ لا تَعِد أبدًا باسترداد الأموال…',
    aiKnowledgeTitle: 'معرفة العمل',
    aiKnowledgeDesc: 'ارفع الأسئلة الشائعة أو الكتالوج أو المستندات ليعتمد عليها الوكيل في الرد.',
    aiKnowledgeUpload: 'رفع ملفات',
    aiKnowledgeEmpty: 'لم يتم رفع أي ملفات معرفة بعد.',
    aiKnowledgeRemove: 'إزالة',
    aiThresholdTitle: 'حدّ الثقة للتحويل',
    aiThresholdDesc: 'أقل من هذه الثقة يحوّل الوكيل المحادثة إلى موظف بشري.',
    aiMonitorTitle: 'يتولّاها الوكيل',
    aiMonitorDesc: 'المحادثات التي يتولّاها الوكيل الذكي حاليًا.',
    aiMonitorEmpty: 'لا يتولّى الوكيل أي محادثات في الوقت الحالي.',
    aiMonitorColCustomer: 'العميل',
    aiMonitorColStatus: 'الحالة',
    aiSaveSettings: 'حفظ التغييرات',
    aiSettingsSaved: 'تم حفظ إعدادات الوكيل الذكي',
    aiSettingsError: 'تعذّر حفظ إعدادات الوكيل الذكي',
    aiUnavailableHint: 'خدمة الوكيل الذكي غير متصلة بعد.',
    // Escalation
    aiEscTitle: 'يُوصى بالتصعيد',
    aiEscReasonLabel: 'السبب',
    aiEscSuggestedLabel: 'الموظف الأقدم المقترح',
    aiEscConfirm: 'تأكيد التصعيد',
    aiEscOverride: 'تجاوز',
    aiEscConfirmed: 'تم تأكيد التصعيد',
    aiEscOverridden: 'تم تجاوز التوصية',
    aiEscError: 'تعذّر تحديث التصعيد',
    aiEscSelectAgent: 'اختر موظفًا آخر',
    // Badges
    aiBadgeVip: 'VIP',
    aiBadgeUrgent: 'عاجل',
    aiBadgeAngry: 'غاضب',
    aiBadgePositive: 'إيجابي',
    aiBadgeNeutral: 'محايد',
    aiBadgeEscalated: 'مُصعّد',
    aiSentimentLabel: 'المشاعر',
    // Loading
    aiLoading: 'جارٍ العمل…',
    aiSlow: 'يستغرق وقتًا أطول من المعتاد',
    aiRetry: 'إعادة المحاولة',
  },
};
