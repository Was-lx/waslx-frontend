import { Routes } from '@angular/router';

export const adminDashboardRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./dashboard.component').then((m) => m.AdminDashboardComponent)
  }
];
