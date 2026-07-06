import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, effect, signal } from '@angular/core';

export type AppTheme = 'light' | 'dark';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private static readonly storageKey = 'waslx.theme';

  readonly theme = signal<AppTheme>(this.restoreTheme());

  constructor(@Inject(DOCUMENT) private readonly document: Document) {
    effect(() => {
      const currentTheme = this.theme();
      this.document.documentElement.setAttribute('data-theme', currentTheme);
      window.localStorage.setItem(ThemeService.storageKey, currentTheme);
    });
  }

  setTheme(theme: AppTheme): void {
    this.theme.set(theme);
  }

  toggleTheme(): void {
    this.theme.update((currentTheme) => (currentTheme === 'light' ? 'dark' : 'light'));
  }

  private restoreTheme(): AppTheme {
    if (typeof window === 'undefined') {
      return 'light';
    }

    const storedTheme = window.localStorage.getItem(ThemeService.storageKey);

    if (storedTheme === 'dark') {
      return 'dark';
    }

    if (storedTheme === 'light') {
      return 'light';
    }

    // Default to light for first-time visitors (ignore OS dark preference);
    // an explicit user toggle is remembered above.
    return 'light';
  }
}
