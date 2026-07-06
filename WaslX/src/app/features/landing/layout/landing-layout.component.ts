import { Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';

import { LandingNavbarComponent } from '../components/navbar/navbar.component';
import { LandingFooterComponent } from '../components/footer/footer.component';
import { CtaBandComponent } from '../components/cta-band/cta-band.component';

@Component({
  selector: 'app-landing-layout',
  standalone: true,
  imports: [RouterOutlet, LandingNavbarComponent, LandingFooterComponent, CtaBandComponent],
  templateUrl: './landing-layout.component.html',
  styleUrl: './landing-layout.component.css',
})
export class LandingLayoutComponent {
  private readonly router = inject(Router);

  constructor() {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntilDestroyed()
      )
      .subscribe(() => window.scrollTo(0, 0));
  }
}
