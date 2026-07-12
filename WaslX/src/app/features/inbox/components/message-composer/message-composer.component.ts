import { ChangeDetectionStrategy, Component, ElementRef, computed, input, output, signal, viewChild } from '@angular/core';

import { IconComponent } from '../../../../shared/components/icon/icon.component';

const MAX_FILE_BYTES = 20 * 1024 * 1024; // 20 MB (WhatsApp document limit-ish)

/** WhatsApp-sendable media: images, video, audio, and a small set of document types. */
function isSupportedType(type: string): boolean {
  if (type.startsWith('image/') || type.startsWith('video/') || type.startsWith('audio/')) return true;
  return [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'text/plain',
    'text/csv'
  ].includes(type);
}

/**
 * Text composer with Enter-to-send / Shift+Enter-for-newline. Adds (FE-2.6) an image/video
 * preview thumbnail, upload progress, and MIME-type + size validation, plus a template button and
 * the 24-hour-window lock (FE-2.7): when the window is closed, free text is disabled and only a
 * template may be sent.
 */
@Component({
  selector: 'app-message-composer',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconComponent],
  template: `
    @if (windowClosed()) {
      <div class="composer__window">
        <app-icon name="clock" [size]="15" />
        <div class="composer__window-text">
          <strong>{{ windowClosedTitle() }}</strong>
          <span>{{ windowClosedHint() }}</span>
        </div>
      </div>
    }
    <form class="composer" (submit)="submit($event)">
      @if (selectedFile(); as file) {
        <div class="composer__attachment">
          @if (previewUrl(); as url) {
            @if (isImage()) {
              <img class="composer__thumb" [src]="url" [alt]="file.name" />
            } @else if (isVideo()) {
              <video class="composer__thumb" [src]="url" muted></video>
            } @else {
              <span class="composer__thumb composer__thumb--doc"><app-icon name="folder" [size]="18" /></span>
            }
          } @else {
            <span class="composer__thumb composer__thumb--doc"><app-icon name="folder" [size]="18" /></span>
          }
          <span class="composer__attachment-name">{{ file.name }}</span>
          @if (sending() && uploadProgress() !== null) {
            <span class="composer__progress"><span class="composer__progress-bar" [style.width.%]="uploadProgress()"></span></span>
          }
          <button type="button" class="composer__attachment-remove" [disabled]="sending()" [attr.aria-label]="removeAttachmentLabel()" (click)="clearFile()">
            <app-icon name="x" [size]="12" />
          </button>
        </div>
      }
      <button
        type="button"
        class="composer__tool"
        [disabled]="sending()"
        [attr.aria-label]="templateLabel()"
        [title]="templateLabel()"
        (click)="openTemplates.emit()"
      >
        <app-icon name="layers" [size]="18" />
      </button>
      <button
        type="button"
        class="composer__tool"
        [disabled]="sending() || windowClosed()"
        [attr.aria-label]="attachLabel()"
        [title]="attachLabel()"
        (click)="fileInputRef().nativeElement.click()"
      >
        <app-icon name="paperclip" [size]="18" />
      </button>
      <input #fileInput type="file" class="composer__file-input"
             accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv"
             (change)="onFileSelected($event)" />
      <textarea
        class="composer__field"
        rows="1"
        [placeholder]="windowClosed() ? windowClosedTitle() : (selectedFile() ? captionPlaceholder() : placeholder())"
        [value]="draft()"
        [disabled]="sending() || (windowClosed() && !selectedFile())"
        (input)="onInput($event)"
        (keydown)="onKeydown($event)"
      ></textarea>
      <button
        type="submit"
        class="composer__send"
        [disabled]="sending() || (windowClosed() && !selectedFile()) || (!selectedFile() && draft().trim().length === 0)"
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
    .composer__window {
      display: flex; align-items: center; gap: 10px;
      padding: 10px 18px;
      background: color-mix(in srgb, #d97706 10%, var(--surface));
      border-top: 1px solid color-mix(in srgb, #d97706 30%, var(--border-subtle));
      color: #b45309;
    }
    .composer__window svg { fill: none; stroke: currentColor; stroke-width: 2; flex: 0 0 auto; }
    .composer__window-text { display: flex; flex-direction: column; gap: 1px; font-size: 0.78rem; line-height: 1.35; }
    .composer__window-text strong { font-size: 0.82rem; }
    .composer__attachment {
      flex: 1 1 100%;
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 8px 10px;
      border-radius: 10px;
      background: var(--surface-soft);
      border: 1px solid var(--border-soft);
      font-size: 0.8rem;
      color: var(--text-secondary);
    }
    .composer__thumb { width: 40px; height: 40px; border-radius: 8px; object-fit: cover; flex: 0 0 auto; background: var(--surface); }
    .composer__thumb--doc { display: grid; place-items: center; color: var(--text-muted); border: 1px solid var(--border-soft); }
    .composer__attachment-name { flex: 1 1 auto; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .composer__progress { flex: 0 0 80px; height: 6px; border-radius: 999px; background: var(--border-soft); overflow: hidden; }
    .composer__progress-bar { display: block; height: 100%; background: linear-gradient(135deg, var(--primary), var(--accent)); transition: width 120ms ease; }
    .composer__attachment-remove {
      display: grid; place-items: center;
      width: 22px; height: 22px; flex: 0 0 auto;
      border: 0; border-radius: 6px;
      background: transparent;
      color: var(--text-muted);
      cursor: pointer;
    }
    .composer__attachment-remove:hover:not(:disabled) { background: color-mix(in srgb, var(--danger, #ef4444) 12%, transparent); color: var(--danger, #ef4444); }
    .composer__tool {
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
    .composer__tool:hover:not(:disabled) { background: var(--surface-soft); color: var(--text-secondary); }
    .composer__tool:disabled { opacity: 0.4; cursor: not-allowed; }
    .composer__tool svg { fill: none; stroke: currentColor; stroke-width: 2; }
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
  readonly templateLabel = input('Send a template');
  readonly removeAttachmentLabel = input('Remove attachment');
  readonly windowClosedTitle = input('24-hour window closed');
  readonly windowClosedHint = input('Send an approved template to re-engage.');
  readonly sending = input(false);
  readonly windowClosed = input(false);
  readonly uploadProgress = input<number | null>(null);

  readonly send = output<string>();
  readonly sendMedia = output<{ file: File; caption: string }>();
  readonly attachError = output<'too-large' | 'unsupported-type'>();
  readonly openTemplates = output<void>();

  protected readonly draft = signal('');
  protected readonly selectedFile = signal<File | null>(null);
  protected readonly previewUrl = signal<string | null>(null);
  protected readonly fileInputRef = viewChild.required<ElementRef<HTMLInputElement>>('fileInput');

  protected readonly isImage = computed(() => this.selectedFile()?.type.startsWith('image/') ?? false);
  protected readonly isVideo = computed(() => this.selectedFile()?.type.startsWith('video/') ?? false);

  protected onInput(event: Event): void {
    this.draft.set((event.target as HTMLTextAreaElement).value);
  }

  protected onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;
    input.value = ''; // allow re-selecting the same file later
    if (!file) return;

    if (!isSupportedType(file.type)) {
      this.attachError.emit('unsupported-type');
      return;
    }
    if (file.size > MAX_FILE_BYTES) {
      this.attachError.emit('too-large');
      return;
    }
    this.setFile(file);
  }

  private setFile(file: File): void {
    this.revokePreview();
    this.selectedFile.set(file);
    this.previewUrl.set(
      file.type.startsWith('image/') || file.type.startsWith('video/') ? URL.createObjectURL(file) : null
    );
  }

  protected clearFile(): void {
    this.revokePreview();
    this.selectedFile.set(null);
  }

  private revokePreview(): void {
    const url = this.previewUrl();
    if (url) URL.revokeObjectURL(url);
    this.previewUrl.set(null);
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
      this.revokePreview();
      this.selectedFile.set(null);
      this.draft.set('');
      return;
    }

    if (this.windowClosed()) return;

    const text = this.draft().trim();
    if (!text) return;
    this.send.emit(text);
    this.draft.set('');
  }
}
