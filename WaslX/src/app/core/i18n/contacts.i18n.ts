import type { AppLanguage } from './language.types';

// ─── Contacts page translations ───────────────────────────────────────────────

export type ContactsKey =
  | 'contactList'
  | 'addContact'
  // Empty / preview state
  | 'contactsEyebrow'
  | 'contactsEmptyTitle'
  | 'contactsEmptyDesc'
  | 'contactsImportCta'
  | 'contactsFeatSegments'
  | 'contactsFeatSegmentsDesc'
  | 'contactsFeatHistory'
  | 'contactsFeatHistoryDesc'
  | 'contactsFeatVip'
  | 'contactsFeatVipDesc';

export const contactsTranslations: Record<AppLanguage, Record<ContactsKey, string>> = {
  en: {
    contactList: 'Contact List',
    addContact: 'Add Contact',
    contactsEyebrow: 'Customer directory',
    contactsEmptyTitle: 'Your customer directory starts here',
    contactsEmptyDesc:
      'Every person who messages your WhatsApp number becomes a rich contact — with tags, tiers, and full conversation history. Add your first one or import a list to begin.',
    contactsImportCta: 'Import contacts',
    contactsFeatSegments: 'Smart segments',
    contactsFeatSegmentsDesc: 'Group by tier, tag, or activity',
    contactsFeatHistory: 'Full history',
    contactsFeatHistoryDesc: 'Every chat in one profile',
    contactsFeatVip: 'VIP tiers',
    contactsFeatVipDesc: 'Flag and prioritize key accounts',
  },
  ar: {
    contactList: 'قائمة جهات الاتصال',
    addContact: 'إضافة جهة اتصال',
    contactsEyebrow: 'دليل العملاء',
    contactsEmptyTitle: 'دليل عملائك يبدأ من هنا',
    contactsEmptyDesc:
      'كل شخص يراسل رقم واتساب يصبح جهة اتصال غنية — مع الوسوم والفئات وسجل المحادثات الكامل. أضف أول جهة اتصال أو استورد قائمة للبدء.',
    contactsImportCta: 'استيراد جهات الاتصال',
    contactsFeatSegments: 'شرائح ذكية',
    contactsFeatSegmentsDesc: 'التجميع حسب الفئة أو الوسم أو النشاط',
    contactsFeatHistory: 'سجل كامل',
    contactsFeatHistoryDesc: 'كل المحادثات في ملف واحد',
    contactsFeatVip: 'فئات VIP',
    contactsFeatVipDesc: 'ميّز وأعطِ الأولوية للحسابات المهمة',
  },
};
