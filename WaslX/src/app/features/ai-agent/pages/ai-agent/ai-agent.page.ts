import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DestroyRef } from '@angular/core';

import { LanguageService, type TranslationKey } from '../../../../core/services/language.service';
import { ToastService } from '../../../../core/services/toast.service';
import { apiErrorMessage } from '../../../../core/utils/api-error';
import { IconComponent } from '../../../../shared/components/icon/icon.component';
import { WhatsAppApiService, type WhatsAppAccountSummary } from '../../../../core/api/whatsapp-api.service';
import {
  AiAgentApiService,
  type AiAgentSettings,
  type AiHandledConversation,
  type AiKnowledgeFile,
} from '../../../../core/api/ai-agent-api.service';
import { EscalationApiService } from '../../../inbox/services/escalation-api.service';
import type { EscalationMode } from '../../../inbox/models/escalation-recommendation.model';

const DEFAULT_SETTINGS: AiAgentSettings = {
  enabled: false,
  perNumber: [],
  personaName: '',
  toneInstructions: '',
  handoffThreshold: 0.6,
};

/**
 * FE-4.1 — AI Agent Control Panel. Turn the autonomous Agent on/off (workspace-wide and per number),
 * shape its persona/tone, upload business knowledge, set the handoff confidence threshold, and monitor
 * the conversations it currently handles.
 *
 * ⚠️ The backing endpoints (US-4.6) are provisional — when they 404 the panel still renders with local
 * defaults and shows an "not connected yet" hint, so the UI is reviewable ahead of the backend.
 */
@Component({
  selector: 'app-ai-agent-page',
  standalone: true,
  imports: [IconComponent],
  template: `
    <section class="aip feature-page" [attr.dir]="direction()">
      <header class="aip__head">
        <div class="aip__head-icon"><app-icon name="bot" [size]="22" /></div>
        <div>
          <h1 class="aip__title">{{ t('aiPanelTitle') }}</h1>
          <p class="aip__lead">{{ t('aiPanelLead') }}</p>
        </div>
        <span class="aip__spacer"></span>
        <span class="aip__state" [class.aip__state--on]="settings().enabled">
          {{ settings().enabled ? t('aiEnabled') : t('aiDisabled') }}
        </span>
      </header>

      @if (unavailable()) {
        <div class="aip__notice">
          <app-icon name="bell" [size]="16" />
          <span>{{ t('aiUnavailableHint') }}</span>
        </div>
      }

      <!-- Enable / disable -->
      <div class="aip__card">
        <div class="aip__card-head">
          <h2 class="aip__card-title">{{ t('aiEnableTitle') }}</h2>
          <label class="aip__switch">
            <input type="checkbox" [checked]="settings().enabled" (change)="setEnabled($any($event.target).checked)" />
            <span class="aip__switch-track"><span class="aip__switch-thumb"></span></span>
          </label>
        </div>
        <p class="aip__muted">{{ t('aiEnableDesc') }}</p>

        @if (accounts().length > 0) {
          <div class="aip__numbers">
            <span class="aip__label">{{ t('aiScopePerNumber') }}</span>
            @for (acc of accounts(); track acc.id) {
              <label class="aip__number-row">
                <input type="checkbox" [checked]="isNumberEnabled(acc.id)"
                       [disabled]="!settings().enabled"
                       (change)="setNumberEnabled(acc.id, $any($event.target).checked)" />
                <span>{{ acc.phoneNumber }}</span>
                @if (acc.platformName) { <span class="aip__muted">· {{ acc.platformName }}</span> }
              </label>
            }
          </div>
        }
      </div>

      <!-- Persona & tone -->
      <div class="aip__card">
        <h2 class="aip__card-title">{{ t('aiPersonaTitle') }}</h2>
        <p class="aip__muted">{{ t('aiPersonaDesc') }}</p>
        <label class="aip__field">
          <span class="aip__label">{{ t('aiPersonaName') }}</span>
          <input class="ui-input" [value]="settings().personaName"
                 [placeholder]="t('aiPersonaNamePlaceholder')"
                 (input)="patch({ personaName: $any($event.target).value })" />
        </label>
        <label class="aip__field">
          <span class="aip__label">{{ t('aiPersonaTone') }}</span>
          <textarea class="ui-input aip__textarea" rows="3" [value]="settings().toneInstructions"
                    [placeholder]="t('aiTonePlaceholder')"
                    (input)="patch({ toneInstructions: $any($event.target).value })"></textarea>
        </label>
      </div>

      <!-- Business knowledge -->
      <div class="aip__card">
        <div class="aip__card-head">
          <h2 class="aip__card-title">{{ t('aiKnowledgeTitle') }}</h2>
          <label class="ui-btn ui-btn--ghost ui-btn--sm aip__upload">
            <app-icon name="layers" [size]="14" />
            {{ t('aiKnowledgeUpload') }}
            <input type="file" multiple hidden (change)="onFilesPicked($event)" />
          </label>
        </div>
        <p class="aip__muted">{{ t('aiKnowledgeDesc') }}</p>
        @if (knowledge().length === 0) {
          <p class="aip__empty">{{ t('aiKnowledgeEmpty') }}</p>
        } @else {
          <ul class="aip__files">
            @for (f of knowledge(); track f.id) {
              <li class="aip__file">
                <app-icon name="folder" [size]="15" />
                <span class="aip__file-name">{{ f.fileName }}</span>
                <span class="aip__file-size">{{ formatSize(f.sizeBytes) }}</span>
                <button type="button" class="aip__file-remove" [title]="t('aiKnowledgeRemove')"
                        [attr.aria-label]="t('aiKnowledgeRemove')" (click)="removeFile(f.id)">
                  <app-icon name="trash" [size]="14" />
                </button>
              </li>
            }
          </ul>
        }
      </div>

      <!-- Confidence threshold -->
      <div class="aip__card">
        <h2 class="aip__card-title">{{ t('aiThresholdTitle') }}</h2>
        <p class="aip__muted">{{ t('aiThresholdDesc') }}</p>
        <div class="aip__slider-row">
          <input type="range" min="0" max="100" step="5" class="aip__slider"
                 [value]="thresholdPct()" (input)="setThreshold($any($event.target).value)" />
          <span class="aip__slider-val">{{ thresholdPct() }}%</span>
        </div>
      </div>

      <!-- Escalation mode (US-4.4) -->
      <div class="aip__card">
        <div class="aip__card-head">
          <h2 class="aip__card-title">{{ t('aiEscMode') }}</h2>
          <label class="aip__switch">
            <input type="checkbox" [checked]="escalationMode() === 'autoAssign'"
                   (change)="setEscalationMode($any($event.target).checked)" />
            <span class="aip__switch-track"><span class="aip__switch-thumb"></span></span>
          </label>
        </div>
        <p class="aip__muted">{{ escalationMode() === 'autoAssign' ? t('aiEscAutoDesc') : t('aiEscRecDesc') }}</p>
      </div>

      <!-- Monitoring -->
      <div class="aip__card">
        <h2 class="aip__card-title">{{ t('aiMonitorTitle') }}</h2>
        <p class="aip__muted">{{ t('aiMonitorDesc') }}</p>
        @if (monitored().length === 0) {
          <p class="aip__empty">{{ t('aiMonitorEmpty') }}</p>
        } @else {
          <table class="aip__table">
            <thead>
              <tr><th>{{ t('aiMonitorColCustomer') }}</th><th>{{ t('aiMonitorColStatus') }}</th></tr>
            </thead>
            <tbody>
              @for (c of monitored(); track c.conversationId) {
                <tr>
                  <td>{{ c.customerName || c.customerPhone }}</td>
                  <td><span class="aip__chip">{{ c.status }}</span></td>
                </tr>
              }
            </tbody>
          </table>
        }
      </div>

      <div class="aip__actions">
        <button type="button" class="ui-btn ui-btn--primary" [disabled]="saving()" (click)="save()">
          {{ saving() ? t('aiLoading') : t('aiSaveSettings') }}
        </button>
      </div>
    </section>
  `,
  styles: [`
    .aip { display: flex; flex-direction: column; gap: 16px; max-width: 820px; }
    .aip__head { display: flex; align-items: center; gap: 14px; }
    .aip__head-icon {
      display: grid; place-items: center; width: 46px; height: 46px; flex: 0 0 auto;
      border-radius: 13px; color: #fff; background: linear-gradient(135deg, var(--primary), var(--accent));
    }
    .aip__head-icon svg { fill: none; stroke: currentColor; stroke-width: 2; }
    .aip__title { margin: 0; font-size: 1.15rem; font-weight: 800; color: var(--text-primary); }
    .aip__lead { margin: 2px 0 0; font-size: 0.85rem; color: var(--text-muted); max-width: 60ch; }
    .aip__spacer { flex: 1 1 auto; }
    .aip__state {
      flex: 0 0 auto; font-size: 0.74rem; font-weight: 700; padding: 5px 12px; border-radius: 999px;
      background: color-mix(in srgb, var(--text-muted) 16%, transparent); color: var(--text-secondary);
    }
    .aip__state--on { background: color-mix(in srgb, #16a34a 16%, transparent); color: #15803d; }
    .aip__notice {
      display: flex; align-items: center; gap: 8px; padding: 10px 14px; border-radius: 12px;
      background: color-mix(in srgb, #d97706 10%, var(--surface));
      border: 1px solid color-mix(in srgb, #d97706 30%, var(--border-subtle));
      color: #b45309; font-size: 0.82rem; font-weight: 600;
    }
    .aip__notice svg { fill: none; stroke: currentColor; stroke-width: 2; }
    .aip__card {
      display: flex; flex-direction: column; gap: 10px;
      padding: 18px; border-radius: 16px;
      background: var(--surface); border: 1px solid var(--border-subtle); box-shadow: var(--shadow-xs);
    }
    .aip__card-head { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
    .aip__card-title { margin: 0; font-size: 0.95rem; font-weight: 750; color: var(--text-primary); }
    .aip__muted { margin: 0; font-size: 0.82rem; color: var(--text-muted); }
    .aip__label { display: block; font-size: 0.74rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.03em; color: var(--text-muted); margin-bottom: 6px; }
    .aip__field { display: block; }
    .aip__textarea { resize: vertical; min-height: 72px; font: inherit; }
    /* Switch */
    .aip__switch { position: relative; display: inline-flex; cursor: pointer; }
    .aip__switch input { position: absolute; opacity: 0; width: 0; height: 0; }
    .aip__switch-track { width: 44px; height: 24px; border-radius: 999px; background: color-mix(in srgb, var(--text-muted) 34%, transparent); transition: background-color 160ms ease; display: inline-flex; align-items: center; padding: 2px; }
    .aip__switch-thumb { width: 20px; height: 20px; border-radius: 50%; background: #fff; box-shadow: var(--shadow-sm); transition: transform 160ms ease; }
    .aip__switch input:checked + .aip__switch-track { background: var(--primary); }
    .aip__switch input:checked + .aip__switch-track .aip__switch-thumb { transform: translateX(20px); }
    :host-context([dir="rtl"]) .aip__switch input:checked + .aip__switch-track .aip__switch-thumb { transform: translateX(-20px); }
    /* Per-number */
    .aip__numbers { display: flex; flex-direction: column; gap: 8px; padding-top: 6px; border-top: 1px dashed var(--border-subtle); }
    .aip__number-row { display: flex; align-items: center; gap: 8px; font-size: 0.85rem; color: var(--text-secondary); }
    /* Knowledge */
    .aip__upload { display: inline-flex; align-items: center; gap: 6px; cursor: pointer; }
    .aip__upload svg { fill: none; stroke: currentColor; stroke-width: 2; }
    .aip__empty { margin: 0; font-size: 0.82rem; color: var(--text-muted); font-style: italic; }
    .aip__files { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 6px; }
    .aip__file { display: flex; align-items: center; gap: 10px; padding: 8px 10px; border-radius: 10px; background: var(--surface-soft); border: 1px solid var(--border-soft); }
    .aip__file svg { fill: none; stroke: currentColor; stroke-width: 2; color: var(--text-muted); }
    .aip__file-name { font-size: 0.84rem; font-weight: 600; color: var(--text-primary); flex: 1 1 auto; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .aip__file-size { font-size: 0.72rem; color: var(--text-muted); font-variant-numeric: tabular-nums; }
    .aip__file-remove { border: 0; background: transparent; color: var(--text-muted); cursor: pointer; display: inline-flex; padding: 3px; border-radius: 6px; }
    .aip__file-remove:hover { color: var(--danger, #ef4444); background: color-mix(in srgb, var(--danger, #ef4444) 12%, transparent); }
    /* Slider */
    .aip__slider-row { display: flex; align-items: center; gap: 12px; }
    .aip__slider { flex: 1 1 auto; accent-color: var(--primary); }
    .aip__slider-val { flex: 0 0 auto; min-width: 44px; text-align: end; font-weight: 700; font-variant-numeric: tabular-nums; color: var(--text-primary); }
    /* Table */
    .aip__table { width: 100%; border-collapse: collapse; }
    .aip__table th { text-align: start; font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.03em; color: var(--text-muted); padding: 6px 8px; border-bottom: 1px solid var(--border-subtle); }
    .aip__table td { font-size: 0.85rem; color: var(--text-secondary); padding: 8px; border-bottom: 1px solid var(--border-subtle); }
    .aip__chip { font-size: 0.72rem; font-weight: 700; padding: 2px 9px; border-radius: 999px; background: color-mix(in srgb, var(--primary) 12%, transparent); color: var(--primary); }
    .aip__actions { display: flex; justify-content: flex-end; }
  `]
})
export class AiAgentPageComponent implements OnInit {
  private readonly language = inject(LanguageService);
  private readonly toast = inject(ToastService);
  private readonly aiApi = inject(AiAgentApiService);
  private readonly whatsapp = inject(WhatsAppApiService);
  private readonly escalationApi = inject(EscalationApiService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly settings = signal<AiAgentSettings>({ ...DEFAULT_SETTINGS });
  protected readonly knowledge = signal<AiKnowledgeFile[]>([]);
  protected readonly monitored = signal<AiHandledConversation[]>([]);
  protected readonly accounts = signal<WhatsAppAccountSummary[]>([]);
  protected readonly saving = signal(false);
  protected readonly unavailable = signal(false);
  protected readonly escalationMode = signal<EscalationMode>('recommend');

  protected readonly thresholdPct = computed(() => Math.round(this.settings().handoffThreshold * 100));

  protected t = (key: TranslationKey): string => this.language.text(key);
  protected direction = (): 'rtl' | 'ltr' => this.language.getDirection();

  ngOnInit(): void {
    this.whatsapp.getAccounts().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (a) => this.accounts.set(a), error: () => {}
    });

    // Provisional endpoints: on failure keep local defaults and flag "not connected yet".
    this.aiApi.getSettings().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (s) => this.settings.set({ ...DEFAULT_SETTINGS, ...s }),
      error: () => this.unavailable.set(true)
    });
    this.aiApi.getKnowledge().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (k) => this.knowledge.set(k), error: () => {}
    });

    const loadMonitored = () => {
      this.aiApi.getHandledConversations().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: (c) => this.monitored.set(c), error: () => {}
      });
    };
    
    loadMonitored();
    const monitorInterval = setInterval(loadMonitored, 30000);
    this.destroyRef.onDestroy(() => clearInterval(monitorInterval));

  }

  protected patch(part: Partial<AiAgentSettings>): void {
    this.settings.update((s) => ({ ...s, ...part }));
  }

  protected setEnabled(enabled: boolean): void {
    this.patch({ enabled });
  }

  protected setThreshold(pct: string): void {
    this.patch({ handoffThreshold: Math.max(0, Math.min(100, Number(pct))) / 100 });
  }

  protected setEscalationMode(autoAssign: boolean): void {
    const mode: EscalationMode = autoAssign ? 'autoAssign' : 'recommend';
    this.escalationMode.set(mode);
    this.escalationApi.updateSettings(mode).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      error: () => this.escalationMode.set(mode === 'autoAssign' ? 'recommend' : 'autoAssign')
    });
  }

  protected isNumberEnabled(accountId: number): boolean {
    const row = this.settings().perNumber.find((p) => p.whatsAppAccountId === accountId);
    // Default to the workspace-level toggle when there's no explicit per-number override.
    return row ? row.enabled : this.settings().enabled;
  }

  protected setNumberEnabled(accountId: number, enabled: boolean): void {
    this.settings.update((s) => {
      const perNumber = s.perNumber.filter((p) => p.whatsAppAccountId !== accountId);
      perNumber.push({ whatsAppAccountId: accountId, enabled });
      return { ...s, perNumber };
    });
  }

  protected onFilesPicked(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = Array.from(input.files ?? []);
    input.value = '';
    for (const file of files) {
      this.aiApi.uploadKnowledge(file).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: (uploaded) => this.knowledge.update((list) => [...list, uploaded]),
        error: (err) => this.toast.error(this.t('aiKnowledgeTitle'), apiErrorMessage(err, this.t('aiUnavailableHint')))
      });
    }
  }

  protected removeFile(id: number): void {
    this.aiApi.removeKnowledge(id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => this.knowledge.update((list) => list.filter((f) => f.id !== id)),
      error: () => this.knowledge.update((list) => list.filter((f) => f.id !== id))
    });
  }

  protected save(): void {
    this.saving.set(true);
    this.aiApi.updateSettings(this.settings()).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (s) => {
        this.settings.set({ ...DEFAULT_SETTINGS, ...s });
        this.saving.set(false);
        this.unavailable.set(false);
        this.toast.success(this.t('aiSettingsSaved'), '');
      },
      error: (err) => {
        this.saving.set(false);
        this.toast.error(this.t('aiSettingsError'), apiErrorMessage(err, this.t('aiUnavailableHint')));
      }
    });
  }

  protected formatSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }
}
