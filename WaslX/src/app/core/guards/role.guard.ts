import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AuthSessionService } from '../services/auth-session.service';

export const roleGuard: CanActivateFn = (route) => {
  const router = inject(Router);
  const authSessionService = inject(AuthSessionService);
  const requiredRoles = (route.data['roles'] as readonly string[] | undefined) ?? [];

  if (!authSessionService.isAuthenticated()) {
    return router.createUrlTree(['/login']);
  }

  if (authSessionService.hasAnyRole(requiredRoles)) {
    return true;
  }

  return router.createUrlTree(['/'], {
    queryParams: {
      forbidden: true
    }
  });
};
