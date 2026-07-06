import { Directive, ElementRef, Input, OnInit, inject } from '@angular/core';

/**
 * Animates a number from 0 to its target the first time it scrolls into view.
 *
 *   <span [appCountUp]="10000" countSuffix="+"></span>
 *   <span [appCountUp]="99.9" [countDecimals]="1" countSuffix="%"></span>
 */
@Directive({ selector: '[appCountUp]', standalone: true })
export class CountUpDirective implements OnInit {
  private readonly el = inject(ElementRef<HTMLElement>);

  @Input('appCountUp') value = 0;
  @Input() countDuration = 1700;
  @Input() countPrefix = '';
  @Input() countSuffix = '';
  @Input() countDecimals = 0;

  ngOnInit(): void {
    const node = this.el.nativeElement;

    const format = (n: number) =>
      `${this.countPrefix}${n.toLocaleString('en-US', {
        minimumFractionDigits: this.countDecimals,
        maximumFractionDigits: this.countDecimals,
      })}${this.countSuffix}`;

    const reduce =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    if (reduce || typeof IntersectionObserver === 'undefined') {
      node.textContent = format(this.value);
      return;
    }

    node.textContent = format(0);
    let started = false;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !started) {
            started = true;
            io.unobserve(node);
            const start = performance.now();
            const step = (now: number) => {
              const p = Math.min(1, (now - start) / this.countDuration);
              const eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
              node.textContent = format(this.value * eased);
              if (p < 1) {
                requestAnimationFrame(step);
              } else {
                node.textContent = format(this.value);
                node.classList.add('is-counted');
              }
            };
            requestAnimationFrame(step);
          }
        }
      },
      { threshold: 0.5 }
    );

    io.observe(node);
  }
}
