/**
 * Auth store — survives across pages and feeds the transport
 * interceptor with the current token. Persisted to localStorage so
 * a hard reload doesn't kick the user out. When "Remember me" is
 * unchecked, sessionStorage is used instead so the session dies on
 * tab close.
 *
 * Keep this store SMALL — only session data the whole app reads.
 * Form state, drafts, etc. live in feature-local stores/hooks.
 */
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { AuthSession, SessionUser } from "../contracts/auth.contract";

interface AuthState {
  session: AuthSession | null;
  remember: boolean;
  setSession: (session: AuthSession | null) => void;
  setRemember: (remember: boolean) => void;
  setUser: (user: SessionUser) => void;
  clear: () => void;
  /** Wipes the session if `expiresAt` is already past. Run at boot. */
  clearIfExpired: () => boolean;
}

/**
 * Pick storage based on the "remember me" preference.
 * sessionStorage = lost on tab close; localStorage = survives restart.
 */
function selectStorage(): Storage {
  const s = useAuthStore.getState();
  return s.remember ? localStorage : sessionStorage;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      session: null,
      remember: true,
      setSession: (session) => set({ session }),
      setRemember: (remember) => set({ remember }),
      setUser: (user) =>
        set((s) => (s.session ? { session: { ...s.session, user } } : s)),
      clear: () => set({ session: null }),
      clearIfExpired: () => {
        const s = useAuthStore.getState().session;
        if (s && Date.parse(s.expiresAt) <= Date.now()) {
          set({ session: null });
          return true;
        }
        return false;
      },
    }),
    {
      name: "aavasar.auth",
      storage: createJSONStorage(() => selectStorage()),
      partialize: (s) => ({ session: s.session, remember: s.remember }),
    },
  ),
);

/** Selector — returns the raw access token or null. Used by the L5 interceptor. */
export function selectAccessToken(): string | null {
  return useAuthStore.getState().session?.accessToken ?? null;
}
