import type { AppLanguage } from './language.types';

// ─── Dashboard page translations ─────────────────────────────────────────────

export type DashboardKey =
  | 'dashboardWelcome'
  | 'totalConversations'
  | 'activeAgents'
  | 'avgResponseTime'
  | 'resolvedToday'
  | 'pendingAssignments'
  | 'myConversations'
  | 'teamPerformance'
  | 'aiSuggestions';

export const dashboardTranslations: Record<AppLanguage, Record<DashboardKey, string>> = {
  en: {
    dashboardWelcome: 'Welcome back',
    totalConversations: 'Total Conversations',
    activeAgents: 'Active Agents',
    avgResponseTime: 'Avg. Response Time',
    resolvedToday: 'Resolved Today',
    pendingAssignments: 'Pending Assignments',
    myConversations: 'My Conversations',
    teamPerformance: 'Team Performance',
    aiSuggestions: 'AI Suggestions',
  },
  ar: {
    dashboardWelcome: 'مرحبًا بعودتك',
    totalConversations: 'إجمالي المحادثات',
    activeAgents: 'الوكلاء النشطون',
    avgResponseTime: 'متوسط وقت الاستجابة',
    resolvedToday: 'تم الحل اليوم',
    pendingAssignments: 'التعيينات المعلقة',
    myConversations: 'محادثاتي',
    teamPerformance: 'أداء الفريق',
    aiSuggestions: 'اقتراحات الذكاء الاصطناعي',
  },
};
