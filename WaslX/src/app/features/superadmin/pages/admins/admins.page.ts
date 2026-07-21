import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { LanguageService } from '../../../../core/services/language.service';
import { ToastService } from '../../../../core/services/toast.service';
import { IconComponent } from '../../../../shared/components/icon/icon.component';
import { AdminsApiService } from '../../../../core/api/admins-api.service';
import type { CreatePlatformAdmin, PlatformAdmin } from '../../../../core/models/platform.models';

// ─── Local bilingual copy (self-contained, matches tenants/plans pages) ───────
const CONTENT = {
  en: {
    eyebrow: 'Platform console',
    title: 'Admins',
    subtitle: 'The operators who run WaslX across every tenant.',
    newAdmin: 'New admin',
    total: 'Total admins',
    active: 'Active',
    disabled: 'Disabled',
    directoryLabel: 'Platform operators',
    directoryUnit: 'admins',
    colName: 'Operator',
    colEmail: 'Email',
    colStatus: 'Status',
    colCreated: 'Created',
    colLastLogin: 'Last sign-in',
    colActions: 'Actions',
    enable: 'Enable',
    disable: 'Disable',
    never: 'Never',
    loading: 'Loading admins…',
    errorTitle: 'Could not load admins',
    errorBody: 'Something went wrong reaching the platform service.',
    retry: 'Retry',
    emptyTitle: 'No admins yet',
    emptyBody: 'Add the first platform operator to co-run the console.',
    modalTitle: 'Add a platform admin',
    modalSubtitle: 'Create a Super Admin who can operate the console.',
    fullName: 'Full name',
    email: 'Email',
    password: 'Temporary password',
    passwordHint: 'At least 8 characters. They can change it after first sign-in.',
    cancel: 'Cancel',
    create: 'Create admin',
    creating: 'Creating…',
    createdToast: 'Admin created',
    statusToast: 'Admin status updated',
    required: 'This field is required',
    invalidEmail: 'Enter a valid email',
    minPassword: 'Use at least 8 characters',
    none: '—'
  },
  ar: {
    eyebrow: 'لوحة المنصة',
    title: 'المشرفون',
    subtitle: 'المشغّلون الذين يديرون وصلكس عبر كل المستأجرين.',
    newAdmin: 'مشرف جديد',
    total: 'إجمالي المشرفين',
    active: 'نشط',
    disabled: 'معطّل',
    directoryLabel: 'مشغّلو المنصة',
    directoryUnit: 'مشرف',
    colName: 'المشغّل',
    colEmail: 'البريد',
    colStatus: 'الحالة',
    colCreated: 'تاريخ الإنشاء',
    colLastLogin: 'آخر دخول',
    colActions: 'إجراءات',
    enable: 'تفعيل',
    disable: 'تعطيل',
    never: 'أبدًا',
    loading: 'جارٍ تحميل المشرفين…',
    errorTitle: 'تعذّر تحميل المشرفين',
    errorBody: 'حدث خطأ أثناء الاتصال بخدمة المنصة.',
    retry: 'إعادة المحاولة',
    emptyTitle: 'لا يوجد مشرفون بعد',
    emptyBody: 'أضف أول مشغّل للمنصة لمشاركة إدارة اللوحة.',
    modalTitle: 'إضافة مشرف منصة',
    modalSubtitle: 'أنشئ سوبر أدمن قادرًا على تشغيل اللوحة.',
    fullName: 'الاسم الكامل',
    email: 'البريد الإلكتروني',
    password: 'كلمة مرور مؤقتة',
    passwordHint: '٨ أحرف على الأقل. يمكن تغييرها بعد أول دخول.',
    cancel: 'إلغاء',
    create: 'إنشاء المشرف',
    creating: 'جارٍ الإنشاء…',
    createdToast: 'تم إنشاء المشرف',
    statusToast: 'تم تحديث حالة المشرف',
    required: 'هذا الحقل مطلوب',
    invalidEmail: 'أدخل بريدًا صحيحًا',
    minPassword: 'استخدم ٨ أحرف على الأقل',
    none: '—'
  }
} as const;

@Component({
  selector: 'app-superadmin-admins-page',
  standalone: true,
  imports: [ReactiveFormsModule, DatePipe, DecimalPipe, IconComponent],
  templateUrl: './admins.page.html',
  styleUrl: './admins.page.css'
})
export class SuperAdminAdminsPageComponent implements OnInit {
  readonly languageService = inject(LanguageService);
  private readonly fb = inject(FormBuilder);
  private readonly adminsApi = inject(AdminsApiService);
  private readonly toast = inject(ToastService);

  readonly direction = computed(() => this.languageService.getDirection(this.languageService.language()));
  readonly c = computed(() => CONTENT[this.languageService.language() === 'ar' ? 'ar' : 'en']);

  readonly admins = signal<PlatformAdmin[]>([]);
  readonly loading = signal(true);
  readonly error = signal(false);
  readonly modalOpen = signal(false);
  readonly submitting = signal(false);
  readonly submitted = signal(false);
  readonly busyId = signal<string | null>(null);

  readonly activeCount = computed(() => this.admins().filter((a) => this.isActive(a)).length);
  readonly disabledCount = computed(() => this.admins().filter((a) => !this.isActive(a)).length);

  readonly form = this.fb.group({
    fullName: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]]
  });

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.error.set(false);
    this.adminsApi.getAll().subscribe({
      next: (data) => {
        this.admins.set(data ?? []);
        this.loading.set(false);
      },
      error: () => {
        this.error.set(true);
        this.loading.set(false);
      }
    });
  }

  openModal(): void {
    this.submitted.set(false);
    this.form.reset({ fullName: '', email: '', password: '' });
    this.modalOpen.set(true);
  }

  closeModal(): void {
    if (this.submitting()) return;
    this.modalOpen.set(false);
  }

  submit(): void {
    this.submitted.set(true);
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const raw = this.form.getRawValue();
    const input: CreatePlatformAdmin = {
      fullName: (raw.fullName ?? '').trim(),
      email: (raw.email ?? '').trim(),
      password: raw.password ?? ''
    };
    this.submitting.set(true);
    this.adminsApi.create(input).subscribe({
      next: () => {
        this.submitting.set(false);
        this.modalOpen.set(false);
        this.toast.success(this.c().createdToast, input.fullName);
        this.load();
      },
      error: () => {
        this.submitting.set(false);
        this.toast.error(this.c().errorTitle, this.c().errorBody);
      }
    });
  }

  toggleStatus(admin: PlatformAdmin): void {
    const next = this.isActive(admin) ? 'Disabled' : 'Active';
    this.busyId.set(admin.id);
    this.adminsApi.setStatus(admin.id, next).subscribe({
      next: () => {
        this.admins.update((list) => list.map((a) => (a.id === admin.id ? { ...a, status: next } : a)));
        this.busyId.set(null);
        this.toast.success(this.c().statusToast, admin.fullName);
      },
      error: () => {
        this.busyId.set(null);
        this.toast.error(this.c().errorTitle, this.c().errorBody);
      }
    });
  }

  isActive(admin: PlatformAdmin): boolean {
    return (admin.status ?? '').toLowerCase() === 'active';
  }

  initials(name: string | null | undefined): string {
    const parts = (name ?? '').trim().split(/\s+/).filter(Boolean);
    if (!parts.length) return '—';
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }

  invalid(control: string): boolean {
    const ctl = this.form.get(control);
    return !!ctl && ctl.invalid && (ctl.touched || this.submitted());
  }
}
