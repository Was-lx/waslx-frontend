import type { AppLanguage } from './language.types';

// ─── Channels (grouping) page translations ───────────────────────────────────
// The "Channels" screen groups a tenant's connected WhatsApp numbers into
// routable channels. Distinct from the WhatsApp connection page (/app/channels).

export type ChannelsKey =
  | 'channelsNav'
  | 'channelsNavDesc'
  | 'chEyebrow'
  | 'chTitle'
  | 'chLead'
  | 'chNew'
  | 'chSearch'
  | 'chLoading'
  | 'chErrorTitle'
  | 'chRetry'
  | 'chEmptyTitle'
  | 'chEmptyDesc'
  | 'chEmptyCta'
  | 'chNoResults'
  | 'chCount'
  | 'chNumbers'
  | 'chNoNumbers'
  | 'chAgentsLabel'
  | 'chEdit'
  | 'chDelete'
  | 'chCreateTitle'
  | 'chEditTitle'
  | 'chCreateSub'
  | 'chEditSub'
  | 'chName'
  | 'chNamePlaceholder'
  | 'chDescription'
  | 'chDescriptionPlaceholder'
  | 'chSelectNumbers'
  | 'chSelectNumbersHint'
  | 'chNumbersSelected'
  | 'chNoNumbersAvailable'
  | 'chNameRequired'
  | 'chCancel'
  | 'chSave'
  | 'chSaving'
  | 'chDeleteTitle'
  | 'chDeleteBody'
  | 'chConfirmDelete'
  | 'chCreatedToast'
  | 'chUpdatedToast'
  | 'chDeletedToast'
  | 'chErrorToast';

export const channelsTranslations: Record<AppLanguage, Record<ChannelsKey, string>> = {
  en: {
    channelsNav: 'Channels',
    channelsNavDesc: 'Group your numbers',
    chEyebrow: 'Channels',
    chTitle: 'Channels',
    chLead: 'Group your WhatsApp numbers into channels your team routes, replies and reports from.',
    chNew: 'New channel',
    chSearch: 'Search channels',
    chLoading: 'Loading your channels…',
    chErrorTitle: 'Couldn’t load channels',
    chRetry: 'Retry',
    chEmptyTitle: 'No channels yet',
    chEmptyDesc: 'Create your first channel to group WhatsApp numbers and route them to the right team.',
    chEmptyCta: 'Create a channel',
    chNoResults: 'No channels match your search',
    chCount: 'channels',
    chNumbers: 'WhatsApp numbers',
    chNoNumbers: 'No numbers attached',
    chAgentsLabel: 'agents',
    chEdit: 'Edit',
    chDelete: 'Delete',
    chCreateTitle: 'New channel',
    chEditTitle: 'Edit channel',
    chCreateSub: 'Name your channel and pick the numbers it routes.',
    chEditSub: 'Update the channel details and attached numbers.',
    chName: 'Channel name',
    chNamePlaceholder: 'e.g. Sales, Support, Billing',
    chDescription: 'Description',
    chDescriptionPlaceholder: 'What is this channel for? (optional)',
    chSelectNumbers: 'WhatsApp numbers',
    chSelectNumbersHint: 'Choose which connected numbers belong to this channel.',
    chNumbersSelected: 'selected',
    chNoNumbersAvailable: 'No WhatsApp numbers connected yet — connect one first.',
    chNameRequired: 'A channel name is required.',
    chCancel: 'Cancel',
    chSave: 'Save channel',
    chSaving: 'Saving…',
    chDeleteTitle: 'Delete channel?',
    chDeleteBody: 'This removes the channel and detaches its numbers. Conversations are not deleted.',
    chConfirmDelete: 'Delete channel',
    chCreatedToast: 'Channel created',
    chUpdatedToast: 'Channel updated',
    chDeletedToast: 'Channel deleted',
    chErrorToast: 'Something went wrong',
  },
  ar: {
    channelsNav: 'القنوات',
    channelsNavDesc: 'جمّع أرقامك',
    chEyebrow: 'القنوات',
    chTitle: 'القنوات',
    chLead: 'جمّع أرقام واتساب في قنوات فريقك بيوجّه ويرد ويعمل تقاريره منها.',
    chNew: 'قناة جديدة',
    chSearch: 'ابحث في القنوات',
    chLoading: 'بنحمّل قنواتك…',
    chErrorTitle: 'تعذّر تحميل القنوات',
    chRetry: 'إعادة المحاولة',
    chEmptyTitle: 'لسه مفيش قنوات',
    chEmptyDesc: 'أنشئ أول قناة عشان تجمّع أرقام واتساب وتوجّهها للفريق المناسب.',
    chEmptyCta: 'أنشئ قناة',
    chNoResults: 'مفيش قنوات مطابقة لبحثك',
    chCount: 'قناة',
    chNumbers: 'أرقام واتساب',
    chNoNumbers: 'لا أرقام مرتبطة',
    chAgentsLabel: 'موظف',
    chEdit: 'تعديل',
    chDelete: 'حذف',
    chCreateTitle: 'قناة جديدة',
    chEditTitle: 'تعديل القناة',
    chCreateSub: 'سمِّ قناتك واختار الأرقام اللي هتوجّهها.',
    chEditSub: 'حدّث بيانات القناة والأرقام المرتبطة بها.',
    chName: 'اسم القناة',
    chNamePlaceholder: 'مثال: مبيعات، دعم، فواتير',
    chDescription: 'الوصف',
    chDescriptionPlaceholder: 'القناة دي بتستخدم في إيه؟ (اختياري)',
    chSelectNumbers: 'أرقام واتساب',
    chSelectNumbersHint: 'اختار الأرقام المتصلة اللي تنتمي لهذه القناة.',
    chNumbersSelected: 'مختار',
    chNoNumbersAvailable: 'لسه مفيش أرقام واتساب متصلة — اربط رقم الأول.',
    chNameRequired: 'اسم القناة مطلوب.',
    chCancel: 'إلغاء',
    chSave: 'حفظ القناة',
    chSaving: 'جاري الحفظ…',
    chDeleteTitle: 'حذف القناة؟',
    chDeleteBody: 'هيتم حذف القناة وفصل أرقامها. المحادثات مش هتتحذف.',
    chConfirmDelete: 'حذف القناة',
    chCreatedToast: 'تم إنشاء القناة',
    chUpdatedToast: 'تم تحديث القناة',
    chDeletedToast: 'تم حذف القناة',
    chErrorToast: 'حصل خطأ ما',
  },
};
