import React from "react";

/** Labeled text input with helper/error text, optional password reveal. */
export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "style"> {
  label?: string;
  helper?: string;
  error?: string;
  /** Show an eye toggle to reveal a password field. @default false */
  passwordToggle?: boolean;
  /** Icon/element rendered inside the input's leading edge. */
  leading?: React.ReactNode;
  /** Element rendered at the input's trailing edge (e.g. a Browse button). */
  trailing?: React.ReactNode;
  style?: React.CSSProperties;
}
export function Input(props: InputProps): JSX.Element;
