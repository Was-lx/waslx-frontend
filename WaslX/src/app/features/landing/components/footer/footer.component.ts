import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { LanguageService } from '../../../../core/services/language.service';
import { IconComponent } from '../../../../shared/components/icon/icon.component';
import { LANDING_CONTENT } from '../../landing.content';

@Component({
  selector: 'app-landing-footer',
  standalone: true,
  imports: [RouterLink, IconComponent],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css',
})
export class LandingFooterComponent {
  private readonly languageService = inject(LanguageService);
  readonly c = computed(() => LANDING_CONTENT[this.languageService.language()]);
}
