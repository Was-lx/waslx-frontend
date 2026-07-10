import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

/**
 * Generic initials avatar with a stable per-name gradient.
 *
 *   <app-avatar [name]="'Layla Hassan'" [size]="38" />
 */
@Component({
  selector: 'app-avatar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span
      class="avatar"
      [style.--a]="colors().a"
      [style.--b]="colors().b"
      [style.width.px]="size()"
      [style.height.px]="size()"
      [attr.aria-hidden]="true"
    >{{ initials() }}</span>
  `,
  styles: [`
    .avatar {
      display: grid;
      place-items: center;
      flex: 0 0 auto;
      border-radius: 12px;
      color: #fff;
      font-size: 0.78rem;
      font-weight: 700;
      letter-spacing: 0.02em;
      background: linear-gradient(135deg, var(--a, var(--primary)), var(--b, var(--accent)));
      box-shadow: 0 4px 12px color-mix(in srgb, var(--a, var(--primary)) 30%, transparent);
    }
  `]
})
export class AvatarComponent {
  readonly name = input('');
  readonly size = input(38);

  protected readonly initials = computed(() => {
    const parts = this.name().trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return '?';
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  });

  // Stable hue pair derived from the name so the same customer always looks the same.
  protected readonly colors = computed(() => {
    const name = this.name() || '?';
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
    }
    const h1 = hash % 360;
    const h2 = (h1 + 40) % 360;
    return { a: `hsl(${h1} 62% 52%)`, b: `hsl(${h2} 64% 42%)` };
  });
}
