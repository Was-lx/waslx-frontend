import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { type TranslationKey, LanguageService } from '../../../../core/services/language.service';
import { ToastService } from '../../../../core/services/toast.service';
import { ImpersonationService } from '../../../../core/services/impersonation.service';
import { IconComponent } from '../../../../shared/components/icon/icon.component';
import { PlansApiService } from '../../../../core/api/plans-api.service';
import { SuperAdminApiService } from '../../../../core/api/superadmin-api.service';
import { BillingApiService } from '../../../../core/api/billing-api.service';
import type {
  AssignPlanInput,
  BillingCycle,
  GenerateInvoiceInput,
  Plan,
  PlatformInvoice,
  TenantDetail
} from '../../../../core/models/platform.models';

type DetailTab = 'overview' | 'users' | 'invoices';
type LifecycleAction = 'suspend' | 'reactivate' | 'delete';

const CONTENT = {
  en: {
    back: 'Tenants',
    eyebrow: 'Tenant',
    overview: 'Overview',
    users: 'Users',
    invoices: 'Invoices',
    suspend: 'Suspend',
    reactivate: 'Reactivate',
    delete: 'Delete tenant',
    changePlan: 'Change plan',
    // overview
    plan: 'Plan',
    mrr: 'MRR',
    agents: 'Agents',
    numbers: 'Numbers',
    messages: 'Messages / cycle',
    aiQuota: 'AI / cycle',
    ofLimit: 'of',
    profile: 'Company profile',
    website: 'Website',
    industry: 'Industry',
    phone: 'Phone',
    customerType: 'Customer type',
    billingCycle: 'Billing cycle',
    price: 'Price',
    created: 'Created',
    trialEnds: 'Trial ends',
    periodEnds: 'Period ends',
    subscription: 'Subscription',
    usage: 'Usage this cycle',
    none: '—',
    // users
    usersLabel: 'Workspace users',
    colUser: 'User',
    colEmail: 'Email',
    colRole: 'Role',
    colStatus: 'Status',
    userActive: 'Active',
    userInactive: 'Inactive',
    usersEmpty: 'No users in this workspace yet.',
    // invoices
    invoicesLabel: 'Invoices',
    generate: 'Generate invoice',
    markPaid: 'Mark paid',
    paid: 'Paid',
    invoicesEmpty: 'No invoices for this tenant yet.',
    invoiceNo: 'Invoice',
    issued: 'Issued',
    due: 'Due',
    // states
    loading: 'Loading tenant…',
    errorTitle: 'Could not load tenant',
    errorBody: 'Something went wrong reaching the platform service.',
    retry: 'Retry',
    notFound: 'Tenant not found',
    // confirms
    suspendTitle: 'Suspend this tenant?',
    suspendBody: 'Members lose access until you reactivate. Conversations are preserved.',
    reactivateTitle: 'Reactivate this tenant?',
    reactivateBody: 'Members regain access immediately.',
    deleteTitle: 'Delete this tenant?',
    deleteBody: 'This permanently removes the workspace and all its data. This cannot be undone.',
    deleteConfirmLabel: 'Type the tenant name to confirm',
    cancel: 'Cancel',
    confirm: 'Confirm',
    confirmDelete: 'Delete permanently',
    // change plan
    changePlanTitle: 'Change subscription plan',
    changePlanSub: 'Move this tenant to a different plan.',
    selectPlan: 'Plan',
    monthly: 'Monthly',
    yearly: 'Yearly',
    save: 'Save',
    saving: 'Saving…',
    // generate invoice
    genTitle: 'Generate an invoice',
    genSub: 'Issue a billing line for this tenant.',
    amount: 'Amount',
    periodStart: 'Period start',
    periodEnd: 'Period end',
    dueDate: 'Due date',
    optional: 'optional',
    // toasts
    statusToast: 'Tenant status updated',
    deletedToast: 'Tenant deleted',
    planToast: 'Plan updated',
    invoiceToast: 'Invoice generated',
    paidToast: 'Invoice marked paid',
    required: 'Required'
  },
  ar: {
    back: 'المستأجرون',
    eyebrow: 'مستأجر',
    overview: 'نظرة عامة',
    users: 'المستخدمون',
    invoices: 'الفواتير',
    suspend: 'إيقاف',
    reactivate: 'إعادة تفعيل',
    delete: 'حذف المستأجر',
    changePlan: 'تغيير الباقة',
    plan: 'الباقة',
    mrr: 'الإيراد الشهري',
    agents: 'الوكلاء',
    numbers: 'الأرقام',
    messages: 'الرسائل / دورة',
    aiQuota: 'الذكاء / دورة',
    ofLimit: 'من',
    profile: 'ملف الشركة',
    website: 'الموقع',
    industry: 'المجال',
    phone: 'الهاتف',
    customerType: 'نوع العملاء',
    billingCycle: 'دورة الفوترة',
    price: 'السعر',
    created: 'أُنشئ',
    trialEnds: 'تنتهي التجربة',
    periodEnds: 'تنتهي الدورة',
    subscription: 'الاشتراك',
    usage: 'الاستخدام هذه الدورة',
    none: '—',
    usersLabel: 'مستخدمو المساحة',
    colUser: 'المستخدم',
    colEmail: 'البريد',
    colRole: 'الدور',
    colStatus: 'الحالة',
    userActive: 'نشط',
    userInactive: 'غير نشط',
    usersEmpty: 'لا يوجد مستخدمون في هذه المساحة بعد.',
    invoicesLabel: 'الفواتير',
    generate: 'إنشاء فاتورة',
    markPaid: 'تعليم كمدفوعة',
    paid: 'مدفوعة',
    invoicesEmpty: 'لا توجد فواتير لهذا المستأجر بعد.',
    invoiceNo: 'فاتورة',
    issued: 'صدرت',
    due: 'الاستحقاق',
    loading: 'جارٍ تحميل المستأجر…',
    errorTitle: 'تعذّر تحميل المستأجر',
    errorBody: 'حدث خطأ أثناء الاتصال بخدمة المنصة.',
    retry: 'إعادة المحاولة',
    notFound: 'المستأجر غير موجود',
    suspendTitle: 'إيقاف هذا المستأجر؟',
    suspendBody: 'يفقد الأعضاء الوصول حتى إعادة التفعيل. تُحفظ المحادثات.',
    reactivateTitle: 'إعادة تفعيل هذا المستأجر؟',
    reactivateBody: 'يستعيد الأعضاء الوصول فورًا.',
    deleteTitle: 'حذف هذا المستأجر؟',
    deleteBody: 'يؤدي هذا إلى إزالة المساحة وكل بياناتها نهائيًا. لا يمكن التراجع.',
    deleteConfirmLabel: 'اكتب اسم المستأجر للتأكيد',
    cancel: 'إلغاء',
    confirm: 'تأكيد',
    confirmDelete: 'حذف نهائي',
    changePlanTitle: 'تغيير باقة الاشتراك',
    changePlanSub: 'انقل هذا المستأجر إلى باقة أخرى.',
    selectPlan: 'الباقة',
    monthly: 'شهري',
    yearly: 'سنوي',
    save: 'حفظ',
    saving: 'جارٍ الحفظ…',
    genTitle: 'إنشاء فاتورة',
    genSub: 'أصدر بند فوترة لهذا المستأجر.',
    amount: 'المبلغ',
    periodStart: 'بداية الفترة',
    periodEnd: 'نهاية الفترة',
    dueDate: 'تاريخ الاستحقاق',
    optional: 'اختياري',
    statusToast: 'تم تحديث حالة المستأجر',
    deletedToast: 'تم حذف المستأجر',
    planToast: 'تم تحديث الباقة',
    invoiceToast: 'تم إنشاء الفاتورة',
    paidToast: 'تم تعليم الفاتورة كمدفوعة',
    required: 'مطلوب'
  }
} as const;

@Component({
  selector: 'app-superadmin-tenant-detail-page',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, DatePipe, DecimalPipe, IconComponent],
  templateUrl: './tenant-detail.page.html',
  styleUrl: './tenant-detail.page.css'
})
export class SuperAdminTenantDetailPageComponent implements OnInit {
  readonly languageService = inject(LanguageService);
  private readonly fb = inject(FormBuilder);
  private readonly api = inject(SuperAdminApiService);
  private readonly plansApi = inject(PlansApiService);
  private readonly billingApi = inject(BillingApiService);
  private readonly toast = inject(ToastService);
  private readonly impersonation = inject(ImpersonationService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly direction = computed(() => this.languageService.getDirection(this.languageService.language()));
  readonly c = computed(() => CONTENT[this.languageService.language() === 'ar' ? 'ar' : 'en']);
  /** Impersonation copy lives in the shared platform-console i18n. */
  readonly impT = (key: TranslationKey) => this.languageService.text(key);

  private readonly tenantId = Number(this.route.snapshot.paramMap.get('id'));

  readonly tenant = signal<TenantDetail | null>(null);
  readonly plans = signal<Plan[]>([]);
  readonly loading = signal(true);
  readonly error = signal(false);
  readonly tab = signal<DetailTab>('overview');

  readonly savingStatus = signal(false);
  readonly savingPlan = signal(false);
  readonly savingInvoice = signal(false);
  readonly paidBusyId = signal<number | null>(null);

  // Confirm dialog (lifecycle)
  readonly confirmAction = signal<LifecycleAction | null>(null);
  readonly deleteTyped = signal('');

  // Modals
  readonly changePlanOpen = signal(false);
  readonly generateOpen = signal(false);
  readonly submitted = signal(false);

  // Impersonation confirm (FE-6.8)
  readonly impersonateOpen = signal(false);
  readonly impReason = signal('');
  readonly impSubmitted = signal(false);
  readonly impStarting = signal(false);

  readonly planForm = this.fb.group({
    planId: [null as number | null, Validators.required],
    billingCycle: ['Monthly' as BillingCycle, Validators.required]
  });

  readonly invoiceForm = this.fb.group({
    amount: [0, [Validators.required, Validators.min(0)]],
    periodStart: [''],
    periodEnd: [''],
    dueDate: ['']
  });

  ngOnInit(): void {
    this.load();
    this.plansApi.getAll().subscribe({
      next: (data) => this.plans.set(data ?? []),
      error: () => this.plans.set([])
    });
  }

  load(): void {
    this.loading.set(true);
    this.error.set(false);
    this.api.getTenant(this.tenantId).subscribe({
      next: (data) => {
        this.tenant.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set(true);
        this.loading.set(false);
      }
    });
  }

  setTab(tab: DetailTab): void {
    this.tab.set(tab);
  }

  // ── lifecycle helpers ──
  isActive(status: string | null | undefined): boolean {
    const s = (status ?? '').toLowerCase();
    return s === 'active' || s === 'trialing' || s === 'trial' || s === '';
  }

  statusTone(status: string | null | undefined): 'success' | 'warning' | 'danger' | 'neutral' {
    const s = (status ?? '').toLowerCase();
    if (s.includes('suspend') || s.includes('cancel')) return 'danger';
    if (s.includes('pending') || s.includes('trial')) return 'warning';
    if (s.includes('active')) return 'success';
    return 'neutral';
  }

  askAction(action: LifecycleAction): void {
    this.deleteTyped.set('');
    this.confirmAction.set(action);
  }

  cancelAction(): void {
    if (this.savingStatus()) return;
    this.confirmAction.set(null);
  }

  get deleteReady(): boolean {
    const t = this.tenant();
    return !!t && this.deleteTyped().trim() === t.name.trim();
  }

  confirmLifecycle(): void {
    const action = this.confirmAction();
    const t = this.tenant();
    if (!action || !t) return;

    if (action === 'delete') {
      if (!this.deleteReady) return;
      this.savingStatus.set(true);
      this.api.deleteTenant(t.id).subscribe({
        next: () => {
          this.savingStatus.set(false);
          this.confirmAction.set(null);
          this.toast.success(this.c().deletedToast, t.name);
          void this.router.navigate(['/app/superadmin/tenants']);
        },
        error: () => {
          this.savingStatus.set(false);
          this.toast.error(this.c().errorTitle, this.c().errorBody);
        }
      });
      return;
    }

    const nextStatus = action === 'suspend' ? 'Suspended' : 'Active';
    this.savingStatus.set(true);
    this.api.setTenantStatus(t.id, nextStatus).subscribe({
      next: () => {
        this.savingStatus.set(false);
        this.confirmAction.set(null);
        this.tenant.update((cur) => (cur ? { ...cur, status: nextStatus } : cur));
        this.toast.success(this.c().statusToast, t.name);
      },
      error: () => {
        this.savingStatus.set(false);
        this.toast.error(this.c().errorTitle, this.c().errorBody);
      }
    });
  }

  // ── change plan ──
  openChangePlan(): void {
    const t = this.tenant();
    this.submitted.set(false);
    this.planForm.reset({ planId: t?.planId ?? null, billingCycle: t?.billingCycle ?? 'Monthly' });
    this.changePlanOpen.set(true);
  }

  closeChangePlan(): void {
    if (this.savingPlan()) return;
    this.changePlanOpen.set(false);
  }

  saveChangePlan(): void {
    this.submitted.set(true);
    const t = this.tenant();
    if (!t || this.planForm.invalid) {
      this.planForm.markAllAsTouched();
      return;
    }
    const raw = this.planForm.getRawValue();
    const input: AssignPlanInput = {
      planId: Number(raw.planId),
      billingCycle: (raw.billingCycle ?? 'Monthly') as BillingCycle
    };
    this.savingPlan.set(true);
    this.api.assignPlan(t.id, input).subscribe({
      next: () => {
        this.savingPlan.set(false);
        this.changePlanOpen.set(false);
        this.toast.success(this.c().planToast, t.name);
        this.load();
      },
      error: () => {
        this.savingPlan.set(false);
        this.toast.error(this.c().errorTitle, this.c().errorBody);
      }
    });
  }

  // ── generate invoice ──
  openGenerate(): void {
    const t = this.tenant();
    this.submitted.set(false);
    this.invoiceForm.reset({ amount: t?.price ?? 0, periodStart: '', periodEnd: '', dueDate: '' });
    this.generateOpen.set(true);
  }

  closeGenerate(): void {
    if (this.savingInvoice()) return;
    this.generateOpen.set(false);
  }

  saveGenerate(): void {
    this.submitted.set(true);
    const t = this.tenant();
    if (!t || this.invoiceForm.invalid) {
      this.invoiceForm.markAllAsTouched();
      return;
    }
    const raw = this.invoiceForm.getRawValue();
    const input: GenerateInvoiceInput = {
      amount: Number(raw.amount ?? 0),
      periodStart: this.nullable(raw.periodStart),
      periodEnd: this.nullable(raw.periodEnd),
      dueDate: this.nullable(raw.dueDate)
    };
    this.savingInvoice.set(true);
    this.api.generateInvoice(t.id, input).subscribe({
      next: (invoice) => {
        this.savingInvoice.set(false);
        this.generateOpen.set(false);
        this.tenant.update((cur) => (cur ? { ...cur, invoices: [invoice, ...(cur.invoices ?? [])] } : cur));
        this.toast.success(this.c().invoiceToast, t.name);
      },
      error: () => {
        this.savingInvoice.set(false);
        this.toast.error(this.c().errorTitle, this.c().errorBody);
      }
    });
  }

  markPaid(invoice: PlatformInvoice): void {
    this.paidBusyId.set(invoice.id);
    this.billingApi.markPaid(invoice.id).subscribe({
      next: (updated) => {
        this.paidBusyId.set(null);
        this.tenant.update((cur) =>
          cur ? { ...cur, invoices: (cur.invoices ?? []).map((i) => (i.id === invoice.id ? updated : i)) } : cur
        );
        this.toast.success(this.c().paidToast, `#${invoice.id}`);
      },
      error: () => {
        this.paidBusyId.set(null);
        this.toast.error(this.c().errorTitle, this.c().errorBody);
      }
    });
  }

  // ── impersonation (FE-6.8) ──
  openImpersonate(): void {
    this.impSubmitted.set(false);
    this.impReason.set('');
    this.impersonateOpen.set(true);
  }

  cancelImpersonate(): void {
    if (this.impStarting()) return;
    this.impersonateOpen.set(false);
  }

  impConfirmTitle(): string {
    return this.impT('impConfirmTitle').replace('{tenant}', this.tenant()?.name ?? '');
  }

  confirmImpersonate(): void {
    this.impSubmitted.set(true);
    const t = this.tenant();
    const reason = this.impReason().trim();
    if (!t || !reason) return;

    this.impStarting.set(true);
    this.impersonation.start({ tenantId: t.id, reason }).subscribe({
      next: () => {
        this.impStarting.set(false);
        this.impersonateOpen.set(false);
        this.toast.success(this.impT('impStartedToast'), t.name);
      },
      error: () => {
        this.impStarting.set(false);
        this.toast.error(this.impT('impErrorTitle'), this.impT('impErrorBody'));
      }
    });
  }

  // ── presentation helpers ──
  invoiceStatusKey(status: string | null | undefined): string {
    const s = (status ?? '').toLowerCase().replace(/[\s_]+/g, '-');
    if (s.includes('paid')) return 'paid';
    if (s.includes('past') || s.includes('overdue') || s.includes('unpaid')) return 'past-due';
    if (s.includes('void') || s.includes('cancel')) return 'void';
    return 'open';
  }

  isPaid(status: string | null | undefined): boolean {
    return (status ?? '').toLowerCase().includes('paid');
  }

  pct(used: number, max: number): number {
    if (!max || max <= 0) return 0;
    return Math.min(100, Math.round((used / max) * 100));
  }

  initials(name: string | null | undefined): string {
    const parts = (name ?? '').trim().split(/\s+/).filter(Boolean);
    if (!parts.length) return '—';
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }

  invalid(form: 'plan' | 'invoice', control: string): boolean {
    const grp: FormGroup = (form === 'plan' ? this.planForm : this.invoiceForm) as FormGroup;
    const ctl = grp.get(control);
    return !!ctl && ctl.invalid && (ctl.touched || this.submitted());
  }

  private nullable(value: string | null | undefined): string | null {
    const v = (value ?? '').trim();
    return v.length ? v : null;
  }
}
