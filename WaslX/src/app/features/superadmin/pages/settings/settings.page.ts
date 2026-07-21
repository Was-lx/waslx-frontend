import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { LanguageService } from '../../../../core/services/language.service';
import { ToastService } from '../../../../core/services/toast.service';
import { IconComponent } from '../../../../shared/components/icon/icon.component';
import { SuperAdminApiService } from '../../../../core/api/superadmin-api.service';
import type {
  CredentialType,
  DefaultRouting,
  FeatureFlag,
  PlatformCredential,
  PlatformPolicy,
  UpsertCredential,
} from '../../../../core/models/platform.models';

type Tab = 'credentials' | 'flags' | 'policy';

const CREDENTIAL_TYPES: CredentialType[] = ['WhatsAppAppSecret', 'AiProviderKey', 'WebhookSigning', 'Other'];

const CONTENT = {
  en: {
    eyebrow: 'Platform console',
    title: 'Platform settings',
    subtitle: 'Credentials, feature flags and policy defaults for the whole platform.',
    tabCredentials: 'Credentials',
    tabFlags: 'Feature flags',
    tabPolicy: 'Policy',
    // shared
    loading: 'Loading…',
    errorTitle: 'Could not load',
    errorBody: 'Something went wrong reaching the platform service.',
    retry: 'Retry',
    saving: 'Saving…',
    save: 'Save',
    cancel: 'Cancel',
    required: 'Required',
    // credentials
    credTitle: 'Secrets & keys',
    credSub: 'WhatsApp app secrets, AI provider keys and webhook signing. Never pre-revealed.',
    credEmpty: 'No credentials stored yet.',
    addCredential: 'Add credential',
    credName: 'Name',
    credKey: 'Key',
    credType: 'Type',
    credValue: 'Value',
    holdToReveal: 'Hold to reveal',
    copy: 'Copy',
    copied: 'Copied',
    rotate: 'Rotate',
    remove: 'Remove',
    typeWhatsAppAppSecret: 'WhatsApp app secret',
    typeAiProviderKey: 'AI provider key',
    typeWebhookSigning: 'Webhook signing',
    typeOther: 'Other',
    rotateTitle: 'Rotate this credential?',
    rotateBody: 'A new secret is generated and the old value stops working immediately. This is audited.',
    rotateConfirm: 'Rotate key',
    deleteCredTitle: 'Remove this credential?',
    deleteCredBody: 'Anything using it will stop working. This cannot be undone.',
    deleteConfirm: 'Remove',
    newSecretTitle: 'Copy this now — it is shown once',
    newSecretBody: 'For your security this plaintext value will not be shown again after you leave.',
    dismiss: 'Done',
    createdToast: 'Credential created',
    rotatedToast: 'Credential rotated',
    deletedToast: 'Credential removed',
    // flags
    flagsTitle: 'Feature flags',
    flagsSub: 'Toggle capabilities globally or per tenant. Global changes prompt a blast-radius confirm.',
    flagsEmpty: 'No feature flags defined yet.',
    scopeGlobal: 'Global',
    scopeTenant: 'Tenant',
    rollout: 'Rollout',
    flagConfirmTitle: 'Change a live flag?',
    flagConfirmOn: 'Enabling',
    flagConfirmOff: 'Disabling',
    flagConfirmAffects: 'affects',
    flagConfirmTenants: 'live tenants',
    flagConfirmApply: 'Apply change',
    flagToast: 'Feature flag updated',
    // policy
    policyTitle: 'Policy defaults',
    policySub: 'Defaults applied to every tenant unless overridden.',
    retentionDays: 'Data retention (days)',
    rateLimit: 'API rate limit (req/min per tenant)',
    defaultRouting: 'Default routing',
    routingManual: 'Manual',
    routingRoundRobin: 'Round robin',
    routingAi: 'AI',
    sessionMinutes: 'Session length (minutes)',
    lockoutThreshold: 'Lockout after (failed logins)',
    aiDefault: 'AI Agent on by default',
    aiDefaultHint: 'New tenants start with the autonomous AI Agent enabled.',
    policySaved: 'Policy saved',
    saveErr: 'Could not save changes',
  },
  ar: {
    eyebrow: 'لوحة المنصة',
    title: 'إعدادات المنصة',
    subtitle: 'المفاتيح والأعلام وإعدادات السياسة الافتراضية للمنصة بأكملها.',
    tabCredentials: 'المفاتيح',
    tabFlags: 'أعلام الميزات',
    tabPolicy: 'السياسة',
    loading: 'جارٍ التحميل…',
    errorTitle: 'تعذّر التحميل',
    errorBody: 'حدث خطأ أثناء الاتصال بخدمة المنصة.',
    retry: 'إعادة المحاولة',
    saving: 'جارٍ الحفظ…',
    save: 'حفظ',
    cancel: 'إلغاء',
    required: 'مطلوب',
    credTitle: 'المفاتيح والأسرار',
    credSub: 'أسرار تطبيق واتساب ومفاتيح مزوّد الذكاء وتوقيع الويب هوك. لا تُكشف مسبقًا أبدًا.',
    credEmpty: 'لا توجد مفاتيح مخزّنة بعد.',
    addCredential: 'إضافة مفتاح',
    credName: 'الاسم',
    credKey: 'المُعرّف',
    credType: 'النوع',
    credValue: 'القيمة',
    holdToReveal: 'اضغط مطوّلًا للكشف',
    copy: 'نسخ',
    copied: 'تم النسخ',
    rotate: 'تدوير',
    remove: 'إزالة',
    typeWhatsAppAppSecret: 'سر تطبيق واتساب',
    typeAiProviderKey: 'مفتاح مزوّد الذكاء',
    typeWebhookSigning: 'توقيع الويب هوك',
    typeOther: 'أخرى',
    rotateTitle: 'تدوير هذا المفتاح؟',
    rotateBody: 'سيُنشأ سر جديد ويتوقف السر القديم عن العمل فورًا. تُسجَّل هذه العملية.',
    rotateConfirm: 'تدوير المفتاح',
    deleteCredTitle: 'إزالة هذا المفتاح؟',
    deleteCredBody: 'سيتوقف كل ما يستخدمه عن العمل. لا يمكن التراجع.',
    deleteConfirm: 'إزالة',
    newSecretTitle: 'انسخه الآن — يُعرض مرة واحدة',
    newSecretBody: 'لأمانك لن تُعرض هذه القيمة الصريحة مرة أخرى بعد مغادرتك.',
    dismiss: 'تم',
    createdToast: 'تم إنشاء المفتاح',
    rotatedToast: 'تم تدوير المفتاح',
    deletedToast: 'تمت إزالة المفتاح',
    flagsTitle: 'أعلام الميزات',
    flagsSub: 'فعّل القدرات عالميًا أو لكل مستأجر. التغييرات العالمية تطلب تأكيد نطاق التأثير.',
    flagsEmpty: 'لا توجد أعلام ميزات معرّفة بعد.',
    scopeGlobal: 'عام',
    scopeTenant: 'مستأجر',
    rollout: 'الطرح',
    flagConfirmTitle: 'تغيير علم فعّال؟',
    flagConfirmOn: 'تفعيل',
    flagConfirmOff: 'تعطيل',
    flagConfirmAffects: 'يؤثر على',
    flagConfirmTenants: 'مستأجرًا فعّالًا',
    flagConfirmApply: 'تطبيق التغيير',
    flagToast: 'تم تحديث علم الميزة',
    policyTitle: 'إعدادات السياسة الافتراضية',
    policySub: 'إعدادات افتراضية تُطبّق على كل مستأجر ما لم تُتجاوز.',
    retentionDays: 'الاحتفاظ بالبيانات (أيام)',
    rateLimit: 'حد معدّل الطلبات (طلب/دقيقة لكل مستأجر)',
    defaultRouting: 'التوجيه الافتراضي',
    routingManual: 'يدوي',
    routingRoundRobin: 'بالتناوب',
    routingAi: 'ذكاء اصطناعي',
    sessionMinutes: 'مدة الجلسة (دقائق)',
    lockoutThreshold: 'القفل بعد (محاولات فاشلة)',
    aiDefault: 'وكيل الذكاء مفعّل افتراضيًا',
    aiDefaultHint: 'يبدأ المستأجرون الجدد بوكيل الذكاء المستقل مفعّلًا.',
    policySaved: 'تم حفظ السياسة',
    saveErr: 'تعذّر حفظ التغييرات',
  },
} as const;

@Component({
  selector: 'app-superadmin-settings-page',
  standalone: true,
  imports: [ReactiveFormsModule, IconComponent],
  templateUrl: './settings.page.html',
  styleUrl: './settings.page.css',
})
export class SuperAdminSettingsPageComponent implements OnInit {
  readonly languageService = inject(LanguageService);
  private readonly api = inject(SuperAdminApiService);
  private readonly fb = inject(FormBuilder);
  private readonly toast = inject(ToastService);

  readonly direction = computed(() => this.languageService.getDirection(this.languageService.language()));
  readonly c = computed(() => CONTENT[this.languageService.language() === 'ar' ? 'ar' : 'en']);

  readonly credentialTypes = CREDENTIAL_TYPES;
  readonly tab = signal<Tab>('credentials');

  // ── Credentials state ──
  readonly credentials = signal<PlatformCredential[]>([]);
  readonly credLoading = signal(true);
  readonly credError = signal(false);
  readonly credFormOpen = signal(false);
  readonly credSubmitting = signal(false);
  readonly credSubmitted = signal(false);
  /** Transient plaintext held only for this session (created/rotated once). */
  private readonly plaintext = signal<Record<number, string>>({});
  /** Id currently press-held for reveal (no animation, instant). */
  readonly revealedId = signal<number | null>(null);
  readonly copiedId = signal<number | null>(null);
  readonly rotateTarget = signal<PlatformCredential | null>(null);
  readonly deleteTarget = signal<PlatformCredential | null>(null);
  readonly credBusyId = signal<number | null>(null);
  /** Freshly minted plaintext to surface once in a copy-now modal. */
  readonly newSecret = signal<{ name: string; value: string } | null>(null);

  readonly credForm = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(80)]],
    key: ['', [Validators.required, Validators.maxLength(80)]],
    type: ['AiProviderKey' as CredentialType, Validators.required],
    value: ['', [Validators.required]],
  });

  // ── Feature flags state ──
  readonly flags = signal<FeatureFlag[]>([]);
  readonly flagsLoading = signal(true);
  readonly flagsError = signal(false);
  readonly flagBusyId = signal<number | null>(null);
  readonly flagConfirm = signal<FeatureFlag | null>(null);

  // ── Policy state ──
  readonly policyLoading = signal(true);
  readonly policyError = signal(false);
  readonly policySaving = signal(false);
  readonly policyForm = this.fb.group({
    retentionDays: [90, [Validators.required, Validators.min(1)]],
    rateLimitPerMinute: [120, [Validators.required, Validators.min(1)]],
    defaultRouting: ['RoundRobin' as DefaultRouting, Validators.required],
    sessionMinutes: [60, [Validators.required, Validators.min(5)]],
    lockoutThreshold: [5, [Validators.required, Validators.min(1)]],
    aiEnabledByDefault: [true],
  });

  ngOnInit(): void {
    this.loadCredentials();
    this.loadFlags();
    this.loadPolicy();
  }

  setTab(tab: Tab): void {
    this.tab.set(tab);
  }

  // ═══ Credentials ═══
  loadCredentials(): void {
    this.credLoading.set(true);
    this.credError.set(false);
    this.api.getCredentials().subscribe({
      next: (list) => {
        this.credentials.set(list ?? []);
        this.credLoading.set(false);
      },
      error: () => {
        this.credError.set(true);
        this.credLoading.set(false);
      },
    });
  }

  openCredForm(): void {
    this.credSubmitted.set(false);
    this.credForm.reset({ name: '', key: '', type: 'AiProviderKey', value: '' });
    this.credFormOpen.set(true);
  }
  closeCredForm(): void {
    if (this.credSubmitting()) return;
    this.credFormOpen.set(false);
  }

  submitCredential(): void {
    this.credSubmitted.set(true);
    if (this.credForm.invalid) {
      this.credForm.markAllAsTouched();
      return;
    }
    const raw = this.credForm.getRawValue();
    const payload: UpsertCredential = {
      name: (raw.name ?? '').trim(),
      key: (raw.key ?? '').trim(),
      type: (raw.type ?? 'Other') as CredentialType,
      value: (raw.value ?? '').trim(),
    };
    this.credSubmitting.set(true);
    this.api.createCredential(payload).subscribe({
      next: (created) => {
        // Strip the plaintext out of the stored row; hold it transiently.
        const { value, ...row } = created;
        this.credentials.update((list) => [row, ...list]);
        this.plaintext.update((m) => ({ ...m, [row.id]: value }));
        this.credSubmitting.set(false);
        this.credFormOpen.set(false);
        this.newSecret.set({ name: row.name, value });
        this.toast.success(this.c().createdToast, row.name);
      },
      error: () => {
        this.credSubmitting.set(false);
        this.toast.error(this.c().saveErr, this.c().errorBody);
      },
    });
  }

  // Reveal is press-and-hold — NO animation, instant on/off (plan §05 Motion).
  startReveal(id: number): void {
    this.revealedId.set(id);
  }
  endReveal(): void {
    this.revealedId.set(null);
  }

  displayValue(cred: PlatformCredential): string {
    if (this.revealedId() === cred.id) {
      return this.plaintext()[cred.id] ?? cred.masked;
    }
    return cred.masked;
  }
  isRevealed(cred: PlatformCredential): boolean {
    return this.revealedId() === cred.id;
  }

  copyCredential(cred: PlatformCredential): void {
    const value = this.plaintext()[cred.id] ?? cred.masked;
    const done = () => {
      this.copiedId.set(cred.id);
      setTimeout(() => this.copiedId.update((v) => (v === cred.id ? null : v)), 1600);
    };
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(value).then(done, () => {});
    } else {
      done();
    }
  }

  askRotate(cred: PlatformCredential): void {
    this.rotateTarget.set(cred);
  }
  cancelRotate(): void {
    if (this.credBusyId()) return;
    this.rotateTarget.set(null);
  }
  confirmRotate(): void {
    const cred = this.rotateTarget();
    if (!cred) return;
    this.credBusyId.set(cred.id);
    this.api.rotateCredential(cred.id).subscribe({
      next: (rotated) => {
        const { value, ...row } = rotated;
        this.credentials.update((list) => list.map((x) => (x.id === row.id ? row : x)));
        this.plaintext.update((m) => ({ ...m, [row.id]: value }));
        this.credBusyId.set(null);
        this.rotateTarget.set(null);
        this.newSecret.set({ name: row.name, value });
        this.toast.success(this.c().rotatedToast, row.name);
      },
      error: () => {
        this.credBusyId.set(null);
        this.toast.error(this.c().saveErr, this.c().errorBody);
      },
    });
  }

  askDeleteCred(cred: PlatformCredential): void {
    this.deleteTarget.set(cred);
  }
  cancelDeleteCred(): void {
    if (this.credBusyId()) return;
    this.deleteTarget.set(null);
  }
  confirmDeleteCred(): void {
    const cred = this.deleteTarget();
    if (!cred) return;
    this.credBusyId.set(cred.id);
    this.api.deleteCredential(cred.id).subscribe({
      next: () => {
        this.credentials.update((list) => list.filter((x) => x.id !== cred.id));
        this.credBusyId.set(null);
        this.deleteTarget.set(null);
        this.toast.success(this.c().deletedToast, cred.name);
      },
      error: () => {
        this.credBusyId.set(null);
        this.toast.error(this.c().saveErr, this.c().errorBody);
      },
    });
  }

  dismissNewSecret(): void {
    this.newSecret.set(null);
  }

  typeLabel(type: CredentialType): string {
    switch (type) {
      case 'WhatsAppAppSecret': return this.c().typeWhatsAppAppSecret;
      case 'AiProviderKey': return this.c().typeAiProviderKey;
      case 'WebhookSigning': return this.c().typeWebhookSigning;
      default: return this.c().typeOther;
    }
  }

  credInvalid(control: string): boolean {
    const ctl = this.credForm.get(control);
    return !!ctl && ctl.invalid && (ctl.touched || this.credSubmitted());
  }

  // ═══ Feature flags ═══
  loadFlags(): void {
    this.flagsLoading.set(true);
    this.flagsError.set(false);
    this.api.getFeatureFlags().subscribe({
      next: (list) => {
        this.flags.set(list ?? []);
        this.flagsLoading.set(false);
      },
      error: () => {
        this.flagsError.set(true);
        this.flagsLoading.set(false);
      },
    });
  }

  onFlagToggle(flag: FeatureFlag): void {
    // Global flags touching live tenants get a blast-radius confirm; else apply.
    if (flag.scope === 'Global' && flag.affectedTenants > 0) {
      this.flagConfirm.set(flag);
      return;
    }
    this.applyFlagToggle(flag);
  }
  cancelFlagConfirm(): void {
    if (this.flagBusyId()) return;
    this.flagConfirm.set(null);
  }
  confirmFlagToggle(): void {
    const flag = this.flagConfirm();
    if (!flag) return;
    this.applyFlagToggle(flag);
  }
  private applyFlagToggle(flag: FeatureFlag): void {
    this.flagBusyId.set(flag.id);
    const next = !flag.enabled;
    this.api.toggleFeatureFlag(flag.id, next).subscribe({
      next: (updated) => {
        this.flags.update((list) => list.map((f) => (f.id === flag.id ? updated : f)));
        this.flagBusyId.set(null);
        this.flagConfirm.set(null);
        this.toast.success(this.c().flagToast, updated.name);
      },
      error: () => {
        this.flagBusyId.set(null);
        this.flagConfirm.set(null);
        this.toast.error(this.c().saveErr, this.c().errorBody);
      },
    });
  }
  scopeLabel(scope: string): string {
    return scope === 'Tenant' ? this.c().scopeTenant : this.c().scopeGlobal;
  }

  // ═══ Policy ═══
  loadPolicy(): void {
    this.policyLoading.set(true);
    this.policyError.set(false);
    this.api.getPolicy().subscribe({
      next: (p) => {
        this.policyForm.reset({
          retentionDays: p.retentionDays,
          rateLimitPerMinute: p.rateLimitPerMinute,
          defaultRouting: p.defaultRouting,
          sessionMinutes: p.sessionMinutes,
          lockoutThreshold: p.lockoutThreshold,
          aiEnabledByDefault: p.aiEnabledByDefault,
        });
        this.policyLoading.set(false);
      },
      error: () => {
        this.policyError.set(true);
        this.policyLoading.set(false);
      },
    });
  }

  toggleAiDefault(): void {
    const ctl = this.policyForm.get('aiEnabledByDefault');
    ctl?.setValue(!ctl.value);
  }

  savePolicy(): void {
    if (this.policyForm.invalid) {
      this.policyForm.markAllAsTouched();
      return;
    }
    const raw = this.policyForm.getRawValue();
    const payload: PlatformPolicy = {
      retentionDays: Number(raw.retentionDays ?? 0),
      rateLimitPerMinute: Number(raw.rateLimitPerMinute ?? 0),
      defaultRouting: (raw.defaultRouting ?? 'RoundRobin') as DefaultRouting,
      sessionMinutes: Number(raw.sessionMinutes ?? 0),
      lockoutThreshold: Number(raw.lockoutThreshold ?? 0),
      aiEnabledByDefault: !!raw.aiEnabledByDefault,
    };
    this.policySaving.set(true);
    this.api.setPolicy(payload).subscribe({
      next: () => {
        this.policySaving.set(false);
        this.toast.success(this.c().policySaved, '');
      },
      error: () => {
        this.policySaving.set(false);
        this.toast.error(this.c().saveErr, this.c().errorBody);
      },
    });
  }

  policyInvalid(control: string): boolean {
    const ctl = this.policyForm.get(control);
    return !!ctl && ctl.invalid && ctl.touched;
  }
}
