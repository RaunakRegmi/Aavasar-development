import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { notificationService } from "../api/notification.service";

export const notificationKeys = {
  all: ["notifications"] as const,
  list: (unreadOnly?: boolean) => ["notifications", "list", unreadOnly] as const,
};

export function useNotifications(unreadOnly = false) {
  return useQuery({
    queryKey: notificationKeys.list(unreadOnly),
    queryFn: () => notificationService.list(unreadOnly),
    staleTime: 30_000,
  });
}

export function useUnreadCount() {
  return useQuery({
    queryKey: notificationKeys.list(false),
    queryFn: () => notificationService.list(true),
    staleTime: 30_000,
    select: (data) => data.unread,
  });
}

export function useMarkAllRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: notificationService.markAllRead,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });
}
