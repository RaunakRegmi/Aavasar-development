/**
 * Student → Gig detail. Two-column layout: the gig content on the left
 * (header, poster identity, description, skills) and a sticky apply panel
 * on the right (pay/location/duration + the apply + cover-note flow).
 */
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGigById } from "@features/gigs";
import { useCurrentUser, useIsAuthenticated } from "@features/auth";
import { request, ApiError } from "@shared/lib/transport";
import { Avatar, Badge, Button, Card, Skeleton, Tag, useToast } from "@shared/ui";
import { Icon, type IconName } from "@shared/icons";
import { formatNprFixed, formatRupeeRate } from "@shared/lib/utils";
import { routes } from "@shared/config/routes";

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
  const [applied, setApplied] = useState(false);

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
      setApplied(true);
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
      <div className="aav-page" style={{ maxWidth: 1080 }}>
        <Skeleton width={200} height={12} />
        <div style={{ height: 16 }} />
        <Skeleton width="60%" height={28} />
        <div style={{ height: 12 }} />
        <Skeleton width="100%" height={120} />
      </div>
    );
  }

  if (isError || !gig) {
    return (
      <div className="aav-page" style={{ maxWidth: 1080 }}>
        <Card>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Icon name="AlertCircle" size={20} style={{ color: "var(--danger-500)" }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: "var(--font-text)", fontWeight: 600, color: "var(--text-strong)" }}>
                Gig not found
              </div>
              <div style={{ fontSize: 13, color: "var(--text-muted)" }}>
                This gig may have been removed or doesn&apos;t exist.
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

  const rate = gig.payKind === "fixed" ? formatNprFixed(gig.pay) : formatRupeeRate(gig.pay.amountMinor, "hr");
  const isActive = gig.status === "active";

  return (
    <div className="aav-page" style={{ maxWidth: 1080 }}>
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

      <div className="aav-detail">
        {/* ---------- Left: content ---------- */}
        <div style={{ display: "grid", gap: 20, minWidth: 0 }}>
          <Card>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <span style={{ fontFamily: "var(--font-text)", fontSize: 12, fontWeight: 600, letterSpacing: "0.05em", color: "var(--text-subtle)" }}>
                {gig.category.toUpperCase()}
              </span>
              {gig.isPremium && <Badge tone="premium">Premium</Badge>}
              {!isActive && <Badge tone="neutral">{gig.status}</Badge>}
            </div>
            <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 30, color: "var(--text-strong)", margin: "0 0 16px", lineHeight: 1.2 }}>
              {gig.title}
            </h1>
            {/* Poster identity */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, paddingTop: 14, borderTop: "1px solid var(--border-subtle)" }}>
              <Avatar src={gig.poster.avatarUrl ?? undefined} name={gig.poster.name} size={40} shape={gig.postedAs === "company" ? "squircle" : "circle"} />
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontFamily: "var(--font-text)", fontWeight: 600, fontSize: 14, color: "var(--text-strong)" }}>
                    {gig.poster.name}
                  </span>
                  {gig.poster.verified && <Icon name="BadgeCheck" size={15} style={{ color: "var(--brand-700)" }} />}
                </div>
                <div style={{ fontFamily: "var(--font-text)", fontSize: 12.5, color: "var(--text-subtle)" }}>
                  {gig.postedAs === "company" ? "Company" : "Individual recruiter"}
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18, color: "var(--text-strong)", margin: "0 0 12px" }}>
              Description
            </h2>
            <p style={{ fontFamily: "var(--font-text)", fontSize: 15, lineHeight: 1.7, color: "var(--text-muted)", margin: 0, whiteSpace: "pre-wrap" }}>
              {gig.description}
            </p>
          </Card>

          {gig.tags.length > 0 && (
            <Card>
              <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15, color: "var(--text-strong)", margin: "0 0 12px" }}>
                Skills & Tags
              </h3>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {gig.tags.map((t) => <Tag key={t}>{t}</Tag>)}
              </div>
            </Card>
          )}
        </div>

        {/* ---------- Right: sticky apply panel ---------- */}
        <div className="aav-detail-aside" style={{ position: "sticky", top: 24, display: "grid", gap: 16 }}>
          <Card>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 26, color: "var(--success-600)" }}>
              {rate}
            </div>
            <div style={{ fontFamily: "var(--font-text)", fontSize: 13, color: "var(--text-muted)", marginBottom: 16 }}>
              {gig.payKind === "fixed" ? "Fixed price" : "Per hour"}
            </div>

            <div style={{ display: "grid", gap: 10, marginBottom: 18 }}>
              <DetailRow icon="MapPin" label={gig.location === "remote" ? "Remote" : gig.location === "onsite" ? "On-site" : "Hybrid"} />
              <DetailRow icon="Clock" label={gig.duration} />
              <DetailRow icon={gig.postedAs === "company" ? "Building" : "User"} label={gig.poster.name} />
            </div>

            {!isActive ? (
              <div style={{ fontFamily: "var(--font-text)", fontSize: 13, color: "var(--text-muted)", textAlign: "center", padding: "10px 0" }}>
                This gig isn&apos;t accepting applications.
              </div>
            ) : applied ? (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  padding: "12px",
                  background: "var(--success-100)",
                  borderRadius: "var(--radius-sm)",
                  fontFamily: "var(--font-text)",
                  fontSize: 14,
                  fontWeight: 600,
                  color: "var(--success-700-text)",
                }}
              >
                <Icon name="CheckCircle2" size={16} /> Application sent
              </div>
            ) : showApply ? (
              <div style={{ display: "grid", gap: 10 }}>
                <textarea
                  value={coverNote}
                  onChange={(e) => setCoverNote(e.target.value)}
                  maxLength={2000}
                  placeholder="Add a short cover note (optional)…"
                  style={{
                    width: "100%",
                    minHeight: 100,
                    resize: "vertical",
                    fontFamily: "var(--font-text)",
                    fontSize: 14,
                    color: "var(--text-strong)",
                    background: "var(--surface-0)",
                    border: "1px solid var(--border-default)",
                    borderRadius: "var(--radius-sm)",
                    padding: "10px 12px",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
                <Button variant="primary" full disabled={submitting} onClick={handleApply}>
                  {submitting ? "Submitting…" : "Submit application"}
                </Button>
                <Button variant="outline" full disabled={submitting} onClick={() => setShowApply(false)}>
                  Cancel
                </Button>
              </div>
            ) : (
              <Button
                variant="primary"
                full
                iconRight={<Icon name="ArrowRight" size={16} />}
                onClick={() => (isAuth && user?.role === "student" ? setShowApply(true) : handleApply())}
              >
                Apply Now
              </Button>
            )}
          </Card>

          {isActive && (
            <div style={{ fontFamily: "var(--font-text)", fontSize: 12.5, color: "var(--text-subtle)", textAlign: "center" }}>
              Your profile is shared with the recruiter when you apply.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function DetailRow({ icon, label }: { icon: IconName; label: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: "var(--font-text)", fontSize: 14, color: "var(--text-body)" }}>
      <Icon name={icon} size={16} style={{ color: "var(--text-muted)" }} />
      {label}
    </div>
  );
}
