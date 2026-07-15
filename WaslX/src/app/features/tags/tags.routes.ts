import { Routes } from '@angular/router';

export const tagsRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/tags/tags.page').then((m) => m.TagsPageComponent),
  },
];
