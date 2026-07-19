import type { AppLanguage } from './language.types';

// ─── Knowledge Base management page translations ──────────────────────────────
// Lets Admins / Managers curate the tenant's RAG knowledge base: FAQs, uploaded
// documents, and website pages that power AI-suggested replies.

export type KnowledgeBaseKey =
  | 'kbNav'
  | 'kbNavDesc'
  | 'kbEyebrow'
  | 'kbTitle'
  | 'kbLead'
  | 'kbTabFaqs'
  | 'kbTabDocuments'
  | 'kbTabWebsites'
  | 'kbRetry'
  | 'kbEdit'
  | 'kbDelete'
  | 'kbCancel'
  | 'kbSave'
  | 'kbSaving'
  | 'kbConfirmDelete'
  | 'kbErrorToast'
  | 'kbReindex'
  | 'kbReindexToast'
  | 'kbLanguageLabel'
  | 'kbLanguageEnglish'
  | 'kbLanguageArabic'
  | 'kbStatusPending'
  | 'kbStatusProcessing'
  | 'kbStatusIndexed'
  | 'kbStatusFailed'
  | 'kbChunksCount'
  // FAQs
  | 'kbFaqNew'
  | 'kbFaqSearch'
  | 'kbFaqLoading'
  | 'kbFaqErrorTitle'
  | 'kbFaqEmptyTitle'
  | 'kbFaqEmptyDesc'
  | 'kbFaqEmptyCta'
  | 'kbFaqNoResults'
  | 'kbFaqActiveLabel'
  | 'kbFaqCreateTitle'
  | 'kbFaqEditTitle'
  | 'kbQuestionLabel'
  | 'kbQuestionPlaceholder'
  | 'kbAnswerLabel'
  | 'kbAnswerPlaceholder'
  | 'kbFaqRequired'
  | 'kbFaqDeleteTitle'
  | 'kbFaqDeleteBody'
  | 'kbFaqCreatedToast'
  | 'kbFaqUpdatedToast'
  | 'kbFaqDeletedToast'
  // Documents
  | 'kbDocUpload'
  | 'kbDocChooseFile'
  | 'kbDocTitleLabel'
  | 'kbDocTitlePlaceholder'
  | 'kbDocUploading'
  | 'kbDocLoading'
  | 'kbDocEmptyTitle'
  | 'kbDocEmptyDesc'
  | 'kbDocDeleteTitle'
  | 'kbDocDeleteBody'
  | 'kbDocUploadedToast'
  | 'kbDocDeletedToast'
  // Websites
  | 'kbWebAdd'
  | 'kbWebUrlLabel'
  | 'kbWebUrlPlaceholder'
  | 'kbWebTitleLabel'
  | 'kbWebTitlePlaceholder'
  | 'kbWebAdding'
  | 'kbWebLoading'
  | 'kbWebEmptyTitle'
  | 'kbWebEmptyDesc'
  | 'kbWebDeleteTitle'
  | 'kbWebDeleteBody'
  | 'kbWebAddedToast'
  | 'kbWebDeletedToast'
  | 'kbWebUrlInvalid';

export const knowledgeBaseTranslations: Record<AppLanguage, Record<KnowledgeBaseKey, string>> = {
  en: {
    kbNav: 'Knowledge Base',
    kbNavDesc: 'Train the AI',
    kbEyebrow: 'Knowledge Base',
    kbTitle: 'Knowledge Base',
    kbLead: 'FAQs, documents and websites the AI draws on to suggest — and eventually auto-send — replies to your customers.',
    kbTabFaqs: 'FAQs',
    kbTabDocuments: 'Documents',
    kbTabWebsites: 'Websites',
    kbRetry: 'Retry',
    kbEdit: 'Edit',
    kbDelete: 'Delete',
    kbCancel: 'Cancel',
    kbSave: 'Save',
    kbSaving: 'Saving…',
    kbConfirmDelete: 'Delete',
    kbErrorToast: 'Something went wrong',
    kbReindex: 'Reindex',
    kbReindexToast: 'Reindexing started',
    kbLanguageLabel: 'Language',
    kbLanguageEnglish: 'English',
    kbLanguageArabic: 'Arabic',
    kbStatusPending: 'Pending',
    kbStatusProcessing: 'Processing',
    kbStatusIndexed: 'Indexed',
    kbStatusFailed: 'Failed',
    kbChunksCount: 'chunks',
    // FAQs
    kbFaqNew: 'New FAQ',
    kbFaqSearch: 'Search FAQs',
    kbFaqLoading: 'Loading FAQs…',
    kbFaqErrorTitle: 'Couldn’t load FAQs',
    kbFaqEmptyTitle: 'No FAQs yet',
    kbFaqEmptyDesc: 'Add your first FAQ so the AI can answer common questions in your customers’ own words.',
    kbFaqEmptyCta: 'Add a FAQ',
    kbFaqNoResults: 'No FAQs match your search',
    kbFaqActiveLabel: 'Active',
    kbFaqCreateTitle: 'New FAQ',
    kbFaqEditTitle: 'Edit FAQ',
    kbQuestionLabel: 'Question',
    kbQuestionPlaceholder: 'e.g. What are your business hours?',
    kbAnswerLabel: 'Answer',
    kbAnswerPlaceholder: 'The answer the AI should give…',
    kbFaqRequired: 'Question and answer are both required.',
    kbFaqDeleteTitle: 'Delete this FAQ?',
    kbFaqDeleteBody: 'It will be removed from the knowledge base and the AI will no longer use it.',
    kbFaqCreatedToast: 'FAQ added — indexing…',
    kbFaqUpdatedToast: 'FAQ updated — reindexing…',
    kbFaqDeletedToast: 'FAQ deleted',
    // Documents
    kbDocUpload: 'Upload document',
    kbDocChooseFile: 'Choose a PDF, DOCX or TXT file',
    kbDocTitleLabel: 'Title (optional)',
    kbDocTitlePlaceholder: 'Defaults to the file name',
    kbDocUploading: 'Uploading…',
    kbDocLoading: 'Loading documents…',
    kbDocEmptyTitle: 'No documents yet',
    kbDocEmptyDesc: 'Upload a PDF, Word document or text file to add it to the knowledge base.',
    kbDocDeleteTitle: 'Delete this document?',
    kbDocDeleteBody: 'It will be removed from the knowledge base and the AI will no longer use it.',
    kbDocUploadedToast: 'Document uploaded — indexing…',
    kbDocDeletedToast: 'Document deleted',
    // Websites
    kbWebAdd: 'Add website',
    kbWebUrlLabel: 'URL',
    kbWebUrlPlaceholder: 'https://example.com/help',
    kbWebTitleLabel: 'Title (optional)',
    kbWebTitlePlaceholder: 'Defaults to the URL',
    kbWebAdding: 'Adding…',
    kbWebLoading: 'Loading websites…',
    kbWebEmptyTitle: 'No websites yet',
    kbWebEmptyDesc: 'Add a help-center or FAQ page URL to pull its content into the knowledge base.',
    kbWebDeleteTitle: 'Delete this website?',
    kbWebDeleteBody: 'It will be removed from the knowledge base and the AI will no longer use it.',
    kbWebAddedToast: 'Website added — indexing…',
    kbWebDeletedToast: 'Website deleted',
    kbWebUrlInvalid: 'Enter a valid http(s) URL.',
  },
  ar: {
    kbNav: 'قاعدة المعرفة',
    kbNavDesc: 'درّب الذكاء الاصطناعي',
    kbEyebrow: 'قاعدة المعرفة',
    kbTitle: 'قاعدة المعرفة',
    kbLead: 'الأسئلة الشائعة والمستندات والمواقع اللي الذكاء الاصطناعي بيعتمد عليها عشان يقترح — وبعدين يبعت تلقائيًا — ردود لعملائك.',
    kbTabFaqs: 'الأسئلة الشائعة',
    kbTabDocuments: 'المستندات',
    kbTabWebsites: 'المواقع',
    kbRetry: 'إعادة المحاولة',
    kbEdit: 'تعديل',
    kbDelete: 'حذف',
    kbCancel: 'إلغاء',
    kbSave: 'حفظ',
    kbSaving: 'جاري الحفظ…',
    kbConfirmDelete: 'حذف',
    kbErrorToast: 'حصل خطأ ما',
    kbReindex: 'إعادة الفهرسة',
    kbReindexToast: 'بدأت إعادة الفهرسة',
    kbLanguageLabel: 'اللغة',
    kbLanguageEnglish: 'إنجليزي',
    kbLanguageArabic: 'عربي',
    kbStatusPending: 'قيد الانتظار',
    kbStatusProcessing: 'جاري المعالجة',
    kbStatusIndexed: 'مفهرس',
    kbStatusFailed: 'فشل',
    kbChunksCount: 'جزء',
    // FAQs
    kbFaqNew: 'سؤال جديد',
    kbFaqSearch: 'ابحث في الأسئلة',
    kbFaqLoading: 'بنحمّل الأسئلة الشائعة…',
    kbFaqErrorTitle: 'تعذّر تحميل الأسئلة',
    kbFaqEmptyTitle: 'لسه مفيش أسئلة شائعة',
    kbFaqEmptyDesc: 'أضف أول سؤال شائع عشان الذكاء الاصطناعي يقدر يرد على الأسئلة المتكررة بكلمات عملائك.',
    kbFaqEmptyCta: 'أضف سؤال',
    kbFaqNoResults: 'مفيش أسئلة مطابقة لبحثك',
    kbFaqActiveLabel: 'مفعّل',
    kbFaqCreateTitle: 'سؤال جديد',
    kbFaqEditTitle: 'تعديل السؤال',
    kbQuestionLabel: 'السؤال',
    kbQuestionPlaceholder: 'مثال: إيه مواعيد العمل عندكم؟',
    kbAnswerLabel: 'الإجابة',
    kbAnswerPlaceholder: 'الإجابة اللي الذكاء الاصطناعي هيردها…',
    kbFaqRequired: 'السؤال والإجابة مطلوبين.',
    kbFaqDeleteTitle: 'حذف السؤال ده؟',
    kbFaqDeleteBody: 'هيتشال من قاعدة المعرفة ومش هيستخدمه الذكاء الاصطناعي تاني.',
    kbFaqCreatedToast: 'تمت إضافة السؤال — جاري الفهرسة…',
    kbFaqUpdatedToast: 'تم تحديث السؤال — جاري إعادة الفهرسة…',
    kbFaqDeletedToast: 'تم حذف السؤال',
    // Documents
    kbDocUpload: 'رفع مستند',
    kbDocChooseFile: 'اختار ملف PDF أو DOCX أو TXT',
    kbDocTitleLabel: 'العنوان (اختياري)',
    kbDocTitlePlaceholder: 'الافتراضي اسم الملف',
    kbDocUploading: 'جاري الرفع…',
    kbDocLoading: 'بنحمّل المستندات…',
    kbDocEmptyTitle: 'لسه مفيش مستندات',
    kbDocEmptyDesc: 'ارفع ملف PDF أو Word أو نصي عشان تضيفه لقاعدة المعرفة.',
    kbDocDeleteTitle: 'حذف المستند ده؟',
    kbDocDeleteBody: 'هيتشال من قاعدة المعرفة ومش هيستخدمه الذكاء الاصطناعي تاني.',
    kbDocUploadedToast: 'تم رفع المستند — جاري الفهرسة…',
    kbDocDeletedToast: 'تم حذف المستند',
    // Websites
    kbWebAdd: 'إضافة موقع',
    kbWebUrlLabel: 'الرابط',
    kbWebUrlPlaceholder: 'https://example.com/help',
    kbWebTitleLabel: 'العنوان (اختياري)',
    kbWebTitlePlaceholder: 'الافتراضي الرابط',
    kbWebAdding: 'جاري الإضافة…',
    kbWebLoading: 'بنحمّل المواقع…',
    kbWebEmptyTitle: 'لسه مفيش مواقع',
    kbWebEmptyDesc: 'أضف رابط صفحة مساعدة أو أسئلة شائعة عشان نجيب محتواها لقاعدة المعرفة.',
    kbWebDeleteTitle: 'حذف الموقع ده؟',
    kbWebDeleteBody: 'هيتشال من قاعدة المعرفة ومش هيستخدمه الذكاء الاصطناعي تاني.',
    kbWebAddedToast: 'تمت إضافة الموقع — جاري الفهرسة…',
    kbWebDeletedToast: 'تم حذف الموقع',
    kbWebUrlInvalid: 'ادخل رابط http(s) صحيح.',
  },
};
