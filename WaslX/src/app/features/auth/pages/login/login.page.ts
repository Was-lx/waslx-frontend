import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { firstValueFrom } from 'rxjs';

import { AuthSessionService, type AppRole } from '../../../../core/services/auth-session.service';
import { AuthApiService } from '../../../../core/auth/auth-api.service';
import { LanguageService, type TranslationKey } from '../../../../core/services/language.service';
import { ThemeService } from '../../../../core/services/theme.service';
import { ToastService } from '../../../../core/services/toast.service';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.page.html',
  styleUrl: './login.page.css'
})
export class LoginPageComponent {
  private readonly formBuilder = inject(NonNullableFormBuilder);
  private readonly authSessionService = inject(AuthSessionService);
  private readonly authApiService = inject(AuthApiService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly toastService = inject(ToastService);
  private readonly themeService = inject(ThemeService);
  private readonly languageService = inject(LanguageService);

  readonly submitting = signal(false);
  readonly errorMessage = signal('');
  readonly lockoutMessage = signal('');
  readonly emailHelpId = 'login-email-help';
  readonly passwordHelpId = 'login-password-help';

  readonly loginForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]]
  });

  readonly direction = () => this.languageService.getDirection();
  readonly t = (key: TranslationKey | string) => {
    if (key === 'forgotPasswordTitle') {
      return this.languageService.language() === 'ar' ? 'نسيت كلمة المرور؟' : 'Forgot Password?';
    }
    return this.languageService.text(key as TranslationKey);
  };
  readonly languageLabel = () =>
    this.languageService.language() === 'en'
      ? this.languageService.text('switchToArabic')
      : this.languageService.text('switchToEnglish');

  async signIn(): Promise<void> {
    this.errorMessage.set('');
    this.loginForm.markAllAsTouched();

    if (this.loginForm.invalid) {
      return;
    }

    if (this.lockoutMessage()) {
      return;
    }

    this.submitting.set(true);

    try {
      const { email, password } = this.loginForm.getRawValue();

      const response = await firstValueFrom(
        this.authApiService.login({ email, password })
      );

      if (!response?.accessToken) {
        throw new Error('Invalid response');
      }

      const primaryRole = (response.roles?.[0] ?? 'Viewer') as AppRole;

      this.authSessionService.signIn(
        {
          accessToken: response.accessToken,
          refreshToken: response.refreshToken,
          roles: response.roles as AppRole[]
        },
        {
          id: response.userId,
          email: response.email,
          fullName: response.fullName,
          role: primaryRole,
          tenantId: '' // Left empty or parsed from token if necessary
        }
      );

      this.toastService.success(
        this.languageService.text('signedIn'),
        this.languageService.text('workspaceReady')
      );

      void this.router.navigateByUrl(this.resolveLandingTarget(primaryRole), { replaceUrl: true });
    } catch (error: any) {
      // Assuming 429 status or specific error code for lockout
      if (error?.status === 429 || error?.error?.code === 'lockout') {
        const msg = this.languageService.language() === 'ar' 
          ? 'تم حظر الحساب مؤقتاً بسبب محاولات فاشلة متكررة.' 
          : 'Account temporarily locked due to repeated failed attempts.';
        this.lockoutMessage.set(msg);
        this.errorMessage.set('');
        this.toastService.error(
          this.languageService.text('auth'),
          msg
        );
      } else {
        this.errorMessage.set(this.languageService.text('invalidCredentials'));
        this.toastService.error(
          this.languageService.text('auth'),
          this.languageService.text('invalidCredentials')
        );
      }
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

  controlInvalid(controlName: 'email' | 'password'): boolean {
    const control = this.loginForm.controls[controlName];
    return control.invalid && (control.touched || control.dirty);
  }

  emailErrorMessage(): string {
    const control = this.loginForm.controls.email;

    if (control.hasError('required')) {
      return this.languageService.text('emailRequired');
    }

    if (control.hasError('email')) {
      return this.languageService.text('emailInvalid');
    }

    return this.languageService.text('invalidCredentials');
  }

  passwordErrorMessage(): string {
    const control = this.loginForm.controls.password;

    if (control.hasError('required')) {
      return this.languageService.text('passwordRequired');
    }

    if (control.hasError('minlength')) {
      return this.languageService.text('passwordTooShort');
    }

    return this.languageService.text('invalidCredentials');
  }

  private resolveLandingTarget(role: AppRole): string {
    const redirectTo = this.route.snapshot.queryParamMap.get('redirectTo');

    if (redirectTo && this.isSafeRedirect(redirectTo)) {
      return redirectTo;
    }

    switch (role) {
      case 'SuperAdmin':
        return '/app/superadmin';
      case 'Admin':
      case 'Manager':
        return '/app/dashboard';
      case 'Agent':
        return '/app/inbox';
      default:
        return '/app/dashboard';
    }
  }

  private isSafeRedirect(target: string): boolean {
    return target.startsWith('/') && !target.startsWith('/login');
  }
}
