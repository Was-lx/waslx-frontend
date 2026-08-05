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

        @if (r.status === 'recommended' || r.status === 'open') {
          <div class="esc-rec__meta">
            @if (r.priority) {
              <span class="esc-rec__badge esc-rec__badge--priority">{{ priorityLabel(r.priority) }}</span>
            }
            @if (r.topic) {
              <span class="esc-rec__badge esc-rec__badge--topic">{{ r.topic }}</span>
            }
            @if (r.sentiment) {
              <span class="esc-rec__badge esc-rec__badge--sentiment">{{ sentimentLabel(r.sentiment) }}</span>
            }
            @if (r.score !== null && r.score !== undefined) {
              <span class="esc-rec__score">
                <span class="esc-rec__score-value">{{ formatScore(r.score) }}</span>
                <span class="esc-rec__score-label">{{ t('escalationScore') }}</span>
              </span>
            }
          </div>
        }

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

          @if (r.candidates && r.candidates.length > 0) {
            <div class="esc-rec__candidates">
              <span class="esc-rec__candidates-label">{{ t('escalationCandidates') }}</span>
              @for (c of r.candidates; track c.agentId) {
                <div class="esc-rec__candidate">
                  <div class="esc-rec__candidate-rank">#{{ c.rankingOrder }}</div>
                  <app-avatar [name]="c.agentName" [size]="24" />
                  <span class="esc-rec__candidate-name">{{ c.agentName }}</span>
                  <div class="esc-rec__candidate-bar">
                    <div class="esc-rec__candidate-fill" [style.width.%]="c.overallScore * 100"></div>
                  </div>
                  <span class="esc-rec__candidate-score">{{ formatScore(c.overallScore) }}</span>
                </div>
              }
            </div>
          }

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
              <button type="button" class="ui-btn ui-btn--ghost esc-rec__reject"
                      [disabled]="confirming()" (click)="onReject()">
                <app-icon name="x" [size]="14" />
                {{ t('escalationReject') }}
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

        @if (r.status === 'cancelled') {
          <div class="esc-rec__cancelled">
            <app-icon name="x-circle" [size]="16" />
            <span>{{ t('escalationRejected') }}</span>
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
    .esc-rec__meta { display: flex; flex-wrap: wrap; gap: 6px; align-items: center; }
    .esc-rec__badge {
      display: inline-flex; align-items: center; gap: 4px;
      padding: 2px 8px; border-radius: 6px; font-size: 0.72rem; font-weight: 700;
    }
    .esc-rec__badge--priority {
      background: color-mix(in srgb, #F59E0B 15%, transparent);
      color: #b45309;
      border: 1px solid color-mix(in srgb, #F59E0B 25%, transparent);
    }
    .esc-rec__badge--topic {
      background: color-mix(in srgb, #3B82F6 12%, transparent);
      color: #1e40af;
      border: 1px solid color-mix(in srgb, #3B82F6 20%, transparent);
    }
    .esc-rec__badge--sentiment {
      background: color-mix(in srgb, #8B5CF6 12%, transparent);
      color: #6d28d9;
      border: 1px solid color-mix(in srgb, #8B5CF6 20%, transparent);
    }
    .esc-rec__score { display: flex; align-items: baseline; gap: 4px; margin-left: auto; }
    .esc-rec__score-value { font-size: 0.95rem; font-weight: 800; color: #8B5CF6; }
    .esc-rec__score-label { font-size: 0.68rem; color: var(--text-muted); font-weight: 600; }
    .esc-rec__agent { display: flex; align-items: center; gap: 10px; }
    .esc-rec__agent-info { display: flex; flex-direction: column; gap: 1px; }
    .esc-rec__agent-label { font-size: 0.7rem; color: var(--text-muted); }
    .esc-rec__agent-name { font-size: 0.88rem; font-weight: 650; color: var(--text-primary); }
    .esc-rec__reason { display: flex; flex-direction: column; gap: 2px; }
    .esc-rec__reason-label { font-size: 0.7rem; color: var(--text-muted); font-weight: 600; }
    .esc-rec__reason-text { margin: 0; font-size: 0.84rem; color: var(--text-secondary); line-height: 1.45; }
    .esc-rec__candidates { display: flex; flex-direction: column; gap: 6px; }
    .esc-rec__candidates-label { font-size: 0.7rem; color: var(--text-muted); font-weight: 600; }
    .esc-rec__candidate { display: flex; align-items: center; gap: 6px; font-size: 0.78rem; }
    .esc-rec__candidate-rank { font-weight: 700; color: var(--text-muted); min-width: 18px; }
    .esc-rec__candidate-name { flex: 1; font-weight: 500; color: var(--text-secondary); }
    .esc-rec__candidate-bar {
      width: 60px; height: 6px; border-radius: 3px;
      background: var(--border-subtle); overflow: hidden;
    }
    .esc-rec__candidate-fill { height: 100%; border-radius: 3px; background: #8B5CF6; }
    .esc-rec__candidate-score { font-weight: 700; color: #8B5CF6; min-width: 32px; text-align: right; }
    .esc-rec__actions { display: flex; gap: 8px; margin-top: 4px; flex-wrap: wrap; }
    .esc-rec__actions .ui-btn { flex: 1; }
    .esc-rec__reject { flex: 0 0 auto !important; display: inline-flex; align-items: center; gap: 4px; color: #EF4444 !important; }
    .esc-rec__reject:hover { background: color-mix(in srgb, #EF4444 8%, transparent); }
    .esc-rec__empty { display: flex; align-items: center; gap: 8px; font-size: 0.84rem; color: var(--text-muted); }
    .esc-rec__empty app-icon { color: var(--text-muted); }
    .esc-rec__assigned { display: flex; align-items: center; gap: 8px; font-size: 0.84rem; font-weight: 600; color: #16a34a; }
    .esc-rec__assigned app-icon { color: #16a34a; }
    .esc-rec__mode-hint { display: flex; align-items: center; gap: 6px; font-size: 0.76rem; color: var(--text-muted); }
    .esc-rec__mode-hint app-icon { color: var(--text-muted); }
    .esc-rec__cancelled { display: flex; align-items: center; gap: 8px; font-size: 0.84rem; font-weight: 600; color: #EF4444; }
    .esc-rec__cancelled app-icon { color: #EF4444; }
  `]
})
export class EscalationRecommendationComponent {
  private readonly language = inject(LanguageService);

  readonly recommendation = input<EscalationRecommendation | null>(null);
  readonly isManagerOrAdmin = input(false);
  readonly confirming = signal(false);

  readonly confirm = output<{ escalationId: number; assigneeId: number }>();
  readonly override = output<void>();
  readonly reject = output<{ escalationId: number; reason: string | null }>();

  protected t = (key: TranslationKey): string => this.language.text(key);
  protected direction = (): 'rtl' | 'ltr' => this.language.getDirection();

  protected formatScore(score: number): string {
    return `${Math.round(score * 100)}%`;
  }

  protected priorityLabel(priority: string): string {
    return this.t(`priority${priority.charAt(0).toUpperCase() + priority.slice(1)}` as TranslationKey);
  }

  protected sentimentLabel(sentiment: string): string {
    return this.t(`sentiment${sentiment.charAt(0).toUpperCase() + sentiment.slice(1)}` as TranslationKey);
  }

  protected onConfirm(): void {
    const r = this.recommendation();
    if (!r || !r.suggestedAssigneeId) return;
    this.confirming.set(true);
    this.confirm.emit({ escalationId: r.escalationId, assigneeId: r.suggestedAssigneeId });
  }

  protected onReject(): void {
    const r = this.recommendation();
    if (!r) return;
    this.confirming.set(true);
    this.reject.emit({ escalationId: r.escalationId, reason: null });
  }
}
