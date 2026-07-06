import { Routes } from '@angular/router';

// ─────────────────────────────────────────────────────────────────────────────
// Platform Owner (SuperAdmin) console — plans + tenants management.
// Mounted by the app shell under `/app/superadmin`.
// ─────────────────────────────────────────────────────────────────────────────
export const superAdminRoutes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'tenants'
  },
  {
    path: 'tenants',
    loadComponent: () =>
      import('./pages/tenants/tenants.page').then((m) => m.SuperAdminTenantsPageComponent)
  },
  {
    path: 'plans',
    loadComponent: () =>
      import('./pages/plans/plans.page').then((m) => m.SuperAdminPlansPageComponent)
  }
];
