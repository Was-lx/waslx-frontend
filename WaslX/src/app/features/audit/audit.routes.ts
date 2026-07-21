import { Routes } from '@angular/router';

export const auditRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/audit-log/audit-log.page').then((m) => m.AuditLogPageComponent),
  },
];
