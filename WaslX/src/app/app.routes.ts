import { Routes } from '@angular/router';

import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';
import { roleMatchGuard } from './core/guards/role-match.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadChildren: () => import('./features/auth/auth.routes').then((m) => m.authRoutes)
  },
  {
    path: 'signup',
    loadComponent: () => import('./features/auth/pages/signup/signup.page').then((m) => m.SignupPageComponent)
  },
  {
    path: 'onboarding',
    canActivate: [authGuard],
    loadChildren: () => import('./features/onboarding/onboarding.routes').then(m => m.onboardingRoutes)
  },
  {
    // Must match FacebookSdkService.META_OAUTH_CALLBACK_PATH exactly, and be registered
    // verbatim under the Meta App's "Valid OAuth Redirect URIs".
    path: 'auth/meta-callback',
    canActivate: [authGuard],
    loadComponent: () => import('./features/auth/pages/meta-callback/meta-callback.page').then((m) => m.MetaCallbackPageComponent)
  },
  {
    path: 'app',
    canActivate: [authGuard],
    loadComponent: () => import('./layout/base-layout/base-layout.component').then((m) => m.BaseLayoutComponent),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard'
      },
      // --- DASHBOARD (Role-based canMatch) ---
      {
        path: 'superadmin',
        canMatch: [roleMatchGuard(['SuperAdmin'])],
        loadChildren: () => import('./features/superadmin/superadmin.routes').then((m) => m.superAdminRoutes)
      },
      {
        path: 'dashboard',
        canMatch: [roleMatchGuard(['Admin'])],
        loadChildren: () => import('./features/admin/dashboard/dashboard.routes').then((m) => m.adminDashboardRoutes)
      },
      {
        path: 'dashboard',
        canMatch: [roleMatchGuard(['Manager'])],
        loadChildren: () => import('./features/manager/dashboard/dashboard.routes').then((m) => m.managerDashboardRoutes)
      },
      {
        path: 'dashboard',
        canMatch: [roleMatchGuard(['Agent'])],
        loadChildren: () => import('./features/agent/dashboard/dashboard.routes').then((m) => m.agentDashboardRoutes)
      },

      // --- INBOX (shared; role visibility enforced server-side by the query) ---
      {
        path: 'inbox',
        canActivate: [roleGuard],
        data: { roles: ['Admin', 'Manager', 'Agent'] },
        loadChildren: () => import('./features/inbox/inbox.routes').then((m) => m.inboxRoutes)
      },
      // --- SHARED FEATURES ---
      {
        path: 'contacts',
        canActivate: [roleGuard],
        data: { roles: ['Admin', 'Manager', 'Agent'] },
        loadChildren: () => import('./features/contacts/contacts.routes').then((m) => m.contactsRoutes)
      },
      {
        path: 'channels',
        canActivate: [roleGuard],
        data: { roles: ['Admin', 'Manager'] },
        loadChildren: () => import('./features/channels/channels.routes').then((m) => m.channelsRoutes)
      },
      {
        path: 'channels-list',
        canActivate: [roleGuard],
        data: { roles: ['Admin', 'Manager'] },
        loadChildren: () => import('./features/channels/channels-list.routes').then((m) => m.channelsListRoutes)
      },
      {
        path: 'templates',
        canActivate: [roleGuard],
        data: { roles: ['Admin', 'Manager'] },
        loadChildren: () => import('./features/templates/templates.routes').then((m) => m.templatesRoutes)
      },
      {
        path: 'users',
        canActivate: [roleGuard],
        data: { roles: ['Admin', 'Manager'] },
        loadChildren: () => import('./features/users/users.routes').then((m) => m.usersRoutes)
      },
      {
        path: 'teams',
        canActivate: [roleGuard],
        data: { roles: ['Admin', 'Manager'] },
        loadChildren: () => import('./features/teams/teams.routes').then((m) => m.teamsRoutes)
      },
      {
        path: 'pipeline',
        canActivate: [roleGuard],
        data: { roles: ['Admin', 'Manager'] },
        loadChildren: () => import('./features/pipeline/pipeline.routes').then((m) => m.pipelineRoutes)
      },
      {
        path: 'tags',
        canActivate: [roleGuard],
        data: { roles: ['Admin', 'Manager'] },
        loadChildren: () => import('./features/tags/tags.routes').then((m) => m.tagsRoutes)
      },
      {
        path: 'knowledge-base',
        canActivate: [roleGuard],
        data: { roles: ['Admin', 'Manager'] },
        loadChildren: () => import('./features/knowledge-base/knowledge-base.routes').then((m) => m.knowledgeBaseRoutes)
      },
      {
        path: 'working-hours',
        canActivate: [roleGuard],
        data: { roles: ['Admin', 'Manager'] },
        loadChildren: () => import('./features/working-hours/working-hours.routes').then((m) => m.workingHoursRoutes)
      },
      {
        path: 'analytics',
        canActivate: [roleGuard],
        data: { roles: ['Admin', 'Manager'] },
        loadChildren: () => import('./features/analytics/analytics.routes').then((m) => m.analyticsRoutes)
      },
      {
        path: 'ai-agent',
        canActivate: [roleGuard],
        data: { roles: ['Admin', 'Manager'] },
        loadChildren: () => import('./features/ai-agent/ai-agent.routes').then((m) => m.aiAgentRoutes)
      },
      {
        path: 'settings',
        canActivate: [roleGuard],
        data: { roles: ['Admin', 'Manager', 'Agent'] },
        loadChildren: () => import('./features/settings/settings.routes').then((m) => m.settingsRoutes)
      },
      {
        path: 'permissions',
        canActivate: [roleGuard],
        data: { roles: ['Admin'] },
        loadChildren: () => import('./features/permissions/permissions.routes').then((m) => m.permissionsRoutes)
      },
      {
        path: 'subscription',
        canActivate: [roleGuard],
        data: { roles: ['Admin'] },
        loadChildren: () => import('./features/subscription/subscription.routes').then((m) => m.subscriptionRoutes)
      }
    ]
  },
  {
    path: '',
    loadChildren: () => import('./features/landing/landing.routes').then((m) => m.landingRoutes)
  },
  {
    path: '**',
    redirectTo: ''
  }
];
