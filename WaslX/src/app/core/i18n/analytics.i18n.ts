import type { AppLanguage } from './language.types';

// ─── Analytics page translations ─────────────────────────────────────────────

export type AnalyticsKey =
  | 'analyticsOverview'
  | 'performanceMetrics'
  // Preview / empty state
  | 'analyticsEyebrow'
  | 'analyticsEmptyTitle'
  | 'analyticsEmptyDesc'
  | 'analyticsExploreCta'
  | 'analyticsKpiConversations'
  | 'analyticsKpiResponse'
  | 'analyticsKpiResolution'
  | 'analyticsKpiCsat'
  | 'analyticsPreviewNote'
  | 'analyticsChartTitle'
  | 'analyticsChartCaption';

export const analyticsTranslations: Record<AppLanguage, Record<AnalyticsKey, string>> = {
  en: {
    analyticsOverview: 'Analytics Overview',
    performanceMetrics: 'Performance Metrics',
    analyticsEyebrow: 'Reports & insights',
    analyticsEmptyTitle: 'Insights light up as conversations flow',
    analyticsEmptyDesc:
      'Once WhatsApp is connected, this space fills with response times, resolution rates, agent performance, and AI routing accuracy — updated in real time.',
    analyticsExploreCta: 'Connect WhatsApp',
    analyticsKpiConversations: 'Conversations',
    analyticsKpiResponse: 'Avg. response',
    analyticsKpiResolution: 'Resolution rate',
    analyticsKpiCsat: 'CSAT',
    analyticsPreviewNote: 'Sample preview',
    analyticsChartTitle: 'Conversation volume',
    analyticsChartCaption: 'Last 7 days',
  },
  ar: {
    analyticsOverview: 'نظرة عامة على التحليلات',
    performanceMetrics: 'مقاييس الأداء',
    analyticsEyebrow: 'التقارير والرؤى',
    analyticsEmptyTitle: 'تتوهج الرؤى مع تدفق المحادثات',
    analyticsEmptyDesc:
      'بمجرد ربط واتساب، تمتلئ هذه المساحة بأوقات الاستجابة ومعدلات الحل وأداء الوكلاء ودقة التوجيه الذكي — محدّثة لحظياً.',
    analyticsExploreCta: 'ربط واتساب',
    analyticsKpiConversations: 'المحادثات',
    analyticsKpiResponse: 'متوسط الاستجابة',
    analyticsKpiResolution: 'معدل الحل',
    analyticsKpiCsat: 'رضا العملاء',
    analyticsPreviewNote: 'معاينة تجريبية',
    analyticsChartTitle: 'حجم المحادثات',
    analyticsChartCaption: 'آخر 7 أيام',
  },
};
