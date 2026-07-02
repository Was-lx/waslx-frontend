import { HttpInterceptorFn } from '@angular/common/http';

import { inject } from '@angular/core';

import { AuthSessionService } from '../services/auth-session.service';

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const authSessionService = inject(AuthSessionService);
  const accessToken = authSessionService.getAccessToken();

  if (!accessToken || request.url.includes('/auth/login') || request.url.includes('/auth/refresh')) {
    return next(request);
  }

  return next(
    request.clone({
      setHeaders: {
        Authorization: `Bearer ${accessToken}`
      }
    })
  );
};
