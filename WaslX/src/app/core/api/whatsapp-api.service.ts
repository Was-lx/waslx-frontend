import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiClientService } from './api-client.service';
import type { SendWhatsAppTemplate, SendWhatsAppText, WhatsAppAccount } from '../models/platform.models';

@Injectable({ providedIn: 'root' })
export class WhatsAppApiService {
  private readonly api = inject(ApiClientService);

  connect(authorizationCode: string, wabaId: string | null, redirectUri?: string): Observable<WhatsAppAccount> {
    return this.api.post<WhatsAppAccount>('/whatsapp/connect', { authorizationCode, wabaId, redirectUri });
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
