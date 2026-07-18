import { ChangeDetectionStrategy, Component, computed, inject, input, output, signal } from '@angular/core';

import { LanguageService, type TranslationKey } from '../../../../core/services/language.service';
import { IconComponent } from '../../../../shared/components/icon/icon.component';
import { AiSkeletonComponent } from '../ai-skeleton/ai-skeleton.component';
import type { ConversationSummary } from '../../models/conversation.model';

/**
 * FE-4.3 — always-available conversation summary card, shown at the top of any open conversation.
 * Displays the AI one-line summary, offers an on-demand full structured summary, and surfaces
 * loading (skeleton), stale, error, and "taking longer than usual" states (FE-4.5). Presentational
 * only — the parent owns the API calls and passes state down.
 */
@Component({
  selector: 'app-conversation-summary',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconComponent, AiSkeletonComponent],
  template: `
    <section class="cs" [attr.dir]="direction()">
      <button type="button" class="cs__head" (click)="collapsed.set(!collapsed())"
              [attr.aria-expanded]="!collapsed()">
        <app-icon name="sparkles" [size]="15" />
        <span class="cs__title">{{ t('aiSummaryTitle') }}</span>
        @if (summary()?.isStale && !loading()) {
          <span class="cs__stale" [title]="t('aiSummaryStale')">{{ t('aiSummaryStale') }}</span>
        }
        <span class="cs__spacer"></span>
        @if (!collapsed() && summary() && !loading() && !error()) {
          <span class="cs__action" role="button" tabindex="0"
                [title]="t('aiSummaryRefresh')" [attr.aria-label]="t('aiSummaryRefresh')"
                (click)="onRefresh($event)" (keydown.enter)="onRefresh($event)">
            <app-icon name="sparkles" [size]="13" />
          </span>
        }
        <app-icon class="cs__chev" [class.cs__chev--open]="!collapsed()" name="chevron-down" [size]="16" />
      </button>

      @if (!collapsed()) {
        <div class="cs__body">
          @if (loading()) {
            <app-ai-skeleton [lines]="2" [label]="t('aiSummaryGenerating')" />
            @if (slow()) { <p class="cs__slow">{{ t('aiSummarySlow') }}</p> }
          } @else if (error()) {
            <p class="cs__error">{{ t('aiSummaryUnavailable') }}</p>
            <button type="button" class="ui-btn ui-btn--ghost ui-btn--sm" (click)="retry.emit()">
              {{ t('aiSummaryRetry') }}
            </button>
          } @else if (summary(); as s) {
            <p class="cs__short">{{ s.shortSummary }}</p>

            @if (s.fullSummary) {
              <div class="cs__full">
                <span class="cs__full-title">{{ t('aiSummaryFullTitle') }}</span>
                <p class="cs__full-text">{{ s.fullSummary }}</p>
              </div>
            }

            <div class="cs__foot">
              @if (fullLoading()) {
                <app-ai-skeleton variant="typing" [label]="t('aiSummaryGenerating')" />
              } @else {
                <button type="button" class="ui-btn ui-btn--ghost ui-btn--sm" (click)="generateFull.emit()">
                  <app-icon name="cpu" [size]="14" />
                  {{ t('aiSummaryGenerateFull') }}
                </button>
              }
            </div>
          } @else {
            <p class="cs__empty">{{ t('aiSummaryEmpty') }}</p>
          }
        </div>
      }
    </section>
  `,
  styles: [`
    :host { display: block; }
    .cs {
      margin: 10px 16px 0;
      border: 1px solid color-mix(in srgb, var(--accent) 26%, var(--border-subtle));
      border-radius: 14px;
      background: color-mix(in srgb, var(--accent) 5%, var(--surface));
      overflow: hidden;
    }
    .cs__head {
      display: flex; align-items: center; gap: 8px; width: 100%;
      padding: 9px 12px; border: 0; background: transparent; cursor: pointer;
      color: var(--text-secondary); text-align: start;
    }
    .cs__head app-icon { color: var(--accent); }
    .cs__title { font-size: 0.8rem; font-weight: 750; color: var(--text-primary); }
    .cs__spacer { flex: 1 1 auto; }
    .cs__stale {
      font-size: 0.64rem; font-weight: 700; padding: 2px 8px; border-radius: 999px;
      background: color-mix(in srgb, #d97706 16%, transparent); color: #b45309;
      white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 45%;
    }
    .cs__action { display: inline-flex; padding: 3px; border-radius: 7px; color: var(--text-muted); cursor: pointer; }
    .cs__action:hover { color: var(--accent); background: color-mix(in srgb, var(--accent) 10%, transparent); }
    .cs__chev { color: var(--text-muted); transition: transform 160ms ease; }
    .cs__chev--open { transform: rotate(180deg); }
    .cs__body { padding: 4px 14px 12px; display: flex; flex-direction: column; gap: 10px; }
    .cs__short { margin: 0; font-size: 0.86rem; line-height: 1.55; color: var(--text-primary); white-space: pre-wrap; }
    .cs__full { padding-top: 8px; border-top: 1px dashed var(--border-subtle); }
    .cs__full-title { display: block; font-size: 0.66rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-muted); margin-bottom: 4px; }
    .cs__full-text { margin: 0; font-size: 0.83rem; line-height: 1.6; color: var(--text-secondary); white-space: pre-wrap; }
    .cs__foot { display: flex; align-items: center; }
    .cs__foot .ui-btn { display: inline-flex; align-items: center; gap: 6px; }
    .cs__foot app-icon { color: currentColor; }
    .cs__slow { margin: 2px 0 0; font-size: 0.74rem; color: var(--text-muted); font-style: italic; }
    .cs__error { margin: 0; font-size: 0.83rem; color: var(--text-secondary); }
    .cs__empty { margin: 0; font-size: 0.83rem; color: var(--text-muted); }
    .cs app-icon svg { fill: none; stroke: currentColor; stroke-width: 2; }
  `]
})
export class ConversationSummaryComponent {
  private readonly language = inject(LanguageService);

  readonly summary = input<ConversationSummary | null>(null);
  readonly loading = input(false);
  readonly fullLoading = input(false);
  readonly error = input(false);
  readonly slow = input(false);

  readonly generateFull = output<void>();
  readonly refresh = output<void>();
  readonly retry = output<void>();

  protected readonly collapsed = signal(false);

  protected t = (key: TranslationKey): string => this.language.text(key);
  protected direction = (): 'rtl' | 'ltr' => this.language.getDirection();

  protected onRefresh(event: Event): void {
    event.stopPropagation();
    this.refresh.emit();
  }
}
