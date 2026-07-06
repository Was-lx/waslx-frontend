import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { LanguageService } from '../../../../core/services/language.service';
import { ThemeService } from '../../../../core/services/theme.service';
import { IconComponent } from '../../../../shared/components/icon/icon.component';

const BRAND = {
  en: {
    heading: 'The AI-powered WhatsApp team inbox.',
    bullets: [
      'Smart routing to the right agent, automatically',
      'AI reply suggestions in Arabic & English',
      'Shared inbox with real-time collaboration',
    ],
    metrics: [
      { v: '10k+', l: 'chats / day' },
      { v: '3×', l: 'faster' },
      { v: '90%', l: 'auto-routed' },
    ],
    quote: 'Routing alone cut our first-response time in half.',
    quoteBy: 'Nour A. · Head of Support',
    backHome: 'Back to site',
    langLabel: 'العربية',
  },
  ar: {
    heading: 'صندوق واتساب الذكي لفريقك.',
    bullets: [
      'توجيه ذكي للوكيل المناسب، تلقائيًا',
      'اقتراحات رد بالعربي والإنجليزي',
      'صندوق مشترك بتعاون فوري',
    ],
    metrics: [
      { v: '10k+', l: 'محادثة/يوم' },
      { v: '3×', l: 'أسرع' },
      { v: '90%', l: 'توجيه تلقائي' },
    ],
    quote: 'التوجيه لوحده قلّل زمن أول رد للنص.',
    quoteBy: 'نور ع. · مسؤولة الدعم',
    backHome: 'العودة للموقع',
    langLabel: 'English',
  },
};

@Component({
  selector: 'app-auth-shell',
  standalone: true,
  imports: [RouterLink, IconComponent],
  templateUrl: './auth-shell.component.html',
  styleUrl: './auth-shell.component.css',
})
export class AuthShellComponent {
  private readonly languageService = inject(LanguageService);
  private readonly themeService = inject(ThemeService);

  readonly c = computed(() => BRAND[this.languageService.language()]);
  readonly theme = this.themeService.theme;
  readonly direction = () => this.languageService.getDirection();

  toggleLanguage(): void {
    this.languageService.toggleLanguage();
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}
