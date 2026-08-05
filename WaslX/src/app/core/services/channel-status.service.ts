import { HttpErrorResponse } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';

import { WhatsAppApiService } from '../api/whatsapp-api.service';
import { AuthSessionService } from './auth-session.service';

/** How long to wait before retrying after a transient failure (backend restart, network blip). */
const RETRY_DELAY_MS = 3000;

/**
 * App-global source of truth for whether the tenant's WhatsApp channel is live.
 * "Live" == the connected account's status is `Connected`. Consumed by the sidebar
 * (health badge) and refreshed by the channels page after connect/disconnect.
 */
@Injectable({ providedIn: 'root' })
export class ChannelStatusService {
  private readonly whatsAppApi = inject(WhatsAppApiService);
  private readonly auth = inject(AuthSessionService);

  /** 'unknown' before first load, then the account status, or 'none' if no account is connected. */
  readonly status = signal<string>('unknown');
  readonly isLive = computed(() => this.status() === 'Connected');
  readonly loaded = computed(() => this.status() !== 'unknown');

  constructor() {
    this.refresh();
  }

  /** Re-fetches the connected account's status; safe to call after connect/disconnect. */
  refresh(): void {
    // No session (login page or after logout) — don't fire the request at all,
    // otherwise it 401s and the error interceptor shows a "session expired" toast
    // even though the user deliberately logged out.
    if (!this.auth.getAccessToken()) {
      this.status.set('unknown');
      return;
    }

    // Platform (SuperAdmin) accounts have no tenant / WhatsApp channel — skip the tenant-scoped
    // request entirely; it would 400 (NoTenantContext) and retry-loop every few seconds.
    if (this.auth.getPrimaryRole() === 'SuperAdmin') {
      this.status.set('none');
      return;
    }

    this.whatsAppApi.getAccount().subscribe({
      next: (account) => this.status.set(account.status),
      error: (err: HttpErrorResponse) => {
        if (err.status === 404) {
          // No WhatsApp account connected yet — genuinely offline.
          this.status.set('none');
          return;
        }
        if (err.status === 400 || err.status === 401 || err.status === 403) {
          // 400 = no tenant context (e.g. a platform account); 401/403 = not authenticated.
          // Neither is a transient failure — stop instead of retry-looping every few seconds.
          this.status.set(err.status === 400 ? 'none' : 'unknown');
          return;
        }
        // Transient failure (backend restarting, network blip, auth still loading, etc.) —
        // don't stomp a known-good status; just retry shortly so the badge self-heals.
        setTimeout(() => this.refresh(), RETRY_DELAY_MS);
      }
    });
  }

  /** Optimistic local update so the badge flips instantly without waiting for a refetch. */
  set(status: string): void {
    this.status.set(status);
  }
}
