import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

import { ApiClientService } from './api-client.service';
import type { SendWhatsAppTemplate, SendWhatsAppText, WhatsAppAccount } from '../models/platform.models';

/** How inbound messages on a number are distributed to agents. */
export type DistributionMode = 'RoundRobin' | 'Manual' | 'LeastBusy' | string;

/** Optional step-1 configuration captured alongside the OAuth connect handshake. */
export interface ConnectWhatsAppOptions {
  platformName?: string;
  distributionMode?: DistributionMode;
  distributeToOffline?: boolean;
  reassignOnOffline?: boolean;
  startingGroupId?: number | null;
}

/**
 * The Meta connect flow leaves this app (either a full-page redirect or a new tab), so the
 * step-1 wizard config cannot live in component state — it is stashed here before leaving for
 * Meta and read back on the /auth/meta-callback landing page, then handed to connect().
 *
 * All of these keys use localStorage (not sessionStorage) because the new-tab flow lands the
 * callback in a *different* tab than the one that started it, and only localStorage is shared
 * across same-origin tabs.
 */
const CONNECT_OPTIONS_STORAGE_KEY = 'waslx.whatsapp_connect_options';
const CONNECT_MODE_KEY = 'waslx.wa_connect_via';
const CONNECT_ERROR_KEY = 'waslx.wa_connect_error';

/** Key the channels page watches via the cross-tab `storage` event to learn the connect outcome. */
export const WA_CONNECT_RESULT_KEY = 'waslx.wa_connect_result';

/** Persist step-1 connect config across the Meta OAuth hop. */
export function stashConnectOptions(options: ConnectWhatsAppOptions): void {
  try {
    window.localStorage.setItem(CONNECT_OPTIONS_STORAGE_KEY, JSON.stringify(options));
  } catch {
    /* storage unavailable — connect proceeds with backend defaults */
  }
}

/** Read back and clear the step-1 connect config after returning from Meta. */
export function readAndClearConnectOptions(): ConnectWhatsAppOptions | undefined {
  try {
    const raw = window.localStorage.getItem(CONNECT_OPTIONS_STORAGE_KEY);
    window.localStorage.removeItem(CONNECT_OPTIONS_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ConnectWhatsAppOptions) : undefined;
  } catch {
    return undefined;
  }
}

/** Mark that the connect was launched in a new tab, so the callback closes itself instead of routing. */
export function markConnectViaTab(): void {
  try {
    window.localStorage.setItem(CONNECT_MODE_KEY, 'tab');
  } catch {
    /* storage unavailable — falls back to same-tab navigation on the callback */
  }
}

/** Clear the new-tab marker (used when falling back to the full-page redirect). */
export function clearConnectViaTab(): void {
  try {
    window.localStorage.removeItem(CONNECT_MODE_KEY);
  } catch {
    /* ignore */
  }
}

/** Callback reads (and clears) whether it was opened as a new tab. */
export function readAndClearConnectMode(): 'tab' | null {
  try {
    const value = window.localStorage.getItem(CONNECT_MODE_KEY);
    window.localStorage.removeItem(CONNECT_MODE_KEY);
    return value === 'tab' ? 'tab' : null;
  } catch {
    return null;
  }
}

/**
 * Callback tab → channels tab handoff. Writing the result key fires a `storage` event in the
 * opener tab; the error message (if any) is written first so it is already in place when the
 * opener reacts to the result.
 */
export function signalConnectResult(result: 'connected' | 'error', errorMessage?: string): void {
  try {
    if (errorMessage) {
      window.localStorage.setItem(CONNECT_ERROR_KEY, errorMessage);
    }
    window.localStorage.setItem(WA_CONNECT_RESULT_KEY, result);
  } catch {
    /* storage unavailable — opener falls back to re-probing the account on focus */
  }
}

/** Opener reads (and clears) the connect result signalled by the callback tab. */
export function readAndClearConnectResult(): 'connected' | 'error' | null {
  try {
    const value = window.localStorage.getItem(WA_CONNECT_RESULT_KEY);
    window.localStorage.removeItem(WA_CONNECT_RESULT_KEY);
    return value === 'connected' || value === 'error' ? value : null;
  } catch {
    return null;
  }
}

/** Opener reads (and clears) the error message left by a failed connect in the callback tab. */
export function readAndClearConnectError(): string | null {
  try {
    const value = window.localStorage.getItem(CONNECT_ERROR_KEY);
    window.localStorage.removeItem(CONNECT_ERROR_KEY);
    return value;
  } catch {
    return null;
  }
}

/** Backend list item from GET /whatsapp/accounts. */
interface ApiWhatsAppAccountSummary {
  id: number;
  phoneNumber: string;
  platformName: string | null;
  status: string;
  distributionMode: string;
  connectedAt: string;
}

/** View-model for a connected WhatsApp number in the accounts list. */
export interface WhatsAppAccountSummary {
  id: number;
  phoneNumber: string;
  platformName: string | null;
  status: string;
  distributionMode: DistributionMode;
  connectedAt: string;
}

@Injectable({ providedIn: 'root' })
export class WhatsAppApiService {
  private readonly api = inject(ApiClientService);

  connect(
    authorizationCode: string,
    wabaId: string | null,
    redirectUri?: string,
    options?: ConnectWhatsAppOptions,
  ): Observable<WhatsAppAccount> {
    return this.api.post<WhatsAppAccount>('/whatsapp/connect', {
      authorizationCode,
      wabaId,
      redirectUri,
      ...options,
    });
  }

  /** Lists every connected WhatsApp number for the tenant. */
  getAccounts(): Observable<WhatsAppAccountSummary[]> {
    return this.api
      .get<ApiWhatsAppAccountSummary[]>('/whatsapp/accounts')
      .pipe(map((list) => list.map(toWhatsAppAccountSummary)));
  }

  getAccount(): Observable<WhatsAppAccount> {
    return this.api.get<WhatsAppAccount>('/whatsapp/account');
  }

  disconnect(): Observable<void> {
    return this.api.post<void>('/whatsapp/disconnect');
  }

  sendText(input: SendWhatsAppText): Observable<void> {
    return this.api.post<void>('/whatsapp/messages/text', input);
  }

  sendTemplate(input: SendWhatsAppTemplate): Observable<void> {
    return this.api.post<void>('/whatsapp/messages/template', input);
  }
}

function toWhatsAppAccountSummary(a: ApiWhatsAppAccountSummary): WhatsAppAccountSummary {
  return {
    id: a.id,
    phoneNumber: a.phoneNumber,
    platformName: a.platformName ?? null,
    status: a.status,
    distributionMode: a.distributionMode,
    connectedAt: a.connectedAt,
  };
}
