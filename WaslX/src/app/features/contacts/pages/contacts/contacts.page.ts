import { Component, inject } from '@angular/core';
import { LanguageService, type TranslationKey } from '../../../../core/services/language.service';

@Component({
  selector: 'app-contacts-page',
  standalone: true,
  templateUrl: './contacts.page.html',
  styleUrl: './contacts.page.css'
})
export class ContactsPageComponent {
  readonly languageService = inject(LanguageService);
  readonly t = (key: TranslationKey) => this.languageService.text(key);
  readonly direction = () => this.languageService.getDirection();
}
