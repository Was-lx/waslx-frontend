import { ApplicationConfig, inject, provideAppInitializer, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { errorInterceptor } from './core/interceptors/error.interceptor';
import { AuthSessionService } from './core/services/auth-session.service';
import { PermissionsStore } from './core/services/permissions.store';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor, errorInterceptor])),
    // Resolve the signed-in user's real permissions on boot so UI gating survives refresh.
    provideAppInitializer(() => {
      const auth = inject(AuthSessionService);
      const permissions = inject(PermissionsStore);
      if (auth.isAuthenticated()) {
        return permissions.load();
      }
      return;
    })
  ]
};
