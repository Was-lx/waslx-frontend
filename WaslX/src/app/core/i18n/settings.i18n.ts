import type { AppLanguage } from './language.types';

// ─── Settings page translations ───────────────────────────────────────────────

export type SettingsKey = 
  | 'workspaceSettings' 
  | 'whatsappConfig' 
  | 'billingView'
  | 'profileSettings'
  | 'profileName'
  | 'profileEmail'
  | 'saveProfile'
  | 'profileUpdated'
  | 'changePasswordSection'
  | 'currentPassword'
  | 'changePasswordBtn'
  | 'passwordChanged';

export const settingsTranslations: Record<AppLanguage, Record<SettingsKey, string>> = {
  en: {
    workspaceSettings: 'Workspace Settings',
    whatsappConfig: 'WhatsApp Configuration',
    billingView: 'Billing & Plan',
    profileSettings: 'Profile Details',
    profileName: 'Full Name',
    profileEmail: 'Email Address (Read-only)',
    saveProfile: 'Save Profile',
    profileUpdated: 'Profile updated successfully',
    changePasswordSection: 'Change Password',
    currentPassword: 'Current Password',
    changePasswordBtn: 'Update Password',
    passwordChanged: 'Password changed successfully',
  },
  ar: {
    workspaceSettings: 'إعدادات مساحة العمل',
    whatsappConfig: 'إعدادات واتساب',
    billingView: 'الفواتير والخطة',
    profileSettings: 'تفاصيل الملف الشخصي',
    profileName: 'الاسم الكامل',
    profileEmail: 'البريد الإلكتروني (للقراءة فقط)',
    saveProfile: 'حفظ التغييرات',
    profileUpdated: 'تم تحديث الملف الشخصي',
    changePasswordSection: 'تغيير كلمة المرور',
    currentPassword: 'كلمة المرور الحالية',
    changePasswordBtn: 'تحديث كلمة المرور',
    passwordChanged: 'تم تغيير كلمة المرور بنجاح',
  },
};
