/**
 * Recruiter → Post a Gig — a 3-step wizard mirroring the visual language
 * of CompanyRegistrationPage (stepper + Card sections + ReviewRow).
 *
 *   1. Identity & Basics — post as yourself or your approved company;
 *      title, category, description.
 *   2. Details & Pay — location, duration, pay kind + amount, tags.
 *   3. Review & Publish — summary, then "Save as draft" or "Publish".
 *
 * Publishing sets the gig to `active` so it appears on student Find Work
 * immediately; saving a draft keeps it private until published from My Gigs.
 */
import { useMemo, useState, type KeyboardEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, Chip, Input, SegmentedControl, useToast } from "@shared/ui";
import { Icon } from "@shared/icons";
import { useMe } from "@features/me";
import { useCreateGig, type GigLocation, type GigPayKind } from "@features/gigs";
import { rupees, formatNpr } from "@shared/lib/utils";
import { routes } from "@shared/config/routes";

type Section = "basics" | "details" | "review";
type PostAs = "individual" | "company";

interface FormState {
  postAs: PostAs;
  title: string;
  category: string;
  description: string;
  location: GigLocation;
  duration: string;
  payKind: GigPayKind;
  payAmount: string;
  tags: string[];
}

const SECTIONS: Section[] = ["basics", "details", "review"];
const SECTION_LABEL: Record<Section, string> = {
  basics: "Identity & Basics",
  details: "Details & Pay",
  review: "Review & Publish",
};

export default function PostGigPage() {
  const navigate = useNavigate();
  const toast = useToast();
  const me = useMe();
  const create = useCreateGig();

  const company = me.data?.company ?? null;
  const companyApproved = company?.registrationStatus === "approved";

  const [section, setSection] = useState<Section>("basics");
  const [form, setForm] = useState<FormState>({
    postAs: "individual",
    title: "",
    category: "",
    description: "",
    location: "remote",
    duration: "",
    payKind: "hourly",
    payAmount: "",
    tags: [],
  });
  const [tagDraft, setTagDraft] = useState("");
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const validateBasics = (): boolean => {
    const next: Partial<Record<keyof FormState, string>> = {};
    if (form.title.trim().length < 3) next.title = "Give the gig a clear title (3+ characters).";
    if (form.category.trim().length < 2) next.category = "Add a category.";
    if (form.description.trim().length < 20)
      next.description = "Describe the gig in at least 20 characters.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const validateDetails = (): boolean => {
    const next: Partial<Record<keyof FormState, string>> = {};
    if (form.duration.trim().length < 1) next.duration = "Add an expected duration.";
    const amount = Number(form.payAmount);
    if (!form.payAmount.trim() || Number.isNaN(amount) || amount <= 0)
      next.payAmount = "Enter a pay amount in NPR.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const goToDetails = () => {
    if (validateBasics()) setSection("details");
  };
  const goToReview = () => {
    if (validateDetails()) setSection("review");
  };

  const addTag = () => {
    const t = tagDraft.trim().toLowerCase();
    if (!t) return;
    if (form.tags.includes(t) || form.tags.length >= 12) {
      setTagDraft("");
      return;
    }
    setForm((prev) => ({ ...prev, tags: [...prev.tags, t] }));
    setTagDraft("");
  };
  const onTagKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag();
    }
  };
  const removeTag = (t: string) =>
    setForm((prev) => ({ ...prev, tags: prev.tags.filter((x) => x !== t) }));

  const payPreview = useMemo(() => {
    const amount = Number(form.payAmount);
    if (!form.payAmount.trim() || Number.isNaN(amount) || amount <= 0) return null;
    const money = rupees(amount);
    return form.payKind === "fixed" ? `${formatNpr(money)} fixed` : `${formatNpr(money)}/hr`;
  }, [form.payAmount, form.payKind]);

  const submit = async (publish: boolean) => {
    if (!validateBasics()) {
      setSection("basics");
      return;
    }
    if (!validateDetails()) {
      setSection("details");
      return;
    }
    try {
      await create.mutateAsync({
        title: form.title.trim(),
        category: form.category.trim(),
        description: form.description.trim(),
        companyId: form.postAs === "company" && company ? company.id : undefined,
        location: form.location,
        duration: form.duration.trim(),
        payKind: form.payKind,
        pay: rupees(Number(form.payAmount)),
        tags: form.tags,
        publish,
      });
      toast.success(publish ? "Gig published — it's now live." : "Draft saved.");
      navigate(routes.recruiterMyGigs);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Could not post the gig.";
      toast.error("Failed to post gig", { description: msg });
    }
  };

  const stepIndicator = (s: Section) => {
    const current = SECTIONS.indexOf(section);
    const target = SECTIONS.indexOf(s);
    const reached = target <= current;
    return (
      <button
        type="button"
        onClick={() => {
          if (target <= current) setSection(s);
        }}
        style={{
          all: "unset",
          cursor: target <= current ? "pointer" : "default",
          display: "flex",
          alignItems: "center",
          gap: 8,
          fontFamily: "var(--font-text)",
          fontSize: 14,
          fontWeight: reached ? 600 : 400,
          color: reached ? "var(--brand-700)" : "var(--text-muted)",
          padding: "8px 0",
        }}
      >
        <span
          style={{
            width: 24,
            height: 24,
            borderRadius: "50%",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            background: reached ? "var(--brand-700)" : "var(--surface-2)",
            color: reached ? "#fff" : "var(--text-muted)",
            fontSize: 12,
            fontWeight: 700,
          }}
        >
          {target < current ? <Icon name="Check" size={14} /> : target + 1}
        </span>
        {SECTION_LABEL[s]}
      </button>
    );
  };

  const textareaStyle = {
    width: "100%",
    minHeight: 140,
    resize: "vertical" as const,
    fontFamily: "var(--font-text)",
    fontSize: 15,
    color: "var(--text-strong)",
    background: "var(--surface-0)",
    border: `1px solid ${errors.description ? "var(--danger-500)" : "var(--border-default)"}`,
    borderRadius: "var(--radius-sm)",
    padding: "11px 14px",
    outline: "none",
    boxSizing: "border-box" as const,
  };

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "40px 24px" }}>
      <div style={{ marginBottom: 32 }}>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: 28,
            color: "var(--text-strong)",
            margin: "0 0 6px",
          }}
        >
          Post a Gig
        </h1>
        <p style={{ fontFamily: "var(--font-text)", fontSize: 15, color: "var(--text-subtle)", margin: 0 }}>
          Describe the work, set the pay, and publish it to thousands of students.
        </p>
      </div>

      {/* Stepper */}
      <div
        style={{
          display: "flex",
          gap: 32,
          marginBottom: 32,
          borderBottom: "1px solid var(--border-default)",
          paddingBottom: 12,
        }}
      >
        {SECTIONS.map((s) => (
          <span key={s}>{stepIndicator(s)}</span>
        ))}
      </div>

      {/* Step 1 — Identity & Basics */}
      {section === "basics" && (
        <Card padding={28}>
          <h3
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: 18,
              color: "var(--text-strong)",
              margin: "0 0 6px",
            }}
          >
            Who is posting?
          </h3>
          <p style={{ fontFamily: "var(--font-text)", fontSize: 13, color: "var(--text-subtle)", margin: "0 0 16px" }}>
            Post under your own name, or under your company once it's approved.
          </p>

          {companyApproved && company ? (
            <SegmentedControl<PostAs>
              value={form.postAs}
              onChange={(v) => setField("postAs", v)}
              options={[
                { value: "individual", label: `Myself (${me.data?.user.fullName ?? "Individual"})` },
                { value: "company", label: company.name },
              ]}
              style={{ marginBottom: 20 }}
            />
          ) : (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "12px 14px",
                background: "var(--surface-1)",
                border: "1px solid var(--border-default)",
                borderRadius: "var(--radius-sm)",
                marginBottom: 20,
              }}
            >
              <Icon name="User" size={16} style={{ color: "var(--brand-700)" }} />
              <span style={{ flex: 1, fontFamily: "var(--font-text)", fontSize: 13, color: "var(--text-muted)" }}>
                {company
                  ? "Posting as yourself. Your company is still under review."
                  : "Posting as yourself."}{" "}
                <button
                  type="button"
                  onClick={() => navigate(routes.recruiterCompanyRegistration)}
                  style={{
                    all: "unset",
                    cursor: "pointer",
                    color: "var(--brand-700)",
                    fontWeight: 600,
                  }}
                >
                  {company ? "View company" : "Register a company"}
                </button>{" "}
                to post under a company identity.
              </span>
            </div>
          )}

          <div style={{ display: "grid", gap: 16 }}>
            <Input
              label="Gig title *"
              placeholder="e.g. Build a landing page in React"
              value={form.title}
              onChange={(e) => setField("title", e.target.value)}
              error={errors.title}
              maxLength={160}
            />
            <Input
              label="Category *"
              placeholder="e.g. Web Development, Design, Tutoring"
              value={form.category}
              onChange={(e) => setField("category", e.target.value)}
              error={errors.category}
              maxLength={80}
            />
            <div>
              <label
                style={{
                  display: "block",
                  fontFamily: "var(--font-text)",
                  fontSize: 14,
                  fontWeight: 600,
                  color: "var(--text-strong)",
                  marginBottom: 6,
                }}
              >
                Description *
              </label>
              <textarea
                value={form.description}
                onChange={(e) => setField("description", e.target.value)}
                maxLength={5000}
                placeholder="What needs doing, the deliverables, and any requirements…"
                style={textareaStyle}
              />
              {errors.description && (
                <div style={{ fontFamily: "var(--font-text)", fontSize: 13, color: "var(--danger-500)", marginTop: 6 }}>
                  {errors.description}
                </div>
              )}
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 24 }}>
            <Button type="button" variant="primary" onClick={goToDetails}>
              Continue
            </Button>
          </div>
        </Card>
      )}

      {/* Step 2 — Details & Pay */}
      {section === "details" && (
        <Card padding={28}>
          <h3
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: 18,
              color: "var(--text-strong)",
              margin: "0 0 20px",
            }}
          >
            Details & Pay
          </h3>

          <div style={{ display: "grid", gap: 20 }}>
            <div>
              <label style={fieldLabel}>Location</label>
              <SegmentedControl<GigLocation>
                value={form.location}
                onChange={(v) => setField("location", v)}
                options={[
                  { value: "remote", label: "Remote" },
                  { value: "onsite", label: "On-site" },
                  { value: "hybrid", label: "Hybrid" },
                ]}
              />
            </div>

            <Input
              label="Duration *"
              placeholder="e.g. 2 weeks, 4 hours, Project-based"
              value={form.duration}
              onChange={(e) => setField("duration", e.target.value)}
              error={errors.duration}
              maxLength={80}
            />

            <div>
              <label style={fieldLabel}>Pay type</label>
              <SegmentedControl<GigPayKind>
                value={form.payKind}
                onChange={(v) => setField("payKind", v)}
                options={[
                  { value: "hourly", label: "Hourly rate" },
                  { value: "fixed", label: "Fixed price" },
                ]}
              />
            </div>

            <Input
              label={form.payKind === "hourly" ? "Hourly rate (NPR) *" : "Total budget (NPR) *"}
              placeholder="e.g. 1500"
              value={form.payAmount}
              onChange={(e) => setField("payAmount", e.target.value.replace(/[^0-9.]/g, ""))}
              error={errors.payAmount}
              inputMode="decimal"
              leading={<span style={{ fontFamily: "var(--font-text)", color: "var(--text-muted)" }}>रु</span>}
              helper={payPreview ? `Students will see ${payPreview}` : undefined}
            />

            <div>
              <label style={fieldLabel}>Skills & tags (optional)</label>
              <Input
                placeholder="Type a skill and press Enter (max 12)"
                value={tagDraft}
                onChange={(e) => setTagDraft(e.target.value)}
                onKeyDown={onTagKeyDown}
                trailing={
                  <button
                    type="button"
                    onClick={addTag}
                    style={{ all: "unset", cursor: "pointer", color: "var(--brand-700)", fontWeight: 600 }}
                  >
                    Add
                  </button>
                }
                maxLength={40}
              />
              {form.tags.length > 0 && (
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 12 }}>
                  {form.tags.map((t) => (
                    <Chip key={t} label={t} on onClick={() => removeTag(t)} />
                  ))}
                </div>
              )}
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 28 }}>
            <Button variant="outline" type="button" onClick={() => setSection("basics")}>
              Back
            </Button>
            <Button variant="primary" type="button" onClick={goToReview}>
              Review
            </Button>
          </div>
        </Card>
      )}

      {/* Step 3 — Review & Publish */}
      {section === "review" && (
        <Card padding={28}>
          <h3
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: 18,
              color: "var(--text-strong)",
              margin: "0 0 20px",
            }}
          >
            Review & Publish
          </h3>
          <div style={{ display: "grid", gap: 12 }}>
            <ReviewRow
              label="Posting as"
              value={form.postAs === "company" && company ? company.name : me.data?.user.fullName ?? "Myself"}
            />
            <ReviewRow label="Title" value={form.title} />
            <ReviewRow label="Category" value={form.category} />
            <ReviewRow
              label="Location"
              value={form.location === "remote" ? "Remote" : form.location === "onsite" ? "On-site" : "Hybrid"}
            />
            <ReviewRow label="Duration" value={form.duration} />
            <ReviewRow label="Pay" value={payPreview ?? "—"} />
            <ReviewRow label="Tags" value={form.tags.length ? form.tags.join(", ") : "—"} />
          </div>

          <div
            style={{
              marginTop: 16,
              padding: "12px 16px",
              background: "var(--info-100)",
              borderRadius: "var(--radius-sm)",
              fontFamily: "var(--font-text)",
              fontSize: 13,
              color: "var(--info-700-text)",
            }}
          >
            <Icon name="Info" size={16} style={{ verticalAlign: "middle", marginRight: 8 }} />
            Publish to make it live on Find Work now, or save a draft to publish later from My Gigs.
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 24 }}>
            <Button variant="outline" type="button" onClick={() => setSection("details")}>
              Back
            </Button>
            <div style={{ display: "flex", gap: 12 }}>
              <Button
                variant="secondary"
                type="button"
                disabled={create.isPending}
                onClick={() => submit(false)}
              >
                Save as draft
              </Button>
              <Button
                variant="primary"
                type="button"
                disabled={create.isPending}
                iconLeft={create.isPending ? undefined : <Icon name="Send" size={16} />}
                onClick={() => submit(true)}
              >
                {create.isPending ? "Posting…" : "Publish"}
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}

const fieldLabel = {
  display: "block",
  fontFamily: "var(--font-text)",
  fontSize: 14,
  fontWeight: 600,
  color: "var(--text-strong)",
  marginBottom: 8,
} as const;

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        gap: 16,
        padding: "8px 0",
        borderBottom: "1px solid var(--border-subtle)",
        fontFamily: "var(--font-text)",
        fontSize: 14,
      }}
    >
      <span style={{ color: "var(--text-subtle)", flexShrink: 0 }}>{label}</span>
      <span style={{ color: "var(--text-strong)", fontWeight: 500, textAlign: "right" }}>{value}</span>
    </div>
  );
}
