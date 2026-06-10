import React from "react";

/** Skill / meta chip (FIGMA, Remote, 2 Weeks). 4px radius, weight 600. */
export interface TagProps {
  children?: React.ReactNode;
  /** @default "neutral" */
  variant?: "neutral" | "outline" | "brand" | "onDark";
  style?: React.CSSProperties;
}
export function Tag(props: TagProps): JSX.Element;
