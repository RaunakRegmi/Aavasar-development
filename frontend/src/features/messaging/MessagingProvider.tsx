/**
 * Keeps the messaging WebSocket connected while authenticated and routes
 * inbound message events into the react-query cache: append to the open
 * thread + refresh the inbox (ordering + unread counts).
 */
import { useEffect, type ReactNode } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthStore, useIsAuthenticated } from "@features/auth";
import { messagingRealtime } from "./realtime";
import { messageQueryKeys } from "./hooks/useMessaging";
import type { Message } from "./contracts/message.contract";

export function MessagingProvider({ children }: { children: ReactNode }) {
  const qc = useQueryClient();
  const authed = useIsAuthenticated();

  // Wire token provider + cache fan-out once.
  useEffect(() => {
    messagingRealtime.setTokenProvider(
      () => useAuthStore.getState().session?.accessToken ?? null,
    );
    const unsub = messagingRealtime.subscribe((evt) => {
      // Optimistically append for an instant update — but ONLY when the
      // thread is already cached. Never create a partial cache from a lone
      // pushed message (that would hide history until a refetch).
      qc.setQueryData<Message[]>(messageQueryKeys.messages(evt.conversationId), (old) => {
        if (!old) return old;
        return old.some((m) => m.id === evt.message.id) ? old : [...old, evt.message];
      });
      // Reconcile the thread (if open) + the inbox (ordering + unread).
      qc.invalidateQueries({ queryKey: messageQueryKeys.messages(evt.conversationId) });
      qc.invalidateQueries({ queryKey: messageQueryKeys.conversations });
    });
    return unsub;
  }, [qc]);

  // Connect only while signed in.
  useEffect(() => {
    if (authed) messagingRealtime.start();
    else messagingRealtime.stop();
    return () => messagingRealtime.stop();
  }, [authed]);

  return <>{children}</>;
}
