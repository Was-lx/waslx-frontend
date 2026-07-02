import type { AppLanguage } from './language.types';

// ─── Shared translations (used across multiple pages/layouts) ───────────────

export type SharedKey =
  | 'loading'
  | 'noData'
  | 'error'
  | 'retry'
  | 'comingSoon'
  | 'featureComingSoonDesc'
  | 'signedIn'
  | 'workspaceReady'
  | 'auth'
  | 'theme'
  | 'language'
  | 'signOut'
  | 'profile';

export const sharedTranslations: Record<AppLanguage, Record<SharedKey, string>> = {
  en: {
    loading: 'Loading…',
    noData: 'No data available',
    error: 'Something went wrong',
    retry: 'Retry',
    comingSoon: 'Coming Soon',
    featureComingSoonDesc: 'This feature is under development and will be available soon.',
    signedIn: 'Signed in',
    workspaceReady: 'Workspace ready',
    auth: 'Authentication',
    theme: 'Theme',
    language: 'Language',
    signOut: 'Sign out',
    profile: 'Profile',
  },
  ar: {
    loading: 'جارٍ التحميل…',
    noData: 'لا توجد بيانات',
    error: 'حدث خطأ ما',
    retry: 'إعادة المحاولة',
    comingSoon: 'قريبًا',
    featureComingSoonDesc: 'هذه الميزة تحت التطوير وستكون متاحة قريبًا.',
    signedIn: 'تم تسجيل الدخول',
    workspaceReady: 'المساحة جاهزة',
    auth: 'المصادقة',
    theme: 'المظهر',
    language: 'اللغة',
    signOut: 'تسجيل الخروج',
    profile: 'الملف الشخصي',
  },
};
