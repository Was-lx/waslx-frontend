import { ChangeDetectionStrategy, Component, computed, inject, input, output, signal } from '@angular/core';
import { LanguageService, type TranslationKey } from '../../../../core/services/language.service';
import { IconComponent } from '../../../../shared/components/icon/icon.component';
import type { EscalationRecommendation } from '../../models/escalation-recommendation.model';

export interface AgentOption {
  id: number;
  name: string;
}

@Component({
  selector: 'app-escalation-override-dialog',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconComponent],
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
            <label class="esc-override__field">
              <span class="esc-override__label">{{ t('escalationSelectAgent') }}</span>
              <select class="ui-input esc-override__select"
                      [value]="selectedAgentId()"
                      (change)="selectedAgentId.set(pickVal($event))">
                <option value="">{{ t('escalationSelectAgent') }}</option>
                @for (agent of agents(); track agent.id) {
                  <option [value]="agent.id">{{ agent.name }}</option>
                }
              </select>
            </label>

            <label class="esc-override__field">
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
      width: min(400px, calc(100vw - 32px));
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
    .esc-override__body { padding: 20px; display: flex; flex-direction: column; gap: 16px; }
    .esc-override__field { display: flex; flex-direction: column; gap: 6px; }
    .esc-override__label { font-size: 0.78rem; font-weight: 600; color: var(--text-secondary); }
    .esc-override__select { height: 40px; }
    .esc-override__textarea { resize: vertical; min-height: 80px; }
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
