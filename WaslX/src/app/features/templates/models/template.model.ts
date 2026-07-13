export type TemplateCategory = 'MARKETING' | 'UTILITY' | 'AUTHENTICATION';

export interface TemplateButton {
  type: string;
  text: string | null;
  url: string | null;
  phoneNumber: string | null;
}

export interface Template {
  id: string;
  name: string;
  language: string;
  category: string;
  status: string;
  headerText: string | null;
  headerFormat: string | null;
  bodyText: string | null;
  footerText: string | null;
  buttons: TemplateButton[];
  reasonCode: string | null;
  reasonText: string | null;
  metaNotes: string | null;
  submittedCategory: string | null;
  finalCategory: string | null;
  allowCategoryChange: boolean;
  changedByMeta: boolean;
  reviewedAt: string | null;
  pauseInfo: string | null;
  disableTimestamp: string | null;
  isDeleted: boolean;
}

export interface CreateTemplateButton {
  type: 'QUICK_REPLY' | 'URL';
  text: string;
  url?: string | null;
}

export interface CreateTemplateInput {
  name: string;
  category: TemplateCategory;
  language: string;
  headerText?: string | null;
  bodyText?: string | null;
  footerText?: string | null;
  buttons: CreateTemplateButton[];
  allowCategoryChange: boolean;
}

export interface TemplateCreateResult {
  id: string;
  status: string;
  category: string;
}
