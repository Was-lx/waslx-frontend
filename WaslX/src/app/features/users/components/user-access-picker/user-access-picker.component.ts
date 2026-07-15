import { Component, computed, effect, inject, input, model } from '@angular/core';

import { type TranslationKey, LanguageService } from '../../../../core/services/language.service';
import { Channel } from '../../../../core/api/channels-api.service';
import { WhatsAppAccountSummary } from '../../../../core/api/whatsapp-api.service';
import { Group } from '../../../../core/api/groups-api.service';
import { Shift } from '../../../../core/api/working-hours-api.service';
import { IconComponent } from '../../../../shared/components/icon/icon.component';

/** The four access lists an admin can assign to a user (channels, distribution numbers, groups, shifts). */
export interface AccessSelection {
  channelIds: number[];
  distributionWhatsAppAccountIds: number[];
  groupIds: number[];
  shiftIds: number[];
}

/**
 * Reusable access & routing editor — four multi-selects (channels, distribution
 * numbers, groups, shifts) sharing the "pick chip" language from the channels
 * screen. Distribution numbers are constrained to the accounts inside the chosen
 * channels; distribution/shift routing only takes effect for Agents.
 */
@Component({
  selector: 'app-user-access-picker',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './user-access-picker.component.html',
  styleUrl: './user-access-picker.component.css',
})
export class UserAccessPickerComponent {
  private readonly languageService = inject(LanguageService);

  readonly t = (key: TranslationKey) => this.languageService.text(key);

  // ─── Inputs ────────────────────────────────────────────────────────────────
  readonly channels = input<Channel[]>([]);
  readonly numbers = input<WhatsAppAccountSummary[]>([]);
  readonly groups = input<Group[]>([]);
  readonly shifts = input<Shift[]>([]);
  /** Selected role — drives the "agents only" routing note. */
  readonly role = input<string>('Agent');

  readonly value = model.required<AccessSelection>();

  /** Distribution & shift routing only applies to Agents. */
  readonly isAgent = computed(() => this.role() === 'Agent');

  // ─── Distribution numbers are limited to the selected channels' accounts ─────
  readonly availableNumbers = computed<WhatsAppAccountSummary[]>(() => {
    const chosenChannelIds = new Set(this.value().channelIds);
    if (chosenChannelIds.size === 0) {
      return [];
    }
    const allowed = new Set<number>();
    for (const channel of this.channels()) {
      if (chosenChannelIds.has(channel.id)) {
        for (const acc of channel.whatsAppAccounts) {
          allowed.add(acc.whatsAppAccountId);
        }
      }
    }
    return this.numbers().filter((n) => allowed.has(n.id));
  });

  constructor() {
    // Prune distribution numbers that no longer belong to a selected channel.
    effect(() => {
      const allowedIds = new Set(this.availableNumbers().map((n) => n.id));
      const current = this.value().distributionWhatsAppAccountIds;
      const pruned = current.filter((id) => allowedIds.has(id));
      if (pruned.length !== current.length) {
        this.value.update((v) => ({ ...v, distributionWhatsAppAccountIds: pruned }));
      }
    });
  }

  // ─── Toggles ─────────────────────────────────────────────────────────────────
  isChannelOn = (id: number) => this.value().channelIds.includes(id);
  isNumberOn = (id: number) => this.value().distributionWhatsAppAccountIds.includes(id);
  isGroupOn = (id: number) => this.value().groupIds.includes(id);
  isShiftOn = (id: number) => this.value().shiftIds.includes(id);

  toggleChannel(id: number): void {
    this.value.update((v) => ({ ...v, channelIds: toggle(v.channelIds, id) }));
  }

  toggleNumber(id: number): void {
    this.value.update((v) => ({
      ...v,
      distributionWhatsAppAccountIds: toggle(v.distributionWhatsAppAccountIds, id),
    }));
  }

  toggleGroup(id: number): void {
    this.value.update((v) => ({ ...v, groupIds: toggle(v.groupIds, id) }));
  }

  toggleShift(id: number): void {
    this.value.update((v) => ({ ...v, shiftIds: toggle(v.shiftIds, id) }));
  }
}

function toggle(list: number[], id: number): number[] {
  return list.includes(id) ? list.filter((x) => x !== id) : [...list, id];
}
