import { HttpErrorResponse } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';

import { WhatsAppApiService } from '../api/whatsapp-api.service';

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

  /** 'unknown' before first load, then the account status, or 'none' if no account is connected. */
  readonly status = signal<string>('unknown');
  readonly isLive = computed(() => this.status() === 'Connected');
  readonly loaded = computed(() => this.status() !== 'unknown');

  constructor() {
    this.refresh();
  }

  /** Re-fetches the connected account's status; safe to call after connect/disconnect. */
  refresh(): void {
    this.whatsAppApi.getAccount().subscribe({
      next: (account) => this.status.set(account.status),
      error: (err: HttpErrorResponse) => {
        if (err.status === 404) {
          // No WhatsApp account connected yet — genuinely offline.
          this.status.set('none');
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
