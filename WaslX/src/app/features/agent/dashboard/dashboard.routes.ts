import { Routes } from '@angular/router';

export const agentDashboardRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./dashboard.component').then((m) => m.AgentDashboardComponent)
  }
];
