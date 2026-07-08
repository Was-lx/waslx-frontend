import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';

declare global {
  interface Window {
    FB?: {
      init(params: { appId: string; xfbml: boolean; version: string }): void;
      login(
        callback: (response: { authResponse?: { code: string } | null; status?: string }) => void,
        params: {
          config_id: string;
          response_type: 'code';
          override_default_response_type: true;
          extras: { setup: Record<string, unknown>; featureType: string; sessionInfoVersion: string };
        }
      ): void;
    };
    fbAsyncInit?: () => void;
  }
}

export interface WhatsAppSignupResult {
  code: string;
  wabaId: string | null;
}

const SDK_SCRIPT_ID = 'facebook-jssdk';
const SDK_SRC = 'https://connect.facebook.net/en_US/sdk.js';
const SESSION_MESSAGE_GRACE_MS = 2000;

@Injectable({ providedIn: 'root' })
export class FacebookSdkService {
  private loadPromise: Promise<void> | null = null;

  constructor(@Inject(DOCUMENT) private readonly doc: Document) {}

  private load(): Promise<void> {
    if (this.loadPromise) {
      return this.loadPromise;
    }

    this.loadPromise = new Promise<void>((resolve) => {
      window.fbAsyncInit = () => {
        window.FB!.init({
          appId: environment.facebookAppId,
          xfbml: false,
          version: environment.facebookApiVersion
        });
        resolve();
      };

      if (this.doc.getElementById(SDK_SCRIPT_ID)) {
        if (window.FB) {
          resolve();
        }
        return;
      }

      const script = this.doc.createElement('script');
      script.id = SDK_SCRIPT_ID;
      script.src = SDK_SRC;
      script.async = true;
      script.defer = true;
      this.doc.body.appendChild(script);
    });

    return this.loadPromise;
  }

  /** Launches Meta's WhatsApp Embedded Signup popup and resolves with the authorization code. */
  launchWhatsAppEmbeddedSignup(): Observable<WhatsAppSignupResult> {
    return new Observable<WhatsAppSignupResult>((observer) => {
      let wabaId: string | null = null;
      let settled = false;
      let graceTimer: ReturnType<typeof setTimeout> | null = null;

      const onMessage = (event: MessageEvent) => {
        if (typeof event.origin !== 'string' || !event.origin.endsWith('facebook.com')) {
          return;
        }
        try {
          const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
          if (data?.type !== 'WA_EMBEDDED_SIGNUP') {
            return;
          }
          if (data.event === 'FINISH' || data.event === 'FINISH_ONLY_WABA') {
            wabaId = data.data?.waba_id ?? null;
          } else if (data.event === 'CANCEL' || data.event === 'ERROR') {
            if (!settled) {
              settled = true;
              cleanup();
              observer.error(new Error(data.data?.error_message ?? 'WhatsApp signup was cancelled'));
            }
          }
        } catch {
          // Not a JSON payload from Meta — ignore.
        }
      };

      const cleanup = () => {
        window.removeEventListener('message', onMessage);
        if (graceTimer) {
          clearTimeout(graceTimer);
        }
      };

      window.addEventListener('message', onMessage);

      this.load().then(() => {
        window.FB!.login(
          (response) => {
            if (settled) {
              return;
            }
            const code = response.authResponse?.code;
            if (!code) {
              settled = true;
              cleanup();
              observer.error(new Error('WhatsApp signup was cancelled'));
              return;
            }

            // The waba_id arrives asynchronously via postMessage; give it a short grace
            // period, otherwise proceed without it (the backend can resolve it via debug_token).
            graceTimer = setTimeout(() => {
              if (settled) {
                return;
              }
              settled = true;
              cleanup();
              observer.next({ code, wabaId });
              observer.complete();
            }, SESSION_MESSAGE_GRACE_MS);
          },
          {
            config_id: environment.whatsAppEmbeddedSignupConfigId,
            response_type: 'code',
            override_default_response_type: true,
            extras: { setup: {}, featureType: '', sessionInfoVersion: '3' }
          }
        );
      });

      return cleanup;
    });
  }
}
