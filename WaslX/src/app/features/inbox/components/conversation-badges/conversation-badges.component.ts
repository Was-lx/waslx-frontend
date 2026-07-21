import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';

import { LanguageService } from '../../../../core/services/language.service';
import type { ConversationClassificationBadgeData, SentimentLabel, PriorityLabel } from '../../models/conversation-classification.model';
import type { BadgeVariant } from '../../models/conversation-badge.model';

@Component({
  selector: 'app-conversation-badges',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span class="badge-list" [attr.dir]="direction()">
      @if (showEscalation()) {
        <span class="badge badge--danger" [attr.aria-label]="t('badgeEscalated')">
          {{ t('badgeEscalated') }}
        </span>
      }
      @for (b of visibleBadges(); track b.label) {
        <span class="badge badge--{{ b.variant }}" [attr.aria-label]="b.label">
          {{ b.label }}
        </span>
      }
    </span>
  `,
  styles: [`
    .badge-list {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      flex-wrap: wrap;
    }
    .badge {
      display: inline-flex;
      align-items: center;
      padding: 2px 8px;
      border-radius: 999px;
      font-size: 0.65rem;
      font-weight: 700;
      line-height: 1.4;
      white-space: nowrap;
    }
    .badge--success { background: color-mix(in srgb, #22C55E 14%, transparent); color: #15803d; }
    .badge--warning { background: color-mix(in srgb, #F59E0B 14%, transparent); color: #b45309; }
    .badge--danger  { background: color-mix(in srgb, #EF4444 14%, transparent); color: #b91c1c; }
    .badge--neutral { background: color-mix(in srgb, #94A3B8 12%, transparent); color: #475569; }
    .badge--ai     { background: color-mix(in srgb, #8B5CF6 14%, transparent); color: #7c3aed; }
  `]
})
export class ConversationBadgesComponent {
  private readonly language = inject(LanguageService);

  readonly data = input<ConversationClassificationBadgeData | null>(null);

  protected readonly showEscalation = computed(() => {
    const d = this.data();
    if (!d) return false;
    if (d.escalate) return true;
    const status = d.escalationStatus;
    return status === 'open' || status === 'recommended' || status === 'assigned';
  });

  protected readonly visibleBadges = computed(() => {
    const d = this.data();
    if (!d) return [];

    const badges: { label: string; variant: BadgeVariant }[] = [];

    const sentiment = d.sentiment;
    if (sentiment && sentiment !== 'neutral') {
      badges.push({ label: this.labelForSentiment(sentiment), variant: this.variantForSentiment(sentiment) });
    }

    const priority = d.priority;
    if (priority && priority !== 'low' && priority !== 'normal') {
      badges.push({ label: this.labelForPriority(priority), variant: this.variantForPriority(priority) });
    }

    return badges;
  });

  protected t = (key: string): string => this.language.text(key as never);
  protected direction = (): 'rtl' | 'ltr' => this.language.getDirection();

  private labelForSentiment(s: SentimentLabel): string {
    switch (s) {
      case 'positive': return this.t('sentimentPositive');
      case 'negative': return this.t('sentimentNegative');
      case 'angry': return this.t('sentimentAngry');
      default: return '';
    }
  }

  private variantForSentiment(s: SentimentLabel): BadgeVariant {
    switch (s) {
      case 'positive': return 'success';
      case 'negative': return 'warning';
      case 'angry': return 'danger';
      default: return 'neutral';
    }
  }

  private labelForPriority(p: PriorityLabel): string {
    switch (p) {
      case 'high': return this.t('priorityHigh');
      case 'urgent': return this.t('priorityUrgent');
      default: return '';
    }
  }

  private variantForPriority(p: PriorityLabel): BadgeVariant {
    switch (p) {
      case 'high': return 'warning';
      case 'urgent': return 'danger';
      default: return 'neutral';
    }
  }
}
