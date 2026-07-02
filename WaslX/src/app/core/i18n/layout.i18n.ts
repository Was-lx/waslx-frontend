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
  | 'users'
  | 'usersDesc'
  | 'teams'
  | 'teamsDesc'
  | 'analytics'
  | 'analyticsDesc'
  | 'settings'
  | 'settingsDesc'
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
    users: 'Users',
    usersDesc: 'User management',
    teams: 'Teams',
    teamsDesc: 'Team structure',
    analytics: 'Analytics',
    analyticsDesc: 'Reports & insights',
    settings: 'Settings',
    settingsDesc: 'Workspace config',
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
    users: 'المستخدمون',
    usersDesc: 'إدارة المستخدمين',
    teams: 'الفرق',
    teamsDesc: 'هيكل الفريق',
    analytics: 'التحليلات',
    analyticsDesc: 'التقارير والرؤى',
    settings: 'الإعدادات',
    settingsDesc: 'إعدادات المساحة',
    // Roles
    roleSuperAdmin: 'سوبر أدمن',
    roleAdmin: 'مدير النظام',
    roleManager: 'مدير',
    roleAgent: 'وكيل',
    roleViewer: 'مشاهد',
  },
};
