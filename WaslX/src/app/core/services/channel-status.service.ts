import { Injectable, computed, inject, signal } from '@angular/core';

import { WhatsAppApiService } from '../api/whatsapp-api.service';

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
      // 404 (no account connected yet) and any other lookup failure → offline.
      error: () => this.status.set('none')
    });
  }

  /** Optimistic local update so the badge flips instantly without waiting for a refetch. */
  set(status: string): void {
    this.status.set(status);
  }
}
