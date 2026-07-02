import type { AppLanguage } from './language.types';

// ─── Teams page translations ──────────────────────────────────────────────────

export type TeamsKey = 'teamManagement' | 'createTeam';

export const teamsTranslations: Record<AppLanguage, Record<TeamsKey, string>> = {
  en: {
    teamManagement: 'Team Management',
    createTeam: 'Create Team',
  },
  ar: {
    teamManagement: 'إدارة الفرق',
    createTeam: 'إنشاء فريق',
  },
};
