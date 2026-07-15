import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit, computed, inject, signal } from '@angular/core';
import { Subscription as RxSubscription } from 'rxjs';

import { environment } from '../../../../../environments/environment';
import { WhatsAppApiService, stashConnectOptions } from '../../../../core/api/whatsapp-api.service';
import type { ConnectWhatsAppOptions, DistributionMode } from '../../../../core/api/whatsapp-api.service';
import { GroupsApiService } from '../../../../core/api/groups-api.service';
import type { Group } from '../../../../core/api/groups-api.service';
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
    // ── Step 1 wizard ──
    stepOf: 'Step {n} of 2',
    step1Label: 'Configure',
    step2Label: 'Connect with Meta',
    wizTag: 'Setup',
    wizTitle: 'Set up your number',
    wizText: 'Name this number and choose how incoming chats reach your team. You’ll link the number itself with Meta in the next step.',
    idHint: 'For your reference only — the authoritative number is confirmed by Meta.',
    platformNameLabel: 'Platform name',
    platformNamePh: 'e.g. Sales · Cairo store',
    countryLabel: 'Country code',
    phoneLabel: 'Phone number',
    phonePh: '10 1234 5678',
    distTitle: 'Distribution',
    distText: 'Decide how new conversations on this number are handed to agents.',
    modeLabel: 'Assignment mode',
    modeByAdmin: 'By Admin',
    modeRoundRobin: 'Round Robin',
    modeRoundRobinWh: 'Round Robin by working hours',
    offlineLabel: 'Distribute to offline agents?',
    offlineYes: 'Yes',
    offlineNo: 'No',
    offlineHint: 'When on, agents can receive chats even while offline; when off, only online agents are included.',
    reassignLabel: 'Reassign to online agents when an agent goes offline',
    reassignHint: 'Automatically move a waiting chat to an available agent if its owner drops offline.',
    whHint: 'Round Robin by working hours uses your configured shifts and company working hours — make sure those are set up first.',
    startingGroupLabel: 'Starting team',
    startingGroupNone: 'No specific team',
    startingGroupHint: 'New conversations start in this team’s pipeline.',
    next: 'Next',
    back: 'Back',
    errNeedPlatform: 'Please enter a platform name for this number.',
    errNeedOffline: 'Please choose whether to distribute to offline agents.',
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
    // ── Step 1 wizard ──
    stepOf: 'خطوة {n} من 2',
    step1Label: 'الإعداد',
    step2Label: 'الربط مع Meta',
    wizTag: 'إعداد',
    wizTitle: 'جهّز رقمك',
    wizText: 'سمّي الرقم ده واختار إزاي المحادثات الجديدة توصل لفريقك. هتربط الرقم نفسه مع Meta في الخطوة اللي بعدها.',
    idHint: 'للعرض فقط — الرقم المعتمد بيتأكد من Meta.',
    platformNameLabel: 'اسم المنصة',
    platformNamePh: 'مثال: المبيعات · فرع القاهرة',
    countryLabel: 'كود الدولة',
    phoneLabel: 'رقم الهاتف',
    phonePh: '10 1234 5678',
    distTitle: 'التوزيع',
    distText: 'حدد إزاي المحادثات الجديدة على الرقم ده تتوزّع على الموظفين.',
    modeLabel: 'طريقة التعيين',
    modeByAdmin: 'بواسطة المدير',
    modeRoundRobin: 'توزيع دوري',
    modeRoundRobinWh: 'توزيع دوري حسب ساعات العمل',
    offlineLabel: 'توزيع على الموظفين غير المتصلين؟',
    offlineYes: 'نعم',
    offlineNo: 'لا',
    offlineHint: 'لما يكون مفعّل، الموظفين يقدروا يستلموا محادثات حتى وهم غير متصلين؛ ولما يكون مقفول، المتصلين بس هما اللي يتوزّع عليهم.',
    reassignLabel: 'إعادة التعيين لموظف متصل لو الموظف الحالي خرج',
    reassignHint: 'نقل المحادثة المنتظرة تلقائيًا لموظف متاح لو صاحبها اتفصل.',
    whHint: 'التوزيع الدوري حسب ساعات العمل بيعتمد على الورديات وساعات عمل الشركة المهيّأة — اتأكد إنها متظبطة الأول.',
    startingGroupLabel: 'الفريق المبدئي',
    startingGroupNone: 'من غير فريق محدد',
    startingGroupHint: 'المحادثات الجديدة بتبدأ في مسار الفريق ده.',
    next: 'التالي',
    back: 'رجوع',
    errNeedPlatform: 'من فضلك اكتب اسم منصة للرقم ده.',
    errNeedOffline: 'من فضلك اختار إذا كنت عايز توزّع على الموظفين غير المتصلين.',
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
        <button class="feature-page__btn" type="button" [disabled]="connecting() || !!account()" (click)="advance()">
          <app-icon name="link" [size]="17" /> {{ connecting() ? c().connecting : c().connect }}
        </button>
      </header>

      <!-- 2-step connect wizard (only while no number is connected yet) -->
      @if (!account()) {

      <!-- Stepper -->
      <ol class="channels__stepper" [attr.aria-label]="c().stepsEyebrow">
        <li class="channels__stepper-item" [class.is-active]="step() === 1" [class.is-done]="step() > 1">
          <span class="channels__stepper-dot">
            @if (step() > 1) { <app-icon name="check" [size]="13" /> } @else { 1 }
          </span>
          <span class="channels__stepper-label">{{ c().step1Label }}</span>
        </li>
        <span class="channels__stepper-line" aria-hidden="true"></span>
        <li class="channels__stepper-item" [class.is-active]="step() === 2">
          <span class="channels__stepper-dot">2</span>
          <span class="channels__stepper-label">{{ c().step2Label }}</span>
        </li>
      </ol>
      }

      <!-- Step 1 — configuration form (in-page, NOT a popup) -->
      @if (!account() && step() === 1) {
      <div class="ui-card channels__wizard">
        <div class="channels__wizard-head">
          <span class="channels__wa-badge"><app-icon name="sliders" [size]="13" /> {{ c().wizTag }}</span>
          <h2>{{ c().wizTitle }}</h2>
          <p>{{ c().wizText }}</p>
        </div>

        <!-- Identity -->
        <div class="channels__form-grid">
          <div class="ui-field channels__field-wide">
            <label class="ui-label" for="wa-platform">{{ c().platformNameLabel }}</label>
            <input
              id="wa-platform"
              class="ui-input"
              type="text"
              [value]="platformName()"
              (input)="onPlatformInput($event)"
              [placeholder]="c().platformNamePh"
              autocomplete="off"
            />
          </div>
          <div class="ui-field">
            <label class="ui-label" for="wa-cc">{{ c().countryLabel }}</label>
            <select id="wa-cc" class="ui-select" [value]="countryCode()" (change)="onCountryChange($event)">
              @for (cc of countryCodes; track cc.dial) {
                <option [value]="cc.dial">{{ cc.dial }} · {{ cc.label }}</option>
              }
            </select>
          </div>
          <div class="ui-field">
            <label class="ui-label" for="wa-phone">{{ c().phoneLabel }}</label>
            <input
              id="wa-phone"
              class="ui-input"
              type="tel"
              inputmode="tel"
              [value]="phone()"
              (input)="onPhoneInput($event)"
              [placeholder]="c().phonePh"
              autocomplete="off"
            />
          </div>
        </div>
        <p class="channels__id-hint"><app-icon name="lock" [size]="13" /> {{ c().idHint }}</p>

        <hr class="channels__divider" />

        <!-- Distribution -->
        <div class="channels__form-section">
          <div class="channels__section-head">
            <div class="channels__section-icon"><app-icon name="route" [size]="17" /></div>
            <div>
              <h3>{{ c().distTitle }}</h3>
              <p>{{ c().distText }}</p>
            </div>
          </div>

          <div class="ui-field">
            <label class="ui-label" for="wa-mode">{{ c().modeLabel }}</label>
            <select id="wa-mode" class="ui-select" [value]="distributionMode()" (change)="onModeChange($event)">
              <option value="Manual">{{ c().modeByAdmin }}</option>
              <option value="RoundRobin">{{ c().modeRoundRobin }}</option>
              <option value="RoundRobinByWorkingHours">{{ c().modeRoundRobinWh }}</option>
            </select>
          </div>

          <!-- Round Robin extras -->
          @if (distributionMode() === 'RoundRobin') {
          <div class="channels__subfield">
            <div class="channels__choice-row">
              <div class="channels__choice-copy">
                <span class="ui-label">{{ c().offlineLabel }}</span>
                <p class="channels__field-hint">{{ c().offlineHint }}</p>
              </div>
              <div class="ui-seg channels__choice-seg" role="group" [attr.aria-label]="c().offlineLabel">
                <button
                  type="button"
                  class="ui-seg__btn"
                  [class.is-active]="distributeToOffline() === true"
                  (click)="setDistributeToOffline(true)"
                >{{ c().offlineYes }}</button>
                <button
                  type="button"
                  class="ui-seg__btn"
                  [class.is-active]="distributeToOffline() === false"
                  (click)="setDistributeToOffline(false)"
                >{{ c().offlineNo }}</button>
              </div>
            </div>

            <div class="channels__choice-row">
              <div class="channels__choice-copy">
                <span class="ui-label">{{ c().reassignLabel }}</span>
                <p class="channels__field-hint">{{ c().reassignHint }}</p>
              </div>
              <button
                type="button"
                class="ui-toggle"
                role="switch"
                [attr.aria-checked]="reassignOnOffline()"
                [class.is-on]="reassignOnOffline()"
                (click)="reassignOnOffline.set(!reassignOnOffline())"
              ></button>
            </div>
          </div>
          }

          <!-- Working-hours mode hint -->
          @if (distributionMode() === 'RoundRobinByWorkingHours') {
          <div class="channels__hint">
            <app-icon name="clock" [size]="16" />
            <span>{{ c().whHint }}</span>
          </div>
          }

          <!-- Starting team (only when groups exist) -->
          @if (groups().length) {
          <div class="ui-field">
            <label class="ui-label" for="wa-group">{{ c().startingGroupLabel }}</label>
            <select id="wa-group" class="ui-select" [value]="startingGroupId() ?? ''" (change)="onGroupChange($event)">
              <option value="">{{ c().startingGroupNone }}</option>
              @for (g of groups(); track g.id) {
                <option [value]="g.id">{{ g.name }}</option>
              }
            </select>
            <span class="channels__field-hint">{{ c().startingGroupHint }}</span>
          </div>
          }
        </div>

        @if (step1Error(); as err) {
        <p class="ui-error channels__form-error"><app-icon name="help-circle" [size]="14" /> {{ err }}</p>
        }

        <div class="channels__wizard-actions">
          <button class="ui-btn ui-btn--primary channels__connect-btn" type="button" (click)="next()">
            {{ c().next }} <app-icon name="arrow-right" [size]="16" />
          </button>
        </div>
      </div>
      }

      <!-- Step 2 — EXISTING Meta connect action (unchanged), gated behind step 1 -->
      @if (!account() && step() === 2) {
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
            <button class="ui-btn ui-btn--ghost channels__back-btn" type="button" [disabled]="connecting()" (click)="back()">
              <app-icon name="chevron-left" [size]="16" /> {{ c().back }}
            </button>
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

    /* ── Stepper ── */
    .channels__stepper { display: flex; align-items: center; gap: 12px; margin: 2px 0 -4px; padding: 0; list-style: none; }
    .channels__stepper-item { display: inline-flex; align-items: center; gap: 9px; min-width: 0; }
    .channels__stepper-dot {
      display: grid; place-items: center; width: 26px; height: 26px; border-radius: 50%; flex: 0 0 auto;
      font-size: 0.8rem; font-weight: 800; font-variant-numeric: tabular-nums;
      color: var(--text-muted); background: var(--surface-soft);
      border: 1px solid var(--border-subtle); transition: all 200ms var(--ease-out, ease);
    }
    .channels__stepper-dot svg { fill: none; stroke: currentColor; stroke-width: 2.6; stroke-linecap: round; stroke-linejoin: round; }
    .channels__stepper-label { font-size: 0.85rem; font-weight: 650; color: var(--text-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .channels__stepper-item.is-active .channels__stepper-dot { color: #fff; background: linear-gradient(135deg, var(--wa), var(--wa-deep)); border-color: transparent; box-shadow: 0 4px 12px color-mix(in srgb, var(--wa) 32%, transparent); }
    .channels__stepper-item.is-active .channels__stepper-label { color: var(--text-primary); }
    .channels__stepper-item.is-done .channels__stepper-dot { color: var(--wa-deep); background: color-mix(in srgb, var(--wa) 14%, var(--surface)); border-color: color-mix(in srgb, var(--wa) 30%, transparent); }
    .channels__stepper-item.is-done .channels__stepper-label { color: var(--text-secondary); }
    .channels__stepper-line { flex: 1 1 auto; height: 2px; max-width: 120px; border-radius: 2px; background: var(--border-subtle); }

    /* ── Step 1 wizard card ── */
    .channels__wizard { display: flex; flex-direction: column; gap: 18px; padding: 26px 28px; }
    .channels__wizard-head { display: flex; flex-direction: column; gap: 8px; }
    .channels__wizard-head h2 { margin: 4px 0 0; font-size: clamp(1.25rem, 2.2vw, 1.5rem); font-weight: 800; letter-spacing: -0.02em; color: var(--text-primary); }
    .channels__wizard-head > p { margin: 0; color: var(--text-secondary); font-size: 0.92rem; line-height: 1.6; max-width: 60ch; }

    .channels__form-grid { display: grid; grid-template-columns: minmax(0, 1.4fr) minmax(0, 0.7fr) minmax(0, 1fr); gap: 14px; }
    .channels__field-wide { grid-column: 1 / -1; }
    .channels__id-hint { display: inline-flex; align-items: center; gap: 6px; margin: -4px 0 0; font-size: 0.78rem; color: var(--text-muted); }
    .channels__id-hint svg { fill: none; stroke: currentColor; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; flex: 0 0 auto; }

    .channels__divider { height: 1px; border: 0; margin: 2px 0; background: var(--border-subtle); }

    .channels__form-section { display: flex; flex-direction: column; gap: 16px; }
    .channels__section-head { display: flex; align-items: flex-start; gap: 12px; }
    .channels__section-icon {
      display: grid; place-items: center; width: 38px; height: 38px; border-radius: 11px; flex: 0 0 auto;
      color: var(--wa-deep); background: color-mix(in srgb, var(--wa) 12%, var(--surface));
      border: 1px solid color-mix(in srgb, var(--wa) 22%, transparent);
    }
    .channels__section-icon svg { fill: none; stroke: currentColor; stroke-width: 1.9; stroke-linecap: round; stroke-linejoin: round; }
    .channels__section-head h3 { margin: 0; font-size: 1rem; font-weight: 750; letter-spacing: -0.01em; color: var(--text-primary); }
    .channels__section-head p { margin: 3px 0 0; font-size: 0.85rem; line-height: 1.5; color: var(--text-muted); }

    .channels__subfield {
      display: flex; flex-direction: column; gap: 14px;
      padding: 16px; border-radius: 14px;
      border: 1px solid var(--border-subtle);
      background: color-mix(in srgb, var(--wa) 4%, var(--surface-soft));
    }
    .channels__choice-row { display: flex; align-items: center; justify-content: space-between; gap: 16px; }
    .channels__choice-copy { min-width: 0; display: flex; flex-direction: column; gap: 3px; }
    .channels__field-hint { margin: 0; font-size: 0.78rem; line-height: 1.45; color: var(--text-muted); }
    .channels__choice-seg { flex: 0 0 auto; }

    .channels__hint {
      display: flex; align-items: flex-start; gap: 10px;
      padding: 13px 15px; border-radius: 13px;
      font-size: 0.85rem; line-height: 1.55; color: color-mix(in srgb, var(--warning) 78%, var(--text-primary));
      background: color-mix(in srgb, var(--warning) 12%, var(--surface));
      border: 1px solid color-mix(in srgb, var(--warning) 26%, transparent);
    }
    .channels__hint svg { flex: 0 0 auto; margin-top: 1px; color: var(--warning); fill: none; stroke: currentColor; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }

    .channels__form-error { display: inline-flex; align-items: center; gap: 6px; margin: 0; }
    .channels__form-error svg { flex: 0 0 auto; fill: none; stroke: currentColor; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }

    .channels__wizard-actions { display: flex; justify-content: flex-end; margin-top: 2px; }
    .channels__wizard-actions .channels__connect-btn svg,
    .channels__back-btn svg { fill: none; stroke: currentColor; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
    [dir='rtl'] .channels__wizard-actions .channels__connect-btn svg,
    [dir='rtl'] .channels__back-btn svg { transform: scaleX(-1); }

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
      .channels__form-grid { grid-template-columns: 1fr 1fr; }
      .channels__field-wide { grid-column: 1 / -1; }
    }
    @media (max-width: 640px) {
      .channels__hero { padding: 22px; }
      .channels__wizard { padding: 22px; }
      .channels__form-grid { grid-template-columns: 1fr; }
      .channels__choice-row { flex-direction: column; align-items: stretch; }
      .channels__choice-seg { align-self: flex-start; }
      .channels__stepper-label { display: none; }
      .channels__stepper-line { max-width: none; }
    }
    @media (prefers-reduced-motion: reduce) {
      .channels__stepper-dot { transition: none; }
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
  private readonly groupsApi = inject(GroupsApiService);
  private readonly channelStatus = inject(ChannelStatusService);
  private readonly facebookSdk = inject(FacebookSdkService);
  private readonly toast = inject(ToastService);

  readonly c = computed(() => CONTENT[this.languageService.language()]);
  readonly direction = () => this.languageService.getDirection();

  readonly account = signal<WhatsAppAccount | null>(null);
  readonly loading = signal(true);
  readonly connecting = signal(false);
  readonly disconnecting = signal(false);

  // ── 2-step connect wizard state ──
  readonly step = signal<1 | 2>(1);
  readonly groups = signal<Group[]>([]);
  readonly step1Error = signal<string | null>(null);

  readonly platformName = signal('');
  readonly countryCode = signal('+20');
  readonly phone = signal('');
  readonly distributionMode = signal<DistributionMode>('RoundRobin');
  readonly distributeToOffline = signal<boolean | null>(null);
  readonly reassignOnOffline = signal(false);
  readonly startingGroupId = signal<number | null>(null);

  /** Country codes shown in the display-only phone field (MENA-first). */
  readonly countryCodes: ReadonlyArray<{ dial: string; label: string }> = [
    { dial: '+20', label: 'EG' },
    { dial: '+966', label: 'SA' },
    { dial: '+971', label: 'AE' },
    { dial: '+965', label: 'KW' },
    { dial: '+974', label: 'QA' },
    { dial: '+973', label: 'BH' },
    { dial: '+968', label: 'OM' },
    { dial: '+962', label: 'JO' },
    { dial: '+961', label: 'LB' },
    { dial: '+212', label: 'MA' },
    { dial: '+216', label: 'TN' },
    { dial: '+213', label: 'DZ' },
    { dial: '+970', label: 'PS' },
    { dial: '+964', label: 'IQ' },
  ];

  private subs: RxSubscription[] = [];

  ngOnInit(): void {
    this.loading.set(true);
    this.loadAccount();
    this.loadGroups();
  }

  private loadGroups(): void {
    this.subs.push(
      this.groupsApi.getGroups().subscribe({
        next: (groups) => this.groups.set(groups),
        // Groups are optional context for the wizard — a failure just hides the picker.
        error: () => this.groups.set([]),
      })
    );
  }

  // ── Step-1 field handlers ──
  onPlatformInput(event: Event): void {
    this.platformName.set((event.target as HTMLInputElement).value);
    this.step1Error.set(null);
  }

  onCountryChange(event: Event): void {
    this.countryCode.set((event.target as HTMLSelectElement).value);
  }

  onPhoneInput(event: Event): void {
    this.phone.set((event.target as HTMLInputElement).value);
  }

  onModeChange(event: Event): void {
    this.distributionMode.set((event.target as HTMLSelectElement).value as DistributionMode);
    this.step1Error.set(null);
  }

  setDistributeToOffline(value: boolean): void {
    this.distributeToOffline.set(value);
    this.step1Error.set(null);
  }

  onGroupChange(event: Event): void {
    const raw = (event.target as HTMLSelectElement).value;
    this.startingGroupId.set(raw ? Number(raw) : null);
  }

  /** Header CTA — mirrors the current step's primary action. */
  advance(): void {
    if (this.connecting() || this.account()) {
      return;
    }
    if (this.step() === 1) {
      this.next();
    } else {
      this.connect();
    }
  }

  /** Validate step 1, then reveal the (unchanged) Meta connect action in step 2. */
  next(): void {
    if (!this.platformName().trim()) {
      this.step1Error.set(this.c().errNeedPlatform);
      return;
    }
    if (this.distributionMode() === 'RoundRobin' && this.distributeToOffline() === null) {
      this.step1Error.set(this.c().errNeedOffline);
      return;
    }
    this.step1Error.set(null);
    this.step.set(2);
  }

  back(): void {
    if (this.connecting()) {
      return;
    }
    this.step.set(1);
  }

  private loadAccount(): void {
    this.subs.push(
      this.whatsAppApi.getAccount().subscribe({
        next: (account) => {
          this.account.set(account);
          this.loading.set(false);
        },
        error: (err: HttpErrorResponse) => {
          if (err.status === 404) {
            // No account connected yet — genuinely the "not connected" empty state.
            this.account.set(null);
            this.loading.set(false);
            return;
          }
          // Transient failure (backend restarting, network blip) — keep showing the
          // loading state and retry shortly instead of flashing a false "disconnected".
          setTimeout(() => this.loadAccount(), 3000);
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subs.forEach((sub) => sub.unsubscribe());
  }

  /** Navigates the whole page to Meta's OAuth dialog; the flow completes on /auth/meta-callback.
   *  Step-1 config is stashed first so the callback page can pass it into the connect call. */
  connect(): void {
    if (this.connecting()) {
      return;
    }
    this.connecting.set(true);

    const isRoundRobin = this.distributionMode() === 'RoundRobin';
    const options: ConnectWhatsAppOptions = {
      platformName: this.platformName().trim() || undefined,
      distributionMode: this.distributionMode(),
      distributeToOffline: isRoundRobin ? (this.distributeToOffline() ?? undefined) : undefined,
      reassignOnOffline: isRoundRobin ? this.reassignOnOffline() : undefined,
      startingGroupId: this.startingGroupId(),
    };
    stashConnectOptions(options);

    this.facebookSdk.beginWhatsAppEmbeddedSignupRedirect(
      environment.facebookAppId,
      environment.whatsAppEmbeddedSignupConfigId,
      environment.facebookApiVersion
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
