/**
 * Auth store — survives across pages and feeds the transport
 * interceptor with the current token. Persisted to localStorage so
 * a hard reload doesn't kick the user out.
 *
 * Keep this store SMALL — only session data the whole app reads.
 * Form state, drafts, etc. live in feature-local stores/hooks.
 */
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { AuthSession, SessionUser } from "../contracts/auth.contract";

interface AuthState {
  session: AuthSession | null;
  setSession: (session: AuthSession | null) => void;
  setUser: (user: SessionUser) => void;
  clear: () => void;
  /** Wipes the session if `expiresAt` is already past. Run at boot. */
  clearIfExpired: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      session: null,
      setSession: (session) => set({ session }),
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
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ session: s.session }),
    },
  ),
);

/** Selector — returns the raw access token or null. Used by the L5 interceptor. */
export function selectAccessToken(): string | null {
  return useAuthStore.getState().session?.accessToken ?? null;
}
