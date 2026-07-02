import { Injectable, signal } from '@angular/core';

export type ToastTone = 'success' | 'error' | 'info' | 'warning';

export interface ToastMessage {
  readonly id: string;
  readonly tone: ToastTone;
  readonly title: string;
  readonly message: string;
  readonly timeoutMs: number;
}

@Injectable({ providedIn: 'root' })

export class ToastService {
  readonly toasts = signal<readonly ToastMessage[]>([]);
  private readonly timers = new Map<string, ReturnType<typeof window.setTimeout>>();

  success(title: string, message: string): string {
    return this.push({ tone: 'success', title, message });
  }

  error(title: string, message: string): string {
    return this.push({ tone: 'error', title, message, timeoutMs: 6000 });
  }

  info(title: string, message: string): string {
    return this.push({ tone: 'info', title, message });
  }

  warning(title: string, message: string): string {
    return this.push({ tone: 'warning', title, message });
  }

  dismiss(id: string): void {
    const timer = this.timers.get(id);

    if (timer) {
      window.clearTimeout(timer);
      this.timers.delete(id);
    }

    this.toasts.update((currentToasts) => currentToasts.filter((toast) => toast.id !== id));
  }

  private push(input: Omit<ToastMessage, 'id' | 'timeoutMs'> & Partial<Pick<ToastMessage, 'timeoutMs'>>): string {
    const id = crypto.randomUUID();
    const toast: ToastMessage = {
      id,
      tone: input.tone,
      title: input.title,
      message: input.message,
      timeoutMs: input.timeoutMs ?? 4500
    };

    this.toasts.update((currentToasts) => [toast, ...currentToasts].slice(0, 4));

    const timer = window.setTimeout(() => this.dismiss(id), toast.timeoutMs);
    this.timers.set(id, timer);

    return id;
  }
}
