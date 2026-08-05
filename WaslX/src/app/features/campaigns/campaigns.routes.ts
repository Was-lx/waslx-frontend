import { Routes } from '@angular/router';

export const campaignsRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/campaigns-list/campaigns-list.page').then((m) => m.CampaignsListPageComponent),
  },
  {
    path: 'new',
    loadComponent: () =>
      import('./pages/campaign-builder/campaign-builder.page').then((m) => m.CampaignBuilderPageComponent),
  },
  {
    path: ':id/edit',
    loadComponent: () =>
      import('./pages/campaign-builder/campaign-builder.page').then((m) => m.CampaignBuilderPageComponent),
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./pages/campaign-detail/campaign-detail.page').then((m) => m.CampaignDetailPageComponent),
  },
];
