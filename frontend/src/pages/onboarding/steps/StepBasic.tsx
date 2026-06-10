import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Card, Input, useToast } from "@shared/ui";
import { Icon } from "@shared/icons";
import { useSubmitBasic } from "@features/onboarding";
import type { OnboardingBasic } from "@features/onboarding";
import { OnboardingBasicSchema } from "@features/onboarding";
import { ApiError } from "@shared/lib/transport";

interface StepBasicProps {
  defaultValues?: Partial<OnboardingBasic>;
  onNext: () => void;
}

export function StepBasic({ defaultValues, onNext }: StepBasicProps) {
  const submit = useSubmitBasic();
  const toast = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<OnboardingBasic>({
    resolver: zodResolver(OnboardingBasicSchema),
    defaultValues: {
      university: defaultValues?.university ?? "",
      degreeAndMajor: defaultValues?.degreeAndMajor ?? "",
      expectedGraduationYear: defaultValues?.expectedGraduationYear ?? "2027",
      headline: defaultValues?.headline ?? "",
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      await submit.mutateAsync(values);
      onNext();
    } catch (e) {
      if (e instanceof ApiError) {
        toast.error("Couldn't save your details", { description: e.body.message });
      } else if (e instanceof Error) {
        toast.error("Save failed", { description: e.message });
      }
    }
  });

  return (
    <form onSubmit={onSubmit} style={{ maxWidth: 640, margin: "48px auto" }}>
      <Card padding={40} style={{ boxShadow: "var(--shadow-md)" }}>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: 36,
            color: "var(--text-strong)",
            margin: "0 0 8px",
            letterSpacing: "-0.02em",
          }}
        >
          Basic Information
        </h1>
        <p
          style={{
            fontFamily: "var(--font-text)",
            fontSize: 16,
            lineHeight: 1.5,
            color: "var(--text-muted)",
            margin: "0 0 28px",
          }}
        >
          Tell us about your academic background to help us match you with relevant
          micro-internships and gigs.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <Input
            label="University / Institution"
            placeholder="e.g. Tribhuvan University"
            leading={<Icon name="GraduationCap" />}
            error={errors.university?.message}
            {...register("university")}
          />
          <Input
            label="Degree & Major"
            placeholder="e.g. B.S. Computer Science"
            leading={<Icon name="BookOpen" />}
            error={errors.degreeAndMajor?.message}
            {...register("degreeAndMajor")}
          />
          <Input
            label="Expected Graduation Year"
            placeholder="Select Year"
            leading={<Icon name="Calendar" />}
            trailing={<Icon name="ChevronDown" size={18} />}
            error={errors.expectedGraduationYear?.message}
            {...register("expectedGraduationYear")}
          />
          <Input
            label="Professional Headline"
            placeholder="e.g. CS Student · React + Python"
            helper="One line that appears above your bio on your profile."
            leading={<Icon name="Sparkles" />}
            error={errors.headline?.message}
            {...register("headline")}
          />
        </div>
        <Button
          type="submit"
          variant="primary"
          size="lg"
          full
          disabled={isSubmitting}
          style={{ marginTop: 28 }}
          iconRight={<Icon name="ArrowRight" size={18} />}
        >
          {isSubmitting ? "Saving…" : "Continue"}
        </Button>
        <div
          style={{
            display: "flex",
            gap: 12,
            alignItems: "flex-start",
            background: "var(--surface-1)",
            borderRadius: "var(--radius-sm)",
            padding: "14px 16px",
            marginTop: 24,
          }}
        >
          <Icon
            name="Info"
            size={18}
            style={{
              color: "var(--info-500)",
              flexShrink: 0,
              marginTop: 1,
            }}
          />
          <span
            style={{
              fontFamily: "var(--font-text)",
              fontSize: 13,
              lineHeight: 1.5,
              color: "var(--text-muted)",
            }}
          >
            Your academic details help us verify your student status and unlock
            exclusive internships. You can update this later in your profile
            settings.
          </span>
        </div>
      </Card>
    </form>
  );
}
