import type { AppLanguage } from './language.types';

// ─── Contacts page translations ───────────────────────────────────────────────

export type ContactsKey = 'contactList' | 'addContact';

export const contactsTranslations: Record<AppLanguage, Record<ContactsKey, string>> = {
  en: {
    contactList: 'Contact List',
    addContact: 'Add Contact',
  },
  ar: {
    contactList: 'قائمة جهات الاتصال',
    addContact: 'إضافة جهة اتصال',
  },
};
