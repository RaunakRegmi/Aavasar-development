/**
 * ProfileBanner — the hero strip at the top of every ProfileDashboard.
 *
 *   • Student variant ("portfolio") leads with the name + headline + skill
 *     tags, framing the page as a public-facing portfolio.
 *   • Recruiter variant ("brand")  leads with the company name + a
 *     verified mark, framing the page as a company brand surface.
 *
 * The image strip is the user's banner upload (swap via the glassy
 * "Change Banner" pill). The avatar can be swapped via the camera button
 * on the avatar itself. Both go through `useUpload` and mirror onto the
 * user row so the page re-renders with fresh media.
 *
 * Tokens-only: every spacing/color/shadow uses Aavasar CSS variables.
 */
import { useRef, useState } from "react";
import { Avatar, Tag, Card, useToast } from "@shared/ui";
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
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [bannerBroken, setBannerBroken] = useState(false);

  const resolvedBannerUrl = resolveImageUrl(bannerPreview ?? user.bannerUrl);
  const showBanner = resolvedBannerUrl && !bannerBroken;

  const isPortfolio = variant === "portfolio";
  const accentGradient = isPortfolio
    ? "linear-gradient(135deg, var(--brand-700) 0%, var(--brand-500) 100%)"
    : "linear-gradient(135deg, var(--accent-earth) 0%, var(--brand-700) 100%)";

  const bannerUploading = upload.isPending && upload.variables?.kind === "banner";
  const avatarUploading = upload.isPending && upload.variables?.kind === "avatar";

  const handleBanner = async (file: File) => {
    const issue = validateForUpload("banner", file);
    if (issue) return void toast.error(issue.message);
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
      toast.error("Upload failed", {
        description: e instanceof Error ? e.message : "Couldn't upload banner.",
      });
    }
  };

  const handleAvatar = async (file: File) => {
    const issue = validateForUpload("avatar", file);
    if (issue) return void toast.error(issue.message);
    const preview = createFilePreview(file);
    try {
      const dto = await upload.mutateAsync({ kind: "avatar", file });
      preview.revoke();
      patchProfile.mutate({ avatarUrl: dto.url });
      toast.success("Profile picture updated");
    } catch (e) {
      preview.revoke();
      toast.error("Couldn't update photo", {
        description: e instanceof Error ? e.message : "Upload failed.",
      });
    }
  };

  return (
    <Card padding={0} radius="lg" style={{ overflow: "hidden", marginBottom: 28 }}>
      {/* ---- Hero strip ---- */}
      <div style={{ position: "relative", height: 200, background: accentGradient }}>
        {showBanner ? (
          <img
            src={resolvedBannerUrl}
            alt=""
            onError={() => setBannerBroken(true)}
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : null}

        {/* Bottom scrim — depth + keeps any overlaid control legible on any image. */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(180deg, rgba(0,0,0,0.18) 0%, rgba(0,0,0,0) 35%, rgba(0,0,0,0) 60%, rgba(0,0,0,0.28) 100%)",
            pointerEvents: "none",
          }}
        />

        {/* Glassy "Change Banner" pill — readable over any image. */}
        <input
          ref={bannerInputRef}
          type="file"
          accept={UPLOAD_LIMITS.banner.accept.join(",")}
          onChange={(e) => {
            const file = e.target.files?.[0];
            e.target.value = "";
            if (file) void handleBanner(file);
          }}
          style={{ display: "none" }}
        />
        <button
          type="button"
          disabled={bannerUploading}
          onClick={() => bannerInputRef.current?.click()}
          style={{
            position: "absolute",
            top: 16,
            right: 16,
            display: "inline-flex",
            alignItems: "center",
            gap: 7,
            padding: "8px 14px",
            borderRadius: "9999px",
            border: "1px solid rgba(255,255,255,0.35)",
            background: "rgba(17,24,28,0.45)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            color: "#fff",
            fontFamily: "var(--font-text)",
            fontSize: 13,
            fontWeight: 600,
            cursor: bannerUploading ? "default" : "pointer",
            opacity: bannerUploading ? 0.7 : 1,
          }}
        >
          <Icon name="Image" size={14} />
          {bannerUploading ? "Uploading…" : user.bannerUrl ? "Change Banner" : "Add Banner"}
        </button>
      </div>

      {/* ---- Identity panel ---- */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          gap: 24,
          padding: "0 32px 28px",
          marginTop: -60,
        }}
      >
        {/* Avatar + camera-change control */}
        <div style={{ position: "relative", flexShrink: 0 }}>
          <Avatar
            src={user.avatarUrl}
            name={user.fullName}
            size={128}
            shape="squircle"
            style={{
              border: "4px solid var(--surface-0)",
              boxShadow: "var(--shadow-lg)",
              background: "var(--surface-0)",
            }}
          />
          <input
            ref={avatarInputRef}
            type="file"
            accept={UPLOAD_LIMITS.avatar.accept.join(",")}
            onChange={(e) => {
              const file = e.target.files?.[0];
              e.target.value = "";
              if (file) void handleAvatar(file);
            }}
            style={{ display: "none" }}
          />
          <button
            type="button"
            aria-label="Change profile photo"
            disabled={avatarUploading}
            onClick={() => avatarInputRef.current?.click()}
            style={{
              position: "absolute",
              bottom: 6,
              right: 6,
              width: 32,
              height: 32,
              borderRadius: "50%",
              border: "3px solid var(--surface-0)",
              background: "var(--brand-700)",
              color: "#fff",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: avatarUploading ? "default" : "pointer",
              padding: 0,
              boxShadow: "var(--shadow-sm)",
            }}
          >
            <Icon name="Camera" size={14} />
          </button>
        </div>

        {/* Name / headline / skills */}
        <div style={{ flex: 1, minWidth: 0, paddingBottom: 6 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: 30,
                color: "var(--text-strong)",
                margin: 0,
                letterSpacing: "-0.02em",
                lineHeight: 1.1,
              }}
            >
              {!isPortfolio && company ? company.name : user.fullName}
            </h1>
            {!isPortfolio && company?.verified ? (
              <span
                title="Verified company"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4,
                  background: "var(--success-100)",
                  color: "var(--success-700-text)",
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

          {/* Secondary line: headline (portfolio) or "Managed by" (brand) */}
          {!isPortfolio ? (
            <div style={{ fontFamily: "var(--font-text)", fontSize: 14, fontWeight: 500, color: "var(--text-muted)", marginTop: 4 }}>
              Managed by {user.fullName}
            </div>
          ) : user.headline ? (
            <div style={{ fontFamily: "var(--font-text)", fontSize: 16, color: "var(--text-muted)", marginTop: 4 }}>
              {user.headline}
            </div>
          ) : (
            <div style={{ fontFamily: "var(--font-text)", fontSize: 14, color: "var(--text-subtle)", marginTop: 4 }}>
              Add a headline to introduce yourself
            </div>
          )}

          {/* Skill chips — portfolio only */}
          {isPortfolio && user.skills.length > 0 ? (
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 12 }}>
              {user.skills.slice(0, 6).map((s) => (
                <Tag key={s} variant="brand">{s}</Tag>
              ))}
              {user.skills.length > 6 ? (
                <span style={{ fontFamily: "var(--font-text)", fontSize: 13, color: "var(--text-subtle)", alignSelf: "center" }}>
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
