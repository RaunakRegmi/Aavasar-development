/**
 * Toast / Toaster
 * --------------------------------------------------------------
 * A tiny, dependency-free notification system that obeys the DS:
 *   • slate-on-white / colored borders, no emoji, no shadows-of-doom
 *   • 4 tones map to the same palette used by Badge
 *   • dismiss on timeout (default 4.5s) OR user click
 *
 * Usage from a component:
 *
 *     const toast = useToast();
 *     toast.error("Couldn't sign you in.", { description: err.body.message });
 *
 * Components NEVER render this themselves — the Toaster is mounted once
 * at the root by `ToastProvider`. Imperative push via context only.
 */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Icon, type IconName } from "@shared/icons";

export type ToastTone = "success" | "error" | "info" | "warning";

interface ToastInput {
  title: string;
  description?: string;
  /** ms before auto-dismiss. Pass 0 for sticky. Default 4500. */
  duration?: number;
}

interface ToastItem extends ToastInput {
  id: number;
  tone: ToastTone;
}

interface ToastApi {
  push: (tone: ToastTone, input: ToastInput) => number;
  success: (title: string, opts?: Omit<ToastInput, "title">) => number;
  error: (title: string, opts?: Omit<ToastInput, "title">) => number;
  info: (title: string, opts?: Omit<ToastInput, "title">) => number;
  warning: (title: string, opts?: Omit<ToastInput, "title">) => number;
  dismiss: (id: number) => void;
  clear: () => void;
}

const ToastContext = createContext<ToastApi | null>(null);

let externalApi: ToastApi | null = null;

/**
 * Imperative escape hatch — for code paths that aren't inside the React
 * tree (e.g. the L5 transport interceptor). Always prefer `useToast()`
 * inside components.
 */
export function getToastApi(): ToastApi | null {
  return externalApi;
}

export function useToast(): ToastApi {
  const api = useContext(ToastContext);
  if (!api) {
    throw new Error("useToast() called outside <ToastProvider>");
  }
  return api;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const idRef = useRef(0);

  const dismiss = useCallback((id: number) => {
    setItems((xs) => xs.filter((t) => t.id !== id));
  }, []);

  const push = useCallback(
    (tone: ToastTone, input: ToastInput) => {
      const id = ++idRef.current;
      const duration = input.duration ?? 4500;
      setItems((xs) => [...xs, { ...input, id, tone }]);
      if (duration > 0) {
        window.setTimeout(() => dismiss(id), duration);
      }
      return id;
    },
    [dismiss],
  );

  const api: ToastApi = useMemo(
    () => ({
      push,
      success: (title, opts) => push("success", { title, ...opts }),
      error: (title, opts) => push("error", { title, ...opts }),
      info: (title, opts) => push("info", { title, ...opts }),
      warning: (title, opts) => push("warning", { title, ...opts }),
      dismiss,
      clear: () => setItems([]),
    }),
    [push, dismiss],
  );

  useEffect(() => {
    externalApi = api;
    return () => {
      externalApi = null;
    };
  }, [api]);

  return (
    <ToastContext.Provider value={api}>
      {children}
      <Toaster items={items} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
}

const TONE_LOOK: Record<
  ToastTone,
  { icon: IconName; accent: string; bg: string; text: string }
> = {
  success: {
    icon: "CheckCircle2",
    accent: "var(--success-500)",
    bg: "var(--success-100)",
    text: "var(--success-700-text)",
  },
  error: {
    icon: "AlertCircle",
    accent: "var(--danger-500)",
    bg: "var(--danger-100)",
    text: "var(--danger-700-text)",
  },
  info: {
    icon: "Info",
    accent: "var(--info-500)",
    bg: "var(--info-100)",
    text: "var(--info-700-text)",
  },
  warning: {
    icon: "TriangleAlert",
    accent: "var(--warning-500)",
    bg: "var(--warning-100)",
    text: "var(--warning-500)",
  },
};

function Toaster({
  items,
  onDismiss,
}: {
  items: ToastItem[];
  onDismiss: (id: number) => void;
}) {
  return (
    <div
      role="region"
      aria-label="Notifications"
      style={{
        position: "fixed",
        bottom: 24,
        right: 24,
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        gap: 10,
        maxWidth: 380,
        pointerEvents: "none",
      }}
    >
      {items.map((t) => {
        const look = TONE_LOOK[t.tone];
        return (
          <div
            key={t.id}
            role={t.tone === "error" ? "alert" : "status"}
            style={{
              pointerEvents: "auto",
              background: "var(--surface-0)",
              border: "1px solid var(--border-default)",
              borderLeft: `4px solid ${look.accent}`,
              borderRadius: "var(--radius-sm)",
              padding: "14px 16px",
              display: "flex",
              gap: 12,
              alignItems: "flex-start",
              boxShadow: "var(--shadow-md)",
              animation: "aav-toast-in var(--dur-base) var(--ease-out)",
            }}
          >
            <span
              style={{
                width: 32,
                height: 32,
                borderRadius: "var(--radius-sm)",
                background: look.bg,
                color: look.text,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Icon name={look.icon} size={18} />
            </span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontFamily: "var(--font-text)",
                  fontWeight: 600,
                  fontSize: 14,
                  color: "var(--text-strong)",
                  lineHeight: 1.4,
                }}
              >
                {t.title}
              </div>
              {t.description && (
                <div
                  style={{
                    fontFamily: "var(--font-text)",
                    fontSize: 13,
                    color: "var(--text-muted)",
                    marginTop: 2,
                    lineHeight: 1.45,
                  }}
                >
                  {t.description}
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={() => onDismiss(t.id)}
              aria-label="Dismiss"
              style={{
                background: "transparent",
                border: "none",
                cursor: "pointer",
                color: "var(--ink-500)",
                padding: 4,
                display: "inline-flex",
              }}
            >
              <Icon name="X" size={16} />
            </button>
          </div>
        );
      })}
      <style>{`@keyframes aav-toast-in {
        from { opacity: 0; transform: translateY(8px); }
        to   { opacity: 1; transform: translateY(0); }
      }`}</style>
    </div>
  );
}
