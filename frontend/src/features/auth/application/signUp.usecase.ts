/**
 * LAYER 3 — Sign-up use case
 * --------------------------------------------------------------
 * Orchestrates the full business flow when a user submits the
 * sign-up form. The hook (L2) calls this; the use case in turn:
 *
 *   1. Validates the payload through the contract (L6).
 *   2. Calls the service (L4) to hit the API.
 *   3. Persists the session into the global auth store.
 *   4. Returns the freshly-created SessionUser to the caller.
 *
 * Why a separate layer (and not "just put it in the hook"):
 *   • the same flow is reusable from places that aren't React
 *     (e.g. social-login callback, deep link handler, tests)
 *   • the hook stays a thin cache/binding for React Query
 *   • every cross-feature side effect is in ONE auditable file
 */
import { authService } from "../api/auth.service";
import {
  SignUpRequestSchema,
  type AuthSession,
  type SignUpRequest,
} from "../contracts/auth.contract";
import { useAuthStore } from "../store/auth.store";

export async function signUp(input: SignUpRequest): Promise<AuthSession> {
  const payload = SignUpRequestSchema.parse(input); // L6 validate
  const session = await authService.signUp(payload); // L4 → L5 → wire → L4
  useAuthStore.getState().setSession(session);       // commit to store
  return session;
}
