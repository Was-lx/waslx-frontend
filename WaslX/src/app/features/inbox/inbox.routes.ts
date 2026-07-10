import { Routes } from '@angular/router';

export const inboxRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/inbox/inbox.page').then((m) => m.InboxPageComponent)
  }
];
