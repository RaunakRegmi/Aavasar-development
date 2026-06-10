/**
 * Domain-level transport errors.
 *
 * Axios errors are an unstable shape (network vs. response vs. setup).
 * We normalize them at the interceptor into one of these classes so
 * upstream code can `instanceof`-match instead of inspecting `error.response.status`.
 *
 *   transport (axios)  →  interceptor maps  →  one of: ApiError, NetworkError, TimeoutError
 *   service / hook     →  catches the typed class
 */
export interface ApiErrorBody {
  /** Machine-readable error code from the backend (e.g. "VALIDATION_FAILED", "NOT_FOUND"). */
  code: string;
  /** Human-readable message safe to show, or fallback if backend omitted one. */
  message: string;
  /** Optional per-field errors for forms. */
  fields?: Record<string, string[]>;
  /** Trace id for support / debugging. */
  traceId?: string;
}

export class TransportError extends Error {
  readonly kind = "TransportError";
  constructor(message: string) {
    super(message);
    this.name = "TransportError";
  }
}

export class NetworkError extends TransportError {
  override readonly name = "NetworkError";
  constructor() {
    super("Network unreachable. Check your connection and try again.");
  }
}

export class TimeoutError extends TransportError {
  override readonly name = "TimeoutError";
  constructor() {
    super("The request timed out. Please try again.");
  }
}

export class ApiError extends TransportError {
  constructor(
    readonly status: number,
    readonly body: ApiErrorBody,
  ) {
    super(body.message || `Request failed with status ${status}`);
    this.name = "ApiError";
  }

  /** Convenience: 4xx is a client error (user-correctable). */
  get isClientError() {
    return this.status >= 400 && this.status < 500;
  }

  /** Convenience: 5xx is a server error (retry candidate). */
  get isServerError() {
    return this.status >= 500;
  }
}

export class UnauthorizedError extends ApiError {
  constructor(body: ApiErrorBody) {
    super(401, body);
    this.name = "UnauthorizedError";
  }
}

export class ForbiddenError extends ApiError {
  constructor(body: ApiErrorBody) {
    super(403, body);
    this.name = "ForbiddenError";
  }
}
