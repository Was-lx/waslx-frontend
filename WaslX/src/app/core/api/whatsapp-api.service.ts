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
 * The Meta connect flow is a FULL-PAGE redirect, so the step-1 wizard config cannot be held
 * in component state — it is stashed here before leaving for Meta and read back on the
 * /auth/meta-callback landing page, then handed to connect().
 */
const CONNECT_OPTIONS_STORAGE_KEY = 'waslx.whatsapp_connect_options';

/** Persist step-1 connect config across the full-page Meta OAuth redirect. */
export function stashConnectOptions(options: ConnectWhatsAppOptions): void {
  try {
    window.sessionStorage.setItem(CONNECT_OPTIONS_STORAGE_KEY, JSON.stringify(options));
  } catch {
    /* storage unavailable — connect proceeds with backend defaults */
  }
}

/** Read back and clear the step-1 connect config after returning from Meta. */
export function readAndClearConnectOptions(): ConnectWhatsAppOptions | undefined {
  try {
    const raw = window.sessionStorage.getItem(CONNECT_OPTIONS_STORAGE_KEY);
    window.sessionStorage.removeItem(CONNECT_OPTIONS_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ConnectWhatsAppOptions) : undefined;
  } catch {
    return undefined;
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
