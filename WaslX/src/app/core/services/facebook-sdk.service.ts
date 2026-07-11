import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';

const OAUTH_STATE_KEY = 'waslx.meta_oauth_state';

/** Path the browser lands back on after Meta's OAuth dialog. Must be registered verbatim
 *  under the Meta App's "Valid OAuth Redirect URIs". */
export const META_OAUTH_CALLBACK_PATH = '/auth/meta-callback';

@Injectable({ providedIn: 'root' })
export class FacebookSdkService {
  constructor(@Inject(DOCUMENT) private readonly doc: Document) {}

  /**
   * Starts WhatsApp Embedded Signup via a real full-page redirect to Meta's OAuth dialog
   * (not the FB.login() JS-SDK popup). The JS SDK's popup always negotiates its own internal
   * `redirect_uri` (a staticxx.facebook.com relay channel) regardless of what we pass it, which
   * made the subsequent server-side code exchange fail with OAuthException 100/36008 — Meta
   * rejects the code because the exchange's redirect_uri can never match that internal,
   * runtime-generated channel URL. A manual redirect lets us own the entire redirect_uri.
   */
  beginWhatsAppEmbeddedSignupRedirect(appId: string, configId: string, apiVersion: string): void {
    const state = crypto.randomUUID();
    window.sessionStorage.setItem(OAUTH_STATE_KEY, state);
    
    const redirectUri = `${window.location.origin}${META_OAUTH_CALLBACK_PATH}`;
    const params = new URLSearchParams({
      client_id: appId,
      config_id: configId,
      redirect_uri: redirectUri,
      response_type: 'code',
      state
    });

    this.doc.defaultView!.location.href = `https://www.facebook.com/${apiVersion}/dialog/oauth?${params.toString()}`;
  }

  /** Reads back and clears the CSRF state token stashed before the redirect. */
  consumeOAuthState(): string | null {
    const state = window.sessionStorage.getItem(OAUTH_STATE_KEY);
    window.sessionStorage.removeItem(OAUTH_STATE_KEY);
    return state;
  }

  /** The exact redirect_uri used to start the flow — the backend must echo this back to Meta. */
  get redirectUri(): string {
    return `${window.location.origin}${META_OAUTH_CALLBACK_PATH}`;
  }
}
