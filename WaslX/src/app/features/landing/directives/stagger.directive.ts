import { AfterViewInit, Directive, ElementRef, Input, OnInit, inject } from '@angular/core';

/**
 * Reveals a grid/list's direct children in a cascade as the group scrolls in, and
 * resets on exit (animate in / animate out). Children are read in ngAfterViewInit
 * so @for-generated cards are present; a pre-hide class avoids any flash.
 */
@Directive({ selector: '[appStagger]', standalone: true })
export class StaggerDirective implements OnInit, AfterViewInit {
  private readonly el = inject(ElementRef<HTMLElement>);

  @Input() staggerStep = 90;
  @Input() staggerFrom: 'up' | 'scale' | 'blur' | 'rise' = 'rise';
  @Input() staggerBase = 0;

  private get reduced(): boolean {
    return !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  }

  ngOnInit(): void {
    // Hide children before first paint (children aren't in the DOM yet for @for).
    if (!this.reduced && typeof IntersectionObserver !== 'undefined') {
      this.el.nativeElement.classList.add('mo-stagger-init');
    }
  }

  ngAfterViewInit(): void {
    const host = this.el.nativeElement;
    const kids = Array.from(host.children) as HTMLElement[];
    host.classList.remove('mo-stagger-init');

    kids.forEach((c, i) => {
      c.classList.add('mo-reveal');
      c.dataset['from'] = this.staggerFrom;
      c.style.setProperty('--mo-delay', `${this.staggerBase + i * this.staggerStep}ms`);
    });

    if (this.reduced || typeof IntersectionObserver === 'undefined') {
      kids.forEach((c) => c.classList.add('is-in'));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) kids.forEach((c) => c.classList.add('is-in'));
          else kids.forEach((c) => c.classList.remove('is-in'));
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -8% 0px' }
    );
    io.observe(host);
  }
}
