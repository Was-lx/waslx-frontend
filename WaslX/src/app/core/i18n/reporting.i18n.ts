import type { AppLanguage } from './language.types';

// ─── Reporting & Analytics translations (FR-RPT) ─────────────────────────────

export type ReportingKey =
  // ── Header / shell ──
  | 'rptEyebrow'
  | 'rptTitle'
  | 'rptLead'
  | 'rptScopePersonal'
  | 'rptScopeOrg'
  // date range control
  | 'rptRangeToday'
  | 'rptRange7d'
  | 'rptRange30d'
  | 'rptRangeCustom'
  | 'rptRangeFrom'
  | 'rptRangeTo'
  | 'rptRangeApply'
  | 'rptRangeLabel'
  // team filter
  | 'rptTeamLabel'
  | 'rptTeamAll'
  // export
  | 'rptExport'
  | 'rptExportCsv'
  | 'rptExportPdf'
  | 'rptExporting'
  | 'rptExportedToast'
  | 'rptExportFailToast'
  // page states
  | 'rptLoading'
  | 'rptErrorTitle'
  | 'rptErrorBody'
  | 'rptRetry'
  | 'rptEmptyTitle'
  | 'rptEmptyBody'
  | 'rptResetRange'
  | 'rptChartNoData'
  | 'rptVsPrev'
  // ── KPI band ──
  | 'rptKpiVolume'
  | 'rptKpiFirstResponse'
  | 'rptKpiResolution'
  | 'rptKpiAiShare'
  | 'rptKpiCsat'
  | 'rptKpiActive'
  | 'rptUnitConversations'
  // ── Volume tile ──
  | 'rptVolumeTitle'
  | 'rptVolumeSub'
  | 'rptVolumeInbound'
  | 'rptVolumeOutbound'
  // ── Agent performance tile ──
  | 'rptAgentsTitle'
  | 'rptAgentsSub'
  | 'rptColAgent'
  | 'rptColHandled'
  | 'rptColAvgResponse'
  | 'rptColResolution'
  | 'rptColActive'
  | 'rptColTrend'
  | 'rptAgentsEmpty'
  // ── Response & resolution tile ──
  | 'rptResponseTitle'
  | 'rptResponseSub'
  | 'rptRespFirst'
  | 'rptRespResolution'
  | 'rptRespDistribution'
  | 'rptSlaLabel'
  // ── Routing tile ──
  | 'rptRoutingTitle'
  | 'rptRoutingSub'
  | 'rptRouteManual'
  | 'rptRouteRoundRobin'
  | 'rptRouteAi';

export const reportingTranslations: Record<AppLanguage, Record<ReportingKey, string>> = {
  en: {
    rptEyebrow: 'Insights',
    rptTitle: 'Reporting & Analytics',
    rptLead: 'How the team is performing — volume, response times, routing and who is carrying the load.',
    rptScopePersonal: 'Your activity',
    rptScopeOrg: 'Workspace-wide',
    rptRangeToday: 'Today',
    rptRange7d: '7 days',
    rptRange30d: '30 days',
    rptRangeCustom: 'Custom',
    rptRangeFrom: 'From',
    rptRangeTo: 'To',
    rptRangeApply: 'Apply',
    rptRangeLabel: 'Date range',
    rptTeamLabel: 'Team',
    rptTeamAll: 'All teams',
    rptExport: 'Export',
    rptExportCsv: 'Download CSV',
    rptExportPdf: 'Download PDF',
    rptExporting: 'Preparing…',
    rptExportedToast: 'Export ready',
    rptExportFailToast: 'Export failed',
    rptLoading: 'Loading reports…',
    rptErrorTitle: 'Could not load reports',
    rptErrorBody: 'Something interrupted the request. Try again in a moment.',
    rptRetry: 'Try again',
    rptEmptyTitle: 'No data in this range',
    rptEmptyBody: 'There is no activity for the selected dates. Widen the range to see more.',
    rptResetRange: 'Reset to last 30 days',
    rptChartNoData: 'No data yet',
    rptVsPrev: 'vs previous period',
    rptKpiVolume: 'Conversations',
    rptKpiFirstResponse: 'First response',
    rptKpiResolution: 'Resolution time',
    rptKpiAiShare: 'AI-handled share',
    rptKpiCsat: 'CSAT',
    rptKpiActive: 'Active now',
    rptUnitConversations: 'conversations',
    rptVolumeTitle: 'Conversation volume',
    rptVolumeSub: 'Inbound and outbound over time',
    rptVolumeInbound: 'Inbound',
    rptVolumeOutbound: 'Outbound',
    rptAgentsTitle: 'Agent performance',
    rptAgentsSub: 'Who handles what, and how fast',
    rptColAgent: 'Agent',
    rptColHandled: 'Handled',
    rptColAvgResponse: 'Avg response',
    rptColResolution: 'Resolution',
    rptColActive: 'Active',
    rptColTrend: 'Trend',
    rptAgentsEmpty: 'No agent activity in this range.',
    rptResponseTitle: 'Response & resolution',
    rptResponseSub: 'First-response and resolution times',
    rptRespFirst: 'First response',
    rptRespResolution: 'Resolution',
    rptRespDistribution: 'Response-time distribution',
    rptSlaLabel: 'Within SLA',
    rptRoutingTitle: 'Assignment split',
    rptRoutingSub: 'How conversations were routed',
    rptRouteManual: 'Manual',
    rptRouteRoundRobin: 'Round robin',
    rptRouteAi: 'AI routing',
  },
  ar: {
    rptEyebrow: 'رؤى',
    rptTitle: 'التقارير والتحليلات',
    rptLead: 'كيف يؤدي الفريق — الحجم، أوقات الاستجابة، التوجيه، ومن يحمل العبء.',
    rptScopePersonal: 'نشاطك',
    rptScopeOrg: 'على مستوى المساحة',
    rptRangeToday: 'اليوم',
    rptRange7d: '٧ أيام',
    rptRange30d: '٣٠ يوماً',
    rptRangeCustom: 'مخصص',
    rptRangeFrom: 'من',
    rptRangeTo: 'إلى',
    rptRangeApply: 'تطبيق',
    rptRangeLabel: 'النطاق الزمني',
    rptTeamLabel: 'الفريق',
    rptTeamAll: 'كل الفرق',
    rptExport: 'تصدير',
    rptExportCsv: 'تنزيل CSV',
    rptExportPdf: 'تنزيل PDF',
    rptExporting: 'جارٍ التجهيز…',
    rptExportedToast: 'التصدير جاهز',
    rptExportFailToast: 'فشل التصدير',
    rptLoading: 'جارٍ تحميل التقارير…',
    rptErrorTitle: 'تعذّر تحميل التقارير',
    rptErrorBody: 'حدث ما قطع الطلب. أعد المحاولة بعد لحظة.',
    rptRetry: 'إعادة المحاولة',
    rptEmptyTitle: 'لا توجد بيانات في هذا النطاق',
    rptEmptyBody: 'لا يوجد نشاط للتواريخ المحددة. وسّع النطاق لرؤية المزيد.',
    rptResetRange: 'العودة لآخر ٣٠ يوماً',
    rptChartNoData: 'لا توجد بيانات بعد',
    rptVsPrev: 'مقارنةً بالفترة السابقة',
    rptKpiVolume: 'المحادثات',
    rptKpiFirstResponse: 'أول استجابة',
    rptKpiResolution: 'وقت الحل',
    rptKpiAiShare: 'نسبة الذكاء الاصطناعي',
    rptKpiCsat: 'رضا العملاء',
    rptKpiActive: 'نشطة الآن',
    rptUnitConversations: 'محادثة',
    rptVolumeTitle: 'حجم المحادثات',
    rptVolumeSub: 'الوارد والصادر عبر الزمن',
    rptVolumeInbound: 'وارد',
    rptVolumeOutbound: 'صادر',
    rptAgentsTitle: 'أداء الوكلاء',
    rptAgentsSub: 'من يتعامل مع ماذا، وبأي سرعة',
    rptColAgent: 'الوكيل',
    rptColHandled: 'المُعالَجة',
    rptColAvgResponse: 'متوسط الاستجابة',
    rptColResolution: 'الحل',
    rptColActive: 'نشطة',
    rptColTrend: 'الاتجاه',
    rptAgentsEmpty: 'لا يوجد نشاط للوكلاء في هذا النطاق.',
    rptResponseTitle: 'الاستجابة والحل',
    rptResponseSub: 'أوقات أول استجابة والحل',
    rptRespFirst: 'أول استجابة',
    rptRespResolution: 'الحل',
    rptRespDistribution: 'توزيع أوقات الاستجابة',
    rptSlaLabel: 'ضمن الاتفاقية',
    rptRoutingTitle: 'توزيع الإسناد',
    rptRoutingSub: 'كيف وُجّهت المحادثات',
    rptRouteManual: 'يدوي',
    rptRouteRoundRobin: 'التناوب',
    rptRouteAi: 'توجيه ذكي',
  },
};
