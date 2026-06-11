import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGigById } from "@features/gigs";
import { useCurrentUser, useIsAuthenticated } from "@features/auth";
import { request } from "@shared/lib/transport";
import { Badge, Button, Card, Skeleton, Tag, useToast } from "@shared/ui";
import { Icon } from "@shared/icons";
import { formatNprFixed, formatRupeeRate } from "@shared/lib/utils";
import { routes } from "@shared/config/routes";
import { ApiError } from "@shared/lib/transport";

export default function StudentGigDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useToast();
  const user = useCurrentUser();
  const isAuth = useIsAuthenticated();
  const { data: gig, isLoading, isError } = useGigById(id);

  const [showApply, setShowApply] = useState(false);
  const [coverNote, setCoverNote] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleApply = async () => {
    if (!isAuth) {
      navigate(routes.logIn, { state: { from: `/student/gigs/${id}` } });
      return;
    }
    if (user?.role !== "student") {
      toast.error("Only students can apply to gigs.");
      return;
    }
    setSubmitting(true);
    try {
      await request({
        method: "POST",
        url: "/gigs/apply",
        data: { gigId: id, coverNote: coverNote.trim() || undefined },
      });
      toast.success("Application submitted!", {
        description: "The recruiter will review your profile.",
      });
      setShowApply(false);
      setCoverNote("");
    } catch (e) {
      if (e instanceof ApiError) {
        toast.error("Couldn't apply", { description: e.body.message });
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div style={{ padding: "32px 40px", maxWidth: 800 }}>
        <Skeleton width={200} height={12} />
        <div style={{ height: 16 }} />
        <Skeleton width="60%" height={28} />
        <div style={{ height: 12 }} />
        <Skeleton width="100%" height={80} />
      </div>
    );
  }

  if (isError || !gig) {
    return (
      <div style={{ padding: "32px 40px", maxWidth: 800 }}>
        <Card>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Icon name="AlertCircle" size={20} style={{ color: "var(--danger-500)" }} />
            <div>
              <div style={{ fontFamily: "var(--font-text)", fontWeight: 600, color: "var(--text-strong)" }}>
                Gig not found
              </div>
              <div style={{ fontSize: 13, color: "var(--text-muted)" }}>
                This gig may have been removed or doesn't exist.
              </div>
            </div>
            <Button variant="outline" onClick={() => navigate(routes.studentFindWork)}>
              Browse Gigs
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const rate = gig.payKind === "fixed"
    ? formatNprFixed(gig.pay)
    : formatRupeeRate(gig.pay.amountMinor, "hr");

  return (
    <div style={{ padding: "32px 40px", maxWidth: 800 }}>
      <button
        type="button"
        onClick={() => navigate(routes.studentFindWork)}
        style={{
          background: "transparent",
          border: "none",
          cursor: "pointer",
          fontFamily: "var(--font-text)",
          fontSize: 14,
          fontWeight: 600,
          color: "var(--brand-700)",
          padding: 0,
          marginBottom: 20,
          display: "flex",
          alignItems: "center",
          gap: 6,
        }}
      >
        <Icon name="ArrowLeft" size={16} />
        Back to gigs
      </button>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <span style={{ fontFamily: "var(--font-text)", fontSize: 12, fontWeight: 600, letterSpacing: "0.05em", color: "var(--text-subtle)" }}>
              {gig.category}
            </span>
            {gig.isPremium && <Badge tone="premium">Premium</Badge>}
            <Badge tone={gig.status === "active" ? "active" : "neutral"}>{gig.status}</Badge>
          </div>
          <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 32, color: "var(--text-strong)", margin: 0 }}>
            {gig.title}
          </h1>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 28, color: "var(--success-600)" }}>
            {rate}
          </div>
          <div style={{ fontFamily: "var(--font-text)", fontSize: 13, color: "var(--text-muted)" }}>
            {gig.payKind === "fixed" ? "fixed price" : "per hour"}
          </div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 16, marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, fontFamily: "var(--font-text)", fontSize: 14, color: "var(--text-muted)" }}>
          <Icon name="MapPin" size={16} />
          {gig.location === "remote" ? "Remote" : gig.location === "onsite" ? "On-site" : "Hybrid"}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, fontFamily: "var(--font-text)", fontSize: 14, color: "var(--text-muted)" }}>
          <Icon name="Clock" size={16} />
          {gig.duration}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, fontFamily: "var(--font-text)", fontSize: 14, color: "var(--text-muted)" }}>
          <Icon name={gig.postedAs === "company" ? "Building" : "User"} size={16} />
          {gig.poster.name}
          {gig.poster.verified && (
            <Icon name="BadgeCheck" size={15} style={{ color: "var(--brand-700)" }} />
          )}
        </div>
      </div>

      <Card style={{ marginBottom: 24 }}>
        <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18, color: "var(--text-strong)", margin: "0 0 12px" }}>
          Description
        </h2>
        <p style={{ fontFamily: "var(--font-text)", fontSize: 15, lineHeight: 1.7, color: "var(--text-muted)", margin: 0, whiteSpace: "pre-wrap" }}>
          {gig.description}
        </p>
      </Card>

      <div style={{ marginBottom: 24 }}>
        <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 15, color: "var(--text-strong)", margin: "0 0 8px" }}>
          Skills & Tags
        </h3>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {gig.tags.map((t) => <Tag key={t}>{t}</Tag>)}
        </div>
      </div>

      {gig.status === "active" && (
        <div style={{ borderTop: "1px solid var(--border-subtle)", paddingTop: 20 }}>
          {showApply ? (
            <Card>
              <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18, color: "var(--text-strong)", margin: "0 0 12px" }}>
                Apply for this gig
              </h3>
              <label style={{ fontFamily: "var(--font-text)", fontSize: 14, fontWeight: 600, color: "var(--text-strong)" }}>
                Cover note (optional)
              </label>
              <textarea
                placeholder="Tell the recruiter why you're a great fit…"
                value={coverNote}
                onChange={(e) => setCoverNote(e.target.value)}
                style={{
                  width: "100%",
                  minHeight: 100,
                  padding: "10px 14px",
                  fontFamily: "var(--font-text)",
                  fontSize: 15,
                  color: "var(--text-strong)",
                  border: "1px solid var(--border-default)",
                  borderRadius: "var(--radius-xs)",
                  background: "var(--surface-0)",
                  resize: "vertical",
                  boxSizing: "border-box",
                }}
              />
              <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
                <Button variant="primary" onClick={handleApply} disabled={submitting}>
                  {submitting ? "Submitting…" : "Submit Application"}
                </Button>
                <Button variant="outline" onClick={() => setShowApply(false)}>
                  Cancel
                </Button>
              </div>
            </Card>
          ) : (
            <Button
              variant="primary"
              size="lg"
              iconRight={<Icon name="ArrowRight" size={18} />}
              onClick={handleApply}
            >
              Apply Now
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
