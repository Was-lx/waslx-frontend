import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { LanguageService, type TranslationKey } from '../../../core/services/language.service';

@Component({
  selector: 'app-manager-inbox',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './inbox.component.html',
  styleUrl: './inbox.component.css'
})
export class ManagerInboxComponent {
  readonly languageService = inject(LanguageService);

  readonly t = (key: TranslationKey) => this.languageService.text(key);
  readonly direction = () => this.languageService.getDirection();
}
