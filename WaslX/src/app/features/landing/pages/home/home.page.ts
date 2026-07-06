import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';

import { LanguageService } from '../../../../core/services/language.service';
import { LANDING_CONTENT } from '../../landing.content';
import { IconComponent } from '../../../../shared/components/icon/icon.component';
import { RevealDirective } from '../../directives/reveal.directive';
import { StaggerDirective } from '../../directives/stagger.directive';
import { CountUpDirective } from '../../directives/count-up.directive';
import { TiltDirective } from '../../directives/tilt.directive';
import { MagneticDirective } from '../../directives/magnetic.directive';
import { ParallaxDirective } from '../../directives/parallax.directive';
import { SpotlightDirective } from '../../directives/spotlight.directive';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    RouterLink,
    IconComponent,
    RevealDirective,
    StaggerDirective,
    CountUpDirective,
    TiltDirective,
    MagneticDirective,
    ParallaxDirective,
    SpotlightDirective,
  ],
  templateUrl: './home.page.html',
  styleUrl: './home.page.css',
})
export class HomePageComponent implements OnInit, AfterViewInit, OnDestroy {
  private readonly languageService = inject(LanguageService);

  readonly c = computed(() => LANDING_CONTENT[this.languageService.language()]);
  readonly heroReady = signal(false);

  readonly logoRow = [
    { icon: 'message', label: 'Retail' },
    { icon: 'send', label: 'E-commerce' },
    { icon: 'headset', label: 'Support' },
    { icon: 'trending-up', label: 'Sales' },
    { icon: 'layers', label: 'Logistics' },
    { icon: 'users', label: 'Agencies' },
    { icon: 'zap', label: 'Startups' },
  ];

  readonly rotatingIndex = signal(0);
  readonly rotatingWord = computed(() => {
    const words = this.c().hero.rotating;
    return words[this.rotatingIndex() % words.length];
  });

  private timer?: ReturnType<typeof setInterval>;

  ngOnInit(): void {
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;
    this.timer = setInterval(() => this.rotatingIndex.update((i) => i + 1), 2600);
  }

  ngAfterViewInit(): void {
    requestAnimationFrame(() => this.heroReady.set(true));
  }

  ngOnDestroy(): void {
    if (this.timer) clearInterval(this.timer);
  }
}
