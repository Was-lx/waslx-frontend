import { Directive, ElementRef, NgZone, OnDestroy, OnInit, inject } from '@angular/core';

/**
 * Drives a scaleX(0→1) progress rail from page scroll. rAF-throttled, runs
 * outside Angular. The host element should have `transform-origin` set in CSS.
 */
@Directive({ selector: '[appScrollProgress]', standalone: true })
export class ScrollProgressDirective implements OnInit, OnDestroy {
  private readonly el = inject(ElementRef<HTMLElement>);
  private readonly zone = inject(NgZone);
  private ticking = false;

  private readonly update = () => {
    if (this.ticking) return;
    this.ticking = true;
    requestAnimationFrame(() => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      this.el.nativeElement.style.transform = `scaleX(${(max > 0 ? h.scrollTop / max : 0).toFixed(4)})`;
      this.ticking = false;
    });
  };

  ngOnInit(): void {
    this.zone.runOutsideAngular(() => {
      window.addEventListener('scroll', this.update, { passive: true });
      window.addEventListener('resize', this.update, { passive: true });
    });
    this.update();
  }

  ngOnDestroy(): void {
    window.removeEventListener('scroll', this.update);
    window.removeEventListener('resize', this.update);
  }
}
