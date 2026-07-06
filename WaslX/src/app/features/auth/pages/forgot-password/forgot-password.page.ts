import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { firstValueFrom } from 'rxjs';

import { AuthApiService } from '../../../../core/auth/auth-api.service';
import { LanguageService, type TranslationKey } from '../../../../core/services/language.service';
import { ThemeService } from '../../../../core/services/theme.service';
import { ToastService } from '../../../../core/services/toast.service';
import { AuthShellComponent } from '../../components/auth-shell/auth-shell.component';
import { IconComponent } from '../../../../shared/components/icon/icon.component';

@Component({
  selector: 'app-forgot-password-page',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, AuthShellComponent, IconComponent],
  templateUrl: './forgot-password.page.html',
  styleUrl: './forgot-password.page.css'
})
export class ForgotPasswordPageComponent {
  private readonly formBuilder = inject(NonNullableFormBuilder);
  private readonly authApiService = inject(AuthApiService);
  private readonly toastService = inject(ToastService);
  private readonly themeService = inject(ThemeService);
  private readonly languageService = inject(LanguageService);

  readonly submitting = signal(false);
  readonly errorMessage = signal('');
  readonly successMessage = signal('');
  readonly emailHelpId = 'forgot-email-help';

  readonly forgotForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]]
  });

  readonly direction = () => this.languageService.getDirection();
  readonly t = (key: TranslationKey | string) => {
    // Basic fallback since we don't have all translations typed
    const map: Record<string, string> = {
      forgotPasswordTitle: this.languageService.language() === 'ar' ? 'نسيت كلمة المرور' : 'Forgot Password',
      forgotPasswordLead: this.languageService.language() === 'ar' ? 'أدخل بريدك الإلكتروني لتلقي رابط إعادة تعيين كلمة المرور.' : 'Enter your email to receive a password reset link.',
      emailAddress: this.languageService.language() === 'ar' ? 'البريد الإلكتروني' : 'Email Address',
      sendResetLink: this.languageService.language() === 'ar' ? 'إرسال الرابط' : 'Send Reset Link',
      sending: this.languageService.language() === 'ar' ? 'جاري الإرسال...' : 'Sending...',
      backToLogin: this.languageService.language() === 'ar' ? 'العودة لتسجيل الدخول' : 'Back to login',
      emailRequired: this.languageService.language() === 'ar' ? 'البريد الإلكتروني مطلوب' : 'Email is required',
      emailInvalid: this.languageService.language() === 'ar' ? 'بريد إلكتروني غير صالح' : 'Invalid email format',
      resetLinkSent: this.languageService.language() === 'ar' ? 'تم إرسال رابط التعيين إذا كان الحساب موجوداً.' : 'A reset link has been sent if the account exists.',
      errorOccurred: this.languageService.language() === 'ar' ? 'حدث خطأ، يرجى المحاولة لاحقاً.' : 'An error occurred, please try again later.'
    };
    return map[key] || this.languageService.text(key as TranslationKey);
  };

  readonly languageLabel = () =>
    this.languageService.language() === 'en'
      ? this.languageService.text('switchToArabic')
      : this.languageService.text('switchToEnglish');

  async requestReset(): Promise<void> {
    this.errorMessage.set('');
    this.successMessage.set('');
    this.forgotForm.markAllAsTouched();

    if (this.forgotForm.invalid) {
      return;
    }

    this.submitting.set(true);

    try {
      const { email } = this.forgotForm.getRawValue();
      await firstValueFrom(this.authApiService.forgotPassword({ email }));
      this.successMessage.set(this.t('resetLinkSent'));
      this.forgotForm.reset();
    } catch {
      // Don't leak if account exists or not, just show generic error or success
      this.errorMessage.set(this.t('errorOccurred'));
    } finally {
      this.submitting.set(false);
    }
  }

  toggleLanguage(): void {
    this.languageService.toggleLanguage();
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  controlInvalid(controlName: 'email'): boolean {
    const control = this.forgotForm.controls[controlName];
    return control.invalid && (control.touched || control.dirty);
  }

  emailErrorMessage(): string {
    const control = this.forgotForm.controls.email;
    if (control.hasError('required')) return this.t('emailRequired');
    if (control.hasError('email')) return this.t('emailInvalid');
    return '';
  }
}
