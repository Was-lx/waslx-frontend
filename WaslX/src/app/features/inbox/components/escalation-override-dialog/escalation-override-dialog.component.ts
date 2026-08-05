import { ChangeDetectionStrategy, Component, computed, inject, input, output, signal, effect } from '@angular/core';
import { LanguageService, type TranslationKey } from '../../../../core/services/language.service';
import { AvatarComponent } from '../../../../shared/components/avatar/avatar.component';
import { IconComponent } from '../../../../shared/components/icon/icon.component';
import type { EscalationRecommendation, EscalationCandidateSnapshot } from '../../models/escalation-recommendation.model';

export interface AgentOption {
  id: number;
  name: string;
}

@Component({
  selector: 'app-escalation-override-dialog',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AvatarComponent, IconComponent],
  template: `
    @if (recommendation(); as r) {
      <div class="ui-overlay" (click)="cancel.emit()">
        <div class="esc-override" [attr.dir]="direction()" (click)="$event.stopPropagation()">
          <div class="esc-override__bar">
            <span class="esc-override__title">{{ t('escalationOverride') }}</span>
            <button type="button" class="esc-override__close" [attr.aria-label]="t('escalationCancel')" (click)="cancel.emit()">
              <app-icon name="x" [size]="17" />
            </button>
          </div>

          <div class="esc-override__body">
            @if (r.candidates && r.candidates.length > 0) {
              <div class="esc-override__section">
                <span class="esc-override__label">{{ t('escalationRankedCandidates') }}</span>
                @for (c of r.candidates; track c.agentId) {
                  <div class="esc-override__candidate"
                       [class.esc-override__candidate--selected]="selectedAgentId() === c.agentId.toString()"
                       (click)="selectedAgentId.set(c.agentId.toString())">
                    <div class="esc-override__candidate-rank">#{{ c.rankingOrder }}</div>
                    <app-avatar [name]="c.agentName" [size]="32" />
                    <div class="esc-override__candidate-info">
                      <span class="esc-override__candidate-name">{{ c.agentName }}</span>
                      <span class="esc-override__candidate-detail">
                        {{ formatScore(c.overallScore) }} · {{ c.activeChats }} {{ t('escalationActiveChats') }}
                      </span>
                    </div>
                    <div class="esc-override__candidate-bar-wrap">
                      <div class="esc-override__candidate-bar">
                        <div class="esc-override__candidate-fill" [style.width.%]="c.overallScore * 100"></div>
                      </div>
                      <span class="esc-override__candidate-score">{{ formatScore(c.overallScore) }}</span>
                    </div>
                    @if (selectedAgentId() === c.agentId.toString()) {
                      <app-icon name="check-circle" [size]="18" class="esc-override__candidate-check" />
                    }
                  </div>
                }
              </div>
            }

            @if (!r.candidates || r.candidates.length === 0) {
              <div class="esc-override__section">
                <span class="esc-override__label">{{ t('escalationSelectAgent') }}</span>
                <select class="ui-input esc-override__select"
                        [value]="selectedAgentId()"
                        (change)="selectedAgentId.set(pickVal($event))">
                  <option value="">{{ t('escalationSelectAgent') }}</option>
                  @for (agent of agents(); track agent.id) {
                    <option [value]="agent.id">{{ agent.name }}</option>
                  }
                </select>
              </div>
            }

            <label class="esc-override__section">
              <span class="esc-override__label">{{ t('escalationOverrideReason') }}</span>
              <textarea class="ui-input esc-override__textarea"
                        rows="3"
                        [value]="reason()"
                        [placeholder]="t('escalationEnterDetails')"
                        (input)="reason.set(pickText($event))"></textarea>
            </label>
          </div>

          <div class="esc-override__actions">
            <button type="button" class="ui-btn ui-btn--ghost" (click)="cancel.emit()">
              {{ t('escalationCancel') }}
            </button>
            <button type="button" class="ui-btn ui-btn--danger"
                    [disabled]="!selectedAgentId() || !reason().trim() || submitting()"
                    (click)="onSubmit()">
              @if (submitting()) {
                <span class="ui-spinner" aria-hidden="true"></span>
              }
              {{ t('escalationOverride') }}
            </button>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .esc-override {
      position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
      width: min(480px, calc(100vw - 32px));
      max-height: 80vh;
      background: var(--surface); border-radius: 20px;
      box-shadow: 0 20px 60px rgba(0,0,0,.25);
      display: flex; flex-direction: column; z-index: 100;
    }
    .esc-override__bar {
      display: flex; align-items: center; justify-content: space-between;
      padding: 16px 20px; border-bottom: 1px solid var(--border-subtle);
    }
    .esc-override__title { font-size: 0.9rem; font-weight: 700; color: var(--text-primary); }
    .esc-override__close {
      display: grid; place-items: center; width: 30px; height: 30px;
      border: 1px solid var(--border-soft); border-radius: 9px;
      background: var(--surface); color: var(--text-muted); cursor: pointer;
    }
    .esc-override__close:hover { color: var(--text-primary); }
    .esc-override__body {
      padding: 20px; display: flex; flex-direction: column; gap: 16px;
      overflow-y: auto; flex: 1;
    }
    .esc-override__section { display: flex; flex-direction: column; gap: 8px; }
    .esc-override__label { font-size: 0.78rem; font-weight: 600; color: var(--text-secondary); }
    .esc-override__select { height: 40px; }
    .esc-override__textarea { resize: vertical; min-height: 80px; }
    .esc-override__candidate {
      display: flex; align-items: center; gap: 8px;
      padding: 10px 12px; border-radius: 10px;
      border: 1.5px solid var(--border-subtle);
      cursor: pointer; transition: all 0.15s;
    }
    .esc-override__candidate:hover { border-color: #8B5CF6; background: color-mix(in srgb, #8B5CF6 5%, var(--surface)); }
    .esc-override__candidate--selected {
      border-color: #8B5CF6 !important;
      background: color-mix(in srgb, #8B5CF6 10%, var(--surface)) !important;
    }
    .esc-override__candidate-rank { font-size: 0.78rem; font-weight: 800; color: var(--text-muted); min-width: 22px; }
    .esc-override__candidate-info { display: flex; flex-direction: column; gap: 1px; flex: 1; }
    .esc-override__candidate-name { font-size: 0.84rem; font-weight: 650; color: var(--text-primary); }
    .esc-override__candidate-detail { font-size: 0.72rem; color: var(--text-muted); }
    .esc-override__candidate-bar-wrap { display: flex; align-items: center; gap: 6px; }
    .esc-override__candidate-bar {
      width: 50px; height: 5px; border-radius: 3px;
      background: var(--border-subtle); overflow: hidden;
    }
    .esc-override__candidate-fill { height: 100%; border-radius: 3px; background: #8B5CF6; }
    .esc-override__candidate-score { font-size: 0.78rem; font-weight: 700; color: #8B5CF6; min-width: 30px; text-align: right; }
    .esc-override__candidate-check { color: #8B5CF6; flex-shrink: 0; }
    .esc-override__candidate-check svg { fill: none; stroke: currentColor; stroke-width: 2; }
    .esc-override__actions {
      display: flex; justify-content: flex-end; gap: 8px;
      padding: 12px 20px 16px; border-top: 1px solid var(--border-subtle);
    }
  `]
})
export class EscalationOverrideDialogComponent {
  private readonly language = inject(LanguageService);

  readonly recommendation = input<EscalationRecommendation | null>(null);
  readonly agents = input<AgentOption[]>([]);
  readonly submitting = signal(false);

  readonly confirm = output<{ escalationId: number; assigneeId: number; reason: string }>();
  readonly cancel = output<void>();

  protected readonly selectedAgentId = signal('');
  protected readonly reason = signal('');

  protected t = (key: TranslationKey): string => this.language.text(key);
  protected direction = (): 'rtl' | 'ltr' => this.language.getDirection();

  protected formatScore(score: number): string {
    return `${Math.round(score * 100)}%`;
  }

  protected pickVal(event: Event): string {
    return (event.target as HTMLSelectElement).value;
  }

  protected pickText(event: Event): string {
    return (event.target as HTMLTextAreaElement).value;
  }

  protected onSubmit(): void {
    const r = this.recommendation();
    const agentId = Number(this.selectedAgentId());
    const reasonText = this.reason().trim();
    if (!r || !agentId || !reasonText) return;

    this.submitting.set(true);
    this.confirm.emit({ escalationId: r.escalationId, assigneeId: agentId, reason: reasonText });
  }
}
