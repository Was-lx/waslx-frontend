import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';

/**
 * TagChip — a small, colored presentation pill for a tag.
 *
 * Purely presentational and reusable (tags screen today, inbox tomorrow). The
 * chip tints itself from the tag's own `color`, so it reads correctly in both
 * light and dark themes via `color-mix` against the current surface / ink.
 *
 *   <app-tag-chip [name]="tag.name" [color]="tag.color" />
 *   <app-tag-chip [name]="tag.name" [color]="tag.color" [removable]="true" (remove)="detach(tag)" />
 */
@Component({
  selector: 'app-tag-chip',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span class="tag-chip" [class.tag-chip--sm]="size() === 'sm'" [style.--tc]="safeColor()">
      <span class="tag-chip__dot" aria-hidden="true"></span>
      <span class="tag-chip__label">{{ name() }}</span>
      @if (removable()) {
        <button type="button" class="tag-chip__remove" [attr.aria-label]="removeLabel()" (click)="onRemove($event)">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
        </button>
      }
    </span>
  `,
  styles: [`
    :host { display: inline-flex; min-width: 0; }
    .tag-chip {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      max-width: 100%;
      padding: 3px 10px;
      border-radius: 999px;
      font-size: 0.78rem;
      font-weight: 650;
      letter-spacing: 0.01em;
      line-height: 1.4;
      color: color-mix(in srgb, var(--tc, var(--primary)) 62%, var(--text-primary));
      background: color-mix(in srgb, var(--tc, var(--primary)) 13%, var(--surface));
      border: 1px solid color-mix(in srgb, var(--tc, var(--primary)) 32%, transparent);
      transition: background-color 150ms ease, border-color 150ms ease;
    }
    .tag-chip__dot {
      width: 7px;
      height: 7px;
      flex: 0 0 auto;
      border-radius: 50%;
      background: var(--tc, var(--primary));
      box-shadow: 0 0 0 2px color-mix(in srgb, var(--tc, var(--primary)) 20%, transparent);
    }
    .tag-chip__label { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .tag-chip__remove {
      display: inline-grid;
      place-items: center;
      width: 15px;
      height: 15px;
      margin-inline-end: -3px;
      padding: 0;
      border: 0;
      border-radius: 50%;
      background: transparent;
      color: inherit;
      opacity: 0.6;
      cursor: pointer;
      transition: opacity 130ms ease, background-color 130ms ease;
    }
    .tag-chip__remove:hover { opacity: 1; background: color-mix(in srgb, var(--tc, var(--primary)) 22%, transparent); }
    .tag-chip__remove svg { width: 11px; height: 11px; fill: none; stroke: currentColor; stroke-width: 2.4; stroke-linecap: round; stroke-linejoin: round; }
    .tag-chip--sm { padding: 2px 8px; font-size: 0.72rem; gap: 5px; }
    .tag-chip--sm .tag-chip__dot { width: 6px; height: 6px; }
  `],
})
export class TagChipComponent {
  readonly name = input.required<string>();
  readonly color = input<string | null>(null);
  readonly size = input<'md' | 'sm'>('md');
  readonly removable = input(false);
  readonly removeLabel = input('Remove');

  readonly remove = output<void>();

  /** Fall back to the brand primary when a tag has no (or an empty) colour. */
  readonly safeColor = computed(() => {
    const value = (this.color() ?? '').trim();
    return value.length ? value : 'var(--primary)';
  });

  onRemove(event: MouseEvent): void {
    event.stopPropagation();
    this.remove.emit();
  }
}
