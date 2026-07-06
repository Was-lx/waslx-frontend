import { Component, HostListener, OnDestroy, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { filter } from 'rxjs';

import { LanguageService } from '../../../../core/services/language.service';
import { ThemeService } from '../../../../core/services/theme.service';
import { IconComponent } from '../../../../shared/components/icon/icon.component';
import { ScrollProgressDirective } from '../../directives/scroll-progress.directive';
import { LANDING_CONTENT } from '../../landing.content';

@Component({
  selector: 'app-landing-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, IconComponent, ScrollProgressDirective],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class LandingNavbarComponent implements OnDestroy {
  private readonly languageService = inject(LanguageService);
  private readonly themeService = inject(ThemeService);
  private readonly router = inject(Router);

  readonly c = computed(() => LANDING_CONTENT[this.languageService.language()]);
  readonly theme = this.themeService.theme;
  readonly scrolled = signal(false);
  readonly mobileOpen = signal(false);
  readonly isHome = signal(this.onHome(this.router.url));

  /** Only the HOME hero is dark; the sub-page heros are now light. So the rail
   *  floats as inverted dark glass (light elements) only over the home hero. */
  readonly overHero = computed(() => this.isHome() && !this.scrolled() && !this.mobileOpen());

  constructor() {
    this.router.events
      .pipe(
        filter((e): e is NavigationEnd => e instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe((e) => this.isHome.set(this.onHome(e.urlAfterRedirects)));
  }

  private onHome(url: string): boolean {
    return (url.split('?')[0].split('#')[0] || '/') === '/';
  }

  @HostListener('window:scroll')
  onScroll(): void {
    this.scrolled.set(window.scrollY > 8);
  }

  toggleLanguage(): void {
    this.languageService.toggleLanguage();
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  toggleMobile(): void {
    this.mobileOpen.update((open) => !open);
    this.syncLock();
  }

  closeMobile(): void {
    this.mobileOpen.set(false);
    this.syncLock();
  }

  private syncLock(): void {
    document.documentElement.classList.toggle('nav-locked', this.mobileOpen());
  }

  ngOnDestroy(): void {
    document.documentElement.classList.remove('nav-locked');
  }
}
