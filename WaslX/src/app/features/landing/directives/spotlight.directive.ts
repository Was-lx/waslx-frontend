import { Directive, ElementRef, HostListener, inject } from '@angular/core';

/**
 * Cursor-tracked glow for cards. Writes --spot-x/--spot-y CSS vars; the glow is a
 * pure-opacity radial gradient (`.lp-card--spot::before`), so it's reduced-motion
 * safe. Pair with the `.lp-card--spot` class.
 */
@Directive({ selector: '[appSpotlight]', standalone: true })
export class SpotlightDirective {
  private readonly el = inject(ElementRef<HTMLElement>);

  @HostListener('pointermove', ['$event'])
  onMove(e: PointerEvent): void {
    if (e.pointerType === 'touch') return;
    const r = this.el.nativeElement.getBoundingClientRect();
    this.el.nativeElement.style.setProperty('--spot-x', `${e.clientX - r.left}px`);
    this.el.nativeElement.style.setProperty('--spot-y', `${e.clientY - r.top}px`);
  }
}
