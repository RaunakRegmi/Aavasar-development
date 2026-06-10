import * as Lucide from "lucide-react";
import type { CSSProperties } from "react";

/**
 * Single icon entry-point. Components reference icons by string name
 * so we can swap the underlying icon set later without touching call
 * sites. Stroke and color inherit from CSS `currentColor`.
 */
export type IconName = keyof typeof Lucide;

export interface IconProps {
  name: IconName;
  size?: number;
  className?: string;
  style?: CSSProperties;
  strokeWidth?: number;
  ariaLabel?: string;
  fill?: string;
}

export function Icon({
  name,
  size = 20,
  strokeWidth = 1.75,
  className,
  style,
  ariaLabel,
  fill,
}: IconProps) {
  const Component = Lucide[name] as React.ComponentType<{
    size?: number;
    strokeWidth?: number;
    className?: string;
    style?: CSSProperties;
    fill?: string;
    "aria-label"?: string;
    "aria-hidden"?: boolean;
  }> | undefined;
  if (!Component) {
    // eslint-disable-next-line no-console
    console.warn(`[Icon] unknown icon: ${name}`);
    return null;
  }
  return (
    <Component
      size={size}
      strokeWidth={strokeWidth}
      className={className}
      style={style}
      fill={fill}
      aria-label={ariaLabel}
      aria-hidden={ariaLabel ? undefined : true}
    />
  );
}
