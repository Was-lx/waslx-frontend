import { ChangeDetectionStrategy, Component, ElementRef, input, output, signal, viewChild } from '@angular/core';

import { IconComponent } from '../../../../shared/components/icon/icon.component';

const MAX_FILE_BYTES = 20 * 1024 * 1024; // 20 MB

/**
 * Text composer with Enter-to-send / Shift+Enter-for-newline. Disables the send button
 * while a send is in flight (double-send guard). Emits the trimmed text on send, or a
 * {file, caption} payload once a file is attached via the paperclip button.
 */
@Component({
  selector: 'app-message-composer',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconComponent],
  template: `
    <form class="composer" (submit)="submit($event)">
      @if (selectedFile(); as file) {
        <span class="composer__attachment">
          <app-icon name="folder" [size]="14" />
          <span class="composer__attachment-name">{{ file.name }}</span>
          <button type="button" class="composer__attachment-remove" [attr.aria-label]="removeAttachmentLabel()" (click)="clearFile()">
            <app-icon name="x" [size]="12" />
          </button>
        </span>
      }
      <button
        type="button"
        class="composer__attach"
        [disabled]="sending()"
        [attr.aria-label]="attachLabel()"
        [title]="attachLabel()"
        (click)="fileInputRef().nativeElement.click()"
      >
        <app-icon name="paperclip" [size]="18" />
      </button>
      <input #fileInput type="file" class="composer__file-input" (change)="onFileSelected($event)" />
      <textarea
        class="composer__field"
        rows="1"
        [placeholder]="selectedFile() ? captionPlaceholder() : placeholder()"
        [value]="draft()"
        [disabled]="sending()"
        (input)="onInput($event)"
        (keydown)="onKeydown($event)"
      ></textarea>
      <button
        type="submit"
        class="composer__send"
        [disabled]="sending() || (!selectedFile() && draft().trim().length === 0)"
        [attr.aria-label]="placeholder()"
      >
        <app-icon name="send" [size]="19" />
      </button>
    </form>
  `,
  styles: [`
    .composer {
      display: flex;
      flex-wrap: wrap;
      align-items: flex-end;
      gap: 10px;
      padding: 14px 18px;
      border-top: 1px solid var(--border-subtle);
      background: var(--surface);
    }
    .composer__attachment {
      flex: 1 1 100%;
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 6px 10px;
      border-radius: 8px;
      background: var(--surface-soft);
      border: 1px solid var(--border-soft);
      font-size: 0.8rem;
      color: var(--text-secondary);
    }
    .composer__attachment-name { flex: 1 1 auto; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .composer__attachment-remove {
      display: grid; place-items: center;
      width: 20px; height: 20px;
      border: 0; border-radius: 6px;
      background: transparent;
      color: var(--text-muted);
      cursor: pointer;
    }
    .composer__attachment-remove:hover { background: color-mix(in srgb, var(--danger, #ef4444) 12%, transparent); color: var(--danger, #ef4444); }
    .composer__attach {
      display: grid;
      place-items: center;
      width: 40px;
      height: 44px;
      flex: 0 0 auto;
      border: 0;
      background: transparent;
      color: var(--text-muted);
      cursor: pointer;
      border-radius: 10px;
    }
    .composer__attach:hover { background: var(--surface-soft); color: var(--text-secondary); }
    .composer__attach:disabled { opacity: 0.5; cursor: not-allowed; }
    .composer__file-input { display: none; }
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
  readonly captionPlaceholder = input('Add a caption…');
  readonly attachLabel = input('Attach a file');
  readonly removeAttachmentLabel = input('Remove attachment');
  readonly sending = input(false);
  readonly send = output<string>();
  readonly sendMedia = output<{ file: File; caption: string }>();
  readonly attachError = output<'too-large'>();

  protected readonly draft = signal('');
  protected readonly selectedFile = signal<File | null>(null);
  protected readonly fileInputRef = viewChild.required<ElementRef<HTMLInputElement>>('fileInput');

  protected onInput(event: Event): void {
    this.draft.set((event.target as HTMLTextAreaElement).value);
  }

  protected onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;
    input.value = ''; // allow re-selecting the same file later
    if (!file) return;

    if (file.size > MAX_FILE_BYTES) {
      this.attachError.emit('too-large');
      return;
    }
    this.selectedFile.set(file);
  }

  protected clearFile(): void {
    this.selectedFile.set(null);
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
    if (this.sending()) return;

    const file = this.selectedFile();
    if (file) {
      this.sendMedia.emit({ file, caption: this.draft().trim() });
      this.selectedFile.set(null);
      this.draft.set('');
      return;
    }

    const text = this.draft().trim();
    if (!text) return;
    this.send.emit(text);
    this.draft.set('');
  }
}
