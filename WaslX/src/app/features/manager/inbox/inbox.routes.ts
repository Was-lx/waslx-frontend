import { Routes } from '@angular/router';

export const managerInboxRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./inbox.component').then((m) => m.ManagerInboxComponent)
  }
];
