import type { AppLanguage } from './language.types';

// ─── Analytics page translations ─────────────────────────────────────────────

export type AnalyticsKey = 'analyticsOverview' | 'performanceMetrics';

export const analyticsTranslations: Record<AppLanguage, Record<AnalyticsKey, string>> = {
  en: {
    analyticsOverview: 'Analytics Overview',
    performanceMetrics: 'Performance Metrics',
  },
  ar: {
    analyticsOverview: 'نظرة عامة على التحليلات',
    performanceMetrics: 'مقاييس الأداء',
  },
};
