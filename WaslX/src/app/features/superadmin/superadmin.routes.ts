import { Routes } from '@angular/router';

// ─────────────────────────────────────────────────────────────────────────────
// Platform Owner (SuperAdmin) console — admins, tenants (list + detail),
// plans, and billing. Mounted by the app shell under `/app/superadmin`.
// ─────────────────────────────────────────────────────────────────────────────
export const superAdminRoutes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'tenants'
  },
  {
    path: 'admins',
    loadComponent: () =>
      import('./pages/admins/admins.page').then((m) => m.SuperAdminAdminsPageComponent)
  },
  {
    path: 'tenants',
    loadComponent: () =>
      import('./pages/tenants/tenants.page').then((m) => m.SuperAdminTenantsPageComponent)
  },
  {
    path: 'tenants/:id',
    loadComponent: () =>
      import('./pages/tenant-detail/tenant-detail.page').then((m) => m.SuperAdminTenantDetailPageComponent)
  },
  {
    path: 'plans',
    loadComponent: () =>
      import('./pages/plans/plans.page').then((m) => m.SuperAdminPlansPageComponent)
  },
  {
    path: 'billing',
    loadComponent: () =>
      import('./pages/billing/billing.page').then((m) => m.SuperAdminBillingPageComponent)
  },
  {
    path: 'usage',
    loadComponent: () =>
      import('./pages/usage/usage.page').then((m) => m.SuperAdminUsagePageComponent)
  },
  {
    path: 'ai-cost',
    loadComponent: () =>
      import('./pages/ai-cost/ai-cost.page').then((m) => m.SuperAdminAiCostPageComponent)
  },
  {
    path: 'settings',
    loadComponent: () =>
      import('./pages/settings/settings.page').then((m) => m.SuperAdminSettingsPageComponent)
  },
  // ── Oversight (FE-6.9) ──
  {
    path: 'audit',
    loadComponent: () =>
      import('./pages/audit/audit.page').then((m) => m.SuperAdminAuditPageComponent)
  },
  {
    path: 'health',
    loadComponent: () =>
      import('./pages/health/health.page').then((m) => m.SuperAdminHealthPageComponent)
  },
  {
    path: 'announcements',
    loadComponent: () =>
      import('./pages/announcements/announcements.page').then((m) => m.SuperAdminAnnouncementsPageComponent)
  }
];
