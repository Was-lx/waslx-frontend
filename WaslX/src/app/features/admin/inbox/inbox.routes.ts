import { Routes } from '@angular/router';

export const adminInboxRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./inbox.component').then((m) => m.AdminInboxComponent)
  }
];
