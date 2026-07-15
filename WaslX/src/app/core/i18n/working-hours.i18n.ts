import type { AppLanguage } from './language.types';

// ─── Working Hours translations ───────────────────────────────────────────────
// Company operating hours + agent shifts. Admins / Managers configure the
// tenant's weekly working window and the named shifts agents are scheduled onto.

export type WorkingHoursKey =
  // sidebar / nav
  | 'whNav'
  | 'whNavDesc'
  | 'whCompanyNav'
  | 'whCompanyNavDesc'
  | 'whShiftsNav'
  | 'whShiftsNavDesc'
  // tabs
  | 'whTabCompany'
  | 'whTabShifts'
  // day names (0 = Sun .. 6 = Sat)
  | 'whDay0'
  | 'whDay1'
  | 'whDay2'
  | 'whDay3'
  | 'whDay4'
  | 'whDay5'
  | 'whDay6'
  // shared states
  | 'whLoading'
  | 'whErrorTitle'
  | 'whRetry'
  | 'whFrom'
  | 'whTo'
  | 'whCancel'
  | 'whSaving'
  | 'whErrorToast'
  // company page
  | 'whCoEyebrow'
  | 'whCoTitle'
  | 'whCoLead'
  | 'whCoTimezone'
  | 'whCoTimezoneHint'
  | 'whCoScheduleTitle'
  | 'whCoScheduleHint'
  | 'whCoWorkingDay'
  | 'whCoDayOff'
  | 'whCoClosed'
  | 'whCoWorkingCount'
  | 'whCoSave'
  | 'whCoSavedToast'
  | 'whCoRangeError'
  // shifts page
  | 'whShEyebrow'
  | 'whShTitle'
  | 'whShLead'
  | 'whShNew'
  | 'whShEmptyTitle'
  | 'whShEmptyDesc'
  | 'whShEmptyCta'
  | 'whShAgents'
  | 'whShDaysCount'
  | 'whShEdit'
  | 'whShDelete'
  | 'whShNoDays'
  // shift editor
  | 'whShCreateTitle'
  | 'whShEditTitle'
  | 'whShCreateSub'
  | 'whShEditSub'
  | 'whShName'
  | 'whShNamePlaceholder'
  | 'whShMode'
  | 'whShModeSame'
  | 'whShModePerDay'
  | 'whShSameHours'
  | 'whShSameHint'
  | 'whShDays'
  | 'whShDaysHint'
  | 'whShNoCompanyDays'
  | 'whShWithin'
  | 'whShSave'
  | 'whShNameRequired'
  | 'whShNoDaysError'
  | 'whShTimeRequired'
  | 'whShRangeError'
  | 'whShOutsideError'
  | 'whShCreatedToast'
  | 'whShUpdatedToast'
  | 'whShDeletedToast'
  | 'whShDeleteTitle'
  | 'whShDeleteBody'
  | 'whShConfirmDelete';

export const workingHoursTranslations: Record<AppLanguage, Record<WorkingHoursKey, string>> = {
  en: {
    whNav: 'Working Hours',
    whNavDesc: 'Hours & shifts',
    whCompanyNav: 'Company Hours',
    whCompanyNavDesc: 'Weekly operating window',
    whShiftsNav: 'Shifts',
    whShiftsNavDesc: 'Agent schedules',

    whTabCompany: 'Company Hours',
    whTabShifts: 'Shifts',

    whDay0: 'Sunday',
    whDay1: 'Monday',
    whDay2: 'Tuesday',
    whDay3: 'Wednesday',
    whDay4: 'Thursday',
    whDay5: 'Friday',
    whDay6: 'Saturday',

    whLoading: 'Loading working hours…',
    whErrorTitle: 'Couldn’t load working hours',
    whRetry: 'Retry',
    whFrom: 'From',
    whTo: 'To',
    whCancel: 'Cancel',
    whSaving: 'Saving…',
    whErrorToast: 'Something went wrong',

    whCoEyebrow: 'Working Hours',
    whCoTitle: 'Company hours',
    whCoLead: 'Set the timezone and the weekly window your business operates in. Shifts and availability are scheduled inside these hours.',
    whCoTimezone: 'Timezone',
    whCoTimezoneHint: 'All working hours and shifts are interpreted in this timezone.',
    whCoScheduleTitle: 'Weekly schedule',
    whCoScheduleHint: 'Toggle each day on or off and set its open and close time.',
    whCoWorkingDay: 'Working day',
    whCoDayOff: 'Day off',
    whCoClosed: 'Closed',
    whCoWorkingCount: 'working days',
    whCoSave: 'Save hours',
    whCoSavedToast: 'Company hours saved',
    whCoRangeError: 'End time must be after the start time.',

    whShEyebrow: 'Working Hours',
    whShTitle: 'Shifts',
    whShLead: 'Define named shifts and the days they cover. Agents are assigned to shifts to shape availability and routing.',
    whShNew: 'New shift',
    whShEmptyTitle: 'No shifts yet',
    whShEmptyDesc: 'Create your first shift to schedule agents across your company working days.',
    whShEmptyCta: 'Create a shift',
    whShAgents: 'agents',
    whShDaysCount: 'days',
    whShEdit: 'Edit',
    whShDelete: 'Delete',
    whShNoDays: 'No days set',

    whShCreateTitle: 'New shift',
    whShEditTitle: 'Edit shift',
    whShCreateSub: 'Name the shift and choose the days and hours it covers.',
    whShEditSub: 'Update the shift name, days and hours.',
    whShName: 'Shift name',
    whShNamePlaceholder: 'e.g. Morning, Evening, Weekend',
    whShMode: 'Hours mode',
    whShModeSame: 'Same every day',
    whShModePerDay: 'Different per day',
    whShSameHours: 'Shift hours',
    whShSameHint: 'These hours apply to every selected day.',
    whShDays: 'Days',
    whShDaysHint: 'Only company working days can be scheduled.',
    whShNoCompanyDays: 'Set at least one company working day first, then create shifts.',
    whShWithin: 'Company hours',
    whShSave: 'Save shift',
    whShNameRequired: 'A shift name is required.',
    whShNoDaysError: 'Select at least one day for this shift.',
    whShTimeRequired: 'Set a start and end time for every selected day.',
    whShRangeError: 'End time must be after the start time.',
    whShOutsideError: 'Shift hours must sit within the company working hours.',
    whShCreatedToast: 'Shift created',
    whShUpdatedToast: 'Shift updated',
    whShDeletedToast: 'Shift deleted',
    whShDeleteTitle: 'Delete shift?',
    whShDeleteBody: 'This removes the shift and unassigns any agents from it. This can’t be undone.',
    whShConfirmDelete: 'Delete shift',
  },
  ar: {
    whNav: 'مواعيد العمل',
    whNavDesc: 'المواعيد والورديات',
    whCompanyNav: 'مواعيد الشركة',
    whCompanyNavDesc: 'نافذة العمل الأسبوعية',
    whShiftsNav: 'الورديات',
    whShiftsNavDesc: 'جداول الموظفين',

    whTabCompany: 'مواعيد الشركة',
    whTabShifts: 'الورديات',

    whDay0: 'الأحد',
    whDay1: 'الإثنين',
    whDay2: 'الثلاثاء',
    whDay3: 'الأربعاء',
    whDay4: 'الخميس',
    whDay5: 'الجمعة',
    whDay6: 'السبت',

    whLoading: 'بنحمّل مواعيد العمل…',
    whErrorTitle: 'تعذّر تحميل مواعيد العمل',
    whRetry: 'إعادة المحاولة',
    whFrom: 'من',
    whTo: 'إلى',
    whCancel: 'إلغاء',
    whSaving: 'جاري الحفظ…',
    whErrorToast: 'حصل خطأ ما',

    whCoEyebrow: 'مواعيد العمل',
    whCoTitle: 'مواعيد الشركة',
    whCoLead: 'حدّد المنطقة الزمنية ونافذة العمل الأسبوعية لنشاطك. الورديات والتوافر بيتجدولوا جوه المواعيد دي.',
    whCoTimezone: 'المنطقة الزمنية',
    whCoTimezoneHint: 'كل مواعيد العمل والورديات بتتحسب على المنطقة الزمنية دي.',
    whCoScheduleTitle: 'الجدول الأسبوعي',
    whCoScheduleHint: 'فعّل أو أطفئ كل يوم وحدّد مواعيد الفتح والقفل.',
    whCoWorkingDay: 'يوم عمل',
    whCoDayOff: 'إجازة',
    whCoClosed: 'مغلق',
    whCoWorkingCount: 'أيام عمل',
    whCoSave: 'حفظ المواعيد',
    whCoSavedToast: 'تم حفظ مواعيد الشركة',
    whCoRangeError: 'وقت النهاية لازم يكون بعد وقت البداية.',

    whShEyebrow: 'مواعيد العمل',
    whShTitle: 'الورديات',
    whShLead: 'عرّف ورديات بأسماء والأيام اللي بتغطيها. الموظفين بيتعيّنوا على الورديات لتنظيم التوافر والتوجيه.',
    whShNew: 'وردية جديدة',
    whShEmptyTitle: 'لسه مفيش ورديات',
    whShEmptyDesc: 'أنشئ أول وردية عشان تجدول الموظفين على أيام عمل الشركة.',
    whShEmptyCta: 'أنشئ وردية',
    whShAgents: 'موظف',
    whShDaysCount: 'يوم',
    whShEdit: 'تعديل',
    whShDelete: 'حذف',
    whShNoDays: 'مفيش أيام محددة',

    whShCreateTitle: 'وردية جديدة',
    whShEditTitle: 'تعديل الوردية',
    whShCreateSub: 'سمِّ الوردية واختار الأيام والمواعيد اللي بتغطيها.',
    whShEditSub: 'حدّث اسم الوردية والأيام والمواعيد.',
    whShName: 'اسم الوردية',
    whShNamePlaceholder: 'مثال: صباحية، مسائية، نهاية الأسبوع',
    whShMode: 'نمط المواعيد',
    whShModeSame: 'نفس المواعيد كل يوم',
    whShModePerDay: 'مواعيد مختلفة لكل يوم',
    whShSameHours: 'مواعيد الوردية',
    whShSameHint: 'المواعيد دي بتنطبق على كل يوم متحدد.',
    whShDays: 'الأيام',
    whShDaysHint: 'أيام عمل الشركة بس اللي ينفع تتجدول.',
    whShNoCompanyDays: 'حدّد على الأقل يوم عمل واحد للشركة الأول، وبعدين أنشئ الورديات.',
    whShWithin: 'مواعيد الشركة',
    whShSave: 'حفظ الوردية',
    whShNameRequired: 'اسم الوردية مطلوب.',
    whShNoDaysError: 'اختار على الأقل يوم واحد للوردية.',
    whShTimeRequired: 'حدّد وقت بداية ونهاية لكل يوم متحدد.',
    whShRangeError: 'وقت النهاية لازم يكون بعد وقت البداية.',
    whShOutsideError: 'مواعيد الوردية لازم تكون جوه مواعيد عمل الشركة.',
    whShCreatedToast: 'تم إنشاء الوردية',
    whShUpdatedToast: 'تم تحديث الوردية',
    whShDeletedToast: 'تم حذف الوردية',
    whShDeleteTitle: 'حذف الوردية؟',
    whShDeleteBody: 'هيتشال الوردية وهيتلغى تعيين أي موظفين عليها. الإجراء ده لا يمكن التراجع عنه.',
    whShConfirmDelete: 'حذف الوردية',
  },
};
