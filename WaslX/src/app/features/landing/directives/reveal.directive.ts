import { Directive, ElementRef, Input, OnInit, inject } from '@angular/core';

export type RevealFrom = 'up' | 'down' | 'left' | 'right' | 'scale' | 'fade' | 'blur';

/**
 * Scroll-reveal via a class toggle. The hidden base state lives in CSS (.mo-reveal)
 * so there's no flash-of-motion, and a single shared IntersectionObserver toggles
 * `.is-in`. Honors prefers-reduced-motion (content shown immediately).
 */
@Directive({ selector: '[appReveal]', standalone: true })
export class RevealDirective implements OnInit {
  private readonly el = inject(ElementRef<HTMLElement>);

  @Input('appReveal') from: RevealFrom | '' = 'up';
  @Input() revealDelay = 0;
  /** Default false → elements animate IN and OUT as they enter/leave the viewport. */
  @Input() revealOnce = false;

  private static io?: IntersectionObserver;
  private static cbs = new WeakMap<Element, (visible: boolean) => void>();

  ngOnInit(): void {
    const node = this.el.nativeElement;
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    node.classList.add('mo-reveal');
    node.dataset['from'] = this.from || 'up';
    if (this.revealDelay) node.style.setProperty('--mo-delay', `${this.revealDelay}ms`);

    if (reduce || typeof IntersectionObserver === 'undefined') {
      node.classList.add('is-in');
      return;
    }

    if (!RevealDirective.io) {
      RevealDirective.io = new IntersectionObserver(
        (entries) => {
          for (const e of entries) RevealDirective.cbs.get(e.target)?.(e.isIntersecting);
        },
        { threshold: [0, 0.12, 0.5], rootMargin: '0px 0px -10% 0px' }
      );
    }

    RevealDirective.cbs.set(node, (visible) => {
      if (visible) {
        node.classList.add('is-in');
        if (this.revealOnce) {
          RevealDirective.io!.unobserve(node);
          RevealDirective.cbs.delete(node);
        }
      } else if (!this.revealOnce) {
        // Re-hide on exit so re-entering replays the animation (animate in/out).
        node.classList.remove('is-in');
      }
    });

    RevealDirective.io.observe(node);
  }
}
