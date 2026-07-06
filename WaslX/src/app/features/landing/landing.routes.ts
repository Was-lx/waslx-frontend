import { Routes } from '@angular/router';

import { LandingLayoutComponent } from './layout/landing-layout.component';

export const landingRoutes: Routes = [
  {
    path: '',
    component: LandingLayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/home/home.page').then((m) => m.HomePageComponent),
      },
      {
        path: 'pricing',
        loadComponent: () =>
          import('./pages/pricing/pricing.page').then((m) => m.PricingPageComponent),
      },
      {
        path: 'about',
        loadComponent: () => import('./pages/about/about.page').then((m) => m.AboutPageComponent),
      },
      {
        path: 'contact',
        loadComponent: () =>
          import('./pages/contact/contact.page').then((m) => m.ContactPageComponent),
      },
    ],
  },
];
