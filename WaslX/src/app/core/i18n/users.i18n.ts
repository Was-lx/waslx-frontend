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
  | 'roleAgentDesc';

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
  },
};
