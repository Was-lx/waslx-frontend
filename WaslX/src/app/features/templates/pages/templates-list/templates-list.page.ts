import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DatePipe } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { LanguageService, type TranslationKey } from '../../../../core/services/language.service';
import { ToastService } from '../../../../core/services/toast.service';
import { TemplatesApiService } from '../../../../core/api/templates-api.service';
import { apiErrorMessage } from '../../../../core/utils/api-error';
import { IconComponent } from '../../../../shared/components/icon/icon.component';
import type { CreateTemplateButton, CreateTemplateInput, Template, TemplateCategory } from '../../models/template.model';

@Component({
  selector: 'app-templates-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, IconComponent, DatePipe],
  templateUrl: './templates-list.page.html',
  styleUrl: './templates-list.page.css'
})
export class TemplatesListPageComponent implements OnInit {
  private readonly api = inject(TemplatesApiService);
  private readonly fb = inject(FormBuilder);
  private readonly language = inject(LanguageService);
  private readonly toast = inject(ToastService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly templates = signal<Template[]>([]);
  protected readonly loading = signal(true);
  protected readonly error = signal(false);
  protected readonly modalOpen = signal(false);
  protected readonly submitting = signal(false);

  protected readonly form = this.fb.group({
    name: ['', [Validators.required, Validators.pattern(/^[a-z0-9_]+$/)]],
    category: ['UTILITY' as TemplateCategory, Validators.required],
    language: ['en', Validators.required],
    headerText: [''],
    bodyText: [''],
    footerText: [''],
    otpButtonText: ['Copy code'],
    allowCategoryChange: [true],
    buttons: this.fb.array<FormGroup>([])
  });

  protected readonly isAuth = signal(false);

  protected get buttons(): FormArray<FormGroup> {
    return this.form.get('buttons') as FormArray<FormGroup>;
  }

  protected t = (key: TranslationKey): string => this.language.text(key);
  protected direction = (): 'rtl' | 'ltr' => this.language.getDirection();

  ngOnInit(): void {
    this.load();
    this.form.get('category')!.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((c) => this.isAuth.set(c === 'AUTHENTICATION'));
  }

  private load(): void {
    this.loading.set(true);
    this.error.set(false);
    this.api.list().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (list) => { this.templates.set(list); this.loading.set(false); },
      error: () => { this.error.set(true); this.loading.set(false); }
    });
  }

  protected openCreate(): void {
    this.form.reset({ name: '', category: 'UTILITY', language: 'en', headerText: '', bodyText: '', footerText: '', otpButtonText: 'Copy code', allowCategoryChange: true });
    this.buttons.clear();
    this.isAuth.set(false);
    this.modalOpen.set(true);
  }

  protected closeModal(): void {
    if (!this.submitting()) this.modalOpen.set(false);
  }

  protected addButton(): void {
    this.buttons.push(this.fb.group({
      type: ['QUICK_REPLY', Validators.required],
      text: ['', Validators.required],
      url: ['']
    }));
  }

  protected removeButton(index: number): void {
    this.buttons.removeAt(index);
  }

  protected submit(): void {
    const category = this.form.value.category as TemplateCategory;
    // Body is required for every category except Authentication (Meta generates that body).
    if (this.form.get('name')!.invalid || (category !== 'AUTHENTICATION' && !this.form.value.bodyText?.trim())) {
      this.form.markAllAsTouched();
      return;
    }

    const buttons: CreateTemplateButton[] = category === 'AUTHENTICATION'
      ? [{ type: 'QUICK_REPLY', text: this.form.value.otpButtonText?.trim() || 'Copy code' }]
      : this.buttons.controls
          .map((g) => g.value as { type: 'QUICK_REPLY' | 'URL'; text: string; url?: string })
          .filter((b) => b.text?.trim())
          .map((b) => ({ type: b.type, text: b.text.trim(), url: b.type === 'URL' ? (b.url ?? '').trim() : null }));

    const input: CreateTemplateInput = {
      name: (this.form.value.name ?? '').trim(),
      category,
      language: this.form.value.language ?? 'en',
      headerText: category === 'AUTHENTICATION' ? null : (this.form.value.headerText?.trim() || null),
      bodyText: category === 'AUTHENTICATION' ? null : (this.form.value.bodyText?.trim() || null),
      footerText: category === 'AUTHENTICATION' ? null : (this.form.value.footerText?.trim() || null),
      buttons,
      allowCategoryChange: this.form.value.allowCategoryChange ?? true
    };

    this.submitting.set(true);
    this.api.create(input).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => {
        this.submitting.set(false);
        this.modalOpen.set(false);
        this.toast.success(this.t('templateCreated'), '');
        this.load();
      },
      error: (err) => {
        this.submitting.set(false);
        this.toast.error(this.t('templateCreateError'), apiErrorMessage(err, this.t('templateCreateError')));
      }
    });
  }

  protected categoryLabel(category: string): string {
    switch (category?.toUpperCase()) {
      case 'MARKETING': return this.t('templateCategoryMarketing');
      case 'AUTHENTICATION': return this.t('templateCategoryAuthentication');
      default: return this.t('templateCategoryUtility');
    }
  }

  protected statusClass = (status: string): string => `tmpl-badge tmpl-badge--${(status || '').toLowerCase()}`;
}
