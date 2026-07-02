import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { type TranslationKey, LanguageService } from '../../../../core/services/language.service';
import { ToastService } from '../../../../core/services/toast.service';

@Component({
  selector: 'app-onboarding-page',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './onboarding.page.html',
  styleUrl: './onboarding.page.css'
})
export class OnboardingPageComponent {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly toastService = inject(ToastService);
  readonly languageService = inject(LanguageService);

  readonly currentStep = signal(1);
  readonly loading = signal(false);

  readonly t = (key: TranslationKey) => this.languageService.text(key);
  readonly direction = () => this.languageService.getDirection();

  readonly step1Form = this.fb.group({
    workspaceName: ['', Validators.required]
  });

  readonly step2Form = this.fb.group({
    inviteEmail: ['', Validators.email]
  });

  nextStep(): void {
    if (this.currentStep() === 1 && this.step1Form.invalid) {
      return;
    }
    this.currentStep.update(s => s + 1);
  }

  prevStep(): void {
    this.currentStep.update(s => Math.max(1, s - 1));
  }

  finishOnboarding(): void {
    this.loading.set(true);
    // Mock save logic
    setTimeout(() => {
      this.loading.set(false);
      this.toastService.success(this.t('workspaceReady'), '');
      void this.router.navigate(['/app/dashboard']);
    }, 1000);
  }
}
