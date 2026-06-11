/**
 * Auth store — survives across pages and feeds the transport
 * interceptor with the current token.
 *
 * Persistence strategy:
 *   • "Remember me" CHECKED  → localStorage  (survives refresh AND a full
 *     browser restart — the session is effectively permanent; the backend
 *     issues a long, sliding-window refresh token).
 *   • "Remember me" UNCHECKED → sessionStorage (survives a page refresh
 *     within the tab, but dies when the tab/browser closes).
 *
 * The chosen backend depends on the `remember` flag, which we mirror into
 * a tiny dedicated localStorage key so the persist layer can pick the
 * right backend at BOOT — before the store state itself is rehydrated.
 * A naive `() => remember ? localStorage : sessionStorage` can't work:
 * zustand evaluates the storage getter once, before `remember` is known.
 * The adapter below instead dispatches on every read/write.
 *
 * Keep this store SMALL — only session data the whole app reads.
 */
import { create } from "zustand";
import { persist, createJSONStorage, type StateStorage } from "zustand/middleware";
import type { AuthSession, SessionUser } from "../contracts/auth.contract";

const REMEMBER_KEY = "aavasar.remember";

/** Read the persisted "remember" preference (defaults to true). */
function readRemember(): boolean {
  try {
    return localStorage.getItem(REMEMBER_KEY) !== "false";
  } catch {
    return true;
  }
}

/** Mirror the preference into localStorage so boot picks the right backend. */
function writeRemember(remember: boolean): void {
  try {
    localStorage.setItem(REMEMBER_KEY, String(remember));
  } catch {
    /* storage unavailable (private mode) — fall back to in-memory only */
  }
}

/**
 * Storage adapter that dispatches to localStorage or sessionStorage based
 * on the current `remember` flag, per call. Reads fall back to the other
 * backend (covers a just-toggled preference); writes clear the other
 * backend so a stale copy can never shadow the live one at boot.
 */
const dynamicStorage: StateStorage = {
  getItem: (name) => {
    try {
      const primary = readRemember() ? localStorage : sessionStorage;
      const fallback = readRemember() ? sessionStorage : localStorage;
      return primary.getItem(name) ?? fallback.getItem(name);
    } catch {
      return null;
    }
  },
  setItem: (name, value) => {
    try {
      const active = readRemember() ? localStorage : sessionStorage;
      const other = readRemember() ? sessionStorage : localStorage;
      active.setItem(name, value);
      other.removeItem(name);
    } catch {
      /* ignore */
    }
  },
  removeItem: (name) => {
    try {
      localStorage.removeItem(name);
      sessionStorage.removeItem(name);
    } catch {
      /* ignore */
    }
  },
};

interface AuthState {
  session: AuthSession | null;
  remember: boolean;
  setSession: (session: AuthSession | null) => void;
  setRemember: (remember: boolean) => void;
  setUser: (user: SessionUser) => void;
  clear: () => void;
  /** Wipes the session if `expiresAt` is already past. */
  clearIfExpired: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      session: null,
      remember: readRemember(),
      setSession: (session) => set({ session }),
      setRemember: (remember) => {
        // Persist the flag BEFORE state changes so the very next storage
        // write lands in the correct backend.
        writeRemember(remember);
        set({ remember });
      },
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
      storage: createJSONStorage(() => dynamicStorage),
      partialize: (s) => ({ session: s.session, remember: s.remember }),
    },
  ),
);

/** Selector — returns the raw access token or null. Used by the L5 interceptor. */
export function selectAccessToken(): string | null {
  return useAuthStore.getState().session?.accessToken ?? null;
}
