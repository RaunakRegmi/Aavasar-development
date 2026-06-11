import { authService } from "../api/auth.service";
import {
  LogInRequestSchema,
  type AuthSession,
  type LogInRequest,
} from "../contracts/auth.contract";
import { useAuthStore } from "../store/auth.store";

export async function logIn(input: LogInRequest): Promise<AuthSession> {
  const payload = LogInRequestSchema.parse(input);
  const session = await authService.logIn(payload);
  // Persist "remember me" preference so the store picks the right
  // storage backend (localStorage vs sessionStorage).
  useAuthStore.getState().setRemember(payload.remember ?? true);
  useAuthStore.getState().setSession(session);
  return session;
}

export async function logOut(): Promise<void> {
  try {
    await authService.logOut();
  } finally {
    useAuthStore.getState().clear();
  }
}
