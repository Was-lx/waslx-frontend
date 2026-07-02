import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AuthSessionService } from '../services/auth-session.service';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authSessionService = inject(AuthSessionService);

  if (authSessionService.isAuthenticated()) {
    return true;
  }

  return router.createUrlTree(['/login'], {
    queryParams: {
      redirectTo: state.url
    }
  });
};
