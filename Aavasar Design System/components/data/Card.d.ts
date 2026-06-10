import React from "react";

/**
 * Base container. White bordered card by default; `dark`/`earth` are
 * inverted feature cards; `well` is a recessed gray panel.
 *
 * @startingPoint section="Core" subtitle="Bordered content card with dark/earth feature variants" viewport="700x260"
 */
export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  /** @default "default" */
  tone?: "default" | "flat" | "well" | "dark" | "earth";
  /** @default "md" */
  radius?: "sm" | "md" | "lg" | "xl";
  /** Padding in px. @default 24 */
  padding?: number;
  /** Hover lift. @default false */
  interactive?: boolean;
}
export function Card(props: CardProps): JSX.Element;
