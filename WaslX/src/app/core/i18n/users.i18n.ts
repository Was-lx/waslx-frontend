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
  | 'userRoleUpdated';

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
  },
};
