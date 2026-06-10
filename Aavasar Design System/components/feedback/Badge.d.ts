import React from "react";

export type BadgeTone =
  | "active" | "success" | "submitted" | "reviewing" | "info"
  | "draft" | "neutral" | "danger" | "rejected" | "warning" | "premium";

/** Pill status badge for gig/application status and PREMIUM markers. */
export interface BadgeProps {
  children?: React.ReactNode;
  /** @default "neutral" */
  tone?: BadgeTone;
  /** @default true */
  uppercase?: boolean;
  style?: React.CSSProperties;
}
export function Badge(props: BadgeProps): JSX.Element;
