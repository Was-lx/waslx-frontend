import { HttpBackend, HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { environment } from '../../../environments/environment';
import type { UserProfile } from '../auth/auth.models';

export type AppRole = 'SuperAdmin' | 'Admin' | 'Manager' | 'Agent';

export interface AuthSession {
  readonly accessToken: string;
  readonly refreshToken: string;
  readonly roles: readonly AppRole[];
}

interface RefreshSessionResponse {
  readonly accessToken: string;
  readonly refreshToken?: string;
  readonly roles?: readonly string[];
  readonly userId?: string;
  readonly email?: string;
  readonly fullName?: string;
}

@Injectable({ providedIn: 'root' })
export class AuthSessionService {
  private static readonly accessTokenKey = 'waslx.accessToken';
  private static readonly refreshTokenKey = 'waslx.refreshToken';
  private static readonly rolesKey = 'waslx.roles';
  private static readonly profileKey = 'waslx.profile';
  private readonly http: HttpClient;

  readonly session = signal<AuthSession | null>(this.restoreSession());
  readonly userProfile = signal<UserProfile | null>(this.restoreProfile());

  constructor(httpBackend: HttpBackend) {
    this.http = new HttpClient(httpBackend);
  }

  isAuthenticated(): boolean {
    return Boolean(this.session()?.accessToken);
  }

  getAccessToken(): string {
    return this.session()?.accessToken ?? '';
  }

  getRefreshToken(): string {
    return this.session()?.refreshToken ?? '';
  }

  getRoles(): readonly AppRole[] {
    return this.session()?.roles ?? [];
  }

  getPrimaryRole(): AppRole | null {
    return this.session()?.roles[0] ?? null;
  }

  hasAnyRole(requiredRoles: readonly string[]): boolean {
    if (requiredRoles.length === 0) {
      return true;
    }

    return requiredRoles.some((role) => this.getRoles().includes(role as AppRole));
  }

  signIn(session: AuthSession, profile?: UserProfile): void {
    this.session.set(session);
    this.persist(session);

    if (profile) {
      this.userProfile.set(profile);
      this.persistProfile(profile);
    }
  }

  updateTokens(accessToken: string, refreshToken?: string): void {
    const currentSession = this.session();

    if (!currentSession) {
      return;
    }

    const nextSession: AuthSession = {
      accessToken,
      refreshToken: refreshToken ?? currentSession.refreshToken,
      roles: currentSession.roles
    };

    this.session.set(nextSession);
    this.persist(nextSession);
  }

  async refreshSession(refreshToken: string): Promise<boolean> {
    const currentSession = this.session();

    if (!currentSession || !refreshToken) {
      return false;
    }

    try {
      const response = await firstValueFrom(
        this.http.post<RefreshSessionResponse>(`${environment.apiUrl}/auth/refresh`, {
          token: currentSession.accessToken,
          refreshToken
        })
      );

      if (!response?.accessToken) {
        return false;
      }

      const parsedRoles = (response.roles?.length ? response.roles : currentSession.roles) as readonly AppRole[];

      const nextSession: AuthSession = {
        accessToken: response.accessToken,
        refreshToken: response.refreshToken ?? currentSession.refreshToken,
        roles: parsedRoles
      };

      this.session.set(nextSession);
      this.persist(nextSession);

      if (response.userId && response.email && response.fullName) {
        const userProfile: UserProfile = {
          id: response.userId,
          email: response.email,
          fullName: response.fullName,
          role: parsedRoles[0] ?? '',
          tenantId: this.userProfile()?.tenantId ?? ''
        };
        this.userProfile.set(userProfile);
        this.persistProfile(userProfile);
      }

      return true;
    } catch {
      return false;
    }
  }

  /**
   * Server-side logout: revokes the active refresh tokens, then clears the
   * local session. Best-effort — the local session is cleared regardless.
   */
  async logout(): Promise<void> {
    const accessToken = this.getAccessToken();

    if (accessToken) {
      try {
        await firstValueFrom(
          this.http.post<void>(
            `${environment.apiUrl}/auth/logout`,
            {},
            { headers: { Authorization: `Bearer ${accessToken}` } }
          )
        );
      } catch {
        // Ignore network/auth errors; the local session is cleared below.
      }
    }

    this.signOut();
  }

  signOut(): void {
    this.session.set(null);
    this.userProfile.set(null);
    this.removePersistedSession();
  }

  private restoreSession(): AuthSession | null {
    if (typeof window === 'undefined') {
      return null;
    }

    const accessToken = window.localStorage.getItem(AuthSessionService.accessTokenKey) ?? '';
    const refreshToken = window.localStorage.getItem(AuthSessionService.refreshTokenKey) ?? '';
    const roles = window.localStorage.getItem(AuthSessionService.rolesKey) ?? '[]';

    if (!accessToken || !refreshToken) {
      return null;
    }

    try {
      return {
        accessToken,
        refreshToken,
        roles: JSON.parse(roles) as readonly AppRole[]
      };
    } catch {
      this.removePersistedSession();
      return null;
    }
  }

  private restoreProfile(): UserProfile | null {
    if (typeof window === 'undefined') {
      return null;
    }

    const stored = window.localStorage.getItem(AuthSessionService.profileKey);

    if (!stored) {
      return null;
    }

    try {
      return JSON.parse(stored) as UserProfile;
    } catch {
      return null;
    }
  }

  private persist(session: AuthSession): void {
    if (typeof window === 'undefined') {
      return;
    }

    window.localStorage.setItem(AuthSessionService.accessTokenKey, session.accessToken);
    window.localStorage.setItem(AuthSessionService.refreshTokenKey, session.refreshToken);
    window.localStorage.setItem(AuthSessionService.rolesKey, JSON.stringify(session.roles));
  }

  private persistProfile(profile: UserProfile): void {
    if (typeof window === 'undefined') {
      return;
    }

    window.localStorage.setItem(AuthSessionService.profileKey, JSON.stringify(profile));
  }

  private removePersistedSession(): void {
    if (typeof window === 'undefined') {
      return;
    }

    window.localStorage.removeItem(AuthSessionService.accessTokenKey);
    window.localStorage.removeItem(AuthSessionService.refreshTokenKey);
    window.localStorage.removeItem(AuthSessionService.rolesKey);
    window.localStorage.removeItem(AuthSessionService.profileKey);
  }
}
