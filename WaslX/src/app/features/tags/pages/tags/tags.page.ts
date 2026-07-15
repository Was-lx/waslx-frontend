import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { type TranslationKey, LanguageService } from '../../../../core/services/language.service';
import { ToastService } from '../../../../core/services/toast.service';
import { Tag, TagsApiService, UpsertTagRequest } from '../../../../core/api/tags-api.service';
import { apiErrorMessage } from '../../../../core/utils/api-error';
import { IconComponent } from '../../../../shared/components/icon/icon.component';
import { TagChipComponent } from '../../../../shared/components/tag-chip/tag-chip.component';

/** Curated preset palette — reads well against both light and dark surfaces. */
const PRESET_COLORS = [
  '#2563eb', '#8b5cf6', '#0ea5e9', '#06b6d4', '#10b981',
  '#f59e0b', '#f97316', '#ef4444', '#ec4899', '#64748b',
] as const;

const DEFAULT_COLOR = PRESET_COLORS[0];

@Component({
  selector: 'app-tags-page',
  standalone: true,
  imports: [FormsModule, IconComponent, TagChipComponent],
  template: `
    <section class="feature-page tags" [attr.dir]="direction()">
      <header class="feature-page__header">
        <div class="tags__lead">
          <span class="feature-page__eyebrow">{{ t('tgEyebrow') }}</span>
          <h1>{{ t('tgTitle') }}</h1>
          <p class="tags__lead-text">{{ t('tgLead') }}</p>
        </div>
        <div class="feature-page__actions">
          <label class="feature-page__search">
            <app-icon name="search" [size]="17" />
            <input
              type="text"
              [value]="search()"
              (input)="search.set($any($event.target).value)"
              [placeholder]="t('tgSearch')"
            />
          </label>
          <button class="feature-page__btn" type="button" (click)="openCreate()">
            <app-icon name="tag" [size]="17" /> {{ t('tgNew') }}
          </button>
        </div>
      </header>

      @if (loading()) {
        <div class="feature-page__empty tags__state">
          <div class="ui-spinner"></div>
          <p>{{ t('tgLoading') }}</p>
        </div>
      } @else if (error()) {
        <div class="feature-page__empty">
          <app-icon name="tag" [size]="26" />
          <h3>{{ t('tgErrorTitle') }}</h3>
          <button class="ui-btn ui-btn--ghost ui-btn--sm" type="button" (click)="loadTags()">{{ t('tgRetry') }}</button>
        </div>
      } @else if (tags().length === 0) {
        <div class="feature-page__empty">
          <app-icon name="tag" [size]="26" />
          <h3>{{ t('tgEmptyTitle') }}</h3>
          <p>{{ t('tgEmptyDesc') }}</p>
          <button class="ui-btn ui-btn--primary ui-btn--sm tags__empty-cta" type="button" (click)="openCreate()">
            <app-icon name="tag" [size]="15" /> {{ t('tgEmptyCta') }}
          </button>
        </div>
      } @else if (filteredTags().length === 0) {
        <div class="feature-page__empty">
          <app-icon name="search" [size]="26" />
          <h3>{{ t('tgNoResults') }}</h3>
        </div>
      } @else {
        <div class="tags__meta">
          <span class="ui-sectiontitle">{{ filteredTags().length }} {{ t('tgCount') }}</span>
        </div>
        <div class="tags__grid">
          @for (tag of filteredTags(); track tag.id) {
            <article class="tags-card" [style.--tc]="tag.color || 'var(--primary)'">
              <span class="tags-card__bar" aria-hidden="true"></span>
              <div class="tags-card__head">
                <app-tag-chip [name]="tag.name" [color]="tag.color" />
                <div class="tags-card__actions">
                  <button type="button" class="tags-card__act" [attr.aria-label]="t('tgEdit')" (click)="openEdit(tag)">
                    <app-icon name="settings" [size]="15" />
                  </button>
                  <button type="button" class="tags-card__act tags-card__act--danger" [attr.aria-label]="t('tgDelete')" (click)="requestDelete(tag)">
                    <app-icon name="trash" [size]="15" />
                  </button>
                </div>
              </div>
              <p class="tags-card__desc" [class.tags-card__desc--muted]="!tag.description">
                {{ tag.description || t('tgNoDescription') }}
              </p>
              <div class="tags-card__foot">
                <span class="tags-card__swatch" aria-hidden="true"></span>
                <span class="tags-card__hex">{{ tag.color }}</span>
              </div>
            </article>
          }
        </div>
      }
    </section>

    <!-- ── Create / edit modal ── -->
    @if (editorOpen()) {
      <div class="ui-overlay" (click)="closeEditor()">
        <div class="ui-modal tags-modal" [attr.dir]="direction()" (click)="$event.stopPropagation()">
          <div class="ui-modal__head">
            <div>
              <h2 class="ui-modal__title">{{ editing() ? t('tgEditTitle') : t('tgCreateTitle') }}</h2>
              <p class="ui-modal__sub">{{ editing() ? t('tgEditSub') : t('tgCreateSub') }}</p>
            </div>
            <button type="button" class="ui-modal__close" [attr.aria-label]="t('tgCancel')" (click)="closeEditor()">
              <app-icon name="x" [size]="18" />
            </button>
          </div>

          <div class="ui-modal__body tags-modal__body">
            <!-- Live preview -->
            <div class="tags-modal__preview">
              <span class="ui-sectiontitle">{{ t('tgPreview') }}</span>
              <app-tag-chip [name]="form.name.trim() || t('tgPreviewSample')" [color]="form.color" />
            </div>

            <div class="ui-field">
              <label class="ui-label" for="tg-name">{{ t('tgName') }}</label>
              <input
                id="tg-name"
                class="ui-input"
                type="text"
                [(ngModel)]="form.name"
                (ngModelChange)="formError.set(null)"
                [placeholder]="t('tgNamePlaceholder')"
                maxlength="40"
                autocomplete="off"
              />
              @if (formError()) {
                <span class="ui-error">{{ formError() }}</span>
              }
            </div>

            <div class="ui-field">
              <span class="ui-label">{{ t('tgColor') }}</span>
              <div class="tags-swatches">
                @for (preset of presets; track preset) {
                  <button
                    type="button"
                    class="tags-swatch"
                    [class.is-active]="isSelected(preset)"
                    [style.--sw]="preset"
                    [style.background]="preset"
                    [attr.aria-label]="preset"
                    [attr.aria-pressed]="isSelected(preset)"
                    (click)="form.color = preset"
                  >
                    @if (isSelected(preset)) {
                      <app-icon name="check" [size]="14" />
                    }
                  </button>
                }
                <label class="tags-swatch tags-swatch--custom" [style.--sw]="form.color" [attr.title]="t('tgCustomColor')">
                  <app-icon name="sliders" [size]="14" />
                  <input type="color" [(ngModel)]="form.color" [attr.aria-label]="t('tgCustomColor')" />
                </label>
              </div>
              <span class="tags-modal__hint">{{ t('tgColorHint') }}</span>
            </div>

            <div class="ui-field">
              <label class="ui-label" for="tg-desc">{{ t('tgDescription') }}</label>
              <textarea
                id="tg-desc"
                class="ui-textarea"
                [(ngModel)]="form.description"
                [placeholder]="t('tgDescriptionPlaceholder')"
                maxlength="160"
                rows="3"
              ></textarea>
            </div>
          </div>

          <div class="ui-modal__foot">
            <button type="button" class="ui-btn ui-btn--ghost" (click)="closeEditor()">{{ t('tgCancel') }}</button>
            <button type="button" class="ui-btn ui-btn--primary" [disabled]="saving()" (click)="save()">
              @if (saving()) { <span class="ui-spinner tags-modal__btn-spin"></span> {{ t('tgSaving') }} }
              @else { {{ t('tgSave') }} }
            </button>
          </div>
        </div>
      </div>
    }

    <!-- ── Delete confirm ── -->
    @if (pendingDelete(); as pending) {
      <div class="ui-overlay" (click)="cancelDelete()">
        <div class="ui-modal ui-confirm" [attr.dir]="direction()" (click)="$event.stopPropagation()">
          <div class="ui-confirm__icon">
            <svg viewBox="0 0 24 24"><path d="M3 6h18" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><line x1="10" x2="10" y1="11" y2="17" /><line x1="14" x2="14" y1="11" y2="17" /></svg>
          </div>
          <div class="tags-confirm__who">
            <app-tag-chip [name]="pending.name" [color]="pending.color" />
          </div>
          <h3>{{ t('tgDeleteTitle') }}</h3>
          <p>{{ t('tgDeleteBody') }}</p>
          <div class="ui-confirm__actions">
            <button type="button" class="ui-btn ui-btn--ghost" (click)="cancelDelete()">{{ t('tgCancel') }}</button>
            <button type="button" class="ui-btn ui-btn--danger" [disabled]="deleting()" (click)="confirmDelete()">
              {{ t('tgConfirmDelete') }}
            </button>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    :host { display: block; }
    .tags__lead-text { margin: 8px 0 0; color: var(--text-secondary); font-size: 0.95rem; max-width: 58ch; }
    .tags__state { min-height: 220px; }
    .tags__empty-cta { margin-top: 6px; }
    .tags__empty-cta svg { fill: none; stroke: currentColor; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
    .tags__meta { margin-bottom: -6px; }

    /* ── Tag grid ── */
    .tags__grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(248px, 1fr));
      gap: 16px;
    }
    .tags-card {
      position: relative;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      gap: 12px;
      padding: 18px 18px 16px;
      border: 1px solid var(--border-subtle);
      border-radius: 16px;
      background: var(--surface);
      box-shadow: var(--shadow-card);
      transition: transform 180ms var(--ease-out, ease), box-shadow 180ms ease, border-color 180ms ease;
    }
    .tags-card__bar {
      position: absolute; inset-inline: 0; inset-block-start: 0; block-size: 3px;
      background: linear-gradient(90deg, var(--tc), color-mix(in srgb, var(--tc) 40%, transparent));
      opacity: 0.9;
    }
    .tags-card:hover {
      transform: translateY(-3px);
      box-shadow: var(--shadow-md);
      border-color: color-mix(in srgb, var(--tc) 34%, var(--border-subtle));
    }
    .tags-card__head { display: flex; align-items: flex-start; justify-content: space-between; gap: 10px; }
    .tags-card__actions { display: inline-flex; gap: 4px; flex: 0 0 auto; opacity: 0.55; transition: opacity 160ms ease; }
    .tags-card:hover .tags-card__actions { opacity: 1; }
    .tags-card__act {
      display: grid; place-items: center; width: 30px; height: 30px;
      border: 1px solid var(--border-subtle); border-radius: 9px;
      background: var(--surface); color: var(--text-muted); cursor: pointer;
      transition: color 150ms ease, border-color 150ms ease, background-color 150ms ease;
    }
    .tags-card__act:hover { color: var(--primary); border-color: color-mix(in srgb, var(--primary) 34%, var(--border-subtle)); background: var(--surface-soft); }
    .tags-card__act--danger:hover { color: var(--danger); border-color: color-mix(in srgb, var(--danger) 34%, var(--border-subtle)); background: color-mix(in srgb, var(--danger) 8%, var(--surface)); }
    .tags-card__act svg { fill: none; stroke: currentColor; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
    .tags-card__desc { margin: 0; font-size: 0.86rem; line-height: 1.55; color: var(--text-secondary); flex: 1 1 auto; }
    .tags-card__desc--muted { color: var(--text-muted); font-style: italic; }
    .tags-card__foot { display: inline-flex; align-items: center; gap: 7px; }
    .tags-card__swatch { width: 12px; height: 12px; border-radius: 4px; background: var(--tc); box-shadow: 0 0 0 1px color-mix(in srgb, var(--tc) 30%, transparent); flex: 0 0 auto; }
    .tags-card__hex { font-size: 0.76rem; font-weight: 600; letter-spacing: 0.02em; color: var(--text-muted); text-transform: uppercase; font-variant-numeric: tabular-nums; }

    /* ── Modal ── */
    .tags-modal { width: min(500px, 100%); }
    .tags-modal__body { display: flex; flex-direction: column; gap: 18px; }
    .tags-modal__preview {
      display: flex; align-items: center; gap: 14px; flex-wrap: wrap;
      padding: 14px 16px; border-radius: 13px;
      border: 1px dashed var(--border-subtle);
      background:
        radial-gradient(circle at 12% 20%, color-mix(in srgb, var(--primary) 5%, transparent), transparent 55%),
        var(--surface-soft);
    }
    .tags-modal__preview .ui-sectiontitle { flex: 0 0 auto; }
    .tags-modal__hint { font-size: 0.78rem; color: var(--text-muted); }

    .tags-swatches { display: flex; flex-wrap: wrap; gap: 9px; }
    .tags-swatch {
      position: relative;
      display: grid; place-items: center;
      width: 34px; height: 34px;
      border: 0; border-radius: 10px;
      cursor: pointer;
      color: #fff;
      box-shadow: 0 1px 0 rgb(255 255 255 / 0.25) inset, 0 2px 6px color-mix(in srgb, var(--sw, var(--primary)) 40%, transparent);
      transition: transform 140ms var(--ease-out, ease), box-shadow 140ms ease;
    }
    .tags-swatch::after {
      content: ''; position: absolute; inset: -3px; border-radius: 13px;
      border: 2px solid transparent; transition: border-color 140ms ease;
    }
    .tags-swatch:hover { transform: translateY(-2px); }
    .tags-swatch.is-active::after { border-color: color-mix(in srgb, var(--sw, var(--primary)) 55%, var(--text-primary)); }
    .tags-swatch svg { fill: none; stroke: currentColor; stroke-width: 3; stroke-linecap: round; stroke-linejoin: round; filter: drop-shadow(0 1px 1px rgb(0 0 0 / 0.3)); }
    .tags-swatch--custom {
      color: var(--text-secondary);
      background: var(--surface);
      border: 1px dashed var(--border-strong, var(--border-subtle));
      box-shadow: none;
      overflow: hidden;
    }
    .tags-swatch--custom { background: color-mix(in srgb, var(--sw, var(--primary)) 16%, var(--surface)); color: color-mix(in srgb, var(--sw, var(--primary)) 62%, var(--text-primary)); }
    .tags-swatch--custom input[type='color'] {
      position: absolute; inset: 0; width: 100%; height: 100%;
      opacity: 0; cursor: pointer; border: 0; padding: 0;
    }
    .tags-modal__btn-spin { width: 16px; height: 16px; border-width: 2px; }

    .tags-confirm__who { display: flex; justify-content: center; margin-bottom: 12px; }

    @media (max-width: 600px) {
      .tags__grid { grid-template-columns: 1fr; }
    }
    @media (prefers-reduced-motion: reduce) {
      .tags-card, .tags-swatch { transition: none; }
      .tags-card:hover, .tags-swatch:hover { transform: none; }
    }
  `],
})
export class TagsPageComponent implements OnInit {
  private readonly languageService = inject(LanguageService);
  private readonly tagsApi = inject(TagsApiService);
  private readonly toast = inject(ToastService);

  readonly t = (key: TranslationKey) => this.languageService.text(key);
  readonly direction = () => this.languageService.getDirection();

  readonly presets = PRESET_COLORS;

  readonly tags = signal<Tag[]>([]);
  readonly loading = signal(true);
  readonly error = signal(false);
  readonly search = signal('');

  readonly filteredTags = computed(() => {
    const term = this.search().trim().toLowerCase();
    if (!term) {
      return this.tags();
    }
    return this.tags().filter(
      (tag) =>
        tag.name.toLowerCase().includes(term) ||
        (tag.description ?? '').toLowerCase().includes(term)
    );
  });

  // ─── Editor (create / edit) ────────────────────────────────────────────────
  readonly editorOpen = signal(false);
  readonly editing = signal<Tag | null>(null);
  readonly saving = signal(false);
  readonly formError = signal<string | null>(null);
  form: { name: string; color: string; description: string } = { name: '', color: DEFAULT_COLOR, description: '' };

  // ─── Delete ────────────────────────────────────────────────────────────────
  readonly pendingDelete = signal<Tag | null>(null);
  readonly deleting = signal(false);

  ngOnInit(): void {
    this.loadTags();
  }

  loadTags(): void {
    this.loading.set(true);
    this.error.set(false);
    this.tagsApi.getTags().subscribe({
      next: (data) => {
        this.tags.set(data ?? []);
        this.loading.set(false);
      },
      error: () => {
        this.error.set(true);
        this.loading.set(false);
      },
    });
  }

  isSelected(color: string): boolean {
    return this.form.color.toLowerCase() === color.toLowerCase();
  }

  openCreate(): void {
    this.editing.set(null);
    this.form = { name: '', color: DEFAULT_COLOR, description: '' };
    this.formError.set(null);
    this.editorOpen.set(true);
  }

  openEdit(tag: Tag): void {
    this.editing.set(tag);
    this.form = { name: tag.name, color: tag.color || DEFAULT_COLOR, description: tag.description ?? '' };
    this.formError.set(null);
    this.editorOpen.set(true);
  }

  closeEditor(): void {
    if (this.saving()) {
      return;
    }
    this.editorOpen.set(false);
  }

  save(): void {
    const name = this.form.name.trim();
    if (!name) {
      this.formError.set(this.t('tgNameRequired'));
      return;
    }

    const payload: UpsertTagRequest = {
      name,
      color: this.form.color,
      description: this.form.description.trim() || null,
    };

    this.saving.set(true);
    const editing = this.editing();
    const request$ = editing
      ? this.tagsApi.updateTag(editing.id, payload)
      : this.tagsApi.createTag(payload);

    request$.subscribe({
      next: (saved) => {
        if (editing) {
          this.tags.update((list) => list.map((tag) => (tag.id === saved.id ? saved : tag)));
        } else {
          this.tags.update((list) => [saved, ...list]);
        }
        this.saving.set(false);
        this.editorOpen.set(false);
        this.toast.success(editing ? this.t('tgUpdatedToast') : this.t('tgCreatedToast'), '');
      },
      error: (err) => {
        this.saving.set(false);
        this.toast.error(this.t('tgErrorToast'), apiErrorMessage(err, this.t('tgErrorToast')));
      },
    });
  }

  requestDelete(tag: Tag): void {
    this.pendingDelete.set(tag);
  }

  cancelDelete(): void {
    if (this.deleting()) {
      return;
    }
    this.pendingDelete.set(null);
  }

  confirmDelete(): void {
    const tag = this.pendingDelete();
    if (!tag) {
      return;
    }
    this.deleting.set(true);
    this.tagsApi.deleteTag(tag.id).subscribe({
      next: () => {
        this.tags.update((list) => list.filter((item) => item.id !== tag.id));
        this.deleting.set(false);
        this.pendingDelete.set(null);
        this.toast.success(this.t('tgDeletedToast'), '');
      },
      error: (err) => {
        this.deleting.set(false);
        this.pendingDelete.set(null);
        this.toast.error(this.t('tgErrorToast'), apiErrorMessage(err, this.t('tgErrorToast')));
      },
    });
  }
}
