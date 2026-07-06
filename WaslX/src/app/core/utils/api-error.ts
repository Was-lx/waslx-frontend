import { HttpErrorResponse } from '@angular/common/http';

/**
 * The backend serialises domain failures as RFC7807 ProblemDetails with an
 * `errors` extension array of `[code, description]` (see ResultExtensions.ToProblem).
 * This normalises that (and a couple of fallback shapes) into `{ code, message }`.
 */
export function apiError(err: unknown): { code: string | null; message: string | null } {
  const body = err instanceof HttpErrorResponse ? err.error : (err as any)?.error ?? err;

  const errors = body?.errors;
  if (Array.isArray(errors) && errors.length > 0) {
    return { code: errors[0] ?? null, message: errors[1] ?? errors[0] ?? null };
  }

  // Fallbacks for non-ProblemDetails responses.
  const message = body?.description ?? body?.message ?? (err as any)?.message ?? null;
  return { code: body?.code ?? null, message };
}

/** Convenience: the human message, or a provided fallback. */
export function apiErrorMessage(err: unknown, fallback: string): string {
  return apiError(err).message || fallback;
}
