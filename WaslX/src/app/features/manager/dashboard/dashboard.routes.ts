import { Routes } from '@angular/router';

export const managerDashboardRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./dashboard.component').then((m) => m.ManagerDashboardComponent)
  }
];
