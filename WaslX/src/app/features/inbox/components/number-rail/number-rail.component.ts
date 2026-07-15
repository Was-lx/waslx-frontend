import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';

import { LanguageService, type TranslationKey } from '../../../../core/services/language.service';
import { IconComponent } from '../../../../shared/components/icon/icon.component';
import type { WhatsAppAccountSummary } from '../../../../core/api/whatsapp-api.service';

/**
 * Slim vertical rail of the WhatsApp numbers the agent can access. An "All" tile clears the
 * filter; each number tile filters the conversation list to that account. Always shown (even for
 * a single number) so the active channel is always visible.
 */
@Component({
  selector: 'app-number-rail',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconComponent],
  template: `
    <nav class="rail" [attr.aria-label]="t('inboxNumbersTitle')">
      <button
        type="button"
        class="rail__tile"
        [class.rail__tile--active]="selectedId() === null"
        [title]="t('inboxAllNumbers')"
        (click)="select.emit(null)"
      >
        <span class="rail__icon rail__icon--all"><app-icon name="inbox" [size]="18" /></span>
        <span class="rail__label">{{ t('filterAll') }}</span>
      </button>

      @for (acc of accounts(); track acc.id) {
        <button
          type="button"
          class="rail__tile"
          [class.rail__tile--active]="selectedId() === acc.id"
          [title]="acc.platformName || acc.phoneNumber"
          (click)="select.emit(acc.id)"
        >
          <span class="rail__icon" [class.rail__icon--off]="acc.status !== 'Connected'">
            <app-icon name="phone" [size]="17" />
          </span>
          <span class="rail__label">{{ acc.platformName || shortNumber(acc.phoneNumber) }}</span>
        </button>
      }
    </nav>
  `,
  styles: [`
    :host { display: block; height: 100%; }
    .rail {
      display: flex;
      flex-direction: column;
      align-items: stretch;
      gap: 6px;
      height: 100%;
      width: 88px;
      padding: 14px 10px;
      overflow-y: auto;
      background: linear-gradient(180deg, color-mix(in srgb, var(--primary) 6%, var(--surface)), var(--surface) 160px);
      border-inline-end: 1px solid var(--border-subtle);
      scrollbar-width: none;
    }
    .rail::-webkit-scrollbar { width: 0; }
    .rail__tile {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
      padding: 10px 4px;
      border: 0;
      border-radius: 14px;
      background: transparent;
      color: var(--text-secondary);
      cursor: pointer;
      transition: background-color 150ms ease, color 150ms ease;
    }
    .rail__tile:hover { background: color-mix(in srgb, var(--primary) 7%, var(--surface)); color: var(--text-primary); }
    .rail__tile--active { background: color-mix(in srgb, var(--primary) 11%, var(--surface)); color: var(--primary); }
    .rail__tile--active::before {
      content: '';
      position: absolute;
      inset-inline-start: -8px;
      top: 12px;
      bottom: 12px;
      width: 3px;
      border-radius: 999px;
      background: linear-gradient(180deg, var(--primary), var(--accent));
    }
    .rail__icon {
      display: grid;
      place-items: center;
      width: 42px;
      height: 42px;
      border-radius: 12px;
      background: var(--surface);
      border: 1px solid var(--border-soft);
      color: var(--text-secondary);
      box-shadow: var(--shadow-xs);
      transition: border-color 150ms ease, color 150ms ease;
    }
    .rail__tile--active .rail__icon {
      border-color: color-mix(in srgb, var(--primary) 42%, var(--border-soft));
      color: var(--primary);
      background: color-mix(in srgb, var(--primary) 8%, var(--surface));
    }
    .rail__icon--all { background: linear-gradient(135deg, var(--primary), var(--accent)); border: 0; color: #fff; }
    .rail__tile--active .rail__icon--all { color: #fff; }
    .rail__icon--off { opacity: 0.55; }
    .rail__icon svg { fill: none; stroke: currentColor; stroke-width: 2; }
    .rail__label {
      max-width: 100%;
      font-size: 0.66rem;
      font-weight: 650;
      line-height: 1.2;
      text-align: center;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      letter-spacing: -0.01em;
    }
  `]
})
export class NumberRailComponent {
  private readonly language = inject(LanguageService);

  readonly accounts = input<WhatsAppAccountSummary[]>([]);
  readonly selectedId = input<number | null>(null);
  readonly select = output<number | null>();

  protected t = (key: TranslationKey): string => this.language.text(key);

  /** Last 5 digits fallback label when a number has no friendly platform name. */
  protected shortNumber(phone: string): string {
    const digits = phone.replace(/\D/g, '');
    return digits.length > 5 ? '…' + digits.slice(-5) : phone;
  }
}
