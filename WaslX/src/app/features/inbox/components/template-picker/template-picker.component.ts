import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, computed, inject, input, output, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { LanguageService, type TranslationKey } from '../../../../core/services/language.service';
import { TemplatesApiService } from '../../../../core/api/templates-api.service';
import { IconComponent } from '../../../../shared/components/icon/icon.component';
import type { TemplateHeaderParam, TemplateButtonParam } from '../../../../core/models/platform.models';
import type { Template } from '../../../templates/models/template.model';

export interface TemplateSendPayload {
  templateName: string;
  languageCode: string;
  header?: TemplateHeaderParam | null;
  body: string[];
  buttons?: TemplateButtonParam[];
}

/** A dynamic URL button that needs a runtime value (its URL contains a {{n}} placeholder). */
interface DynamicButton {
  index: number;
  label: string;
}

/**
 * Approved-template browser + full parameter fill (FE-2.7). Lists only APPROVED templates (the only
 * ones Meta lets you send) and collects every placeholder a template actually has: a text or media
 * HEADER, the BODY {{n}} variables, dynamic URL buttons, and — for AUTHENTICATION templates — the OTP
 * code. Emits a fully-structured send payload.
 */
@Component({
  selector: 'app-template-picker',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconComponent],
  template: `
    <div class="tp-overlay" (click)="close.emit()">
      <div class="tp-modal" role="dialog" aria-modal="true" (click)="$event.stopPropagation()">
        <header class="tp-head">
          <div>
            <h3 class="tp-title">{{ t('pickerTitle') }}</h3>
            <p class="tp-note">{{ t('pickerApprovedNote') }}</p>
          </div>
          <button type="button" class="tp-close" (click)="close.emit()" aria-label="close">
            <app-icon name="x" [size]="18" />
          </button>
        </header>

        <div class="tp-body">
          @if (loading()) {
            <p class="tp-state">{{ t('pickerLoading') }}</p>
          } @else if (templates().length === 0) {
            <p class="tp-state">{{ t('pickerEmpty') }}</p>
          } @else if (selected(); as tpl) {
            <button type="button" class="tp-back" (click)="clearSelection()">
              <app-icon name="chevron-left" [size]="15" /> {{ tpl.name }}
            </button>

            <!-- Full preview: header / body / footer / buttons (T4) -->
            <div class="tp-preview">
              @if (headerMediaKind()) {
                <p class="tp-preview__media"><app-icon name="paperclip" [size]="14" /> {{ headerMediaLabel() }}</p>
              } @else if (headerPreview()) {
                <p class="tp-preview__header">{{ headerPreview() }}</p>
              }
              @if (bodyPreview()) {
                <p class="tp-preview__body">{{ bodyPreview() }}</p>
              }
              @if (tpl.footerText) {
                <p class="tp-preview__footer">{{ tpl.footerText }}</p>
              }
              @if (tpl.buttons.length > 0) {
                <div class="tp-preview__buttons">
                  @for (b of tpl.buttons; track $index) {
                    <span class="tp-preview__button">{{ b.text || b.type }}</span>
                  }
                </div>
              }
            </div>

            @if (gapWarning()) {
              <p class="tp-warn">{{ t('pickerVariableGap') }}</p>
            }

            @if (isAuth()) {
              <!-- Authentication: a single OTP code fills both the body and the copy-code button. -->
              <p class="tp-varhead">{{ t('pickerOtpCode') }}</p>
              <label class="tp-var">
                <input class="ui-input" [value]="otpCode()" (input)="setOtp($event)" [placeholder]="t('pickerOtpCode')" />
              </label>
            } @else {
              @if (headerTextVar()) {
                <p class="tp-varhead">{{ t('pickerHeader') }}</p>
                <label class="tp-var">
                  <input class="ui-input" [value]="headerText()" (input)="setHeaderText($event)" />
                </label>
              }

              @if (headerMediaKind(); as kind) {
                <p class="tp-varhead">{{ t('pickerHeaderMedia') }}</p>
                <div class="tp-media">
                  <input #mediaInput type="file" class="tp-media__input" [accept]="mediaAccept()" (change)="onMediaSelected($event)" />
                  <button type="button" class="ui-btn ui-btn--ghost" [disabled]="headerUploading()" (click)="mediaInput.click()">
                    {{ headerUploading() ? t('pickerUploading') : (headerMediaUrl() ? t('pickerReplaceFile') : t('pickerChooseFile')) }}
                  </button>
                  @if (headerMediaName()) { <span class="tp-media__name">{{ headerMediaName() }}</span> }
                </div>
                @if (mediaError()) { <p class="tp-warn">{{ t('pickerMediaError') }}</p> }
              }

              @if (variableCount() > 0) {
                <p class="tp-varhead">{{ t('pickerVariables') }}</p>
                <div class="tp-vars">
                  @for (i of variableIndexes(); track i) {
                    <label class="tp-var">
                      <span class="tp-var__label">{{ t('pickerVariable') }} {{ i + 1 }}</span>
                      <input class="ui-input" [value]="variableValues()[i]" (input)="setVariable(i, $event)" />
                    </label>
                  }
                </div>
              }

              @if (dynamicButtons().length > 0) {
                <p class="tp-varhead">{{ t('pickerButtonUrl') }}</p>
                <div class="tp-vars">
                  @for (b of dynamicButtons(); track b.index) {
                    <label class="tp-var">
                      <span class="tp-var__label">{{ b.label }}</span>
                      <input class="ui-input" [value]="buttonValue(b.index)" (input)="setButton(b.index, $event)" />
                    </label>
                  }
                </div>
              }
            }
          } @else {
            <ul class="tp-list">
              @for (tpl of templates(); track tpl.id) {
                <li>
                  <button type="button" class="tp-item" (click)="selectTemplate(tpl)">
                    <span class="tp-item__name">{{ tpl.name }}</span>
                    <span class="tp-item__meta">
                      <span class="ui-pill ui-pill--soft">{{ tpl.language }}</span>
                    </span>
                    @if (tpl.bodyText) {
                      <span class="tp-item__body">{{ tpl.bodyText }}</span>
                    }
                  </button>
                </li>
              }
            </ul>
          }
        </div>

        @if (selected()) {
          <footer class="tp-foot">
            <button type="button" class="ui-btn ui-btn--ghost" (click)="clearSelection()" [disabled]="sending()">
              {{ t('pickerCancel') }}
            </button>
            <button type="button" class="ui-btn ui-btn--primary" [disabled]="sending() || !canSend()" (click)="emitSend()">
              {{ sending() ? t('pickerSending') : t('pickerSend') }}
            </button>
          </footer>
        }
      </div>
    </div>
  `,
  styles: [`
    .tp-overlay { position: absolute; inset: 0; z-index: 40; display: grid; place-items: end center;
      background: color-mix(in srgb, #000 32%, transparent); padding: 0 0 76px; }
    [dir='rtl'] .tp-overlay { direction: rtl; }
    .tp-modal { width: min(460px, calc(100% - 24px)); max-height: 70%; display: flex; flex-direction: column;
      background: var(--surface); border: 1px solid var(--border-subtle); border-radius: 16px; box-shadow: var(--shadow-lg, 0 20px 50px rgba(0,0,0,.3)); overflow: hidden; }
    .tp-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 10px; padding: 16px 18px; border-bottom: 1px solid var(--border-subtle); }
    .tp-title { margin: 0; font-size: 1rem; font-weight: 700; color: var(--text-primary); }
    .tp-note { margin: 2px 0 0; font-size: 0.76rem; color: var(--text-muted); }
    .tp-close { border: 0; background: transparent; color: var(--text-muted); cursor: pointer; display: grid; place-items: center; }
    .tp-body { padding: 12px 16px; overflow-y: auto; }
    .tp-state { color: var(--text-muted); text-align: center; padding: 24px; font-size: 0.88rem; }
    .tp-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 8px; }
    .tp-item { width: 100%; text-align: start; display: grid; gap: 4px; padding: 10px 12px; border: 1px solid var(--border-soft);
      border-radius: 12px; background: var(--surface-soft); cursor: pointer; }
    .tp-item:hover { border-color: color-mix(in srgb, var(--primary) 40%, var(--border-soft)); }
    .tp-item__name { font-weight: 700; color: var(--text-primary); font-size: 0.9rem; }
    .tp-item__meta { display: flex; gap: 6px; }
    .tp-item__body { font-size: 0.8rem; color: var(--text-secondary); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .tp-back { display: inline-flex; align-items: center; gap: 4px; border: 0; background: transparent; color: var(--primary);
      font-weight: 700; font-size: 0.86rem; cursor: pointer; padding: 0 0 8px; }
    .tp-preview { margin: 0 0 12px; padding: 10px 12px; border-radius: 10px; background: var(--surface-soft); border: 1px solid var(--border-soft);
      font-size: 0.86rem; color: var(--text-primary); line-height: 1.5; display: flex; flex-direction: column; gap: 6px; }
    .tp-preview__header { margin: 0; font-weight: 700; }
    .tp-preview__media { margin: 0; display: inline-flex; align-items: center; gap: 6px; font-weight: 600; color: var(--text-secondary); }
    .tp-preview__media svg { fill: none; stroke: currentColor; stroke-width: 2; }
    .tp-preview__body { margin: 0; white-space: pre-wrap; }
    .tp-preview__footer { margin: 0; font-size: 0.78rem; color: var(--text-muted); }
    .tp-preview__buttons { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 2px; }
    .tp-preview__button { font-size: 0.76rem; font-weight: 600; color: var(--primary);
      border: 1px solid color-mix(in srgb, var(--primary) 35%, var(--border-soft)); border-radius: 8px; padding: 3px 10px; }
    .tp-warn { margin: 0 0 10px; font-size: 0.76rem; color: #b45309; }
    .tp-varhead { margin: 0 0 8px; font-size: 0.78rem; font-weight: 700; color: var(--text-secondary); }
    .tp-vars { display: flex; flex-direction: column; gap: 8px; margin-bottom: 10px; }
    .tp-var { display: flex; flex-direction: column; gap: 3px; margin-bottom: 10px; }
    .tp-var__label { font-size: 0.74rem; color: var(--text-muted); }
    .tp-media { display: flex; align-items: center; gap: 10px; margin-bottom: 6px; }
    .tp-media__input { display: none; }
    .tp-media__name { font-size: 0.78rem; color: var(--text-secondary); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .tp-foot { display: flex; justify-content: flex-end; gap: 10px; padding: 12px 16px; border-top: 1px solid var(--border-subtle); }
  `]
})
export class TemplatePickerComponent implements OnInit {
  private readonly api = inject(TemplatesApiService);
  private readonly language = inject(LanguageService);
  private readonly destroyRef = inject(DestroyRef);

  readonly sending = input(false);
  readonly close = output<void>();
  readonly send = output<TemplateSendPayload>();

  protected readonly templates = signal<Template[]>([]);
  protected readonly loading = signal(true);
  protected readonly selected = signal<Template | null>(null);

  // Body variables
  protected readonly variableValues = signal<string[]>([]);
  // Header text variable
  protected readonly headerText = signal('');
  // Header media
  protected readonly headerMediaUrl = signal<string | null>(null);
  protected readonly headerMediaName = signal<string | null>(null);
  protected readonly headerUploading = signal(false);
  protected readonly mediaError = signal(false);
  // Dynamic URL buttons (keyed by button index)
  protected readonly buttonValues = signal<Record<number, string>>({});
  // Authentication OTP code
  protected readonly otpCode = signal('');

  protected readonly isAuth = computed(() => (this.selected()?.category ?? '').toUpperCase() === 'AUTHENTICATION');

  protected readonly variableCount = computed(() => countVariables(this.selected()?.bodyText ?? ''));
  protected readonly variableIndexes = computed(() => Array.from({ length: this.variableCount() }, (_, i) => i));
  protected readonly gapWarning = computed(() => hasGaps(this.selected()?.bodyText ?? ''));

  /** True when the (TEXT) header carries a {{n}} placeholder that needs a runtime value. */
  protected readonly headerTextVar = computed(() => {
    const tpl = this.selected();
    return (tpl?.headerFormat ?? '').toUpperCase() === 'TEXT' && /\{\{\d+\}\}/.test(tpl?.headerText ?? '');
  });

  /** 'image' | 'video' | 'document' when the template has a media header; null otherwise. */
  protected readonly headerMediaKind = computed<'image' | 'video' | 'document' | null>(() => {
    switch ((this.selected()?.headerFormat ?? '').toUpperCase()) {
      case 'IMAGE': return 'image';
      case 'VIDEO': return 'video';
      case 'DOCUMENT': return 'document';
      default: return null;
    }
  });

  /** Dynamic URL buttons (type URL whose url contains a {{n}} placeholder) needing a runtime suffix. */
  protected readonly dynamicButtons = computed<DynamicButton[]>(() => {
    const tpl = this.selected();
    if (!tpl) return [];
    const out: DynamicButton[] = [];
    tpl.buttons.forEach((b, index) => {
      if (b.type.toUpperCase() === 'URL' && (b.url ?? '').includes('{{')) {
        out.push({ index, label: b.text || b.url || `URL ${index + 1}` });
      }
    });
    return out;
  });

  protected readonly mediaAccept = computed(() => {
    switch (this.headerMediaKind()) {
      case 'image': return 'image/*';
      case 'video': return 'video/*';
      default: return '.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv';
    }
  });

  protected readonly headerMediaLabel = computed(() => {
    switch (this.headerMediaKind()) {
      case 'image': return this.t('pickerHeaderImage');
      case 'video': return this.t('pickerHeaderVideo');
      default: return this.t('pickerHeaderDocument');
    }
  });

  // Preview text (body filled with entered values; header filled with its value)
  protected readonly bodyPreview = computed(() => {
    if (this.isAuth()) return this.selected()?.bodyText ?? '';
    return fillVariables(this.selected()?.bodyText ?? '', this.variableValues());
  });
  protected readonly headerPreview = computed(() => {
    const tpl = this.selected();
    if (!tpl?.headerText) return '';
    return this.headerTextVar() ? fillVariables(tpl.headerText, [this.headerText()]) : tpl.headerText;
  });

  protected readonly canSend = computed(() => {
    if (this.isAuth()) return this.otpCode().trim().length > 0;
    if (this.headerTextVar() && this.headerText().trim().length === 0) return false;
    if (this.headerMediaKind() && !this.headerMediaUrl()) return false;
    if (!this.variableValues().slice(0, this.variableCount()).every((v) => v?.trim().length > 0)) return false;
    const vals = this.buttonValues();
    return this.dynamicButtons().every((b) => (vals[b.index] ?? '').trim().length > 0);
  });

  protected t = (key: TranslationKey): string => this.language.text(key);

  ngOnInit(): void {
    this.api.list('APPROVED').pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (list) => { this.templates.set(list); this.loading.set(false); },
      error: () => { this.templates.set([]); this.loading.set(false); }
    });
  }

  protected selectTemplate(tpl: Template): void {
    this.selected.set(tpl);
    this.variableValues.set(Array.from({ length: countVariables(tpl.bodyText ?? '') }, () => ''));
    this.headerText.set('');
    this.buttonValues.set({});
    this.otpCode.set('');
    this.clearMedia();
  }

  protected clearSelection(): void {
    this.selected.set(null);
    this.variableValues.set([]);
    this.headerText.set('');
    this.buttonValues.set({});
    this.otpCode.set('');
    this.clearMedia();
  }

  private clearMedia(): void {
    this.headerMediaUrl.set(null);
    this.headerMediaName.set(null);
    this.headerUploading.set(false);
    this.mediaError.set(false);
  }

  protected setVariable(index: number, event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.variableValues.update((vals) => {
      const next = [...vals];
      next[index] = value;
      return next;
    });
  }

  protected setHeaderText(event: Event): void {
    this.headerText.set((event.target as HTMLInputElement).value);
  }

  protected buttonValue(index: number): string {
    return this.buttonValues()[index] ?? '';
  }

  protected setButton(index: number, event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.buttonValues.update((vals) => ({ ...vals, [index]: value }));
  }

  protected setOtp(event: Event): void {
    this.otpCode.set((event.target as HTMLInputElement).value);
  }

  protected onMediaSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;
    input.value = '';
    if (!file) return;

    this.mediaError.set(false);
    this.headerUploading.set(true);
    this.headerMediaName.set(file.name);
    this.api.uploadMedia(file).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => { this.headerMediaUrl.set(res.url); this.headerUploading.set(false); },
      error: () => { this.headerUploading.set(false); this.headerMediaUrl.set(null); this.headerMediaName.set(null); this.mediaError.set(true); }
    });
  }

  protected emitSend(): void {
    const tpl = this.selected();
    if (!tpl || !this.canSend()) return;

    // AUTHENTICATION: the OTP code fills both the body parameter and the copy-code button (index 0).
    if (this.isAuth()) {
      const code = this.otpCode().trim();
      this.send.emit({
        templateName: tpl.name,
        languageCode: tpl.language,
        body: [code],
        buttons: [{ index: 0, subType: 'copy_code', text: code }]
      });
      return;
    }

    let header: TemplateHeaderParam | null = null;
    if (this.headerTextVar()) {
      header = { kind: 'text', text: this.headerText().trim() };
    } else if (this.headerMediaKind()) {
      header = { kind: this.headerMediaKind()!, mediaLink: this.headerMediaUrl()! };
    }

    const vals = this.buttonValues();
    const buttons: TemplateButtonParam[] = this.dynamicButtons().map((b) => ({
      index: b.index,
      subType: 'url',
      text: (vals[b.index] ?? '').trim()
    }));

    this.send.emit({
      templateName: tpl.name,
      languageCode: tpl.language,
      header,
      body: this.variableValues().slice(0, this.variableCount()).map((v) => v.trim()),
      buttons: buttons.length > 0 ? buttons : undefined
    });
  }
}

function countVariables(body: string): number {
  let max = 0;
  for (const m of body.matchAll(/\{\{(\d+)\}\}/g)) {
    const n = Number(m[1]);
    if (n > max) max = n;
  }
  return max;
}

/** True when the {{n}} numbering has gaps (e.g. {{1}} and {{3}} but no {{2}}). */
function hasGaps(body: string): boolean {
  const seen = new Set<number>();
  let max = 0;
  for (const m of body.matchAll(/\{\{(\d+)\}\}/g)) {
    const n = Number(m[1]);
    seen.add(n);
    if (n > max) max = n;
  }
  return max > 0 && seen.size < max;
}

function fillVariables(body: string, values: string[]): string {
  return body.replace(/\{\{(\d+)\}\}/g, (_, n) => {
    const v = values[Number(n) - 1];
    return v?.trim() ? v : `{{${n}}}`;
  });
}
