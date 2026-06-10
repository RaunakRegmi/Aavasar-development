import React from "react";

/**
 * Compact square button for icon-only actions (notifications, settings,
 * help, share). Use inside top nav and toolbars.
 */
export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  /** Pixel size of the square. @default 36 */
  size?: number;
  /** @default "ghost" */
  variant?: "ghost" | "bordered";
  onDark?: boolean;
  ariaLabel?: string;
}

export function IconButton(props: IconButtonProps): JSX.Element;
