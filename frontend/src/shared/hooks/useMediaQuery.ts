/**
 * Media-query hooks for responsive behaviour that genuinely needs JS
 * (the app shell switching between a desktop sidebar and a mobile bottom
 * tab bar, the messages two-pane → single-pane, etc.). Most responsive
 * layout is handled by the CSS utility classes in styles/responsive.css —
 * reach for these hooks only when a render decision depends on viewport.
 */
import { useEffect, useState } from "react";

/** Shared breakpoints (px). Keep in sync with styles/responsive.css. */
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
} as const;

/**
 * Subscribe to a CSS media query. SSR-safe-ish: defaults to `false` when
 * `window`/`matchMedia` is unavailable, then syncs on mount.
 */
export function useMediaQuery(query: string): boolean {
  const get = () =>
    typeof window !== "undefined" && typeof window.matchMedia === "function"
      ? window.matchMedia(query).matches
      : false;

  const [matches, setMatches] = useState(get);

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") return;
    const mql = window.matchMedia(query);
    const onChange = () => setMatches(mql.matches);
    onChange(); // sync immediately in case it changed before the listener attached
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [query]);

  return matches;
}

/** True on phones / small tablets (≤768px) — drives the mobile shell. */
export function useIsMobile(): boolean {
  return useMediaQuery(`(max-width: ${BREAKPOINTS.md}px)`);
}
