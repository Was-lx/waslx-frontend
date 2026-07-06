import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { MeApiService } from '../api/me-api.service';
import { AuthSessionService } from './auth-session.service';
import type { Me } from '../models/platform.models';

/**
 * Holds the signed-in user's resolved permissions (from /me) so the UI can gate
 * features by real permission — not just role. Loaded after login/sign-up and on
 * app start when a session already exists.
 */
@Injectable({ providedIn: 'root' })
export class PermissionsStore {
  private readonly meApi = inject(MeApiService);
  private readonly auth = inject(AuthSessionService);

  readonly me = signal<Me | null>(null);
  readonly loaded = signal(false);

  constructor() {
    // Drop resolved permissions the moment the session ends (sign-out / expiry).
    effect(() => {
      if (!this.auth.session()) {
        this.me.set(null);
      }
    });
  }

  private readonly permsSet = computed(() => new Set(this.me()?.permissions ?? []));

  readonly tenantName = computed(() => this.me()?.tenantName ?? null);
  readonly tenantId = computed(() => this.me()?.tenantId ?? null);
  readonly onboardingCompleted = computed(() => this.me()?.onboardingCompleted ?? true);
  readonly onboardingStep = computed(() => this.me()?.onboardingStep ?? 0);

  async load(): Promise<void> {
    try {
      const me = await firstValueFrom(this.meApi.get());
      this.me.set(me);
    } catch {
      this.me.set(null);
    } finally {
      this.loaded.set(true);
    }
  }

  clear(): void {
    this.me.set(null);
    this.loaded.set(false);
  }

  can(code: string): boolean {
    return this.permsSet().has(code);
  }

  canAny(...codes: string[]): boolean {
    return codes.some((c) => this.permsSet().has(c));
  }

  scope(code: string): string | null {
    return this.me()?.scopes?.[code] ?? null;
  }
}
