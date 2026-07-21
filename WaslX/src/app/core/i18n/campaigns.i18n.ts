import type { AppLanguage } from './language.types';

// ─── Campaigns / Broadcasts translations (FR-CMP) ────────────────────────────

export type CampaignsKey =
  // ── List page ──
  | 'cmpEyebrow'
  | 'cmpTitle'
  | 'cmpLead'
  | 'cmpSearch'
  | 'cmpNew'
  | 'cmpCount'
  | 'cmpLoading'
  | 'cmpErrorTitle'
  | 'cmpRetry'
  | 'cmpEmptyTitle'
  | 'cmpEmptyDesc'
  | 'cmpEmptyCta'
  | 'cmpNoResults'
  // status filter segments
  | 'cmpFilterAll'
  | 'cmpFilterDraft'
  | 'cmpFilterScheduled'
  | 'cmpFilterRunning'
  | 'cmpFilterPaused'
  | 'cmpFilterCompleted'
  | 'cmpFilterCancelled'
  // status pill labels
  | 'cmpStatusDraft'
  | 'cmpStatusScheduled'
  | 'cmpStatusRunning'
  | 'cmpStatusPaused'
  | 'cmpStatusCompleted'
  | 'cmpStatusCancelled'
  // table columns
  | 'cmpColName'
  | 'cmpColStatus'
  | 'cmpColAudience'
  | 'cmpColDelivery'
  | 'cmpColSent'
  | 'cmpColScheduled'
  | 'cmpColActions'
  | 'cmpRecipientsUnit'
  | 'cmpImmediate'
  | 'cmpNotScheduled'
  | 'cmpView'
  | 'cmpEdit'
  | 'cmpDelete'
  // delete confirm
  | 'cmpDeleteTitle'
  | 'cmpDeleteBody'
  | 'cmpConfirmDelete'
  | 'cmpCancel'
  // ── Builder wizard ──
  | 'cmpBuilderEyebrow'
  | 'cmpBuilderTitleNew'
  | 'cmpBuilderTitleEdit'
  | 'cmpStepAudience'
  | 'cmpStepMessage'
  | 'cmpStepSchedule'
  | 'cmpStepReview'
  | 'cmpBack'
  | 'cmpNext'
  | 'cmpSaveDraft'
  | 'cmpSavingDraft'
  | 'cmpLaunch'
  | 'cmpLaunching'
  | 'cmpNameLabel'
  | 'cmpNamePlaceholder'
  | 'cmpNameRequired'
  // audience step
  | 'cmpAudienceTitle'
  | 'cmpAudienceLead'
  | 'cmpFilterTags'
  | 'cmpFilterTagsHint'
  | 'cmpFilterTiers'
  | 'cmpFilterTiersHint'
  | 'cmpTierStandard'
  | 'cmpTierSilver'
  | 'cmpTierGold'
  | 'cmpTierPlatinum'
  | 'cmpFilterVip'
  | 'cmpFilterVipHint'
  | 'cmpFilterOpenConv'
  | 'cmpFilterOpenConvHint'
  | 'cmpFilterLastContact'
  | 'cmpDaysAny'
  | 'cmpDays7'
  | 'cmpDays30'
  | 'cmpDays90'
  | 'cmpAudienceCountLabel'
  | 'cmpAudienceCounting'
  | 'cmpAudienceMatch'
  | 'cmpAudienceEmptyHint'
  | 'cmpTagsLoading'
  | 'cmpNoTags'
  // recipients upload (builder step 1)
  | 'cmpRecipientsLead'
  | 'cmpUploadCta'
  | 'cmpUploadHint'
  | 'cmpRecipientsLoaded'
  | 'cmpRemoveFile'
  | 'cmpFileParsing'
  | 'cmpNoRecipientsParsed'
  | 'cmpParseError'
  | 'cmpNeedRecipients'
  | 'cmpDownloadSample'
  | 'cmpModeUpload'
  | 'cmpModeContacts'
  | 'cmpAllTags'
  | 'cmpContactsLoading'
  | 'cmpContactsEmpty'
  | 'cmpSelectAll'
  | 'cmpDeselectAll'
  | 'cmpDateFrom'
  | 'cmpDateTo'
  // message step
  | 'cmpMessageTitle'
  | 'cmpMessageLead'
  | 'cmpChannelLabel'
  | 'cmpChannelHint'
  | 'cmpNoChannels'
  | 'cmpTemplateLabel'
  | 'cmpTemplateHint'
  | 'cmpTemplatePlaceholder'
  | 'cmpTemplateLoading'
  | 'cmpNoTemplates'
  | 'cmpTemplateApprovedOnly'
  | 'cmpMessageBodyLabel'
  | 'cmpMessageBodyPlaceholder'
  | 'cmpMessageBodyHint'
  | 'cmpPreviewTitle'
  | 'cmpPreviewEmpty'
  // schedule step
  | 'cmpScheduleTitle'
  | 'cmpScheduleLead'
  | 'cmpSendNow'
  | 'cmpSendNowHint'
  | 'cmpScheduleLater'
  | 'cmpScheduleLaterHint'
  | 'cmpScheduleDate'
  | 'cmpScheduleTimezoneHint'
  | 'cmpEstimateLabel'
  | 'cmpMessagesUnit'
  // review step
  | 'cmpReviewTitle'
  | 'cmpReviewLead'
  | 'cmpReviewName'
  | 'cmpReviewAudience'
  | 'cmpReviewChannel'
  | 'cmpReviewTemplate'
  | 'cmpReviewMessage'
  | 'cmpReviewSchedule'
  | 'cmpReviewReady'
  | 'cmpReviewReadyHint'
  // validation
  | 'cmpNeedName'
  | 'cmpNeedAudience'
  | 'cmpNeedChannel'
  | 'cmpNeedMessage'
  | 'cmpNeedSchedule'
  // builder not found
  | 'cmpNotFound'
  | 'cmpNotFoundBack'
  // ── Detail / analytics ──
  | 'cmpBackToList'
  | 'cmpDetailEyebrow'
  | 'cmpKpiQueued'
  | 'cmpKpiSent'
  | 'cmpKpiDelivered'
  | 'cmpKpiRead'
  | 'cmpKpiFailed'
  | 'cmpDeliveryProgress'
  | 'cmpOfAudience'
  | 'cmpPause'
  | 'cmpResume'
  | 'cmpCancelRun'
  | 'cmpPausing'
  | 'cmpResuming'
  | 'cmpCancelling'
  | 'cmpEditDraft'
  | 'cmpPauseConfirmTitle'
  | 'cmpPauseConfirmBody'
  | 'cmpConfirmPause'
  | 'cmpCancelConfirmTitle'
  | 'cmpCancelConfirmBody'
  | 'cmpConfirmCancelRun'
  | 'cmpChartFunnelTitle'
  | 'cmpChartFunnelSub'
  | 'cmpChartBreakdownTitle'
  | 'cmpChartBreakdownSub'
  | 'cmpChartNoData'
  | 'cmpFunnelSent'
  | 'cmpFunnelDelivered'
  | 'cmpFunnelRead'
  | 'cmpBreakdownPending'
  // recipients table
  | 'cmpRecipientsTitle'
  | 'cmpColRecipient'
  | 'cmpColPhone'
  | 'cmpColRecipStatus'
  | 'cmpColSentAt'
  | 'cmpColError'
  | 'cmpRstQueued'
  | 'cmpRstSent'
  | 'cmpRstDelivered'
  | 'cmpRstRead'
  | 'cmpRstFailed'
  | 'cmpRecipientsLoading'
  | 'cmpRecipientsEmpty'
  | 'cmpRecipFilterAll'
  | 'cmpCreatedBy'
  // toasts
  | 'cmpDraftSavedToast'
  | 'cmpLaunchedToast'
  | 'cmpUpdatedToast'
  | 'cmpDeletedToast'
  | 'cmpPausedToast'
  | 'cmpResumedToast'
  | 'cmpCancelledToast'
  | 'cmpErrorToast';

export const campaignsTranslations: Record<AppLanguage, Record<CampaignsKey, string>> = {
  en: {
    // List
    cmpEyebrow: 'Outbound',
    cmpTitle: 'Campaigns',
    cmpLead:
      'Build an audience, pick an approved template, schedule the send, then watch delivery land in real time.',
    cmpSearch: 'Search campaigns…',
    cmpNew: 'New campaign',
    cmpCount: 'campaigns',
    cmpLoading: 'Loading campaigns…',
    cmpErrorTitle: 'Could not load campaigns',
    cmpRetry: 'Try again',
    cmpEmptyTitle: 'Send your first broadcast',
    cmpEmptyDesc:
      'Reach a segment of your customers on WhatsApp with an approved template — targeted, scheduled, and fully tracked.',
    cmpEmptyCta: 'Create a campaign',
    cmpNoResults: 'No campaigns match your search',
    cmpFilterAll: 'All',
    cmpFilterDraft: 'Draft',
    cmpFilterScheduled: 'Scheduled',
    cmpFilterRunning: 'Running',
    cmpFilterPaused: 'Paused',
    cmpFilterCompleted: 'Completed',
    cmpFilterCancelled: 'Cancelled',
    cmpStatusDraft: 'Draft',
    cmpStatusScheduled: 'Scheduled',
    cmpStatusRunning: 'Running',
    cmpStatusPaused: 'Paused',
    cmpStatusCompleted: 'Completed',
    cmpStatusCancelled: 'Cancelled',
    cmpColName: 'Campaign',
    cmpColStatus: 'Status',
    cmpColAudience: 'Audience',
    cmpColDelivery: 'Delivery',
    cmpColSent: 'Sent',
    cmpColScheduled: 'Scheduled',
    cmpColActions: 'Actions',
    cmpRecipientsUnit: 'recipients',
    cmpImmediate: 'Immediate',
    cmpNotScheduled: 'Not scheduled',
    cmpView: 'View',
    cmpEdit: 'Edit',
    cmpDelete: 'Delete',
    cmpDeleteTitle: 'Delete this campaign?',
    cmpDeleteBody: 'This permanently removes the campaign and its recipients. This cannot be undone —',
    cmpConfirmDelete: 'Delete campaign',
    cmpCancel: 'Cancel',
    // Builder
    cmpBuilderEyebrow: 'Campaign builder',
    cmpBuilderTitleNew: 'New campaign',
    cmpBuilderTitleEdit: 'Edit campaign',
    cmpStepAudience: 'Recipients',
    cmpStepMessage: 'Message',
    cmpStepSchedule: 'Schedule',
    cmpStepReview: 'Review',
    cmpBack: 'Back',
    cmpNext: 'Continue',
    cmpSaveDraft: 'Save draft',
    cmpSavingDraft: 'Saving…',
    cmpLaunch: 'Launch campaign',
    cmpLaunching: 'Launching…',
    cmpNameLabel: 'Campaign name',
    cmpNamePlaceholder: 'e.g. October promo, Ramadan greeting',
    cmpNameRequired: 'A campaign name is required',
    cmpAudienceTitle: 'Who receives this?',
    cmpAudienceLead:
      'Layer rules to narrow your customer base. The recipient count updates live as you refine.',
    cmpFilterTags: 'Tags',
    cmpFilterTagsHint: 'Only customers with any of these tags.',
    cmpFilterTiers: 'Customer tier',
    cmpFilterTiersHint: 'Limit to specific tiers.',
    cmpTierStandard: 'Standard',
    cmpTierSilver: 'Silver',
    cmpTierGold: 'Gold',
    cmpTierPlatinum: 'Platinum',
    cmpFilterVip: 'VIP customers only',
    cmpFilterVipHint: 'Restrict the send to flagged VIP customers.',
    cmpFilterOpenConv: 'Has an open conversation',
    cmpFilterOpenConvHint: 'Only customers with a currently open thread.',
    cmpFilterLastContact: 'Contacted within',
    cmpDaysAny: 'Any time',
    cmpDays7: 'Last 7 days',
    cmpDays30: 'Last 30 days',
    cmpDays90: 'Last 90 days',
    cmpAudienceCountLabel: 'Recipients',
    cmpAudienceCounting: 'Counting…',
    cmpAudienceMatch: 'recipients match',
    cmpAudienceEmptyHint: 'No customers match these rules yet — loosen a filter.',
    cmpTagsLoading: 'Loading tags…',
    cmpNoTags: 'No tags defined yet.',
    cmpRecipientsLead: 'Upload a CSV or Excel file of the phone numbers you want to message.',
    cmpUploadCta: 'Upload a CSV or Excel file',
    cmpUploadHint: 'Any column of phone numbers works. Include the country code (e.g. 20 for Egypt).',
    cmpRecipientsLoaded: 'Recipients loaded',
    cmpRemoveFile: 'Remove',
    cmpFileParsing: 'Reading file…',
    cmpNoRecipientsParsed: 'No valid phone numbers were found in that file.',
    cmpParseError: 'Could not read that file. Use a CSV or Excel (.xlsx) file.',
    cmpNeedRecipients: 'Upload a file with at least one phone number.',
    cmpDownloadSample: 'Download a sample file',
    cmpModeUpload: 'Upload a file',
    cmpModeContacts: 'Pick from my contacts',
    cmpAllTags: 'All contacts',
    cmpContactsLoading: 'Loading contacts…',
    cmpContactsEmpty: 'No contacts match — adjust the filter, or upload a file instead.',
    cmpSelectAll: 'Select all',
    cmpDeselectAll: 'Deselect all',
    cmpDateFrom: 'Contacted from',
    cmpDateTo: 'To',
    cmpMessageTitle: 'Compose the message',
    cmpMessageLead: 'Outbound broadcasts must use an approved WhatsApp template.',
    cmpChannelLabel: 'Send from',
    cmpChannelHint: 'The connected WhatsApp number this campaign sends from.',
    cmpNoChannels: 'No connected WhatsApp numbers. Connect one first.',
    cmpTemplateLabel: 'Approved template',
    cmpTemplateHint: 'Only Meta-approved templates can be broadcast.',
    cmpTemplatePlaceholder: 'Select a template',
    cmpTemplateLoading: 'Loading templates…',
    cmpNoTemplates: 'No approved templates yet. Create and get one approved first.',
    cmpTemplateApprovedOnly: 'Approved only',
    cmpMessageBodyLabel: 'Message',
    cmpMessageBodyPlaceholder: 'The message your customers will receive…',
    cmpMessageBodyHint: 'Prefilled from the template body; edit variable values as needed.',
    cmpPreviewTitle: 'Preview',
    cmpPreviewEmpty: 'Your message preview appears here.',
    cmpScheduleTitle: 'When should it send?',
    cmpScheduleLead: 'Send immediately or schedule for a future date and time.',
    cmpSendNow: 'Send now',
    cmpSendNowHint: 'The campaign launches the moment you confirm.',
    cmpScheduleLater: 'Schedule for later',
    cmpScheduleLaterHint: 'Pick a date and time in your workspace timezone.',
    cmpScheduleDate: 'Date & time',
    cmpScheduleTimezoneHint: 'Uses your workspace timezone.',
    cmpEstimateLabel: 'Estimated send',
    cmpMessagesUnit: 'messages',
    cmpReviewTitle: 'Review & launch',
    cmpReviewLead: 'Confirm everything below, then launch. Delivery starts immediately or at your scheduled time.',
    cmpReviewName: 'Name',
    cmpReviewAudience: 'Recipients',
    cmpReviewChannel: 'Send from',
    cmpReviewTemplate: 'Template',
    cmpReviewMessage: 'Message',
    cmpReviewSchedule: 'Schedule',
    cmpReviewReady: 'Ready to launch',
    cmpReviewReadyHint: 'You can still save as a draft and come back later.',
    cmpNeedName: 'Name your campaign to continue.',
    cmpNeedAudience: 'Your audience is empty — adjust the rules.',
    cmpNeedChannel: 'Choose a WhatsApp number to send from.',
    cmpNeedMessage: 'Pick a template and write the message.',
    cmpNeedSchedule: 'Pick a valid send date in the future.',
    cmpNotFound: 'This campaign could not be found.',
    cmpNotFoundBack: 'Back to campaigns',
    // Detail
    cmpBackToList: 'Campaigns',
    cmpDetailEyebrow: 'Campaign',
    cmpKpiQueued: 'Queued',
    cmpKpiSent: 'Sent',
    cmpKpiDelivered: 'Delivered',
    cmpKpiRead: 'Read',
    cmpKpiFailed: 'Failed',
    cmpDeliveryProgress: 'Delivery progress',
    cmpOfAudience: 'of audience',
    cmpPause: 'Pause',
    cmpResume: 'Resume',
    cmpCancelRun: 'Cancel',
    cmpPausing: 'Pausing…',
    cmpResuming: 'Resuming…',
    cmpCancelling: 'Cancelling…',
    cmpEditDraft: 'Edit campaign',
    cmpPauseConfirmTitle: 'Pause this campaign?',
    cmpPauseConfirmBody: 'Sending stops until you resume. In-flight messages still complete.',
    cmpConfirmPause: 'Pause campaign',
    cmpCancelConfirmTitle: 'Cancel this campaign?',
    cmpCancelConfirmBody: 'Remaining recipients will not be messaged. This cannot be undone.',
    cmpConfirmCancelRun: 'Cancel campaign',
    cmpChartFunnelTitle: 'Delivery funnel',
    cmpChartFunnelSub: 'How far each message got',
    cmpChartBreakdownTitle: 'Status breakdown',
    cmpChartBreakdownSub: 'Every recipient by current state',
    cmpChartNoData: 'No delivery data yet',
    cmpFunnelSent: 'Sent',
    cmpFunnelDelivered: 'Delivered',
    cmpFunnelRead: 'Read',
    cmpBreakdownPending: 'Pending',
    cmpRecipientsTitle: 'Recipients',
    cmpColRecipient: 'Recipient',
    cmpColPhone: 'Phone',
    cmpColRecipStatus: 'Status',
    cmpColSentAt: 'Sent at',
    cmpColError: 'Detail',
    cmpRstQueued: 'Queued',
    cmpRstSent: 'Sent',
    cmpRstDelivered: 'Delivered',
    cmpRstRead: 'Read',
    cmpRstFailed: 'Failed',
    cmpRecipientsLoading: 'Loading recipients…',
    cmpRecipientsEmpty: 'No recipients to show yet.',
    cmpRecipFilterAll: 'All',
    cmpCreatedBy: 'Created by',
    cmpDraftSavedToast: 'Draft saved',
    cmpLaunchedToast: 'Campaign launched',
    cmpUpdatedToast: 'Campaign updated',
    cmpDeletedToast: 'Campaign deleted',
    cmpPausedToast: 'Campaign paused',
    cmpResumedToast: 'Campaign resumed',
    cmpCancelledToast: 'Campaign cancelled',
    cmpErrorToast: 'Something went wrong',
  },
  ar: {
    // List
    cmpEyebrow: 'المراسلة الصادرة',
    cmpTitle: 'الحملات',
    cmpLead: 'حدّد جمهوراً، اختر قالباً معتمداً، جدول الإرسال، ثم تابع وصول الرسائل مباشرةً.',
    cmpSearch: 'ابحث في الحملات…',
    cmpNew: 'حملة جديدة',
    cmpCount: 'حملات',
    cmpLoading: 'جارٍ تحميل الحملات…',
    cmpErrorTitle: 'تعذّر تحميل الحملات',
    cmpRetry: 'إعادة المحاولة',
    cmpEmptyTitle: 'أرسل أول حملة لك',
    cmpEmptyDesc:
      'صِل إلى شريحة من عملائك عبر واتساب بقالب معتمد — موجّهة، مجدولة، ومتتبعة بالكامل.',
    cmpEmptyCta: 'إنشاء حملة',
    cmpNoResults: 'لا توجد حملات تطابق بحثك',
    cmpFilterAll: 'الكل',
    cmpFilterDraft: 'مسودة',
    cmpFilterScheduled: 'مجدولة',
    cmpFilterRunning: 'قيد التشغيل',
    cmpFilterPaused: 'متوقفة',
    cmpFilterCompleted: 'مكتملة',
    cmpFilterCancelled: 'ملغاة',
    cmpStatusDraft: 'مسودة',
    cmpStatusScheduled: 'مجدولة',
    cmpStatusRunning: 'قيد التشغيل',
    cmpStatusPaused: 'متوقفة',
    cmpStatusCompleted: 'مكتملة',
    cmpStatusCancelled: 'ملغاة',
    cmpColName: 'الحملة',
    cmpColStatus: 'الحالة',
    cmpColAudience: 'الجمهور',
    cmpColDelivery: 'التسليم',
    cmpColSent: 'أُرسلت',
    cmpColScheduled: 'الجدولة',
    cmpColActions: 'إجراءات',
    cmpRecipientsUnit: 'مستلمين',
    cmpImmediate: 'فوري',
    cmpNotScheduled: 'غير مجدولة',
    cmpView: 'عرض',
    cmpEdit: 'تعديل',
    cmpDelete: 'حذف',
    cmpDeleteTitle: 'حذف هذه الحملة؟',
    cmpDeleteBody: 'سيؤدي هذا إلى إزالة الحملة ومستلميها نهائياً. لا يمكن التراجع —',
    cmpConfirmDelete: 'حذف الحملة',
    cmpCancel: 'إلغاء',
    // Builder
    cmpBuilderEyebrow: 'منشئ الحملات',
    cmpBuilderTitleNew: 'حملة جديدة',
    cmpBuilderTitleEdit: 'تعديل الحملة',
    cmpStepAudience: 'المستلمون',
    cmpStepMessage: 'الرسالة',
    cmpStepSchedule: 'الجدولة',
    cmpStepReview: 'المراجعة',
    cmpBack: 'رجوع',
    cmpNext: 'متابعة',
    cmpSaveDraft: 'حفظ كمسودة',
    cmpSavingDraft: 'جارٍ الحفظ…',
    cmpLaunch: 'إطلاق الحملة',
    cmpLaunching: 'جارٍ الإطلاق…',
    cmpNameLabel: 'اسم الحملة',
    cmpNamePlaceholder: 'مثال: عرض أكتوبر، تهنئة رمضان',
    cmpNameRequired: 'اسم الحملة مطلوب',
    cmpAudienceTitle: 'من يستقبل هذه الحملة؟',
    cmpAudienceLead: 'أضِف قواعد لتضييق قاعدة عملائك. يتحدّث عدد المستلمين مباشرةً كلما نقّحت.',
    cmpFilterTags: 'الوسوم',
    cmpFilterTagsHint: 'العملاء الذين يحملون أياً من هذه الوسوم فقط.',
    cmpFilterTiers: 'فئة العميل',
    cmpFilterTiersHint: 'التقييد بفئات محددة.',
    cmpTierStandard: 'عادي',
    cmpTierSilver: 'فضي',
    cmpTierGold: 'ذهبي',
    cmpTierPlatinum: 'بلاتيني',
    cmpFilterVip: 'كبار العملاء فقط',
    cmpFilterVipHint: 'قصر الإرسال على العملاء المميزين (VIP).',
    cmpFilterOpenConv: 'لديه محادثة مفتوحة',
    cmpFilterOpenConvHint: 'العملاء الذين لديهم محادثة مفتوحة حالياً فقط.',
    cmpFilterLastContact: 'تم التواصل خلال',
    cmpDaysAny: 'أي وقت',
    cmpDays7: 'آخر ٧ أيام',
    cmpDays30: 'آخر ٣٠ يوماً',
    cmpDays90: 'آخر ٩٠ يوماً',
    cmpAudienceCountLabel: 'المستلمون',
    cmpAudienceCounting: 'جارٍ العد…',
    cmpAudienceMatch: 'مستلماً مطابقاً',
    cmpAudienceEmptyHint: 'لا يوجد عملاء يطابقون هذه القواعد بعد — خفّف أحد المرشحات.',
    cmpTagsLoading: 'جارٍ تحميل الوسوم…',
    cmpNoTags: 'لا توجد وسوم معرّفة بعد.',
    cmpRecipientsLead: 'ارفع ملف CSV أو Excel فيه أرقام الهواتف اللي عايز تبعتلهم.',
    cmpUploadCta: 'ارفع ملف CSV أو Excel',
    cmpUploadHint: 'أي عمود فيه أرقام هواتف ينفع. اكتب كود الدولة (مثلاً 20 لمصر).',
    cmpRecipientsLoaded: 'تم تحميل المستلمين',
    cmpRemoveFile: 'إزالة',
    cmpFileParsing: 'جارٍ قراءة الملف…',
    cmpNoRecipientsParsed: 'لم يتم العثور على أرقام هواتف صالحة في الملف.',
    cmpParseError: 'تعذّرت قراءة الملف. استخدم ملف CSV أو Excel (.xlsx).',
    cmpNeedRecipients: 'ارفع ملفاً فيه رقم واحد على الأقل.',
    cmpDownloadSample: 'نزّل ملف نموذجي',
    cmpModeUpload: 'ارفع ملف',
    cmpModeContacts: 'اختر من عملائي',
    cmpAllTags: 'كل العملاء',
    cmpContactsLoading: 'جارٍ تحميل العملاء…',
    cmpContactsEmpty: 'لا يوجد عملاء مطابقون — عدّل الفلتر، أو ارفع ملفاً بدلاً من ذلك.',
    cmpSelectAll: 'تحديد الكل',
    cmpDeselectAll: 'إلغاء تحديد الكل',
    cmpDateFrom: 'تم التواصل من',
    cmpDateTo: 'إلى',
    cmpMessageTitle: 'اكتب الرسالة',
    cmpMessageLead: 'يجب أن تستخدم الحملات الصادرة قالب واتساب معتمداً.',
    cmpChannelLabel: 'الإرسال من',
    cmpChannelHint: 'رقم واتساب المتصل الذي تُرسل منه هذه الحملة.',
    cmpNoChannels: 'لا توجد أرقام واتساب متصلة. اربط رقماً أولاً.',
    cmpTemplateLabel: 'القالب المعتمد',
    cmpTemplateHint: 'يمكن بث القوالب المعتمدة من ميتا فقط.',
    cmpTemplatePlaceholder: 'اختر قالباً',
    cmpTemplateLoading: 'جارٍ تحميل القوالب…',
    cmpNoTemplates: 'لا توجد قوالب معتمدة بعد. أنشئ قالباً واعتمده أولاً.',
    cmpTemplateApprovedOnly: 'المعتمدة فقط',
    cmpMessageBodyLabel: 'الرسالة',
    cmpMessageBodyPlaceholder: 'الرسالة التي سيستلمها عملاؤك…',
    cmpMessageBodyHint: 'مملوءة مسبقاً من نص القالب؛ عدّل قيم المتغيرات حسب الحاجة.',
    cmpPreviewTitle: 'المعاينة',
    cmpPreviewEmpty: 'تظهر معاينة رسالتك هنا.',
    cmpScheduleTitle: 'متى ترسل؟',
    cmpScheduleLead: 'أرسل فوراً أو جدول لتاريخ ووقت لاحق.',
    cmpSendNow: 'إرسال الآن',
    cmpSendNowHint: 'تنطلق الحملة لحظة التأكيد.',
    cmpScheduleLater: 'الجدولة لاحقاً',
    cmpScheduleLaterHint: 'اختر تاريخاً ووقتاً بتوقيت مساحة عملك.',
    cmpScheduleDate: 'التاريخ والوقت',
    cmpScheduleTimezoneHint: 'يستخدم توقيت مساحة عملك.',
    cmpEstimateLabel: 'الإرسال المقدّر',
    cmpMessagesUnit: 'رسالة',
    cmpReviewTitle: 'المراجعة والإطلاق',
    cmpReviewLead: 'أكّد كل ما يلي ثم أطلق. يبدأ التسليم فوراً أو في وقتك المجدول.',
    cmpReviewName: 'الاسم',
    cmpReviewAudience: 'المستلمون',
    cmpReviewChannel: 'الإرسال من',
    cmpReviewTemplate: 'القالب',
    cmpReviewMessage: 'الرسالة',
    cmpReviewSchedule: 'الجدولة',
    cmpReviewReady: 'جاهزة للإطلاق',
    cmpReviewReadyHint: 'ما زال بإمكانك الحفظ كمسودة والعودة لاحقاً.',
    cmpNeedName: 'سمِّ حملتك للمتابعة.',
    cmpNeedAudience: 'جمهورك فارغ — عدّل القواعد.',
    cmpNeedChannel: 'اختر رقم واتساب للإرسال منه.',
    cmpNeedMessage: 'اختر قالباً واكتب الرسالة.',
    cmpNeedSchedule: 'اختر تاريخ إرسال صالحاً في المستقبل.',
    cmpNotFound: 'تعذّر العثور على هذه الحملة.',
    cmpNotFoundBack: 'العودة إلى الحملات',
    // Detail
    cmpBackToList: 'الحملات',
    cmpDetailEyebrow: 'حملة',
    cmpKpiQueued: 'في الانتظار',
    cmpKpiSent: 'أُرسلت',
    cmpKpiDelivered: 'سُلّمت',
    cmpKpiRead: 'قُرئت',
    cmpKpiFailed: 'فشلت',
    cmpDeliveryProgress: 'تقدّم التسليم',
    cmpOfAudience: 'من الجمهور',
    cmpPause: 'إيقاف مؤقت',
    cmpResume: 'استئناف',
    cmpCancelRun: 'إلغاء',
    cmpPausing: 'جارٍ الإيقاف…',
    cmpResuming: 'جارٍ الاستئناف…',
    cmpCancelling: 'جارٍ الإلغاء…',
    cmpEditDraft: 'تعديل الحملة',
    cmpPauseConfirmTitle: 'إيقاف هذه الحملة مؤقتاً؟',
    cmpPauseConfirmBody: 'يتوقف الإرسال حتى تستأنف. الرسائل الجارية تكتمل.',
    cmpConfirmPause: 'إيقاف الحملة',
    cmpCancelConfirmTitle: 'إلغاء هذه الحملة؟',
    cmpCancelConfirmBody: 'لن تُراسَل بقية المستلمين. لا يمكن التراجع.',
    cmpConfirmCancelRun: 'إلغاء الحملة',
    cmpChartFunnelTitle: 'قمع التسليم',
    cmpChartFunnelSub: 'إلى أين وصلت كل رسالة',
    cmpChartBreakdownTitle: 'توزيع الحالات',
    cmpChartBreakdownSub: 'كل مستلم حسب حالته الحالية',
    cmpChartNoData: 'لا توجد بيانات تسليم بعد',
    cmpFunnelSent: 'أُرسلت',
    cmpFunnelDelivered: 'سُلّمت',
    cmpFunnelRead: 'قُرئت',
    cmpBreakdownPending: 'معلّقة',
    cmpRecipientsTitle: 'المستلمون',
    cmpColRecipient: 'المستلم',
    cmpColPhone: 'الهاتف',
    cmpColRecipStatus: 'الحالة',
    cmpColSentAt: 'وقت الإرسال',
    cmpColError: 'التفاصيل',
    cmpRstQueued: 'في الانتظار',
    cmpRstSent: 'أُرسلت',
    cmpRstDelivered: 'سُلّمت',
    cmpRstRead: 'قُرئت',
    cmpRstFailed: 'فشلت',
    cmpRecipientsLoading: 'جارٍ تحميل المستلمين…',
    cmpRecipientsEmpty: 'لا يوجد مستلمون لعرضهم بعد.',
    cmpRecipFilterAll: 'الكل',
    cmpCreatedBy: 'أنشأها',
    cmpDraftSavedToast: 'تم حفظ المسودة',
    cmpLaunchedToast: 'تم إطلاق الحملة',
    cmpUpdatedToast: 'تم تحديث الحملة',
    cmpDeletedToast: 'تم حذف الحملة',
    cmpPausedToast: 'تم إيقاف الحملة مؤقتاً',
    cmpResumedToast: 'تم استئناف الحملة',
    cmpCancelledToast: 'تم إلغاء الحملة',
    cmpErrorToast: 'حدث خطأ ما',
  },
};
