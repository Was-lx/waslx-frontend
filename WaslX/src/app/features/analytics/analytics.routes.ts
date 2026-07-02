import { Routes } from '@angular/router';

export const analyticsRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/analytics/analytics.page').then((m) => m.AnalyticsPageComponent)
  }
];
