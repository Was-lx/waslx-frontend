import { Routes } from '@angular/router';

export const notificationsRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/notifications-center/notifications-center.page').then(
        (m) => m.NotificationsCenterPageComponent,
      ),
  },
];
