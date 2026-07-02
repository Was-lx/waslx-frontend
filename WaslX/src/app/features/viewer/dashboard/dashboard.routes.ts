import { Routes } from '@angular/router';

export const viewerDashboardRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./dashboard.component').then((m) => m.ViewerDashboardComponent)
  }
];
