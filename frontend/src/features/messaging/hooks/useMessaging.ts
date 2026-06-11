import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { messageService } from "../api/message.service";
import type { Conversation, Message } from "../contracts/message.contract";

export const messageQueryKeys = {
  conversations: ["conversations"] as const,
  messages: (conversationId: string) => ["messages", conversationId] as const,
};

export function useConversations() {
  return useQuery({
    queryKey: messageQueryKeys.conversations,
    queryFn: messageService.listConversations,
    staleTime: 10_000,
  });
}

export function useMessages(conversationId: string | undefined) {
  return useQuery({
    queryKey: messageQueryKeys.messages(conversationId ?? ""),
    queryFn: () => messageService.listMessages(conversationId!),
    enabled: !!conversationId,
    staleTime: 10_000,
    // Always reconcile with the server's authoritative history when a
    // thread is (re)opened — so any optimistic/live-pushed partial cache
    // can never hide earlier messages. keepPreviousData avoids a blank
    // flash while the refetch is in flight (incl. switching threads).
    refetchOnMount: "always",
    placeholderData: keepPreviousData,
  });
}

export function useSendMessage(conversationId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: string) => messageService.sendMessage(conversationId, body),
    onSuccess: (msg) => {
      qc.setQueryData<Message[]>(messageQueryKeys.messages(conversationId), (old) => {
        const arr = old ?? [];
        return arr.some((m) => m.id === msg.id) ? arr : [...arr, msg];
      });
      qc.invalidateQueries({ queryKey: messageQueryKeys.conversations });
    },
  });
}

export function useStartConversation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (studentId: string) => messageService.startConversation(studentId),
    onSuccess: (conv: Conversation) => {
      qc.invalidateQueries({ queryKey: messageQueryKeys.conversations });
      return conv;
    },
  });
}

export function useMarkRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (conversationId: string) => messageService.markRead(conversationId),
    onSuccess: () => qc.invalidateQueries({ queryKey: messageQueryKeys.conversations }),
  });
}
