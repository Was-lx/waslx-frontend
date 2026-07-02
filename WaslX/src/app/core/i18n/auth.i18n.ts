import type { AppLanguage } from './language.types';

// ─── Auth page translations (Login, Forgot Password, Reset Password) ─────────

export type AuthKey =
  | 'welcomeToWaslX'
  | 'emailAddress'
  | 'password'
  | 'signIn'
  | 'signingIn'
  | 'emailRequired'
  | 'emailInvalid'
  | 'passwordRequired'
  | 'passwordTooShort'
  | 'invalidCredentials'
  | 'loginTitle'
  | 'loginLead'
  | 'forgotPassword'
  | 'noAccount'
  // Forgot password page
  | 'forgotPasswordTitle'
  | 'forgotPasswordLead'
  | 'forgotPasswordEmailLabel'
  | 'forgotPasswordSubmit'
  | 'forgotPasswordSuccessTitle'
  | 'forgotPasswordSuccessLead'
  | 'backToLogin'
  // Reset password page
  | 'resetPasswordTitle'
  | 'resetPasswordLead'
  | 'newPassword'
  | 'confirmPassword'
  | 'passwordMismatch'
  | 'resetPasswordSubmit'
  | 'resetPasswordSuccessTitle'
  | 'resetPasswordSuccessLead';

export const authTranslations: Record<AppLanguage, Record<AuthKey, string>> = {
  en: {
    welcomeToWaslX: 'Welcome to WaslX',
    emailAddress: 'Email address',
    password: 'Password',
    signIn: 'Sign in',
    signingIn: 'Signing in…',
    emailRequired: 'Enter your email address.',
    emailInvalid: 'Enter a valid email address.',
    passwordRequired: 'Enter your password.',
    passwordTooShort: 'Use at least 8 characters.',
    invalidCredentials: 'Invalid email or password.',
    loginTitle: 'Sign in to your workspace',
    loginLead: 'Enter your credentials to access your team inbox.',
    forgotPassword: 'Forgot password?',
    noAccount: "Don't have an account? Contact your admin.",
    // Forgot password
    forgotPasswordTitle: 'Forgot your password?',
    forgotPasswordLead: "Enter your email and we'll send you a reset link.",
    forgotPasswordEmailLabel: 'Email address',
    forgotPasswordSubmit: 'Send reset link',
    forgotPasswordSuccessTitle: 'Check your inbox',
    forgotPasswordSuccessLead: 'A password reset link has been sent to your email.',
    backToLogin: 'Back to sign in',
    // Reset password
    resetPasswordTitle: 'Set a new password',
    resetPasswordLead: 'Choose a strong password for your account.',
    newPassword: 'New password',
    confirmPassword: 'Confirm password',
    passwordMismatch: 'Passwords do not match.',
    resetPasswordSubmit: 'Reset password',
    resetPasswordSuccessTitle: 'Password updated',
    resetPasswordSuccessLead: 'You can now sign in with your new password.',
  },
  ar: {
    welcomeToWaslX: 'مرحبًا بك في WaslX',
    emailAddress: 'البريد الإلكتروني',
    password: 'كلمة المرور',
    signIn: 'تسجيل الدخول',
    signingIn: 'جارٍ تسجيل الدخول…',
    emailRequired: 'أدخل بريدك الإلكتروني.',
    emailInvalid: 'أدخل بريدًا إلكترونيًا صالحًا.',
    passwordRequired: 'أدخل كلمة المرور.',
    passwordTooShort: 'استخدم 8 أحرف على الأقل.',
    invalidCredentials: 'البريد الإلكتروني أو كلمة المرور غير صحيحة.',
    loginTitle: 'سجّل دخولك إلى مساحة العمل',
    loginLead: 'أدخل بياناتك للوصول إلى صندوق فريقك.',
    forgotPassword: 'نسيت كلمة المرور؟',
    noAccount: 'ليس لديك حساب؟ تواصل مع المدير.',
    // Forgot password
    forgotPasswordTitle: 'نسيت كلمة المرور؟',
    forgotPasswordLead: 'أدخل بريدك الإلكتروني وسنرسل لك رابط إعادة التعيين.',
    forgotPasswordEmailLabel: 'البريد الإلكتروني',
    forgotPasswordSubmit: 'إرسال رابط الإعادة',
    forgotPasswordSuccessTitle: 'تحقق من بريدك',
    forgotPasswordSuccessLead: 'تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني.',
    backToLogin: 'العودة إلى تسجيل الدخول',
    // Reset password
    resetPasswordTitle: 'تعيين كلمة مرور جديدة',
    resetPasswordLead: 'اختر كلمة مرور قوية لحسابك.',
    newPassword: 'كلمة المرور الجديدة',
    confirmPassword: 'تأكيد كلمة المرور',
    passwordMismatch: 'كلمتا المرور غير متطابقتين.',
    resetPasswordSubmit: 'إعادة تعيين كلمة المرور',
    resetPasswordSuccessTitle: 'تم تحديث كلمة المرور',
    resetPasswordSuccessLead: 'يمكنك الآن تسجيل الدخول بكلمة المرور الجديدة.',
  },
};
