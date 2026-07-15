import { Routes } from '@angular/router';

export const teamsRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/teams/teams.page').then((m) => m.TeamsPageComponent),
  },
  {
    path: ':groupId/stages',
    loadComponent: () => import('./pages/stages/stages.page').then((m) => m.StagesPageComponent),
  },
];
