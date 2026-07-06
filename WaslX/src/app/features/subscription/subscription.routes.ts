import { Routes } from '@angular/router';

export const subscriptionRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/subscription/subscription.page').then((m) => m.SubscriptionPageComponent)
  }
];
