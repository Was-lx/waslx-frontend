import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { LanguageService, type TranslationKey } from '../../../../core/services/language.service';
import { IconComponent } from '../../../../shared/components/icon/icon.component';

// Escalations now always auto-assign, so ownership transfers only ever have one outcome to report —
// there's no more "waiting for Manager approval" state to distinguish.
@Component({
  selector: 'app-escalation-ownership-transferred',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconComponent],
  template: `
    @if (isTransferred()) {
      <div class="esc-ot" [attr.dir]="direction()">
        <app-icon name="arrow-right-left" [size]="16" />
        <span class="esc-ot__text">{{ t('escalationTransferred') }}</span>
      </div>
    }
  `,
  styles: [`
    :host { display: block; }
    .esc-ot {
      display: flex; align-items: center; gap: 8px;
      padding: 10px 14px; border-radius: 10px;
      font-size: 0.84rem; font-weight: 600; line-height: 1.4;
      background: color-mix(in srgb, #3B82F6 10%, var(--surface));
      border: 1px solid color-mix(in srgb, #3B82F6 20%, var(--border-subtle));
      color: #1E40AF;
    }
    .esc-ot app-icon { color: #3B82F6; }
    .esc-ot__text { flex: 1; }
    app-icon svg { fill: none; stroke: currentColor; stroke-width: 2; flex-shrink: 0; }
  `]
})
export class EscalationOwnershipTransferredComponent {
  private readonly language = inject(LanguageService);

  readonly isTransferred = input(false);

  protected t = (key: TranslationKey): string => this.language.text(key);
  protected direction = (): 'rtl' | 'ltr' => this.language.getDirection();
}
