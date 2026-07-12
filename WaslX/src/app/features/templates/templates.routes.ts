import { Routes } from '@angular/router';

export const templatesRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/templates-list/templates-list.page').then((m) => m.TemplatesListPageComponent)
  }
];
