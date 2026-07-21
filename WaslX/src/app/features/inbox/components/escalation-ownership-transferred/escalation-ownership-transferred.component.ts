import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { LanguageService, type TranslationKey } from '../../../../core/services/language.service';
import { IconComponent } from '../../../../shared/components/icon/icon.component';

@Component({
  selector: 'app-escalation-ownership-transferred',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconComponent],
  template: `
    @if (showBanner()) {
      <div class="esc-ot" [attr.dir]="direction()" [class.esc-ot--warning]="isWaiting()" [class.esc-ot--info]="isTransferred()">
        <app-icon [name]="isWaiting() ? 'clock' : 'arrow-right-left'" [size]="16" />
        <span class="esc-ot__text">{{ bannerText() }}</span>
      </div>
    }
  `,
  styles: [`
    :host { display: block; }
    .esc-ot {
      display: flex; align-items: center; gap: 8px;
      padding: 10px 14px; border-radius: 10px;
      font-size: 0.84rem; font-weight: 600; line-height: 1.4;
    }
    .esc-ot--warning {
      background: color-mix(in srgb, #F59E0B 14%, var(--surface));
      border: 1px solid color-mix(in srgb, #F59E0B 25%, var(--border-subtle));
      color: #92400E;
    }
    .esc-ot--warning app-icon { color: #F59E0B; }
    .esc-ot--info {
      background: color-mix(in srgb, #3B82F6 10%, var(--surface));
      border: 1px solid color-mix(in srgb, #3B82F6 20%, var(--border-subtle));
      color: #1E40AF;
    }
    .esc-ot--info app-icon { color: #3B82F6; }
    .esc-ot__text { flex: 1; }
    app-icon svg { fill: none; stroke: currentColor; stroke-width: 2; flex-shrink: 0; }
  `]
})
export class EscalationOwnershipTransferredComponent {
  private readonly language = inject(LanguageService);

  readonly isWaiting = input(false);
  readonly isTransferred = input(false);

  protected readonly showBanner = computed(() => this.isWaiting() || this.isTransferred());

  protected readonly bannerText = computed(() => {
    if (this.isWaiting()) return this.t('escalationWaitingApproval');
    if (this.isTransferred()) return this.t('escalationTransferred');
    return '';
  });

  protected t = (key: TranslationKey): string => this.language.text(key);
  protected direction = (): 'rtl' | 'ltr' => this.language.getDirection();
}
