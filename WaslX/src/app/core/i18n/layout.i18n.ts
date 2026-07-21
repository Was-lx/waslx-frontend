import type { AppLanguage } from './language.types';

// ─── Layout / Shell translations (navbar, sidebar, footer, roles) ────────────

export type LayoutKey =
  | 'brandSubtitle'
  | 'sidebarSubtitle'
  | 'searchPlaceholder'
  | 'openNotifications'
  | 'openProfileMenu'
  | 'toggleTheme'
  | 'toggleLanguage'
  | 'live'
  | 'channelOffline'
  | 'footerLabel'
  | 'collapseSidebar'
  | 'expandSidebar'
  | 'closeNavigation'
  | 'switchToArabic'
  | 'switchToEnglish'
  // Navigation items
  | 'main'
  | 'management'
  | 'system'
  | 'dashboard'
  | 'dashboardDesc'
  | 'inbox'
  | 'inboxDesc'
  | 'contacts'
  | 'contactsDesc'
  | 'whatsapp'
  | 'whatsappDesc'
  | 'users'
  | 'usersDesc'
  | 'teams'
  | 'teamsDesc'
  | 'pipeline'
  | 'pipelineDesc'
  | 'reports'
  | 'reportsDesc'
  | 'campaignsNav'
  | 'campaignsNavDesc'
  | 'auditNav'
  | 'auditNavDesc'
  | 'settings'
  | 'settingsDesc'
  | 'permissions'
  | 'permissionsDesc'
  | 'subscription'
  | 'subscriptionDesc'
  | 'platform'
  | 'platformConsole'
  | 'admins'
  | 'adminsDesc'
  | 'tenants'
  | 'tenantsDesc'
  | 'plans'
  | 'plansDesc'
  | 'billing'
  | 'billingDesc'
  | 'usage'
  | 'usageDesc'
  | 'aiCost'
  | 'aiCostDesc'
  | 'platformSettings'
  | 'platformSettingsDesc'
  // Role labels
  | 'roleSuperAdmin'
  | 'roleAdmin'
  | 'roleManager'
  | 'roleAgent'
  | 'roleViewer';

export const layoutTranslations: Record<AppLanguage, Record<LayoutKey, string>> = {
  en: {
    brandSubtitle: 'AI-Powered WhatsApp Inbox',
    sidebarSubtitle: 'Workspace',
    searchPlaceholder: 'Search workspace…',
    openNotifications: 'Open notifications',
    openProfileMenu: 'Open profile menu',
    toggleTheme: 'Toggle theme',
    toggleLanguage: 'Switch language',
    live: 'Live',
    channelOffline: 'Offline',
    footerLabel: '© 2026 WaslX. All rights reserved.',
    collapseSidebar: 'Collapse sidebar',
    expandSidebar: 'Expand sidebar',
    closeNavigation: 'Close navigation',
    switchToArabic: 'العربية',
    switchToEnglish: 'English',
    // Navigation
    main: 'Main',
    management: 'Management',
    system: 'System',
    dashboard: 'Dashboard',
    dashboardDesc: 'Overview & metrics',
    inbox: 'Inbox',
    inboxDesc: 'Conversations',
    contacts: 'Contacts',
    contactsDesc: 'Customer directory',
    whatsapp: 'WhatsApp',
    whatsappDesc: 'Connected numbers',
    users: 'Users',
    usersDesc: 'User management',
    teams: 'Teams',
    teamsDesc: 'Team structure',
    pipeline: 'Pipeline',
    pipelineDesc: 'Stage board',
    reports: 'Reporting & Analytics',
    reportsDesc: 'Dashboards & exports',
    campaignsNav: 'Campaigns',
    campaignsNavDesc: 'WhatsApp broadcasts',
    auditNav: 'Audit log',
    auditNavDesc: 'Append-only activity trail',
    settings: 'Settings',
    settingsDesc: 'Workspace config',
    permissions: 'Roles & permissions',
    permissionsDesc: 'Control what each role can do',
    subscription: 'Subscription',
    subscriptionDesc: 'Plan, billing & usage',
    platform: 'Platform',
    platformConsole: 'Platform console',
    admins: 'Admins',
    adminsDesc: 'Platform operators',
    tenants: 'Tenants',
    tenantsDesc: 'Workspaces & accounts',
    plans: 'Plans',
    plansDesc: 'Subscription plans',
    billing: 'Billing',
    billingDesc: 'Revenue & invoices',
    usage: 'Usage',
    usageDesc: 'Cross-tenant volume',
    aiCost: 'AI cost',
    aiCostDesc: 'Spend & budgets',
    platformSettings: 'Settings',
    platformSettingsDesc: 'Credentials, flags & policy',
    // Roles
    roleSuperAdmin: 'Super Admin',
    roleAdmin: 'Admin',
    roleManager: 'Manager',
    roleAgent: 'Agent',
    roleViewer: 'Viewer',
  },
  ar: {
    brandSubtitle: 'صندوق واتساب ذكي بالذكاء الاصطناعي',
    sidebarSubtitle: 'مساحة العمل',
    searchPlaceholder: 'ابحث في المساحة…',
    openNotifications: 'فتح الإشعارات',
    openProfileMenu: 'فتح الملف الشخصي',
    toggleTheme: 'تبديل المظهر',
    toggleLanguage: 'تغيير اللغة',
    live: 'مباشر',
    channelOffline: 'غير متصل',
    footerLabel: '© 2026 WaslX. جميع الحقوق محفوظة.',
    collapseSidebar: 'طي الشريط الجانبي',
    expandSidebar: 'توسيع الشريط الجانبي',
    closeNavigation: 'إغلاق التنقل',
    switchToArabic: 'العربية',
    switchToEnglish: 'English',
    // Navigation
    main: 'الرئيسية',
    management: 'الإدارة',
    system: 'النظام',
    dashboard: 'لوحة التحكم',
    dashboardDesc: 'نظرة عامة والمقاييس',
    inbox: 'البريد الوارد',
    inboxDesc: 'المحادثات',
    contacts: 'جهات الاتصال',
    contactsDesc: 'دليل العملاء',
    whatsapp: 'واتساب',
    whatsappDesc: 'الأرقام المتصلة',
    users: 'المستخدمون',
    usersDesc: 'إدارة المستخدمين',
    teams: 'الفرق',
    teamsDesc: 'هيكل الفريق',
    pipeline: 'المسار',
    pipelineDesc: 'لوحة المراحل',
    reports: 'التقارير والتحليلات',
    reportsDesc: 'اللوحات والتصدير',
    campaignsNav: 'الحملات',
    campaignsNavDesc: 'حملات واتساب',
    auditNav: 'سجل التدقيق',
    auditNavDesc: 'سجل نشاط للإضافة فقط',
    settings: 'الإعدادات',
    settingsDesc: 'إعدادات المساحة',
    permissions: 'الأدوار والصلاحيات',
    permissionsDesc: 'تحكّم في ما يفعله كل دور',
    subscription: 'الاشتراك',
    subscriptionDesc: 'الخطة والفوترة والاستخدام',
    platform: 'المنصة',
    platformConsole: 'لوحة المنصة',
    admins: 'المشرفون',
    adminsDesc: 'مشغّلو المنصة',
    tenants: 'المستأجرون',
    tenantsDesc: 'المساحات والحسابات',
    plans: 'الخطط',
    plansDesc: 'خطط الاشتراك',
    billing: 'الفوترة',
    billingDesc: 'الإيرادات والفواتير',
    usage: 'الاستخدام',
    usageDesc: 'الحجم عبر المستأجرين',
    aiCost: 'تكلفة الذكاء',
    aiCostDesc: 'الإنفاق والميزانيات',
    platformSettings: 'الإعدادات',
    platformSettingsDesc: 'المفاتيح والأعلام والسياسة',
    // Roles
    roleSuperAdmin: 'سوبر أدمن',
    roleAdmin: 'مدير النظام',
    roleManager: 'مدير',
    roleAgent: 'وكيل',
    roleViewer: 'مشاهد',
  },
};
