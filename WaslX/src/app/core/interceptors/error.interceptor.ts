import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, from, switchMap, throwError } from 'rxjs';

import { AuthSessionService } from '../services/auth-session.service';
import { ToastService } from '../services/toast.service';

export const errorInterceptor: HttpInterceptorFn = (request, next) => {
  const authSessionService = inject(AuthSessionService);
  const router = inject(Router);
  const toastService = inject(ToastService);

  return next(request).pipe(
    catchError((error: unknown) => {
      if (!(error instanceof HttpErrorResponse)) {
        return throwError(() => error);
      }

      if (error.status === 401) {
        // Public auth flows own their 401s (invalid credentials, lockout, bad reset
        // code). Don't hijack them into a session-expiry refresh/redirect.
        const publicAuthPaths = ['/auth/login', '/auth/signup', '/auth/forgot-password', '/auth/reset-password', '/auth/refresh'];
        if (publicAuthPaths.some((p) => request.url.includes(p))) {
          return throwError(() => error);
        }

        const refreshToken = authSessionService.getRefreshToken();

        if (refreshToken && !request.url.includes('/auth/refresh')) {
          return from(authSessionService.refreshSession(refreshToken)).pipe(
            switchMap((refreshed) => {
              if (refreshed) {
                const retriedRequest = request.clone({
                  setHeaders: {
                    Authorization: `Bearer ${authSessionService.getAccessToken()}`
                  }
                });

                return next(retriedRequest);
              }

              authSessionService.signOut();
              void router.navigate(['/login']);
              toastService.error('Session expired', 'Please sign in again to continue.');
              return throwError(() => error);
            }),
            catchError((refreshError: unknown) => {
              authSessionService.signOut();
              void router.navigate(['/login']);
              toastService.error('Session expired', 'Please sign in again to continue.');
              return throwError(() => refreshError);
            })
          );
        }

        authSessionService.signOut();
        void router.navigate(['/login']);
        toastService.error('Unauthorized', 'Your session is no longer valid.');
        return throwError(() => error);
      }

      // Don't surface raw request failures as toasts — they leak technical detail and
      // feel unprofessional. The page that made the call decides how (or whether) to
      // show the error inline; here we just propagate it.
      return throwError(() => error);
    })
  );
};
