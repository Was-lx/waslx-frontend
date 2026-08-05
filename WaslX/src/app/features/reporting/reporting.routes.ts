import { Routes } from '@angular/router';

export const reportingRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/reporting-dashboard/reporting-dashboard.page').then(
        (m) => m.ReportingDashboardPageComponent,
      ),
  },
];
