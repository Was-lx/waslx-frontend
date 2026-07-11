import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { WhatsAppApiService } from '../../../../core/api/whatsapp-api.service';
import { ChannelStatusService } from '../../../../core/services/channel-status.service';
import { FacebookSdkService } from '../../../../core/services/facebook-sdk.service';
import { LanguageService } from '../../../../core/services/language.service';
import { ToastService } from '../../../../core/services/toast.service';

const CONTENT = {
  en: {
    title: 'Connecting your WhatsApp number…',
    errorTitle: 'Connection failed',
    cancelled: 'The connection was cancelled.',
    invalidState: 'This connection attempt could not be verified. Please try again.',
    missingCode: 'Meta did not return an authorization code. Please try again.'
  },
  ar: {
    title: 'جاري ربط رقم واتساب…',
    errorTitle: 'فشل الربط',
    cancelled: 'تم إلغاء عملية الربط.',
    invalidState: 'تعذّر التحقق من محاولة الربط دي. حاول تاني.',
    missingCode: 'ميتا معدتش أي كود تفويض. حاول تاني.'
  }
} as const;

/**
 * Landing page for Meta's OAuth dialog redirect (manual flow — see FacebookSdkService).
 * Exchanges the returned code for a connected WhatsApp account, then routes back to Channels.
 */
@Component({
  selector: 'app-meta-callback',
  standalone: true,
  template: `
    <section class="callback" [attr.dir]="direction()">
      <div class="callback__spinner" aria-hidden="true"></div>
      <p>{{ c().title }}</p>
    </section>
  `,
  styles: [`
    .callback {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 16px;
      min-height: 60vh;
      color: var(--text-secondary);
      font-size: 0.95rem;
    }
    .callback__spinner {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      border: 3px solid var(--border-subtle);
      border-top-color: var(--primary);
      animation: callbackSpin 800ms linear infinite;
    }
    @keyframes callbackSpin { to { transform: rotate(360deg); } }
  `]
})
export class MetaCallbackPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly whatsAppApi = inject(WhatsAppApiService);
  private readonly channelStatus = inject(ChannelStatusService);
  private readonly facebookSdk = inject(FacebookSdkService);
  private readonly languageService = inject(LanguageService);
  private readonly toast = inject(ToastService);

  protected c = () => CONTENT[this.languageService.language()];
  protected direction = () => this.languageService.getDirection();

  ngOnInit(): void {
    const params = this.route.snapshot.queryParamMap;
    const error = params.get('error') ?? params.get('error_code');
    const code = params.get('code');
    const state = params.get('state');
    const expectedState = this.facebookSdk.consumeOAuthState();

    if (error) {
      this.fail(this.c().cancelled);
      return;
    }
    if (!state || state !== expectedState) {
      this.fail(this.c().invalidState);
      return;
    }
    if (!code) {
      this.fail(this.c().missingCode);
      return;
    }

    this.whatsAppApi.connect(code, null, this.facebookSdk.redirectUri).subscribe({
      next: (account) => {
        this.channelStatus.set(account.status);
        void this.router.navigate(['/app/channels']);
      },
      error: (err) => this.fail(this.extractError(err))
    });
  }

  private fail(message: string): void {
    this.toast.error(this.c().errorTitle, message);
    void this.router.navigate(['/app/channels']);
  }

  private extractError(err: unknown): string {
    const httpError = err as { error?: { errors?: string[] } };
    return httpError?.error?.errors?.[1] ?? httpError?.error?.errors?.[0] ?? 'Something went wrong.';
  }
}
