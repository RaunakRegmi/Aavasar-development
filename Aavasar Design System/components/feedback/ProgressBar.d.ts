import React from "react";

/** Thin progress track (profile completion, course progress, applicant bars). */
export interface ProgressBarProps {
  value?: number;
  /** @default 100 */
  max?: number;
  color?: string;
  track?: string;
  /** @default 8 */
  height?: number;
  /** Use on dark slate cards (white fill on translucent track). */
  onDark?: boolean;
  style?: React.CSSProperties;
}
export function ProgressBar(props: ProgressBarProps): JSX.Element;
