import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { LanguageService } from '../../../../core/services/language.service';
import { IconComponent } from '../../../../shared/components/icon/icon.component';
import { PlansApiService } from '../../../../core/api/plans-api.service';
import { SuperAdminApiService } from '../../../../core/api/superadmin-api.service';
import type { Plan, TenantSummary } from '../../../../core/models/platform.models';

type BillingFilter = 'all' | 'active' | 'trial' | 'pastdue';

const CONTENT = {
  en: {
    eyebrow: 'Platform console',
    title: 'Billing',
    subtitle: 'Revenue, subscriptions and invoicing across every tenant.',
    mrr: 'Monthly recurring',
    activeSubs: 'Active subscriptions',
    trials: 'On trial',
    pastDue: 'Past due',
    dunningTitle: 'tenants need attention',
    dunningBody: 'Past-due or unpaid accounts — open each to review invoices and mark paid.',
    review: 'Review',
    all: 'All',
    active: 'Active',
    trial: 'Trial',
    ledgerLabel: 'Billing ledger',
    ledgerUnit: 'tenants',
    colTenant: 'Tenant',
    colPlan: 'Plan',
    colBilling: 'Billing',
    colMrr: 'MRR',
    colRenews: 'Renews / trial ends',
    colActions: '',
    open: 'Open',
    loading: 'Loading billing…',
    errorTitle: 'Could not load billing',
    errorBody: 'Something went wrong reaching the platform service.',
    retry: 'Retry',
    emptyTitle: 'No tenants to bill yet',
    emptyBody: 'Provision a tenant to start tracking revenue.',
    filterEmpty: 'No tenants match this filter.',
    none: '—'
  },
  ar: {
    eyebrow: 'لوحة المنصة',
    title: 'الفوترة',
    subtitle: 'الإيرادات والاشتراكات والفواتير عبر كل المستأجرين.',
    mrr: 'الإيراد الشهري',
    activeSubs: 'الاشتراكات النشطة',
    trials: 'قيد التجربة',
    pastDue: 'متأخرة',
    dunningTitle: 'مستأجرون يحتاجون متابعة',
    dunningBody: 'حسابات متأخرة أو غير مدفوعة — افتح كلًا لمراجعة الفواتير وتعليمها كمدفوعة.',
    review: 'مراجعة',
    all: 'الكل',
    active: 'نشط',
    trial: 'تجريبي',
    ledgerLabel: 'سجل الفوترة',
    ledgerUnit: 'مستأجر',
    colTenant: 'المستأجر',
    colPlan: 'الباقة',
    colBilling: 'الفوترة',
    colMrr: 'الإيراد الشهري',
    colRenews: 'التجديد / انتهاء التجربة',
    colActions: '',
    open: 'فتح',
    loading: 'جارٍ تحميل الفوترة…',
    errorTitle: 'تعذّر تحميل الفوترة',
    errorBody: 'حدث خطأ أثناء الاتصال بخدمة المنصة.',
    retry: 'إعادة المحاولة',
    emptyTitle: 'لا يوجد مستأجرون للفوترة بعد',
    emptyBody: 'فعّل مستأجرًا لبدء تتبّع الإيرادات.',
    filterEmpty: 'لا يوجد مستأجرون مطابقون لهذا الفلتر.',
    none: '—'
  }
} as const;

@Component({
  selector: 'app-superadmin-billing-page',
  standalone: true,
  imports: [RouterLink, DatePipe, DecimalPipe, IconComponent],
  templateUrl: './billing.page.html',
  styleUrl: './billing.page.css'
})
export class SuperAdminBillingPageComponent implements OnInit {
  readonly languageService = inject(LanguageService);
  private readonly api = inject(SuperAdminApiService);
  private readonly plansApi = inject(PlansApiService);

  readonly direction = computed(() => this.languageService.getDirection(this.languageService.language()));
  readonly c = computed(() => CONTENT[this.languageService.language() === 'ar' ? 'ar' : 'en']);

  readonly tenants = signal<TenantSummary[]>([]);
  private readonly planPrice = signal<Record<string, number>>({});
  readonly loading = signal(true);
  readonly error = signal(false);
  readonly filter = signal<BillingFilter>('all');

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.error.set(false);
    this.plansApi.getAll().subscribe({
      next: (plans) => this.planPrice.set(this.priceMap(plans ?? [])),
      error: () => this.planPrice.set({})
    });
    this.api.getTenants().subscribe({
      next: (data) => {
        this.tenants.set(data ?? []);
        this.loading.set(false);
      },
      error: () => {
        this.error.set(true);
        this.loading.set(false);
      }
    });
  }

  private priceMap(plans: Plan[]): Record<string, number> {
    const map: Record<string, number> = {};
    for (const p of plans) map[p.name] = p.price;
    return map;
  }

  mrrOf(tenant: TenantSummary): number {
    return this.planPrice()[tenant.planName] ?? 0;
  }

  // ── derived ──
  readonly totalMrr = computed(() =>
    this.tenants().filter((t) => this.billTone(t.billingStatus) !== 'danger').reduce((sum, t) => sum + this.mrrOf(t), 0)
  );
  readonly activeCount = computed(() => this.tenants().filter((t) => this.isActive(t.status) && !this.isTrial(t)).length);
  readonly trialCount = computed(() => this.tenants().filter((t) => this.isTrial(t)).length);
  readonly pastDue = computed(() => this.tenants().filter((t) => this.billTone(t.billingStatus) === 'danger'));

  readonly filtered = computed(() => {
    const f = this.filter();
    return this.tenants().filter((t) => {
      if (f === 'active') return this.isActive(t.status) && !this.isTrial(t);
      if (f === 'trial') return this.isTrial(t);
      if (f === 'pastdue') return this.billTone(t.billingStatus) === 'danger';
      return true;
    });
  });

  setFilter(f: BillingFilter): void {
    this.filter.set(f);
  }

  // ── helpers ──
  isActive(status: string | null | undefined): boolean {
    const s = (status ?? '').toLowerCase();
    return s === 'active' || s === 'trialing' || s === 'trial' || s === '';
  }
  isTrial(t: TenantSummary): boolean {
    return (t.billingStatus ?? '').toLowerCase().includes('trial') || !!t.trialEndsAt;
  }
  billTone(status: string | null | undefined): 'success' | 'warning' | 'danger' | 'neutral' {
    const s = (status ?? '').toLowerCase();
    if (s.includes('past') || s.includes('unpaid') || s.includes('fail') || s.includes('overdue')) return 'danger';
    if (s.includes('trial') || s.includes('pending')) return 'warning';
    if (s.includes('active') || s.includes('paid')) return 'success';
    return 'neutral';
  }

  initials(name: string | null | undefined): string {
    const parts = (name ?? '').trim().split(/\s+/).filter(Boolean);
    if (!parts.length) return '—';
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
}
