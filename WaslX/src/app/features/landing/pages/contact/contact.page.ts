import { Component, computed, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { LanguageService } from '../../../../core/services/language.service';
import { LANDING_CONTENT } from '../../landing.content';
import { IconComponent } from '../../../../shared/components/icon/icon.component';
import { RevealDirective } from '../../directives/reveal.directive';
import { StaggerDirective } from '../../directives/stagger.directive';
import { TiltDirective } from '../../directives/tilt.directive';

@Component({
  selector: 'app-contact-page',
  standalone: true,
  imports: [ReactiveFormsModule, IconComponent, RevealDirective, StaggerDirective, TiltDirective],
  templateUrl: './contact.page.html',
  styleUrl: './contact.page.css',
})
export class ContactPageComponent {
  private readonly languageService = inject(LanguageService);
  private readonly formBuilder = inject(NonNullableFormBuilder);

  readonly c = computed(() => LANDING_CONTENT[this.languageService.language()]);
  readonly submitted = signal(false);

  readonly form = this.formBuilder.group({
    name: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    company: [''],
    message: ['', [Validators.required, Validators.minLength(10)]],
  });

  submit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;
    // No backend yet — simulate a successful send for the marketing form.
    this.submitted.set(true);
    this.form.reset();
  }

  invalid(control: 'name' | 'email' | 'message'): boolean {
    const c = this.form.controls[control];
    return c.invalid && (c.touched || c.dirty);
  }
}
