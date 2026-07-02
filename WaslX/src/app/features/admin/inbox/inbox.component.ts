import { Component, inject } from '@angular/core';

import { LanguageService, type TranslationKey } from '../../../core/services/language.service';

@Component({
  selector: 'app-admin-inbox',
  standalone: true,
  templateUrl: './inbox.component.html',
  styleUrl: './inbox.component.css'
})
export class AdminInboxComponent {
  readonly languageService = inject(LanguageService);

  readonly t = (key: TranslationKey) => this.languageService.text(key);
  readonly direction = () => this.languageService.getDirection();
}
