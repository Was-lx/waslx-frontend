import { Routes } from '@angular/router';

export const aiAgentRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/ai-agent/ai-agent.page').then((m) => m.AiAgentPageComponent)
  }
];
