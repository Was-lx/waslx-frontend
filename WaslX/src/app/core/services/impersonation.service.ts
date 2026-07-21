import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';

import { SuperAdminApiService } from '../api/superadmin-api.service';
import type { ImpersonationSession, StartImpersonationInput } from '../models/platform.models';
import { AuthSessionService, type AuthSession } from './auth-session.service';

/**
 * What we persist locally so the impersonation banner + swapped token survive a
 * page refresh. `origin` is the Platform Owner's own session, restored on exit.
 */
interface StoredImpersonation {
  readonly session: ImpersonationSession;
  readonly origin: AuthSession;
}

/**
 * FE-6.8 · Audited impersonation.
 *
 * Owns the "act as this tenant" lifecycle for the Platform Owner:
 *  - `start()` snapshots the super-admin session, calls POST /impersonate, then
 *    swaps the active access token (via AuthSessionService) so every subsequent
 *    API call carries the short-lived tenant token. The super-admin role is kept
 *    so the console stays navigable; the persistent banner is the guardrail.
 *  - `end()` restores the super-admin token and best-effort audits the session end.
 *  - State is persisted to localStorage so a refresh keeps both the banner and the
 *    swapped token in sync.
 */
@Injectable({ providedIn: 'root' })
export class ImpersonationService {
  private static readonly storageKey = 'waslx.impersonation';

  private readonly api = inject(SuperAdminApiService);
  private readonly authSession = inject(AuthSessionService);

  /** The live impersonation session, or null when not impersonating. */
  readonly active = signal<ImpersonationSession | null>(this.restore()?.session ?? null);
  readonly isImpersonating = computed(() => this.active() !== null);

  /**
   * Begin impersonating `tenantId` with a required `reason` (audited server-side).
   * On success the active token is swapped to the returned tenant token.
   */
  start(input: StartImpersonationInput): Observable<ImpersonationSession> {
    return this.api.startImpersonation(input).pipe(
      tap((session) => {
        const origin = this.authSession.session();
        if (origin) {
          this.persist({ session, origin });
          // Swap the active token so subsequent API calls act as the tenant.
          // Roles are preserved by updateTokens, keeping the console usable.
          this.authSession.updateTokens(session.accessToken, session.refreshToken ?? undefined);
        }
        this.active.set(session);
      })
    );
  }

  /**
   * Exit impersonation: restore the super-admin token first (so the audit call is
   * authenticated as the Platform Owner), clear local state, then best-effort end.
   */
  end(): Observable<void> | void {
    const stored = this.restore();
    if (!stored) {
      this.active.set(null);
      return;
    }

    this.restoreOrigin(stored.origin);

    return new Observable<void>((subscriber) => {
      this.api.endImpersonation(stored.session.sessionId).subscribe({
        next: () => {
          subscriber.next();
          subscriber.complete();
        },
        // Local session is already restored; the end call is best-effort.
        error: (err) => subscriber.error(err)
      });
    });
  }

  /**
   * Auto-exit when the short-lived session reaches ExpiresAt. Restores the token
   * locally immediately, then fires the end call best-effort (ignored on failure).
   */
  expire(): void {
    const stored = this.restore();
    if (!stored) {
      this.active.set(null);
      return;
    }
    this.restoreOrigin(stored.origin);
    this.api.endImpersonation(stored.session.sessionId).subscribe({ next: () => {}, error: () => {} });
  }

  private restoreOrigin(origin: AuthSession): void {
    this.authSession.updateTokens(origin.accessToken, origin.refreshToken);
    this.clear();
    this.active.set(null);
  }

  // ── persistence ──
  private persist(value: StoredImpersonation): void {
    if (typeof window === 'undefined') {
      return;
    }
    window.localStorage.setItem(ImpersonationService.storageKey, JSON.stringify(value));
  }

  private restore(): StoredImpersonation | null {
    if (typeof window === 'undefined') {
      return null;
    }
    const raw = window.localStorage.getItem(ImpersonationService.storageKey);
    if (!raw) {
      return null;
    }
    try {
      const parsed = JSON.parse(raw) as StoredImpersonation;
      if (!parsed?.session?.sessionId || !parsed?.origin?.accessToken) {
        return null;
      }
      return parsed;
    } catch {
      window.localStorage.removeItem(ImpersonationService.storageKey);
      return null;
    }
  }

  private clear(): void {
    if (typeof window === 'undefined') {
      return;
    }
    window.localStorage.removeItem(ImpersonationService.storageKey);
  }
}
