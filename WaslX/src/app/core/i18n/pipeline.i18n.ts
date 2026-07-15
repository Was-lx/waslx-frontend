import type { AppLanguage } from './language.types';

// ─── Pipeline board + cross-team routing / handoff translations ───────────────

export type PipelineKey =
  // ── Board page ──
  | 'pipEyebrow'
  | 'pipTitle'
  | 'pipLead'
  | 'pipGroupLabel'
  | 'pipGroupPlaceholder'
  | 'pipSelectPrompt'
  | 'pipLoading'
  | 'pipErrorTitle'
  | 'pipRetry'
  | 'pipEmptyTitle'
  | 'pipEmptyDesc'
  | 'pipNoGroups'
  | 'pipNoGroupsDesc'
  | 'pipHint'
  | 'pipRefresh'
  | 'pipManageStages'
  | 'pipUnstaged'
  | 'pipColCount'
  | 'pipColEmpty'
  | 'pipMoveBack'
  | 'pipMoveForward'
  | 'pipUnassigned'
  | 'pipMovedToast'
  | 'pipMoveError'
  // ── Route / handoff (context panel) ──
  | 'ctxTeamTitle'
  | 'ctxCurrentGroup'
  | 'ctxNoGroup'
  | 'ctxRouteLabel'
  | 'ctxRouteSelect'
  | 'ctxRouteBtn'
  | 'ctxRouting'
  | 'ctxHandoffLabel'
  | 'ctxHandoffHint'
  | 'ctxHandoffSelect'
  | 'ctxHandoffBtn'
  | 'ctxHandoffTitle'
  | 'ctxHandoffBody'
  | 'ctxHandoffHistoryNote'
  | 'ctxHandoffConfirm'
  | 'ctxHandoffCancel'
  | 'ctxRoutedToast'
  | 'ctxRouteError'
  | 'ctxHandoffToast'
  | 'ctxHandoffError';

export const pipelineTranslations: Record<AppLanguage, Record<PipelineKey, string>> = {
  en: {
    pipEyebrow: 'Conversation pipeline',
    pipTitle: 'Pipeline board',
    pipLead:
      'Track every conversation as it moves through a team’s stages. Pick a team, then advance cards along its pipeline.',
    pipGroupLabel: 'Team',
    pipGroupPlaceholder: 'Select a team…',
    pipSelectPrompt: 'Choose a team to open its stage board.',
    pipLoading: 'Loading board…',
    pipErrorTitle: 'Could not load the board',
    pipRetry: 'Try again',
    pipEmptyTitle: 'No stages configured',
    pipEmptyDesc: 'This team has no stages yet. Define its pipeline in Teams to start moving conversations.',
    pipNoGroups: 'No teams yet',
    pipNoGroupsDesc: 'Create a team with stages first, then track its conversations here.',
    pipHint: 'Drag a card into any stage — or use the arrows to move it step by step.',
    pipRefresh: 'Refresh',
    pipManageStages: 'Manage stages',
    pipUnstaged: 'Unstaged',
    pipColCount: 'in stage',
    pipColEmpty: 'No conversations',
    pipMoveBack: 'Move to previous stage',
    pipMoveForward: 'Move to next stage',
    pipUnassigned: 'Unassigned',
    pipMovedToast: 'Conversation moved',
    pipMoveError: 'Could not move the conversation',
    // Route / handoff
    ctxTeamTitle: 'Team & pipeline',
    ctxCurrentGroup: 'Current team',
    ctxNoGroup: 'Not routed to a team',
    ctxRouteLabel: 'Route to team',
    ctxRouteSelect: 'Select a team…',
    ctxRouteBtn: 'Route',
    ctxRouting: 'Routing…',
    ctxHandoffLabel: 'Hand off to another team',
    ctxHandoffHint: 'Transfers the conversation and clears its current assignee.',
    ctxHandoffSelect: 'Select target team…',
    ctxHandoffBtn: 'Hand off',
    ctxHandoffTitle: 'Hand off this conversation?',
    ctxHandoffBody: 'The conversation will be transferred to',
    ctxHandoffHistoryNote:
      'Its full message history, notes and timeline are preserved — nothing is lost in the handoff.',
    ctxHandoffConfirm: 'Confirm handoff',
    ctxHandoffCancel: 'Cancel',
    ctxRoutedToast: 'Conversation routed',
    ctxRouteError: 'Could not route the conversation',
    ctxHandoffToast: 'Conversation handed off',
    ctxHandoffError: 'Could not hand off the conversation',
  },
  ar: {
    pipEyebrow: 'مسار المحادثات',
    pipTitle: 'لوحة المسار',
    pipLead:
      'تابع كل محادثة وهي تنتقل عبر مراحل الفريق. اختر فريقاً، ثم حرّك البطاقات على طول مساره.',
    pipGroupLabel: 'الفريق',
    pipGroupPlaceholder: 'اختر فريقاً…',
    pipSelectPrompt: 'اختر فريقاً لفتح لوحة مراحله.',
    pipLoading: 'جارٍ تحميل اللوحة…',
    pipErrorTitle: 'تعذّر تحميل اللوحة',
    pipRetry: 'إعادة المحاولة',
    pipEmptyTitle: 'لا توجد مراحل مُعرَّفة',
    pipEmptyDesc: 'لا توجد مراحل لهذا الفريق بعد. عرّف مساره من صفحة الفرق لتبدأ تحريك المحادثات.',
    pipNoGroups: 'لا توجد فرق بعد',
    pipNoGroupsDesc: 'أنشئ فريقاً بمراحل أولاً، ثم تابع محادثاته هنا.',
    pipHint: 'اسحب البطاقة إلى أي مرحلة — أو استخدم الأسهم لنقلها خطوة بخطوة.',
    pipRefresh: 'تحديث',
    pipManageStages: 'إدارة المراحل',
    pipUnstaged: 'بدون مرحلة',
    pipColCount: 'في المرحلة',
    pipColEmpty: 'لا توجد محادثات',
    pipMoveBack: 'نقل إلى المرحلة السابقة',
    pipMoveForward: 'نقل إلى المرحلة التالية',
    pipUnassigned: 'غير مُسند',
    pipMovedToast: 'تم نقل المحادثة',
    pipMoveError: 'تعذّر نقل المحادثة',
    // Route / handoff
    ctxTeamTitle: 'الفريق والمسار',
    ctxCurrentGroup: 'الفريق الحالي',
    ctxNoGroup: 'غير موجّهة إلى فريق',
    ctxRouteLabel: 'التوجيه إلى فريق',
    ctxRouteSelect: 'اختر فريقاً…',
    ctxRouteBtn: 'توجيه',
    ctxRouting: 'جارٍ التوجيه…',
    ctxHandoffLabel: 'التسليم إلى فريق آخر',
    ctxHandoffHint: 'ينقل المحادثة ويلغي إسنادها الحالي.',
    ctxHandoffSelect: 'اختر الفريق المستهدف…',
    ctxHandoffBtn: 'تسليم',
    ctxHandoffTitle: 'تسليم هذه المحادثة؟',
    ctxHandoffBody: 'سيتم نقل المحادثة إلى',
    ctxHandoffHistoryNote:
      'يُحتفظ بكامل سجل الرسائل والملاحظات والخط الزمني — لا يُفقد أي شيء أثناء التسليم.',
    ctxHandoffConfirm: 'تأكيد التسليم',
    ctxHandoffCancel: 'إلغاء',
    ctxRoutedToast: 'تم توجيه المحادثة',
    ctxRouteError: 'تعذّر توجيه المحادثة',
    ctxHandoffToast: 'تم تسليم المحادثة',
    ctxHandoffError: 'تعذّر تسليم المحادثة',
  },
};
