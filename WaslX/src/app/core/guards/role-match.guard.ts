import { inject } from '@angular/core';
import { type CanMatchFn, type Route, type UrlSegment } from '@angular/router';

import { AuthSessionService, type AppRole } from '../services/auth-session.service';

export const roleMatchGuard = (allowedRoles: AppRole[]): CanMatchFn => {
  return (route: Route, segments: UrlSegment[]) => {
    const authSessionService = inject(AuthSessionService);
    return authSessionService.hasAnyRole(allowedRoles);
  };
};
