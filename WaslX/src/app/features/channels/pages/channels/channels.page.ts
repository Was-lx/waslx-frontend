import { Component, OnDestroy, OnInit, computed, inject, signal } from '@angular/core';
import { Subscription as RxSubscription } from 'rxjs';

import { WhatsAppApiService } from '../../../../core/api/whatsapp-api.service';
import { ChannelStatusService } from '../../../../core/services/channel-status.service';
import { FacebookSdkService } from '../../../../core/services/facebook-sdk.service';
import { LanguageService } from '../../../../core/services/language.service';
import { ToastService } from '../../../../core/services/toast.service';
import type { WhatsAppAccount } from '../../../../core/models/platform.models';
import { IconComponent } from '../../../../shared/components/icon/icon.component';

const CONTENT = {
  en: {
    eyebrow: 'Channels',
    title: 'WhatsApp numbers',
    lead: 'Connect and manage the WhatsApp Business numbers your team replies from.',
    connect: 'Connect number',
    heroTag: 'WhatsApp Business Cloud API',
    heroTitle: 'Connect your first WhatsApp number',
    heroText: 'Link your own number through Meta’s official Cloud API — you own the number and the data. We’ll guide you through verification in a few minutes.',
    heroCta: 'Start connection',
    pending: 'Verification pending',
    guide: 'Guided setup — no technical steps.',
    listTitle: 'Connected numbers',
    emptyTitle: 'No numbers connected yet',
    emptyText: 'Once you connect a number it appears here with its health, message quota and assigned team.',
    emptyCta: 'Connect a number',
    f1: 'Official Meta Cloud API',
    f2: 'You own the number & data',
    f3: 'Live health & delivery status',
    stepsEyebrow: 'How it works',
    s1t: 'Connect your number',
    s1d: 'Sign in with Meta and pick the WhatsApp Business number you want to route.',
    s2t: 'Verify with Meta',
    s2d: 'A quick official verification confirms ownership — no code, no waiting rooms.',
    s3t: 'Start replying',
    s3d: 'Messages land in your shared inbox, routed to the right agent automatically.',
    liveLabel: 'Connection ready',
    previewName: 'Your business',
    previewMsg: 'Route every WhatsApp chat to the right agent.',
    connecting: 'Connecting…',
    loading: 'Loading your connection…',
    connectedStatus: 'Connected',
    disconnectedStatus: 'Disconnected',
    expiredStatus: 'Token expired',
    disconnect: 'Disconnect',
    connectErrorTitle: 'Connection failed',
    disconnectErrorTitle: 'Disconnect failed',
    disconnectedToastTitle: 'Number disconnected',
    disconnectedToastMsg: 'Your WhatsApp number has been disconnected.',
  },
  ar: {
    eyebrow: 'القنوات',
    title: 'أرقام واتساب',
    lead: 'اربط وأدِر أرقام واتساب بيزنس اللي فريقك بيرد منها.',
    connect: 'ربط رقم',
    heroTag: 'واتساب بيزنس · Cloud API',
    heroTitle: 'اربط أول رقم واتساب ليك',
    heroText: 'اربط رقمك الخاص عبر Cloud API الرسمي من Meta — الرقم والبيانات ملكك. هنمشّيك في التحقق في دقائق.',
    heroCta: 'ابدأ الربط',
    pending: 'في انتظار التحقق',
    guide: 'إعداد موجّه — من غير خطوات تقنية.',
    listTitle: 'الأرقام المتصلة',
    emptyTitle: 'لسه مفيش أرقام متصلة',
    emptyText: 'أول ما تربط رقم هيظهر هنا بحالته وكوتة الرسائل والفريق المعيّن له.',
    emptyCta: 'اربط رقم',
    f1: 'Cloud API الرسمي من Meta',
    f2: 'الرقم والبيانات ملكك',
    f3: 'حالة وتسليم مباشر',
    stepsEyebrow: 'إزاي بيشتغل',
    s1t: 'اربط رقمك',
    s1d: 'سجّل دخول بحساب Meta واختار رقم واتساب بيزنس اللي عايز توجّه رسايله.',
    s2t: 'أكّد مع Meta',
    s2d: 'تحقق رسمي سريع يثبت ملكيتك للرقم — من غير أكواد ولا انتظار.',
    s3t: 'ابدأ الرد',
    s3d: 'الرسايل بتوصل صندوقك المشترك وبتتوجّه للموظف المناسب أوتوماتيك.',
    liveLabel: 'جاهز للربط',
    previewName: 'نشاطك التجاري',
    previewMsg: 'وجّه كل محادثات واتساب للموظف المناسب.',
    connecting: 'جاري الربط…',
    loading: 'بنجيب حالة الاتصال…',
    connectedStatus: 'متصل',
    disconnectedStatus: 'غير متصل',
    expiredStatus: 'انتهت صلاحية الاتصال',
    disconnect: 'قطع الاتصال',
    connectErrorTitle: 'فشل الربط',
    disconnectErrorTitle: 'فشل قطع الاتصال',
    disconnectedToastTitle: 'تم فصل الرقم',
    disconnectedToastMsg: 'تم قطع اتصال رقم الواتساب بنجاح.',
  },
} as const;

@Component({
  selector: 'app-channels-page',
  standalone: true,
  imports: [IconComponent],
  template: `
    <section class="feature-page channels" [attr.dir]="direction()">
      <header class="feature-page__header">
        <div>
          <span class="feature-page__eyebrow">{{ c().eyebrow }}</span>
          <h1>{{ c().title }}</h1>
          <p class="channels__lead">{{ c().lead }}</p>
        </div>
        <button class="feature-page__btn" type="button" [disabled]="connecting() || !!account()" (click)="connect()">
          <app-icon name="link" [size]="17" /> {{ connecting() ? c().connecting : c().connect }}
        </button>
      </header>

      <!-- Connect hero (only while no number is connected yet) -->
      @if (!account()) {
      <div class="ui-card channels__hero">
        <div class="channels__hero-glow" aria-hidden="true"></div>
        <div class="channels__hero-grid" aria-hidden="true"></div>

        <div class="channels__hero-copy">
          <span class="channels__hero-tag">
            <span class="channels__wa-badge"><app-icon name="message" [size]="13" /> {{ c().heroTag }}</span>
            <span class="ui-pill ui-pill--warning ui-pill--dot">{{ c().pending }}</span>
          </span>
          <h2>{{ c().heroTitle }}</h2>
          <p>{{ c().heroText }}</p>
          <div class="channels__hero-feats">
            <span><app-icon name="shield" [size]="15" /> {{ c().f1 }}</span>
            <span><app-icon name="check-circle" [size]="15" /> {{ c().f2 }}</span>
            <span><app-icon name="zap" [size]="15" /> {{ c().f3 }}</span>
          </div>
          <div class="channels__hero-actions">
            <button class="ui-btn ui-btn--primary channels__connect-btn" type="button" [disabled]="connecting()" (click)="connect()">
              {{ connecting() ? c().connecting : c().heroCta }} <app-icon name="arrow-right" [size]="16" />
            </button>
            <span class="channels__hero-note"><app-icon name="lock" [size]="13" /> {{ c().guide }}</span>
          </div>
        </div>

        <!-- Live chat-preview visual (decorative) -->
        <div class="channels__preview" aria-hidden="true">
          <div class="channels__phone">
            <div class="channels__phone-top">
              <span class="channels__phone-dot"></span>
              <span class="channels__phone-name">{{ c().previewName }}</span>
              <span class="channels__phone-live"><span class="channels__live-dot"></span> {{ c().liveLabel }}</span>
            </div>
            <div class="channels__bubbles">
              <span class="channels__bubble channels__bubble--in">{{ c().previewMsg }}</span>
              <span class="channels__bubble channels__bubble--out">
                <app-icon name="check" [size]="12" /><app-icon name="check" [size]="12" />
              </span>
            </div>
          </div>
        </div>
      </div>
      }

      <!-- How it works — 3-step strip -->
      <div class="channels__steps">
        <span class="ui-sectiontitle">{{ c().stepsEyebrow }}</span>
        <div class="channels__steps-grid">
          <div class="channels__step">
            <span class="channels__step-num">01</span>
            <div class="channels__step-icon"><app-icon name="link" [size]="18" /></div>
            <h4>{{ c().s1t }}</h4>
            <p>{{ c().s1d }}</p>
          </div>
          <div class="channels__step">
            <span class="channels__step-num">02</span>
            <div class="channels__step-icon"><app-icon name="shield" [size]="18" /></div>
            <h4>{{ c().s2t }}</h4>
            <p>{{ c().s2d }}</p>
          </div>
          <div class="channels__step">
            <span class="channels__step-num">03</span>
            <div class="channels__step-icon"><app-icon name="send" [size]="18" /></div>
            <h4>{{ c().s3t }}</h4>
            <p>{{ c().s3d }}</p>
          </div>
        </div>
      </div>

      <!-- Connected numbers -->
      <div class="channels__list">
        <span class="ui-sectiontitle">{{ c().listTitle }}</span>

        @if (account(); as acc) {
        <div class="ui-card channels__number-card">
          <div class="channels__number-icon"><app-icon name="phone" [size]="20" /></div>
          <div class="channels__number-info">
            <strong>{{ acc.phoneNumber }}</strong>
            <span
              class="ui-pill"
              [class.ui-pill--success]="acc.status === 'Connected'"
              [class.ui-pill--warning]="acc.status === 'Expired'"
              [class.ui-pill--muted]="acc.status === 'Disconnected'"
            >
              {{ acc.status === 'Connected' ? c().connectedStatus : acc.status === 'Expired' ? c().expiredStatus : c().disconnectedStatus }}
            </span>
          </div>
          <button class="ui-btn ui-btn--ghost ui-btn--sm" type="button" [disabled]="disconnecting()" (click)="disconnect()">
            {{ c().disconnect }}
          </button>
        </div>
        } @else if (loading()) {
        <div class="feature-page__empty channels__empty">
          <app-icon name="phone" [size]="26" />
          <p>{{ c().loading }}</p>
        </div>
        } @else {
        <div class="feature-page__empty channels__empty">
          <app-icon name="phone" [size]="26" />
          <h3>{{ c().emptyTitle }}</h3>
          <p>{{ c().emptyText }}</p>
          <button class="ui-btn ui-btn--ghost ui-btn--sm channels__empty-cta" type="button" [disabled]="connecting()" (click)="connect()">
            <app-icon name="link" [size]="15" /> {{ connecting() ? c().connecting : c().emptyCta }}
          </button>
        </div>
        }
      </div>
    </section>
  `,
  styles: [`
    :host { display: block; --wa: #25d366; --wa-deep: #128c7e; }
    .channels__lead { margin: 8px 0 0; color: var(--text-secondary); font-size: 0.95rem; max-width: 56ch; }

    /* ── Connect hero — two columns: copy + live chat preview ── */
    .channels__hero {
      position: relative;
      overflow: hidden;
      display: grid;
      grid-template-columns: minmax(0, 1.15fr) minmax(0, 0.85fr);
      align-items: center;
      gap: 28px;
      padding: 30px 32px;
    }
    .channels__hero-glow {
      position: absolute; inset-inline-end: -90px; top: -90px;
      width: 340px; height: 340px; border-radius: 50%;
      background: radial-gradient(circle,
        color-mix(in srgb, var(--wa) 20%, transparent),
        color-mix(in srgb, var(--accent) 16%, transparent) 45%, transparent 68%);
      pointer-events: none;
    }
    .channels__hero-grid {
      position: absolute; inset: 0; z-index: 0; pointer-events: none;
      background-image:
        linear-gradient(color-mix(in srgb, var(--text-primary) 4%, transparent) 1px, transparent 1px),
        linear-gradient(90deg, color-mix(in srgb, var(--text-primary) 4%, transparent) 1px, transparent 1px);
      background-size: 46px 46px;
      -webkit-mask-image: radial-gradient(120% 90% at 85% 0%, #000, transparent 62%);
      mask-image: radial-gradient(120% 90% at 85% 0%, #000, transparent 62%);
    }
    [dir='rtl'] .channels__hero-grid {
      -webkit-mask-image: radial-gradient(120% 90% at 15% 0%, #000, transparent 62%);
      mask-image: radial-gradient(120% 90% at 15% 0%, #000, transparent 62%);
    }

    .channels__hero-copy { position: relative; z-index: 1; display: flex; flex-direction: column; gap: 12px; min-width: 0; }
    .channels__hero-tag { display: inline-flex; align-items: center; gap: 10px; flex-wrap: wrap; }
    .channels__wa-badge {
      display: inline-flex; align-items: center; gap: 6px;
      padding: 4px 11px; border-radius: 999px;
      font-size: 0.74rem; font-weight: 700; letter-spacing: 0.01em;
      color: color-mix(in srgb, var(--wa-deep) 80%, var(--text-primary));
      background: color-mix(in srgb, var(--wa) 14%, var(--surface));
      border: 1px solid color-mix(in srgb, var(--wa) 30%, transparent);
    }
    .channels__wa-badge svg { fill: none; stroke: currentColor; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
    .channels__hero-copy h2 { margin: 2px 0 0; font-size: clamp(1.35rem, 2.4vw, 1.6rem); font-weight: 800; letter-spacing: -0.02em; color: var(--text-primary); }
    .channels__hero-copy > p { margin: 0; color: var(--text-secondary); font-size: 0.94rem; line-height: 1.65; max-width: 52ch; }
    .channels__hero-feats { display: flex; flex-wrap: wrap; gap: 9px 18px; margin: 2px 0 4px; }
    .channels__hero-feats span { display: inline-flex; align-items: center; gap: 6px; font-size: 0.84rem; font-weight: 550; color: var(--text-secondary); }
    .channels__hero-feats svg { color: var(--wa-deep); fill: none; stroke: currentColor; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
    .channels__hero-actions { display: flex; align-items: center; gap: 16px; flex-wrap: wrap; margin-top: 4px; }
    .channels__connect-btn {
      background: linear-gradient(135deg, var(--wa), var(--wa-deep));
      box-shadow: 0 1px 0 rgb(255 255 255 / 0.18) inset, 0 8px 20px color-mix(in srgb, var(--wa) 34%, transparent);
    }
    .channels__hero-note { display: inline-flex; align-items: center; gap: 6px; font-size: 0.78rem; color: var(--text-muted); }
    .channels__hero-note svg { fill: none; stroke: currentColor; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }

    /* ── Live chat preview (decorative) ── */
    .channels__preview { position: relative; z-index: 1; justify-self: end; width: 100%; max-width: 300px; }
    [dir='rtl'] .channels__preview { justify-self: start; }
    .channels__phone {
      border-radius: 20px;
      border: 1px solid var(--border-soft, var(--border-subtle));
      background: color-mix(in srgb, var(--surface) 88%, transparent);
      -webkit-backdrop-filter: blur(14px); backdrop-filter: blur(14px);
      box-shadow: var(--shadow-float);
      overflow: hidden;
      transform: rotate(-1.4deg);
      transition: transform 300ms var(--ease-out, ease);
    }
    .channels__hero:hover .channels__phone { transform: rotate(0deg) translateY(-3px); }
    .channels__phone-top {
      display: flex; align-items: center; gap: 9px;
      padding: 12px 14px; color: #fff;
      background: linear-gradient(135deg, var(--wa-deep), var(--wa));
    }
    .channels__phone-dot { width: 26px; height: 26px; border-radius: 50%; background: rgb(255 255 255 / 0.22); box-shadow: inset 0 0 0 1px rgb(255 255 255 / 0.3); flex: 0 0 auto; }
    .channels__phone-name { font-size: 0.82rem; font-weight: 700; flex: 1 1 auto; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .channels__phone-live { display: inline-flex; align-items: center; gap: 5px; font-size: 0.64rem; font-weight: 600; opacity: 0.95; white-space: nowrap; }
    .channels__live-dot { width: 6px; height: 6px; border-radius: 50%; background: #eafff2; box-shadow: 0 0 0 0 rgb(255 255 255 / 0.6); animation: chPulse 2.4s ease-out infinite; }
    @keyframes chPulse { 0% { box-shadow: 0 0 0 0 rgb(255 255 255 / 0.6); } 70%, 100% { box-shadow: 0 0 0 6px rgb(255 255 255 / 0); } }
    .channels__bubbles {
      display: flex; flex-direction: column; gap: 9px;
      padding: 16px 14px;
      background:
        radial-gradient(circle at 20% 10%, color-mix(in srgb, var(--wa) 6%, transparent), transparent 45%),
        var(--surface-soft);
    }
    .channels__bubble { max-width: 82%; padding: 9px 12px; border-radius: 14px; font-size: 0.8rem; line-height: 1.45; }
    .channels__bubble--in { align-self: flex-start; border-end-start-radius: 4px; color: var(--text-primary); background: var(--surface); border: 1px solid var(--border-subtle); box-shadow: var(--shadow-xs); }
    .channels__bubble--out { align-self: flex-end; border-end-end-radius: 4px; display: inline-flex; align-items: center; gap: 1px; padding: 8px 12px; color: color-mix(in srgb, var(--wa-deep) 82%, #fff); background: color-mix(in srgb, var(--wa) 20%, var(--surface)); border: 1px solid color-mix(in srgb, var(--wa) 32%, transparent); }
    .channels__bubble--out svg { fill: none; stroke: currentColor; stroke-width: 2.4; stroke-linecap: round; stroke-linejoin: round; margin-inline-start: -5px; }

    /* ── How it works — 3-step strip ── */
    .channels__steps { display: flex; flex-direction: column; gap: 12px; }
    .channels__steps-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 14px; }
    .channels__step {
      position: relative; overflow: hidden;
      display: flex; flex-direction: column; gap: 6px;
      padding: 20px 18px;
      border: 1px solid var(--border-subtle); border-radius: 16px;
      background: var(--surface); box-shadow: var(--shadow-card);
      transition: transform 200ms var(--ease-out, ease), box-shadow 200ms ease, border-color 200ms ease;
    }
    .channels__step::before {
      content: ''; position: absolute; inset-inline: 0; inset-block-start: 0; block-size: 3px;
      background: linear-gradient(90deg, var(--wa), var(--wa-deep));
      opacity: 0; transition: opacity 220ms ease;
    }
    .channels__step:hover { transform: translateY(-3px); border-color: color-mix(in srgb, var(--wa) 24%, var(--border-subtle)); box-shadow: var(--shadow-md); }
    .channels__step:hover::before { opacity: 1; }
    .channels__step-num { position: absolute; inset-block-start: 14px; inset-inline-end: 16px; font-size: 1.5rem; font-weight: 800; letter-spacing: -0.02em; font-variant-numeric: tabular-nums; color: color-mix(in srgb, var(--wa) 22%, var(--surface-soft)); line-height: 1; }
    .channels__step-icon {
      display: grid; place-items: center; width: 40px; height: 40px; border-radius: 12px;
      color: var(--wa-deep); background: color-mix(in srgb, var(--wa) 12%, var(--surface));
      border: 1px solid color-mix(in srgb, var(--wa) 22%, transparent);
    }
    .channels__step-icon svg { fill: none; stroke: currentColor; stroke-width: 1.9; stroke-linecap: round; stroke-linejoin: round; }
    .channels__step h4 { margin: 6px 0 0; font-size: 0.98rem; font-weight: 750; letter-spacing: -0.01em; color: var(--text-primary); }
    .channels__step p { margin: 0; font-size: 0.85rem; line-height: 1.55; color: var(--text-muted); }

    /* ── Connected number card ── */
    .channels__number-card { display: flex; align-items: center; gap: 14px; padding: 16px 18px; }
    .channels__number-icon {
      display: grid; place-items: center; width: 40px; height: 40px; border-radius: 12px; flex: 0 0 auto;
      color: var(--wa-deep); background: color-mix(in srgb, var(--wa) 12%, var(--surface));
      border: 1px solid color-mix(in srgb, var(--wa) 22%, transparent);
    }
    .channels__number-info { display: flex; flex-direction: column; gap: 4px; flex: 1 1 auto; min-width: 0; }
    .channels__number-info strong { font-size: 0.95rem; color: var(--text-primary); }

    /* ── Empty state (numbers) ── */
    .channels__list { display: flex; flex-direction: column; gap: 12px; }
    .channels__empty svg { color: var(--wa-deep); }
    .channels__empty-cta { margin-top: 6px; }
    .channels__empty-cta svg { fill: none; stroke: currentColor; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }

    @media (max-width: 860px) {
      .channels__hero { grid-template-columns: 1fr; padding: 24px; }
      .channels__preview, [dir='rtl'] .channels__preview { justify-self: stretch; max-width: 340px; }
      .channels__steps-grid { grid-template-columns: 1fr; }
    }
    @media (max-width: 640px) {
      .channels__hero { padding: 22px; }
    }
    @media (prefers-reduced-motion: reduce) {
      .channels__phone, .channels__step { transition: none; }
      .channels__hero:hover .channels__phone { transform: rotate(-1.4deg); }
      .channels__step:hover { transform: none; }
      .channels__live-dot { animation: none; }
    }
  `],
})
export class ChannelsPageComponent implements OnInit, OnDestroy {
  private readonly languageService = inject(LanguageService);
  private readonly whatsAppApi = inject(WhatsAppApiService);
  private readonly channelStatus = inject(ChannelStatusService);
  private readonly facebookSdk = inject(FacebookSdkService);
  private readonly toast = inject(ToastService);

  readonly c = computed(() => CONTENT[this.languageService.language()]);
  readonly direction = () => this.languageService.getDirection();

  readonly account = signal<WhatsAppAccount | null>(null);
  readonly loading = signal(true);
  readonly connecting = signal(false);
  readonly disconnecting = signal(false);

  private subs: RxSubscription[] = [];

  ngOnInit(): void {
    this.loading.set(true);
    this.subs.push(
      this.whatsAppApi.getAccount().subscribe({
        next: (account) => {
          this.account.set(account);
          this.loading.set(false);
        },
        error: () => {
          // 404 (no account connected yet) and any other lookup failure both
          // resolve to the "not connected" empty state.
          this.account.set(null);
          this.loading.set(false);
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subs.forEach((sub) => sub.unsubscribe());
  }

  connect(): void {
    if (this.connecting()) {
      return;
    }
    this.connecting.set(true);

    this.subs.push(
      this.facebookSdk.launchWhatsAppEmbeddedSignup().subscribe({
        next: ({ code, wabaId }) => {
          this.subs.push(
            this.whatsAppApi.connect(code, wabaId).subscribe({
              next: (account) => {
                this.account.set(account);
                this.channelStatus.set(account.status); // flip the sidebar live badge instantly
                this.connecting.set(false);
              },
              error: (err) => {
                this.connecting.set(false);
                this.toast.error(this.c().connectErrorTitle, this.extractError(err));
              }
            })
          );
        },
        error: (err: Error) => {
          this.connecting.set(false);
          this.toast.error(this.c().connectErrorTitle, err.message);
        }
      })
    );
  }

  disconnect(): void {
    if (this.disconnecting()) {
      return;
    }
    this.disconnecting.set(true);

    this.subs.push(
      this.whatsAppApi.disconnect().subscribe({
        next: () => {
          this.account.set(null);
          this.channelStatus.set('none'); // flip the sidebar badge to Offline instantly
          this.disconnecting.set(false);
          this.toast.success(this.c().disconnectedToastTitle, this.c().disconnectedToastMsg);
        },
        error: (err) => {
          this.disconnecting.set(false);
          this.toast.error(this.c().disconnectErrorTitle, this.extractError(err));
        }
      })
    );
  }

  private extractError(err: unknown): string {
    const httpError = err as { error?: { errors?: string[] } };
    return httpError?.error?.errors?.[1] ?? httpError?.error?.errors?.[0] ?? 'Something went wrong.';
  }
}
