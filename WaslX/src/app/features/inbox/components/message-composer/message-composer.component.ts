import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';

import { IconComponent } from '../../../../shared/components/icon/icon.component';

/**
 * Text composer with Enter-to-send / Shift+Enter-for-newline. Disables the send button
 * while a send is in flight (double-send guard). Emits the trimmed text on send.
 */
@Component({
  selector: 'app-message-composer',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconComponent],
  template: `
    <form class="composer" (submit)="submit($event)">
      <textarea
        class="composer__field"
        rows="1"
        [placeholder]="placeholder()"
        [value]="draft()"
        [disabled]="sending()"
        (input)="onInput($event)"
        (keydown)="onKeydown($event)"
      ></textarea>
      <button
        type="submit"
        class="composer__send"
        [disabled]="sending() || draft().trim().length === 0"
        [attr.aria-label]="placeholder()"
      >
        <app-icon name="send" [size]="19" />
      </button>
    </form>
  `,
  styles: [`
    .composer {
      display: flex;
      align-items: flex-end;
      gap: 10px;
      padding: 14px 18px;
      border-top: 1px solid var(--border-subtle);
      background: var(--surface);
    }
    .composer__field {
      flex: 1 1 auto;
      resize: none;
      max-height: 140px;
      padding: 11px 16px;
      border-radius: 12px;
      background: var(--surface-soft);
      border: 1px solid var(--border-soft);
      color: var(--text-primary);
      font: inherit;
      font-size: 0.9rem;
      line-height: 1.5;
    }
    .composer__field:focus-visible { outline: none; border-color: color-mix(in srgb, var(--primary) 45%, var(--border-soft)); box-shadow: var(--focus-ring); }
    .composer__field:disabled { opacity: 0.6; }
    .composer__send {
      display: grid;
      place-items: center;
      width: 44px;
      height: 44px;
      flex: 0 0 auto;
      border: 0;
      border-radius: 12px;
      background: linear-gradient(135deg, var(--primary), var(--accent));
      color: #fff;
      cursor: pointer;
      box-shadow: 0 6px 16px color-mix(in srgb, var(--primary) 30%, transparent);
      transition: opacity 140ms ease;
    }
    .composer__send:disabled { opacity: 0.5; cursor: not-allowed; box-shadow: none; }
    .composer__send svg { fill: none; stroke: currentColor; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
    [dir='rtl'] .composer__send svg { transform: scaleX(-1); }
  `]
})
export class MessageComposerComponent {
  readonly placeholder = input('Type a reply…');
  readonly sending = input(false);
  readonly send = output<string>();

  protected readonly draft = signal('');

  protected onInput(event: Event): void {
    this.draft.set((event.target as HTMLTextAreaElement).value);
  }

  protected onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.emit();
    }
  }

  protected submit(event: Event): void {
    event.preventDefault();
    this.emit();
  }

  private emit(): void {
    const text = this.draft().trim();
    if (!text || this.sending()) {
      return;
    }
    this.send.emit(text);
    this.draft.set('');
  }
}
