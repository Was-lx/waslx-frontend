import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { SubscriptionApiService } from '../../../../core/api/subscription-api.service';
import { PlansApiService } from '../../../../core/api/plans-api.service';
import { LanguageService } from '../../../../core/services/language.service';
import { ToastService } from '../../../../core/services/toast.service';
import { IconComponent } from '../../../../shared/components/icon/icon.component';
import type {
  AddCard,
  BillingCycle,
  Plan,
  Subscription,
} from '../../../../core/models/platform.models';

// ─────────────────────────────────────────────────────────────────────────────
// Local bilingual copy — the subscription page is self-contained, so its strings
// live here (EN/AR) rather than in the shared i18n bundle.
// ─────────────────────────────────────────────────────────────────────────────
type CopyMap = Record<string, string>;

const CONTENT: { en: CopyMap; ar: CopyMap } = {
  en: {
    eyebrow: 'Billing',
    title: 'Subscription',
    subtitle: 'Manage your plan, usage, payment method and invoices.',
    testMode: 'Test mode',
    // status
    statusTrial: 'Trial',
    statusActive: 'Active',
    statusPastDue: 'Past due',
    statusCancelled: 'Cancelled',
    // current plan
    currentPlan: 'Current plan',
    perMonth: '/mo',
    perYear: '/yr',
    trialLeftOne: 'Trial · 1 day left',
    trialLeftMany: 'Trial · {n} days left',
    trialEnded: 'Trial ended',
    renewsOn: 'Renews on {date}',
    noRenewal: 'No renewal scheduled',
    changePlan: 'Upgrade / Change plan',
    cancelSub: 'Cancel subscription',
    // usage
    usage: 'Usage',
    agents: 'Agents',
    messages: 'Messages',
    aiOps: 'AI operations',
    numbers: 'WhatsApp numbers',
    monthlyQuota: 'monthly quota',
    ofUsed: '{used} of {total}',
    // payment
    payment: 'Payment method',
    noCard: 'No card on file',
    noCardHint: 'Add a card to upgrade or keep your subscription active.',
    expires: 'Expires {mm}/{yy}',
    changeCard: 'Change card',
    addCard: 'Add card',
    cardNumber: 'Card number',
    cardName: 'Name on card',
    expMonth: 'MM',
    expYear: 'YY',
    saveCard: 'Save card',
    cancel: 'Cancel',
    simulatedNote: 'This is a simulated payment. No real charge is made.',
    // plans chooser
    choosePlan: 'Choose a plan',
    plansSubtitle: 'Switch anytime. Changes apply immediately.',
    monthly: 'Monthly',
    annual: 'Annual',
    saveBadge: 'Save with annual',
    choose: 'Choose {plan}',
    currentBadge: 'Current plan',
    contactSales: 'Contact sales',
    mostPopular: 'Most popular',
    close: 'Close',
    // invoices
    invoices: 'Invoices',
    noInvoices: 'No invoices yet.',
    invAmount: 'Amount',
    invStatus: 'Status',
    invDate: 'Issued',
    // states
    loading: 'Loading your subscription…',
    errorTitle: 'Could not load billing',
    retry: 'Retry',
    // confirm cancel
    confirmCancelTitle: 'Cancel subscription?',
    confirmCancelBody:
      'Auto-renew will be stopped. You keep full access until the end of your current period.',
    confirmCancelYes: 'Yes, cancel',
    confirmCancelNo: 'Keep plan',
    // toasts
    tCardSaved: 'Payment method saved',
    tCancelled: 'Auto-renew stopped — access until {date}',
    tUpgraded: 'Plan updated',
    tCardRequired: 'Add a card first',
    tCardRequiredBody: 'A payment method is required before changing plans.',
    genericError: 'Something went wrong. Please try again.',
  },
  ar: {
    eyebrow: 'الفوترة',
    title: 'الاشتراك',
    subtitle: 'إدارة خطتك والاستهلاك ووسيلة الدفع والفواتير.',
    testMode: 'وضع الاختبار',
    statusTrial: 'تجريبي',
    statusActive: 'نشط',
    statusPastDue: 'مستحق',
    statusCancelled: 'ملغى',
    currentPlan: 'الخطة الحالية',
    perMonth: '/شهر',
    perYear: '/سنة',
    trialLeftOne: 'تجريبي · يوم واحد متبقٍّ',
    trialLeftMany: 'تجريبي · {n} يوم متبقٍّ',
    trialEnded: 'انتهت الفترة التجريبية',
    renewsOn: 'يتجدد في {date}',
    noRenewal: 'لا يوجد تجديد مجدول',
    changePlan: 'الترقية / تغيير الخطة',
    cancelSub: 'إلغاء الاشتراك',
    usage: 'الاستهلاك',
    agents: 'الموظفون',
    messages: 'الرسائل',
    aiOps: 'عمليات الذكاء الاصطناعي',
    numbers: 'أرقام واتساب',
    monthlyQuota: 'الحصة الشهرية',
    ofUsed: '{used} من {total}',
    payment: 'وسيلة الدفع',
    noCard: 'لا توجد بطاقة مسجلة',
    noCardHint: 'أضف بطاقة للترقية أو للإبقاء على اشتراكك نشطًا.',
    expires: 'تنتهي {mm}/{yy}',
    changeCard: 'تغيير البطاقة',
    addCard: 'إضافة بطاقة',
    cardNumber: 'رقم البطاقة',
    cardName: 'الاسم على البطاقة',
    expMonth: 'شهر',
    expYear: 'سنة',
    saveCard: 'حفظ البطاقة',
    cancel: 'إلغاء',
    simulatedNote: 'هذه عملية دفع محاكاة. لا يتم خصم أي مبلغ حقيقي.',
    choosePlan: 'اختر خطة',
    plansSubtitle: 'بدّل في أي وقت. تُطبَّق التغييرات فورًا.',
    monthly: 'شهري',
    annual: 'سنوي',
    saveBadge: 'وفّر مع الاشتراك السنوي',
    choose: 'اختر {plan}',
    currentBadge: 'الخطة الحالية',
    contactSales: 'تواصل مع المبيعات',
    mostPopular: 'الأكثر شيوعًا',
    close: 'إغلاق',
    invoices: 'الفواتير',
    noInvoices: 'لا توجد فواتير بعد.',
    invAmount: 'المبلغ',
    invStatus: 'الحالة',
    invDate: 'صدرت',
    loading: 'جارٍ تحميل اشتراكك…',
    errorTitle: 'تعذّر تحميل الفوترة',
    retry: 'إعادة المحاولة',
    confirmCancelTitle: 'إلغاء الاشتراك؟',
    confirmCancelBody:
      'سيتم إيقاف التجديد التلقائي. تحتفظ بكامل الوصول حتى نهاية فترتك الحالية.',
    confirmCancelYes: 'نعم، ألغِ',
    confirmCancelNo: 'الإبقاء على الخطة',
    tCardSaved: 'تم حفظ وسيلة الدفع',
    tCancelled: 'تم إيقاف التجديد التلقائي — الوصول متاح حتى {date}',
    tUpgraded: 'تم تحديث الخطة',
    tCardRequired: 'أضف بطاقة أولًا',
    tCardRequiredBody: 'وسيلة الدفع مطلوبة قبل تغيير الخطط.',
    genericError: 'حدث خطأ ما. يُرجى المحاولة مرة أخرى.',
  },
};

interface CardForm {
  number: string;
  expMonth: string;
  expYear: string;
  holderName: string;
}

@Component({
  selector: 'app-subscription-page',
  standalone: true,
  imports: [FormsModule, IconComponent, DatePipe, DecimalPipe],
  templateUrl: './subscription.page.html',
  styleUrl: './subscription.page.css',
})
export class SubscriptionPageComponent implements OnInit {
  private readonly subscriptionApi = inject(SubscriptionApiService);
  private readonly plansApi = inject(PlansApiService);
  private readonly toast = inject(ToastService);
  readonly languageService = inject(LanguageService);

  // ── i18n ──
  readonly c = computed<CopyMap>(() => CONTENT[this.languageService.language()]);
  readonly direction = () => this.languageService.getDirection();
  readonly locale = computed(() => (this.languageService.language() === 'ar' ? 'ar-EG' : 'en-US'));

  /** Interpolate {name} tokens against a copy key. */
  fmt(key: string, params: Record<string, string | number> = {}): string {
    let out = this.c()[key] ?? key;
    for (const [k, v] of Object.entries(params)) {
      out = out.replace(`{${k}}`, String(v));
    }
    return out;
  }

  // ── State ──
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly subscription = signal<Subscription | null>(null);

  readonly plans = signal<Plan[]>([]);
  readonly plansLoading = signal(false);
  readonly plansOpen = signal(false);
  readonly chooserCycle = signal<BillingCycle>('Monthly');
  readonly upgradingPlanId = signal<number | null>(null);

  readonly cardFormOpen = signal(false);
  readonly savingCard = signal(false);
  readonly cardForm = signal<CardForm>({ number: '', expMonth: '', expYear: '', holderName: '' });

  readonly confirmCancelOpen = signal(false);
  readonly cancelling = signal(false);

  // ── Derived ──
  readonly statusKey = computed<'Trial' | 'Active' | 'PastDue' | 'Cancelled'>(() => {
    const raw = (this.subscription()?.status ?? '').toLowerCase().replace(/[\s_-]/g, '');
    if (raw.includes('trial')) return 'Trial';
    if (raw.includes('pastdue') || raw.includes('overdue') || raw.includes('past')) return 'PastDue';
    if (raw.includes('cancel')) return 'Cancelled';
    return 'Active';
  });

  readonly statusLabel = computed(() => {
    const map: Record<string, string> = {
      Trial: this.c()['statusTrial'],
      Active: this.c()['statusActive'],
      PastDue: this.c()['statusPastDue'],
      Cancelled: this.c()['statusCancelled'],
    };
    return map[this.statusKey()];
  });

  readonly isActive = computed(() => this.statusKey() === 'Active');
  readonly isTrial = computed(() => this.statusKey() === 'Trial');

  /** Map the status to a shared `.ui-pill--*` variant. Cancelled → neutral (no modifier). */
  readonly statusPillVariant = computed<'success' | 'warning' | 'danger' | ''>(() => {
    switch (this.statusKey()) {
      case 'Trial':
        return 'warning';
      case 'Active':
        return 'success';
      case 'PastDue':
        return 'danger';
      default:
        return '';
    }
  });

  /** Map an invoice status to a shared `.ui-pill--*` variant. */
  invoicePillVariant(status: string): 'success' | 'warning' | 'danger' | '' {
    const s = status.toLowerCase();
    if (s.includes('paid')) return 'success';
    if (s.includes('pending') || s.includes('open')) return 'warning';
    if (s.includes('fail') || s.includes('void')) return 'danger';
    return '';
  }

  readonly cycleSuffix = computed(() =>
    this.subscription()?.billingCycle === 'Yearly' ? this.c()['perYear'] : this.c()['perMonth']
  );

  readonly trialText = computed(() => {
    const days = this.subscription()?.trialDaysLeft ?? 0;
    if (days <= 0) return this.c()['trialEnded'];
    if (days === 1) return this.c()['trialLeftOne'];
    return this.fmt('trialLeftMany', { n: days });
  });

  ngOnInit(): void {
    this.load();
  }

  // ── Data ──
  load(): void {
    this.loading.set(true);
    this.error.set(null);
    this.subscriptionApi.getMine().subscribe({
      next: (sub) => {
        this.subscription.set(sub);
        this.chooserCycle.set(sub.billingCycle === 'Yearly' ? 'Yearly' : 'Monthly');
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(this.readError(err));
        this.loading.set(false);
      },
    });
  }

  private ensurePlans(): void {
    if (this.plans().length > 0 || this.plansLoading()) return;
    this.plansLoading.set(true);
    this.plansApi.getPublic().subscribe({
      next: (plans) => {
        this.plans.set([...plans].sort((a, b) => a.sortOrder - b.sortOrder));
        this.plansLoading.set(false);
      },
      error: (err) => {
        this.plansLoading.set(false);
        this.toast.error(this.c()['errorTitle'], this.readError(err));
      },
    });
  }

  // ── Plans chooser ──
  openPlans(): void {
    this.plansOpen.set(true);
    this.ensurePlans();
    queueMicrotask(() => {
      document.getElementById('plans-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  closePlans(): void {
    this.plansOpen.set(false);
  }

  setCycle(cycle: BillingCycle): void {
    this.chooserCycle.set(cycle);
  }

  planPrice(plan: Plan): number {
    if (this.chooserCycle() === 'Yearly' && plan.priceYearly != null) return plan.priceYearly;
    return plan.price;
  }

  planCycleSuffix(): string {
    return this.chooserCycle() === 'Yearly' ? this.c()['perYear'] : this.c()['perMonth'];
  }

  isCurrentPlan(plan: Plan): boolean {
    const sub = this.subscription();
    return !!sub && sub.planId === plan.id && sub.billingCycle === this.chooserCycle();
  }

  choose(plan: Plan): void {
    if (plan.isCustom) {
      window.location.href = '/contact';
      return;
    }
    if (this.isCurrentPlan(plan)) return;

    // Guard: upgrading requires a card on file.
    if (!this.subscription()?.paymentMethod) {
      this.toast.warning(this.c()['tCardRequired'], this.c()['tCardRequiredBody']);
      this.openCardForm();
      return;
    }

    this.upgradingPlanId.set(plan.id);
    this.subscriptionApi.upgrade({ planId: plan.id, billingCycle: this.chooserCycle() }).subscribe({
      next: (sub) => {
        this.subscription.set(sub);
        this.upgradingPlanId.set(null);
        this.plansOpen.set(false);
        this.toast.success(this.c()['tUpgraded'], plan.name);
      },
      error: (err) => {
        this.upgradingPlanId.set(null);
        const code = err?.error?.code as string | undefined;
        if (code === 'Billing.PaymentMethodRequired') {
          this.toast.warning(this.c()['tCardRequired'], this.c()['tCardRequiredBody']);
          this.openCardForm();
          return;
        }
        this.toast.error(this.c()['errorTitle'], this.readError(err));
      },
    });
  }

  // ── Payment method ──
  openCardForm(): void {
    this.cardForm.set({ number: '', expMonth: '', expYear: '', holderName: '' });
    this.cardFormOpen.set(true);
  }

  closeCardForm(): void {
    this.cardFormOpen.set(false);
  }

  updateCard<K extends keyof CardForm>(field: K, value: string): void {
    this.cardForm.update((f) => ({ ...f, [field]: value }));
  }

  get cardValid(): boolean {
    const f = this.cardForm();
    const digits = f.number.replace(/\s/g, '');
    const mm = Number(f.expMonth);
    const yy = Number(f.expYear);
    return (
      digits.length >= 12 &&
      digits.length <= 19 &&
      mm >= 1 &&
      mm <= 12 &&
      f.expYear.length === 2 &&
      yy >= 0 &&
      f.holderName.trim().length > 1
    );
  }

  saveCard(): void {
    if (!this.cardValid || this.savingCard()) return;
    const f = this.cardForm();
    const payload: AddCard = {
      number: f.number.replace(/\s/g, ''),
      expMonth: Number(f.expMonth),
      expYear: 2000 + Number(f.expYear),
      holderName: f.holderName.trim() || null,
    };
    this.savingCard.set(true);
    this.subscriptionApi.setPaymentMethod(payload).subscribe({
      next: (pm) => {
        this.subscription.update((sub) => (sub ? { ...sub, paymentMethod: pm } : sub));
        this.savingCard.set(false);
        this.cardFormOpen.set(false);
        this.toast.success(this.c()['tCardSaved'], `${pm.brand} •••• ${pm.last4}`);
      },
      error: (err) => {
        this.savingCard.set(false);
        this.toast.error(this.c()['errorTitle'], this.readError(err));
      },
    });
  }

  // ── Cancel ──
  requestCancel(): void {
    this.confirmCancelOpen.set(true);
  }

  dismissCancel(): void {
    this.confirmCancelOpen.set(false);
  }

  confirmCancel(): void {
    if (this.cancelling()) return;
    this.cancelling.set(true);
    this.subscriptionApi.cancel().subscribe({
      next: () => {
        const sub = this.subscription();
        const end = sub?.currentPeriodEnd
          ? new Date(sub.currentPeriodEnd).toLocaleDateString(this.locale())
          : '—';
        this.subscription.update((s) => (s ? { ...s, status: 'Cancelled' } : s));
        this.cancelling.set(false);
        this.confirmCancelOpen.set(false);
        this.toast.success(this.fmt('tCancelled', { date: end }), '');
      },
      error: (err) => {
        this.cancelling.set(false);
        this.confirmCancelOpen.set(false);
        this.toast.error(this.c()['errorTitle'], this.readError(err));
      },
    });
  }

  // ── Meters ──
  pct(used: number, total: number): number {
    if (!total || total <= 0) return 0;
    return Math.min(100, Math.round((used / total) * 100));
  }

  private readError(err: unknown): string {
    const e = err as { error?: { description?: string; message?: string }; message?: string };
    return e?.error?.description ?? e?.error?.message ?? e?.message ?? this.c()['genericError'];
  }
}
