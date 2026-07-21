import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, effect, signal } from '@angular/core';

import { type AppLanguage, type AppDirection } from '../i18n/language.types';

import {
  type AuthKey,
  authTranslations,
  type CampaignsKey,
  campaignsTranslations,
  type ChannelsKey,
  channelsTranslations,
  type ContactsKey,
  contactsTranslations,
  type DashboardKey,
  dashboardTranslations,
  type InboxKey,
  inboxTranslations,
  type KnowledgeBaseKey,
  knowledgeBaseTranslations,
  type LayoutKey,
  layoutTranslations,
  type LandingKey,
  landingTranslations,
  type OnboardingKey,
  onboardingTranslations,
  type SettingsKey,
  settingsTranslations,
  type SharedKey,
  sharedTranslations,
  type TagsKey,
  tagsTranslations,
  type TeamsKey,
  teamsTranslations,
  type PipelineKey,
  pipelineTranslations,
  type TemplatesKey,
  templatesTranslations,
  type UsersKey,
  usersTranslations,
  type WorkingHoursKey,
  workingHoursTranslations,
  type ReportingKey,
  reportingTranslations,
  type NotificationsKey,
  notificationsTranslations,
  type AuditKey,
  auditTranslations,
  type PlatformConsoleKey,
  platformConsoleTranslations,
} from '../i18n';

export type { AppLanguage, AppDirection };

// ─── Combined TranslationKey type ────────────────────────────────────────────
// All keys from all i18n files merged into one union type.

export type TranslationKey =
  | AiKey
  | KnowledgeBaseKey
  | SharedKey
  | LayoutKey
  | AuthKey
  | LandingKey
  | DashboardKey
  | InboxKey
  | UsersKey
  | TeamsKey
  | CampaignsKey
  | PipelineKey
  | ContactsKey
  | SettingsKey
  | OnboardingKey
  | TemplatesKey
  | ChannelsKey
  | TagsKey
  | WorkingHoursKey
  | ReportingKey
  | NotificationsKey
  | AuditKey
  | PlatformConsoleKey;

// ─── Merged translations map ──────────────────────────────────────────────────

const translations: Record<AppLanguage, Record<TranslationKey, string>> = {
  en: {
    ...sharedTranslations.en,
    ...layoutTranslations.en,
    ...authTranslations.en,
    ...landingTranslations.en,
    ...dashboardTranslations.en,
    ...inboxTranslations.en,
    ...usersTranslations.en,
    ...teamsTranslations.en,
    ...campaignsTranslations.en,
    ...pipelineTranslations.en,
    ...contactsTranslations.en,
    ...settingsTranslations.en,
    ...onboardingTranslations.en,
    ...templatesTranslations.en,
    ...channelsTranslations.en,
    ...tagsTranslations.en,
    ...workingHoursTranslations.en,
    ...reportingTranslations.en,
    ...notificationsTranslations.en,
    ...auditTranslations.en,
    ...platformConsoleTranslations.en,
  } as Record<TranslationKey, string>,
  ar: {
    ...sharedTranslations.ar,
    ...layoutTranslations.ar,
    ...authTranslations.ar,
    ...landingTranslations.ar,
    ...dashboardTranslations.ar,
    ...inboxTranslations.ar,
    ...usersTranslations.ar,
    ...teamsTranslations.ar,
    ...campaignsTranslations.ar,
    ...pipelineTranslations.ar,
    ...contactsTranslations.ar,
    ...settingsTranslations.ar,
    ...onboardingTranslations.ar,
    ...templatesTranslations.ar,
    ...channelsTranslations.ar,
    ...tagsTranslations.ar,
    ...workingHoursTranslations.ar,
    ...reportingTranslations.ar,
    ...notificationsTranslations.ar,
    ...auditTranslations.ar,
    ...platformConsoleTranslations.ar,
  } as Record<TranslationKey, string>,
};

// ─── Language Service ─────────────────────────────────────────────────────────

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private static readonly storageKey = 'waslx.language';

  readonly language = signal<AppLanguage>(this.restoreLanguage());

  constructor(@Inject(DOCUMENT) private readonly document: Document) {
    effect(() => {
      const currentLanguage = this.language();
      this.document.documentElement.lang = currentLanguage;
      this.document.documentElement.dir = this.getDirection(currentLanguage);
      window.localStorage.setItem(LanguageService.storageKey, currentLanguage);
    });
  }

  setLanguage(language: AppLanguage): void {
    this.language.set(language);
  }

  toggleLanguage(): void {
    this.language.update((currentLanguage) => (currentLanguage === 'en' ? 'ar' : 'en'));
  }

  getDirection(language: AppLanguage = this.language()): AppDirection {
    return language === 'ar' ? 'rtl' : 'ltr';
  }

  text(key: TranslationKey): string {
    return translations[this.language()][key];
  }

  private restoreLanguage(): AppLanguage {
    if (typeof window === 'undefined') {
      return 'en';
    }

    const storedLanguage = window.localStorage.getItem(LanguageService.storageKey);

    return storedLanguage === 'ar' ? 'ar' : 'en';
  }
}
