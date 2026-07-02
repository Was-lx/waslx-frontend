import { Routes } from '@angular/router';

export const teamsRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/teams/teams.page').then((m) => m.TeamsPageComponent)
  }
];
