import React from "react";

/** Dashboard KPI tile: eyebrow label, big number, top-right icon, optional delta. */
export interface StatCardProps {
  label: string;
  value: React.ReactNode;
  icon?: React.ReactNode;
  /** @default "slate" */
  iconTone?: "slate" | "soft" | "success" | "info" | "earth" | "none";
  /** e.g. "+2 this week" */
  delta?: React.ReactNode;
  /** @default "success" */
  deltaTone?: "success" | "danger" | "neutral";
  style?: React.CSSProperties;
}
export function StatCard(props: StatCardProps): JSX.Element;
