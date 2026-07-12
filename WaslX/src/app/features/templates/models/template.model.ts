// ─────────────────────────────────────────────────────────────────────────────
// WhatsApp message-template models (mirror WaslX.Application Templates DTOs).
// ─────────────────────────────────────────────────────────────────────────────

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
  bodyText: string | null;
  footerText: string | null;
  buttons: TemplateButton[];
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
}

export interface TemplateCreateResult {
  id: string;
  status: string;
  category: string;
}
