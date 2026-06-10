import React from "react";

export interface SegmentOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

/**
 * Two/three-way segmented toggle (e.g. Student / Recruiter, Earn / Hire).
 * Active segment is a white raised card.
 */
export interface SegmentedControlProps {
  options: (string | SegmentOption)[];
  value: string;
  onChange?: (value: string) => void;
  style?: React.CSSProperties;
}
export function SegmentedControl(props: SegmentedControlProps): JSX.Element;
