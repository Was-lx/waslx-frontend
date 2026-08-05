import type { AppLanguage } from './language.types';

// ─── Audit log viewer translations (FR-AUDIT · FE-5.8) ───────────────────────
// The tenant audit-log viewer: filter bar, dense log rows, read-only detail
// drawer, and the append-only immutability cues.

export type AuditKey =
  // ── Header ──
  | 'auditEyebrow'
  | 'auditTitle'
  | 'auditLead'
  | 'auditImmutableNote'
  | 'auditCount'
  // ── Filter bar ──
  | 'auditFilterActor'
  | 'auditFilterActorAll'
  | 'auditFilterAction'
  | 'auditFilterActionAll'
  | 'auditFilterEntity'
  | 'auditFilterEntityAll'
  | 'auditSearch'
  | 'auditRangeFrom'
  | 'auditRangeTo'
  | 'auditRange90d'
  | 'auditRangeAll'
  | 'auditClearFilters'
  // ── Action labels ──
  | 'auditActionCreated'
  | 'auditActionUpdated'
  | 'auditActionDeleted'
  | 'auditActionStatusChanged'
  | 'auditActionLogin'
  | 'auditActionLogout'
  | 'auditActionImpersonated'
  // ── Row / columns ──
  | 'auditColTime'
  | 'auditColActor'
  | 'auditColAction'
  | 'auditColEntity'
  | 'auditSystemActor'
  // ── Pagination ──
  | 'auditPageInfo'
  | 'auditPrev'
  | 'auditNext'
  // ── Drawer ──
  | 'auditDrawerTitle'
  | 'auditDrawerReadOnly'
  | 'auditDrawerClose'
  | 'auditDrawerActor'
  | 'auditDrawerAction'
  | 'auditDrawerEntityType'
  | 'auditDrawerEntityId'
  | 'auditDrawerTimestamp'
  | 'auditDrawerRecordId'
  | 'auditDrawerDetails'
  | 'auditDrawerNoDetails'
  | 'auditDrawerLockNote'
  // ── States ──
  | 'auditLoading'
  | 'auditErrorTitle'
  | 'auditErrorBody'
  | 'auditRetry'
  | 'auditEmptyTitle'
  | 'auditEmptyBody'
  | 'auditNoResultsTitle'
  | 'auditNoResultsBody';

export const auditTranslations: Record<AppLanguage, Record<AuditKey, string>> = {
  en: {
    auditEyebrow: 'Accountability',
    auditTitle: 'Audit log',
    auditLead: 'Every key action in your workspace, captured with actor and time.',
    auditImmutableNote: 'Append-only · read-only',
    auditCount: 'entries',

    auditFilterActor: 'Actor',
    auditFilterActorAll: 'All actors',
    auditFilterAction: 'Action',
    auditFilterActionAll: 'All actions',
    auditFilterEntity: 'Entity',
    auditFilterEntityAll: 'All entities',
    auditSearch: 'Search details…',
    auditRangeFrom: 'From',
    auditRangeTo: 'To',
    auditRange90d: '90 days',
    auditRangeAll: 'All time',
    auditClearFilters: 'Clear',

    auditActionCreated: 'Created',
    auditActionUpdated: 'Updated',
    auditActionDeleted: 'Deleted',
    auditActionStatusChanged: 'Status changed',
    auditActionLogin: 'Login',
    auditActionLogout: 'Logout',
    auditActionImpersonated: 'Impersonated',

    auditColTime: 'Time',
    auditColActor: 'Actor',
    auditColAction: 'Action',
    auditColEntity: 'Entity',
    auditSystemActor: 'System',

    auditPageInfo: 'Showing {from}–{to} of {total}',
    auditPrev: 'Previous',
    auditNext: 'Next',

    auditDrawerTitle: 'Audit entry',
    auditDrawerReadOnly: 'Read-only',
    auditDrawerClose: 'Close',
    auditDrawerActor: 'Actor',
    auditDrawerAction: 'Action',
    auditDrawerEntityType: 'Entity type',
    auditDrawerEntityId: 'Entity ID',
    auditDrawerTimestamp: 'Timestamp',
    auditDrawerRecordId: 'Record',
    auditDrawerDetails: 'Details',
    auditDrawerNoDetails: 'No additional details recorded.',
    auditDrawerLockNote: 'This entry is immutable and cannot be edited or deleted.',

    auditLoading: 'Loading audit trail…',
    auditErrorTitle: 'Could not load the audit log',
    auditErrorBody: 'Something went wrong fetching entries. Please try again.',
    auditRetry: 'Retry',
    auditEmptyTitle: 'No activity yet',
    auditEmptyBody: 'Key actions across your workspace will appear here as they happen.',
    auditNoResultsTitle: 'No matching entries',
    auditNoResultsBody: 'Try widening the date range or clearing filters.',
  },
  ar: {
    auditEyebrow: 'المساءلة',
    auditTitle: 'سجل التدقيق',
    auditLead: 'كل إجراء رئيسي في مساحتك، مسجَّل بالمُنفِّذ والوقت.',
    auditImmutableNote: 'للإضافة فقط · للقراءة فقط',
    auditCount: 'سجل',

    auditFilterActor: 'المُنفِّذ',
    auditFilterActorAll: 'كل المُنفِّذين',
    auditFilterAction: 'الإجراء',
    auditFilterActionAll: 'كل الإجراءات',
    auditFilterEntity: 'الكيان',
    auditFilterEntityAll: 'كل الكيانات',
    auditSearch: 'ابحث في التفاصيل…',
    auditRangeFrom: 'من',
    auditRangeTo: 'إلى',
    auditRange90d: '٩٠ يوماً',
    auditRangeAll: 'كل الوقت',
    auditClearFilters: 'مسح',

    auditActionCreated: 'إنشاء',
    auditActionUpdated: 'تحديث',
    auditActionDeleted: 'حذف',
    auditActionStatusChanged: 'تغيير الحالة',
    auditActionLogin: 'تسجيل دخول',
    auditActionLogout: 'تسجيل خروج',
    auditActionImpersonated: 'انتحال هوية',

    auditColTime: 'الوقت',
    auditColActor: 'المُنفِّذ',
    auditColAction: 'الإجراء',
    auditColEntity: 'الكيان',
    auditSystemActor: 'النظام',

    auditPageInfo: 'عرض {from}–{to} من {total}',
    auditPrev: 'السابق',
    auditNext: 'التالي',

    auditDrawerTitle: 'سجل التدقيق',
    auditDrawerReadOnly: 'للقراءة فقط',
    auditDrawerClose: 'إغلاق',
    auditDrawerActor: 'المُنفِّذ',
    auditDrawerAction: 'الإجراء',
    auditDrawerEntityType: 'نوع الكيان',
    auditDrawerEntityId: 'معرّف الكيان',
    auditDrawerTimestamp: 'الطابع الزمني',
    auditDrawerRecordId: 'السجل',
    auditDrawerDetails: 'التفاصيل',
    auditDrawerNoDetails: 'لا توجد تفاصيل إضافية مسجَّلة.',
    auditDrawerLockNote: 'هذا السجل غير قابل للتعديل ولا يمكن تحريره أو حذفه.',

    auditLoading: 'جارٍ تحميل سجل التدقيق…',
    auditErrorTitle: 'تعذّر تحميل سجل التدقيق',
    auditErrorBody: 'حدث خطأ أثناء جلب السجلات. حاول مرة أخرى.',
    auditRetry: 'إعادة المحاولة',
    auditEmptyTitle: 'لا يوجد نشاط بعد',
    auditEmptyBody: 'ستظهر الإجراءات الرئيسية في مساحتك هنا فور حدوثها.',
    auditNoResultsTitle: 'لا توجد سجلات مطابقة',
    auditNoResultsBody: 'جرّب توسيع النطاق الزمني أو مسح عوامل التصفية.',
  },
};
