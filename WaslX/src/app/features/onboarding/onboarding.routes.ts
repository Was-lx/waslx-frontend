import { Routes } from '@angular/router';

export const onboardingRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/onboarding/onboarding.page').then(m => m.OnboardingPageComponent)
  }
];
