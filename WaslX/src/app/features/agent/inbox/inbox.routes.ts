import { Routes } from '@angular/router';

export const agentInboxRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./inbox.component').then((m) => m.AgentInboxComponent)
  }
];
