import { useState, useRef, type ChangeEvent } from "react";
import { Navigate } from "react-router-dom";
import {
  Button,
  Card,
  Input,
  Badge,
  useToast,
} from "@shared/ui";
import { Icon } from "@shared/icons";
import { useCurrentUser } from "@features/auth";
import { useUpload, UPLOAD_LIMITS, validateForUpload } from "@features/uploads";
import { routes } from "@shared/config/routes";
import { createFilePreview } from "@shared/lib/filePreview";
import { useRegisterCompany } from "../hooks/useRegisterCompany";
import type { CompanyRegistrationFormValues, CompanyRegistrationResponse } from "../contracts/company.registration.contract";
import { CompanyRegistrationFormSchema } from "../contracts/company.registration.contract";

type Section = "info" | "media" | "review";

export default function CompanyRegistrationPage() {
  const user = useCurrentUser();
  const upload = useUpload();
  const register = useRegisterCompany();
  const toast = useToast();

  const logoInputRef = useRef<HTMLInputElement>(null);
  const docInputRef = useRef<HTMLInputElement>(null);

  const [section, setSection] = useState<Section>("info");
  const [submitted, setSubmitted] = useState<CompanyRegistrationResponse | null>(null);

  const [form, setForm] = useState<CompanyRegistrationFormValues>({
    name: "",
    panVat: "",
    registrationNumber: "",
    ownerPhone: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof CompanyRegistrationFormValues, string>>>({});
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [docUrl, setDocUrl] = useState<string | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [docName, setDocName] = useState<string | null>(null);

  if (user && user.role !== "recruiter") {
    return <Navigate to={user.role === "student" ? routes.studentDashboard : routes.home} replace />;
  }
  if (!user) {
    return <Navigate to={routes.logIn} replace />;
  }

  if (submitted) {
    return <UnderReviewDashboard registration={submitted} />;
  }

  const setField = <K extends keyof CompanyRegistrationFormValues>(key: K, value: CompanyRegistrationFormValues[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const validateSection = (): boolean => {
    const result = CompanyRegistrationFormSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof CompanyRegistrationFormValues, string>> = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0] as keyof CompanyRegistrationFormValues;
        if (!fieldErrors[key]) {
          fieldErrors[key] = issue.message;
        }
      }
      setErrors(fieldErrors);
      return false;
    }
    setErrors({});
    return true;
  };

  const handleLogoUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    const issue = validateForUpload("companyLogo", file);
    if (issue) {
      toast.error(issue.message);
      return;
    }
    try {
      const preview = createFilePreview(file);
      setLogoPreview(preview.objectUrl);
      const dto = await upload.mutateAsync({ kind: "companyLogo", file });
      preview.revoke();
      setLogoUrl(dto.url);
      toast.success("Logo uploaded");
    } catch (err) {
      setLogoPreview(null);
      const msg = err instanceof Error ? err.message : "Upload failed.";
      toast.error("Could not upload logo", { description: msg });
    }
  };

  const handleDocUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    const issue = validateForUpload("companyDocument", file);
    if (issue) {
      toast.error(issue.message);
      return;
    }
    try {
      const preview = createFilePreview(file);
      setDocName(file.name);
      const dto = await upload.mutateAsync({ kind: "companyDocument", file });
      preview.revoke();
      setDocUrl(dto.url);
      toast.success("Document uploaded");
    } catch (err) {
      setDocName(null);
      const msg = err instanceof Error ? err.message : "Upload failed.";
      toast.error("Could not upload document", { description: msg });
    }
  };

  const goToReview = () => {
    if (!validateSection()) return;
    setSection("review");
  };

  const handleSubmit = async () => {
    try {
      const result = await register.mutateAsync({
        name: form.name,
        panVat: form.panVat || undefined,
        registrationNumber: form.registrationNumber || undefined,
        ownerPhone: form.ownerPhone,
        logoUrl: logoUrl ?? undefined,
        documentUrl: docUrl ?? undefined,
      });
      setSubmitted(result);
      toast.success("Company registered! Awaiting review.");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Registration failed.";
      toast.error("Could not register company", { description: msg });
    }
  };

  const sectionIndicator = (s: Section) => {
    const idx = ["info", "media", "review"];
    const current = idx.indexOf(section);
    const target = idx.indexOf(s);
    return (
      <button
        type="button"
        onClick={() => { if (target <= current || (target === 1 && validateSection())) setSection(s); }}
        style={{
          all: "unset",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: 8,
          fontFamily: "var(--font-text)",
          fontSize: 14,
          fontWeight: target <= current ? 600 : 400,
          color: target <= current ? "var(--brand-700)" : "var(--text-muted)",
          padding: "8px 0",
        }}
      >
        <span style={{
          width: 24,
          height: 24,
          borderRadius: "50%",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          background: target <= current ? "var(--brand-700)" : "var(--surface-2)",
          color: target <= current ? "#fff" : "var(--text-muted)",
          fontSize: 12,
          fontWeight: 700,
        }}>
          {target < current ? <Icon name="Check" size={14} /> : target + 1}
        </span>
        {s === "info" ? "Company Info" : s === "media" ? "Logo & Documents" : "Review & Submit"}
      </button>
    );
  };

  const logoUploading = upload.isPending && upload.variables?.kind === "companyLogo";
  const docUploading = upload.isPending && upload.variables?.kind === "companyDocument";

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "40px 24px" }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{
          fontFamily: "var(--font-display)",
          fontWeight: 700,
          fontSize: 28,
          color: "var(--text-strong)",
          margin: "0 0 6px",
        }}>
          Register Your Company
        </h1>
        <p style={{
          fontFamily: "var(--font-text)",
          fontSize: 15,
          color: "var(--text-subtle)",
          margin: 0,
        }}>
          Set up your recruiting profile to start posting gigs and finding talent.
        </p>
      </div>

      {/* Section stepper */}
      <div style={{ display: "flex", gap: 32, marginBottom: 32, borderBottom: "1px solid var(--border-default)", paddingBottom: 12 }}>
        {sectionIndicator("info")}
        {sectionIndicator("media")}
        {sectionIndicator("review")}
      </div>

      {/* Section: Company Info */}
      {section === "info" && (
        <Card padding={28}>
          <h3 style={{
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: 18,
            color: "var(--text-strong)",
            margin: "0 0 20px",
          }}>
            Company Information
          </h3>
          <div style={{ display: "grid", gap: 16 }}>
            <Input
              label="Company name *"
              placeholder="e.g. Aavasar Technologies"
              value={form.name}
              onChange={(e) => setField("name", e.target.value)}
              error={errors.name}
              maxLength={200}
              aria-required
            />
            <Input
              label="PAN / VAT number"
              placeholder="Optional — e.g. 123456789"
              value={form.panVat ?? ""}
              onChange={(e) => setField("panVat", e.target.value)}
              error={errors.panVat}
              maxLength={50}
            />
            <Input
              label="Registration number"
              placeholder="Optional — company registration / incorporation no."
              value={form.registrationNumber ?? ""}
              onChange={(e) => setField("registrationNumber", e.target.value)}
              error={errors.registrationNumber}
              maxLength={100}
            />
            <Input
              label="Owner / contact phone *"
              placeholder="e.g. 9812345678"
              value={form.ownerPhone}
              onChange={(e) => setField("ownerPhone", e.target.value)}
              error={errors.ownerPhone}
              maxLength={20}
              type="tel"
              aria-required
            />
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 24 }}>
            <Button type="button" variant="primary" onClick={goToReview}>
              Continue
            </Button>
          </div>
        </Card>
      )}

      {/* Section: Logo & Documents */}
      {section === "media" && (
        <Card padding={28}>
          <h3 style={{
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: 18,
            color: "var(--text-strong)",
            margin: "0 0 20px",
          }}>
            Logo & Legal Documents
          </h3>

          {/* Company logo */}
          <div style={{ marginBottom: 24 }}>
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 12,
            }}>
              <div>
                <div style={{
                  fontFamily: "var(--font-text)",
                  fontWeight: 600,
                  fontSize: 14,
                  color: "var(--text-strong)",
                }}>Company Logo</div>
                <div style={{
                  fontFamily: "var(--font-text)",
                  fontSize: 13,
                  color: "var(--text-subtle)",
                }}>{UPLOAD_LIMITS.companyLogo.label}</div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              {logoPreview ? (
                <img
                  src={logoPreview}
                  alt="Company logo preview"
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: "var(--radius-sm)",
                    objectFit: "cover",
                    border: "1px solid var(--border-default)",
                  }}
                />
              ) : (
                <div style={{
                  width: 64,
                  height: 64,
                  borderRadius: "var(--radius-sm)",
                  border: "1px dashed var(--border-strong)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--text-muted)",
                }}>
                  <Icon name="Building2" size={24} />
                </div>
              )}
              <input
                ref={logoInputRef}
                type="file"
                accept={UPLOAD_LIMITS.companyLogo.accept.join(",")}
                style={{ display: "none" }}
                onChange={handleLogoUpload}
                aria-label="Upload company logo"
              />
              <Button
                variant="outline"
                size="sm"
                type="button"
                disabled={logoUploading}
                iconLeft={<Icon name="Upload" size={14} />}
                onClick={() => logoInputRef.current?.click()}
              >
                {logoUploading ? "Uploading..." : logoUrl ? "Replace Logo" : "Upload Logo"}
              </Button>
            </div>
          </div>

          {/* Legal document */}
          <div>
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 12,
            }}>
              <div>
                <div style={{
                  fontFamily: "var(--font-text)",
                  fontWeight: 600,
                  fontSize: 14,
                  color: "var(--text-strong)",
                }}>Legal / Tax Document</div>
                <div style={{
                  fontFamily: "var(--font-text)",
                  fontSize: 13,
                  color: "var(--text-subtle)",
                }}>{UPLOAD_LIMITS.companyDocument.label}</div>
              </div>
            </div>
            {docName ? (
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 14px",
                border: "1px solid var(--border-default)",
                borderRadius: "var(--radius-sm)",
                marginBottom: 10,
              }}>
                <Icon name="FileText" size={18} style={{ color: "var(--brand-700)" }} />
                <span style={{
                  flex: 1,
                  fontFamily: "var(--font-text)",
                  fontSize: 14,
                  color: "var(--text-strong)",
                }}>{docName}</span>
                <Badge tone="success">Uploaded</Badge>
              </div>
            ) : null}
            <input
              ref={docInputRef}
              type="file"
              accept={UPLOAD_LIMITS.companyDocument.accept.join(",")}
              style={{ display: "none" }}
              onChange={handleDocUpload}
              aria-label="Upload legal document"
            />
            <Button
              variant="outline"
              size="sm"
              type="button"
              disabled={docUploading}
              iconLeft={<Icon name="Upload" size={14} />}
              onClick={() => docInputRef.current?.click()}
            >
              {docUploading ? "Uploading..." : docUrl ? "Replace Document" : "Upload Document"}
            </Button>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 28 }}>
            <Button variant="outline" type="button" onClick={() => setSection("info")}>
              Back
            </Button>
            <Button variant="primary" type="button" onClick={() => setSection("review")}>
              Review
            </Button>
          </div>
        </Card>
      )}

      {/* Section: Review & Submit */}
      {section === "review" && (
        <Card padding={28}>
          <h3 style={{
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: 18,
            color: "var(--text-strong)",
            margin: "0 0 20px",
          }}>
            Review & Submit
          </h3>
          <div style={{ display: "grid", gap: 12 }}>
            <ReviewRow label="Company Name" value={form.name} />
            <ReviewRow label="PAN / VAT" value={form.panVat || "—"} />
            <ReviewRow label="Registration No." value={form.registrationNumber || "—"} />
            <ReviewRow label="Contact Phone" value={form.ownerPhone} />
            <ReviewRow label="Company Logo" value={logoUrl ? "Uploaded" : "Not uploaded"} />
            <ReviewRow label="Legal Document" value={docUrl ? "Uploaded" : "Not uploaded"} />
          </div>
          <div style={{
            marginTop: 16,
            padding: "12px 16px",
            background: "var(--warning-100)",
            borderRadius: "var(--radius-sm)",
            fontFamily: "var(--font-text)",
            fontSize: 13,
            color: "var(--warning-500)",
          }}>
            <Icon name="Info" size={16} style={{ verticalAlign: "middle", marginRight: 8 }} />
            Your registration will be reviewed by our team before you can start posting gigs.
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 24 }}>
            <Button variant="outline" type="button" onClick={() => setSection("media")}>
              Back
            </Button>
            <Button
              variant="primary"
              type="button"
              disabled={register.isPending}
              iconLeft={register.isPending ? undefined : <Icon name="Send" size={16} />}
              onClick={handleSubmit}
            >
              {register.isPending ? "Submitting..." : "Submit for Review"}
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{
      display: "flex",
      justifyContent: "space-between",
      padding: "8px 0",
      borderBottom: "1px solid var(--border-subtle)",
      fontFamily: "var(--font-text)",
      fontSize: 14,
    }}>
      <span style={{ color: "var(--text-subtle)" }}>{label}</span>
      <span style={{ color: "var(--text-strong)", fontWeight: 500 }}>{value}</span>
    </div>
  );
}

function UnderReviewDashboard({ registration }: { registration: CompanyRegistrationResponse }) {
  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: "60px 24px", textAlign: "center" }}>
      <div style={{
        width: 72,
        height: 72,
        borderRadius: "50%",
        background: "var(--info-100)",
        color: "var(--info-700-text)",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 20,
      }}>
        <Icon name="Clock" size={36} />
      </div>
      <h1 style={{
        fontFamily: "var(--font-display)",
        fontWeight: 700,
        fontSize: 24,
        color: "var(--text-strong)",
        margin: "0 0 8px",
      }}>
        Registration Submitted
      </h1>
      <p style={{
        fontFamily: "var(--font-text)",
        fontSize: 15,
        color: "var(--text-subtle)",
        margin: "0 0 24px",
        lineHeight: 1.6,
      }}>
        <strong>{registration.name}</strong> is now under review. We&apos;ll notify you once your
        company is verified — typically within 1–2 business days.
      </p>
      <Card padding={24} style={{ textAlign: "left" }}>
        <div style={{ display: "grid", gap: 10 }}>
          <ReviewRow label="Company" value={registration.name} />
          <ReviewRow label="Status" value={registration.registrationStatus.replace("_", " ")} />
          <ReviewRow label="Contact Phone" value={registration.ownerPhone ?? "—"} />
        </div>
      </Card>
      <div style={{ marginTop: 24 }}>
        <Badge tone="reviewing" uppercase>
          {registration.registrationStatus.replace("_", " ")}
        </Badge>
      </div>
    </div>
  );
}
