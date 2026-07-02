import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { LanguageService, type TranslationKey } from '../../../../core/services/language.service';
import { ThemeService } from '../../../../core/services/theme.service';
import { AuthSessionService } from '../../../../core/services/auth-session.service';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './landing.page.html',
  styleUrl: './landing.page.css'
})
export class LandingPageComponent {
  private readonly router = inject(Router);
  private readonly authSessionService = inject(AuthSessionService);
  private readonly themeService = inject(ThemeService);
  readonly languageService = inject(LanguageService);

  readonly t = (key: TranslationKey) => this.languageService.text(key);
  readonly direction = () => this.languageService.getDirection();
  readonly languageLabel = () =>
    this.languageService.language() === 'en'
      ? this.languageService.text('switchToArabic')
      : this.languageService.text('switchToEnglish');

  constructor() {
    if (this.authSessionService.isAuthenticated()) {
      void this.router.navigateByUrl('/app/dashboard', { replaceUrl: true });
    }
  }

  toggleLanguage(): void {
    this.languageService.toggleLanguage();
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}
