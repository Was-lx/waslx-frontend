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
  | 'aiSuggestions'
  // ── Cockpit elevation ──
  | 'dashboardLead'
  | 'liveOps'
  | 'systemHealthy'
  | 'lastSevenDays'
  | 'vsLastWeek'
  | 'quickActions'
  | 'openInbox'
  | 'assignChats'
  | 'inviteTeammate'
  | 'viewReports'
  | 'recentActivity'
  | 'viewAll'
  | 'conversationVolume'
  | 'aiRoutingPreview'
  | 'aiRoutingHint'
  | 'suggestedReply'
  | 'confidence'
  | 'waitingOnData'
  | 'waitingOnDataDesc'
  | 'noActivityYet'
  | 'noActivityDesc'
  | 'awaitingRouting'
  | 'awaitingRoutingDesc'
  | 'resolutionRate'
  | 'slaOnTime'
  | 'newToday';

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
    // ── Cockpit elevation ──
    dashboardLead: 'Here is what your WhatsApp operation looks like right now.',
    liveOps: 'Live operations',
    systemHealthy: 'All systems healthy',
    lastSevenDays: 'Last 7 days',
    vsLastWeek: 'vs last week',
    quickActions: 'Quick actions',
    openInbox: 'Open inbox',
    assignChats: 'Assign chats',
    inviteTeammate: 'Invite teammate',
    viewReports: 'View reports',
    recentActivity: 'Recent activity',
    viewAll: 'View all',
    conversationVolume: 'Conversation volume',
    aiRoutingPreview: 'AI routing preview',
    aiRoutingHint: 'Suggestions appear here as conversations arrive.',
    suggestedReply: 'Suggested reply',
    confidence: 'Confidence',
    waitingOnData: 'Waiting on your first conversations',
    waitingOnDataDesc: 'Connect WhatsApp and metrics will start flowing into this cockpit.',
    noActivityYet: 'No activity yet',
    noActivityDesc: 'Assignments, replies and handoffs will show up here in real time.',
    awaitingRouting: 'The routing engine is standing by',
    awaitingRoutingDesc: 'Once messages arrive, AI suggestions and reply drafts land here.',
    resolutionRate: 'Resolution rate',
    slaOnTime: 'SLA on-time',
    newToday: 'New today',
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
    // ── Cockpit elevation ──
    dashboardLead: 'إليك ما تبدو عليه عمليات واتساب لديك الآن.',
    liveOps: 'العمليات المباشرة',
    systemHealthy: 'جميع الأنظمة تعمل بكفاءة',
    lastSevenDays: 'آخر ٧ أيام',
    vsLastWeek: 'عن الأسبوع الماضي',
    quickActions: 'إجراءات سريعة',
    openInbox: 'فتح الوارد',
    assignChats: 'تعيين المحادثات',
    inviteTeammate: 'دعوة زميل',
    viewReports: 'عرض التقارير',
    recentActivity: 'النشاط الأخير',
    viewAll: 'عرض الكل',
    conversationVolume: 'حجم المحادثات',
    aiRoutingPreview: 'معاينة توجيه الذكاء الاصطناعي',
    aiRoutingHint: 'تظهر الاقتراحات هنا عند وصول المحادثات.',
    suggestedReply: 'رد مقترح',
    confidence: 'الثقة',
    waitingOnData: 'في انتظار محادثاتك الأولى',
    waitingOnDataDesc: 'اربط واتساب وستبدأ المقاييس بالتدفق إلى لوحة التحكم هذه.',
    noActivityYet: 'لا يوجد نشاط بعد',
    noActivityDesc: 'ستظهر التعيينات والردود والتحويلات هنا في الوقت الفعلي.',
    awaitingRouting: 'محرك التوجيه في وضع الاستعداد',
    awaitingRoutingDesc: 'بمجرد وصول الرسائل، تظهر اقتراحات الذكاء الاصطناعي ومسودات الردود هنا.',
    resolutionRate: 'معدل الحل',
    slaOnTime: 'الالتزام بمستوى الخدمة',
    newToday: 'جديد اليوم',
  },
};
