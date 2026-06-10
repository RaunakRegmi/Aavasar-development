/**
 * ProfileBanner — the hero strip at the top of every ProfileDashboard.
 *
 *   • Student variant ("portfolio") leads with the headline + skill tags,
 *     framing the page as a public-facing portfolio.
 *   • Recruiter variant ("brand")  leads with the company name + a
 *     verified mark, framing the page as a company brand surface.
 *
 * The image strip itself is the user's banner upload. The user can swap
 * it with the "Change Banner" pill — that triggers an `useUpload`
 * mutation against POST /uploads/banner, which the backend auto-mirrors
 * onto `user.bannerUrl` so the page re-renders with the fresh image.
 *
 * Tokens-only: every spacing/color/shadow uses Aavasar CSS variables.
 */
import { useRef, useState } from "react";
import { Avatar, Button, Tag, Card, useToast } from "@shared/ui";
import { Icon } from "@shared/icons";
import { useUpload, UPLOAD_LIMITS, validateForUpload } from "@features/uploads";
import { usePatchProfile } from "@features/me";
import { createFilePreview } from "@shared/lib/filePreview";
import { resolveImageUrl } from "@shared/lib/resolveImageUrl";
import type { SessionUser } from "@features/auth";
import type { CompanyRef } from "@features/me";

interface ProfileBannerProps {
  user: SessionUser;
  /** Recruiter context. Pass null for student-facing banners. */
  company?: CompanyRef | null;
  /** "portfolio" for students, "brand" for recruiters. */
  variant: "portfolio" | "brand";
}

export function ProfileBanner({ user, company, variant }: ProfileBannerProps) {
  const upload = useUpload();
  const patchProfile = usePatchProfile();
  const toast = useToast();
  const inputRef = useRef<HTMLInputElement>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [bannerBroken, setBannerBroken] = useState(false);

  const resolvedBannerUrl = resolveImageUrl(bannerPreview ?? user.bannerUrl);
  const showBanner = resolvedBannerUrl && !bannerBroken;

  const isPortfolio = variant === "portfolio";
  const accentGradient = isPortfolio
    ? "linear-gradient(135deg, var(--brand-700) 0%, var(--brand-500) 100%)"
    : "linear-gradient(135deg, var(--accent-earth) 0%, var(--brand-700) 100%)";

  const handleBanner = async (file: File) => {
    const issue = validateForUpload("banner", file);
    if (issue) {
      toast.error(issue.message);
      return;
    }
    setBannerBroken(false);
    const preview = createFilePreview(file);
    setBannerPreview(preview.objectUrl);
    try {
      const dto = await upload.mutateAsync({ kind: "banner", file });
      preview.revoke();
      setBannerPreview(null);
      patchProfile.mutate({ bannerUrl: dto.url });
      toast.success("Banner updated");
    } catch (e) {
      preview.revoke();
      setBannerPreview(null);
      const msg = e instanceof Error ? e.message : "Couldn't upload banner.";
      toast.error("Upload failed", { description: msg });
    }
  };

  return (
    <Card padding={0} radius="lg" style={{ overflow: "hidden", marginBottom: 28 }}>
      {/* ---- Hero strip ---- */}
      <div
        style={{
          position: "relative",
          height: 220,
          background: accentGradient,
        }}
      >
        {showBanner ? (
          <img
            src={resolvedBannerUrl}
            alt=""
            onError={() => setBannerBroken(true)}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        ) : (
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: accentGradient,
            }}
          />
        )}

        {/* Top-right "Change Banner" pill — sits over both empty and image states */}
        <div
          style={{
            position: "absolute",
            top: 16,
            right: 16,
            display: "flex",
            gap: 8,
          }}
        >
          <input
            ref={inputRef}
            type="file"
            accept={UPLOAD_LIMITS.banner.accept.join(",")}
            onChange={(e) => {
              const file = e.target.files?.[0];
              e.target.value = "";
              if (file) void handleBanner(file);
            }}
            style={{ display: "none" }}
          />
          <Button
            variant="secondary"
            size="sm"
            type="button"
            disabled={upload.isPending}
            iconLeft={<Icon name="Image" size={14} />}
            onClick={() => inputRef.current?.click()}
          >
            {upload.isPending ? "Uploading…" : user.bannerUrl ? "Change Banner" : "Add Banner"}
          </Button>
        </div>
      </div>

      {/* ---- Identity panel ---- */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          gap: 24,
          padding: "0 32px 24px",
          marginTop: -48,
        }}
      >
        <Avatar
          src={user.avatarUrl}
          name={user.fullName}
          size={120}
          shape="squircle"
          style={{
            border: "4px solid var(--surface-0)",
            boxShadow: "var(--shadow-md)",
            background: "var(--surface-0)",
          }}
        />
        <div style={{ flex: 1, minWidth: 0, paddingBottom: 8 }}>
          {/* Brand variant: company name dominates */}
          {!isPortfolio && company ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 4,
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: 32,
                  color: "var(--text-strong)",
                  letterSpacing: "-0.02em",
                }}
              >
                {company.name}
              </span>
              {company.verified ? (
                <span
                  title="Verified company"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 4,
                    background: "var(--success-100)",
                    color: "var(--success-600)",
                    padding: "4px 10px",
                    borderRadius: "9999px",
                    fontFamily: "var(--font-text)",
                    fontSize: 12,
                    fontWeight: 600,
                  }}
                >
                  <Icon name="BadgeCheck" size={14} />
                  Verified
                </span>
              ) : null}
            </div>
          ) : null}

          {/* Portfolio variant: full name dominates */}
          {isPortfolio ? (
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: 32,
                color: "var(--text-strong)",
                margin: "0 0 4px",
                letterSpacing: "-0.02em",
              }}
            >
              {user.fullName}
            </h1>
          ) : (
            <div
              style={{
                fontFamily: "var(--font-text)",
                fontSize: 15,
                fontWeight: 600,
                color: "var(--text-muted)",
              }}
            >
              Managed by {user.fullName}
            </div>
          )}

          {user.headline ? (
            <div
              style={{
                fontFamily: "var(--font-text)",
                fontSize: 16,
                color: "var(--text-muted)",
                marginTop: 2,
              }}
            >
              {user.headline}
            </div>
          ) : null}

          {/* Skill chips appear inline on the portfolio variant only */}
          {isPortfolio && user.skills.length > 0 ? (
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 12 }}>
              {user.skills.slice(0, 6).map((s) => (
                <Tag key={s} variant="brand">{s}</Tag>
              ))}
              {user.skills.length > 6 ? (
                <span
                  style={{
                    fontFamily: "var(--font-text)",
                    fontSize: 13,
                    color: "var(--text-subtle)",
                    alignSelf: "center",
                  }}
                >
                  +{user.skills.length - 6} more
                </span>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </Card>
  );
}
