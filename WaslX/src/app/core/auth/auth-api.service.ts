import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiClientService } from '../api/api-client.service';
import type { LoginRequest, LoginResponse, RefreshTokenResponse, ForgotPasswordRequest, ResetPasswordRequest } from './auth.models';
import type { SignupRequest } from '../models/platform.models';

@Injectable({ providedIn: 'root' })
export class AuthApiService {
  private readonly api = inject(ApiClientService);

  login(request: LoginRequest): Observable<LoginResponse> {
    return this.api.post<LoginResponse>('/auth/login', request);
  }

  /** Self-serve sign-up → creates the workspace on a 7-day trial and logs in. */
  signup(request: SignupRequest): Observable<LoginResponse> {
    return this.api.post<LoginResponse>('/auth/signup', request);
  }

  /** Change the signed-in user's own password. */
  changePassword(oldPassword: string, newPassword: string): Observable<void> {
    return this.api.post<void>('/auth/change-password', { oldPassword, newPassword });
  }

  refreshToken(token: string, refreshToken: string): Observable<RefreshTokenResponse> {
    return this.api.post<RefreshTokenResponse>('/auth/refresh', { token, refreshToken });
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
