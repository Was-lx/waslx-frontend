import type { AppLanguage } from './language.types';

// ─── Platform console · Sprint 6 (FE-6.8 / FE-6.9) ───────────────────────────
// Impersonation banner + confirm, the global (cross-tenant) audit viewer, the
// system-health board, and the announcements composer. Nav labels for the new
// "Oversight" group live here too so the superadmin sidebar can resolve them.

export type PlatformConsoleKey =
  // ── Nav (superadmin sidebar) ──
  | 'pcNavOversight'
  | 'pcNavAudit'
  | 'pcNavAuditDesc'
  | 'pcNavHealth'
  | 'pcNavHealthDesc'
  | 'pcNavAnnouncements'
  | 'pcNavAnnouncementsDesc'
  // ── Impersonation (FE-6.8) ──
  | 'impStart'
  | 'impBannerLabel'
  | 'impBannerViewing'
  | 'impBannerStarted'
  | 'impBannerExpiresIn'
  | 'impBannerExpired'
  | 'impBannerExit'
  | 'impBannerExiting'
  | 'impConfirmTitle'
  | 'impConfirmBody'
  | 'impLoggedNote'
  | 'impReasonLabel'
  | 'impReasonPlaceholder'
  | 'impReasonRequired'
  | 'impConfirmCta'
  | 'impStarting'
  | 'impCancel'
  | 'impStartedToast'
  | 'impEndedToast'
  | 'impErrorTitle'
  | 'impErrorBody'
  // ── Global audit (FE-6.9) ──
  | 'gaEyebrow'
  | 'gaTitle'
  | 'gaLead'
  | 'gaImmutableNote'
  | 'gaCount'
  | 'gaFilterActor'
  | 'gaFilterActorPh'
  | 'gaFilterTenant'
  | 'gaFilterTenantAll'
  | 'gaFilterAction'
  | 'gaFilterActionAll'
  | 'gaFilterEntity'
  | 'gaFilterEntityAll'
  | 'gaSearch'
  | 'gaClear'
  | 'gaRange7d'
  | 'gaRange30d'
  | 'gaRange90d'
  | 'gaRangeAll'
  | 'gaRangeCustom'
  | 'gaRangeFrom'
  | 'gaRangeTo'
  | 'gaRangeApply'
  | 'gaColTime'
  | 'gaColActor'
  | 'gaColTenant'
  | 'gaColAction'
  | 'gaColEntity'
  | 'gaPlatformActor'
  | 'gaPlatformTenant'
  | 'gaPageInfo'
  | 'gaPrev'
  | 'gaNext'
  | 'gaDrawerTitle'
  | 'gaDrawerReadOnly'
  | 'gaDrawerClose'
  | 'gaDrawerActor'
  | 'gaDrawerTenant'
  | 'gaDrawerAction'
  | 'gaDrawerEntityType'
  | 'gaDrawerEntityId'
  | 'gaDrawerTimestamp'
  | 'gaDrawerRecordId'
  | 'gaDrawerDetails'
  | 'gaDrawerNoDetails'
  | 'gaDrawerLockNote'
  | 'gaLoading'
  | 'gaErrorTitle'
  | 'gaErrorBody'
  | 'gaRetry'
  | 'gaEmptyTitle'
  | 'gaEmptyBody'
  | 'gaNoResultsTitle'
  | 'gaNoResultsBody'
  // ── System health (FE-6.9) ──
  | 'hlEyebrow'
  | 'hlTitle'
  | 'hlLead'
  | 'hlStatusOk'
  | 'hlStatusDegraded'
  | 'hlStatusDown'
  | 'hlChecked'
  | 'hlPolling'
  | 'hlRefresh'
  | 'hlComponentsTitle'
  | 'hlLatency'
  | 'hlMs'
  | 'hlOk'
  | 'hlDegraded'
  | 'hlDown'
  | 'hlCompApi'
  | 'hlCompDb'
  | 'hlCompSignalr'
  | 'hlCompWhatsapp'
  | 'hlCompAi'
  | 'hlCompHangfire'
  | 'hlLoading'
  | 'hlErrorTitle'
  | 'hlErrorBody'
  | 'hlRetry'
  // ── Announcements (FE-6.9) ──
  | 'annEyebrow'
  | 'annTitle'
  | 'annLead'
  | 'annFormTitle'
  | 'annFieldTitle'
  | 'annTitlePh'
  | 'annFieldBody'
  | 'annBodyPh'
  | 'annFieldSeverity'
  | 'annSevInfo'
  | 'annSevWarning'
  | 'annSevCritical'
  | 'annFieldAudience'
  | 'annAudAll'
  | 'annAudPlan'
  | 'annAudTenants'
  | 'annFieldPlan'
  | 'annSelectPlan'
  | 'annFieldTenants'
  | 'annTenantsPh'
  | 'annTenantsHint'
  | 'annFieldSchedule'
  | 'annScheduleOptional'
  | 'annScheduleHint'
  | 'annPreviewTitle'
  | 'annPreviewEmpty'
  | 'annPreviewCap'
  | 'annReach'
  | 'annSave'
  | 'annSaving'
  | 'annCreateToast'
  | 'annListTitle'
  | 'annListEmpty'
  | 'annColTitle'
  | 'annColAudience'
  | 'annColStatus'
  | 'annColCreated'
  | 'annStatusDraft'
  | 'annStatusScheduled'
  | 'annStatusPublished'
  | 'annStatusArchived'
  | 'annPublish'
  | 'annPublishing'
  | 'annPublishToast'
  | 'annDelete'
  | 'annDeleteTitle'
  | 'annDeleteBody'
  | 'annDeleteToast'
  | 'annCancel'
  | 'annConfirm'
  | 'annErrorTitle'
  | 'annErrorBody'
  | 'annRequired';

export const platformConsoleTranslations: Record<AppLanguage, Record<PlatformConsoleKey, string>> = {
  en: {
    // Nav
    pcNavOversight: 'Oversight',
    pcNavAudit: 'Global audit',
    pcNavAuditDesc: 'Cross-tenant activity trail',
    pcNavHealth: 'System health',
    pcNavHealthDesc: 'Live component status',
    pcNavAnnouncements: 'Announcements',
    pcNavAnnouncementsDesc: 'Broadcast to tenant admins',

    // Impersonation
    impStart: 'Impersonate',
    impBannerLabel: 'Impersonation session',
    impBannerViewing: 'Viewing as {tenant}',
    impBannerStarted: 'started {time}',
    impBannerExpiresIn: 'expires in {time}',
    impBannerExpired: 'session expired',
    impBannerExit: 'Exit',
    impBannerExiting: 'Exiting…',
    impConfirmTitle: 'Impersonate {tenant}?',
    impConfirmBody: 'You will act as this tenant for a short, time-boxed session. Everything you do is scoped to their workspace.',
    impLoggedNote: 'This session is recorded in the global audit log with your reason.',
    impReasonLabel: 'Reason (required)',
    impReasonPlaceholder: 'e.g. Investigating a reported delivery issue',
    impReasonRequired: 'A reason is required to start an audited session.',
    impConfirmCta: 'Start session',
    impStarting: 'Starting…',
    impCancel: 'Cancel',
    impStartedToast: 'Impersonation started',
    impEndedToast: 'Impersonation ended',
    impErrorTitle: 'Could not start impersonation',
    impErrorBody: 'Something went wrong reaching the platform service.',

    // Global audit
    gaEyebrow: 'Platform accountability',
    gaTitle: 'Global audit log',
    gaLead: 'Every key action across all tenants — super-admin and impersonation activity included.',
    gaImmutableNote: 'Append-only · read-only',
    gaCount: 'entries',
    gaFilterActor: 'Actor',
    gaFilterActorPh: 'Name or ID',
    gaFilterTenant: 'Tenant',
    gaFilterTenantAll: 'All tenants',
    gaFilterAction: 'Action',
    gaFilterActionAll: 'All actions',
    gaFilterEntity: 'Entity',
    gaFilterEntityAll: 'All entities',
    gaSearch: 'Search details…',
    gaClear: 'Clear',
    gaRange7d: '7 days',
    gaRange30d: '30 days',
    gaRange90d: '90 days',
    gaRangeAll: 'All time',
    gaRangeCustom: 'Custom',
    gaRangeFrom: 'From',
    gaRangeTo: 'To',
    gaRangeApply: 'Apply',
    gaColTime: 'Time',
    gaColActor: 'Actor',
    gaColTenant: 'Tenant',
    gaColAction: 'Action',
    gaColEntity: 'Entity',
    gaPlatformActor: 'Platform',
    gaPlatformTenant: 'Platform',
    gaPageInfo: 'Showing {from}–{to} of {total}',
    gaPrev: 'Previous',
    gaNext: 'Next',
    gaDrawerTitle: 'Audit entry',
    gaDrawerReadOnly: 'Read-only',
    gaDrawerClose: 'Close',
    gaDrawerActor: 'Actor',
    gaDrawerTenant: 'Tenant',
    gaDrawerAction: 'Action',
    gaDrawerEntityType: 'Entity type',
    gaDrawerEntityId: 'Entity ID',
    gaDrawerTimestamp: 'Timestamp',
    gaDrawerRecordId: 'Record',
    gaDrawerDetails: 'Details',
    gaDrawerNoDetails: 'No additional details recorded.',
    gaDrawerLockNote: 'This entry is immutable and cannot be edited or deleted.',
    gaLoading: 'Loading platform audit trail…',
    gaErrorTitle: 'Could not load the audit log',
    gaErrorBody: 'Something went wrong fetching entries. Please try again.',
    gaRetry: 'Retry',
    gaEmptyTitle: 'No activity yet',
    gaEmptyBody: 'Platform-wide actions will appear here as they happen.',
    gaNoResultsTitle: 'No matching entries',
    gaNoResultsBody: 'Try widening the date range or clearing filters.',

    // System health
    hlEyebrow: 'Reliability',
    hlTitle: 'System health',
    hlLead: 'Live status of every platform dependency, polled continuously.',
    hlStatusOk: 'All systems operational',
    hlStatusDegraded: 'Degraded performance',
    hlStatusDown: 'Service disruption',
    hlChecked: 'Checked {time}',
    hlPolling: 'Live · refreshes every 15s',
    hlRefresh: 'Refresh',
    hlComponentsTitle: 'Components',
    hlLatency: 'Latency',
    hlMs: 'ms',
    hlOk: 'Operational',
    hlDegraded: 'Degraded',
    hlDown: 'Down',
    hlCompApi: 'API gateway',
    hlCompDb: 'SQL Server',
    hlCompSignalr: 'SignalR',
    hlCompWhatsapp: 'WhatsApp Cloud API',
    hlCompAi: 'AI provider',
    hlCompHangfire: 'Hangfire jobs',
    hlLoading: 'Checking system health…',
    hlErrorTitle: 'Could not reach the health service',
    hlErrorBody: 'The monitoring endpoint did not respond. Please try again.',
    hlRetry: 'Retry',

    // Announcements
    annEyebrow: 'Platform communications',
    annTitle: 'Announcements',
    annLead: 'Broadcast maintenance windows and feature news to tenant admins.',
    annFormTitle: 'Compose announcement',
    annFieldTitle: 'Title',
    annTitlePh: 'e.g. Scheduled maintenance this Sunday',
    annFieldBody: 'Message',
    annBodyPh: 'Write the message tenant admins will see…',
    annFieldSeverity: 'Severity',
    annSevInfo: 'Info',
    annSevWarning: 'Warning',
    annSevCritical: 'Critical',
    annFieldAudience: 'Audience',
    annAudAll: 'All tenants',
    annAudPlan: 'By plan',
    annAudTenants: 'Specific tenants',
    annFieldPlan: 'Plan',
    annSelectPlan: 'Select a plan',
    annFieldTenants: 'Tenant IDs',
    annTenantsPh: 'e.g. 12, 34, 58',
    annTenantsHint: 'Comma-separated tenant IDs.',
    annFieldSchedule: 'Schedule',
    annScheduleOptional: 'optional',
    annScheduleHint: 'Leave empty to save as a draft you can publish later.',
    annPreviewTitle: 'Live preview',
    annPreviewEmpty: 'Your announcement will appear here as tenant admins will see it.',
    annPreviewCap: 'How tenants see it',
    annReach: '{n} recipients',
    annSave: 'Save announcement',
    annSaving: 'Saving…',
    annCreateToast: 'Announcement saved',
    annListTitle: 'Past announcements',
    annListEmpty: 'No announcements yet. Compose the first above.',
    annColTitle: 'Announcement',
    annColAudience: 'Audience',
    annColStatus: 'Status',
    annColCreated: 'Created',
    annStatusDraft: 'Draft',
    annStatusScheduled: 'Scheduled',
    annStatusPublished: 'Published',
    annStatusArchived: 'Archived',
    annPublish: 'Publish',
    annPublishing: 'Publishing…',
    annPublishToast: 'Announcement published',
    annDelete: 'Delete',
    annDeleteTitle: 'Delete this announcement?',
    annDeleteBody: 'This removes it permanently. Published announcements stop showing to tenants.',
    annDeleteToast: 'Announcement deleted',
    annCancel: 'Cancel',
    annConfirm: 'Delete',
    annErrorTitle: 'Something went wrong',
    annErrorBody: 'The platform service could not be reached. Please try again.',
    annRequired: 'Required'
  },
  ar: {
    // Nav
    pcNavOversight: 'الإشراف',
    pcNavAudit: 'التدقيق العام',
    pcNavAuditDesc: 'سجل النشاط عبر المستأجرين',
    pcNavHealth: 'صحة النظام',
    pcNavHealthDesc: 'حالة المكوّنات المباشرة',
    pcNavAnnouncements: 'الإعلانات',
    pcNavAnnouncementsDesc: 'بث إلى مسؤولي المستأجرين',

    // Impersonation
    impStart: 'انتحال الهوية',
    impBannerLabel: 'جلسة انتحال هوية',
    impBannerViewing: 'العرض بصفة {tenant}',
    impBannerStarted: 'بدأت {time}',
    impBannerExpiresIn: 'تنتهي خلال {time}',
    impBannerExpired: 'انتهت الجلسة',
    impBannerExit: 'خروج',
    impBannerExiting: 'جارٍ الخروج…',
    impConfirmTitle: 'انتحال هوية {tenant}؟',
    impConfirmBody: 'ستتصرّف بصفة هذا المستأجر خلال جلسة قصيرة ومحدّدة زمنيًا. كل ما تفعله مقيّد بمساحته.',
    impLoggedNote: 'تُسجَّل هذه الجلسة في سجل التدقيق العام مع السبب الذي تذكره.',
    impReasonLabel: 'السبب (مطلوب)',
    impReasonPlaceholder: 'مثال: التحقق من مشكلة تسليم مُبلَّغ عنها',
    impReasonRequired: 'السبب مطلوب لبدء جلسة مُدقَّقة.',
    impConfirmCta: 'بدء الجلسة',
    impStarting: 'جارٍ البدء…',
    impCancel: 'إلغاء',
    impStartedToast: 'بدأ انتحال الهوية',
    impEndedToast: 'انتهى انتحال الهوية',
    impErrorTitle: 'تعذّر بدء انتحال الهوية',
    impErrorBody: 'حدث خطأ أثناء الاتصال بخدمة المنصة.',

    // Global audit
    gaEyebrow: 'مساءلة المنصة',
    gaTitle: 'سجل التدقيق العام',
    gaLead: 'كل إجراء رئيسي عبر جميع المستأجرين — بما في ذلك نشاط المشرف العام وانتحال الهوية.',
    gaImmutableNote: 'للإضافة فقط · للقراءة فقط',
    gaCount: 'سجل',
    gaFilterActor: 'المُنفِّذ',
    gaFilterActorPh: 'الاسم أو المعرّف',
    gaFilterTenant: 'المستأجر',
    gaFilterTenantAll: 'كل المستأجرين',
    gaFilterAction: 'الإجراء',
    gaFilterActionAll: 'كل الإجراءات',
    gaFilterEntity: 'الكيان',
    gaFilterEntityAll: 'كل الكيانات',
    gaSearch: 'ابحث في التفاصيل…',
    gaClear: 'مسح',
    gaRange7d: '٧ أيام',
    gaRange30d: '٣٠ يومًا',
    gaRange90d: '٩٠ يومًا',
    gaRangeAll: 'كل الوقت',
    gaRangeCustom: 'مخصّص',
    gaRangeFrom: 'من',
    gaRangeTo: 'إلى',
    gaRangeApply: 'تطبيق',
    gaColTime: 'الوقت',
    gaColActor: 'المُنفِّذ',
    gaColTenant: 'المستأجر',
    gaColAction: 'الإجراء',
    gaColEntity: 'الكيان',
    gaPlatformActor: 'المنصة',
    gaPlatformTenant: 'المنصة',
    gaPageInfo: 'عرض {from}–{to} من {total}',
    gaPrev: 'السابق',
    gaNext: 'التالي',
    gaDrawerTitle: 'سجل التدقيق',
    gaDrawerReadOnly: 'للقراءة فقط',
    gaDrawerClose: 'إغلاق',
    gaDrawerActor: 'المُنفِّذ',
    gaDrawerTenant: 'المستأجر',
    gaDrawerAction: 'الإجراء',
    gaDrawerEntityType: 'نوع الكيان',
    gaDrawerEntityId: 'معرّف الكيان',
    gaDrawerTimestamp: 'الطابع الزمني',
    gaDrawerRecordId: 'السجل',
    gaDrawerDetails: 'التفاصيل',
    gaDrawerNoDetails: 'لا توجد تفاصيل إضافية مسجَّلة.',
    gaDrawerLockNote: 'هذا السجل غير قابل للتعديل ولا يمكن تحريره أو حذفه.',
    gaLoading: 'جارٍ تحميل سجل تدقيق المنصة…',
    gaErrorTitle: 'تعذّر تحميل سجل التدقيق',
    gaErrorBody: 'حدث خطأ أثناء جلب السجلات. حاول مرة أخرى.',
    gaRetry: 'إعادة المحاولة',
    gaEmptyTitle: 'لا يوجد نشاط بعد',
    gaEmptyBody: 'ستظهر إجراءات المنصة هنا فور حدوثها.',
    gaNoResultsTitle: 'لا توجد سجلات مطابقة',
    gaNoResultsBody: 'جرّب توسيع النطاق الزمني أو مسح عوامل التصفية.',

    // System health
    hlEyebrow: 'الموثوقية',
    hlTitle: 'صحة النظام',
    hlLead: 'الحالة المباشرة لكل مكوّن في المنصة، تُفحص باستمرار.',
    hlStatusOk: 'كل الأنظمة تعمل',
    hlStatusDegraded: 'أداء متدهور',
    hlStatusDown: 'انقطاع في الخدمة',
    hlChecked: 'فُحص {time}',
    hlPolling: 'مباشر · يُحدَّث كل ١٥ ثانية',
    hlRefresh: 'تحديث',
    hlComponentsTitle: 'المكوّنات',
    hlLatency: 'زمن الاستجابة',
    hlMs: 'ملّي ثانية',
    hlOk: 'يعمل',
    hlDegraded: 'متدهور',
    hlDown: 'متوقف',
    hlCompApi: 'بوابة الـ API',
    hlCompDb: 'SQL Server',
    hlCompSignalr: 'SignalR',
    hlCompWhatsapp: 'واتساب Cloud API',
    hlCompAi: 'مزوّد الذكاء',
    hlCompHangfire: 'مهام Hangfire',
    hlLoading: 'جارٍ فحص صحة النظام…',
    hlErrorTitle: 'تعذّر الوصول إلى خدمة الصحة',
    hlErrorBody: 'لم تستجب نقطة المراقبة. حاول مرة أخرى.',
    hlRetry: 'إعادة المحاولة',

    // Announcements
    annEyebrow: 'اتصالات المنصة',
    annTitle: 'الإعلانات',
    annLead: 'ابثّ نوافذ الصيانة وأخبار الميزات إلى مسؤولي المستأجرين.',
    annFormTitle: 'إنشاء إعلان',
    annFieldTitle: 'العنوان',
    annTitlePh: 'مثال: صيانة مجدولة يوم الأحد',
    annFieldBody: 'الرسالة',
    annBodyPh: 'اكتب الرسالة التي سيراها مسؤولو المستأجرين…',
    annFieldSeverity: 'الأهمية',
    annSevInfo: 'معلومة',
    annSevWarning: 'تحذير',
    annSevCritical: 'حرِج',
    annFieldAudience: 'الجمهور',
    annAudAll: 'كل المستأجرين',
    annAudPlan: 'حسب الباقة',
    annAudTenants: 'مستأجرون محددون',
    annFieldPlan: 'الباقة',
    annSelectPlan: 'اختر باقة',
    annFieldTenants: 'معرّفات المستأجرين',
    annTenantsPh: 'مثال: ١٢، ٣٤، ٥٨',
    annTenantsHint: 'معرّفات المستأجرين مفصولة بفواصل.',
    annFieldSchedule: 'الجدولة',
    annScheduleOptional: 'اختياري',
    annScheduleHint: 'اتركه فارغًا لحفظه كمسودة تنشرها لاحقًا.',
    annPreviewTitle: 'معاينة مباشرة',
    annPreviewEmpty: 'سيظهر إعلانك هنا كما سيراه مسؤولو المستأجرين.',
    annPreviewCap: 'كما يراه المستأجرون',
    annReach: '{n} مستلمًا',
    annSave: 'حفظ الإعلان',
    annSaving: 'جارٍ الحفظ…',
    annCreateToast: 'تم حفظ الإعلان',
    annListTitle: 'الإعلانات السابقة',
    annListEmpty: 'لا توجد إعلانات بعد. أنشئ الأول بالأعلى.',
    annColTitle: 'الإعلان',
    annColAudience: 'الجمهور',
    annColStatus: 'الحالة',
    annColCreated: 'أُنشئ',
    annStatusDraft: 'مسودة',
    annStatusScheduled: 'مجدول',
    annStatusPublished: 'منشور',
    annStatusArchived: 'مؤرشف',
    annPublish: 'نشر',
    annPublishing: 'جارٍ النشر…',
    annPublishToast: 'تم نشر الإعلان',
    annDelete: 'حذف',
    annDeleteTitle: 'حذف هذا الإعلان؟',
    annDeleteBody: 'يزيله نهائيًا. الإعلانات المنشورة تتوقف عن الظهور للمستأجرين.',
    annDeleteToast: 'تم حذف الإعلان',
    annCancel: 'إلغاء',
    annConfirm: 'حذف',
    annErrorTitle: 'حدث خطأ ما',
    annErrorBody: 'تعذّر الوصول إلى خدمة المنصة. حاول مرة أخرى.',
    annRequired: 'مطلوب'
  }
};
