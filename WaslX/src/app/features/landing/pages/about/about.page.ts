import { Component, computed, inject } from '@angular/core';

import { LanguageService } from '../../../../core/services/language.service';
import { LANDING_CONTENT } from '../../landing.content';
import { IconComponent } from '../../../../shared/components/icon/icon.component';
import { RevealDirective } from '../../directives/reveal.directive';
import { StaggerDirective } from '../../directives/stagger.directive';
import { CountUpDirective } from '../../directives/count-up.directive';
import { SpotlightDirective } from '../../directives/spotlight.directive';
import { TiltDirective } from '../../directives/tilt.directive';

@Component({
  selector: 'app-about-page',
  standalone: true,
  imports: [IconComponent, RevealDirective, StaggerDirective, CountUpDirective, SpotlightDirective, TiltDirective],
  templateUrl: './about.page.html',
  styleUrl: './about.page.css',
})
export class AboutPageComponent {
  private readonly languageService = inject(LanguageService);
  readonly c = computed(() => LANDING_CONTENT[this.languageService.language()]);
}
