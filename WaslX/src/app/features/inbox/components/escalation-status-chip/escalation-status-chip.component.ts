import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';

import { LanguageService } from '../../../../core/services/language.service';
import { IconComponent } from '../../../../shared/components/icon/icon.component';

@Component({
  selector: 'app-escalation-status-chip',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconComponent],
  template: `
    @if (visible()) {
      <span class="esc-chip" [attr.dir]="direction()" [class.esc-chip--active]="isActive()">
        <app-icon name="bell" [size]="14" />
        <span class="esc-chip__label">{{ label() }}</span>
      </span>
    }
  `,
  styles: [`
    .esc-chip {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      padding: 3px 10px;
      border-radius: 999px;
      font-size: 0.72rem;
      font-weight: 700;
      white-space: nowrap;
      background: color-mix(in srgb, #EF4444 12%, transparent);
      color: #b91c1c;
      border: 1px solid color-mix(in srgb, #EF4444 20%, transparent);
    }
    .esc-chip--active {
      background: color-mix(in srgb, #EF4444 14%, transparent);
      color: #dc2626;
    }
    .esc-chip app-icon { flex: 0 0 auto; }
    .esc-chip__label { flex: 0 0 auto; }
  `]
})
export class EscalationStatusChipComponent {
  private readonly language = inject(LanguageService);

  readonly status = input<string | undefined | null>(undefined);
  readonly escalate = input<boolean | undefined>(false);

  protected readonly visible = computed(() => {
    if (this.escalate()) return true;
    const s = this.status();
    return s === 'open' || s === 'assigned';
  });

  protected readonly isActive = computed(() => {
    const s = this.status();
    return s === 'open' || s === 'assigned' || this.escalate() === true;
  });

  protected readonly label = computed(() => {
    const s = this.status();
    if (s === 'assigned') return this.t('badgeAssigned');
    return this.t('badgeEscalated');
  });

  protected t = (key: string): string => this.language.text(key as never);
  protected direction = (): 'rtl' | 'ltr' => this.language.getDirection();
}
