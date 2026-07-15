import { Routes } from '@angular/router';

export const channelsListRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/channels-list/channels-list.page').then((m) => m.ChannelsListPageComponent),
  },
];
