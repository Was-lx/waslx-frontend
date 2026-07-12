import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, computed, inject, input, output, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { LanguageService, type TranslationKey } from '../../../../core/services/language.service';
import { TemplatesApiService } from '../../../../core/api/templates-api.service';
import { IconComponent } from '../../../../shared/components/icon/icon.component';
import type { Template } from '../../../templates/models/template.model';

export interface TemplateSendPayload {
  templateName: string;
  languageCode: string;
  variables: string[];
}

/**
 * Approved-template browser + variable fill (FE-2.7). Lists only APPROVED templates (the only ones
 * Meta lets you send), parses {{n}} placeholders from the BODY, and emits a fully-filled send payload.
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
            @if (tpl.bodyText) {
              <p class="tp-preview">{{ preview() }}</p>
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
      font-size: 0.86rem; color: var(--text-primary); white-space: pre-wrap; line-height: 1.5; }
    .tp-varhead { margin: 0 0 8px; font-size: 0.78rem; font-weight: 700; color: var(--text-secondary); }
    .tp-vars { display: flex; flex-direction: column; gap: 8px; }
    .tp-var { display: flex; flex-direction: column; gap: 3px; }
    .tp-var__label { font-size: 0.74rem; color: var(--text-muted); }
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
  protected readonly variableValues = signal<string[]>([]);

  protected readonly variableCount = computed(() => countVariables(this.selected()?.bodyText ?? ''));
  protected readonly variableIndexes = computed(() => Array.from({ length: this.variableCount() }, (_, i) => i));
  protected readonly canSend = computed(() => this.variableValues().slice(0, this.variableCount()).every((v) => v?.trim().length > 0));
  protected readonly preview = computed(() => fillVariables(this.selected()?.bodyText ?? '', this.variableValues()));

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
  }

  protected clearSelection(): void {
    this.selected.set(null);
    this.variableValues.set([]);
  }

  protected setVariable(index: number, event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.variableValues.update((vals) => {
      const next = [...vals];
      next[index] = value;
      return next;
    });
  }

  protected emitSend(): void {
    const tpl = this.selected();
    if (!tpl || !this.canSend()) return;
    this.send.emit({
      templateName: tpl.name,
      languageCode: tpl.language,
      variables: this.variableValues().slice(0, this.variableCount()).map((v) => v.trim())
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

function fillVariables(body: string, values: string[]): string {
  return body.replace(/\{\{(\d+)\}\}/g, (_, n) => {
    const v = values[Number(n) - 1];
    return v?.trim() ? v : `{{${n}}}`;
  });
}
