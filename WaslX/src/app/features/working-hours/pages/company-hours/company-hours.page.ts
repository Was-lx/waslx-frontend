import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { type TranslationKey, LanguageService } from '../../../../core/services/language.service';
import { ToastService } from '../../../../core/services/toast.service';
import {
  type CompanyWorkingDay,
  type DayOfWeek,
  WorkingHoursApiService,
} from '../../../../core/api/working-hours-api.service';
import { apiErrorMessage } from '../../../../core/utils/api-error';
import { IconComponent } from '../../../../shared/components/icon/icon.component';
import { TIMEZONE_OPTIONS } from '../../timezones';

const DAY_ORDER: DayOfWeek[] = [0, 1, 2, 3, 4, 5, 6];
const DEFAULT_START = '09:00';
const DEFAULT_END = '17:00';

interface DayRow {
  dayOfWeek: DayOfWeek;
  isWorkingDay: boolean;
  startTime: string;
  endTime: string;
}

@Component({
  selector: 'app-company-hours-page',
  standalone: true,
  imports: [FormsModule, RouterLink, RouterLinkActive, IconComponent],
  template: `
    <section class="feature-page wh" [attr.dir]="direction()">
      <header class="feature-page__header">
        <div class="wh__lead">
          <span class="feature-page__eyebrow">{{ t('whCoEyebrow') }}</span>
          <h1>{{ t('whCoTitle') }}</h1>
          <p class="wh__lead-text">{{ t('whCoLead') }}</p>
        </div>
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
      } @else {
        <div class="wh__grid">
          <!-- Timezone -->
          <article class="ui-card wh-card">
            <div class="wh-card__head">
              <span class="wh-card__ic"><app-icon name="globe" [size]="18" /></span>
              <div>
                <h2 class="wh-card__title">{{ t('whCoTimezone') }}</h2>
                <p class="wh-card__sub">{{ t('whCoTimezoneHint') }}</p>
              </div>
            </div>
            <div class="ui-field">
              <label class="ui-label" for="wh-tz">{{ t('whCoTimezone') }}</label>
              <select id="wh-tz" class="ui-select" [(ngModel)]="timeZoneId">
                @for (tz of timezoneOptions(); track tz.id) {
                  <option [value]="tz.id">{{ tz.label }}</option>
                }
              </select>
            </div>
          </article>

          <!-- Weekly schedule -->
          <article class="ui-card wh-card">
            <div class="wh-card__head">
              <span class="wh-card__ic"><app-icon name="clock" [size]="18" /></span>
              <div>
                <h2 class="wh-card__title">{{ t('whCoScheduleTitle') }}</h2>
                <p class="wh-card__sub">{{ t('whCoScheduleHint') }}</p>
              </div>
              <span class="ui-pill ui-pill--info wh-card__count">
                {{ workingCount() }} {{ t('whCoWorkingCount') }}
              </span>
            </div>

            <!-- Week at a glance — a mini timeline of each day's working window -->
            <div class="wh-week" role="img" [attr.aria-label]="t('whCoScheduleTitle')">
              @for (row of rows(); track row.dayOfWeek) {
                <div class="wh-week__cell" [class.is-on]="row.isWorkingDay">
                  <span class="wh-week__day">{{ shortDay(row.dayOfWeek) }}</span>
                  <span class="wh-week__track">
                    @if (row.isWorkingDay) {
                      <span class="wh-week__fill"
                            [style.top.%]="windowTop(row)"
                            [style.height.%]="windowHeight(row)"></span>
                    }
                  </span>
                  <span class="wh-week__hrs">{{ row.isWorkingDay ? row.startTime : '·' }}</span>
                </div>
              }
            </div>

            <ul class="wh-days">
              @for (row of rows(); track row.dayOfWeek) {
                <li class="wh-day" [class.wh-day--on]="row.isWorkingDay">
                  <div class="wh-day__label">
                    <button
                      type="button"
                      class="ui-toggle"
                      [class.is-on]="row.isWorkingDay"
                      [attr.aria-checked]="row.isWorkingDay"
                      role="switch"
                      [attr.aria-label]="dayName(row.dayOfWeek)"
                      (click)="toggleDay(row.dayOfWeek)"
                    ></button>
                    <div class="wh-day__name">
                      <span>{{ dayName(row.dayOfWeek) }}</span>
                      <small>{{ row.isWorkingDay ? t('whCoWorkingDay') : t('whCoDayOff') }}</small>
                    </div>
                  </div>

                  @if (row.isWorkingDay) {
                    <div class="wh-day__times">
                      <label class="wh-time">
                        <span>{{ t('whFrom') }}</span>
                        <input type="time" class="ui-input" [(ngModel)]="row.startTime" />
                      </label>
                      <span class="wh-day__dash" aria-hidden="true">–</span>
                      <label class="wh-time">
                        <span>{{ t('whTo') }}</span>
                        <input type="time" class="ui-input" [(ngModel)]="row.endTime" />
                      </label>
                    </div>
                  } @else {
                    <span class="wh-day__closed">{{ t('whCoClosed') }}</span>
                  }
                </li>
              }
            </ul>

            @if (formError()) {
              <span class="ui-error wh-card__err">{{ formError() }}</span>
            }

            <div class="wh-card__foot">
              <button type="button" class="ui-btn ui-btn--primary" [disabled]="saving()" (click)="save()">
                @if (saving()) { <span class="ui-spinner wh__btn-spin"></span> {{ t('whSaving') }} }
                @else { {{ t('whCoSave') }} }
              </button>
            </div>
          </article>
        </div>
      }
    </section>
  `,
  styles: [`
    :host { display: block; }
    .wh__lead-text { margin: 8px 0 0; color: var(--text-secondary); font-size: 0.95rem; max-width: 60ch; }
    .wh__state { min-height: 220px; }
    .wh__btn-spin { width: 16px; height: 16px; border-width: 2px; }
    .wh__grid { display: grid; gap: 18px; grid-template-columns: minmax(0, 1fr); max-width: 720px; }

    .wh-card { padding: 22px; }
    .wh-card__head { display: flex; align-items: flex-start; gap: 13px; margin-bottom: 18px; }
    .wh-card__ic {
      display: grid; place-items: center; width: 38px; height: 38px; flex: 0 0 auto;
      border-radius: 11px; color: var(--primary);
      background: color-mix(in srgb, var(--primary) 12%, var(--surface));
      box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--primary) 20%, transparent);
    }
    .wh-card__ic svg { fill: none; stroke: currentColor; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
    .wh-card__title { margin: 0; font-size: 1.02rem; font-weight: 700; color: var(--text-primary); }
    .wh-card__sub { margin: 3px 0 0; font-size: 0.84rem; color: var(--text-muted); }
    .wh-card__count { margin-inline-start: auto; flex: 0 0 auto; }
    .wh-card__err { display: block; margin-top: 14px; }
    .wh-card__foot { display: flex; justify-content: flex-end; margin-top: 20px; }

    /* Week-at-a-glance strip — 7 day columns, each a mini 24h timeline. */
    .wh-week {
      display: grid; grid-template-columns: repeat(7, 1fr); gap: 8px;
      margin-bottom: 20px; padding: 14px 12px;
      border-radius: 14px; border: 1px solid var(--border-subtle);
      background: linear-gradient(180deg, color-mix(in srgb, var(--primary) 4%, var(--surface-soft)), var(--surface-soft));
    }
    .wh-week__cell {
      display: flex; flex-direction: column; align-items: center; gap: 7px;
      padding: 8px 2px; border-radius: 11px;
      transition: background-color 160ms ease;
    }
    .wh-week__cell.is-on { background: color-mix(in srgb, var(--primary) 7%, transparent); }
    .wh-week__day {
      font-size: 0.68rem; font-weight: 800; letter-spacing: 0.02em; text-transform: uppercase;
      color: var(--text-muted);
    }
    .wh-week__cell.is-on .wh-week__day { color: var(--primary); }
    .wh-week__track {
      position: relative; width: 6px; height: 46px; border-radius: 999px;
      background: color-mix(in srgb, var(--text-muted) 16%, transparent); overflow: hidden;
    }
    .wh-week__fill {
      position: absolute; inset-inline: 0; border-radius: 999px;
      background: linear-gradient(180deg, var(--primary), var(--accent));
    }
    .wh-week__hrs {
      font-size: 0.62rem; font-weight: 600; color: var(--text-muted); font-variant-numeric: tabular-nums;
      min-height: 0.9em;
    }
    .wh-week__cell.is-on .wh-week__hrs { color: var(--text-secondary); }
    @media (max-width: 560px) { .wh-week { gap: 4px; padding: 10px 6px; } .wh-week__hrs { display: none; } }

    .wh-days { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 8px; }
    .wh-day {
      display: flex; align-items: center; justify-content: space-between; gap: 14px; flex-wrap: wrap;
      padding: 12px 14px; border-radius: 13px;
      border: 1px solid var(--border-subtle); background: var(--surface-soft);
      transition: border-color 160ms ease, background-color 160ms ease;
    }
    .wh-day--on { border-color: color-mix(in srgb, var(--primary) 26%, var(--border-subtle)); background: var(--surface); }
    .wh-day__label { display: inline-flex; align-items: center; gap: 12px; min-width: 168px; }
    .wh-day__name { display: flex; flex-direction: column; line-height: 1.25; }
    .wh-day__name span { font-weight: 600; color: var(--text-primary); font-size: 0.92rem; }
    .wh-day__name small { color: var(--text-muted); font-size: 0.75rem; }
    .wh-day__times { display: inline-flex; align-items: flex-end; gap: 10px; }
    .wh-day__dash { color: var(--text-muted); padding-bottom: 10px; }
    .wh-time { display: flex; flex-direction: column; gap: 4px; }
    .wh-time span { font-size: 0.72rem; font-weight: 600; color: var(--text-muted); letter-spacing: 0.02em; text-transform: uppercase; }
    .wh-time .ui-input { width: 132px; }
    .wh-day__closed { color: var(--text-muted); font-size: 0.85rem; font-style: italic; padding-inline-end: 6px; }

    @media (max-width: 560px) {
      .wh-day__label { min-width: 100%; }
      .wh-day__times { width: 100%; }
      .wh-time { flex: 1 1 0; }
      .wh-time .ui-input { width: 100%; }
    }
  `],
})
export class CompanyHoursPageComponent implements OnInit {
  private readonly languageService = inject(LanguageService);
  private readonly api = inject(WorkingHoursApiService);
  private readonly toast = inject(ToastService);

  readonly t = (key: TranslationKey) => this.languageService.text(key);
  readonly direction = () => this.languageService.getDirection();

  readonly loading = signal(true);
  readonly error = signal(false);
  readonly saving = signal(false);
  readonly formError = signal<string | null>(null);

  timeZoneId = 'Egypt Standard Time';
  readonly rows = signal<DayRow[]>([]);

  readonly workingCount = computed(() => this.rows().filter((r) => r.isWorkingDay).length);

  readonly timezoneOptions = computed(() => {
    const list = [...TIMEZONE_OPTIONS];
    if (this.timeZoneId && !list.some((tz) => tz.id === this.timeZoneId)) {
      list.unshift({ id: this.timeZoneId, label: this.timeZoneId });
    }
    return list;
  });

  ngOnInit(): void {
    this.load();
  }

  dayName(day: DayOfWeek): string {
    return this.t(`whDay${day}` as TranslationKey);
  }

  /** Short 3-letter day label for the week-overview strip. */
  shortDay(day: DayOfWeek): string {
    return this.dayName(day).slice(0, 3);
  }

  /** "HH:MM" → percentage of a 24h day (0–100), for positioning the mini-timeline fill. */
  private minutesPct(time: string): number {
    const [h, m] = (time || '00:00').split(':').map(Number);
    return Math.min(100, Math.max(0, ((h * 60 + m) / 1440) * 100));
  }

  windowTop(row: DayRow): number {
    return this.minutesPct(row.startTime);
  }

  windowHeight(row: DayRow): number {
    return Math.max(6, this.minutesPct(row.endTime) - this.minutesPct(row.startTime));
  }

  load(): void {
    this.loading.set(true);
    this.error.set(false);
    this.formError.set(null);
    this.api.getCompanyWorkingHours().subscribe({
      next: (data) => {
        this.timeZoneId = data.timeZoneId || 'Egypt Standard Time';
        const byDay = new Map<DayOfWeek, CompanyWorkingDay>();
        for (const d of data.days ?? []) {
          byDay.set(d.dayOfWeek, d);
        }
        this.rows.set(
          DAY_ORDER.map((day) => {
            const existing = byDay.get(day);
            return {
              dayOfWeek: day,
              isWorkingDay: existing?.isWorkingDay ?? false,
              startTime: existing?.startTime ?? DEFAULT_START,
              endTime: existing?.endTime ?? DEFAULT_END,
            };
          })
        );
        this.loading.set(false);
      },
      error: () => {
        this.error.set(true);
        this.loading.set(false);
      },
    });
  }

  toggleDay(day: DayOfWeek): void {
    this.formError.set(null);
    this.rows.update((rows) =>
      rows.map((r) => {
        if (r.dayOfWeek !== day) {
          return r;
        }
        const turningOn = !r.isWorkingDay;
        return {
          ...r,
          isWorkingDay: turningOn,
          startTime: r.startTime || DEFAULT_START,
          endTime: r.endTime || DEFAULT_END,
        };
      })
    );
  }

  save(): void {
    this.formError.set(null);
    const rows = this.rows();

    for (const r of rows) {
      if (r.isWorkingDay && r.startTime && r.endTime && r.endTime <= r.startTime) {
        this.formError.set(`${this.dayName(r.dayOfWeek)}: ${this.t('whCoRangeError')}`);
        return;
      }
    }

    const days: CompanyWorkingDay[] = rows.map((r) => ({
      dayOfWeek: r.dayOfWeek,
      isWorkingDay: r.isWorkingDay,
      startTime: r.isWorkingDay ? r.startTime : null,
      endTime: r.isWorkingDay ? r.endTime : null,
    }));

    this.saving.set(true);
    this.api.updateCompanyWorkingHours({ timeZoneId: this.timeZoneId, days }).subscribe({
      next: () => {
        this.saving.set(false);
        this.toast.success(this.t('whCoSavedToast'), '');
      },
      error: (err) => {
        this.saving.set(false);
        this.toast.error(this.t('whErrorToast'), apiErrorMessage(err, this.t('whErrorToast')));
      },
    });
  }
}
