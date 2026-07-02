import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { firstValueFrom } from 'rxjs';

import { AuthApiService } from '../../../../core/auth/auth-api.service';
import { LanguageService, type TranslationKey } from '../../../../core/services/language.service';
import { ThemeService } from '../../../../core/services/theme.service';
import { ToastService } from '../../../../core/services/toast.service';

@Component({
  selector: 'app-reset-password-page',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './reset-password.page.html',
  styleUrl: './reset-password.page.css'
})
export class ResetPasswordPageComponent implements OnInit {
  private readonly formBuilder = inject(NonNullableFormBuilder);
  private readonly authApiService = inject(AuthApiService);
  private readonly toastService = inject(ToastService);
  private readonly themeService = inject(ThemeService);
  private readonly languageService = inject(LanguageService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly submitting = signal(false);
  readonly errorMessage = signal('');
  readonly successMessage = signal('');
  readonly passwordHelpId = 'reset-password-help';
  
  private token = '';

  readonly resetForm = this.formBuilder.group({
    password: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', [Validators.required]]
  });

  readonly direction = () => this.languageService.getDirection();
  readonly t = (key: TranslationKey | string) => {
    const map: Record<string, string> = {
      resetPasswordTitle: this.languageService.language() === 'ar' ? 'إعادة تعيين كلمة المرور' : 'Reset Password',
      resetPasswordLead: this.languageService.language() === 'ar' ? 'أدخل كلمة المرور الجديدة أدناه.' : 'Enter your new password below.',
      password: this.languageService.language() === 'ar' ? 'كلمة المرور الجديدة' : 'New Password',
      confirmPassword: this.languageService.language() === 'ar' ? 'تأكيد كلمة المرور' : 'Confirm Password',
      resetPasswordAction: this.languageService.language() === 'ar' ? 'إعادة تعيين' : 'Reset Password',
      resetting: this.languageService.language() === 'ar' ? 'جاري الإعادة...' : 'Resetting...',
      backToLogin: this.languageService.language() === 'ar' ? 'العودة لتسجيل الدخول' : 'Back to login',
      passwordRequired: this.languageService.language() === 'ar' ? 'كلمة المرور مطلوبة' : 'Password is required',
      passwordTooShort: this.languageService.language() === 'ar' ? 'يجب أن تكون 8 أحرف على الأقل' : 'Must be at least 8 characters',
      passwordsDoNotMatch: this.languageService.language() === 'ar' ? 'كلمات المرور غير متطابقة' : 'Passwords do not match',
      passwordResetSuccess: this.languageService.language() === 'ar' ? 'تم تعيين كلمة المرور بنجاح. يرجى تسجيل الدخول.' : 'Password reset successfully. Please login.',
      errorOccurred: this.languageService.language() === 'ar' ? 'الرابط غير صالح أو منتهي الصلاحية.' : 'Invalid or expired reset link.'
    };
    return map[key] || this.languageService.text(key as TranslationKey);
  };

  ngOnInit() {
    this.token = this.route.snapshot.queryParamMap.get('token') ?? '';
    if (!this.token) {
      this.errorMessage.set(this.t('errorOccurred'));
    }
  }

  async resetPassword(): Promise<void> {
    this.errorMessage.set('');
    this.successMessage.set('');
    this.resetForm.markAllAsTouched();

    const { password, confirmPassword } = this.resetForm.getRawValue();

    if (password !== confirmPassword) {
      this.resetForm.controls.confirmPassword.setErrors({ mismatch: true });
      return;
    }

    if (this.resetForm.invalid || !this.token) {
      return;
    }

    this.submitting.set(true);

    try {
      await firstValueFrom(this.authApiService.resetPassword({ token: this.token, password }));
      this.successMessage.set(this.t('passwordResetSuccess'));
      this.resetForm.reset();
      setTimeout(() => {
        void this.router.navigate(['/login']);
      }, 3000);
    } catch {
      this.errorMessage.set(this.t('errorOccurred'));
    } finally {
      this.submitting.set(false);
    }
  }

  controlInvalid(controlName: 'password' | 'confirmPassword'): boolean {
    const control = this.resetForm.controls[controlName];
    return control.invalid && (control.touched || control.dirty);
  }

  passwordErrorMessage(): string {
    const control = this.resetForm.controls.password;
    if (control.hasError('required')) return this.t('passwordRequired');
    if (control.hasError('minlength')) return this.t('passwordTooShort');
    return '';
  }

  confirmErrorMessage(): string {
    const control = this.resetForm.controls.confirmPassword;
    if (control.hasError('required')) return this.t('passwordRequired');
    if (control.hasError('mismatch')) return this.t('passwordsDoNotMatch');
    return '';
  }
}
