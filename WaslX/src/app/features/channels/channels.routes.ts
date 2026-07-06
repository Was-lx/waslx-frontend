import { Routes } from '@angular/router';

export const channelsRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/channels/channels.page').then((m) => m.ChannelsPageComponent),
  },
];
