import type { AppLanguage } from './language.types';

// ─── Contacts directory translations ──────────────────────────────────────────

export type ContactsKey =
  | 'contactList'
  | 'contactsEyebrow'
  | 'contactsCount'
  | 'contactsSearchPh'
  | 'contactsExport'
  | 'contactsExporting'
  | 'contactsExportCsv'
  | 'contactsExportExcel'
  | 'contactsAllTags'
  | 'contactsAllAssignees'
  | 'contactsDateFrom'
  | 'contactsDateTo'
  | 'contactsClear'
  | 'contactsColName'
  | 'contactsColPhone'
  | 'contactsColConv'
  | 'contactsColLast'
  | 'contactsColAssigned'
  | 'contactsColTags'
  | 'contactsUnassigned'
  | 'contactsLoading'
  | 'contactsNoResults'
  | 'contactsEmptyTitle'
  | 'contactsEmptyDesc'
  | 'contactsOf'
  | 'contactsPrev'
  | 'contactsNext'
  | 'contactsLoadErrorTitle'
  | 'contactsLoadErrorMsg'
  | 'contactsExportErrorTitle'
  | 'contactsExportErrorMsg';

export const contactsTranslations: Record<AppLanguage, Record<ContactsKey, string>> = {
  en: {
    contactList: 'Contacts',
    contactsEyebrow: 'Customer directory',
    contactsCount: 'contacts',
    contactsSearchPh: 'Search name or number…',
    contactsExport: 'Export',
    contactsExporting: 'Exporting…',
    contactsExportCsv: 'CSV (.csv)',
    contactsExportExcel: 'Excel (.xlsx)',
    contactsAllTags: 'All tags',
    contactsAllAssignees: 'All assignees',
    contactsDateFrom: 'Contacted from',
    contactsDateTo: 'To',
    contactsClear: 'Clear',
    contactsColName: 'Name',
    contactsColPhone: 'Phone',
    contactsColConv: 'Chats',
    contactsColLast: 'Last contact',
    contactsColAssigned: 'Assigned to',
    contactsColTags: 'Tags',
    contactsUnassigned: 'Unassigned',
    contactsLoading: 'Loading contacts…',
    contactsNoResults: 'No contacts match your filters.',
    contactsEmptyTitle: 'No contacts yet',
    contactsEmptyDesc: 'Everyone who messages your WhatsApp number appears here automatically.',
    contactsOf: 'of',
    contactsPrev: 'Previous',
    contactsNext: 'Next',
    contactsLoadErrorTitle: 'Could not load contacts',
    contactsLoadErrorMsg: 'Please try again in a moment.',
    contactsExportErrorTitle: 'Export failed',
    contactsExportErrorMsg: 'Could not export the contacts. Please try again.',
  },
  ar: {
    contactList: 'جهات الاتصال',
    contactsEyebrow: 'دليل العملاء',
    contactsCount: 'جهة اتصال',
    contactsSearchPh: 'ابحث بالاسم أو الرقم…',
    contactsExport: 'تصدير',
    contactsExporting: 'جارٍ التصدير…',
    contactsExportCsv: 'CSV (.csv)',
    contactsExportExcel: 'Excel (.xlsx)',
    contactsAllTags: 'كل الوسوم',
    contactsAllAssignees: 'كل المعيّنين',
    contactsDateFrom: 'تم التواصل من',
    contactsDateTo: 'إلى',
    contactsClear: 'مسح',
    contactsColName: 'الاسم',
    contactsColPhone: 'الهاتف',
    contactsColConv: 'المحادثات',
    contactsColLast: 'آخر تواصل',
    contactsColAssigned: 'معيّن إلى',
    contactsColTags: 'الوسوم',
    contactsUnassigned: 'غير معيّن',
    contactsLoading: 'جارٍ تحميل جهات الاتصال…',
    contactsNoResults: 'لا توجد جهات اتصال تطابق الفلاتر.',
    contactsEmptyTitle: 'لا توجد جهات اتصال بعد',
    contactsEmptyDesc: 'كل من يراسل رقم واتساب بتاعك بيظهر هنا تلقائيًا.',
    contactsOf: 'من',
    contactsPrev: 'السابق',
    contactsNext: 'التالي',
    contactsLoadErrorTitle: 'تعذّر تحميل جهات الاتصال',
    contactsLoadErrorMsg: 'حاول تاني بعد لحظة.',
    contactsExportErrorTitle: 'فشل التصدير',
    contactsExportErrorMsg: 'تعذّر تصدير جهات الاتصال. حاول تاني.',
  },
};
