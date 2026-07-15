import type { AppLanguage } from './language.types';

// ─── Users page translations ──────────────────────────────────────────────────

export type UsersKey =
  | 'userManagement'
  | 'inviteUser'
  | 'activeUsers'
  | 'deactivatedUsers'
  | 'userName'
  | 'userRole'
  | 'userStatus'
  | 'userJoined'
  | 'userActions'
  | 'active'
  | 'inactive'
  | 'activateUser'
  | 'deactivateUser'
  | 'changeRole'
  | 'inviteUserTitle'
  | 'inviteUserLead'
  | 'cancel'
  | 'invite'
  | 'userInvited'
  | 'userStatusUpdated'
  | 'userRoleUpdated'
  | 'fullName'
  | 'fullNamePlaceholder'
  | 'genericError'
  | 'usersLoadError'
  | 'retry'
  | 'searchUsers'
  | 'sortBy'
  | 'noResults'
  | 'page'
  | 'of'
  | 'prev'
  | 'next'
  | 'confirm'
  | 'confirmActivateTitle'
  | 'confirmDeactivateTitle'
  | 'confirmActivateBody'
  | 'confirmDeactivateBody'
  | 'membersLabel'
  | 'activeLabel'
  | 'inviteHintTitle'
  | 'inviteHintBody'
  | 'roleAdminDesc'
  | 'roleManagerDesc'
  | 'roleAgentDesc'
  // ── Owner lock ──
  | 'ownerBadge'
  | 'ownerLockHint'
  | 'ownerLocked'
  // ── Row actions ──
  | 'editUserAction'
  // ── Access & routing picker ──
  | 'accessSectionTitle'
  | 'accessSectionHint'
  | 'accessChannels'
  | 'accessChannelsHint'
  | 'accessNumbers'
  | 'accessNumbersHint'
  | 'accessGroups'
  | 'accessGroupsHint'
  | 'accessShifts'
  | 'accessShiftsHint'
  | 'agentsOnly'
  | 'accessSelected'
  | 'accessNoChannels'
  | 'accessNoNumbers'
  | 'accessNoGroups'
  | 'accessNoShifts'
  | 'accessPickChannelsFirst'
  | 'accessDefault'
  | 'accessStages'
  | 'accessDays'
  | 'accessManagerNote'
  // ── Edit user ──
  | 'editUserTitle'
  | 'editUserLead'
  | 'editUserHintTitle'
  | 'editUserHintBody'
  | 'saveChanges'
  | 'userUpdated'
  | 'phoneNumber'
  | 'phonePlaceholder'
  | 'backToUsers'
  | 'editLoadError'
  | 'basicInfo';

export const usersTranslations: Record<AppLanguage, Record<UsersKey, string>> = {
  en: {
    userManagement: 'User Management',
    inviteUser: 'Invite User',
    activeUsers: 'Active Users',
    deactivatedUsers: 'Deactivated Users',
    userName: 'Name & Email',
    userRole: 'Role',
    userStatus: 'Status',
    userJoined: 'Joined',
    userActions: 'Actions',
    active: 'Active',
    inactive: 'Inactive',
    activateUser: 'Activate',
    deactivateUser: 'Deactivate',
    changeRole: 'Change Role',
    inviteUserTitle: 'Invite new user',
    inviteUserLead: 'Send an invitation email to a new team member.',
    cancel: 'Cancel',
    invite: 'Send Invite',
    userInvited: 'User invited successfully',
    userStatusUpdated: 'User status updated',
    userRoleUpdated: 'User role updated',
    fullName: 'Full name',
    fullNamePlaceholder: 'e.g. Sara Mostafa',
    genericError: 'Something went wrong. Please try again.',
    usersLoadError: 'Could not load users.',
    retry: 'Retry',
    searchUsers: 'Search by name or email',
    sortBy: 'Sort by',
    noResults: 'No users match your search',
    page: 'Page',
    of: 'of',
    prev: 'Previous',
    next: 'Next',
    confirm: 'Confirm',
    confirmActivateTitle: 'Activate user?',
    confirmDeactivateTitle: 'Deactivate user?',
    confirmActivateBody: 'This restores sign-in access for',
    confirmDeactivateBody: 'This blocks sign-in for',
    membersLabel: 'members',
    activeLabel: 'active',
    inviteHintTitle: 'They get an email invite',
    inviteHintBody: 'The person receives a secure link to set their password and join your workspace. You can change their role any time.',
    roleAdminDesc: 'Full control — billing, users, WhatsApp & routing.',
    roleManagerDesc: 'Oversees conversations, agents, groups & reports.',
    roleAgentDesc: 'Handles assigned chats — reply, notes, tags & handoff.',
    ownerBadge: 'Owner',
    ownerLockHint: 'The workspace owner is locked — role and access can’t be changed.',
    ownerLocked: 'The workspace owner can’t be modified.',
    editUserAction: 'Edit',
    accessSectionTitle: 'Access & routing',
    accessSectionHint: 'Pick which channels, numbers, groups and shifts this person works in. Distribution and shift routing only apply to Agents — Managers and Admins see everything.',
    accessChannels: 'Channels',
    accessChannelsHint: 'Which channels this person can see and work in.',
    accessNumbers: 'Distribution numbers',
    accessNumbersHint: 'Numbers this agent receives auto-distributed chats from (limited to the chosen channels).',
    accessGroups: 'Groups',
    accessGroupsHint: 'Teams and stage pipelines this person belongs to.',
    accessShifts: 'Shifts',
    accessShiftsHint: 'Working shifts that decide when this agent is on rota.',
    agentsOnly: 'Agents only',
    accessSelected: 'selected',
    accessNoChannels: 'No channels yet — create one under Channels.',
    accessNoNumbers: 'The chosen channels have no numbers attached.',
    accessNoGroups: 'No groups yet — create one under Teams.',
    accessNoShifts: 'No shifts yet — create one under Working hours.',
    accessPickChannelsFirst: 'Select one or more channels to choose their numbers.',
    accessDefault: 'Default',
    accessStages: 'stages',
    accessDays: 'days',
    accessManagerNote: 'This role sees all conversations. Distribution numbers and shifts don’t affect Managers or Admins.',
    editUserTitle: 'Edit user',
    editUserLead: 'Update this member’s details and what they can access.',
    editUserHintTitle: 'Changes apply immediately',
    editUserHintBody: 'Updating access takes effect right away — new distribution, groups and shifts are live as soon as you save.',
    saveChanges: 'Save changes',
    userUpdated: 'User updated',
    phoneNumber: 'Phone number',
    phonePlaceholder: 'e.g. +20 100 000 0000',
    backToUsers: 'Back to users',
    editLoadError: 'Could not load this user.',
    basicInfo: 'Basic info',
  },
  ar: {
    userManagement: 'إدارة المستخدمين',
    inviteUser: 'دعوة مستخدم',
    activeUsers: 'المستخدمون النشطون',
    deactivatedUsers: 'المستخدمون المعطّلون',
    userName: 'الاسم والبريد',
    userRole: 'الدور',
    userStatus: 'الحالة',
    userJoined: 'تاريخ الانضمام',
    userActions: 'إجراءات',
    active: 'نشط',
    inactive: 'غير نشط',
    activateUser: 'تفعيل',
    deactivateUser: 'تعطيل',
    changeRole: 'تغيير الدور',
    inviteUserTitle: 'دعوة مستخدم جديد',
    inviteUserLead: 'أرسل دعوة إلى عضو جديد في الفريق.',
    cancel: 'إلغاء',
    invite: 'إرسال الدعوة',
    userInvited: 'تمت دعوة المستخدم بنجاح',
    userStatusUpdated: 'تم تحديث حالة المستخدم',
    userRoleUpdated: 'تم تحديث دور المستخدم',
    fullName: 'الاسم الكامل',
    fullNamePlaceholder: 'مثال: سارة مصطفى',
    genericError: 'حصل خطأ ما. حاول مرة أخرى.',
    usersLoadError: 'تعذّر تحميل المستخدمين.',
    retry: 'إعادة المحاولة',
    searchUsers: 'ابحث بالاسم أو البريد',
    sortBy: 'ترتيب حسب',
    noResults: 'لا يوجد مستخدمون مطابقون لبحثك',
    page: 'صفحة',
    of: 'من',
    prev: 'السابق',
    next: 'التالي',
    confirm: 'تأكيد',
    confirmActivateTitle: 'تفعيل المستخدم؟',
    confirmDeactivateTitle: 'تعطيل المستخدم؟',
    confirmActivateBody: 'سيؤدي هذا إلى استعادة إمكانية تسجيل الدخول لـ',
    confirmDeactivateBody: 'سيؤدي هذا إلى منع تسجيل الدخول لـ',
    membersLabel: 'عضو',
    activeLabel: 'نشط',
    inviteHintTitle: 'ستصله دعوة عبر البريد',
    inviteHintBody: 'يستلم الشخص رابطًا آمنًا لتعيين كلمة المرور والانضمام إلى مساحة عملك. يمكنك تغيير دوره في أي وقت.',
    roleAdminDesc: 'تحكم كامل — الفوترة والمستخدمون وواتساب والتوجيه.',
    roleManagerDesc: 'يشرف على المحادثات والوكلاء والمجموعات والتقارير.',
    roleAgentDesc: 'يتعامل مع المحادثات المسندة — الرد والملاحظات والوسوم والتحويل.',
    ownerBadge: 'المالك',
    ownerLockHint: 'مالك المساحة مقفل — لا يمكن تغيير دوره أو صلاحياته.',
    ownerLocked: 'لا يمكن تعديل مالك المساحة.',
    editUserAction: 'تعديل',
    accessSectionTitle: 'الصلاحيات والتوجيه',
    accessSectionHint: 'حدّد القنوات والأرقام والمجموعات والورديات التي يعمل بها هذا الشخص. التوزيع والورديات تنطبق على الوكلاء فقط — المديرون والمشرفون يرون كل شيء.',
    accessChannels: 'القنوات',
    accessChannelsHint: 'القنوات التي يمكن لهذا الشخص رؤيتها والعمل بها.',
    accessNumbers: 'أرقام التوزيع',
    accessNumbersHint: 'الأرقام التي يستقبل منها الوكيل المحادثات الموزّعة تلقائيًا (ضمن القنوات المختارة).',
    accessGroups: 'المجموعات',
    accessGroupsHint: 'الفرق ومسارات المراحل التي ينتمي إليها هذا الشخص.',
    accessShifts: 'الورديات',
    accessShiftsHint: 'ورديات العمل التي تحدد متى يكون الوكيل ضمن المناوبة.',
    agentsOnly: 'للوكلاء فقط',
    accessSelected: 'محدد',
    accessNoChannels: 'لا توجد قنوات بعد — أنشئ واحدة من صفحة القنوات.',
    accessNoNumbers: 'القنوات المختارة لا تحتوي على أرقام.',
    accessNoGroups: 'لا توجد مجموعات بعد — أنشئ واحدة من صفحة الفرق.',
    accessNoShifts: 'لا توجد ورديات بعد — أنشئ واحدة من صفحة ساعات العمل.',
    accessPickChannelsFirst: 'اختر قناة أو أكثر لعرض أرقامها.',
    accessDefault: 'افتراضي',
    accessStages: 'مراحل',
    accessDays: 'أيام',
    accessManagerNote: 'هذا الدور يرى جميع المحادثات. أرقام التوزيع والورديات لا تؤثر على المديرين أو المشرفين.',
    editUserTitle: 'تعديل المستخدم',
    editUserLead: 'حدّث بيانات هذا العضو وما يمكنه الوصول إليه.',
    editUserHintTitle: 'التغييرات تُطبّق فورًا',
    editUserHintBody: 'تحديث الصلاحيات يسري مباشرة — التوزيع والمجموعات والورديات الجديدة تصبح فعّالة بمجرد الحفظ.',
    saveChanges: 'حفظ التغييرات',
    userUpdated: 'تم تحديث المستخدم',
    phoneNumber: 'رقم الهاتف',
    phonePlaceholder: 'مثال: ‎+20 100 000 0000',
    backToUsers: 'العودة إلى المستخدمين',
    editLoadError: 'تعذّر تحميل هذا المستخدم.',
    basicInfo: 'المعلومات الأساسية',
  },
};
