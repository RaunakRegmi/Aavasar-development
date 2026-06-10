/**
 * Recruiter Profile Dashboard — the "your company brand" surface.
 *
 * Layout:
 *   [ ProfileBanner (brand variant) ]
 *   [ Tabs: Overview · Account Security · Notifications ]
 *     Overview      → company panel + posted gigs (live from pipeline)
 *                     + Manage Company stub
 *     Security      → AccountSecurityPanel
 *     Notifications → NotificationCenter
 *
 * The company panel only appears once the recruiter has been linked
 * to a `Company`. Until then, a contextual empty-state surfaces a
 * "Start Your Company Page" CTA pointing at recruiter settings.
 */
import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import {
  Badge,
  Button,
  Card,
  Input,
  PageLoader,
  Skeleton,
  Tag,
  useToast,
  type BadgeTone,
} from "@shared/ui";
import { Icon } from "@shared/icons";
import { useMe, usePatchProfile } from "@features/me";
import { useCurrentUser } from "@features/auth";
import { useRecruiterPipeline, type GigStatus } from "@features/gigs";
import { routes, gigPath } from "@shared/config/routes";
import { ApiError } from "@shared/lib/transport";
import { CreateCompanyButton } from "@features/recruiter/components/CreateCompanyButton";
import { ProfileBanner } from "../components/ProfileBanner";
import { AccountSecurityPanel } from "../components/AccountSecurityPanel";
import { NotificationCenter } from "../components/NotificationCenter";

type Tab = "overview" | "security" | "notifications";
const TABS: ReadonlyArray<{ id: Tab; label: string }> = [
  { id: "overview", label: "Overview" },
  { id: "security", label: "Account Security" },
  { id: "notifications", label: "Notifications" },
];

const STATUS_TO_TONE: Record<GigStatus, BadgeTone> = {
  active: "active",
  submitted: "submitted",
  reviewing: "reviewing",
  draft: "draft",
  completed: "success",
  rejected: "rejected",
};
const STATUS_LABEL: Record<GigStatus, string> = {
  active: "Active",
  submitted: "Submitted",
  reviewing: "Reviewing",
  draft: "Draft",
  completed: "Completed",
  rejected: "Rejected",
};

export default function RecruiterProfilePage() {
  const navigate = useNavigate();
  const user = useCurrentUser();
  const me = useMe();
  const patch = usePatchProfile();
  const toast = useToast();
  const pipeline = useRecruiterPipeline();
  const [tab, setTab] = useState<Tab>("overview");
  const [editing, setEditing] = useState(false);
  const [headline, setHeadline] = useState("");
  const [bio, setBio] = useState("");

  if (user && user.role !== "recruiter") {
    return <Navigate to={routes.studentDashboard} replace />;
  }
  if (me.isLoading || !me.data) return <PageLoader />;

  const { user: profile, company } = me.data;

  // Seed the form once data lands without an effect — defer to render
  // and React keeps the local state stable since headline/bio default
  // to "" until the user clicks "Edit".
  if (!editing && headline === "" && bio === "") {
    if (profile.headline) setHeadline(profile.headline);
    if (profile.bio) setBio(profile.bio);
  }

  const save = async () => {
    try {
      await patch.mutateAsync({
        headline: headline.trim() || undefined,
        bio: bio.trim() || undefined,
      });
      setEditing(false);
      toast.success("Profile updated");
    } catch (e) {
      if (e instanceof ApiError) {
        toast.error("Couldn't save", { description: e.body.message });
      } else if (e instanceof Error) {
        toast.error("Save failed", { description: e.message });
      }
    }
  };

  return (
    <div style={{ padding: "32px 40px", maxWidth: 1180, margin: "0 auto" }}>
      <ProfileBanner user={profile} company={company} variant="brand" />

      <TabBar tab={tab} onTab={setTab} />

      {tab === "overview" ? (
        <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 24 }}>
          {/* ---- Left: Company panel + Posted Gigs ---- */}
          <div style={{ display: "grid", gap: 20 }}>
            {company ? (
              <Card padding={28}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 14,
                  }}
                >
                  <h3
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 700,
                      fontSize: 20,
                      color: "var(--text-strong)",
                      margin: 0,
                    }}
                  >
                    Company
                  </h3>
                  <Button
                    variant="outline"
                    size="sm"
                    type="button"
                    iconLeft={<Icon name="Settings" size={14} />}
                    onClick={() => navigate(routes.recruiterSettings)}
                  >
                    Manage Company
                  </Button>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <span
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: "var(--radius-md)",
                      background: "var(--brand-50)",
                      color: "var(--brand-700)",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Icon name="Building2" size={24} />
                  </span>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontFamily: "var(--font-display)",
                        fontWeight: 700,
                        fontSize: 18,
                        color: "var(--text-strong)",
                      }}
                    >
                      {company.name}
                    </div>
                    <div
                      style={{
                        fontFamily: "var(--font-text)",
                        fontSize: 13,
                        color: "var(--text-muted)",
                      }}
                    >
                      {company.verified
                        ? "Verified company — ready to post premium gigs"
                        : "Verification pending — book a call to unlock premium posting"}
                    </div>
                  </div>
                  <Badge tone={company.verified ? "success" : "neutral"}>
                    {company.verified ? "Verified" : "Pending"}
                  </Badge>
                </div>
              </Card>
            ) : (
              <Card padding={28}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <Icon name="Building2" size={20} style={{ color: "var(--brand-700)" }} />
                  <h3
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 700,
                      fontSize: 20,
                      color: "var(--text-strong)",
                      margin: 0,
                    }}
                  >
                    No company linked yet
                  </h3>
                </div>
                <p
                  style={{
                    fontFamily: "var(--font-text)",
                    fontSize: 14,
                    color: "var(--text-muted)",
                    margin: "0 0 16px",
                  }}
                >
                  Link a company to post gigs, run pipelines, and unlock the
                  recruiter dashboard's premium surfaces.
                </p>
                <CreateCompanyButton />
              </Card>
            )}

            {/* ---- About / headline editor ---- */}
            <Card padding={28}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 14,
                }}
              >
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 700,
                    fontSize: 20,
                    color: "var(--text-strong)",
                    margin: 0,
                  }}
                >
                  About the Hiring Manager
                </h3>
                {!editing ? (
                  <Button
                    variant="outline"
                    size="sm"
                    type="button"
                    onClick={() => setEditing(true)}
                    iconLeft={<Icon name="Pencil" size={14} />}
                  >
                    Edit
                  </Button>
                ) : null}
              </div>
              {editing ? (
                <div style={{ display: "grid", gap: 14 }}>
                  <Input
                    label="Headline"
                    placeholder="e.g. Head of Talent · Aavasar"
                    value={headline}
                    onChange={(e) => setHeadline(e.target.value)}
                    maxLength={160}
                  />
                  <div>
                    <label
                      style={{
                        display: "block",
                        marginBottom: 6,
                        fontFamily: "var(--font-text)",
                        fontSize: 14,
                        fontWeight: 600,
                        color: "var(--text-strong)",
                      }}
                    >
                      Bio
                    </label>
                    <textarea
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      maxLength={2000}
                      placeholder="A short intro for the students you'll be hiring…"
                      style={{
                        width: "100%",
                        minHeight: 130,
                        resize: "vertical",
                        fontFamily: "var(--font-text)",
                        fontSize: 15,
                        lineHeight: 1.55,
                        color: "var(--text-strong)",
                        border: "1px solid var(--border-default)",
                        borderRadius: "var(--radius-sm)",
                        padding: "12px 14px",
                        outline: "none",
                        boxSizing: "border-box",
                      }}
                    />
                  </div>
                  <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                    <Button
                      variant="outline"
                      type="button"
                      onClick={() => {
                        setEditing(false);
                        setHeadline(profile.headline ?? "");
                        setBio(profile.bio ?? "");
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="primary"
                      type="button"
                      onClick={save}
                      disabled={patch.isPending}
                      iconLeft={<Icon name="Check" size={16} />}
                    >
                      {patch.isPending ? "Saving…" : "Save"}
                    </Button>
                  </div>
                </div>
              ) : (
                <div>
                  {profile.headline ? (
                    <div
                      style={{
                        fontFamily: "var(--font-text)",
                        fontSize: 16,
                        fontWeight: 600,
                        color: "var(--text-strong)",
                        marginBottom: 6,
                      }}
                    >
                      {profile.headline}
                    </div>
                  ) : null}
                  {profile.bio ? (
                    <p
                      style={{
                        fontFamily: "var(--font-text)",
                        fontSize: 15,
                        lineHeight: 1.6,
                        color: "var(--text-body)",
                        margin: 0,
                        whiteSpace: "pre-wrap",
                      }}
                    >
                      {profile.bio}
                    </p>
                  ) : (
                    <div
                      style={{
                        fontFamily: "var(--font-text)",
                        fontSize: 14,
                        color: "var(--text-muted)",
                        padding: "10px 12px",
                        background: "var(--surface-2)",
                        borderRadius: "var(--radius-sm)",
                      }}
                    >
                      Adding a short intro doubles the chance an applicant
                      reads your gig brief in full.
                    </div>
                  )}
                </div>
              )}
            </Card>

            {/* ---- Posted Gigs ---- */}
            <Card padding={28}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 14,
                }}
              >
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 700,
                    fontSize: 20,
                    color: "var(--text-strong)",
                    margin: 0,
                  }}
                >
                  Posted Gigs
                </h3>
                <Button
                  variant="primary"
                  size="sm"
                  type="button"
                  iconLeft={<Icon name="Plus" size={14} />}
                  onClick={() => navigate(routes.recruiterPostGig)}
                >
                  Post a Gig
                </Button>
              </div>
              {pipeline.isLoading ? (
                <>
                  <Skeleton width="100%" height={56} radius="var(--radius-sm)" />
                  <div style={{ height: 10 }} />
                  <Skeleton width="100%" height={56} radius="var(--radius-sm)" />
                </>
              ) : pipeline.data && pipeline.data.length > 0 ? (
                <div style={{ display: "grid", gap: 10 }}>
                  {pipeline.data.slice(0, 5).map((g) => (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => navigate(gigPath(g.id))}
                      style={{
                        all: "unset",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: 14,
                        border: "1px solid var(--border-default)",
                        borderRadius: "var(--radius-sm)",
                        padding: "12px 16px",
                      }}
                    >
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            fontFamily: "var(--font-text)",
                            fontWeight: 600,
                            fontSize: 15,
                            color: "var(--text-strong)",
                          }}
                        >
                          {g.title}
                        </div>
                        <div
                          style={{
                            fontFamily: "var(--font-text)",
                            fontSize: 13,
                            color: "var(--text-subtle)",
                          }}
                        >
                          {g.subtitle} · {g.applicantCount} applicants
                        </div>
                      </div>
                      <Badge tone={STATUS_TO_TONE[g.status]}>{STATUS_LABEL[g.status]}</Badge>
                    </button>
                  ))}
                </div>
              ) : (
                <div
                  style={{
                    border: "2px dashed var(--border-strong)",
                    borderRadius: "var(--radius-sm)",
                    padding: "24px 16px",
                    textAlign: "center",
                    fontFamily: "var(--font-text)",
                    fontSize: 14,
                    color: "var(--text-muted)",
                  }}
                >
                  No gigs posted yet — your first listing kicks off the pipeline.
                </div>
              )}
            </Card>
          </div>

          {/* ---- Right column: Trust + quick links ---- */}
          <div style={{ display: "grid", gap: 20 }}>
            <Card padding={24}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <Icon name="ShieldCheck" size={20} style={{ color: "var(--success-600)" }} />
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 700,
                    fontSize: 18,
                    color: "var(--text-strong)",
                    margin: 0,
                  }}
                >
                  Trust
                </h3>
              </div>
              <Row label="Email verified" value={profile.verified ? "Yes" : "Pending"} tone={profile.verified ? "success" : "neutral"} />
              <Row label="Company verified" value={company?.verified ? "Yes" : "Pending"} tone={company?.verified ? "success" : "neutral"} />
              <Row
                label="Profile completion"
                value={profile.onboardingCompleted ? "Done" : "Incomplete"}
                tone={profile.onboardingCompleted ? "success" : "neutral"}
              />
            </Card>

            <Card padding={24}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <Icon name="ListChecks" size={20} style={{ color: "var(--brand-700)" }} />
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 700,
                    fontSize: 18,
                    color: "var(--text-strong)",
                    margin: 0,
                  }}
                >
                  Quick Actions
                </h3>
              </div>
              <QuickLink label="Manage Company Settings" to={routes.recruiterSettings} navigate={navigate} />
              <QuickLink label="View All Applicants" to={routes.recruiterApplicants} navigate={navigate} />
              <QuickLink label="Browse Talent" to={routes.recruiterBrowseTalent} navigate={navigate} />
            </Card>

            <Card padding={24}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <Icon name="Tag" size={18} style={{ color: "var(--brand-700)" }} />
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 700,
                    fontSize: 16,
                    color: "var(--text-strong)",
                    margin: 0,
                  }}
                >
                  Plan
                </h3>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span
                  style={{
                    fontFamily: "var(--font-text)",
                    fontSize: 14,
                    color: "var(--text-body)",
                  }}
                >
                  Current plan
                </span>
                <Tag variant="brand">Starter</Tag>
              </div>
              <Button
                variant="outline"
                full
                type="button"
                style={{ marginTop: 12 }}
                onClick={() => navigate(routes.recruiterUpgrade)}
              >
                Upgrade
              </Button>
            </Card>
          </div>
        </div>
      ) : null}

      {tab === "security" ? <AccountSecurityPanel /> : null}
      {tab === "notifications" ? <NotificationCenter /> : null}
    </div>
  );
}

function TabBar({ tab, onTab }: { tab: Tab; onTab: (t: Tab) => void }) {
  return (
    <div
      style={{
        display: "flex",
        gap: 6,
        borderBottom: "1px solid var(--border-default)",
        marginBottom: 24,
      }}
    >
      {TABS.map((t) => {
        const active = t.id === tab;
        return (
          <button
            key={t.id}
            type="button"
            onClick={() => onTab(t.id)}
            style={{
              all: "unset",
              cursor: "pointer",
              padding: "10px 14px",
              borderBottom: `2px solid ${active ? "var(--brand-700)" : "transparent"}`,
              marginBottom: -1,
              fontFamily: "var(--font-text)",
              fontSize: 15,
              fontWeight: active ? 600 : 500,
              color: active ? "var(--brand-700)" : "var(--text-muted)",
            }}
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
}

function Row({ label, value, tone }: { label: string; value: string; tone: BadgeTone }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        fontFamily: "var(--font-text)",
        fontSize: 14,
        color: "var(--text-body)",
        padding: "6px 0",
      }}
    >
      <span>{label}</span>
      <Badge tone={tone}>{value}</Badge>
    </div>
  );
}

function QuickLink({
  label,
  to,
  navigate,
}: {
  label: string;
  to: string;
  navigate: (path: string) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => navigate(to)}
      style={{
        all: "unset",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "10px 12px",
        borderRadius: "var(--radius-sm)",
        width: "100%",
        boxSizing: "border-box",
        fontFamily: "var(--font-text)",
        fontSize: 14,
        fontWeight: 500,
        color: "var(--text-body)",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = "var(--surface-2)")}
      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
    >
      {label}
      <Icon name="ChevronRight" size={16} />
    </button>
  );
}
