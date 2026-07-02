// Shared language types — kept in a separate file to avoid circular imports
// between language.service.ts (in /services) and the i18n slice files (in /i18n).

export type AppLanguage = 'en' | 'ar';
export type AppDirection = 'ltr' | 'rtl';
