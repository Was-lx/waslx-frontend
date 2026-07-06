import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiClientService } from './api-client.service';
import type { Subscription, UpgradeInput, AddCard, PaymentMethod } from '../models/platform.models';

@Injectable({ providedIn: 'root' })
export class SubscriptionApiService {
  private readonly api = inject(ApiClientService);

  getMine(): Observable<Subscription> {
    return this.api.get<Subscription>('/subscription');
  }

  upgrade(input: UpgradeInput): Observable<Subscription> {
    return this.api.post<Subscription>('/subscription/upgrade', input);
  }

  cancel(): Observable<void> {
    return this.api.post<void>('/subscription/cancel', {});
  }

  setPaymentMethod(card: AddCard): Observable<PaymentMethod> {
    return this.api.post<PaymentMethod>('/subscription/payment-method', card);
  }
}
