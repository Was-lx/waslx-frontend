import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { firstValueFrom } from 'rxjs';

import { AuthSessionService, type AppRole } from '../../../../core/services/auth-session.service';
import { AuthApiService } from '../../../../core/auth/auth-api.service';
import { PermissionsStore } from '../../../../core/services/permissions.store';
import { LanguageService } from '../../../../core/services/language.service';
import { ToastService } from '../../../../core/services/toast.service';
import type { CustomerType, SignupRequest } from '../../../../core/models/platform.models';
import { AuthShellComponent } from '../../components/auth-shell/auth-shell.component';
import { IconComponent } from '../../../../shared/components/icon/icon.component';

// ─── Local bilingual content (kept out of the global translations file) ───────
interface CustomerOption {
  readonly value: CustomerType;
  readonly label: string;
  readonly hint: string;
}
interface IndustryOption {
  readonly value: string;
  readonly label: string;
}

const CONTENT = {
  en: {
    step1Title: 'Create your account',
    step1Lead: 'Start your WaslX workspace in under a minute.',
    step2Title: 'Tell us about your company',
    step2Lead: 'This helps us tailor routing and AI to your business.',
    stepOf: (n: number) => `Step ${n} of 2`,
    fullName: 'Full name',
    fullNamePlaceholder: 'Sara Ahmed',
    email: 'Work email',
    password: 'Password',
    orgName: 'Company name',
    orgNamePlaceholder: 'Acme Trading Co.',
    website: 'Website',
    websiteOptional: 'optional',
    websitePlaceholder: 'https://acme.com',
    industry: 'Industry',
    industryPlaceholder: 'Select an industry',
    phone: 'Phone',
    phoneOptional: 'optional',
    phonePlaceholder: '+20 100 000 0000',
    customersQuestion: 'Who are your main customers?',
    continue: 'Continue',
    back: 'Back',
    submit: 'Start free trial',
    submitting: 'Creating your workspace…',
    trialLine: '7-day free trial · no credit card required',
    haveAccount: 'Already have an account?',
    signIn: 'Sign in',
    showPassword: 'Show password',
    hidePassword: 'Hide password',
    nameRequired: 'Please enter your full name.',
    emailRequired: 'Email is required.',
    emailInvalid: 'Enter a valid email address.',
    passwordRequired: 'Password is required.',
    passwordTooShort: 'Password must be at least 8 characters.',
    orgRequired: 'Company name is required.',
    industryRequired: 'Please choose an industry.',
    genericError: 'Something went wrong. Please try again.',
    industries: [
      { value: 'Retail', label: 'Retail' },
      { value: 'E-commerce', label: 'E-commerce' },
      { value: 'Technology', label: 'Technology' },
      { value: 'Healthcare', label: 'Healthcare' },
      { value: 'Education', label: 'Education' },
      { value: 'Finance', label: 'Finance' },
      { value: 'Real Estate', label: 'Real Estate' },
      { value: 'Travel', label: 'Travel' },
      { value: 'Logistics', label: 'Logistics' },
      { value: 'Food & Beverage', label: 'Food & Beverage' },
      { value: 'Professional Services', label: 'Professional Services' },
      { value: 'Other', label: 'Other' },
    ] as IndustryOption[],
    customerOptions: [
      { value: 'B2B', label: 'Businesses', hint: 'B2B' },
      { value: 'B2C', label: 'Consumers', hint: 'B2C' },
      { value: 'Both', label: 'Both', hint: 'B2B & B2C' },
      { value: 'Unknown', label: 'Not sure yet', hint: 'Decide later' },
    ] as CustomerOption[],
  },
  ar: {
    step1Title: 'أنشئ حسابك',
    step1Lead: 'ابدأ مساحة عمل WaslX في أقل من دقيقة.',
    step2Title: 'حدثنا عن شركتك',
    step2Lead: 'يساعدنا هذا في ضبط التوجيه والذكاء الاصطناعي لنشاطك.',
    stepOf: (n: number) => `الخطوة ${n} من 2`,
    fullName: 'الاسم الكامل',
    fullNamePlaceholder: 'سارة أحمد',
    email: 'البريد المهني',
    password: 'كلمة المرور',
    orgName: 'اسم الشركة',
    orgNamePlaceholder: 'شركة أكمي للتجارة',
    website: 'الموقع الإلكتروني',
    websiteOptional: 'اختياري',
    websitePlaceholder: 'https://acme.com',
    industry: 'المجال',
    industryPlaceholder: 'اختر المجال',
    phone: 'رقم الهاتف',
    phoneOptional: 'اختياري',
    phonePlaceholder: '+20 100 000 0000',
    customersQuestion: 'من هم عملاؤك الأساسيون؟',
    continue: 'متابعة',
    back: 'رجوع',
    submit: 'ابدأ التجربة المجانية',
    submitting: 'جارٍ إنشاء مساحة العمل…',
    trialLine: 'تجربة مجانية 7 أيام · بدون بطاقة',
    haveAccount: 'لديك حساب بالفعل؟',
    signIn: 'تسجيل الدخول',
    showPassword: 'إظهار كلمة المرور',
    hidePassword: 'إخفاء كلمة المرور',
    nameRequired: 'من فضلك أدخل اسمك الكامل.',
    emailRequired: 'البريد الإلكتروني مطلوب.',
    emailInvalid: 'أدخل بريدًا إلكترونيًا صحيحًا.',
    passwordRequired: 'كلمة المرور مطلوبة.',
    passwordTooShort: 'يجب ألا تقل كلمة المرور عن 8 أحرف.',
    orgRequired: 'اسم الشركة مطلوب.',
    industryRequired: 'من فضلك اختر المجال.',
    genericError: 'حدث خطأ ما. حاول مرة أخرى.',
    industries: [
      { value: 'Retail', label: 'تجزئة' },
      { value: 'E-commerce', label: 'تجارة إلكترونية' },
      { value: 'Technology', label: 'تقنية' },
      { value: 'Healthcare', label: 'رعاية صحية' },
      { value: 'Education', label: 'تعليم' },
      { value: 'Finance', label: 'تمويل' },
      { value: 'Real Estate', label: 'عقارات' },
      { value: 'Travel', label: 'سفر' },
      { value: 'Logistics', label: 'لوجستيات' },
      { value: 'Food & Beverage', label: 'أطعمة ومشروبات' },
      { value: 'Professional Services', label: 'خدمات احترافية' },
      { value: 'Other', label: 'أخرى' },
    ] as IndustryOption[],
    customerOptions: [
      { value: 'B2B', label: 'شركات', hint: 'B2B' },
      { value: 'B2C', label: 'أفراد', hint: 'B2C' },
      { value: 'Both', label: 'الاثنان', hint: 'B2B و B2C' },
      { value: 'Unknown', label: 'غير متأكد', hint: 'أقرر لاحقًا' },
    ] as CustomerOption[],
  },
} as const;

@Component({
  selector: 'app-signup-page',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, AuthShellComponent, IconComponent],
  templateUrl: './signup.page.html',
  styleUrl: './signup.page.css',
})
export class SignupPageComponent {
  private readonly formBuilder = inject(NonNullableFormBuilder);
  private readonly authApiService = inject(AuthApiService);
  private readonly authSessionService = inject(AuthSessionService);
  private readonly permissionsStore = inject(PermissionsStore);
  private readonly languageService = inject(LanguageService);
  private readonly toastService = inject(ToastService);
  private readonly router = inject(Router);

  readonly c = computed(() => CONTENT[this.languageService.language()]);
  readonly direction = () => this.languageService.getDirection();

  readonly step = signal<1 | 2>(1);
  readonly showPassword = signal(false);
  readonly submitting = signal(false);
  readonly errorMessage = signal('');

  readonly signupForm = this.formBuilder.group({
    fullName: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    orgName: ['', [Validators.required]],
    website: [''],
    industry: ['', [Validators.required]],
    phone: [''],
    customerType: ['Unknown' as CustomerType, [Validators.required]],
  });

  private readonly step1Controls = ['fullName', 'email', 'password'] as const;

  step1Invalid(): boolean {
    return this.step1Controls.some((name) => this.signupForm.controls[name].invalid);
  }

  controlInvalid(
    name: 'fullName' | 'email' | 'password' | 'orgName' | 'industry'
  ): boolean {
    const control = this.signupForm.controls[name];
    return control.invalid && (control.touched || control.dirty);
  }

  fullNameError(): string {
    return this.c().nameRequired;
  }

  emailError(): string {
    const control = this.signupForm.controls.email;
    if (control.hasError('required')) {
      return this.c().emailRequired;
    }
    return this.c().emailInvalid;
  }

  passwordError(): string {
    const control = this.signupForm.controls.password;
    if (control.hasError('required')) {
      return this.c().passwordRequired;
    }
    return this.c().passwordTooShort;
  }

  togglePassword(): void {
    this.showPassword.update((v) => !v);
  }

  selectCustomerType(value: CustomerType): void {
    this.signupForm.controls.customerType.setValue(value);
  }

  goToStep2(): void {
    for (const name of this.step1Controls) {
      this.signupForm.controls[name].markAsTouched();
    }

    if (this.step1Invalid()) {
      return;
    }

    this.errorMessage.set('');
    this.step.set(2);
  }

  goToStep1(): void {
    this.errorMessage.set('');
    this.step.set(1);
  }

  async submit(): Promise<void> {
    this.errorMessage.set('');
    this.signupForm.markAllAsTouched();

    if (this.signupForm.invalid) {
      // Send the user back to whichever step holds the invalid field.
      if (this.step1Invalid()) {
        this.step.set(1);
      }
      return;
    }

    this.submitting.set(true);

    try {
      const raw = this.signupForm.getRawValue();
      const request: SignupRequest = {
        fullName: raw.fullName.trim(),
        email: raw.email.trim(),
        password: raw.password,
        orgName: raw.orgName.trim(),
        website: raw.website.trim() || null,
        industry: raw.industry || null,
        phone: raw.phone.trim() || null,
        customerType: raw.customerType,
      };

      const res = await firstValueFrom(this.authApiService.signup(request));

      if (!res?.accessToken) {
        throw new Error('Invalid response');
      }

      this.authSessionService.signIn(
        {
          accessToken: res.accessToken,
          refreshToken: res.refreshToken,
          roles: res.roles as AppRole[],
        },
        {
          id: res.userId,
          email: res.email,
          fullName: res.fullName,
          role: res.roles[0] ?? '',
          tenantId: '',
        }
      );

      await this.permissionsStore.load();

      void this.router.navigate(['/onboarding']);
    } catch (err: any) {
      const description: string = err?.error?.description || this.c().genericError;
      this.errorMessage.set(description);
      this.toastService.error(this.c().step1Title, description);
    } finally {
      this.submitting.set(false);
    }
  }
}
