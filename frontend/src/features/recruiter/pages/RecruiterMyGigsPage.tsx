/**
 * Recruiter → My Gigs — manage everything the recruiter has posted.
 *
 *   • Lists all of the recruiter's gigs (any status) via GET /gigs/mine.
 *   • Publish a draft (draft → active — the only transition allowed from
 *     draft) so it appears on student Find Work.
 *   • Delete a gig (with a confirm guard).
 *   • Empty state routes into the Post-a-Gig wizard.
 */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Badge, Button, Card, Skeleton, useToast } from "@shared/ui";
import type { BadgeTone } from "@shared/ui";
import { Icon } from "@shared/icons";
import { useMyGigs, useUpdateGigStatus, useDeleteGig, type GigStatus } from "@features/gigs";
import { formatNprFixed, formatRupeeRate, formatShort } from "@shared/lib/utils";
import { routes } from "@shared/config/routes";

const STATUS_META: Record<GigStatus, { tone: BadgeTone; label: string }> = {
  draft: { tone: "draft", label: "Draft" },
  active: { tone: "active", label: "Active" },
  reviewing: { tone: "reviewing", label: "In review" },
  submitted: { tone: "submitted", label: "Submitted" },
  completed: { tone: "success", label: "Completed" },
  rejected: { tone: "rejected", label: "Rejected" },
};

export default function RecruiterMyGigsPage() {
  const navigate = useNavigate();
  const toast = useToast();
  const { data, isLoading, isError, refetch } = useMyGigs();
  const publish = useUpdateGigStatus();
  const remove = useDeleteGig();
  const [pendingId, setPendingId] = useState<string | null>(null);

  const gigs = data?.items ?? [];

  const handlePublish = async (id: string) => {
    setPendingId(id);
    try {
      await publish.mutateAsync({ id, status: "active" });
      toast.success("Gig published — it's now live.");
    } catch (err) {
      toast.error("Could not publish", {
        description: err instanceof Error ? err.message : undefined,
      });
    } finally {
      setPendingId(null);
    }
  };

  const handleTransition = async (
    id: string,
    status: GigStatus,
    successMsg: string,
    confirmMsg?: string,
  ) => {
    if (confirmMsg && !window.confirm(confirmMsg)) return;
    setPendingId(id);
    try {
      await publish.mutateAsync({ id, status });
      toast.success(successMsg);
    } catch (err) {
      toast.error("Could not update gig", {
        description: err instanceof Error ? err.message : undefined,
      });
    } finally {
      setPendingId(null);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;
    setPendingId(id);
    try {
      await remove.mutateAsync(id);
      toast.success("Gig deleted.");
    } catch (err) {
      toast.error("Could not delete", {
        description: err instanceof Error ? err.message : undefined,
      });
    } finally {
      setPendingId(null);
    }
  };

  return (
    <div className="aav-page" style={{ maxWidth: 1000 }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 28,
        }}
      >
        <div>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: "clamp(26px, 5vw, 38px)",
              color: "var(--text-strong)",
              margin: 0,
              letterSpacing: "-0.02em",
            }}
          >
            My Gigs
          </h1>
          <p style={{ fontFamily: "var(--font-text)", fontSize: 16, color: "var(--text-muted)", margin: "4px 0 0" }}>
            Manage your posted gigs, publish drafts, and track their status.
          </p>
        </div>
        <Button variant="primary" iconLeft={<Icon name="Plus" size={16} />} onClick={() => navigate(routes.recruiterPostGig)}>
          Post a Gig
        </Button>
      </div>

      {isError ? (
        <Card>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Icon name="AlertCircle" size={20} style={{ color: "var(--danger-500)" }} />
            <div style={{ flex: 1, fontFamily: "var(--font-text)", color: "var(--text-strong)", fontWeight: 600 }}>
              Couldn&apos;t load your gigs
            </div>
            <Button variant="outline" onClick={() => refetch()}>
              Retry
            </Button>
          </div>
        </Card>
      ) : isLoading ? (
        <div style={{ display: "grid", gap: 12 }}>
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <Skeleton width="40%" height={18} />
              <div style={{ height: 10 }} />
              <Skeleton width="25%" height={14} />
            </Card>
          ))}
        </div>
      ) : gigs.length === 0 ? (
        <Card>
          <div style={{ textAlign: "center", padding: "40px 16px" }}>
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: "var(--radius-md)",
                background: "var(--surface-2)",
                color: "var(--ink-500)",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 16,
              }}
            >
              <Icon name="Briefcase" size={26} />
            </div>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: 20,
                color: "var(--text-strong)",
                marginBottom: 6,
              }}
            >
              No gigs yet
            </div>
            <div style={{ fontFamily: "var(--font-text)", fontSize: 14, color: "var(--text-muted)", marginBottom: 20 }}>
              Post your first gig to start receiving applications from students.
            </div>
            <Button variant="primary" iconLeft={<Icon name="Plus" size={16} />} onClick={() => navigate(routes.recruiterPostGig)}>
              Post a Gig
            </Button>
          </div>
        </Card>
      ) : (
        <div style={{ display: "grid", gap: 12 }}>
          {gigs.map((g) => {
            const meta = STATUS_META[g.status];
            const rate = g.payKind === "fixed" ? formatNprFixed(g.pay) : formatRupeeRate(g.pay.amountMinor, "hr");
            const busy = pendingId === g.id;
            return (
              <Card key={g.id}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                      <span
                        style={{
                          fontFamily: "var(--font-display)",
                          fontWeight: 700,
                          fontSize: 17,
                          color: "var(--text-strong)",
                        }}
                      >
                        {g.title}
                      </span>
                      <Badge tone={meta.tone}>{meta.label}</Badge>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 14,
                        fontFamily: "var(--font-text)",
                        fontSize: 13,
                        color: "var(--text-subtle)",
                      }}
                    >
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
                        <Icon name={g.postedAs === "company" ? "Building" : "User"} size={14} />
                        {g.poster.name}
                      </span>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
                        <Icon name="Wallet" size={14} />
                        {rate}
                      </span>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
                        <Icon name="Calendar" size={14} />
                        {formatShort(g.postedAt)}
                      </span>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                    {g.status === "draft" && (
                      <Button
                        variant="primary"
                        size="sm"
                        disabled={busy}
                        iconLeft={<Icon name="Send" size={14} />}
                        onClick={() => handlePublish(g.id)}
                      >
                        {busy ? "…" : "Publish"}
                      </Button>
                    )}
                    {g.status === "active" && (
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={busy}
                        iconLeft={<Icon name="ClipboardCheck" size={14} />}
                        onClick={() =>
                          handleTransition(g.id, "reviewing", "Moved to review.")
                        }
                      >
                        {busy ? "…" : "Start review"}
                      </Button>
                    )}
                    {g.status === "reviewing" && (
                      <Button
                        variant="primary"
                        size="sm"
                        disabled={busy}
                        iconLeft={<Icon name="CheckCircle2" size={14} />}
                        onClick={() =>
                          handleTransition(
                            g.id,
                            "completed",
                            "Gig completed — points awarded to the hired student.",
                            `Mark "${g.title}" complete? This pays out points to the hired student and can't be undone.`,
                          )
                        }
                      >
                        {busy ? "…" : "Mark complete"}
                      </Button>
                    )}
                    {g.status !== "completed" && g.status !== "rejected" && (
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={busy}
                        iconLeft={<Icon name="Trash2" size={14} />}
                        onClick={() => handleDelete(g.id, g.title)}
                      >
                        Delete
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
