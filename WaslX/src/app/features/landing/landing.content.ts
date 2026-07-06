import type { AppLanguage } from '../../core/i18n/language.types';

/**
 * All marketing copy for the landing site, EN + Arabic. Kept local to the landing
 * feature (feature-owns-its-data). Direction/language come from LanguageService.
 */

export interface NavLink {
  readonly label: string;
  readonly path: string;
}
export interface FeatureItem {
  readonly icon: string;
  readonly eyebrow: string;
  readonly title: string;
  readonly desc: string;
  readonly points: readonly string[];
  readonly kind: 'inbox' | 'route' | 'ai' | 'handoff';
}
export interface StatItem {
  readonly value: number;
  readonly decimals: number;
  readonly prefix: string;
  readonly suffix: string;
  readonly label: string;
}
export interface StepItem {
  readonly icon: string;
  readonly title: string;
  readonly desc: string;
}
export interface ShowcaseRow {
  readonly eyebrow: string;
  readonly title: string;
  readonly desc: string;
  readonly points: readonly string[];
  readonly icon: string;
}
export interface Testimonial {
  readonly quote: string;
  readonly name: string;
  readonly role: string;
  readonly initials: string;
}
export interface Plan {
  readonly id: string;
  readonly icon: string;
  readonly name: string;
  readonly tagline: string;
  readonly priceMonthly: number | null;
  readonly priceYearly: number | null;
  readonly priceCustom: string | null;
  readonly cta: string;
  readonly popular: boolean;
  readonly features: readonly string[];
}
export interface Faq {
  readonly q: string;
  readonly a: string;
}
export interface ValueItem {
  readonly icon: string;
  readonly title: string;
  readonly desc: string;
}
export interface IntegrationItem {
  readonly icon: string;
  readonly label: string;
}
export interface ComparisonRow {
  readonly feature: string;
  readonly cells: readonly string[]; // 'yes' | 'no' | free text, per plan
}
export interface FooterColumn {
  readonly title: string;
  readonly links: readonly NavLink[];
}

export interface LandingContent {
  readonly nav: readonly NavLink[];
  readonly signIn: string;
  readonly getStarted: string;
  readonly bookDemo: string;
  readonly langLabel: string;

  readonly hero: {
    readonly badge: string;
    readonly titleLead: string;
    readonly titleAccent: string;
    readonly rotating: readonly string[];
    readonly subtitle: string;
    readonly ctaPrimary: string;
    readonly ctaSecondary: string;
    readonly note: string;
    readonly trustText: string;
  };
  readonly marqueeLabel: string;
  readonly statsEyebrow: string;
  readonly stats: readonly StatItem[];

  readonly compareEyebrow: string;
  readonly compareTitle: string;
  readonly compareSubtitle: string;
  readonly compareBadLabel: string;
  readonly compareGoodLabel: string;
  readonly compareBad: readonly string[];
  readonly compareGood: readonly string[];

  readonly featuresEyebrow: string;
  readonly featuresTitle: string;
  readonly featuresSubtitle: string;
  readonly features: readonly FeatureItem[];

  readonly pipeline: {
    readonly eyebrow: string;
    readonly title: string;
    readonly subtitle: string;
    readonly steps: readonly StepItem[];
    readonly badge: string;
  };

  readonly integrationsTitle: string;
  readonly integrationsSubtitle: string;
  readonly integrations: readonly IntegrationItem[];

  readonly howEyebrow: string;
  readonly howTitle: string;
  readonly howSubtitle: string;
  readonly how: readonly StepItem[];

  readonly showcaseEyebrow: string;
  readonly showcaseTitle: string;
  readonly showcase: readonly ShowcaseRow[];

  readonly testimonialsEyebrow: string;
  readonly testimonialsTitle: string;
  readonly testimonials: readonly Testimonial[];

  readonly ctaEyebrow: string;
  readonly ctaTitle: string;
  readonly ctaSubtitle: string;
  readonly ctaPrimary: string;
  readonly ctaSecondary: string;
  readonly ctaNote: string;

  readonly footer: {
    readonly tagline: string;
    readonly columns: readonly FooterColumn[];
    readonly copyright: string;
    readonly legal: readonly NavLink[];
  };

  readonly pricingPage: {
    readonly badge: string;
    readonly title: string;
    readonly subtitle: string;
    readonly monthly: string;
    readonly yearly: string;
    readonly yearlyNote: string;
    readonly perMonth: string;
    readonly mostPopular: string;
    readonly plans: readonly Plan[];
    readonly comparisonTitle: string;
    readonly comparisonPlans: readonly string[];
    readonly comparison: readonly ComparisonRow[];
    readonly assuranceTitle: string;
    readonly assurance: readonly ValueItem[];
    readonly faqTitle: string;
    readonly faqs: readonly Faq[];
  };

  readonly aboutPage: {
    readonly badge: string;
    readonly title: string;
    readonly subtitle: string;
    readonly missionTitle: string;
    readonly mission: string;
    readonly valuesTitle: string;
    readonly values: readonly ValueItem[];
    readonly approachTitle: string;
    readonly approachSubtitle: string;
    readonly approach: readonly ValueItem[];
    readonly impactTitle: string;
    readonly impact: readonly StatItem[];
  };

  readonly contactPage: {
    readonly badge: string;
    readonly title: string;
    readonly subtitle: string;
    readonly formName: string;
    readonly formEmail: string;
    readonly formCompany: string;
    readonly formMessage: string;
    readonly formSubmit: string;
    readonly formSuccess: string;
    readonly infoTitle: string;
    readonly email: string;
    readonly phone: string;
    readonly location: string;
    readonly responseNote: string;
    readonly promiseTitle: string;
    readonly promise: readonly StepItem[];
  };
}

const en: LandingContent = {
  nav: [
    { label: 'Home', path: '/' },
    { label: 'Pricing', path: '/pricing' },
    { label: 'About us', path: '/about' },
    { label: 'Contact us', path: '/contact' },
  ],
  signIn: 'Sign in',
  getStarted: 'Book a demo',
  bookDemo: 'Book a demo',
  langLabel: 'العربية',

  hero: {
    badge: 'AI-native WhatsApp operations',
    titleLead: 'The inbox that knows',
    titleAccent: 'who should reply',
    rotating: ['who should reply', 'who’s about to churn', 'what to say next', 'when to escalate'],
    subtitle:
      'Turn your WhatsApp number into an AI operations layer — smart routing, a shared inbox, and replies that answer: who should reply?',
    ctaPrimary: 'Book a demo',
    ctaSecondary: 'See pricing',
    note: 'Live in minutes · Arabic-first · No engineering needed',
    trustText: 'Trusted by fast-moving MENA support & sales teams',
  },
  marqueeLabel: 'Built for fast-moving support, sales and operations teams',
  statsEyebrow: 'By the numbers',
  stats: [
    { value: 10000, decimals: 0, prefix: '', suffix: '+', label: 'Conversations / day / tenant' },
    { value: 3, decimals: 0, prefix: '', suffix: '×', label: 'Faster resolution' },
    { value: 40, decimals: 0, prefix: '', suffix: '%', label: 'Less time to first reply' },
    { value: 90, decimals: 0, prefix: '', suffix: '%', label: 'Chats auto-routed to the right agent' },
  ],

  compareEyebrow: 'Before & after',
  compareTitle: 'The difference is who replies',
  compareSubtitle:
    'Most inboxes just pile every chat in one place. WaslX decides what happens next.',
  compareBadLabel: 'Without WaslX',
  compareGoodLabel: 'With WaslX',
  compareBad: [
    'Every chat lands in one shared pile',
    'Messages slip through during busy hours',
    'Agents manually guess who takes what',
    'Context is lost on every handoff',
  ],
  compareGood: [
    'AI routes each chat to the best-fit agent',
    'The right person is assigned before anyone reads it',
    'Replies drafted in seconds, in Arabic or English',
    'A one-tap AI summary travels on every handoff',
  ],

  featuresEyebrow: 'One platform',
  featuresTitle: 'Everything your team needs on WhatsApp',
  featuresSubtitle:
    'Not just a shared inbox — a full operations layer with AI at its core, built Arabic-first for MENA teams.',
  features: [
    {
      icon: 'inbox',
      eyebrow: 'Shared inbox',
      title: 'One real-time inbox the whole team works from',
      desc: 'Every WhatsApp conversation in one place — with presence, internal notes and full history. No more forwarded screenshots or two agents replying at once.',
      points: ['Live presence & typing', 'Private internal notes', 'Clear single ownership'],
      kind: 'inbox',
    },
    {
      icon: 'route',
      eyebrow: 'Smart routing',
      title: 'Every chat reaches the agent most likely to close it',
      desc: 'The engine reads topic, language, sentiment and VIP status, then routes by live performance and workload — not just whoever is free.',
      points: ['Intent & sentiment aware', 'Performance-based scoring', 'Round-robin fallback'],
      kind: 'route',
    },
    {
      icon: 'sparkles',
      eyebrow: 'AI replies',
      title: 'Grounded reply drafts, ready in about a second',
      desc: '1–3 suggestions per message in Arabic or English, grounded in the customer’s history. Your agents stay in control — nothing is ever sent automatically.',
      points: ['Arabic-first drafting', 'Grounded in real history', 'Human always approves'],
      kind: 'ai',
    },
    {
      icon: 'layers',
      eyebrow: 'Stage handoff',
      title: 'Move a customer across teams without losing context',
      desc: 'Groups and stages let a conversation flow from Sales to Ops to Success. A one-tap AI summary travels with it on every handoff.',
      points: ['Stage pipelines per team', 'AI summary on handoff', 'Full audit trail'],
      kind: 'handoff',
    },
  ],

  pipeline: {
    eyebrow: 'The AI difference',
    title: 'Three AI systems, working in parallel',
    subtitle:
      'On every inbound message, WaslX runs routing and memory retrieval side-by-side, then drafts a reply — all under two seconds.',
    steps: [
      { icon: 'route', title: 'Routing engine', desc: 'Reads intent, sentiment and priority, then picks the best-fit agent or team.' },
      { icon: 'cpu', title: 'RAG memory', desc: 'Retrieves the customer’s history and knowledge base for grounded context.' },
      { icon: 'sparkles', title: 'Reply engine', desc: 'Drafts 1–3 suggestions in Arabic or English for the agent to send.' },
    ],
    badge: 'Under 2 seconds, end to end',
  },

  integrationsTitle: 'Built on infrastructure you already trust',
  integrationsSubtitle:
    'The official WhatsApp Business Cloud API, enterprise security, and the AI models teams rely on — no gray-market bridges.',
  integrations: [
    { icon: 'message', label: 'WhatsApp Business Cloud API' },
    { icon: 'shield', label: 'Enterprise-grade encryption' },
    { icon: 'sparkles', label: 'GPT-4.1 reply & routing' },
    { icon: 'cpu', label: 'Vector-search memory' },
    { icon: 'bell', label: 'Real-time via SignalR' },
    { icon: 'lock', label: 'Role-based access control' },
  ],

  howEyebrow: 'Get going fast',
  howTitle: 'From number to AI inbox in three steps',
  howSubtitle: 'No engineering project. Connect once and your team is live.',
  how: [
    { icon: 'link', title: 'Connect', desc: 'Link your WhatsApp Business number through the official Cloud API in minutes.' },
    { icon: 'users', title: 'Collaborate', desc: 'Invite your team, set roles and groups, and let AI route every conversation.' },
    { icon: 'trending-up', title: 'Scale', desc: 'Handle thousands of conversations a day with routing, memory and analytics.' },
  ],

  showcaseEyebrow: 'Purpose-built',
  showcaseTitle: 'Designed for how support and sales actually work',
  showcase: [
    {
      eyebrow: 'Cross-team handoff',
      title: 'Move a customer from Sales to Operations without losing context',
      desc: 'Teams, groups and stages let a conversation flow across your org. A one-tap AI summary travels with it on every handoff.',
      points: ['Stage pipelines per team', 'AI summary on handoff', 'Full audit trail'],
      icon: 'layers',
    },
    {
      eyebrow: 'Performance-aware routing',
      title: 'Send every chat to the agent most likely to close it',
      desc: 'The engine scores agents on live load, resolution rate and response time — then routes to whoever can actually win the conversation, not just whoever is free.',
      points: ['Live agent scoring', 'Round-robin fallback', 'Reassign in one tap'],
      icon: 'route',
    },
    {
      eyebrow: 'Customer memory (RAG)',
      title: 'Every reply remembers the whole relationship',
      desc: 'A vector memory layer recalls past orders, tickets and preferences, so answers stay consistent even when a brand-new agent picks up the thread.',
      points: ['Vector recall per customer', 'Grounded, on-brand replies', 'No repeated questions'],
      icon: 'cpu',
    },
    {
      eyebrow: 'Shared team inbox',
      title: 'One inbox the whole team can actually work from',
      desc: 'Real-time updates, internal notes and clear ownership mean two agents never reply to the same customer — and nothing slips through the cracks.',
      points: ['Real-time via SignalR', 'Private internal notes', 'Clear single ownership'],
      icon: 'inbox',
    },
  ],

  testimonialsEyebrow: 'Loved by teams',
  testimonialsTitle: 'Support that finally feels in control',
  testimonials: [
    { quote: 'Routing alone cut our first-response time in half. The right agent gets the right chat before anyone even reads it.', name: 'Nour A.', role: 'Head of Support, Retail SMB', initials: 'NA' },
    { quote: 'The Arabic reply suggestions are shockingly good. Our team ships answers in seconds and still sounds human.', name: 'Karim H.', role: 'Operations Lead, Logistics', initials: 'KH' },
    { quote: 'We handed off from sales to onboarding without a single dropped thread. The AI summary is a game changer.', name: 'Salma R.', role: 'Founder, D2C Brand', initials: 'SR' },
    { quote: 'One WhatsApp number, three teams, zero chaos — nothing slips, even at 2,000 chats a day.', name: 'Yousef T.', role: 'Customer Ops Manager, Fintech', initials: 'YT' },
  ],

  ctaEyebrow: 'Ready when you are',
  ctaTitle: 'Turn WhatsApp into your best operations channel',
  ctaSubtitle:
    'See it live on your own number. Book a demo, meet the AI routing, and watch a handoff happen in real time.',
  ctaPrimary: 'Book a demo',
  ctaSecondary: 'Sign in',
  ctaNote: 'Arabic-first · Live in minutes · Human always in control',

  footer: {
    tagline: 'The AI-powered WhatsApp team inbox for MENA teams.',
    columns: [
      { title: 'Product', links: [ { label: 'Pricing', path: '/pricing' }, { label: 'AI pipeline', path: '/#pipeline' }, { label: 'How it works', path: '/#how' } ] },
      { title: 'Company', links: [ { label: 'About', path: '/about' }, { label: 'Contact', path: '/contact' } ] },
      { title: 'Get started', links: [ { label: 'Sign in', path: '/login' }, { label: 'Book a demo', path: '/contact' } ] },
    ],
    copyright: '© 2026 WaslX. All rights reserved.',
    legal: [ { label: 'Privacy', path: '/' }, { label: 'Terms', path: '/' } ],
  },

  pricingPage: {
    badge: 'Pricing',
    title: 'Pricing that scales with your team',
    subtitle:
      'Transparent plans that scale with your team. Every plan includes the shared inbox and official WhatsApp integration.',
    monthly: 'Monthly',
    yearly: 'Yearly',
    yearlyNote: 'Save 2 months',
    perMonth: '/mo',
    mostPopular: 'Most popular',
    plans: [
      { id: 'starter', icon: 'zap', name: 'Starter', tagline: 'For small teams getting organized on WhatsApp.', priceMonthly: 29, priceYearly: 24, priceCustom: null, cta: 'Get started', popular: false, features: ['Up to 3 agents', '1 WhatsApp number', 'Shared team inbox', 'Manual & round-robin routing', 'Tags & filters', 'Basic reporting'] },
      { id: 'growth', icon: 'sparkles', name: 'Growth', tagline: 'The full AI pipeline for scaling teams.', priceMonthly: 99, priceYearly: 82, priceCustom: null, cta: 'Get started', popular: true, features: ['Up to 15 agents', '2 WhatsApp numbers', 'AI routing + RAG memory', 'AI reply suggestions', 'Campaigns & broadcasts', 'Advanced analytics', 'Groups & stage handoff'] },
      { id: 'enterprise', icon: 'shield', name: 'Enterprise', tagline: 'Advanced control, scale and support.', priceMonthly: 299, priceYearly: 249, priceCustom: null, cta: 'Start free trial', popular: false, features: ['Unlimited agents', 'Multiple WhatsApp numbers', 'Custom AI limits', 'SSO & advanced RBAC', 'Priority support & SLA', 'Dedicated onboarding'] },
    ],
    comparisonTitle: 'Compare every plan',
    comparisonPlans: ['Starter', 'Growth', 'Enterprise'],
    comparison: [
      { feature: 'Agents', cells: ['3', '15', 'Unlimited'] },
      { feature: 'WhatsApp numbers', cells: ['1', '2', 'Multiple'] },
      { feature: 'Shared team inbox', cells: ['yes', 'yes', 'yes'] },
      { feature: 'AI smart routing', cells: ['no', 'yes', 'yes'] },
      { feature: 'AI reply suggestions', cells: ['no', 'yes', 'yes'] },
      { feature: 'RAG memory', cells: ['no', 'yes', 'yes'] },
      { feature: 'Campaigns & broadcasts', cells: ['no', 'yes', 'yes'] },
      { feature: 'Advanced analytics', cells: ['no', 'yes', 'yes'] },
      { feature: 'SSO & advanced RBAC', cells: ['no', 'no', 'yes'] },
      { feature: 'Priority support & SLA', cells: ['no', 'no', 'yes'] },
    ],
    assuranceTitle: 'Every plan comes with the essentials',
    assurance: [
      { icon: 'link', title: 'Official WhatsApp API', desc: 'Connect your own number through Meta’s Cloud API — you own the number and the data.' },
      { icon: 'headset', title: 'Human onboarding', desc: 'A real person walks your team through setup. No “figure it out yourself.”' },
      { icon: 'shield', title: 'No lock-in', desc: 'Upgrade, downgrade or leave anytime. Your conversation history is always exportable.' },
    ],
    faqTitle: 'Questions, answered',
    faqs: [
      { q: 'Do I need a WhatsApp Business API account?', a: 'Yes — WaslX connects through the official WhatsApp Business Cloud API. We guide you through connecting your number in minutes.' },
      { q: 'Is the AI ever sending messages on its own?', a: 'Never. The AI drafts suggestions and routes conversations, but a human agent always sends the final reply.' },
      { q: 'Does it really understand Arabic?', a: 'WaslX is built Arabic-first, including Egyptian and Gulf dialects, with a fully RTL interface and bilingual replies.' },
      { q: 'Can I switch plans later?', a: 'Yes, you can upgrade or downgrade at any time. Changes take effect on your next billing cycle.' },
    ],
  },

  aboutPage: {
    badge: 'Our story',
    title: 'WhatsApp deserves an operations layer',
    subtitle:
      'One question every growing team keeps asking: who should reply to this customer? We built the answer.',
    missionTitle: 'Our mission',
    mission:
      'Give MENA’s small and medium businesses an AI-native, Arabic-first way to run customer operations on WhatsApp — performance-aware routing, real team collaboration, and simplicity that just works.',
    valuesTitle: 'What we stand for',
    values: [
      { icon: 'route', title: 'Performance-aware', desc: 'Routing isn’t random. The best-suited agent gets the conversation, every time.' },
      { icon: 'languages', title: 'Arabic-first', desc: 'Built for how MENA teams actually talk — dialects, RTL and bilingual by default.' },
      { icon: 'zap', title: 'SMB simplicity', desc: 'Enterprise power without the enterprise setup. Live in minutes, not months.' },
      { icon: 'shield', title: 'Trust by design', desc: 'Tenant isolation, RBAC and audit trails baked in — not bolted on.' },
    ],
    approachTitle: 'What makes WaslX different',
    approachSubtitle:
      'Most inboxes just show you every chat. WaslX decides what happens next — and proves it.',
    approach: [
      { icon: 'route', title: 'Routing that reads the room', desc: 'Topic, language, sentiment and VIP status are scored on every message — so the right agent gets the chat before anyone opens it.' },
      { icon: 'cpu', title: 'Memory, not amnesia', desc: 'RAG gives every customer long-term context. No more re-explaining — the AI answers with the real history of the relationship.' },
      { icon: 'languages', title: 'Arabic as a first language', desc: 'Dialect-aware routing, RTL-native UI and bilingual replies — not English software with Arabic bolted on.' },
      { icon: 'shield', title: 'Trust you can audit', desc: 'Strict tenant isolation, role-based access on every request, and an immutable audit log for everything that happens.' },
    ],
    impactTitle: 'Why this matters for MENA teams',
    impact: [
      { value: 2, decimals: 0, prefix: '', suffix: 'B+', label: 'People use WhatsApp worldwide' },
      { value: 175, decimals: 0, prefix: '', suffix: 'M+', label: 'Daily messages to businesses' },
      { value: 1, decimals: 0, prefix: '#', suffix: '', label: 'Channel MENA customers actually use' },
    ],
  },

  contactPage: {
    badge: 'Contact',
    title: 'Let’s talk',
    subtitle:
      'Tell us what you need — a real person replies within one business day.',
    formName: 'Full name',
    formEmail: 'Work email',
    formCompany: 'Company',
    formMessage: 'How can we help?',
    formSubmit: 'Send message',
    formSuccess: 'Thanks! We’ll get back to you shortly.',
    infoTitle: 'Other ways to reach us',
    email: 'hello@waslx.com',
    phone: '+20 100 000 0000',
    location: 'Cairo, Egypt · Remote-first',
    responseNote: 'Average response time: under 24 hours.',
    promiseTitle: 'What happens after you reach out',
    promise: [
      { icon: 'clock', title: 'We reply within one business day', desc: 'A real person, not an autoresponder — usually much sooner.' },
      { icon: 'chart', title: 'A live walkthrough, tailored to you', desc: 'We map WaslX to how your team actually handles WhatsApp today.' },
      { icon: 'zap', title: 'You’re live in minutes', desc: 'Connect your number and start routing — no engineering project.' },
    ],
  },
};

const ar: LandingContent = {
  nav: [
    { label: 'الرئيسية', path: '/' },
    { label: 'الأسعار', path: '/pricing' },
    { label: 'من نحن', path: '/about' },
    { label: 'تواصل معنا', path: '/contact' },
  ],
  signIn: 'تسجيل الدخول',
  getStarted: 'احجز عرض',
  bookDemo: 'احجز عرض',
  langLabel: 'English',

  hero: {
    badge: 'عمليات واتساب مدعومة بالذكاء الاصطناعي',
    titleLead: 'الصندوق اللي بيعرف',
    titleAccent: 'مين يرد',
    rotating: ['مين المفروض يرد', 'مين قرّب يمشي', 'الرد المناسب', 'إمتى يصعّد'],
    subtitle:
      'حوّل رقم واتساب لطبقة عمليات ذكية — توجيه تلقائي، صندوق مشترك، واقتراحات رد بتجاوب: مين يرد؟',
    ctaPrimary: 'احجز عرض',
    ctaSecondary: 'شوف الأسعار',
    note: 'جاهز في دقائق · عربي أولًا · من غير أي برمجة',
    trustText: 'موثوقة من فرق الدعم والمبيعات السريعة في المنطقة',
  },
  marqueeLabel: 'مبنية لفرق الدعم والمبيعات والعمليات السريعة',
  statsEyebrow: 'بالأرقام',
  stats: [
    { value: 10000, decimals: 0, prefix: '', suffix: '+', label: 'محادثة / يوم / لكل عميل' },
    { value: 3, decimals: 0, prefix: '', suffix: '×', label: 'حل أسرع' },
    { value: 40, decimals: 0, prefix: '', suffix: '%', label: 'وقت أقل لأول رد' },
    { value: 90, decimals: 0, prefix: '', suffix: '%', label: 'محادثة بتتوجّه تلقائيًا للوكيل الصح' },
  ],

  compareEyebrow: 'قبل وبعد',
  compareTitle: 'الفرق في مين اللي بيرد',
  compareSubtitle: 'أغلب الصناديق بترص كل الشاتات في مكان واحد. WaslX بتقرّر يحصل إيه بعد كده.',
  compareBadLabel: 'من غير WaslX',
  compareGoodLabel: 'مع WaslX',
  compareBad: [
    'كل الشاتات بتنزل في كومة واحدة',
    'رسائل بتضيع في وقت الزحمة',
    'الوكلاء بيخمّنوا مين ياخد إيه',
    'السياق بيضيع مع كل تسليم',
  ],
  compareGood: [
    'الـ AI بيوجّه كل شات للوكيل الأنسب',
    'الشخص الصح بيتعيّن قبل ما حد يقرا',
    'الردود بتتكتب في ثواني، عربي أو إنجليزي',
    'ملخّص AI بضغطة بيسافر مع كل تسليم',
  ],

  featuresEyebrow: 'منصّة واحدة',
  featuresTitle: 'كل اللي فريقك محتاجه على واتساب',
  featuresSubtitle:
    'مش مجرد صندوق وارد مشترك — طبقة عمليات كاملة والذكاء الاصطناعي في قلبها، مبنية عربي-أولًا لفرق المنطقة.',
  features: [
    {
      icon: 'inbox',
      eyebrow: 'صندوق مشترك',
      title: 'صندوق وارد واحد فوري الفريق كله يشتغل منه',
      desc: 'كل محادثات واتساب في مكان واحد — بحضور وملاحظات داخلية وتاريخ كامل. خلاص بلاش سكرين شوت ولا وكيلين يردّوا على نفس العميل.',
      points: ['حضور وكتابة لحظية', 'ملاحظات داخلية خاصة', 'ملكية واحدة واضحة'],
      kind: 'inbox',
    },
    {
      icon: 'route',
      eyebrow: 'توجيه ذكي',
      title: 'كل شات يوصل للوكيل الأقرب إنه يقفله',
      desc: 'المحرك بيقرا الموضوع واللغة والمشاعر وحالة الـ VIP، وبعدين يوجّه حسب الأداء اللحظي والحِمل — مش بس للي فاضي.',
      points: ['واعي بالنية والمشاعر', 'تقييم مبني على الأداء', 'تبديل دائري احتياطي'],
      kind: 'route',
    },
    {
      icon: 'sparkles',
      eyebrow: 'ردود بالـ AI',
      title: 'مسودّات رد موثّقة جاهزة في حوالي ثانية',
      desc: '‏1–3 اقتراحات لكل رسالة بالعربي أو الإنجليزي، مبنية على تاريخ العميل. فريقك هو المتحكّم — مفيش حاجة بتتبعت أوتوماتيك.',
      points: ['صياغة عربي-أولًا', 'مبنية على تاريخ حقيقي', 'الإنسان دايمًا بيوافق'],
      kind: 'ai',
    },
    {
      icon: 'layers',
      eyebrow: 'تسليم بالمراحل',
      title: 'انقل العميل بين الفِرق من غير ما تضيّع السياق',
      desc: 'المجموعات والمراحل بتخلّي المحادثة تنتقل من المبيعات للعمليات للنجاح. وملخّص AI بضغطة بيسافر معاها في كل تسليم.',
      points: ['مراحل لكل فريق', 'ملخّص AI عند التسليم', 'سجل تدقيق كامل'],
      kind: 'handoff',
    },
  ],

  pipeline: {
    eyebrow: 'الفرق في الذكاء الاصطناعي',
    title: 'ثلاثة أنظمة ذكاء تشتغل بالتوازي',
    subtitle:
      'مع كل رسالة واردة، WaslX بتشغّل التوجيه واسترجاع الذاكرة جنب بعض، وبعدين تكتب الرد — كل ده في أقل من ثانيتين.',
    steps: [
      { icon: 'route', title: 'محرك التوجيه', desc: 'بيقرا النية والمشاعر والأولوية، وبعدين يختار الوكيل أو الفريق الأنسب.' },
      { icon: 'cpu', title: 'ذاكرة RAG', desc: 'بيسترجع تاريخ العميل وقاعدة المعرفة لسياق مبني على حقائق.' },
      { icon: 'sparkles', title: 'محرك الرد', desc: 'بيكتب 1–3 اقتراحات بالعربي أو الإنجليزي عشان الوكيل يبعتها.' },
    ],
    badge: 'أقل من ثانيتين من البداية للنهاية',
  },

  integrationsTitle: 'مبنية على بنية تحتية إنت واثق فيها',
  integrationsSubtitle:
    'الـ WhatsApp Business Cloud API الرسمي، وأمان بمستوى المؤسسات، ونماذج الـ AI اللي الفرق بتعتمد عليها — من غير أي وصلات غير رسمية.',
  integrations: [
    { icon: 'message', label: 'WhatsApp Business Cloud API' },
    { icon: 'shield', label: 'تشفير بمستوى المؤسسات' },
    { icon: 'sparkles', label: 'GPT-4.1 للرد والتوجيه' },
    { icon: 'cpu', label: 'ذاكرة بحث متجهي' },
    { icon: 'bell', label: 'فوري عبر SignalR' },
    { icon: 'lock', label: 'تحكّم بالوصول حسب الدور' },
  ],

  howEyebrow: 'ابدأ بسرعة',
  howTitle: 'من رقم لصندوق ذكي في ٣ خطوات',
  howSubtitle: 'مش مشروع برمجي. اربط مرة واحدة وفريقك يشتغل.',
  how: [
    { icon: 'link', title: 'اربط', desc: 'اربط رقم واتساب بيزنس عبر الـ Cloud API الرسمي في دقائق.' },
    { icon: 'users', title: 'تعاون', desc: 'اعزم فريقك، حدّد الأدوار والمجموعات، وسيب الـ AI يوجّه كل محادثة.' },
    { icon: 'trending-up', title: 'توسّع', desc: 'اتعامل مع آلاف المحادثات يوميًا بالتوجيه والذاكرة والتحليلات.' },
  ],

  showcaseEyebrow: 'مصمّمة بعناية',
  showcaseTitle: 'متبنية على طريقة شغل الدعم والمبيعات فعليًا',
  showcase: [
    {
      eyebrow: 'تسليم بين الفِرق',
      title: 'انقل العميل من المبيعات للعمليات من غير ما تضيّع السياق',
      desc: 'الفِرق والمجموعات والمراحل بتخلّي المحادثة تتحرك عبر مؤسستك. وملخّص AI بضغطة واحدة بيسافر معاها في كل تسليم.',
      points: ['مراحل لكل فريق', 'ملخّص AI عند التسليم', 'سجل تدقيق كامل'],
      icon: 'layers',
    },
    {
      eyebrow: 'توجيه واعٍ بالأداء',
      title: 'ابعت كل شات للوكيل الأقرب إنه يقفله',
      desc: 'المحرك بيقيّم الوكلاء حسب الضغط الحالي ونسبة الحل وزمن الرد — وبعدين بيوجّه للي فعلًا يقدر يكسب المحادثة، مش بس للي فاضي.',
      points: ['تقييم لحظي للوكلاء', 'تبديل دائري احتياطي', 'إعادة تعيين بضغطة'],
      icon: 'route',
    },
    {
      eyebrow: 'ذاكرة العميل (RAG)',
      title: 'كل رد بيفتكر العلاقة كلها',
      desc: 'طبقة ذاكرة متجهية بتسترجع الطلبات والتذاكر والتفضيلات السابقة، فتفضل الردود متسقة حتى لو وكيل جديد خالص مسك المحادثة.',
      points: ['استرجاع متجهي لكل عميل', 'ردود موثّقة وعلى هوية علامتك', 'من غير أسئلة متكررة'],
      icon: 'cpu',
    },
    {
      eyebrow: 'صندوق وارد مشترك',
      title: 'صندوق واحد الفريق كله يقدر يشتغل منه فعلًا',
      desc: 'تحديثات لحظية وملاحظات داخلية وملكية واضحة معناها إن وكيلين عمرهم ما يردّوا على نفس العميل — ومفيش حاجة بتقع من بين الشقوق.',
      points: ['لحظي عبر SignalR', 'ملاحظات داخلية خاصة', 'ملكية واحدة واضحة'],
      icon: 'inbox',
    },
  ],

  testimonialsEyebrow: 'الفرق بتحبّها',
  testimonialsTitle: 'دعم أخيرًا حاسس إنه متحكّم',
  testimonials: [
    { quote: 'التوجيه لوحده قلّل زمن أول رد للنص. الوكيل الصح بياخد الشات الصح قبل ما حد يقراه أصلًا.', name: 'نور ع.', role: 'مسؤولة الدعم، تجزئة', initials: 'نع' },
    { quote: 'اقتراحات الرد بالعربي مذهلة. فريقنا بيرد في ثواني ولسه بيبان طبيعي.', name: 'كريم ح.', role: 'مسؤول العمليات، لوجستيات', initials: 'كح' },
    { quote: 'سلّمنا من المبيعات للأونبوردنج من غير ما نفقد ولا محادثة. ملخّص الـ AI نقلة.', name: 'سلمى ر.', role: 'مؤسِّسة، علامة D2C', initials: 'سر' },
    { quote: 'رقم واتساب واحد، تلات فرق، وصفر فوضى — ومفيش حاجة بتقع حتى مع 2,000 محادثة في اليوم.', name: 'يوسف ت.', role: 'مدير عمليات العملاء، فينتك', initials: 'يت' },
  ],

  ctaEyebrow: 'جاهزين لما تكون جاهز',
  ctaTitle: 'حوّل واتساب لأقوى قناة عمليات عندك',
  ctaSubtitle:
    'شوفها مباشرة على رقمك إنت. احجز عرض، اتفرّج على التوجيه الذكي، وشوف التسليم بيحصل لحظة بلحظة.',
  ctaPrimary: 'احجز عرض',
  ctaSecondary: 'تسجيل الدخول',
  ctaNote: 'عربي أولًا · جاهز في دقائق · العنصر البشري دايمًا متحكّم',

  footer: {
    tagline: 'صندوق واتساب الذكي للفِرق في المنطقة.',
    columns: [
      { title: 'المنتج', links: [ { label: 'الأسعار', path: '/pricing' }, { label: 'خط الـ AI', path: '/#pipeline' }, { label: 'بيشتغل إزاي', path: '/#how' } ] },
      { title: 'الشركة', links: [ { label: 'من نحن', path: '/about' }, { label: 'تواصل', path: '/contact' } ] },
      { title: 'ابدأ', links: [ { label: 'تسجيل الدخول', path: '/login' }, { label: 'احجز عرض', path: '/contact' } ] },
    ],
    copyright: '© 2026 WaslX. كل الحقوق محفوظة.',
    legal: [ { label: 'الخصوصية', path: '/' }, { label: 'الشروط', path: '/' } ],
  },

  pricingPage: {
    badge: 'الأسعار',
    title: 'أسعار بتكبر مع فريقك، مش ضدّه',
    subtitle: 'خطط واضحة بتكبر مع فريقك. كل خطة فيها الصندوق المشترك وتكامل واتساب الرسمي.',
    monthly: 'شهري',
    yearly: 'سنوي',
    yearlyNote: 'وفّر شهرين',
    perMonth: '/شهر',
    mostPopular: 'الأكثر شيوعاً',
    plans: [
      { id: 'starter', icon: 'zap', name: 'Starter', tagline: 'للفرق الصغيرة اللي بتترتّب على واتساب.', priceMonthly: 29, priceYearly: 24, priceCustom: null, cta: 'ابدأ الآن', popular: false, features: ['حتى ٣ وكلاء', 'رقم واتساب واحد', 'صندوق وارد مشترك', 'توجيه يدوي ودوري', 'وسوم وفلاتر', 'تقارير أساسية'] },
      { id: 'growth', icon: 'sparkles', name: 'Growth', tagline: 'خط الـ AI الكامل للفرق اللي بتتوسّع.', priceMonthly: 99, priceYearly: 82, priceCustom: null, cta: 'ابدأ الآن', popular: true, features: ['حتى ١٥ وكيل', 'رقمين واتساب', 'توجيه AI + ذاكرة RAG', 'اقتراحات رد بالـ AI', 'حملات وبرودكاست', 'تحليلات متقدمة', 'مجموعات وتسليم بالمراحل'] },
      { id: 'enterprise', icon: 'shield', name: 'Enterprise', tagline: 'تحكّم وتوسّع ودعم متقدّم.', priceMonthly: 299, priceYearly: 249, priceCustom: null, cta: 'ابدأ التجربة المجانية', popular: false, features: ['وكلاء بلا حدود', 'أرقام واتساب متعددة', 'حدود AI مخصّصة', 'SSO و RBAC متقدّم', 'دعم أولوية و SLA', 'أونبوردنج مخصّص'] },
    ],
    comparisonTitle: 'قارن كل الخطط',
    comparisonPlans: ['Starter', 'Growth', 'Enterprise'],
    comparison: [
      { feature: 'الوكلاء', cells: ['٣', '١٥', 'بلا حدود'] },
      { feature: 'أرقام واتساب', cells: ['١', '٢', 'متعددة'] },
      { feature: 'صندوق وارد مشترك', cells: ['yes', 'yes', 'yes'] },
      { feature: 'توجيه ذكي بالـ AI', cells: ['no', 'yes', 'yes'] },
      { feature: 'اقتراحات رد بالـ AI', cells: ['no', 'yes', 'yes'] },
      { feature: 'ذاكرة RAG', cells: ['no', 'yes', 'yes'] },
      { feature: 'حملات وبرودكاست', cells: ['no', 'yes', 'yes'] },
      { feature: 'تحليلات متقدمة', cells: ['no', 'yes', 'yes'] },
      { feature: 'SSO و RBAC متقدّم', cells: ['no', 'no', 'yes'] },
      { feature: 'دعم أولوية و SLA', cells: ['no', 'no', 'yes'] },
    ],
    assuranceTitle: 'كل خطة فيها الأساسيات',
    assurance: [
      { icon: 'link', title: 'واتساب الرسمي', desc: 'اربط رقمك عبر الـ Cloud API من ميتا — الرقم والبيانات ملكك إنت.' },
      { icon: 'headset', title: 'أونبوردنج ببني آدم', desc: 'حد حقيقي بيمشّي فريقك في الإعداد. مفيش «دبّر نفسك».' },
      { icon: 'shield', title: 'من غير التزام', desc: 'طوّر أو نزّل أو امشي في أي وقت. تاريخ محادثاتك دايمًا تقدر تصدّره.' },
    ],
    faqTitle: 'أسئلة، وإجاباتها',
    faqs: [
      { q: 'محتاج حساب WhatsApp Business API؟', a: 'أيوة — WaslX بتتصل عبر الـ WhatsApp Business Cloud API الرسمي. وإحنا بنساعدك تربط رقمك في دقائق.' },
      { q: 'هل الـ AI بيبعت رسائل من نفسه؟', a: 'أبدًا. الـ AI بيكتب اقتراحات ويوجّه المحادثات، بس الوكيل البشري دايمًا هو اللي بيبعت الرد النهائي.' },
      { q: 'بيفهم عربي فعلًا؟', a: 'WaslX مبنية عربي-أولًا، بما فيها اللهجة المصرية والخليجية، بواجهة RTL كاملة وردود ثنائية اللغة.' },
      { q: 'أقدر أغيّر الخطة بعدين؟', a: 'أيوة، تقدر تطوّر أو تنزّل في أي وقت. التغييرات بتطبّق في دورة الفوترة الجاية.' },
    ],
  },

  aboutPage: {
    badge: 'حكايتنا',
    title: 'واتساب يستاهل طبقة عمليات حقيقية',
    subtitle:
      'سؤال بيكرّره كل فريق بيكبر: مين المفروض يرد على العميل ده؟ فبنينا الإجابة.',
    missionTitle: 'مهمّتنا',
    mission:
      'ندّي الشركات الصغيرة والمتوسطة في المنطقة طريقة عربية-أولًا ومدعومة بالـ AI لإدارة عمليات العملاء على واتساب — توجيه واعٍ بالأداء، تعاون حقيقي للفريق، وبساطة بتشتغل.',
    valuesTitle: 'قيمنا',
    values: [
      { icon: 'route', title: 'واعٍ بالأداء', desc: 'التوجيه مش عشوائي. الوكيل الأنسب بياخد المحادثة، في كل مرة.' },
      { icon: 'languages', title: 'عربي-أولًا', desc: 'مبني على طريقة كلام فرق المنطقة — لهجات و RTL وثنائية اللغة افتراضيًا.' },
      { icon: 'zap', title: 'بساطة الـ SMB', desc: 'قوة المؤسسات من غير إعداد المؤسسات. جاهز في دقائق، مش شهور.' },
      { icon: 'shield', title: 'ثقة بالتصميم', desc: 'عزل المستأجرين و RBAC وسجلات التدقيق مدمجة — مش ملزوقة.' },
    ],
    approachTitle: 'إيه اللي بيخلّي WaslX مختلفة',
    approachSubtitle: 'أغلب الصناديق بتوريك كل الشاتات وبس. WaslX بتقرّر يحصل إيه بعد كده — وبتثبتلك.',
    approach: [
      { icon: 'route', title: 'توجيه بيقرا الموقف', desc: 'الموضوع واللغة والمشاعر وحالة الـ VIP بتتقيّم مع كل رسالة — فالوكيل الصح بياخد الشات قبل ما حد يفتحه أصلًا.' },
      { icon: 'cpu', title: 'ذاكرة، مش نسيان', desc: 'الـ RAG بيدّي كل عميل سياق طويل المدى. خلاص مفيش إعادة شرح — الـ AI بيرد بتاريخ العلاقة الحقيقي.' },
      { icon: 'languages', title: 'العربي لغة أولى', desc: 'توجيه واعي باللهجة، وواجهة RTL أصلية، وردود ثنائية اللغة — مش سوفتوير إنجليزي مركّبين عليه عربي.' },
      { icon: 'shield', title: 'ثقة تقدر تدقّقها', desc: 'عزل صارم لكل عميل، وتحكّم بالوصول حسب الدور على كل طلب، وسجل تدقيق ثابت لكل حاجة بتحصل.' },
    ],
    impactTitle: 'ليه ده مهم لفرق المنطقة',
    impact: [
      { value: 2, decimals: 0, prefix: '', suffix: ' مليار+', label: 'شخص بيستخدم واتساب حول العالم' },
      { value: 175, decimals: 0, prefix: '', suffix: ' مليون+', label: 'رسالة يوميًا للشركات' },
      { value: 1, decimals: 0, prefix: '#', suffix: '', label: 'القناة اللي عملاء المنطقة فعلًا بيستخدموها' },
    ],
  },

  contactPage: {
    badge: 'تواصل',
    title: 'يلا نتكلم',
    subtitle:
      'قولنا محتاج إيه، وبني آدم حقيقي هيرد خلال يوم عمل واحد.',
    formName: 'الاسم بالكامل',
    formEmail: 'إيميل العمل',
    formCompany: 'الشركة',
    formMessage: 'نقدر نساعدك بإيه؟',
    formSubmit: 'ابعت الرسالة',
    formSuccess: 'شكرًا! هنرجعلك قريب.',
    infoTitle: 'طرق تانية للتواصل',
    email: 'hello@waslx.com',
    phone: '+20 100 000 0000',
    location: 'القاهرة، مصر · عن بُعد',
    responseNote: 'متوسط زمن الرد: أقل من ٢٤ ساعة.',
    promiseTitle: 'بيحصل إيه بعد ما تتواصل',
    promise: [
      { icon: 'clock', title: 'بنرد خلال يوم عمل واحد', desc: 'بني آدم حقيقي، مش رد آلي — وغالبًا أسرع من كده بكتير.' },
      { icon: 'chart', title: 'عرض مباشر مفصّل ليك', desc: 'بنطبّق WaslX على طريقة شغل فريقك الحالية على واتساب.' },
      { icon: 'zap', title: 'هتشتغل في دقائق', desc: 'اربط رقمك وابدأ التوجيه — من غير مشروع برمجي.' },
    ],
  },
};

export const LANDING_CONTENT: Record<AppLanguage, LandingContent> = { en, ar };
