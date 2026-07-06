import { Directive, ElementRef, HostListener, inject } from '@angular/core';

/**
 * Subtle 3D pointer-tilt for hero cards / mockups. Skipped for touch input and
 * for users who prefer reduced motion.
 *
 *   <div appTilt>...</div>
 */
@Directive({ selector: '[appTilt]', standalone: true })
export class TiltDirective {
  private readonly el = inject(ElementRef<HTMLElement>);
  private readonly max = 7;
  private raf = 0;

  private get reduced(): boolean {
    return (
      typeof window !== 'undefined' &&
      !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    );
  }

  @HostListener('pointermove', ['$event'])
  onMove(event: PointerEvent): void {
    if (event.pointerType === 'touch' || this.reduced) return;
    const node = this.el.nativeElement;
    const rect = node.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width - 0.5;
    const py = (event.clientY - rect.top) / rect.height - 0.5;

    cancelAnimationFrame(this.raf);
    this.raf = requestAnimationFrame(() => {
      node.style.transform =
        `perspective(1300px) rotateY(${px * this.max}deg) rotateX(${-py * this.max}deg)`;
    });
  }

  @HostListener('pointerleave')
  onLeave(): void {
    if (this.reduced) return;
    cancelAnimationFrame(this.raf);
    this.el.nativeElement.style.transform =
      'perspective(1300px) rotateY(0deg) rotateX(0deg)';
  }
}
