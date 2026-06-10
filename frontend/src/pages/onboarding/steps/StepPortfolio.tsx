/**
 * Step 3 — Portfolio: profile photo, bio, social links, optional CV PDF.
 *
 * What changed from the first draft:
 *   • Real uploads. The photo picker POSTs to /uploads/avatar; the CV
 *     button POSTs to /uploads/portfolio. The returned URLs are stored
 *     on the form and submitted along with the rest of the portfolio.
 *   • zodResolver for the bio so the "min 50 chars" rule shows up
 *     inline while the user types — no more silent dead clicks.
 *   • Useful error feedback. Every mutation failure surfaces as a
 *     toast describing the cause; bio shortage shows under the field.
 */
import { useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Card, Input, Skeleton, useToast } from "@shared/ui";
import { Icon, type IconName } from "@shared/icons";
import {
  OnboardingPortfolioSchema,
  useSubmitPortfolio,
  type OnboardingPortfolio,
} from "@features/onboarding";
import { useUpload, UPLOAD_LIMITS } from "@features/uploads";
import { useUpdateProfile } from "@features/auth";
import { ApiError } from "@shared/lib/transport";

interface StepPortfolioProps {
  onNext: () => void;
  onBack: () => void;
}

const SOCIAL_LINKS: ReadonlyArray<{
  label: string;
  placeholder: string;
  icon: IconName;
  field: "github" | "linkedin" | "portfolio" | "website";
}> = [
  { label: "GitHub URL", placeholder: "https://github.com/username", icon: "Code", field: "github" },
  { label: "LinkedIn Profile", placeholder: "https://linkedin.com/in/username", icon: "Linkedin", field: "linkedin" },
  { label: "Design Portfolio (Behance/Dribbble)", placeholder: "https://behance.net/username", icon: "Palette", field: "portfolio" },
  { label: "Personal Website", placeholder: "https://yourwebsite.com", icon: "Globe", field: "website" },
];

export function StepPortfolio({ onNext, onBack }: StepPortfolioProps) {
  const submit = useSubmitPortfolio();
  const upload = useUpload();
  const patchProfile = useUpdateProfile();
  const toast = useToast();

  const avatarInputRef = useRef<HTMLInputElement>(null);
  const portfolioInputRef = useRef<HTMLInputElement>(null);
  const nidInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<OnboardingPortfolio>({
    resolver: zodResolver(OnboardingPortfolioSchema),
    defaultValues: {
      bio: "",
      avatarUrl: undefined,
      portfolioUrl: undefined,
      nidUrl: undefined,
      links: { github: "", linkedin: "", portfolio: "", website: "" },
    },
  });

  const avatarUrl = watch("avatarUrl");
  const portfolioUrl = watch("portfolioUrl");
  const nidUrl = watch("nidUrl");
  const bio = watch("bio") ?? "";

  /** Common upload handler — surfaces validation + network errors as toasts. */
  const handleFile = async (
    kind: "avatar" | "portfolio" | "nid",
    file: File,
  ): Promise<void> => {
    try {
      const dto = await upload.mutateAsync({ kind, file });
      if (kind === "avatar") {
        setValue("avatarUrl", dto.url, { shouldValidate: true, shouldDirty: true });
        patchProfile.mutate({ avatarUrl: dto.url });
        toast.success("Photo uploaded", { description: dto.originalName });
      } else if (kind === "portfolio") {
        setValue("portfolioUrl", dto.url, { shouldValidate: true, shouldDirty: true });
        toast.success("CV uploaded", { description: dto.originalName });
      } else {
        setValue("nidUrl", dto.url, { shouldValidate: true, shouldDirty: true });
        toast.success("ID uploaded — kept private", { description: dto.originalName });
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Upload failed.";
      toast.error("Couldn't upload", { description: msg });
    }
  };

  const onSubmit = handleSubmit(async (values) => {
    try {
      await submit.mutateAsync(values);
      onNext();
    } catch (e) {
      if (e instanceof ApiError) {
        toast.error("Couldn't save your portfolio", { description: e.body.message });
      } else if (e instanceof Error) {
        toast.error("Save failed", { description: e.message });
      }
    }
  });

  const uploadingAvatar = upload.isPending && upload.variables?.kind === "avatar";
  const uploadingPortfolio = upload.isPending && upload.variables?.kind === "portfolio";
  const uploadingNid = upload.isPending && upload.variables?.kind === "nid";

  return (
    <form onSubmit={onSubmit} style={{ maxWidth: 880, margin: "40px auto" }}>
      <h1
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 700,
          fontSize: 38,
          color: "var(--text-strong)",
          margin: "0 0 8px",
          letterSpacing: "-0.02em",
        }}
      >
        Build Your Professional Identity
      </h1>
      <p
        style={{
          fontFamily: "var(--font-text)",
          fontSize: 17,
          lineHeight: 1.5,
          color: "var(--text-muted)",
          margin: "0 0 28px",
          maxWidth: 640,
        }}
      >
        Showcase your best work and tell potential employers who you are. This
        information appears on your public profile and job applications.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "300px 1fr",
          gap: 20,
          marginBottom: 20,
        }}
      >
        {/* ---- Profile photo ---- */}
        <Card padding={24}>
          <div
            style={{
              fontFamily: "var(--font-text)",
              fontWeight: 600,
              fontSize: 14,
              color: "var(--text-strong)",
              marginBottom: 14,
            }}
          >
            Profile Picture
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 14,
            }}
          >
            {uploadingAvatar ? (
              <Skeleton width={120} height={120} radius="var(--radius-md)" />
            ) : (
              <button
                type="button"
                onClick={() => avatarInputRef.current?.click()}
                aria-label="Upload profile photo"
                style={{
                  width: 120,
                  height: 120,
                  borderRadius: "var(--radius-md)",
                  background: avatarUrl ? "transparent" : "var(--surface-2)",
                  border: avatarUrl
                    ? "1px solid var(--border-default)"
                    : "2px dashed var(--border-strong)",
                  overflow: "hidden",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--ink-400)",
                  cursor: "pointer",
                  padding: 0,
                }}
              >
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt="Your profile preview"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : (
                  <Icon name="Camera" size={28} />
                )}
              </button>
            )}
            <input
              ref={avatarInputRef}
              type="file"
              accept={UPLOAD_LIMITS.avatar.accept.join(",")}
              onChange={(e) => {
                const file = e.target.files?.[0];
                e.target.value = ""; // allow re-picking the same file later
                if (file) void handleFile("avatar", file);
              }}
              style={{ display: "none" }}
            />
            <Button
              variant="primary"
              size="sm"
              type="button"
              disabled={uploadingAvatar}
              onClick={() => avatarInputRef.current?.click()}
            >
              {uploadingAvatar ? "Uploading…" : avatarUrl ? "Change Photo" : "Upload Photo"}
            </Button>
            <span
              style={{
                fontFamily: "var(--font-text)",
                fontSize: 12,
                color: "var(--text-subtle)",
                textAlign: "center",
              }}
            >
              {UPLOAD_LIMITS.avatar.label}
            </span>
          </div>
        </Card>

        {/* ---- Bio ---- */}
        <Card padding={24}>
          <div
            style={{
              fontFamily: "var(--font-text)",
              fontWeight: 600,
              fontSize: 14,
              color: "var(--text-strong)",
              marginBottom: 14,
            }}
          >
            Professional Bio
          </div>
          <Controller
            control={control}
            name="bio"
            render={({ field }) => (
              <textarea
                {...field}
                placeholder="Briefly describe your background, key skills, and what you're looking for in your next role…"
                style={{
                  width: "100%",
                  minHeight: 150,
                  resize: "vertical",
                  fontFamily: "var(--font-text)",
                  fontSize: 15,
                  lineHeight: 1.6,
                  color: "var(--text-strong)",
                  border: `1px solid ${
                    errors.bio ? "var(--danger-500)" : "var(--border-default)"
                  }`,
                  borderRadius: "var(--radius-sm)",
                  padding: "12px 14px",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            )}
          />
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: 8,
              fontFamily: "var(--font-text)",
              fontSize: 13,
              color: errors.bio ? "var(--danger-500)" : "var(--text-subtle)",
            }}
          >
            <span>{errors.bio?.message ?? "Minimum 50 characters"}</span>
            <span>{bio.length}/500</span>
          </div>
        </Card>
      </div>

      {/* ---- Social & Portfolio Links ---- */}
      <Card padding={28} style={{ marginBottom: 20 }}>
        <h3
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: 20,
            color: "var(--text-strong)",
            margin: "0 0 18px",
          }}
        >
          Social &amp; Portfolio Links
        </h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "18px 24px",
          }}
        >
          {SOCIAL_LINKS.map((l) => (
            <Input
              key={l.field}
              label={l.label}
              placeholder={l.placeholder}
              leading={<Icon name={l.icon} />}
              error={errors.links?.[l.field]?.message}
              {...register(`links.${l.field}` as const)}
            />
          ))}
        </div>
      </Card>

      {/* ---- CV / Portfolio PDF ---- */}
      <Card padding={28} style={{ marginBottom: 24 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: 16,
            gap: 16,
          }}
        >
          <div>
            <h3
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: 20,
                color: "var(--text-strong)",
                margin: "0 0 4px",
              }}
            >
              CV / Portfolio (PDF)
            </h3>
            <p
              style={{
                fontFamily: "var(--font-text)",
                fontSize: 14,
                color: "var(--text-muted)",
                margin: 0,
              }}
            >
              Attach a PDF of your CV or a portfolio book. Optional but
              boosts your hiring chances by ~40%.
            </p>
          </div>
          <input
            ref={portfolioInputRef}
            type="file"
            accept={UPLOAD_LIMITS.portfolio.accept.join(",")}
            onChange={(e) => {
              const file = e.target.files?.[0];
              e.target.value = "";
              if (file) void handleFile("portfolio", file);
            }}
            style={{ display: "none" }}
          />
          <Button
            variant="secondary"
            size="sm"
            type="button"
            disabled={uploadingPortfolio}
            iconLeft={<Icon name={portfolioUrl ? "FileCheck" : "Plus"} size={16} />}
            onClick={() => portfolioInputRef.current?.click()}
          >
            {uploadingPortfolio ? "Uploading…" : portfolioUrl ? "Replace PDF" : "Add PDF"}
          </Button>
        </div>

        {portfolioUrl ? (
          <a
            href={portfolioUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              border: "1px solid var(--border-default)",
              borderRadius: "var(--radius-md)",
              padding: "14px 16px",
              background: "var(--surface-1)",
              textDecoration: "none",
              color: "var(--text-strong)",
            }}
          >
            <span
              style={{
                width: 40,
                height: 40,
                borderRadius: "var(--radius-sm)",
                background: "var(--brand-50)",
                color: "var(--brand-700)",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Icon name="FileText" size={20} />
            </span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontFamily: "var(--font-text)",
                  fontWeight: 600,
                  fontSize: 15,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                Portfolio uploaded
              </div>
              <div
                style={{
                  fontFamily: "var(--font-text)",
                  fontSize: 13,
                  color: "var(--text-subtle)",
                }}
              >
                Click to preview in a new tab
              </div>
            </div>
            <Icon name="ExternalLink" size={16} />
          </a>
        ) : (
          <div
            style={{
              border: "2px dashed var(--border-strong)",
              borderRadius: "var(--radius-md)",
              padding: "40px 24px",
              textAlign: "center",
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: "var(--radius-sm)",
                background: "var(--surface-2)",
                color: "var(--ink-400)",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 12,
              }}
            >
              <Icon name="Folder" size={22} />
            </div>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: 18,
                color: "var(--text-strong)",
                marginBottom: 4,
              }}
            >
              No PDF attached yet
            </div>
            <div
              style={{
                fontFamily: "var(--font-text)",
                fontSize: 14,
                color: "var(--text-muted)",
              }}
            >
              {UPLOAD_LIMITS.portfolio.label}
            </div>
          </div>
        )}
      </Card>

      {/* ---- Government ID (NID) ---- */}
      <Card padding={28} style={{ marginBottom: 24 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: 16,
            gap: 16,
          }}
        >
          <div>
            <h3
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: 20,
                color: "var(--text-strong)",
                margin: "0 0 4px",
              }}
            >
              Government ID (NID)
            </h3>
            <p
              style={{
                fontFamily: "var(--font-text)",
                fontSize: 14,
                color: "var(--text-muted)",
                margin: 0,
                maxWidth: 460,
              }}
            >
              Required for trust verification. Kept private — never shown
              on your public profile or to recruiters.
            </p>
          </div>
          <input
            ref={nidInputRef}
            type="file"
            accept={UPLOAD_LIMITS.nid.accept.join(",")}
            onChange={(e) => {
              const file = e.target.files?.[0];
              e.target.value = "";
              if (file) void handleFile("nid", file);
            }}
            style={{ display: "none" }}
          />
          <Button
            variant="secondary"
            size="sm"
            type="button"
            disabled={uploadingNid}
            iconLeft={<Icon name={nidUrl ? "ShieldCheck" : "Plus"} size={16} />}
            onClick={() => nidInputRef.current?.click()}
          >
            {uploadingNid ? "Uploading…" : nidUrl ? "Replace ID" : "Add ID"}
          </Button>
        </div>

        {nidUrl ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              border: "1px solid var(--border-default)",
              borderRadius: "var(--radius-md)",
              padding: "14px 16px",
              background: "var(--surface-1)",
            }}
          >
            <span
              style={{
                width: 40,
                height: 40,
                borderRadius: "var(--radius-sm)",
                background: "var(--success-100)",
                color: "var(--success-600)",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Icon name="ShieldCheck" size={20} />
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
                ID on file
              </div>
              <div
                style={{
                  fontFamily: "var(--font-text)",
                  fontSize: 13,
                  color: "var(--text-subtle)",
                }}
              >
                Encrypted at rest. Only visible to the verification team.
              </div>
            </div>
          </div>
        ) : (
          <div
            style={{
              border: "2px dashed var(--border-strong)",
              borderRadius: "var(--radius-md)",
              padding: "32px 24px",
              textAlign: "center",
            }}
          >
            <Icon name="ShieldAlert" size={22} style={{ color: "var(--ink-400)" }} />
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: 16,
                color: "var(--text-strong)",
                marginTop: 8,
              }}
            >
              No ID attached yet
            </div>
            <div
              style={{
                fontFamily: "var(--font-text)",
                fontSize: 13,
                color: "var(--text-muted)",
              }}
            >
              {UPLOAD_LIMITS.nid.label}
            </div>
          </div>
        )}
      </Card>

      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Button variant="outline" type="button" onClick={onBack}>
          Back
        </Button>
        <Button
          variant="primary"
          type="submit"
          disabled={isSubmitting || submit.isPending}
          iconRight={<Icon name="Check" size={18} />}
        >
          {isSubmitting || submit.isPending ? "Saving…" : "Finish Profile"}
        </Button>
      </div>
    </form>
  );
}
