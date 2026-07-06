import type { AppLanguage } from './language.types';

// ─── Teams page translations ──────────────────────────────────────────────────

export type TeamsKey =
  | 'teamManagement'
  | 'createTeam'
  // Empty / preview state
  | 'teamsEyebrow'
  | 'teamsEmptyTitle'
  | 'teamsEmptyDesc'
  | 'teamsFeatStages'
  | 'teamsFeatStagesDesc'
  | 'teamsFeatHandoff'
  | 'teamsFeatHandoffDesc'
  | 'teamsFeatRouting'
  | 'teamsFeatRoutingDesc'
  | 'teamsFlowSales'
  | 'teamsFlowSupport'
  | 'teamsFlowBilling';

export const teamsTranslations: Record<AppLanguage, Record<TeamsKey, string>> = {
  en: {
    teamManagement: 'Team Management',
    createTeam: 'Create Team',
    teamsEyebrow: 'Team structure',
    teamsEmptyTitle: 'Build the teams behind every reply',
    teamsEmptyDesc:
      'Organize agents into teams with stages, then hand conversations off cleanly — from Sales to Support to Billing — without a customer ever repeating themselves.',
    teamsFeatStages: 'Custom stages',
    teamsFeatStagesDesc: 'Model your real workflow',
    teamsFeatHandoff: 'Clean handoff',
    teamsFeatHandoffDesc: 'Context follows the chat',
    teamsFeatRouting: 'Smart routing',
    teamsFeatRoutingDesc: 'Right agent, every time',
    teamsFlowSales: 'Sales',
    teamsFlowSupport: 'Support',
    teamsFlowBilling: 'Billing',
  },
  ar: {
    teamManagement: 'إدارة الفرق',
    createTeam: 'إنشاء فريق',
    teamsEyebrow: 'هيكل الفريق',
    teamsEmptyTitle: 'ابنِ الفرق التي تقف خلف كل رد',
    teamsEmptyDesc:
      'نظّم الوكلاء في فرق ذات مراحل، ثم سلّم المحادثات بسلاسة — من المبيعات إلى الدعم إلى الفوترة — دون أن يعيد العميل كلامه أبداً.',
    teamsFeatStages: 'مراحل مخصصة',
    teamsFeatStagesDesc: 'اعكس سير عملك الحقيقي',
    teamsFeatHandoff: 'تسليم سلس',
    teamsFeatHandoffDesc: 'السياق يتبع المحادثة',
    teamsFeatRouting: 'توجيه ذكي',
    teamsFeatRoutingDesc: 'الوكيل المناسب في كل مرة',
    teamsFlowSales: 'المبيعات',
    teamsFlowSupport: 'الدعم',
    teamsFlowBilling: 'الفوترة',
  },
};
