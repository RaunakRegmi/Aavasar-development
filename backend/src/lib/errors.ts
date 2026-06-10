/**
 * Domain error hierarchy.
 *
 * Two-axis classification:
 *   • OPERATIONAL  — the system worked correctly; the input/state was bad.
 *                    Examples: invalid email, gig not found, refresh token reused.
 *                    Safe to surface to the user; log at info/warn.
 *   • PROGRAMMER   — the system itself is wrong (null deref, missed switch,
 *                    contract violation, downstream timeout).
 *                    Log at fatal/error; never expose details to the user.
 *
 * The global error middleware reads `isOperational` to decide whether to
 * pass a useful message to the client or a generic "Something went wrong"
 * fallback. Programmer errors should also trigger pages / Sentry.
 *
 * Response shape — kept identical to the frontend's L6 `ApiErrorBody`:
 *   { code, message, fields?, traceId? }
 * so a 422 from this backend lights up form fields automatically.
 */

export interface ApiErrorBody {
  code: string;
  message: string;
  fields?: Record<string, string[]>;
  traceId?: string;
}

export abstract class AppError extends Error {
  abstract readonly status: number;
  abstract readonly code: string;
  /** Distinguishes "user-correctable" from "system bug". See file header. */
  readonly isOperational: boolean = true;
  readonly fields?: Record<string, string[]>;

  constructor(message: string, options?: { fields?: Record<string, string[]>; cause?: unknown }) {
    super(message);
    this.name = this.constructor.name;
    if (options?.fields) this.fields = options.fields;
    if (options?.cause !== undefined) (this as { cause?: unknown }).cause = options.cause;
  }

  toBody(traceId?: string): ApiErrorBody {
    const body: ApiErrorBody = { code: this.code, message: this.message };
    if (this.fields) body.fields = this.fields;
    if (traceId) body.traceId = traceId;
    return body;
  }
}

export class BadRequestError extends AppError {
  readonly status = 400;
  readonly code = "BAD_REQUEST";
}

export class ValidationError extends AppError {
  readonly status = 422;
  readonly code = "VALIDATION_FAILED";
  constructor(fields: Record<string, string[]>, message = "Some fields need attention.") {
    super(message, { fields });
  }
}

export class UnauthorizedError extends AppError {
  readonly status = 401;
  readonly code = "UNAUTHORIZED";
  constructor(message = "You must be signed in.") {
    super(message);
  }
}

export class ForbiddenError extends AppError {
  readonly status = 403;
  readonly code = "FORBIDDEN";
  constructor(message = "You don't have access to this resource.") {
    super(message);
  }
}

export class NotFoundError extends AppError {
  readonly status = 404;
  readonly code = "NOT_FOUND";
  constructor(message = "Resource not found.") {
    super(message);
  }
}

export class ConflictError extends AppError {
  readonly status = 409;
  readonly code = "CONFLICT";
}

export class RateLimitError extends AppError {
  readonly status = 429;
  readonly code = "TOO_MANY_REQUESTS";
  constructor(
    readonly retryAfterSeconds: number,
    message = "Too many requests — please slow down.",
  ) {
    super(message);
  }
}

export class ServiceUnavailableError extends AppError {
  readonly status = 503;
  readonly code = "SERVICE_UNAVAILABLE";
}

/**
 * Internal sentinel — used when we KNOW the failure was a programmer bug
 * (assertion, invariant break). The global handler renders a generic
 * 500 message but logs the original error and stack.
 */
export class InternalError extends AppError {
  readonly status = 500;
  readonly code = "INTERNAL_ERROR";
  override readonly isOperational = false;
  constructor(message = "An unexpected error occurred.", cause?: unknown) {
    super(message, { cause });
  }
}
