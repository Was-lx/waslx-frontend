import type { AppLanguage } from './language.types';

// ─── Landing page translations ───────────────────────────────────────────────

export type LandingKey =
  | 'landingHeroTitle'
  | 'landingHeroSubtitle'
  | 'landingCta'
  | 'landingCtaSecondary'
  | 'landingFeature1Title'
  | 'landingFeature1Desc'
  | 'landingFeature2Title'
  | 'landingFeature2Desc'
  | 'landingFeature3Title'
  | 'landingFeature3Desc'
  | 'landingFeature4Title'
  | 'landingFeature4Desc'
  | 'landingFeature5Title'
  | 'landingFeature5Desc'
  | 'landingFeature6Title'
  | 'landingFeature6Desc'
  | 'landingHowTitle'
  | 'landingStep1Title'
  | 'landingStep1Desc'
  | 'landingStep2Title'
  | 'landingStep2Desc'
  | 'landingStep3Title'
  | 'landingStep3Desc'
  | 'landingTrustTitle'
  | 'landingTrust1'
  | 'landingTrust2'
  | 'landingTrust3'
  | 'landingTrust4'
  | 'landingFooterCopy';

export const landingTranslations: Record<AppLanguage, Record<LandingKey, string>> = {
  en: {
    landingHeroTitle: 'Your AI-Powered WhatsApp Team Inbox',
    landingHeroSubtitle:
      "Unify your team's WhatsApp conversations. AI-driven routing, smart reply suggestions, and real-time collaboration — all in one enterprise platform.",
    landingCta: 'Get Started',
    landingCtaSecondary: 'Learn More',
    landingFeature1Title: 'AI-Powered Inbox',
    landingFeature1Desc:
      'Smart reply suggestions and conversation summaries powered by GPT-4, so your team responds faster and smarter.',
    landingFeature2Title: 'Team Collaboration',
    landingFeature2Desc:
      'Internal notes, assignments, and real-time presence. Your team stays in sync on every conversation.',
    landingFeature3Title: 'Smart Routing',
    landingFeature3Desc:
      'AI classifies incoming messages and routes them to the right agent or team — automatically.',
    landingFeature4Title: 'Real-Time Analytics',
    landingFeature4Desc:
      'Track response times, resolution rates, and team performance with live dashboards.',
    landingFeature5Title: 'WhatsApp Integration',
    landingFeature5Desc:
      'Official WhatsApp Cloud API integration. Secure, reliable, and compliant with Meta policies.',
    landingFeature6Title: 'Arabic-First',
    landingFeature6Desc:
      'Built for Arabic-speaking teams with full RTL support, Egyptian dialect understanding, and bilingual UI.',
    landingHowTitle: 'How It Works',
    landingStep1Title: 'Connect',
    landingStep1Desc: 'Link your WhatsApp Business number in minutes. No coding required.',
    landingStep2Title: 'Collaborate',
    landingStep2Desc: 'Your team manages conversations together with AI assistance.',
    landingStep3Title: 'Scale',
    landingStep3Desc: 'Handle 10,000+ conversations daily with intelligent automation.',
    landingTrustTitle: 'Enterprise Ready',
    landingTrust1: 'End-to-end encryption',
    landingTrust2: 'Multi-tenant isolation',
    landingTrust3: 'Role-based access control',
    landingTrust4: '99.9% uptime SLA',
    landingFooterCopy: '© 2026 WaslX. AI-Powered WhatsApp Team Inbox.',
  },
  ar: {
    landingHeroTitle: 'صندوق واتساب الذكي لفريقك',
    landingHeroSubtitle:
      'وحّد محادثات واتساب لفريقك. توجيه ذكي بالذكاء الاصطناعي، اقتراحات رد ذكية، وتعاون فوري — كل ذلك في منصة مؤسسية واحدة.',
    landingCta: 'ابدأ الآن',
    landingCtaSecondary: 'اعرف المزيد',
    landingFeature1Title: 'بريد وارد بالذكاء الاصطناعي',
    landingFeature1Desc:
      'اقتراحات رد ذكية وملخصات محادثات مدعومة بـ GPT-4، ليرد فريقك بشكل أسرع وأذكى.',
    landingFeature2Title: 'تعاون الفريق',
    landingFeature2Desc: 'ملاحظات داخلية، تعيينات، وحضور فوري. فريقك يبقى متزامنًا في كل محادثة.',
    landingFeature3Title: 'توجيه ذكي',
    landingFeature3Desc:
      'الذكاء الاصطناعي يصنف الرسائل الواردة ويوجهها للوكيل أو الفريق المناسب — تلقائيًا.',
    landingFeature4Title: 'تحليلات فورية',
    landingFeature4Desc: 'تابع أوقات الاستجابة، معدلات الحل، وأداء الفريق بلوحات تحكم مباشرة.',
    landingFeature5Title: 'تكامل واتساب',
    landingFeature5Desc: 'تكامل رسمي مع WhatsApp Cloud API. آمن وموثوق ومتوافق مع سياسات Meta.',
    landingFeature6Title: 'العربية أولًا',
    landingFeature6Desc:
      'مبني لفرق تتحدث العربية مع دعم كامل RTL، فهم اللهجة المصرية، وواجهة ثنائية اللغة.',
    landingHowTitle: 'كيف يعمل',
    landingStep1Title: 'اربط',
    landingStep1Desc: 'اربط رقم واتساب للأعمال في دقائق. بدون برمجة.',
    landingStep2Title: 'تعاون',
    landingStep2Desc: 'فريقك يدير المحادثات معًا بمساعدة الذكاء الاصطناعي.',
    landingStep3Title: 'توسّع',
    landingStep3Desc: 'تعامل مع أكثر من 10,000 محادثة يوميًا بأتمتة ذكية.',
    landingTrustTitle: 'جاهز للمؤسسات',
    landingTrust1: 'تشفير من طرف لطرف',
    landingTrust2: 'عزل متعدد المستأجرين',
    landingTrust3: 'تحكم بالوصول حسب الأدوار',
    landingTrust4: '99.9% اتفاقية وقت التشغيل',
    landingFooterCopy: '© 2026 WaslX. صندوق واتساب ذكي بالذكاء الاصطناعي.',
  },
};
