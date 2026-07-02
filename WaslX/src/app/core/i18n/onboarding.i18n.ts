import type { AppLanguage } from './language.types';

// ─── Onboarding page translations ─────────────────────────────────────────────

export type OnboardingKey =
  | 'tenantOnboarding'
  | 'onboardingTitle'
  | 'onboardingLead'
  | 'onboardingBasics'
  | 'onboardingInvite'
  | 'onboardingConnect'
  | 'onboardingStepOneTitle'
  | 'onboardingStepOneLead'
  | 'onboardingStepTwoTitle'
  | 'onboardingStepTwoLead'
  | 'onboardingStepThreeTitle'
  | 'onboardingStepThreeLead'
  | 'workspaceName'
  | 'workspaceNameHelp'
  | 'adminEmail'
  | 'adminEmailHelp'
  | 'whatsappNumber'
  | 'whatsappNumberHelp'
  | 'stepBack'
  | 'stepForward'
  | 'finishSetup'
  | 'setupProgress'
  | 'setupCompleteTitle'
  | 'setupCompleteLead'
  | 'continueToWorkspace'
  | 'setupSaved'
  | 'setupCompleted';

export const onboardingTranslations: Record<AppLanguage, Record<OnboardingKey, string>> = {
  en: {
    tenantOnboarding: 'Tenant onboarding',
    onboardingTitle: 'Set up your workspace',
    onboardingLead: 'Complete the setup to start using WaslX with your team.',
    onboardingBasics: 'Basics',
    onboardingInvite: 'Invite team',
    onboardingConnect: 'Connect number',
    onboardingStepOneTitle: 'Name your workspace',
    onboardingStepOneLead: 'Use a short, recognizable name for the tenant workspace.',
    onboardingStepTwoTitle: 'Invite your team',
    onboardingStepTwoLead: 'Add one or more team members to get started.',
    onboardingStepThreeTitle: 'Connect WhatsApp',
    onboardingStepThreeLead: 'Register your WhatsApp Business number.',
    workspaceName: 'Workspace name',
    workspaceNameHelp: 'This is the name shown in the shell and notifications.',
    adminEmail: 'Admin email',
    adminEmailHelp: 'The address used for the initial invite or recovery.',
    whatsappNumber: 'WhatsApp number',
    whatsappNumberHelp: 'Enter the business number with country code.',
    stepBack: 'Back',
    stepForward: 'Next',
    finishSetup: 'Finish setup',
    setupProgress: 'Setup progress',
    setupCompleteTitle: 'Setup complete',
    setupCompleteLead: 'Your workspace is ready. Continue to start using WaslX.',
    continueToWorkspace: 'Continue to workspace',
    setupSaved: 'Saved',
    setupCompleted: 'Workspace setup complete',
  },
  ar: {
    tenantOnboarding: 'إعداد المستأجر',
    onboardingTitle: 'أكمل إعداد المساحة',
    onboardingLead: 'أكمل الإعداد لبدء استخدام WaslX مع فريقك.',
    onboardingBasics: 'الأساسيات',
    onboardingInvite: 'دعوة الفريق',
    onboardingConnect: 'ربط الرقم',
    onboardingStepOneTitle: 'سمِّ المساحة',
    onboardingStepOneLead: 'استخدم اسمًا قصيرًا وواضحًا للمساحة.',
    onboardingStepTwoTitle: 'ادعُ فريقك',
    onboardingStepTwoLead: 'أضف عضوًا واحدًا أو أكثر لتبدأ.',
    onboardingStepThreeTitle: 'اربط واتساب',
    onboardingStepThreeLead: 'سجّل رقم واتساب للأعمال.',
    workspaceName: 'اسم المساحة',
    workspaceNameHelp: 'الاسم الذي يظهر في الواجهة والإشعارات.',
    adminEmail: 'بريد المدير',
    adminEmailHelp: 'العنوان المستخدم للدعوة الأولى أو الاسترداد.',
    whatsappNumber: 'رقم واتساب',
    whatsappNumberHelp: 'أدخل رقم العمل مع رمز الدولة.',
    stepBack: 'رجوع',
    stepForward: 'التالي',
    finishSetup: 'إنهاء الإعداد',
    setupProgress: 'تقدم الإعداد',
    setupCompleteTitle: 'اكتمل الإعداد',
    setupCompleteLead: 'مساحة العمل جاهزة. تابع لبدء استخدام WaslX.',
    continueToWorkspace: 'المتابعة إلى المساحة',
    setupSaved: 'تم الحفظ',
    setupCompleted: 'اكتمل إعداد المساحة',
  },
};
