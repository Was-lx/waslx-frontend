import { DecimalPipe } from '@angular/common';
import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import { WorkspaceApiService } from '../../../../core/api/workspace-api.service';
import { UsersApiService } from '../../../../core/api/users-api.service';
import { LanguageService } from '../../../../core/services/language.service';
import { ToastService } from '../../../../core/services/toast.service';
import { IconComponent } from '../../../../shared/components/icon/icon.component';

// ─── Local bilingual copy (EN / AR) ──────────────────────────────────────────
// Kept local to the page so the wizard reads as one self-contained flow.

interface StepMeta {
  readonly key: string;
  readonly icon: string;
  readonly title: string;
  readonly caption: string;
}

interface WaStep {
  readonly text: string;
}

interface WelcomeCard {
  readonly icon: string;
  readonly title: string;
  readonly sub: string;
}

interface OnboardingCopy {
  readonly brandTag: string;
  readonly stepWord: string;
  readonly railFoot: string;
  readonly railStatus: string;
  readonly stateDone: string;
  readonly stateNow: string;
  readonly progressLabel: (n: number, total: number) => string;
  readonly steps: readonly [StepMeta, StepMeta, StepMeta];

  // Step 1 — welcome
  readonly welcomeEyebrow: string;
  readonly welcomeGreeting: (name: string) => string;
  readonly welcomeGreetingPre: string;
  readonly workspaceFallback: string;
  readonly welcomeLead: string;
  readonly welcomeBullets: readonly string[];
  readonly welcomeCards: readonly WelcomeCard[];
  readonly timeToValue: string;
  readonly startCta: string;

  // Step 2 — seats
  readonly seatsLabel: string;

  // Step 2 — invite
  readonly inviteTitle: string;
  readonly inviteLead: string;
  readonly emailPlaceholder: string;
  readonly roleManager: string;
  readonly roleAgent: string;
  readonly addRow: string;
  readonly inviteHint: string;
  readonly sendInvites: string;
  readonly skipForNow: string;
  readonly invitesSentTitle: string;
  readonly invitesSentBody: (n: number) => string;
  readonly inviteFailed: string;
  readonly invalidEmail: string;

  // Step 3 — WhatsApp
  readonly waTitle: string;
  readonly waLead: string;
  readonly waPending: string;
  readonly waNote: string;
  readonly waSteps: readonly WaStep[];
  readonly finishCta: string;

  // Nav
  readonly back: string;
  readonly next: string;
  readonly readyToast: string;
}

const CONTENT: Record<'en' | 'ar', OnboardingCopy> = {
  en: {
    brandTag: 'Workspace setup',
    stepWord: 'Step',
    railFoot: 'AI-powered team inbox',
    railStatus: 'Workspace online',
    stateDone: 'Done',
    stateNow: 'Now',
    progressLabel: (n, total) => `Step ${n} of ${total}`,
    steps: [
      { key: 'welcome', icon: 'sparkles', title: 'Welcome', caption: 'Get your bearings' },
      { key: 'invite', icon: 'users', title: 'Invite your team', caption: 'Bring people in' },
      { key: 'whatsapp', icon: 'message', title: 'Connect WhatsApp', caption: 'Coming next' },
    ],
    welcomeEyebrow: 'You’re all set to begin',
    welcomeGreeting: (name) => `Welcome to ${name}`,
    welcomeGreetingPre: 'Welcome to',
    workspaceFallback: 'your workspace',
    welcomeLead:
      'Your workspace is live. A couple of quick steps and your team will be answering customers together — with AI routing every conversation to the right person.',
    welcomeBullets: [
      'Invite the teammates who’ll handle conversations',
      'Get ready to connect your WhatsApp Business number',
      'Land in a dashboard that’s already yours',
    ],
    welcomeCards: [
      { icon: 'users', title: 'Invite your team', sub: 'Bring in the people who’ll handle conversations' },
      { icon: 'message', title: 'Connect WhatsApp', sub: 'Link your Business number to start routing' },
      { icon: 'route', title: 'Let AI route the rest', sub: 'Every chat lands with the right person' },
    ],
    timeToValue: 'About 2 minutes',
    startCta: 'Let’s set up',

    seatsLabel: 'seats',
    inviteTitle: 'Invite your team',
    inviteLead: 'Add up to three teammates now — you can always invite more later from Settings.',
    emailPlaceholder: 'name@company.com',
    roleManager: 'Manager',
    roleAgent: 'Agent',
    addRow: 'Add another',
    inviteHint: 'We’ll email each person a secure link to set their password.',
    sendInvites: 'Send invites',
    skipForNow: 'Skip for now',
    invitesSentTitle: 'Invites sent',
    invitesSentBody: (n) => (n === 1 ? '1 teammate has been invited.' : `${n} teammates have been invited.`),
    inviteFailed: 'We couldn’t send one or more invites. Please try again.',
    invalidEmail: 'Enter a valid email address.',

    waTitle: 'Connect WhatsApp',
    waLead: 'Linking your WhatsApp Business number is the next step of your setup.',
    waPending: 'Verification pending',
    waNote: 'We’ll guide you through connecting when it’s ready — nothing to do here yet.',
    waSteps: [
      { text: 'Verify your WhatsApp Business number with Meta' },
      { text: 'Approve WaslX to send and receive on your behalf' },
      { text: 'Start routing conversations automatically' },
    ],
    finishCta: 'Finish setup',

    back: 'Back',
    next: 'Next',
    readyToast: 'Your workspace is ready.',
  },
  ar: {
    brandTag: 'إعداد مساحة العمل',
    stepWord: 'الخطوة',
    railFoot: 'صندوق وارد للفريق بالذكاء الاصطناعي',
    railStatus: 'مساحة العمل متصلة',
    stateDone: 'تم',
    stateNow: 'الآن',
    progressLabel: (n, total) => `الخطوة ${n} من ${total}`,
    steps: [
      { key: 'welcome', icon: 'sparkles', title: 'أهلاً بك', caption: 'لنبدأ' },
      { key: 'invite', icon: 'users', title: 'ادعُ فريقك', caption: 'أضف زملاءك' },
      { key: 'whatsapp', icon: 'message', title: 'اربط واتساب', caption: 'قريبًا' },
    ],
    welcomeEyebrow: 'كل شيء جاهز للبدء',
    welcomeGreeting: (name) => `أهلاً بك في ${name}`,
    welcomeGreetingPre: 'أهلاً بك في',
    workspaceFallback: 'مساحتك',
    welcomeLead:
      'مساحة عملك جاهزة. خطوتان سريعتان ويبدأ فريقك في الرد على العملاء معًا — مع توجيه ذكي لكل محادثة إلى الشخص المناسب.',
    welcomeBullets: [
      'ادعُ الزملاء الذين سيتولّون المحادثات',
      'استعد لربط رقم واتساب للأعمال',
      'ادخل إلى لوحة تحكم أصبحت ملكك بالفعل',
    ],
    welcomeCards: [
      { icon: 'users', title: 'ادعُ فريقك', sub: 'أضف من سيتولّون المحادثات' },
      { icon: 'message', title: 'اربط واتساب', sub: 'اربط رقم الأعمال لبدء التوجيه' },
      { icon: 'route', title: 'ودع الذكاء يوجّه الباقي', sub: 'كل محادثة تصل إلى الشخص المناسب' },
    ],
    timeToValue: 'حوالي دقيقتين',
    startCta: 'لنبدأ الإعداد',

    seatsLabel: 'مقاعد',
    inviteTitle: 'ادعُ فريقك',
    inviteLead: 'أضف حتى ثلاثة زملاء الآن — يمكنك دعوة المزيد لاحقًا من الإعدادات.',
    emailPlaceholder: 'name@company.com',
    roleManager: 'مدير',
    roleAgent: 'موظف',
    addRow: 'أضف صفًا آخر',
    inviteHint: 'سنرسل لكل شخص رابطًا آمنًا لتعيين كلمة المرور.',
    sendInvites: 'إرسال الدعوات',
    skipForNow: 'تخطٍّ الآن',
    invitesSentTitle: 'تم إرسال الدعوات',
    invitesSentBody: (n) => (n === 1 ? 'تمت دعوة زميل واحد.' : `تمت دعوة ${n} من الزملاء.`),
    inviteFailed: 'تعذّر إرسال دعوة واحدة أو أكثر. حاول مرة أخرى.',
    invalidEmail: 'أدخل بريدًا إلكترونيًا صحيحًا.',

    waTitle: 'اربط واتساب',
    waLead: 'ربط رقم واتساب للأعمال هو الخطوة التالية في إعدادك.',
    waPending: 'قيد التحقق',
    waNote: 'سنرشدك خلال الربط عندما يصبح جاهزًا — لا شيء عليك فعله هنا الآن.',
    waSteps: [
      { text: 'وثّق رقم واتساب للأعمال مع ميتا' },
      { text: 'اسمح لِـ WaslX بالإرسال والاستقبال نيابةً عنك' },
      { text: 'ابدأ توجيه المحادثات تلقائيًا' },
    ],
    finishCta: 'إنهاء الإعداد',

    back: 'رجوع',
    next: 'التالي',
    readyToast: 'مساحة عملك جاهزة.',
  },
};

const TOTAL_STEPS = 3;

@Component({
  selector: 'app-onboarding-page',
  standalone: true,
  imports: [ReactiveFormsModule, IconComponent, DecimalPipe],
  templateUrl: './onboarding.page.html',
  styleUrl: './onboarding.page.css',
})
export class OnboardingPageComponent {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly router = inject(Router);
  private readonly toastService = inject(ToastService);
  private readonly workspaceApiService = inject(WorkspaceApiService);
  private readonly usersApiService = inject(UsersApiService);
  private readonly languageService = inject(LanguageService);

  readonly totalSteps = TOTAL_STEPS;

  /** 1-based step the user is currently on. */
  readonly currentStep = signal(1);
  readonly loading = signal(false);
  readonly sendingInvites = signal(false);
  readonly workspaceName = signal('');

  readonly c = computed(() => CONTENT[this.languageService.language()]);
  readonly direction = () => this.languageService.getDirection();
  readonly progressPct = computed(() => (this.currentStep() / this.totalSteps) * 100);
  readonly welcomeTitle = computed(() =>
    this.c().welcomeGreeting(this.workspaceName() || (this.languageService.language() === 'ar' ? 'مساحتك' : 'your workspace')),
  );

  // ── Visual-only helpers (no logic; drive the cockpit chrome) ──────────────

  /** Live clock string for the rail's status console. Ticks every 30s. */
  readonly clock = signal(this.formatClock());

  /** Up to three invite rows: email + role. Blank rows are ignored on submit. */
  readonly inviteForm = this.fb.group({
    rows: this.fb.array([this.createInviteRow(), this.createInviteRow(), this.createInviteRow()]),
  });

  constructor() {
    void this.loadProfile();

    // Keep the rail's status clock live. Interval only — no bindings touched.
    const tick = setInterval(() => this.clock.set(this.formatClock()), 30_000);
    inject(DestroyRef).onDestroy(() => clearInterval(tick));
  }

  private formatClock(): string {
    try {
      return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  }

  get rows() {
    return this.inviteForm.controls.rows;
  }

  /** Visual-only: how many invite rows currently carry an email. */
  seatsFilled(): number {
    return this.rows.controls.filter((r) => r.controls.email.value.trim().length > 0).length;
  }

  private createInviteRow() {
    return this.fb.group({
      email: ['', [Validators.email]],
      role: ['Agent'],
    });
  }

  private async loadProfile(): Promise<void> {
    try {
      const profile = await firstValueFrom(this.workspaceApiService.getProfile());
      this.workspaceName.set(profile.name ?? '');

      // Resume where the tenant left off. onboardingStep is a 0-based index
      // of the last-saved step; resume on the next incomplete step.
      if (!profile.onboardingCompleted && typeof profile.onboardingStep === 'number') {
        const resumeAt = Math.min(Math.max(profile.onboardingStep + 1, 1), this.totalSteps);
        this.currentStep.set(resumeAt);
      }
    } catch {
      // Non-blocking: the wizard still works without the profile prefetch.
    }
  }

  goNext(): void {
    if (this.currentStep() >= this.totalSteps) return;
    this.currentStep.update((s) => s + 1);
    this.persistStep();
  }

  goBack(): void {
    if (this.currentStep() <= 1) return;
    this.currentStep.update((s) => s - 1);
    this.persistStep();
  }

  /** Persist progress so the wizard resumes on next visit. */
  private persistStep(): void {
    // currentStep is 1-based; store the 0-based index of the current step.
    const stepIndex = this.currentStep() - 1;
    this.workspaceApiService.updateOnboarding(stepIndex, false).subscribe({ error: () => void 0 });
  }

  async sendInvites(): Promise<void> {
    const filled = this.rows.controls
      .map((row) => row.getRawValue())
      .filter((v) => v.email.trim().length > 0);

    // Nothing to send — behave like "skip".
    if (filled.length === 0) {
      this.goNext();
      return;
    }

    // Validate only the rows the user actually filled in.
    this.rows.controls.forEach((row) => {
      if (row.controls.email.value.trim().length > 0) row.controls.email.markAsTouched();
    });

    const hasInvalid = this.rows.controls.some(
      (row) => row.controls.email.value.trim().length > 0 && row.controls.email.invalid,
    );
    if (hasInvalid) {
      this.toastService.error(this.c().inviteTitle, this.c().invalidEmail);
      return;
    }

    this.sendingInvites.set(true);
    try {
      await Promise.all(
        filled.map((v) =>
          firstValueFrom(this.usersApiService.inviteUser({ email: v.email.trim(), role: v.role })),
        ),
      );
      this.toastService.success(this.c().invitesSentTitle, this.c().invitesSentBody(filled.length));
      this.goNext();
    } catch {
      this.toastService.error(this.c().inviteTitle, this.c().inviteFailed);
    } finally {
      this.sendingInvites.set(false);
    }
  }

  skipInvites(): void {
    this.goNext();
  }

  async finish(): Promise<void> {
    this.loading.set(true);
    try {
      await firstValueFrom(this.workspaceApiService.updateOnboarding(this.totalSteps, true));
      this.toastService.success(this.c().readyToast, '');
      void this.router.navigate(['/app/dashboard']);
    } catch {
      this.toastService.error(this.c().brandTag, this.c().inviteFailed);
    } finally {
      this.loading.set(false);
    }
  }
}
