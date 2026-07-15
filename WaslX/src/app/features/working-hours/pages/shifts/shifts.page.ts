import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { type TranslationKey, LanguageService } from '../../../../core/services/language.service';
import { ToastService } from '../../../../core/services/toast.service';
import {
  type DayOfWeek,
  type Shift,
  type ShiftDay,
  type UpsertShiftRequest,
  WorkingHoursApiService,
} from '../../../../core/api/working-hours-api.service';
import { apiErrorMessage } from '../../../../core/utils/api-error';
import { IconComponent } from '../../../../shared/components/icon/icon.component';

const DAY_ORDER: DayOfWeek[] = [0, 1, 2, 3, 4, 5, 6];
const DEFAULT_START = '09:00';
const DEFAULT_END = '17:00';

interface CompanyWindow {
  start: string | null;
  end: string | null;
}

interface EditorDay {
  dayOfWeek: DayOfWeek;
  isCompanyDay: boolean;
  companyStart: string | null;
  companyEnd: string | null;
  selected: boolean;
  start: string;
  end: string;
}

@Component({
  selector: 'app-shifts-page',
  standalone: true,
  imports: [FormsModule, RouterLink, RouterLinkActive, IconComponent],
  template: `
    <section class="feature-page wh" [attr.dir]="direction()">
      <header class="feature-page__header">
        <div class="wh__lead">
          <span class="feature-page__eyebrow">{{ t('whShEyebrow') }}</span>
          <h1>{{ t('whShTitle') }}</h1>
          <p class="wh__lead-text">{{ t('whShLead') }}</p>
        </div>
        <div class="wh__head-side">
          <nav class="feature-page__tabs" aria-label="Working hours">
            <a
              class="feature-page__tab"
              routerLink="/app/working-hours"
              routerLinkActive="feature-page__tab--active"
              [routerLinkActiveOptions]="{ exact: true }"
            >{{ t('whTabCompany') }}</a>
            <a
              class="feature-page__tab"
              routerLink="/app/working-hours/shifts"
              routerLinkActive="feature-page__tab--active"
            >{{ t('whTabShifts') }}</a>
          </nav>
          @if (!loading() && !error()) {
            <button class="feature-page__btn" type="button" (click)="openCreate()">
              <app-icon name="clock" [size]="17" /> {{ t('whShNew') }}
            </button>
          }
        </div>
      </header>

      @if (loading()) {
        <div class="feature-page__empty wh__state">
          <div class="ui-spinner"></div>
          <p>{{ t('whLoading') }}</p>
        </div>
      } @else if (error()) {
        <div class="feature-page__empty">
          <app-icon name="clock" [size]="26" />
          <h3>{{ t('whErrorTitle') }}</h3>
          <button class="ui-btn ui-btn--ghost ui-btn--sm" type="button" (click)="load()">{{ t('whRetry') }}</button>
        </div>
      } @else if (shifts().length === 0) {
        <div class="feature-page__empty">
          <app-icon name="clock" [size]="26" />
          <h3>{{ t('whShEmptyTitle') }}</h3>
          <p>{{ t('whShEmptyDesc') }}</p>
          <button class="ui-btn ui-btn--primary ui-btn--sm wh__empty-cta" type="button" (click)="openCreate()">
            <app-icon name="clock" [size]="15" /> {{ t('whShEmptyCta') }}
          </button>
        </div>
      } @else {
        <div class="wh-shifts">
          @for (shift of shifts(); track shift.id) {
            <article class="wh-shift">
              <div class="wh-shift__top">
                <div class="wh-shift__head">
                  <span class="wh-shift__ic"><app-icon name="clock" [size]="17" /></span>
                  <div>
                    <h3 class="wh-shift__name">{{ shift.name }}</h3>
                    <span class="wh-shift__meta">
                      {{ shift.days.length }} {{ t('whShDaysCount') }} · {{ shift.agentCount }} {{ t('whShAgents') }}
                    </span>
                  </div>
                </div>
                <div class="wh-shift__actions">
                  <button type="button" class="wh-shift__act" [attr.aria-label]="t('whShEdit')" (click)="openEdit(shift)">
                    <app-icon name="settings" [size]="15" />
                  </button>
                  <button type="button" class="wh-shift__act wh-shift__act--danger" [attr.aria-label]="t('whShDelete')" (click)="requestDelete(shift)">
                    <app-icon name="trash" [size]="15" />
                  </button>
                </div>
              </div>

              <div class="wh-shift__week" aria-hidden="true">
                @for (day of dayOrder; track day) {
                  <span class="wh-cov" [class.is-on]="coversDay(shift, day)">{{ shortDay(day).charAt(0) }}</span>
                }
              </div>

              @if (shift.days.length === 0) {
                <p class="wh-shift__empty">{{ t('whShNoDays') }}</p>
              } @else {
                <div class="wh-shift__days">
                  @for (d of sortedDays(shift.days); track d.dayOfWeek) {
                    <span class="wh-chip">
                      <strong>{{ shortDay(d.dayOfWeek) }}</strong>
                      <span>{{ d.startTime }}–{{ d.endTime }}</span>
                    </span>
                  }
                </div>
              }
            </article>
          }
        </div>
      }
    </section>

    <!-- ── Create / edit shift ── -->
    @if (editorOpen()) {
      <div class="ui-overlay" (click)="closeEditor()">
        <div class="ui-modal ui-modal--lg wh-modal" [attr.dir]="direction()" (click)="$event.stopPropagation()">
          <div class="ui-modal__head">
            <div>
              <h2 class="ui-modal__title">{{ editingId() ? t('whShEditTitle') : t('whShCreateTitle') }}</h2>
              <p class="ui-modal__sub">{{ editingId() ? t('whShEditSub') : t('whShCreateSub') }}</p>
            </div>
            <button type="button" class="ui-modal__close" [attr.aria-label]="t('whCancel')" (click)="closeEditor()">
              <app-icon name="x" [size]="18" />
            </button>
          </div>

          <div class="ui-modal__body wh-modal__body">
            <div class="ui-field">
              <label class="ui-label" for="wh-sh-name">{{ t('whShName') }}</label>
              <input
                id="wh-sh-name"
                class="ui-input"
                type="text"
                [(ngModel)]="formName"
                (ngModelChange)="formError.set(null)"
                [placeholder]="t('whShNamePlaceholder')"
                maxlength="60"
                autocomplete="off"
              />
            </div>

            @if (editorDays().length === 0) {
              <div class="wh-modal__notice">
                <app-icon name="help-circle" [size]="17" />
                <span>{{ t('whShNoCompanyDays') }}</span>
              </div>
            } @else {
              <div class="ui-field">
                <span class="ui-label">{{ t('whShMode') }}</span>
                <div class="ui-seg wh-modal__seg">
                  <button type="button" class="ui-seg__btn" [class.is-active]="mode() === 'same'" (click)="mode.set('same')">
                    {{ t('whShModeSame') }}
                  </button>
                  <button type="button" class="ui-seg__btn" [class.is-active]="mode() === 'perday'" (click)="mode.set('perday')">
                    {{ t('whShModePerDay') }}
                  </button>
                </div>
              </div>

              @if (mode() === 'same') {
                <div class="ui-field">
                  <label class="ui-label">{{ t('whShSameHours') }}</label>
                  <div class="wh-modal__same">
                    <label class="wh-time">
                      <span>{{ t('whFrom') }}</span>
                      <input type="time" class="ui-input" [(ngModel)]="sameStart" (ngModelChange)="formError.set(null)" />
                    </label>
                    <span class="wh-day__dash" aria-hidden="true">–</span>
                    <label class="wh-time">
                      <span>{{ t('whTo') }}</span>
                      <input type="time" class="ui-input" [(ngModel)]="sameEnd" (ngModelChange)="formError.set(null)" />
                    </label>
                  </div>
                  <span class="wh-modal__hint">{{ t('whShSameHint') }}</span>
                </div>
              }

              <div class="ui-field">
                <span class="ui-label">{{ t('whShDays') }}</span>
                <ul class="wh-days">
                  @for (row of editorDays(); track row.dayOfWeek) {
                    <li class="wh-day" [class.wh-day--on]="row.selected">
                      <div class="wh-day__label">
                        <button
                          type="button"
                          class="ui-toggle"
                          [class.is-on]="row.selected"
                          [attr.aria-checked]="row.selected"
                          role="switch"
                          [attr.aria-label]="dayName(row.dayOfWeek)"
                          (click)="toggleDay(row.dayOfWeek)"
                        ></button>
                        <div class="wh-day__name">
                          <span>{{ dayName(row.dayOfWeek) }}</span>
                          @if (row.isCompanyDay && row.companyStart && row.companyEnd) {
                            <small>{{ t('whShWithin') }} {{ row.companyStart }}–{{ row.companyEnd }}</small>
                          }
                        </div>
                      </div>

                      @if (row.selected && mode() === 'perday') {
                        <div class="wh-day__times">
                          <label class="wh-time">
                            <span>{{ t('whFrom') }}</span>
                            <input type="time" class="ui-input" [(ngModel)]="row.start" (ngModelChange)="formError.set(null)" />
                          </label>
                          <span class="wh-day__dash" aria-hidden="true">–</span>
                          <label class="wh-time">
                            <span>{{ t('whTo') }}</span>
                            <input type="time" class="ui-input" [(ngModel)]="row.end" (ngModelChange)="formError.set(null)" />
                          </label>
                        </div>
                      }
                    </li>
                  }
                </ul>
                <span class="wh-modal__hint">{{ t('whShDaysHint') }}</span>
              </div>
            }

            @if (formError()) {
              <span class="ui-error">{{ formError() }}</span>
            }
          </div>

          <div class="ui-modal__foot">
            <button type="button" class="ui-btn ui-btn--ghost" (click)="closeEditor()">{{ t('whCancel') }}</button>
            <button type="button" class="ui-btn ui-btn--primary" [disabled]="saving() || editorDays().length === 0" (click)="save()">
              @if (saving()) { <span class="ui-spinner wh__btn-spin"></span> {{ t('whSaving') }} }
              @else { {{ t('whShSave') }} }
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
          <h3>{{ t('whShDeleteTitle') }}</h3>
          <p>{{ t('whShDeleteBody') }}</p>
          <div class="ui-confirm__actions">
            <button type="button" class="ui-btn ui-btn--ghost" (click)="cancelDelete()">{{ t('whCancel') }}</button>
            <button type="button" class="ui-btn ui-btn--danger" [disabled]="deleting()" (click)="confirmDelete()">
              {{ t('whShConfirmDelete') }}
            </button>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    :host { display: block; }
    .wh__lead-text { margin: 8px 0 0; color: var(--text-secondary); font-size: 0.95rem; max-width: 60ch; }
    .wh__state { min-height: 220px; }
    .wh__btn-spin { width: 16px; height: 16px; border-width: 2px; }
    .wh__empty-cta { margin-top: 6px; }
    .wh__head-side { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }

    /* ── Shift cards ── */
    .wh-shifts { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 16px; }
    .wh-shift {
      display: flex; flex-direction: column; gap: 14px;
      padding: 18px; border: 1px solid var(--border-subtle); border-radius: 16px;
      background: var(--surface); box-shadow: var(--shadow-card);
      transition: transform 180ms var(--ease-out, ease), box-shadow 180ms ease, border-color 180ms ease;
    }
    .wh-shift:hover { transform: translateY(-3px); box-shadow: var(--shadow-md); border-color: color-mix(in srgb, var(--primary) 26%, var(--border-subtle)); }
    .wh-shift__top { display: flex; align-items: flex-start; justify-content: space-between; gap: 10px; }
    .wh-shift__head { display: inline-flex; align-items: center; gap: 11px; }
    .wh-shift__ic {
      display: grid; place-items: center; width: 36px; height: 36px; flex: 0 0 auto;
      border-radius: 10px; color: var(--primary);
      background: color-mix(in srgb, var(--primary) 12%, var(--surface));
      box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--primary) 20%, transparent);
    }
    .wh-shift__ic svg { fill: none; stroke: currentColor; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
    .wh-shift__name { margin: 0; font-size: 1rem; font-weight: 700; color: var(--text-primary); }
    .wh-shift__meta { font-size: 0.8rem; color: var(--text-muted); }
    .wh-shift__actions { display: inline-flex; gap: 4px; flex: 0 0 auto; opacity: 0.55; transition: opacity 160ms ease; }
    .wh-shift:hover .wh-shift__actions { opacity: 1; }
    .wh-shift__act {
      display: grid; place-items: center; width: 30px; height: 30px;
      border: 1px solid var(--border-subtle); border-radius: 9px;
      background: var(--surface); color: var(--text-muted); cursor: pointer;
      transition: color 150ms ease, border-color 150ms ease, background-color 150ms ease;
    }
    .wh-shift__act:hover { color: var(--primary); border-color: color-mix(in srgb, var(--primary) 34%, var(--border-subtle)); background: var(--surface-soft); }
    .wh-shift__act--danger:hover { color: var(--danger); border-color: color-mix(in srgb, var(--danger) 34%, var(--border-subtle)); background: color-mix(in srgb, var(--danger) 8%, var(--surface)); }
    .wh-shift__act svg { fill: none; stroke: currentColor; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
    .wh-shift__empty { margin: 0; font-size: 0.85rem; color: var(--text-muted); font-style: italic; }
    /* 7-day coverage strip — which weekdays this shift runs, at a glance. */
    .wh-shift__week { display: grid; grid-template-columns: repeat(7, 1fr); gap: 5px; }
    .wh-cov {
      height: 26px; display: grid; place-items: center;
      border-radius: 8px; border: 1px solid var(--border-subtle); background: var(--surface-soft);
      font-size: 0.62rem; font-weight: 800; text-transform: uppercase; color: var(--text-muted);
      transition: background-color 150ms ease, color 150ms ease, border-color 150ms ease;
    }
    .wh-cov.is-on {
      color: var(--primary);
      background: color-mix(in srgb, var(--primary) 12%, var(--surface));
      border-color: color-mix(in srgb, var(--primary) 34%, var(--border-subtle));
    }
    .wh-shift__days { display: flex; flex-wrap: wrap; gap: 7px; }
    .wh-chip {
      display: inline-flex; align-items: center; gap: 6px;
      padding: 5px 10px; border-radius: 9px;
      background: var(--surface-soft); border: 1px solid var(--border-subtle);
      font-size: 0.76rem; color: var(--text-secondary); font-variant-numeric: tabular-nums;
    }
    .wh-chip strong { color: var(--text-primary); font-weight: 700; }

    /* ── Day rows (shared with editor) ── */
    .wh-days { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 8px; }
    .wh-day {
      display: flex; align-items: center; justify-content: space-between; gap: 14px; flex-wrap: wrap;
      padding: 11px 13px; border-radius: 12px;
      border: 1px solid var(--border-subtle); background: var(--surface-soft);
      transition: border-color 160ms ease, background-color 160ms ease;
    }
    .wh-day--on { border-color: color-mix(in srgb, var(--primary) 26%, var(--border-subtle)); background: var(--surface); }
    .wh-day__label { display: inline-flex; align-items: center; gap: 12px; min-width: 168px; }
    .wh-day__name { display: flex; flex-direction: column; line-height: 1.25; }
    .wh-day__name span { font-weight: 600; color: var(--text-primary); font-size: 0.9rem; }
    .wh-day__name small { color: var(--text-muted); font-size: 0.72rem; font-variant-numeric: tabular-nums; }
    .wh-day__times { display: inline-flex; align-items: flex-end; gap: 10px; }
    .wh-day__dash { color: var(--text-muted); padding-bottom: 10px; }
    .wh-time { display: flex; flex-direction: column; gap: 4px; }
    .wh-time span { font-size: 0.72rem; font-weight: 600; color: var(--text-muted); letter-spacing: 0.02em; text-transform: uppercase; }
    .wh-time .ui-input { width: 128px; }

    /* ── Modal bits ── */
    .wh-modal__body { display: flex; flex-direction: column; gap: 16px; }
    .wh-modal__seg { width: 100%; }
    .wh-modal__seg .ui-seg__btn { flex: 1 1 0; }
    .wh-modal__same { display: inline-flex; align-items: flex-end; gap: 10px; }
    .wh-modal__hint { font-size: 0.78rem; color: var(--text-muted); }
    .wh-modal__notice {
      display: flex; align-items: center; gap: 10px;
      padding: 13px 15px; border-radius: 12px;
      border: 1px dashed var(--border-subtle);
      background: var(--surface-soft); color: var(--text-secondary); font-size: 0.86rem;
    }
    .wh-modal__notice svg { flex: 0 0 auto; fill: none; stroke: currentColor; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; color: var(--primary); }

    @media (max-width: 560px) {
      .wh-shifts { grid-template-columns: 1fr; }
      .wh-day__label { min-width: 100%; }
      .wh-day__times, .wh-modal__same { width: 100%; }
      .wh-time { flex: 1 1 0; }
      .wh-time .ui-input { width: 100%; }
    }
  `],
})
export class ShiftsPageComponent implements OnInit {
  private readonly languageService = inject(LanguageService);
  private readonly api = inject(WorkingHoursApiService);
  private readonly toast = inject(ToastService);

  readonly t = (key: TranslationKey) => this.languageService.text(key);
  readonly direction = () => this.languageService.getDirection();

  readonly shifts = signal<Shift[]>([]);
  readonly loading = signal(true);
  readonly error = signal(false);

  /** Company working windows keyed by day-of-week (working days only). */
  private companyWindows = new Map<DayOfWeek, CompanyWindow>();

  // ─── Editor ──
  readonly editorOpen = signal(false);
  readonly editingId = signal<number | null>(null);
  readonly saving = signal(false);
  readonly formError = signal<string | null>(null);
  readonly mode = signal<'same' | 'perday'>('same');
  formName = '';
  sameStart = DEFAULT_START;
  sameEnd = DEFAULT_END;
  readonly editorDays = signal<EditorDay[]>([]);

  // ─── Delete ──
  readonly pendingDelete = signal<Shift | null>(null);
  readonly deleting = signal(false);

  ngOnInit(): void {
    this.load();
  }

  dayName(day: DayOfWeek): string {
    return this.t(`whDay${day}` as TranslationKey);
  }

  shortDay(day: DayOfWeek): string {
    return this.dayName(day).slice(0, 3);
  }

  /** Days of the week in display order, for the coverage strip. */
  readonly dayOrder = DAY_ORDER;

  /** Whether a shift runs on a given weekday (drives the coverage strip highlight). */
  coversDay(shift: Shift, day: DayOfWeek): boolean {
    return shift.days.some((d) => d.dayOfWeek === day);
  }

  sortedDays(days: ShiftDay[]): ShiftDay[] {
    return [...days].sort((a, b) => a.dayOfWeek - b.dayOfWeek);
  }

  load(): void {
    this.loading.set(true);
    this.error.set(false);
    this.api.getCompanyWorkingHours().subscribe({
      next: (company) => {
        this.companyWindows.clear();
        for (const d of company.days ?? []) {
          if (d.isWorkingDay) {
            this.companyWindows.set(d.dayOfWeek, { start: d.startTime, end: d.endTime });
          }
        }
        this.api.getShifts().subscribe({
          next: (data) => {
            this.shifts.set(data ?? []);
            this.loading.set(false);
          },
          error: () => {
            this.error.set(true);
            this.loading.set(false);
          },
        });
      },
      error: () => {
        this.error.set(true);
        this.loading.set(false);
      },
    });
  }

  private buildEditorDays(shift: Shift | null): EditorDay[] {
    const shiftByDay = new Map<DayOfWeek, ShiftDay>();
    for (const d of shift?.days ?? []) {
      shiftByDay.set(d.dayOfWeek, d);
    }

    // Union of company working days and any days the shift already uses,
    // so editing never silently drops an existing (now non-working) day.
    const dayKeys = new Set<DayOfWeek>([...this.companyWindows.keys(), ...shiftByDay.keys()]);

    return DAY_ORDER.filter((day) => dayKeys.has(day)).map((day) => {
      const window = this.companyWindows.get(day);
      const existing = shiftByDay.get(day);
      return {
        dayOfWeek: day,
        isCompanyDay: this.companyWindows.has(day),
        companyStart: window?.start ?? null,
        companyEnd: window?.end ?? null,
        selected: !!existing,
        start: existing?.startTime ?? window?.start ?? DEFAULT_START,
        end: existing?.endTime ?? window?.end ?? DEFAULT_END,
      };
    });
  }

  openCreate(): void {
    this.editingId.set(null);
    this.formName = '';
    this.formError.set(null);
    const rows = this.buildEditorDays(null);
    this.editorDays.set(rows);
    const first = rows.find((r) => r.isCompanyDay);
    this.sameStart = first?.companyStart ?? DEFAULT_START;
    this.sameEnd = first?.companyEnd ?? DEFAULT_END;
    this.mode.set('same');
    this.editorOpen.set(true);
  }

  openEdit(shift: Shift): void {
    this.editingId.set(shift.id);
    this.formName = shift.name;
    this.formError.set(null);
    const rows = this.buildEditorDays(shift);
    this.editorDays.set(rows);

    const active = shift.days;
    const uniform =
      active.length > 0 &&
      active.every((d) => d.startTime === active[0].startTime && d.endTime === active[0].endTime);
    if (uniform) {
      this.mode.set('same');
      this.sameStart = active[0].startTime;
      this.sameEnd = active[0].endTime;
    } else {
      this.mode.set('perday');
      const first = rows.find((r) => r.isCompanyDay);
      this.sameStart = first?.companyStart ?? DEFAULT_START;
      this.sameEnd = first?.companyEnd ?? DEFAULT_END;
    }
    this.editorOpen.set(true);
  }

  closeEditor(): void {
    if (this.saving()) {
      return;
    }
    this.editorOpen.set(false);
  }

  toggleDay(day: DayOfWeek): void {
    this.formError.set(null);
    this.editorDays.update((rows) =>
      rows.map((r) => (r.dayOfWeek === day ? { ...r, selected: !r.selected } : r))
    );
  }

  save(): void {
    this.formError.set(null);

    const name = this.formName.trim();
    if (!name) {
      this.formError.set(this.t('whShNameRequired'));
      return;
    }

    const same = this.mode() === 'same';
    const selected = this.editorDays().filter((r) => r.selected);
    if (selected.length === 0) {
      this.formError.set(this.t('whShNoDaysError'));
      return;
    }

    const days: ShiftDay[] = [];
    for (const row of selected) {
      const start = same ? this.sameStart : row.start;
      const end = same ? this.sameEnd : row.end;

      if (!start || !end) {
        this.formError.set(this.t('whShTimeRequired'));
        return;
      }
      if (end <= start) {
        this.formError.set(`${this.dayName(row.dayOfWeek)}: ${this.t('whShRangeError')}`);
        return;
      }
      // Client-side bounds check against company hours (server validates too).
      if (row.isCompanyDay && row.companyStart && row.companyEnd) {
        if (start < row.companyStart || end > row.companyEnd) {
          this.formError.set(`${this.dayName(row.dayOfWeek)}: ${this.t('whShOutsideError')}`);
          return;
        }
      }
      days.push({ dayOfWeek: row.dayOfWeek, startTime: start, endTime: end });
    }

    const payload: UpsertShiftRequest = { name, days };
    this.saving.set(true);
    const id = this.editingId();
    const request$ = id ? this.api.updateShift(id, payload) : this.api.createShift(payload);

    request$.subscribe({
      next: (saved) => {
        if (id) {
          this.shifts.update((list) => list.map((s) => (s.id === saved.id ? saved : s)));
        } else {
          this.shifts.update((list) => [saved, ...list]);
        }
        this.saving.set(false);
        this.editorOpen.set(false);
        this.toast.success(id ? this.t('whShUpdatedToast') : this.t('whShCreatedToast'), '');
      },
      error: (err) => {
        this.saving.set(false);
        this.formError.set(apiErrorMessage(err, this.t('whErrorToast')));
      },
    });
  }

  requestDelete(shift: Shift): void {
    this.pendingDelete.set(shift);
  }

  cancelDelete(): void {
    if (this.deleting()) {
      return;
    }
    this.pendingDelete.set(null);
  }

  confirmDelete(): void {
    const shift = this.pendingDelete();
    if (!shift) {
      return;
    }
    this.deleting.set(true);
    this.api.deleteShift(shift.id).subscribe({
      next: () => {
        this.shifts.update((list) => list.filter((s) => s.id !== shift.id));
        this.deleting.set(false);
        this.pendingDelete.set(null);
        this.toast.success(this.t('whShDeletedToast'), '');
      },
      error: (err) => {
        this.deleting.set(false);
        this.pendingDelete.set(null);
        this.toast.error(this.t('whErrorToast'), apiErrorMessage(err, this.t('whErrorToast')));
      },
    });
  }
}
