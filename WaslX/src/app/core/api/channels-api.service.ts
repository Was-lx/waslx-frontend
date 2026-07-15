import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

import { ApiClientService } from './api-client.service';

/** Backend WhatsApp account reference nested inside a channel. */
interface ApiChannelWhatsAppAccount {
  whatsAppAccountId: number;
  phoneNumber: string;
  platformName: string | null;
}

/** Backend ChannelResponse shape. */
interface ApiChannel {
  id: number;
  name: string;
  description: string | null;
  whatsAppAccounts: ApiChannelWhatsAppAccount[];
  agentCount: number;
}

/** A WhatsApp number attached to a channel. */
export interface ChannelWhatsAppAccount {
  whatsAppAccountId: number;
  phoneNumber: string;
  platformName: string | null;
}

/** View-model used by the Channels screens. */
export interface Channel {
  id: number;
  name: string;
  description: string | null;
  whatsAppAccounts: ChannelWhatsAppAccount[];
  agentCount: number;
}

/** Create / update payload for a channel. */
export interface UpsertChannelRequest {
  name: string;
  description: string | null;
  whatsAppAccountIds: number[];
}

@Injectable({ providedIn: 'root' })
export class ChannelsApiService {
  private readonly api = inject(ApiClientService);

  getChannels(): Observable<Channel[]> {
    return this.api.get<ApiChannel[]>('/channels').pipe(map((list) => list.map(toChannel)));
  }

  getChannel(id: number): Observable<Channel> {
    return this.api.get<ApiChannel>(`/channels/${id}`).pipe(map(toChannel));
  }

  createChannel(request: UpsertChannelRequest): Observable<Channel> {
    return this.api.post<ApiChannel>('/channels', request).pipe(map(toChannel));
  }

  updateChannel(id: number, request: UpsertChannelRequest): Observable<Channel> {
    return this.api.put<ApiChannel>(`/channels/${id}`, request).pipe(map(toChannel));
  }

  deleteChannel(id: number): Observable<void> {
    return this.api.delete<void>(`/channels/${id}`);
  }
}

function toChannel(c: ApiChannel): Channel {
  return {
    id: c.id,
    name: c.name,
    description: c.description ?? null,
    whatsAppAccounts: (c.whatsAppAccounts ?? []).map((a) => ({
      whatsAppAccountId: a.whatsAppAccountId,
      phoneNumber: a.phoneNumber,
      platformName: a.platformName ?? null,
    })),
    agentCount: c.agentCount ?? 0,
  };
}
