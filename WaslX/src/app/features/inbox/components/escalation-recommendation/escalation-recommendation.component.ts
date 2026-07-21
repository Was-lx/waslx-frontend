import { ChangeDetectionStrategy, Component, computed, inject, input, output, signal } from '@angular/core';
import { LanguageService, type TranslationKey } from '../../../../core/services/language.service';
import { AvatarComponent } from '../../../../shared/components/avatar/avatar.component';
import { IconComponent } from '../../../../shared/components/icon/icon.component';
import type { EscalationRecommendation } from '../../models/escalation-recommendation.model';

@Component({
  selector: 'app-escalation-recommendation',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AvatarComponent, IconComponent],
  template: `
    @if (recommendation(); as r) {
      <aside class="esc-rec" [attr.dir]="direction()">
        <div class="esc-rec__header">
          <app-icon name="sparkles" [size]="16" />
          <span class="esc-rec__title">{{ t('escalationAiSuggestion') }}</span>
        </div>

        @if (r.suggestedAssigneeName && r.status === 'recommended') {
          <div class="esc-rec__agent">
            <app-avatar [name]="r.suggestedAssigneeName" [size]="36" />
            <div class="esc-rec__agent-info">
              <span class="esc-rec__agent-label">{{ t('escalationSuggestedAgent') }}</span>
              <span class="esc-rec__agent-name">{{ r.suggestedAssigneeName }}</span>
            </div>
          </div>

          <div class="esc-rec__reason">
            <span class="esc-rec__reason-label">{{ t('escalationReasonLabel') }}</span>
            <p class="esc-rec__reason-text">{{ r.reason }}</p>
          </div>

          @if (isManagerOrAdmin()) {
            <div class="esc-rec__actions">
              <button type="button" class="ui-btn ui-btn--primary"
                      [disabled]="confirming()" (click)="onConfirm()">
                @if (confirming()) {
                  <span class="ui-spinner" aria-hidden="true"></span>
                }
                {{ t('escalationConfirm') }}
              </button>
              <button type="button" class="ui-btn ui-btn--secondary"
                      [disabled]="confirming()" (click)="override.emit()">
                {{ t('escalationOverride') }}
              </button>
            </div>
          }
        }

        @if (!r.suggestedAssigneeName && r.status === 'recommended') {
          <div class="esc-rec__empty">
            <app-icon name="alert-circle" [size]="16" />
            <span>{{ t('escalationNoTarget') }}</span>
          </div>
        }

        @if (r.status === 'assigned' && r.assignedToName) {
          <div class="esc-rec__assigned">
            <app-icon name="check-circle" [size]="16" />
            <span>{{ t('escalationSuggestedAgent') }}: {{ r.assignedToName }}</span>
          </div>
        }

        @if (r.status === 'assigned' && r.mode === 'autoAssign') {
          <div class="esc-rec__mode-hint">
            <app-icon name="zap" [size]="14" />
            <span>{{ t('escalationAutoAssigned') }}</span>
          </div>
        }
      </aside>
    }
  `,
  styles: [`
    :host { display: block; }
    .esc-rec {
      display: flex; flex-direction: column; gap: 12px;
      padding: 14px 16px; border-radius: 14px;
      background: color-mix(in srgb, #8B5CF6 8%, var(--surface));
      border: 1px solid color-mix(in srgb, #8B5CF6 20%, var(--border-subtle));
    }
    .esc-rec__header { display: flex; align-items: center; gap: 8px; }
    .esc-rec__header app-icon { color: #8B5CF6; }
    .esc-rec__header svg { fill: none; stroke: currentColor; stroke-width: 2; }
    .esc-rec__title { font-size: 0.78rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.04em; color: #8B5CF6; }
    .esc-rec__agent { display: flex; align-items: center; gap: 10px; }
    .esc-rec__agent-info { display: flex; flex-direction: column; gap: 1px; }
    .esc-rec__agent-label { font-size: 0.7rem; color: var(--text-muted); }
    .esc-rec__agent-name { font-size: 0.88rem; font-weight: 650; color: var(--text-primary); }
    .esc-rec__reason { display: flex; flex-direction: column; gap: 2px; }
    .esc-rec__reason-label { font-size: 0.7rem; color: var(--text-muted); font-weight: 600; }
    .esc-rec__reason-text { margin: 0; font-size: 0.84rem; color: var(--text-secondary); line-height: 1.45; }
    .esc-rec__actions { display: flex; gap: 8px; margin-top: 4px; }
    .esc-rec__actions .ui-btn { flex: 1; }
    .esc-rec__empty { display: flex; align-items: center; gap: 8px; font-size: 0.84rem; color: var(--text-muted); }
    .esc-rec__empty app-icon { color: var(--text-muted); }
    .esc-rec__assigned { display: flex; align-items: center; gap: 8px; font-size: 0.84rem; font-weight: 600; color: #16a34a; }
    .esc-rec__assigned app-icon { color: #16a34a; }
    .esc-rec__mode-hint { display: flex; align-items: center; gap: 6px; font-size: 0.76rem; color: var(--text-muted); }
    .esc-rec__mode-hint app-icon { color: var(--text-muted); }
  `]
})
export class EscalationRecommendationComponent {
  private readonly language = inject(LanguageService);

  readonly recommendation = input<EscalationRecommendation | null>(null);
  readonly isManagerOrAdmin = input(false);
  readonly confirming = signal(false);

  readonly confirm = output<{ escalationId: number; assigneeId: number }>();
  readonly override = output<void>();

  protected t = (key: TranslationKey): string => this.language.text(key);
  protected direction = (): 'rtl' | 'ltr' => this.language.getDirection();

  protected onConfirm(): void {
    const r = this.recommendation();
    if (!r || !r.suggestedAssigneeId) return;
    this.confirming.set(true);
    this.confirm.emit({ escalationId: r.escalationId, assigneeId: r.suggestedAssigneeId });
  }
}
