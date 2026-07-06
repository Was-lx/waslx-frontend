import type { AppLanguage } from './language.types';

// ─── Settings page translations ───────────────────────────────────────────────

export type SettingsKey =
  | 'workspaceSettings'
  | 'whatsappConfig'
  | 'billingView'
  | 'accountSettings'
  | 'accountSettingsLead'
  | 'securitySection'
  | 'profileSettings'
  | 'profileSettingsDesc'
  | 'profileName'
  | 'profilePhone'
  | 'profilePhonePlaceholder'
  | 'profileEmail'
  | 'saveProfile'
  | 'profileUpdated'
  | 'changePasswordSection'
  | 'changePasswordDesc'
  | 'currentPassword'
  | 'changePasswordBtn'
  | 'passwordChanged'
  | 'identityWorkspace'
  | 'identityRoleFallback'
  | 'identityMember'
  | 'sectionProfileTag'
  | 'sectionSecurityTag';

export const settingsTranslations: Record<AppLanguage, Record<SettingsKey, string>> = {
  en: {
    workspaceSettings: 'Workspace Settings',
    whatsappConfig: 'WhatsApp Configuration',
    billingView: 'Billing & Plan',
    accountSettings: 'Account settings',
    accountSettingsLead: 'Manage your personal profile and password.',
    securitySection: 'Security',
    profileSettings: 'Profile Details',
    profileSettingsDesc: 'Update how your name and contact details appear across the workspace.',
    profileName: 'Full Name',
    profilePhone: 'Phone Number',
    profilePhonePlaceholder: '+20 100 000 0000',
    profileEmail: 'Email Address (Read-only)',
    saveProfile: 'Save Profile',
    profileUpdated: 'Profile updated successfully',
    changePasswordSection: 'Change Password',
    changePasswordDesc: 'Choose a strong password of at least 8 characters to secure your account.',
    currentPassword: 'Current Password',
    changePasswordBtn: 'Update Password',
    passwordChanged: 'Password changed successfully',
    identityWorkspace: 'Workspace',
    identityRoleFallback: 'Team member',
    identityMember: 'Active member',
    sectionProfileTag: 'Profile',
    sectionSecurityTag: 'Security',
  },
  ar: {
    workspaceSettings: 'إعدادات مساحة العمل',
    whatsappConfig: 'إعدادات واتساب',
    billingView: 'الفواتير والخطة',
    accountSettings: 'إعدادات الحساب',
    accountSettingsLead: 'إدارة ملفك الشخصي وكلمة المرور.',
    securitySection: 'الأمان',
    profileSettings: 'تفاصيل الملف الشخصي',
    profileSettingsDesc: 'حدّث طريقة ظهور اسمك وبيانات التواصل الخاصة بك في مساحة العمل.',
    profileName: 'الاسم الكامل',
    profilePhone: 'رقم الهاتف',
    profilePhonePlaceholder: '+20 100 000 0000',
    profileEmail: 'البريد الإلكتروني (للقراءة فقط)',
    saveProfile: 'حفظ التغييرات',
    profileUpdated: 'تم تحديث الملف الشخصي',
    changePasswordSection: 'تغيير كلمة المرور',
    changePasswordDesc: 'اختر كلمة مرور قوية لا تقل عن 8 أحرف لحماية حسابك.',
    currentPassword: 'كلمة المرور الحالية',
    changePasswordBtn: 'تحديث كلمة المرور',
    passwordChanged: 'تم تغيير كلمة المرور بنجاح',
    identityWorkspace: 'مساحة العمل',
    identityRoleFallback: 'عضو بالفريق',
    identityMember: 'عضو نشِط',
    sectionProfileTag: 'الملف الشخصي',
    sectionSecurityTag: 'الأمان',
  },
};
