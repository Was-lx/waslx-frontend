import { DecimalPipe } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormArray, FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { LanguageService } from '../../../../core/services/language.service';
import { ToastService } from '../../../../core/services/toast.service';
import { IconComponent } from '../../../../shared/components/icon/icon.component';
import { PlansApiService } from '../../../../core/api/plans-api.service';
import type { BillingCycle, Plan, UpsertPlan } from '../../../../core/models/platform.models';

// ─── Local bilingual copy ─────────────────────────────────────────────────────
const CONTENT = {
  en: {
    eyebrow: 'Platform console',
    navTenants: 'Tenants',
    navPlans: 'Plans',
    title: 'Subscription plans',
    subtitle: 'Define the packaging every tenant subscribes to.',
    newPlan: 'New plan',
    loading: 'Loading plans…',
    errorTitle: 'Could not load plans',
    errorBody: 'Something went wrong reaching the platform service.',
    retry: 'Retry',
    emptyTitle: 'No plans yet',
    emptyBody: 'Publish your first subscription plan to start onboarding tenants.',
    edit: 'Edit',
    public: 'Public',
    custom: 'Custom',
    popular: 'Most popular',
    sumTotal: 'Total plans',
    sumActive: 'Active',
    sumPublic: 'Public',
    sumCustom: 'Custom',
    sectionIdentity: 'Identity',
    sectionPricing: 'Pricing',
    sectionLimits: 'Limits & quotas',
    active: 'Active',
    inactive: 'Inactive',
    perMonth: '/mo',
    perYear: '/yr',
    yearly: 'yearly',
    agents: 'Agents',
    numbers: 'Numbers',
    messages: 'Messages',
    aiQuota: 'AI quota',
    trial: 'Trial',
    days: 'days',
    features: 'Features',
    // form
    createTitle: 'Create plan',
    editTitle: 'Edit plan',
    createSubtitle: 'Define a new subscription package.',
    editSubtitle: 'Update the packaging and limits.',
    code: 'Code',
    name: 'Name',
    tagline: 'Tagline',
    price: 'Price',
    priceYearly: 'Yearly price',
    billingCycle: 'Billing cycle',
    maxAgents: 'Max agents',
    maxNumbers: 'Max numbers',
    msgQuota: 'Message quota',
    aiQuotaField: 'AI quota',
    trialDays: 'Trial days',
    sortOrder: 'Sort order',
    isActive: 'Active',
    isActiveHint: 'Available for subscription.',
    isPublic: 'Public',
    isPublicHint: 'Shown on the public pricing page.',
    isCustom: 'Custom',
    isCustomHint: 'Bespoke plan, negotiated per tenant.',
    featuresLabel: 'Features',
    addFeature: 'Add feature',
    featurePlaceholder: 'e.g. Priority routing',
    monthly: 'Monthly',
    yearlyOpt: 'Yearly',
    optional: 'optional',
    cancel: 'Cancel',
    save: 'Save plan',
    saving: 'Saving…',
    createdToast: 'Plan created',
    updatedToast: 'Plan updated',
    statusToast: 'Plan status updated',
    required: 'Required',
    none: '—'
  },
  ar: {
    eyebrow: 'لوحة المنصة',
    navTenants: 'المستأجرون',
    navPlans: 'الباقات',
    title: 'باقات الاشتراك',
    subtitle: 'حدّد الباقات التي يشترك بها كل مستأجر.',
    newPlan: 'باقة جديدة',
    loading: 'جارٍ تحميل الباقات…',
    errorTitle: 'تعذّر تحميل الباقات',
    errorBody: 'حدث خطأ أثناء الاتصال بخدمة المنصة.',
    retry: 'إعادة المحاولة',
    emptyTitle: 'لا توجد باقات بعد',
    emptyBody: 'انشر أول باقة اشتراك لبدء استقبال المستأجرين.',
    edit: 'تعديل',
    public: 'عامة',
    custom: 'مخصصة',
    popular: 'الأكثر شيوعًا',
    sumTotal: 'إجمالي الباقات',
    sumActive: 'نشطة',
    sumPublic: 'عامة',
    sumCustom: 'مخصصة',
    sectionIdentity: 'التعريف',
    sectionPricing: 'التسعير',
    sectionLimits: 'الحدود والحصص',
    active: 'نشطة',
    inactive: 'غير نشطة',
    perMonth: '/شهر',
    perYear: '/سنة',
    yearly: 'سنويًا',
    agents: 'الوكلاء',
    numbers: 'الأرقام',
    messages: 'الرسائل',
    aiQuota: 'حصة الذكاء',
    trial: 'التجربة',
    days: 'يوم',
    features: 'المزايا',
    createTitle: 'إنشاء باقة',
    editTitle: 'تعديل الباقة',
    createSubtitle: 'حدّد باقة اشتراك جديدة.',
    editSubtitle: 'حدّث الباقة والحدود.',
    code: 'الرمز',
    name: 'الاسم',
    tagline: 'الوصف المختصر',
    price: 'السعر',
    priceYearly: 'السعر السنوي',
    billingCycle: 'دورة الفوترة',
    maxAgents: 'أقصى عدد وكلاء',
    maxNumbers: 'أقصى عدد أرقام',
    msgQuota: 'حصة الرسائل',
    aiQuotaField: 'حصة الذكاء',
    trialDays: 'أيام التجربة',
    sortOrder: 'ترتيب العرض',
    isActive: 'نشطة',
    isActiveHint: 'متاحة للاشتراك.',
    isPublic: 'عامة',
    isPublicHint: 'تظهر في صفحة الأسعار العامة.',
    isCustom: 'مخصصة',
    isCustomHint: 'باقة تُتفاوض لكل مستأجر.',
    featuresLabel: 'المزايا',
    addFeature: 'إضافة ميزة',
    featurePlaceholder: 'مثال: توجيه بأولوية',
    monthly: 'شهري',
    yearlyOpt: 'سنوي',
    optional: 'اختياري',
    cancel: 'إلغاء',
    save: 'حفظ الباقة',
    saving: 'جارٍ الحفظ…',
    createdToast: 'تم إنشاء الباقة',
    updatedToast: 'تم تحديث الباقة',
    statusToast: 'تم تحديث حالة الباقة',
    required: 'مطلوب',
    none: '—'
  }
} as const;

const BILLING_CYCLES: BillingCycle[] = ['Monthly', 'Yearly'];

@Component({
  selector: 'app-superadmin-plans-page',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, RouterLinkActive, DecimalPipe, IconComponent],
  templateUrl: './plans.page.html',
  styleUrl: './plans.page.css'
})
export class SuperAdminPlansPageComponent implements OnInit {
  readonly languageService = inject(LanguageService);
  private readonly fb = inject(FormBuilder);
  private readonly plansApiService = inject(PlansApiService);
  private readonly toastService = inject(ToastService);

  readonly billingCycles = BILLING_CYCLES;

  // ── i18n ──
  readonly direction = computed(() => this.languageService.getDirection(this.languageService.language()));
  readonly c = computed(() => CONTENT[this.languageService.language() === 'ar' ? 'ar' : 'en']);

  // ── state ──
  readonly plans = signal<Plan[]>([]);
  readonly loading = signal(true);
  readonly error = signal(false);
  readonly modalOpen = signal(false);
  readonly submitting = signal(false);
  readonly submitted = signal(false);
  readonly editingId = signal<number | null>(null);
  readonly busyId = signal<number | null>(null);

  // ── derived summary counts (display-only) ──
  readonly activePlansCount = computed(() => this.plans().filter((p) => p.isActive).length);
  readonly publicPlansCount = computed(() => this.plans().filter((p) => p.isPublic).length);
  readonly customPlansCount = computed(() => this.plans().filter((p) => p.isCustom).length);

  // The single most-expensive public + active plan gets the "popular" accent.
  readonly featuredPlanId = computed(() => {
    const candidates = this.plans().filter((p) => p.isActive && p.isPublic && !p.isCustom);
    if (!candidates.length) return null;
    return candidates.reduce((top, p) => (p.price > top.price ? p : top), candidates[0]).id;
  });

  readonly form = this.fb.group({
    code: ['', [Validators.required, Validators.maxLength(40)]],
    name: ['', [Validators.required, Validators.maxLength(80)]],
    tagline: [''],
    price: [0, [Validators.required, Validators.min(0)]],
    priceYearly: [null as number | null, Validators.min(0)],
    billingCycle: ['Monthly' as BillingCycle, Validators.required],
    maxAgents: [1, [Validators.required, Validators.min(0)]],
    maxNumbers: [1, [Validators.required, Validators.min(0)]],
    msgQuota: [0, [Validators.required, Validators.min(0)]],
    aiQuota: [0, [Validators.required, Validators.min(0)]],
    trialDays: [0, [Validators.required, Validators.min(0)]],
    sortOrder: [0, [Validators.required, Validators.min(0)]],
    isActive: [true],
    isPublic: [true],
    isCustom: [false],
    features: this.fb.array<FormControl<string>>([])
  });

  get featuresArray(): FormArray<FormControl<string>> {
    return this.form.get('features') as FormArray<FormControl<string>>;
  }

  ngOnInit(): void {
    this.loadPlans();
  }

  loadPlans(): void {
    this.loading.set(true);
    this.error.set(false);
    this.plansApiService.getAll().subscribe({
      next: (data) => {
        this.plans.set((data ?? []).slice().sort((a, b) => a.sortOrder - b.sortOrder));
        this.loading.set(false);
      },
      error: () => {
        this.error.set(true);
        this.loading.set(false);
      }
    });
  }

  // ── features FormArray ──
  addFeature(value = ''): void {
    this.featuresArray.push(this.fb.control(value, { nonNullable: true }));
  }

  removeFeature(index: number): void {
    this.featuresArray.removeAt(index);
  }

  private setFeatures(features: string[]): void {
    this.featuresArray.clear();
    (features ?? []).forEach((f) => this.addFeature(f));
  }

  // ── modal ──
  openCreate(): void {
    this.editingId.set(null);
    this.submitted.set(false);
    this.form.reset({
      code: '',
      name: '',
      tagline: '',
      price: 0,
      priceYearly: null,
      billingCycle: 'Monthly',
      maxAgents: 1,
      maxNumbers: 1,
      msgQuota: 0,
      aiQuota: 0,
      trialDays: 0,
      sortOrder: this.plans().length,
      isActive: true,
      isPublic: true,
      isCustom: false
    });
    this.setFeatures([]);
    this.addFeature();
    this.modalOpen.set(true);
  }

  openEdit(plan: Plan): void {
    this.editingId.set(plan.id);
    this.submitted.set(false);
    this.form.reset({
      code: plan.code,
      name: plan.name,
      tagline: plan.tagline ?? '',
      price: plan.price,
      priceYearly: plan.priceYearly,
      billingCycle: plan.billingCycle,
      maxAgents: plan.maxAgents,
      maxNumbers: plan.maxNumbers,
      msgQuota: plan.msgQuota,
      aiQuota: plan.aiQuota,
      trialDays: plan.trialDays,
      sortOrder: plan.sortOrder,
      isActive: plan.isActive,
      isPublic: plan.isPublic,
      isCustom: plan.isCustom
    });
    this.setFeatures(plan.features?.length ? plan.features : ['']);
    this.modalOpen.set(true);
  }

  closeModal(): void {
    if (this.submitting()) {
      return;
    }
    this.modalOpen.set(false);
  }

  toggleFlag(flag: 'isActive' | 'isPublic' | 'isCustom'): void {
    const control = this.form.get(flag);
    control?.setValue(!control.value);
  }

  submit(): void {
    this.submitted.set(true);
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const raw = this.form.getRawValue();
    const payload: UpsertPlan = {
      code: (raw.code ?? '').trim(),
      name: (raw.name ?? '').trim(),
      tagline: this.nullable(raw.tagline),
      price: Number(raw.price ?? 0),
      priceYearly: raw.priceYearly === null || raw.priceYearly === undefined ? null : Number(raw.priceYearly),
      billingCycle: (raw.billingCycle ?? 'Monthly') as BillingCycle,
      maxAgents: Number(raw.maxAgents ?? 0),
      maxNumbers: Number(raw.maxNumbers ?? 0),
      msgQuota: Number(raw.msgQuota ?? 0),
      aiQuota: Number(raw.aiQuota ?? 0),
      trialDays: Number(raw.trialDays ?? 0),
      isActive: !!raw.isActive,
      isPublic: !!raw.isPublic,
      isCustom: !!raw.isCustom,
      sortOrder: Number(raw.sortOrder ?? 0),
      features: (raw.features ?? []).map((f) => (f ?? '').trim()).filter((f) => f.length > 0)
    };

    this.submitting.set(true);
    const id = this.editingId();
    const request$ = id === null
      ? this.plansApiService.create(payload)
      : this.plansApiService.update(id, payload);

    request$.subscribe({
      next: () => {
        this.submitting.set(false);
        this.modalOpen.set(false);
        this.toastService.success(id === null ? this.c().createdToast : this.c().updatedToast, payload.name);
        this.loadPlans();
      },
      error: () => {
        this.submitting.set(false);
        this.toastService.error(this.c().errorTitle, this.c().errorBody);
      }
    });
  }

  // ── card toggle ──
  toggleActive(plan: Plan): void {
    const next = !plan.isActive;
    this.busyId.set(plan.id);
    this.plansApiService.setActive(plan.id, next).subscribe({
      next: () => {
        this.plans.update((list) =>
          list.map((p) => (p.id === plan.id ? { ...p, isActive: next } : p))
        );
        this.busyId.set(null);
        this.toastService.success(this.c().statusToast, plan.name);
      },
      error: () => {
        this.busyId.set(null);
        this.toastService.error(this.c().errorTitle, this.c().errorBody);
      }
    });
  }

  // ── helpers ──
  isFeatured(plan: Plan): boolean {
    return this.featuredPlanId() === plan.id;
  }

  invalid(control: string): boolean {
    const ctl = this.form.get(control);
    return !!ctl && ctl.invalid && (ctl.touched || this.submitted());
  }

  private nullable(value: string | null | undefined): string | null {
    const v = (value ?? '').trim();
    return v.length ? v : null;
  }
}
