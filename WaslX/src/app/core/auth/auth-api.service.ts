import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiClientService } from '../api/api-client.service';
import type { LoginRequest, LoginResponse, RefreshTokenResponse, ForgotPasswordRequest, ResetPasswordRequest } from './auth.models';

@Injectable({ providedIn: 'root' })
export class AuthApiService {
  private readonly api = inject(ApiClientService);

  login(request: LoginRequest): Observable<LoginResponse> {
    return this.api.post<LoginResponse>('/auth/login', request);
  }

  refreshToken(refreshToken: string): Observable<RefreshTokenResponse> {
    return this.api.post<RefreshTokenResponse>('/auth/refresh', { refreshToken });
  }

  logout(): Observable<void> {
    return this.api.post<void>('/auth/logout');
  }

  forgotPassword(request: ForgotPasswordRequest): Observable<void> {
    return this.api.post<void>('/auth/forgot-password', request);
  }

  resetPassword(request: ResetPasswordRequest): Observable<void> {
    return this.api.post<void>('/auth/reset-password', request);
  }
}
