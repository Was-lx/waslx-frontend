import { Component, inject } from '@angular/core';
import { LanguageService, type TranslationKey } from '../../../../core/services/language.service';

@Component({
  selector: 'app-teams-page',
  standalone: true,
  templateUrl: './teams.page.html',
  styleUrl: './teams.page.css'
})
export class TeamsPageComponent {
  readonly languageService = inject(LanguageService);
  readonly t = (key: TranslationKey) => this.languageService.text(key);
  readonly direction = () => this.languageService.getDirection();
}
