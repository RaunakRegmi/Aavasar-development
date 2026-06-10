import React from "react";

export type ButtonVariant = "primary" | "secondary" | "outline" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

/**
 * Primary action button for Aavasar. Solid slate by default; ghost
 * `secondary`, bordered `outline`, and `danger` variants. Set `onDark`
 * on slate panels to invert (white fill, dark text).
 *
 * @startingPoint section="Core" subtitle="Slate primary action button with variants" viewport="700x180"
 */
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  /** Visual style. @default "primary" */
  variant?: ButtonVariant;
  /** @default "md" */
  size?: ButtonSize;
  /** Invert for use on dark slate surfaces. @default false */
  onDark?: boolean;
  /** Stretch to container width. @default false */
  full?: boolean;
  disabled?: boolean;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
}

export function Button(props: ButtonProps): JSX.Element;
