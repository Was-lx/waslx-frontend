import { Directive, ElementRef, HostListener, inject } from '@angular/core';

/**
 * Cursor-lean for primary CTAs only. Writes transform, so the button must NOT
 * also use a `:hover { transform }` (put the hover lift on box-shadow instead).
 * Guards touch input + reduced-motion.
 */
@Directive({ selector: '[appMagnetic]', standalone: true })
export class MagneticDirective {
  private readonly el = inject(ElementRef<HTMLElement>);
  private readonly strength = 0.28;
  private readonly max = 10;
  private raf = 0;

  private get reduced(): boolean {
    return !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  }

  @HostListener('pointermove', ['$event'])
  onMove(e: PointerEvent): void {
    if (e.pointerType === 'touch' || this.reduced) return;
    const r = this.el.nativeElement.getBoundingClientRect();
    const cx = Math.max(-this.max, Math.min(this.max, (e.clientX - r.left - r.width / 2) * this.strength));
    const cy = Math.max(-this.max, Math.min(this.max, (e.clientY - r.top - r.height / 2) * this.strength));
    cancelAnimationFrame(this.raf);
    this.raf = requestAnimationFrame(() => {
      this.el.nativeElement.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
    });
  }

  @HostListener('pointerleave')
  onLeave(): void {
    if (this.reduced) return;
    cancelAnimationFrame(this.raf);
    const node = this.el.nativeElement;
    node.style.transition = `transform var(--mo-quick) var(--ease-magnetic)`;
    node.style.transform = 'translate3d(0, 0, 0)';
    setTimeout(() => (node.style.transition = ''), 300);
  }
}
