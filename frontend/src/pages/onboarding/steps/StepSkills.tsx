import { useState } from "react";
import { Button, Card, Chip, Input, useToast } from "@shared/ui";
import { Icon } from "@shared/icons";
import { useSubmitSkills } from "@features/onboarding";
import { ApiError } from "@shared/lib/transport";

interface StepSkillsProps {
  selected: string[];
  onToggle: (skill: string) => void;
  onNext: () => void;
  onBack: () => void;
}

const groups: ReadonlyArray<{ heading: string; skills: ReadonlyArray<string> }> = [
  { heading: "Design", skills: ["UI Design", "UX Research", "Graphic Design", "Prototyping"] },
  { heading: "Development", skills: ["React", "Tailwind CSS", "Node.js", "Python"] },
  { heading: "Writing & Data", skills: ["Content Writing", "Copywriting", "Data Analysis"] },
];

export function StepSkills({ selected, onToggle, onNext, onBack }: StepSkillsProps) {
  const submit = useSubmitSkills();
  const toast = useToast();
  const [showEmptyError, setShowEmptyError] = useState(false);

  const handleNext = async () => {
    if (selected.length === 0) {
      setShowEmptyError(true);
      toast.warning("Pick at least one skill", {
        description: "We use this to match you with relevant gigs.",
      });
      return;
    }
    setShowEmptyError(false);
    try {
      await submit.mutateAsync({ skills: selected });
      onNext();
    } catch (e) {
      if (e instanceof ApiError) {
        toast.error("Couldn't save your skills", { description: e.body.message });
      } else if (e instanceof Error) {
        toast.error("Save failed", { description: e.message });
      }
    }
  };
  return (
    <div style={{ maxWidth: 820, margin: "48px auto" }}>
      <h1
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 700,
          fontSize: "clamp(26px, 5vw, 38px)",
          color: "var(--text-strong)",
          margin: "0 0 8px",
          letterSpacing: "-0.02em",
        }}
      >
        What are you good at?
      </h1>
      <p
        style={{
          fontFamily: "var(--font-text)",
          fontSize: 17,
          lineHeight: 1.5,
          color: "var(--text-muted)",
          margin: "0 0 28px",
          maxWidth: 620,
        }}
      >
        Select the skills and interests that best describe your talent. This helps
        us match you with the right gigs.
      </p>
      <Card
        padding={32}
        style={{
          boxShadow: "var(--shadow-sm)",
          border: showEmptyError ? "1px solid var(--danger-500)" : undefined,
        }}
      >
        <Input
          label="Search for a skill"
          placeholder="e.g., Python, Video Editing, SEO…"
          leading={<Icon name="Search" />}
        />
        <div
          style={{
            marginTop: 24,
            display: "flex",
            flexDirection: "column",
            gap: 22,
          }}
        >
          {groups.map((g) => (
            <div key={g.heading}>
              <div
                style={{
                  fontFamily: "var(--font-text)",
                  fontSize: 12,
                  fontWeight: 600,
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                  color: "var(--text-subtle)",
                  marginBottom: 12,
                }}
              >
                {g.heading}
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                {g.skills.map((s) => (
                  <Chip
                    key={s}
                    label={s}
                    on={selected.includes(s)}
                    onClick={() => {
                      setShowEmptyError(false);
                      onToggle(s);
                    }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
        {showEmptyError && (
          <div
            style={{
              marginTop: 18,
              fontFamily: "var(--font-text)",
              fontSize: 13,
              color: "var(--danger-500)",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <Icon name="AlertCircle" size={14} />
            Select at least one skill to continue.
          </div>
        )}
      </Card>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: 24,
        }}
      >
        <Button variant="outline" onClick={onBack}>Back</Button>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span
            style={{
              fontFamily: "var(--font-text)",
              fontSize: 14,
              color: "var(--text-subtle)",
            }}
          >
            You can always update these later
          </span>
          <Button
            variant="primary"
            onClick={handleNext}
            disabled={selected.length === 0 || submit.isPending}
          >
            {submit.isPending ? "Saving…" : "Continue"}
          </Button>
        </div>
      </div>
    </div>
  );
}
