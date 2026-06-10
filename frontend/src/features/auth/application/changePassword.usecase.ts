/**
 * Change password — POSTs `/auth/password`. On 204 the backend has:
 *   1) verified the current password
 *   2) hashed + stored the new one
 *   3) bumped `tokenVersion` (force-logging-out every other device)
 *   4) revoked all refresh tokens
 *
 * The client follows that by clearing local session state, so the user
 * is then asked to re-authenticate with the new credentials. The
 * "log everywhere out" behavior matches industry expectation after a
 * voluntary password rotation.
 */
import {
  ChangePasswordRequestSchema,
  type ChangePasswordRequest,
} from "../contracts/auth.contract";
import { authService } from "../api/auth.service";
import { useAuthStore } from "../store/auth.store";

export async function changePassword(input: ChangePasswordRequest): Promise<void> {
  const payload = ChangePasswordRequestSchema.parse(input);
  await authService.changePassword(payload);
  // Clear session so the next navigation hits the auth guard → /log-in.
  useAuthStore.getState().clear();
}
