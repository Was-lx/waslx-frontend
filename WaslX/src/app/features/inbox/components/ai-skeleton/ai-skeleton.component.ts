import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * Shared AI loading affordances (FE-4.5): a shimmer skeleton for pending AI content (summaries,
 * routing, escalation) and a compact "typing" indicator. Pure CSS, CSP-safe, theme- & RTL-aware.
 * Never blocks manual input — it only occupies its own region while the pipeline runs.
 */
@Component({
  selector: 'app-ai-skeleton',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (variant() === 'typing') {
      <span class="ai-typing" role="status" [attr.aria-label]="label()">
        <span class="ai-typing__dot"></span>
        <span class="ai-typing__dot"></span>
        <span class="ai-typing__dot"></span>
        @if (label()) { <span class="ai-typing__label">{{ label() }}</span> }
      </span>
    } @else {
      <span class="ai-skel" role="status" [attr.aria-label]="label()">
        @for (line of lineArray(); track $index) {
          <span class="ai-skel__line" [style.width.%]="line"></span>
        }
      </span>
    }
  `,
  styles: [`
    :host { display: block; }
    /* ── Shimmer skeleton ── */
    .ai-skel { display: flex; flex-direction: column; gap: 8px; width: 100%; }
    .ai-skel__line {
      height: 10px; border-radius: 6px;
      background: linear-gradient(
        90deg,
        color-mix(in srgb, var(--text-primary) 7%, transparent) 25%,
        color-mix(in srgb, var(--text-primary) 14%, transparent) 37%,
        color-mix(in srgb, var(--text-primary) 7%, transparent) 63%
      );
      background-size: 400% 100%;
      animation: ai-shimmer 1.4s ease infinite;
    }
    @keyframes ai-shimmer { 0% { background-position: 100% 0; } 100% { background-position: 0 0; } }
    /* ── Typing dots ── */
    .ai-typing { display: inline-flex; align-items: center; gap: 5px; }
    .ai-typing__dot {
      width: 6px; height: 6px; border-radius: 50%;
      background: var(--primary);
      animation: ai-bounce 1.2s ease infinite;
    }
    .ai-typing__dot:nth-child(2) { animation-delay: 0.15s; }
    .ai-typing__dot:nth-child(3) { animation-delay: 0.3s; }
    .ai-typing__label { margin-inline-start: 6px; font-size: 0.76rem; color: var(--text-muted); font-weight: 600; }
    @keyframes ai-bounce { 0%, 60%, 100% { transform: translateY(0); opacity: 0.5; } 30% { transform: translateY(-4px); opacity: 1; } }
    @media (prefers-reduced-motion: reduce) {
      .ai-skel__line, .ai-typing__dot { animation: none; }
    }
  `]
})
export class AiSkeletonComponent {
  /** 'skeleton' shows shimmer lines; 'typing' shows the three-dot indicator. */
  readonly variant = input<'skeleton' | 'typing'>('skeleton');
  /** Number of skeleton lines (ignored for the typing variant). */
  readonly lines = input(2);
  /** Accessible status label (also shown next to the typing dots when provided). */
  readonly label = input('');

  protected lineArray(): number[] {
    const widths = [92, 74, 60, 84, 68];
    return Array.from({ length: Math.max(1, this.lines()) }, (_, i) => widths[i % widths.length]);
  }
}
