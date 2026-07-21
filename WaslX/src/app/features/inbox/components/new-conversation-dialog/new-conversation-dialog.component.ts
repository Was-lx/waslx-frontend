import { Component, EventEmitter, Input, Output, computed, inject, signal } from '@angular/core';

import { LanguageService, type TranslationKey } from '../../../../core/services/language.service';
import { IconComponent } from '../../../../shared/components/icon/icon.component';
import type { Template } from '../../../templates/models/template.model';

/** Payload emitted when the user sends the first (template) message to a brand-new number. */
export interface NewConversationSend {
  toPhone: string;
  templateName: string;
  languageCode: string;
}

/** A dialable country code offered in the picker. */
interface DialCode {
  code: string;
  name: string;
}

// A pragmatic MENA-first list; the field also accepts any code the user types via the "Other" option.
const DIAL_CODES: readonly DialCode[] = [
  { code: '20', name: 'Egypt' },
  { code: '966', name: 'Saudi Arabia' },
  { code: '971', name: 'UAE' },
  { code: '965', name: 'Kuwait' },
  { code: '974', name: 'Qatar' },
  { code: '973', name: 'Bahrain' },
  { code: '968', name: 'Oman' },
  { code: '962', name: 'Jordan' },
  { code: '961', name: 'Lebanon' },
  { code: '964', name: 'Iraq' },
  { code: '970', name: 'Palestine' },
  { code: '967', name: 'Yemen' },
  { code: '212', name: 'Morocco' },
  { code: '213', name: 'Algeria' },
  { code: '216', name: 'Tunisia' },
  { code: '218', name: 'Libya' },
  { code: '249', name: 'Sudan' },
  { code: '1', name: 'USA / Canada' },
  { code: '44', name: 'UK' },
  { code: '90', name: 'Turkey' },
];

/**
 * Modal to start a brand-new WhatsApp conversation: pick a country code, type the number, choose an
 * approved template, and send. WhatsApp requires the first outbound to a new number to be a template.
 * The dialog only collects + validates input; the parent owns the actual send + list refresh.
 */
@Component({
  selector: 'app-new-conversation-dialog',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './new-conversation-dialog.component.html',
  styleUrl: './new-conversation-dialog.component.css',
})
export class NewConversationDialogComponent {
  private readonly language = inject(LanguageService);

  @Input() open = false;
  @Input() sending = false;
  @Input() set templates(value: Template[]) {
    this._templates.set(value ?? []);
  }

  @Output() close = new EventEmitter<void>();
  @Output() send = new EventEmitter<NewConversationSend>();

  protected readonly dialCodes = DIAL_CODES;
  protected readonly _templates = signal<Template[]>([]);

  protected readonly dialCode = signal<string>('20');
  protected readonly localNumber = signal<string>('');
  protected readonly templateName = signal<string | null>(null);
  protected readonly error = signal<string | null>(null);

  protected readonly selectedTemplate = computed(() =>
    this._templates().find((t) => t.name === this.templateName()) ?? null,
  );

  /** Full international number, digits only (matches Meta's wa_id form). */
  protected readonly fullPhone = computed(() => this.dialCode() + this.localNumber().replace(/\D/g, ''));

  protected t = (key: TranslationKey): string => this.language.text(key);
  protected direction = (): 'rtl' | 'ltr' => this.language.getDirection();

  protected onDialChange(value: string): void {
    this.dialCode.set(value.replace(/\D/g, '') || '20');
    this.error.set(null);
  }

  protected onNumberInput(value: string): void {
    this.localNumber.set(value);
    this.error.set(null);
  }

  protected onTemplateChange(name: string): void {
    this.templateName.set(name || null);
    this.error.set(null);
  }

  protected onBackdrop(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.onClose();
    }
  }

  protected onClose(): void {
    if (this.sending) {
      return;
    }
    this.reset();
    this.close.emit();
  }

  protected submit(): void {
    if (this.sending) {
      return;
    }
    const local = this.localNumber().replace(/\D/g, '');
    if (local.length < 6) {
      this.error.set(this.t('newConvNeedPhone'));
      return;
    }
    const template = this.selectedTemplate();
    if (!template) {
      this.error.set(this.t('newConvNeedTemplate'));
      return;
    }
    this.send.emit({
      toPhone: this.fullPhone(),
      templateName: template.name,
      languageCode: template.language,
    });
  }

  /** Clears the form (called by the parent after a successful send, and on close). */
  reset(): void {
    this.localNumber.set('');
    this.templateName.set(null);
    this.error.set(null);
  }
}
