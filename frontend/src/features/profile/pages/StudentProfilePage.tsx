/**
 * Student Profile Dashboard — the "your portfolio" surface.
 *
 * Layout:
 *   [ ProfileBanner (portfolio variant) ]
 *   [ Tabs: Overview · Account Security · Notifications ]
 *     Overview      → editable headline/bio/skills + CV manager + applied-gigs stub
 *     Security      → AccountSecurityPanel
 *     Notifications → NotificationCenter
 *
 * Server state lives in React Query (`useMe`); the edit form is local
 * React state seeded from the query data — saves call `usePatchProfile`,
 * which invalidates `["me"]` so the banner/chips refresh.
 */
import { useEffect, useState, useRef } from "react";
import { Navigate } from "react-router-dom";
import {
  Avatar,
  Badge,
  Button,
  Card,
  Input,
  PageLoader,
  Skeleton,
  useToast,
} from "@shared/ui";
import { Icon } from "@shared/icons";
import { useMe, usePatchProfile } from "@features/me";
import { useUpload, UPLOAD_LIMITS, validateForUpload } from "@features/uploads";
import { useCurrentUser } from "@features/auth";
import { useMyApplications } from "@features/applications";
import { routes } from "@shared/config/routes";
import { ApiError } from "@shared/lib/transport";
import { createFilePreview } from "@shared/lib/filePreview";
import { ProfileBanner } from "../components/ProfileBanner";
import { AccountSecurityPanel } from "../components/AccountSecurityPanel";
import { NotificationCenter } from "../components/NotificationCenter";

type Tab = "overview" | "security" | "notifications";

const TABS: ReadonlyArray<{ id: Tab; label: string }> = [
  { id: "overview", label: "Overview" },
  { id: "security", label: "Account Security" },
  { id: "notifications", label: "Notifications" },
];

const SUGGESTED_SKILLS = [
  "React",
  "TypeScript",
  "Node.js",
  "Python",
  "Figma",
  "UI Design",
  "Content Writing",
  "Data Analysis",
  "Photography",
  "Video Editing",
] as const;

export default function StudentProfilePage() {
  const user = useCurrentUser();
  const me = useMe();
  const patch = usePatchProfile();
  const upload = useUpload();
  const toast = useToast();
  const cvInputRef = useRef<HTMLInputElement>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const applied = useMyApplications();
  const [tab, setTab] = useState<Tab>("overview");
  const [editing, setEditing] = useState(false);
  const [headline, setHeadline] = useState("");
  const [bio, setBio] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");

  // Seed the form whenever fresh data arrives. Effect-only sync — the
  // form is never the source of truth, the query is.
  useEffect(() => {
    if (!me.data) return;
    setHeadline(me.data.user.headline ?? "");
    setBio(me.data.user.bio ?? "");
    setSkills(me.data.user.skills);
  }, [me.data]);

  // Recruiters belong on the other variant.
  if (user && user.role !== "student") {
    return <Navigate to={routes.recruiterDashboard} replace />;
  }
  if (me.isLoading) return <PageLoader />;
  if (me.isError || !me.data) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        <Icon name="AlertCircle" size={32} style={{ color: "var(--danger-500)" }} />
        <h2 style={{ fontFamily: "var(--font-display)", margin: "16px 0 8px" }}>Failed to load profile</h2>
        <p style={{ fontFamily: "var(--font-text)", color: "var(--text-muted)", marginBottom: 16 }}>
          {me.error instanceof Error ? me.error.message : "Couldn't fetch your profile."}
        </p>
        <Button variant="outline" onClick={() => me.refetch()}>Retry</Button>
      </div>
    );
  }

  const { user: profile, uploads } = me.data;

  const toggleSkill = (s: string): void => {
    setSkills((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));
  };

  const addCustomSkill = () => {
    const trimmed = skillInput.trim();
    if (!trimmed || skills.includes(trimmed)) return;
    setSkills((prev) => [...prev, trimmed]);
    setSkillInput("");
  };

  const save = async () => {
    try {
      await patch.mutateAsync({
        headline: headline.trim() || undefined,
        bio: bio.trim() || undefined,
        skills,
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

  const validateFile = (file: File, kind: "avatar" | "portfolio" | "banner"): boolean => {
    const issue = validateForUpload(kind, file);
    if (issue) {
      toast.error(issue.message);
      return false;
    }
    return true;
  };

  const handleCvUpload = async (file: File) => {
    if (!validateFile(file, "portfolio")) return;
    try {
      const preview = createFilePreview(file);
      const dto = await upload.mutateAsync({ kind: "portfolio", file });
      preview.revoke();
      toast.success("CV uploaded", { description: dto.originalName });
      void me.refetch();
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Upload failed.";
      toast.error("Couldn't upload CV", { description: msg });
    }
  };

  const handleAvatarUpload = async (file: File) => {
    if (!validateFile(file, "avatar")) return;
    try {
      const preview = createFilePreview(file);
      const dto = await upload.mutateAsync({ kind: "avatar", file });
      preview.revoke();
      await patch.mutateAsync({ avatarUrl: dto.url });
      toast.success("Profile picture updated");
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Upload failed.";
      toast.error("Couldn't update photo", { description: msg });
    }
  };

  return (
    <div style={{ padding: "32px 40px", maxWidth: 1180, margin: "0 auto" }}>
      <ProfileBanner user={profile} variant="portfolio" />

      <TabBar tab={tab} onTab={setTab} />

      {tab === "overview" ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.6fr 1fr",
            gap: 24,
          }}
        >
          {/* ---- Left column: editable identity ---- */}
          <div style={{ display: "grid", gap: 20 }}>
            <Card padding={28}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 18,
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
                  About
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
                    label="Professional headline"
                    placeholder="e.g. Junior UI Designer · Pulchowk Campus"
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
                      placeholder="A short intro about your background, what you build, what you're learning…"
                      style={{
                        width: "100%",
                        minHeight: 140,
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
                    <div
                      style={{
                        textAlign: "right",
                        fontFamily: "var(--font-text)",
                        fontSize: 12,
                        color: "var(--text-subtle)",
                        marginTop: 4,
                      }}
                    >
                      {bio.length}/2000
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                    <Button
                      variant="outline"
                      type="button"
                      onClick={() => {
                        setEditing(false);
                        setHeadline(profile.headline ?? "");
                        setBio(profile.bio ?? "");
                        setSkills(profile.skills);
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
                  ) : (
                    <EmptyHint
                      label="No headline yet"
                      hint="A one-line role descriptor helps recruiters scan your profile."
                    />
                  )}
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
                    <EmptyHint
                      label="No bio yet"
                      hint="A short intro tells recruiters who you are and what you build."
                    />
                  )}
                </div>
              )}
            </Card>

            {/* ---- Skills editor ---- */}
            <Card padding={28}>
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: 20,
                  color: "var(--text-strong)",
                  margin: "0 0 14px",
                }}
              >
                Skills
              </h3>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 14 }}>
                {skills.length === 0 ? (
                  <EmptyHint
                    label="No skills picked yet"
                    hint="Add at least 3 to start showing up in recruiter searches."
                  />
                ) : (
                  skills.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => editing && toggleSkill(s)}
                      disabled={!editing}
                      style={{
                        all: "unset",
                        cursor: editing ? "pointer" : "default",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        background: "var(--brand-50)",
                        color: "var(--brand-700)",
                        fontFamily: "var(--font-text)",
                        fontSize: 13,
                        fontWeight: 600,
                        padding: "6px 12px",
                        borderRadius: "9999px",
                      }}
                    >
                      {s}
                      {editing ? <Icon name="X" size={14} /> : null}
                    </button>
                  ))
                )}
              </div>
              {editing ? (
                <>
                  <div
                    style={{
                      fontFamily: "var(--font-text)",
                      fontSize: 13,
                      color: "var(--text-subtle)",
                      marginBottom: 8,
                    }}
                  >
                    Suggested
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 14 }}>
                    {SUGGESTED_SKILLS.filter((s) => !skills.includes(s)).map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => toggleSkill(s)}
                        style={{
                          all: "unset",
                          cursor: "pointer",
                          background: "transparent",
                          border: "1px solid var(--border-default)",
                          color: "var(--text-body)",
                          fontFamily: "var(--font-text)",
                          fontSize: 13,
                          fontWeight: 500,
                          padding: "5px 11px",
                          borderRadius: "9999px",
                        }}
                      >
                        + {s}
                      </button>
                    ))}
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <Input
                      placeholder="Add a custom skill"
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addCustomSkill();
                        }
                      }}
                    />
                    <Button variant="outline" type="button" onClick={addCustomSkill}>
                      Add
                    </Button>
                  </div>
                </>
              ) : null}
            </Card>

            {/* ---- Applied Gigs ---- */}
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
                  Applied Gigs
                </h3>
                {applied.data && applied.data.length > 0 ? (
                  <span
                    style={{
                      fontFamily: "var(--font-text)",
                      fontSize: 13,
                      color: "var(--text-subtle)",
                    }}
                  >
                    {applied.data.length} total
                  </span>
                ) : null}
              </div>
              {applied.isLoading ? (
                <>
                  <Skeleton width="100%" height={56} radius="var(--radius-sm)" />
                  <div style={{ height: 10 }} />
                  <Skeleton width="80%" height={56} radius="var(--radius-sm)" />
                </>
              ) : applied.isError ? (
                <div
                  style={{
                    border: "1px solid var(--border-default)",
                    borderRadius: "var(--radius-sm)",
                    padding: "16px",
                    textAlign: "center",
                    fontFamily: "var(--font-text)",
                    fontSize: 14,
                    color: "var(--text-muted)",
                  }}
                >
                  Could not load applications. Please try again.
                </div>
              ) : applied.data && applied.data.length > 0 ? (
                <div style={{ display: "grid", gap: 10 }}>
                  {applied.data.map((a) => (
                    <div
                      key={a.id}
                      style={{
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
                          {a.gig.title}
                        </div>
                        <div
                          style={{
                            fontFamily: "var(--font-text)",
                            fontSize: 13,
                            color: "var(--text-subtle)",
                          }}
                        >
                          {a.gig.company.name}
                        </div>
                      </div>
                      <Badge
                        tone={
                          a.status === "accepted"
                            ? "success"
                            : a.status === "rejected"
                              ? "rejected"
                              : a.status === "reviewing"
                                ? "reviewing"
                                : "neutral"
                        }
                      >
                        {a.status.charAt(0).toUpperCase() + a.status.slice(1)}
                      </Badge>
                    </div>
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
                  No gigs applied yet. Browse available gigs to get started.
                </div>
              )}
            </Card>
          </div>

          {/* ---- Right column: CV management + verification ---- */}
          <div style={{ display: "grid", gap: 20 }}>
            <Card padding={24}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                <Icon name="FileText" size={20} style={{ color: "var(--brand-700)" }} />
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 700,
                    fontSize: 18,
                    color: "var(--text-strong)",
                    margin: 0,
                  }}
                >
                  CV / Portfolio
                </h3>
              </div>
              {uploads.portfolio ? (
                <>
                  <a
                    href={uploads.portfolio.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "12px 14px",
                      border: "1px solid var(--border-default)",
                      borderRadius: "var(--radius-sm)",
                      textDecoration: "none",
                      color: "var(--text-strong)",
                    }}
                  >
                    <span
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: "var(--radius-sm)",
                        background: "var(--brand-50)",
                        color: "var(--brand-700)",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Icon name="FileText" size={18} />
                    </span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontFamily: "var(--font-text)",
                          fontWeight: 600,
                          fontSize: 14,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {uploads.portfolio.originalName}
                      </div>
                      <div
                        style={{
                          fontFamily: "var(--font-text)",
                          fontSize: 12,
                          color: "var(--text-subtle)",
                        }}
                      >
                        Preview in a new tab
                      </div>
                    </div>
                    <Icon name="ExternalLink" size={16} />
                  </a>
                  <div style={{ height: 10 }} />
                </>
              ) : (
                <div
                  style={{
                    border: "2px dashed var(--border-strong)",
                    borderRadius: "var(--radius-sm)",
                    padding: "20px 16px",
                    textAlign: "center",
                    marginBottom: 10,
                    fontFamily: "var(--font-text)",
                    fontSize: 13,
                    color: "var(--text-muted)",
                  }}
                >
                  No CV uploaded yet.
                </div>
              )}
              <input
                ref={cvInputRef}
                type="file"
                accept={UPLOAD_LIMITS.portfolio.accept.join(",")}
                style={{ display: "none" }}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  e.target.value = "";
                  if (file) void handleCvUpload(file);
                }}
              />
              <Button
                variant="outline"
                full
                type="button"
                disabled={upload.isPending && upload.variables?.kind === "portfolio"}
                iconLeft={<Icon name="Upload" size={16} />}
                onClick={() => cvInputRef.current?.click()}
              >
                {uploads.portfolio ? "Replace CV" : "Upload CV"}
              </Button>
            </Card>

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
                  Trust & Verification
                </h3>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  fontFamily: "var(--font-text)",
                  fontSize: 14,
                  color: "var(--text-body)",
                  marginTop: 8,
                }}
              >
                <span>Email verified</span>
                <Badge tone={profile.verified ? "success" : "neutral"}>
                  {profile.verified ? "Yes" : "Pending"}
                </Badge>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  fontFamily: "var(--font-text)",
                  fontSize: 14,
                  color: "var(--text-body)",
                  marginTop: 8,
                }}
              >
                <span>Government ID on file</span>
                <Badge tone={uploads.nid ? "success" : "neutral"}>
                  {uploads.nid ? "Submitted" : "Missing"}
                </Badge>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  fontFamily: "var(--font-text)",
                  fontSize: 14,
                  color: "var(--text-body)",
                  marginTop: 8,
                }}
              >
                <span>Profile completion</span>
                <Badge tone={profile.onboardingCompleted ? "success" : "neutral"}>
                  {profile.onboardingCompleted ? "Done" : "Incomplete"}
                </Badge>
              </div>
            </Card>

            {/* Compact identity */}
            <Card padding={20}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ position: "relative" }}>
                  <Avatar
                    src={profile.avatarUrl}
                    name={profile.fullName}
                    size={48}
                    shape="circle"
                  />
                  <input
                    ref={avatarInputRef}
                    type="file"
                    accept={UPLOAD_LIMITS.avatar.accept.join(",")}
                    style={{ display: "none" }}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      e.target.value = "";
                      if (file) void handleAvatarUpload(file);
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => avatarInputRef.current?.click()}
                    disabled={upload.isPending && upload.variables?.kind === "avatar"}
                    style={{
                      position: "absolute",
                      bottom: -2,
                      right: -2,
                      width: 20,
                      height: 20,
                      borderRadius: "50%",
                      border: "2px solid var(--surface-0)",
                      background: "var(--brand-700)",
                      color: "#fff",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      padding: 0,
                      lineHeight: 1,
                    }}
                  >
                    <Icon name="Camera" size={10} />
                  </button>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontFamily: "var(--font-text)",
                      fontWeight: 600,
                      fontSize: 14,
                      color: "var(--text-strong)",
                    }}
                  >
                    {profile.fullName}
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-text)",
                      fontSize: 12,
                      color: "var(--text-subtle)",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {profile.email}
                  </div>
                </div>
              </div>
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

function EmptyHint({ label, hint }: { label: string; hint: string }) {
  return (
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
      <strong style={{ color: "var(--text-strong)" }}>{label}.</strong> {hint}
    </div>
  );
}
