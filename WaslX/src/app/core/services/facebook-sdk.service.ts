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
   * Builds Meta's OAuth dialog URL and stashes a fresh CSRF `state` token. We drive the flow with
   * a manual navigation (not the FB.login() JS-SDK popup): the JS SDK's popup always negotiates its
   * own internal `redirect_uri` (a staticxx.facebook.com relay channel) regardless of what we pass
   * it, which made the subsequent server-side code exchange fail with OAuthException 100/36008 —
   * Meta rejects the code because the exchange's redirect_uri can never match that internal,
   * runtime-generated channel URL. Owning the redirect_uri ourselves is what makes the exchange work.
   *
   * State lives in localStorage (not sessionStorage) so the value survives into a *separate* tab —
   * the new-tab connect flow lands the callback in a different tab than the one that started it.
   */
  private buildOAuthUrl(appId: string, configId: string, apiVersion: string): string {
    const state = crypto.randomUUID();
    window.localStorage.setItem(OAUTH_STATE_KEY, state);

    const params = new URLSearchParams({
      client_id: appId,
      config_id: configId,
      redirect_uri: this.redirectUri,
      response_type: 'code',
      state
    });

    return `https://www.facebook.com/${apiVersion}/dialog/oauth?${params.toString()}`;
  }

  /** Full-page redirect to Meta's OAuth dialog (fallback used when a new tab can't be opened). */
  beginWhatsAppEmbeddedSignupRedirect(appId: string, configId: string, apiVersion: string): void {
    this.doc.defaultView!.location.href = this.buildOAuthUrl(appId, configId, apiVersion);
  }

  /**
   * Opens Meta's OAuth dialog in a NEW TAB so the app itself stays put. Returns the tab handle,
   * or null when the browser blocked it — the caller should then fall back to the full-page redirect.
   * The redirect_uri is identical to the redirect flow, so the code exchange works the same way.
   */
  openWhatsAppEmbeddedSignupTab(appId: string, configId: string, apiVersion: string): Window | null {
    return this.doc.defaultView!.open(this.buildOAuthUrl(appId, configId, apiVersion), '_blank');
  }

  /** Reads back and clears the CSRF state token stashed before leaving for Meta. */
  consumeOAuthState(): string | null {
    const state = window.localStorage.getItem(OAUTH_STATE_KEY);
    window.localStorage.removeItem(OAUTH_STATE_KEY);
    return state;
  }

  /** The exact redirect_uri used to start the flow — the backend must echo this back to Meta. */
  get redirectUri(): string {
    return `${window.location.origin}${META_OAUTH_CALLBACK_PATH}`;
  }
}
