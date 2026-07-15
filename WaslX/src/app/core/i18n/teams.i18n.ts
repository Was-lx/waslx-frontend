import type { AppLanguage } from './language.types';

// ─── Teams / Groups + Stages translations ────────────────────────────────────

export type TeamsKey =
  // ── Groups list ──
  | 'grpEyebrow'
  | 'grpTitle'
  | 'grpLead'
  | 'grpSearch'
  | 'grpNew'
  | 'grpCount'
  | 'grpLoading'
  | 'grpErrorTitle'
  | 'grpRetry'
  | 'grpEmptyTitle'
  | 'grpEmptyDesc'
  | 'grpEmptyCta'
  | 'grpNoResults'
  // badges
  | 'grpDefaultBadge'
  | 'grpDistributionBadge'
  | 'grpHandoffBadge'
  // card meta / actions
  | 'grpMembersLabel'
  | 'grpMemberLabel'
  | 'grpStagesLabel'
  | 'grpStageLabel'
  | 'grpNoStages'
  | 'grpPipeline'
  | 'grpMembersBtn'
  | 'grpEdit'
  | 'grpDelete'
  | 'grpDefaultLockedHint'
  // create / edit modal
  | 'grpCreateTitle'
  | 'grpCreateSub'
  | 'grpEditTitle'
  | 'grpEditSub'
  | 'grpName'
  | 'grpNamePlaceholder'
  | 'grpNameRequired'
  | 'grpDescription'
  | 'grpDescriptionPlaceholder'
  | 'grpDistributionToggle'
  | 'grpDistributionToggleHint'
  | 'grpCancel'
  | 'grpSave'
  | 'grpSaving'
  // delete confirm
  | 'grpDeleteTitle'
  | 'grpDeleteBody'
  | 'grpConfirmDelete'
  | 'grpInUseError'
  // members modal
  | 'grpMembersTitle'
  | 'grpMembersSub'
  | 'grpMembersLoading'
  | 'grpMembersSearch'
  | 'grpMembersEmpty'
  | 'grpMembersNoResults'
  | 'grpMemberAdd'
  | 'grpMemberRemove'
  | 'grpMembersInGroup'
  | 'grpMembersDone'
  // toasts
  | 'grpCreatedToast'
  | 'grpUpdatedToast'
  | 'grpDeletedToast'
  | 'grpErrorToast'
  | 'grpMemberAddedToast'
  | 'grpMemberRemovedToast'
  // ── Stages board ──
  | 'stgBack'
  | 'stgEyebrow'
  | 'stgLead'
  | 'stgLoading'
  | 'stgErrorTitle'
  | 'stgRetry'
  | 'stgNotFound'
  | 'stgNotFoundBack'
  | 'stgPipelineHint'
  | 'stgAddColumn'
  | 'stgAddPlaceholder'
  | 'stgAdd'
  | 'stgAdding'
  | 'stgEmptyTitle'
  | 'stgEmptyDesc'
  | 'stgSeq'
  | 'stgFirstBadge'
  | 'stgLastBadge'
  | 'stgRename'
  | 'stgDelete'
  | 'stgMoveBack'
  | 'stgMoveForward'
  | 'stgSaveName'
  | 'stgCancel'
  | 'stgRenameTitle'
  | 'stgRenameSub'
  | 'stgName'
  | 'stgNamePlaceholder'
  | 'stgNameRequired'
  | 'stgSave'
  | 'stgSaving'
  | 'stgDeleteTitle'
  | 'stgDeleteBody'
  | 'stgConfirmDelete'
  | 'stgAddedToast'
  | 'stgRenamedToast'
  | 'stgDeletedToast'
  | 'stgReorderedToast'
  | 'stgErrorToast';

export const teamsTranslations: Record<AppLanguage, Record<TeamsKey, string>> = {
  en: {
    // Groups list
    grpEyebrow: 'Team structure',
    grpTitle: 'Teams & Groups',
    grpLead:
      'Organize agents into teams, model each workflow as a pipeline of stages, and hand conversations off cleanly between them.',
    grpSearch: 'Search teams…',
    grpNew: 'New team',
    grpCount: 'teams',
    grpLoading: 'Loading teams…',
    grpErrorTitle: 'Could not load teams',
    grpRetry: 'Try again',
    grpEmptyTitle: 'Build your first team',
    grpEmptyDesc:
      'Group agents by function — Sales, Support, Billing — then define the stages a conversation moves through.',
    grpEmptyCta: 'Create a team',
    grpNoResults: 'No teams match your search',
    grpDefaultBadge: 'Default',
    grpDistributionBadge: 'Receives distribution',
    grpHandoffBadge: 'Handoff only',
    grpMembersLabel: 'members',
    grpMemberLabel: 'member',
    grpStagesLabel: 'stages',
    grpStageLabel: 'stage',
    grpNoStages: 'No stages yet',
    grpPipeline: 'Pipeline',
    grpMembersBtn: 'Members',
    grpEdit: 'Edit',
    grpDelete: 'Delete',
    grpDefaultLockedHint: 'The default team cannot be deleted',
    grpCreateTitle: 'Create team',
    grpCreateSub: 'Name the team and choose how it receives conversations.',
    grpEditTitle: 'Edit team',
    grpEditSub: 'Update the team name, description and distribution behaviour.',
    grpName: 'Team name',
    grpNamePlaceholder: 'e.g. Sales, Support, Billing',
    grpNameRequired: 'A team name is required',
    grpDescription: 'Description',
    grpDescriptionPlaceholder: 'What does this team handle? (optional)',
    grpDistributionToggle: 'Members receive new auto-distribution',
    grpDistributionToggleHint:
      'When on, new conversations can be auto-assigned to this team. Turn off for handoff-only teams that only receive escalations.',
    grpCancel: 'Cancel',
    grpSave: 'Save team',
    grpSaving: 'Saving…',
    grpDeleteTitle: 'Delete this team?',
    grpDeleteBody: 'This removes the team and its stages. This action cannot be undone —',
    grpConfirmDelete: 'Delete team',
    grpInUseError:
      'This team is still in use by conversations or agents and cannot be deleted yet.',
    grpMembersTitle: 'Manage members',
    grpMembersSub: 'Add or remove agents from this team.',
    grpMembersLoading: 'Loading members…',
    grpMembersSearch: 'Search agents…',
    grpMembersEmpty: 'No users available to add.',
    grpMembersNoResults: 'No agents match your search',
    grpMemberAdd: 'Add',
    grpMemberRemove: 'Remove',
    grpMembersInGroup: 'In this team',
    grpMembersDone: 'Done',
    grpCreatedToast: 'Team created',
    grpUpdatedToast: 'Team updated',
    grpDeletedToast: 'Team deleted',
    grpErrorToast: 'Something went wrong',
    grpMemberAddedToast: 'Member added',
    grpMemberRemovedToast: 'Member removed',
    // Stages board
    stgBack: 'Teams',
    stgEyebrow: 'Stage pipeline',
    stgLead:
      'Each stage is a step a conversation moves through. Reorder them to define the handoff sequence.',
    stgLoading: 'Loading pipeline…',
    stgErrorTitle: 'Could not load the pipeline',
    stgRetry: 'Try again',
    stgNotFound: 'This team could not be found.',
    stgNotFoundBack: 'Back to teams',
    stgPipelineHint: 'Order defines the handoff sequence, left to right.',
    stgAddColumn: 'Add stage',
    stgAddPlaceholder: 'Stage name…',
    stgAdd: 'Add',
    stgAdding: 'Adding…',
    stgEmptyTitle: 'No stages yet',
    stgEmptyDesc: 'Add the first stage to start building this team’s pipeline.',
    stgSeq: 'Stage',
    stgFirstBadge: 'Entry',
    stgLastBadge: 'Final',
    stgRename: 'Rename',
    stgDelete: 'Delete',
    stgMoveBack: 'Move earlier',
    stgMoveForward: 'Move later',
    stgSaveName: 'Save',
    stgCancel: 'Cancel',
    stgRenameTitle: 'Rename stage',
    stgRenameSub: 'Give this stage a clear, recognisable name.',
    stgName: 'Stage name',
    stgNamePlaceholder: 'e.g. Qualifying, In progress, Resolved',
    stgNameRequired: 'A stage name is required',
    stgSave: 'Save',
    stgSaving: 'Saving…',
    stgDeleteTitle: 'Delete this stage?',
    stgDeleteBody: 'Conversations in this stage will need to be moved. This cannot be undone —',
    stgConfirmDelete: 'Delete stage',
    stgAddedToast: 'Stage added',
    stgRenamedToast: 'Stage renamed',
    stgDeletedToast: 'Stage deleted',
    stgReorderedToast: 'Pipeline reordered',
    stgErrorToast: 'Something went wrong',
  },
  ar: {
    // Groups list
    grpEyebrow: 'هيكل الفريق',
    grpTitle: 'الفرق والمجموعات',
    grpLead:
      'نظّم الوكلاء في فرق، واعكس سير عمل كل فريق كمراحل متتابعة، ثم سلّم المحادثات بينها بسلاسة.',
    grpSearch: 'ابحث في الفرق…',
    grpNew: 'فريق جديد',
    grpCount: 'فِرق',
    grpLoading: 'جارٍ تحميل الفرق…',
    grpErrorTitle: 'تعذّر تحميل الفرق',
    grpRetry: 'إعادة المحاولة',
    grpEmptyTitle: 'أنشئ أول فريق لديك',
    grpEmptyDesc:
      'اجمع الوكلاء حسب الوظيفة — مبيعات، دعم، فوترة — ثم حدّد المراحل التي تمر بها المحادثة.',
    grpEmptyCta: 'إنشاء فريق',
    grpNoResults: 'لا توجد فرق تطابق بحثك',
    grpDefaultBadge: 'افتراضي',
    grpDistributionBadge: 'يستقبل التوزيع',
    grpHandoffBadge: 'تسليم فقط',
    grpMembersLabel: 'أعضاء',
    grpMemberLabel: 'عضو',
    grpStagesLabel: 'مراحل',
    grpStageLabel: 'مرحلة',
    grpNoStages: 'لا توجد مراحل بعد',
    grpPipeline: 'المراحل',
    grpMembersBtn: 'الأعضاء',
    grpEdit: 'تعديل',
    grpDelete: 'حذف',
    grpDefaultLockedHint: 'لا يمكن حذف الفريق الافتراضي',
    grpCreateTitle: 'إنشاء فريق',
    grpCreateSub: 'سمِّ الفريق واختر كيف يستقبل المحادثات.',
    grpEditTitle: 'تعديل الفريق',
    grpEditSub: 'حدّث اسم الفريق ووصفه وسلوك التوزيع.',
    grpName: 'اسم الفريق',
    grpNamePlaceholder: 'مثال: مبيعات، دعم، فوترة',
    grpNameRequired: 'اسم الفريق مطلوب',
    grpDescription: 'الوصف',
    grpDescriptionPlaceholder: 'ما الذي يتولاه هذا الفريق؟ (اختياري)',
    grpDistributionToggle: 'يستقبل الأعضاء التوزيع التلقائي الجديد',
    grpDistributionToggleHint:
      'عند التفعيل، يمكن إسناد المحادثات الجديدة تلقائياً لهذا الفريق. أوقفه للفرق التي تستقبل التصعيدات فقط.',
    grpCancel: 'إلغاء',
    grpSave: 'حفظ الفريق',
    grpSaving: 'جارٍ الحفظ…',
    grpDeleteTitle: 'حذف هذا الفريق؟',
    grpDeleteBody: 'سيؤدي هذا إلى إزالة الفريق ومراحله. لا يمكن التراجع عن هذا الإجراء —',
    grpConfirmDelete: 'حذف الفريق',
    grpInUseError: 'هذا الفريق ما زال مستخدماً من محادثات أو وكلاء ولا يمكن حذفه الآن.',
    grpMembersTitle: 'إدارة الأعضاء',
    grpMembersSub: 'أضِف أو أزِل الوكلاء من هذا الفريق.',
    grpMembersLoading: 'جارٍ تحميل الأعضاء…',
    grpMembersSearch: 'ابحث عن وكلاء…',
    grpMembersEmpty: 'لا يوجد مستخدمون متاحون للإضافة.',
    grpMembersNoResults: 'لا يوجد وكلاء يطابقون بحثك',
    grpMemberAdd: 'إضافة',
    grpMemberRemove: 'إزالة',
    grpMembersInGroup: 'في هذا الفريق',
    grpMembersDone: 'تم',
    grpCreatedToast: 'تم إنشاء الفريق',
    grpUpdatedToast: 'تم تحديث الفريق',
    grpDeletedToast: 'تم حذف الفريق',
    grpErrorToast: 'حدث خطأ ما',
    grpMemberAddedToast: 'تمت إضافة العضو',
    grpMemberRemovedToast: 'تمت إزالة العضو',
    // Stages board
    stgBack: 'الفرق',
    stgEyebrow: 'مراحل الفريق',
    stgLead: 'كل مرحلة هي خطوة تمر بها المحادثة. أعد ترتيبها لتحديد تسلسل التسليم.',
    stgLoading: 'جارٍ تحميل المراحل…',
    stgErrorTitle: 'تعذّر تحميل المراحل',
    stgRetry: 'إعادة المحاولة',
    stgNotFound: 'تعذّر العثور على هذا الفريق.',
    stgNotFoundBack: 'العودة إلى الفرق',
    stgPipelineHint: 'الترتيب يحدّد تسلسل التسليم، من البداية إلى النهاية.',
    stgAddColumn: 'إضافة مرحلة',
    stgAddPlaceholder: 'اسم المرحلة…',
    stgAdd: 'إضافة',
    stgAdding: 'جارٍ الإضافة…',
    stgEmptyTitle: 'لا توجد مراحل بعد',
    stgEmptyDesc: 'أضِف المرحلة الأولى لبدء بناء مراحل هذا الفريق.',
    stgSeq: 'مرحلة',
    stgFirstBadge: 'البداية',
    stgLastBadge: 'النهاية',
    stgRename: 'إعادة تسمية',
    stgDelete: 'حذف',
    stgMoveBack: 'تحريك للخلف',
    stgMoveForward: 'تحريك للأمام',
    stgSaveName: 'حفظ',
    stgCancel: 'إلغاء',
    stgRenameTitle: 'إعادة تسمية المرحلة',
    stgRenameSub: 'امنح هذه المرحلة اسماً واضحاً ومميزاً.',
    stgName: 'اسم المرحلة',
    stgNamePlaceholder: 'مثال: تأهيل، قيد التنفيذ، محلولة',
    stgNameRequired: 'اسم المرحلة مطلوب',
    stgSave: 'حفظ',
    stgSaving: 'جارٍ الحفظ…',
    stgDeleteTitle: 'حذف هذه المرحلة؟',
    stgDeleteBody: 'ستحتاج المحادثات في هذه المرحلة إلى نقلها. لا يمكن التراجع —',
    stgConfirmDelete: 'حذف المرحلة',
    stgAddedToast: 'تمت إضافة المرحلة',
    stgRenamedToast: 'تمت إعادة تسمية المرحلة',
    stgDeletedToast: 'تم حذف المرحلة',
    stgReorderedToast: 'تم إعادة ترتيب المراحل',
    stgErrorToast: 'حدث خطأ ما',
  },
};
