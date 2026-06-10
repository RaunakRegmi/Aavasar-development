import React from "react";

/** Circular or squircle avatar; photo or auto initials on slate tint. */
export interface AvatarProps {
  src?: string | null;
  name?: string;
  /** px. @default 40 */
  size?: number;
  /** @default "circle" */
  shape?: "circle" | "squircle";
  style?: React.CSSProperties;
}
export function Avatar(props: AvatarProps): JSX.Element;
