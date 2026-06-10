/**
 * Profile update — calls PATCH /auth/me and refreshes the session user
 * in the auth store so every consumer (avatars, header greetings,
 * gated routes) sees the new value without a manual refetch.
 */
import { authService } from "../api/auth.service";
import {
  UpdateProfileRequestSchema,
  type SessionUser,
  type UpdateProfileRequest,
} from "../contracts/auth.contract";
import { useAuthStore } from "../store/auth.store";

export async function updateProfile(input: UpdateProfileRequest): Promise<SessionUser> {
  const payload = UpdateProfileRequestSchema.parse(input);
  const user = await authService.updateProfile(payload);
  useAuthStore.getState().setUser(user);
  return user;
}
