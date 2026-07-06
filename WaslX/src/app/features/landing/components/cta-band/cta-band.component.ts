import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { LanguageService } from '../../../../core/services/language.service';
import { IconComponent } from '../../../../shared/components/icon/icon.component';
import { RevealDirective } from '../../directives/reveal.directive';
import { MagneticDirective } from '../../directives/magnetic.directive';
import { LANDING_CONTENT } from '../../landing.content';

@Component({
  selector: 'app-cta-band',
  standalone: true,
  imports: [RouterLink, IconComponent, RevealDirective, MagneticDirective],
  templateUrl: './cta-band.component.html',
  styleUrl: './cta-band.component.css',
})
export class CtaBandComponent {
  private readonly languageService = inject(LanguageService);
  readonly c = computed(() => LANDING_CONTENT[this.languageService.language()]);
}
