import { Routes } from '@angular/router';

export const pipelineRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/pipeline/pipeline.page').then((m) => m.PipelinePageComponent),
  },
];
