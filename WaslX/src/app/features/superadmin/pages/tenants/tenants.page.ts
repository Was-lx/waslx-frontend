import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { type TranslationKey, LanguageService } from '../../../../core/services/language.service';
import { ToastService } from '../../../../core/services/toast.service';
import { ImpersonationService } from '../../../../core/services/impersonation.service';
import { IconComponent } from '../../../../shared/components/icon/icon.component';
import { PlansApiService } from '../../../../core/api/plans-api.service';
import { SuperAdminApiService } from '../../../../core/api/superadmin-api.service';
import type {
  CustomerType,
  Plan,
  SuperAdminCreateTenant,
  TenantSummary
} from '../../../../core/models/platform.models';

// ─── Local bilingual copy (self-contained, no global i18n keys) ───────────────
const CONTENT = {
  en: {
    eyebrow: 'Platform console',
    navTenants: 'Tenants',
    navPlans: 'Plans',
    title: 'Tenants',
    subtitle: 'Every workspace on WaslX — provision, monitor and control.',
    newTenant: 'New tenant',
    totalTenants: 'Total tenants',
    activeTenants: 'Active',
    onTrial: 'On trial',
    suspended: 'Suspended',
    allWorkspaces: 'All',
    trialLabel: 'Trial',
    suspendedLabel: 'Paused',
    directoryLabel: 'Tenant directory',
    directoryUnit: 'workspaces',
    sectionWorkspace: 'Workspace',
    sectionProfile: 'Company profile',
    colName: 'Tenant',
    colPlan: 'Plan',
    colStatus: 'Status',
    colBilling: 'Billing',
    colTrial: 'Trial ends',
    colUsers: 'Users',
    colAdmin: 'Admin email',
    colCreated: 'Created',
    colActions: 'Actions',
    suspend: 'Suspend',
    activate: 'Activate',
    view: 'Manage',
    loading: 'Loading tenants…',
    errorTitle: 'Could not load tenants',
    errorBody: 'Something went wrong reaching the platform service.',
    retry: 'Retry',
    emptyTitle: 'No tenants yet',
    emptyBody: 'Create the first workspace to get the platform running.',
    // modal
    modalTitle: 'Provision a new tenant',
    modalSubtitle: 'Create a workspace and its first administrator.',
    orgName: 'Organization name',
    adminFullName: 'Admin full name',
    adminEmail: 'Admin email',
    plan: 'Subscription plan',
    website: 'Website',
    industry: 'Industry',
    phone: 'Phone',
    customerType: 'Customer type',
    startTrial: 'Start on trial',
    startTrialHint: 'Begin the plan trial window immediately.',
    optional: 'optional',
    selectPlan: 'Select a plan',
    cancel: 'Cancel',
    create: 'Create tenant',
    creating: 'Creating…',
    createdToast: 'Tenant created',
    statusToast: 'Tenant status updated',
    required: 'This field is required',
    invalidEmail: 'Enter a valid email',
    none: '—',
    pageLabel: 'Page',
    ofLabel: 'of',
    prev: 'Previous',
    next: 'Next'
  },
  ar: {
    eyebrow: 'لوحة المنصة',
    navTenants: 'المستأجرون',
    navPlans: 'الباقات',
    title: 'المستأجرون',
    subtitle: 'كل مساحات العمل على وصلكس — تفعيل ومراقبة وتحكم.',
    newTenant: 'مستأجر جديد',
    totalTenants: 'إجمالي المستأجرين',
    activeTenants: 'نشط',
    onTrial: 'تجريبي',
    suspended: 'موقوف',
    allWorkspaces: 'الكل',
    trialLabel: 'تجريبي',
    suspendedLabel: 'موقوف',
    directoryLabel: 'دليل المستأجرين',
    directoryUnit: 'مساحة عمل',
    sectionWorkspace: 'مساحة العمل',
    sectionProfile: 'ملف الشركة',
    colName: 'المستأجر',
    colPlan: 'الباقة',
    colStatus: 'الحالة',
    colBilling: 'الفوترة',
    colTrial: 'انتهاء التجربة',
    colUsers: 'المستخدمون',
    colAdmin: 'بريد المسؤول',
    colCreated: 'تاريخ الإنشاء',
    colActions: 'إجراءات',
    suspend: 'إيقاف',
    activate: 'تفعيل',
    view: 'إدارة',
    loading: 'جارٍ تحميل المستأجرين…',
    errorTitle: 'تعذّر تحميل المستأجرين',
    errorBody: 'حدث خطأ أثناء الاتصال بخدمة المنصة.',
    retry: 'إعادة المحاولة',
    emptyTitle: 'لا يوجد مستأجرون بعد',
    emptyBody: 'أنشئ أول مساحة عمل لتشغيل المنصة.',
    modalTitle: 'إنشاء مستأجر جديد',
    modalSubtitle: 'أنشئ مساحة عمل ومسؤولها الأول.',
    orgName: 'اسم المؤسسة',
    adminFullName: 'الاسم الكامل للمسؤول',
    adminEmail: 'بريد المسؤول',
    plan: 'باقة الاشتراك',
    website: 'الموقع الإلكتروني',
    industry: 'المجال',
    phone: 'الهاتف',
    customerType: 'نوع العملاء',
    startTrial: 'بدء الفترة التجريبية',
    startTrialHint: 'ابدأ الفترة التجريبية للباقة فورًا.',
    optional: 'اختياري',
    selectPlan: 'اختر باقة',
    cancel: 'إلغاء',
    create: 'إنشاء المستأجر',
    creating: 'جارٍ الإنشاء…',
    createdToast: 'تم إنشاء المستأجر',
    statusToast: 'تم تحديث حالة المستأجر',
    required: 'هذا الحقل مطلوب',
    invalidEmail: 'أدخل بريدًا صحيحًا',
    none: '—',
    pageLabel: 'صفحة',
    ofLabel: 'من',
    prev: 'السابق',
    next: 'التالي'
  }
} as const;

const CUSTOMER_TYPES: CustomerType[] = ['B2B', 'B2C', 'Both', 'Unknown'];

@Component({
  selector: 'app-superadmin-tenants-page',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, RouterLinkActive, DatePipe, DecimalPipe, IconComponent],
  templateUrl: './tenants.page.html',
  styleUrl: './tenants.page.css'
})
export class SuperAdminTenantsPageComponent implements OnInit {
  readonly languageService = inject(LanguageService);
  private readonly fb = inject(FormBuilder);
  private readonly plansApiService = inject(PlansApiService);
  private readonly superAdminApiService = inject(SuperAdminApiService);
  private readonly toastService = inject(ToastService);
  private readonly impersonation = inject(ImpersonationService);

  readonly customerTypes = CUSTOMER_TYPES;

  // ── i18n ──
  readonly direction = computed(() => this.languageService.getDirection(this.languageService.language()));
  readonly c = computed(() => CONTENT[this.languageService.language() === 'ar' ? 'ar' : 'en']);
  /** Impersonation copy lives in the shared platform-console i18n. */
  readonly impT = (key: TranslationKey) => this.languageService.text(key);

  // ── state ──
  readonly tenants = signal<TenantSummary[]>([]);
  readonly plans = signal<Plan[]>([]);
  readonly loading = signal(true);
  readonly error = signal(false);
  readonly modalOpen = signal(false);
  readonly submitting = signal(false);
  readonly submitted = signal(false);
  readonly busyId = signal<number | null>(null);

  // Impersonation confirm (FE-6.8)
  readonly impTarget = signal<TenantSummary | null>(null);
  readonly impReason = signal('');
  readonly impSubmitted = signal(false);
  readonly impStarting = signal(false);

  // ── pagination ──
  readonly page = signal(1);
  readonly pageSize = 8;
  readonly totalPages = computed(() => Math.max(1, Math.ceil(this.tenants().length / this.pageSize)));
  readonly pagedTenants = computed(() => {
    const start = (this.page() - 1) * this.pageSize;
    return this.tenants().slice(start, start + this.pageSize);
  });

  prevPage(): void { this.page.update((p) => Math.max(1, p - 1)); }
  nextPage(): void { this.page.update((p) => Math.min(this.totalPages(), p + 1)); }

  // ── derived stats ──
  readonly activeCount = computed(() => this.tenants().filter((t) => this.isActive(t.status)).length);
  readonly trialCount = computed(() =>
    this.tenants().filter((t) => (t.billingStatus ?? '').toLowerCase().includes('trial')).length
  );
  readonly suspendedCount = computed(() =>
    this.tenants().filter((t) => (t.status ?? '').toLowerCase().includes('suspend')).length
  );

  // Share of active workspaces — display-only figure for the KPI trend chip.
  readonly activeRatio = computed(() => {
    const total = this.tenants().length;
    return total ? Math.round((this.activeCount() / total) * 100) : 0;
  });

  readonly form = this.fb.group({
    orgName: ['', [Validators.required, Validators.minLength(2)]],
    adminFullName: ['', [Validators.required, Validators.minLength(2)]],
    adminEmail: ['', [Validators.required, Validators.email]],
    planId: [null as number | null, Validators.required],
    website: [''],
    industry: [''],
    phone: [''],
    customerType: ['Unknown' as CustomerType, Validators.required],
    startTrial: [true]
  });

  ngOnInit(): void {
    this.loadTenants();
    this.loadPlans();
  }

  // ── loaders ──
  loadTenants(): void {
    this.loading.set(true);
    this.error.set(false);
    this.superAdminApiService.getTenants().subscribe({
      next: (data) => {
        this.tenants.set(data ?? []);
        this.page.set(1);
        this.loading.set(false);
      },
      error: () => {
        this.error.set(true);
        this.loading.set(false);
      }
    });
  }

  loadPlans(): void {
    this.plansApiService.getAll().subscribe({
      next: (data) => this.plans.set(data ?? []),
      error: () => this.plans.set([])
    });
  }

  // ── modal ──
  openModal(): void {
    this.submitted.set(false);
    this.form.reset({
      orgName: '',
      adminFullName: '',
      adminEmail: '',
      planId: null,
      website: '',
      industry: '',
      phone: '',
      customerType: 'Unknown',
      startTrial: true
    });
    this.modalOpen.set(true);
  }

  closeModal(): void {
    if (this.submitting()) {
      return;
    }
    this.modalOpen.set(false);
  }

  toggleStartTrial(): void {
    this.form.controls.startTrial.setValue(!this.form.controls.startTrial.value);
  }

  submit(): void {
    this.submitted.set(true);
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const raw = this.form.getRawValue();
    const input: SuperAdminCreateTenant = {
      orgName: (raw.orgName ?? '').trim(),
      adminEmail: (raw.adminEmail ?? '').trim(),
      adminFullName: (raw.adminFullName ?? '').trim(),
      planId: Number(raw.planId),
      website: this.nullable(raw.website),
      industry: this.nullable(raw.industry),
      phone: this.nullable(raw.phone),
      customerType: (raw.customerType ?? 'Unknown') as CustomerType,
      startTrial: !!raw.startTrial
    };

    this.submitting.set(true);
    this.superAdminApiService.createTenant(input).subscribe({
      next: () => {
        this.submitting.set(false);
        this.modalOpen.set(false);
        this.toastService.success(this.c().createdToast, input.orgName);
        this.loadTenants();
      },
      error: () => {
        this.submitting.set(false);
        this.toastService.error(this.c().errorTitle, this.c().errorBody);
      }
    });
  }

  // ── row actions ──
  toggleStatus(tenant: TenantSummary): void {
    const nextStatus = this.isActive(tenant.status) ? 'Suspended' : 'Active';
    this.busyId.set(tenant.id);
    this.superAdminApiService.setTenantStatus(tenant.id, nextStatus).subscribe({
      next: () => {
        this.tenants.update((list) =>
          list.map((t) => (t.id === tenant.id ? { ...t, status: nextStatus } : t))
        );
        this.busyId.set(null);
        this.toastService.success(this.c().statusToast, tenant.name);
      },
      error: () => {
        this.busyId.set(null);
        this.toastService.error(this.c().errorTitle, this.c().errorBody);
      }
    });
  }

  // ── impersonation (FE-6.8) ──
  askImpersonate(tenant: TenantSummary): void {
    this.impSubmitted.set(false);
    this.impReason.set('');
    this.impTarget.set(tenant);
  }

  cancelImpersonate(): void {
    if (this.impStarting()) return;
    this.impTarget.set(null);
  }

  impConfirmTitle(): string {
    return this.impT('impConfirmTitle').replace('{tenant}', this.impTarget()?.name ?? '');
  }

  confirmImpersonate(): void {
    this.impSubmitted.set(true);
    const tenant = this.impTarget();
    const reason = this.impReason().trim();
    if (!tenant || !reason) return;

    this.impStarting.set(true);
    this.impersonation.start({ tenantId: tenant.id, reason }).subscribe({
      next: () => {
        this.impStarting.set(false);
        this.impTarget.set(null);
        this.toastService.success(this.impT('impStartedToast'), tenant.name);
      },
      error: () => {
        this.impStarting.set(false);
        this.toastService.error(this.impT('impErrorTitle'), this.impT('impErrorBody'));
      }
    });
  }

  // ── helpers ──
  isActive(status: string | null | undefined): boolean {
    const s = (status ?? '').toLowerCase();
    return s === 'active' || s === '' || s === 'trialing' || s === 'trial';
  }

  statusTone(status: string | null | undefined): 'success' | 'warning' | 'danger' | 'neutral' {
    const s = (status ?? '').toLowerCase();
    if (s.includes('suspend') || s.includes('cancel')) return 'danger';
    if (s.includes('pending') || s.includes('trial')) return 'warning';
    if (s.includes('active')) return 'success';
    return 'neutral';
  }

  billingTone(status: string | null | undefined): 'success' | 'warning' | 'danger' | 'neutral' {
    const s = (status ?? '').toLowerCase();
    if (s.includes('past') || s.includes('unpaid') || s.includes('fail')) return 'danger';
    if (s.includes('trial') || s.includes('pending')) return 'warning';
    if (s.includes('active') || s.includes('paid')) return 'success';
    return 'neutral';
  }

  // ── presentational avatar helpers (visual only) ──
  avatarInitials(name: string | null | undefined): string {
    const parts = (name ?? '').trim().split(/\s+/).filter(Boolean);
    if (!parts.length) return '—';
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }

  // Deterministic hue bucket (0–5) so each tenant keeps a stable gradient tint.
  avatarHue(name: string | null | undefined): number {
    const s = (name ?? '').trim();
    let hash = 0;
    for (let i = 0; i < s.length; i++) {
      hash = (hash * 31 + s.charCodeAt(i)) | 0;
    }
    return Math.abs(hash) % 6;
  }

  invalid(control: string): boolean {
    const c = this.form.get(control);
    return !!c && c.invalid && (c.touched || this.submitted());
  }

  private nullable(value: string | null | undefined): string | null {
    const v = (value ?? '').trim();
    return v.length ? v : null;
  }
}
