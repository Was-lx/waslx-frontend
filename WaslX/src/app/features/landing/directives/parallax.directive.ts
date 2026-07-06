import { Directive, ElementRef, Input, NgZone, OnDestroy, OnInit, inject } from '@angular/core';

/**
 * Scroll-linked depth. Transform-only, rAF-throttled, runs outside Angular.
 * Apply ONLY to decorative absolutely-positioned layers (orbs, glow, hero visual
 * wrapper) — never to text or cards.
 */
@Directive({ selector: '[appParallax]', standalone: true })
export class ParallaxDirective implements OnInit, OnDestroy {
  private readonly el = inject(ElementRef<HTMLElement>);
  private readonly zone = inject(NgZone);

  @Input() parallaxSpeed = 0.12;
  @Input() parallaxMax = 80;
  private ticking = false;

  private readonly onScroll = () => {
    if (this.ticking) return;
    this.ticking = true;
    requestAnimationFrame(() => {
      const r = this.el.nativeElement.getBoundingClientRect();
      const c = r.top + r.height / 2 - window.innerHeight / 2;
      const y = Math.max(-this.parallaxMax, Math.min(this.parallaxMax, c * this.parallaxSpeed));
      this.el.nativeElement.style.transform = `translate3d(0, ${y.toFixed(1)}px, 0)`;
      this.ticking = false;
    });
  };

  ngOnInit(): void {
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
    this.el.nativeElement.style.willChange = 'transform';
    this.zone.runOutsideAngular(() =>
      window.addEventListener('scroll', this.onScroll, { passive: true })
    );
    this.onScroll();
  }

  ngOnDestroy(): void {
    window.removeEventListener('scroll', this.onScroll);
  }
}
