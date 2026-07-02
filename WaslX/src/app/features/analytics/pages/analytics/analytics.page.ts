import { Component, inject } from '@angular/core';
import { LanguageService, type TranslationKey } from '../../../../core/services/language.service';

@Component({
  selector: 'app-analytics-page',
  standalone: true,
  templateUrl: './analytics.page.html',
  styleUrl: './analytics.page.css'
})
export class AnalyticsPageComponent {
  readonly languageService = inject(LanguageService);
  readonly t = (key: TranslationKey) => this.languageService.text(key);
  readonly direction = () => this.languageService.getDirection();
}
