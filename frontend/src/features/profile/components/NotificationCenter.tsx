import { useNotifications, useMarkAllRead } from "../hooks/useNotifications";
import { Button, Card, Skeleton, useToast } from "@shared/ui";
import { Icon } from "@shared/icons";

const KIND_ICONS: Record<string, string> = {
  application_created: "Inbox",
  application_accepted: "CheckCircle",
  application_rejected: "XCircle",
  new_message: "MessageSquare",
  payout_settled: "Wallet",
  profile_verified: "ShieldCheck",
  gig_completed: "Award",
};

export function NotificationCenter() {
  const toast = useToast();
  const { data, isLoading, isError, refetch } = useNotifications();
  const markAllRead = useMarkAllRead();

  const items = data?.items ?? [];
  const unreadCount = data?.unread ?? 0;

  const handleMarkAllRead = async () => {
    try {
      await markAllRead.mutateAsync();
      toast.success("All caught up!", {
        description: "Notifications marked as read.",
      });
    } catch {
      toast.error("Couldn't update notifications");
    }
  };

  return (
    <Card padding={28}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 18,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Icon name="Bell" size={22} style={{ color: "var(--brand-700)" }} />
          <h3
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: 20,
              color: "var(--text-strong)",
              margin: 0,
            }}
          >
            Notifications
          </h3>
          {unreadCount > 0 ? (
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                background: "var(--brand-50)",
                color: "var(--brand-700)",
                padding: "2px 10px",
                borderRadius: "9999px",
                fontFamily: "var(--font-text)",
                fontSize: 12,
                fontWeight: 700,
              }}
            >
              {unreadCount} new
            </span>
          ) : null}
        </div>
        <Button
          variant="outline"
          size="sm"
          type="button"
          disabled={unreadCount === 0 || markAllRead.isPending}
          onClick={handleMarkAllRead}
        >
          {markAllRead.isPending ? "Updating\u2026" : "Mark all read"}
        </Button>
      </div>

      {isLoading ? (
        <div style={{ display: "grid", gap: 10 }}>
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                gap: 14,
                padding: "14px 16px",
                border: "1px solid var(--border-default)",
                borderRadius: "var(--radius-sm)",
              }}
            >
              <Skeleton width={36} height={36} radius="var(--radius-sm)" />
              <div style={{ flex: 1 }}>
                <Skeleton width="60%" height={15} />
                <div style={{ height: 6 }} />
                <Skeleton width="90%" height={13} />
              </div>
            </div>
          ))}
        </div>
      ) : isError ? (
        <div style={{ textAlign: "center", padding: 24 }}>
          <Icon name="AlertCircle" size={24} style={{ color: "var(--danger-500)" }} />
          <p style={{ fontFamily: "var(--font-text)", fontSize: 14, color: "var(--text-muted)" }}>
            Couldn't load notifications.
          </p>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      ) : items.length === 0 ? (
        <div style={{ textAlign: "center", padding: "24px 16px" }}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: "var(--radius-md)",
              background: "var(--surface-2)",
              color: "var(--ink-500)",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 14,
            }}
          >
            <Icon name="Bell" size={22} />
          </div>
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: 16,
              color: "var(--text-strong)",
              marginBottom: 4,
            }}
          >
            All clear
          </div>
          <div
            style={{
              fontFamily: "var(--font-text)",
              fontSize: 14,
              color: "var(--text-muted)",
            }}
          >
            No new notifications yet.
          </div>
        </div>
      ) : (
        <div style={{ display: "grid", gap: 10 }}>
          {items.map((it) => {
            const iconName = KIND_ICONS[it.kind] ?? "Bell";
            const isUnread = !it.readAt;
            return (
              <div
                key={it.id}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 14,
                  border: "1px solid var(--border-default)",
                  borderRadius: "var(--radius-sm)",
                  padding: "14px 16px",
                  background: isUnread ? "var(--brand-50)" : "var(--surface-0)",
                  cursor: it.link ? "pointer" : "default",
                }}
                onClick={() => {
                  if (it.link) window.location.href = it.link;
                }}
              >
                <span
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: "var(--radius-sm)",
                    background: isUnread ? "var(--surface-0)" : "var(--surface-2)",
                    color: "var(--brand-700)",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Icon name={iconName as any} size={18} />
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontFamily: "var(--font-text)",
                      fontWeight: 600,
                      fontSize: 15,
                      color: "var(--text-strong)",
                    }}
                  >
                    {it.title}
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-text)",
                      fontSize: 14,
                      color: "var(--text-muted)",
                      marginTop: 2,
                    }}
                  >
                    {it.description}
                  </div>
                </div>
                <span
                  style={{
                    fontFamily: "var(--font-text)",
                    fontSize: 12,
                    color: "var(--text-subtle)",
                    flexShrink: 0,
                  }}
                >
                  {formatRelativeTime(it.createdAt)}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}

function formatRelativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(new Date(iso));
}
