import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { LanguageService } from '../../../../core/services/language.service';
import { LANDING_CONTENT, type Plan } from '../../landing.content';
import { PlansApiService } from '../../../../core/api/plans-api.service';
import type { Plan as ApiPlan } from '../../../../core/models/platform.models';
import { IconComponent } from '../../../../shared/components/icon/icon.component';
import { RevealDirective } from '../../directives/reveal.directive';
import { StaggerDirective } from '../../directives/stagger.directive';
import { TiltDirective } from '../../directives/tilt.directive';

@Component({
  selector: 'app-pricing-page',
  standalone: true,
  imports: [RouterLink, IconComponent, RevealDirective, StaggerDirective, TiltDirective],
  templateUrl: './pricing.page.html',
  styleUrl: './pricing.page.css',
})
export class PricingPageComponent {
  private readonly languageService = inject(LanguageService);
  private readonly plansApi = inject(PlansApiService);
  readonly c = computed(() => LANDING_CONTENT[this.languageService.language()]);

  readonly yearly = signal(false);
  readonly openFaq = signal<number | null>(0);

  /** Live plans from the backend; null until loaded (or on failure → static fallback). */
  private readonly apiPlans = signal<ApiPlan[] | null>(null);

  /** Card CTA labels — standard plans start a trial, custom plans talk to sales. */
  readonly ctaTrial = computed(() =>
    this.languageService.language() === 'ar' ? 'ابدأ التجربة المجانية' : 'Start free trial'
  );
  readonly ctaContact = computed(() =>
    this.languageService.language() === 'ar' ? 'تواصل مع المبيعات' : 'Contact sales'
  );

  /** The plans the cards render — live data when available, else the static marketing set. */
  readonly plans = computed<readonly Plan[]>(() => {
    const live = this.apiPlans();
    if (!live || live.length === 0) {
      return this.c().pricingPage.plans;
    }
    return live.map((p, idx) => this.mapApiPlan(p, idx));
  });

  constructor() {
    this.plansApi.getPublic().subscribe({
      next: (list) => this.apiPlans.set([...list].sort((a, b) => a.sortOrder - b.sortOrder)),
      error: () => this.apiPlans.set(null), // keep the static content on any failure
    });
  }

  toggleBilling(): void {
    this.yearly.update((v) => !v);
  }

  toggleFaq(index: number): void {
    this.openFaq.update((current) => (current === index ? null : index));
  }

  price(plan: Plan): number | null {
    return this.yearly() ? plan.priceYearly : plan.priceMonthly;
  }

  /** True when a plan is a "contact sales" custom tier (no self-serve trial). */
  isCustom(plan: Plan): boolean {
    return plan.priceCustom != null && plan.priceMonthly == null;
  }

  private mapApiPlan(p: ApiPlan, idx: number): Plan {
    const iconByCode: Record<string, string> = { starter: 'zap', growth: 'sparkles', business: 'trending-up', enterprise: 'shield' };
    const fallbackIcons = ['zap', 'sparkles', 'trending-up', 'shield'];
    const custom = p.isCustom;
    return {
      id: p.code,
      icon: iconByCode[p.code?.toLowerCase()] ?? fallbackIcons[idx] ?? 'zap',
      name: p.name,
      tagline: p.tagline ?? '',
      priceMonthly: custom ? null : p.price,
      priceYearly: custom ? null : p.priceYearly ?? p.price,
      priceCustom: custom ? (this.languageService.language() === 'ar' ? 'حسب الطلب' : 'Custom') : null,
      cta: custom ? this.ctaContact() : this.ctaTrial(),
      popular: p.code?.toLowerCase() === 'growth' || (idx === 1 && !custom),
      features: p.features ?? [],
    };
  }
}
