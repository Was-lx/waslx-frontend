import { Routes } from '@angular/router';

export const permissionsRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/permissions/permissions.page').then((m) => m.PermissionsPageComponent),
  },
];
