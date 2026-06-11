import type { ReactNode } from "react";
import { QueryProvider } from "./QueryProvider";
import { AuthBoot } from "./AuthBoot";
import { ToastProvider } from "@shared/ui";
import { MessagingProvider } from "@features/messaging";

/**
 * Composition root. Order matters:
 *
 *   QueryProvider — owns the React Query client, must be outermost since
 *                   AuthBoot subscribes to the QueryClient's caches.
 *   ToastProvider — must wrap AuthBoot because AuthBoot uses `useToast()`
 *                   to surface transport-level errors globally.
 *   AuthBoot      — wires the token provider, the 401-refresh interceptor,
 *                   and the global query/mutation error reporter.
 */
export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <QueryProvider>
      <ToastProvider>
        <AuthBoot>
          <MessagingProvider>{children}</MessagingProvider>
        </AuthBoot>
      </ToastProvider>
    </QueryProvider>
  );
}
