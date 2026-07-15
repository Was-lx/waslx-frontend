import type { AppLanguage } from './language.types';

// ─── Tags management page translations ────────────────────────────────────────
// The "Tags" screen lets Admins / Managers curate the tenant's tag library —
// coloured labels teams apply to conversations for filtering and reporting.

export type TagsKey =
  | 'tagsNav'
  | 'tagsNavDesc'
  | 'tgEyebrow'
  | 'tgTitle'
  | 'tgLead'
  | 'tgNew'
  | 'tgSearch'
  | 'tgLoading'
  | 'tgErrorTitle'
  | 'tgRetry'
  | 'tgEmptyTitle'
  | 'tgEmptyDesc'
  | 'tgEmptyCta'
  | 'tgNoResults'
  | 'tgCount'
  | 'tgNoDescription'
  | 'tgEdit'
  | 'tgDelete'
  | 'tgCreateTitle'
  | 'tgEditTitle'
  | 'tgCreateSub'
  | 'tgEditSub'
  | 'tgName'
  | 'tgNamePlaceholder'
  | 'tgColor'
  | 'tgColorHint'
  | 'tgCustomColor'
  | 'tgDescription'
  | 'tgDescriptionPlaceholder'
  | 'tgPreview'
  | 'tgPreviewSample'
  | 'tgNameRequired'
  | 'tgCancel'
  | 'tgSave'
  | 'tgSaving'
  | 'tgDeleteTitle'
  | 'tgDeleteBody'
  | 'tgConfirmDelete'
  | 'tgCreatedToast'
  | 'tgUpdatedToast'
  | 'tgDeletedToast'
  | 'tgErrorToast';

export const tagsTranslations: Record<AppLanguage, Record<TagsKey, string>> = {
  en: {
    tagsNav: 'Tags',
    tagsNavDesc: 'Label & organise',
    tgEyebrow: 'Tags',
    tgTitle: 'Tags',
    tgLead: 'Curate the coloured labels your team applies to conversations for faster filtering, routing and reporting.',
    tgNew: 'New tag',
    tgSearch: 'Search tags',
    tgLoading: 'Loading your tags…',
    tgErrorTitle: 'Couldn’t load tags',
    tgRetry: 'Retry',
    tgEmptyTitle: 'No tags yet',
    tgEmptyDesc: 'Create your first tag to label conversations and slice your inbox by topic, priority or team.',
    tgEmptyCta: 'Create a tag',
    tgNoResults: 'No tags match your search',
    tgCount: 'tags',
    tgNoDescription: 'No description',
    tgEdit: 'Edit',
    tgDelete: 'Delete',
    tgCreateTitle: 'New tag',
    tgEditTitle: 'Edit tag',
    tgCreateSub: 'Name your tag and give it a colour your team will recognise.',
    tgEditSub: 'Update the tag’s name, colour and description.',
    tgName: 'Tag name',
    tgNamePlaceholder: 'e.g. VIP, Refund, Follow-up',
    tgColor: 'Colour',
    tgColorHint: 'Pick a preset or choose a custom colour.',
    tgCustomColor: 'Custom',
    tgDescription: 'Description',
    tgDescriptionPlaceholder: 'When should the team use this tag? (optional)',
    tgPreview: 'Preview',
    tgPreviewSample: 'Sample tag',
    tgNameRequired: 'A tag name is required.',
    tgCancel: 'Cancel',
    tgSave: 'Save tag',
    tgSaving: 'Saving…',
    tgDeleteTitle: 'Delete tag?',
    tgDeleteBody: 'This removes the tag from every conversation it’s applied to. This can’t be undone.',
    tgConfirmDelete: 'Delete tag',
    tgCreatedToast: 'Tag created',
    tgUpdatedToast: 'Tag updated',
    tgDeletedToast: 'Tag deleted',
    tgErrorToast: 'Something went wrong',
  },
  ar: {
    tagsNav: 'الوسوم',
    tagsNavDesc: 'صنّف ونظّم',
    tgEyebrow: 'الوسوم',
    tgTitle: 'الوسوم',
    tgLead: 'نظّم الوسوم الملوّنة اللي فريقك بيحطها على المحادثات عشان فلترة وتوجيه وتقارير أسرع.',
    tgNew: 'وسم جديد',
    tgSearch: 'ابحث في الوسوم',
    tgLoading: 'بنحمّل الوسوم…',
    tgErrorTitle: 'تعذّر تحميل الوسوم',
    tgRetry: 'إعادة المحاولة',
    tgEmptyTitle: 'لسه مفيش وسوم',
    tgEmptyDesc: 'أنشئ أول وسم عشان تصنّف المحادثات وتقسّم صندوقك حسب الموضوع أو الأولوية أو الفريق.',
    tgEmptyCta: 'أنشئ وسم',
    tgNoResults: 'مفيش وسوم مطابقة لبحثك',
    tgCount: 'وسم',
    tgNoDescription: 'لا يوجد وصف',
    tgEdit: 'تعديل',
    tgDelete: 'حذف',
    tgCreateTitle: 'وسم جديد',
    tgEditTitle: 'تعديل الوسم',
    tgCreateSub: 'سمِّ الوسم واختار له لون فريقك هيميّزه بسهولة.',
    tgEditSub: 'حدّث اسم الوسم ولونه ووصفه.',
    tgName: 'اسم الوسم',
    tgNamePlaceholder: 'مثال: VIP، استرجاع، متابعة',
    tgColor: 'اللون',
    tgColorHint: 'اختار لون جاهز أو حدّد لون مخصص.',
    tgCustomColor: 'مخصص',
    tgDescription: 'الوصف',
    tgDescriptionPlaceholder: 'إمتى يستخدم الفريق الوسم ده؟ (اختياري)',
    tgPreview: 'معاينة',
    tgPreviewSample: 'وسم تجريبي',
    tgNameRequired: 'اسم الوسم مطلوب.',
    tgCancel: 'إلغاء',
    tgSave: 'حفظ الوسم',
    tgSaving: 'جاري الحفظ…',
    tgDeleteTitle: 'حذف الوسم؟',
    tgDeleteBody: 'هيتشال الوسم من كل المحادثات المطبّق عليها. الإجراء ده لا يمكن التراجع عنه.',
    tgConfirmDelete: 'حذف الوسم',
    tgCreatedToast: 'تم إنشاء الوسم',
    tgUpdatedToast: 'تم تحديث الوسم',
    tgDeletedToast: 'تم حذف الوسم',
    tgErrorToast: 'حصل خطأ ما',
  },
};
