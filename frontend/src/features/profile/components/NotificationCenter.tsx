/**
 * NotificationCenter — stub UI for the v1 notifications surface.
 *
 * Why a stub: the backend has no notification entity yet, but the
 * profile/dashboard pages already need a visible touch-point for
 * "you have N updates". When the real feed lands, the data layer
 * gets wired in — the layout doesn't have to change.
 *
 * Three placeholder rows are hard-coded to communicate the visual
 * vocabulary (icon, title, supporting line, timestamp) and the
 * affordance (mark all as read). Until the API ships, the "Mark all
 * read" button is a no-op that simply toasts.
 */
import { Button, Card, useToast } from "@shared/ui";
import { Icon, type IconName } from "@shared/icons";

interface PlaceholderItem {
  id: string;
  icon: IconName;
  title: string;
  description: string;
  whenLabel: string;
  unread: boolean;
}

const ITEMS: ReadonlyArray<PlaceholderItem> = [
  {
    id: "n1",
    icon: "Inbox",
    title: "Notifications are coming online",
    description:
      "When recruiters message you, applications change status, or payouts settle, you'll see it here.",
    whenLabel: "Just now",
    unread: true,
  },
  {
    id: "n2",
    icon: "ShieldCheck",
    title: "Profile verification expected this week",
    description:
      "Once our team reviews your government ID, your profile gets a Verified badge.",
    whenLabel: "Recently",
    unread: false,
  },
  {
    id: "n3",
    icon: "Sparkles",
    title: "Tip — keep your skills up to date",
    description:
      "Profiles with 5+ skill tags get 3× the views from recruiters.",
    whenLabel: "—",
    unread: false,
  },
];

export function NotificationCenter() {
  const toast = useToast();
  const unreadCount = ITEMS.filter((i) => i.unread).length;

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
          disabled={unreadCount === 0}
          onClick={() =>
            toast.success("All caught up", {
              description: "Real notification routing ships next milestone.",
            })
          }
        >
          Mark all read
        </Button>
      </div>
      <div style={{ display: "grid", gap: 10 }}>
        {ITEMS.map((it) => (
          <div
            key={it.id}
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 14,
              border: "1px solid var(--border-default)",
              borderRadius: "var(--radius-sm)",
              padding: "14px 16px",
              background: it.unread ? "var(--brand-50)" : "var(--surface-0)",
            }}
          >
            <span
              style={{
                width: 36,
                height: 36,
                borderRadius: "var(--radius-sm)",
                background: it.unread ? "var(--surface-0)" : "var(--surface-2)",
                color: "var(--brand-700)",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Icon name={it.icon} size={18} />
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
              {it.whenLabel}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}
