/* @ds-bundle: {"format":3,"namespace":"AavasarDesignSystem_e30e7a","components":[{"name":"Button","sourcePath":"components/buttons/Button.jsx"},{"name":"IconButton","sourcePath":"components/buttons/IconButton.jsx"},{"name":"Avatar","sourcePath":"components/data/Avatar.jsx"},{"name":"Card","sourcePath":"components/data/Card.jsx"},{"name":"StatCard","sourcePath":"components/data/StatCard.jsx"},{"name":"Badge","sourcePath":"components/feedback/Badge.jsx"},{"name":"ProgressBar","sourcePath":"components/feedback/ProgressBar.jsx"},{"name":"Tag","sourcePath":"components/feedback/Tag.jsx"},{"name":"Checkbox","sourcePath":"components/forms/Checkbox.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"},{"name":"SegmentedControl","sourcePath":"components/forms/SegmentedControl.jsx"}],"sourceHashes":{"components/buttons/Button.jsx":"cccb2901ca24","components/buttons/IconButton.jsx":"90624c50a50b","components/data/Avatar.jsx":"6443f8b2a1f9","components/data/Card.jsx":"d56742a68638","components/data/StatCard.jsx":"2470cd9d7fda","components/feedback/Badge.jsx":"8b03966d382b","components/feedback/ProgressBar.jsx":"01b12212b4bf","components/feedback/Tag.jsx":"912359effc37","components/forms/Checkbox.jsx":"fbcf1465e311","components/forms/Input.jsx":"4830582a93d7","components/forms/SegmentedControl.jsx":"cb35e29b0a4e","ds-runtime.js":"352feac2f024","ui_kits/app/RecruiterDashboard.jsx":"b63882172013","ui_kits/app/StudentDashboard.jsx":"ec2725ca9937","ui_kits/onboarding/OnboardingFlow.jsx":"bc128f4df505","ui_kits/website/LandingMain.jsx":"a0f213cd8b57","ui_kits/website/SignUpScreen.jsx":"6aeda9937a48","ui_kits/website/SiteFooter.jsx":"62d18006e051","ui_kits/website/SiteNav.jsx":"d3d95ea2282b"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.AavasarDesignSystem_e30e7a = window.AavasarDesignSystem_e30e7a || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/buttons/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Aavasar Button — solid slate primary, ghost secondary, outline,
 * plus on-dark inversion. 4px radius, soft shadow, quick color states.
 */
function Button({
  children,
  variant = "primary",
  size = "md",
  onDark = false,
  full = false,
  disabled = false,
  iconLeft = null,
  iconRight = null,
  style = {},
  ...rest
}) {
  const sizes = {
    sm: {
      padding: "6px 14px",
      fontSize: 14,
      height: 36
    },
    md: {
      padding: "8px 20px",
      fontSize: 16,
      height: 40
    },
    lg: {
      padding: "12px 24px",
      fontSize: 16,
      height: 48
    }
  };
  const s = sizes[size] || sizes.md;
  const base = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    fontFamily: "var(--font-text)",
    fontWeight: 600,
    fontSize: s.fontSize,
    lineHeight: 1.5,
    padding: s.padding,
    minHeight: s.height,
    width: full ? "100%" : "auto",
    borderRadius: "var(--radius-xs)",
    border: "1px solid transparent",
    cursor: disabled ? "not-allowed" : "pointer",
    transition: "background var(--dur-fast) var(--ease-standard), border-color var(--dur-fast), color var(--dur-fast)",
    boxSizing: "border-box",
    whiteSpace: "nowrap",
    ...style
  };
  const variants = {
    primary: {
      background: "var(--primary)",
      color: "#fff",
      boxShadow: "var(--shadow-xs)"
    },
    secondary: {
      background: "transparent",
      color: "var(--brand-700)"
    },
    outline: {
      background: "var(--surface-0)",
      color: "var(--brand-700)",
      borderColor: "var(--border-default)",
      boxShadow: "var(--shadow-xs)"
    },
    danger: {
      background: "var(--danger-500)",
      color: "#fff",
      boxShadow: "var(--shadow-xs)"
    }
  };
  const onDarkVariants = {
    primary: {
      background: "#fff",
      color: "var(--brand-700)"
    },
    secondary: {
      background: "rgba(255,255,255,0.12)",
      color: "#fff"
    },
    outline: {
      background: "transparent",
      color: "#fff",
      borderColor: "rgba(255,255,255,0.4)"
    },
    danger: {
      background: "var(--danger-500)",
      color: "#fff"
    }
  };
  let look = (onDark ? onDarkVariants : variants)[variant] || variants.primary;
  if (disabled) {
    look = onDark ? {
      background: "rgba(255,255,255,0.15)",
      color: "rgba(255,255,255,0.5)"
    } : {
      background: "var(--ink-300)",
      color: "#fff"
    };
  }
  const hoverBg = {
    primary: "var(--primary-hover)",
    secondary: "var(--brand-50)",
    outline: "var(--surface-1)",
    danger: "var(--danger-600)"
  };
  const handleEnter = e => {
    if (disabled || onDark) return;
    if (variant === "secondary" || variant === "outline") e.currentTarget.style.background = hoverBg[variant];else e.currentTarget.style.background = hoverBg[variant];
  };
  const handleLeave = e => {
    if (disabled) return;
    e.currentTarget.style.background = look.background;
  };
  return /*#__PURE__*/React.createElement("button", _extends({
    style: {
      ...base,
      ...look
    },
    disabled: disabled,
    onMouseEnter: handleEnter,
    onMouseLeave: handleLeave
  }, rest), iconLeft, children, iconRight);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/buttons/Button.jsx", error: String((e && e.message) || e) }); }

// components/buttons/IconButton.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * IconButton — square, subtle, for nav/toolbar actions (bell, settings,
 * help, share). ~12px radius squircle; hover fills with a faint tint.
 */
function IconButton({
  children,
  size = 36,
  variant = "ghost",
  onDark = false,
  ariaLabel = "",
  style = {},
  ...rest
}) {
  const looks = {
    ghost: {
      background: "transparent",
      color: "var(--ink-700)",
      border: "1px solid transparent"
    },
    bordered: {
      background: "var(--surface-0)",
      color: "var(--ink-700)",
      border: "1px solid var(--border-default)"
    }
  };
  const look = onDark ? {
    background: "rgba(255,255,255,0.1)",
    color: "#fff",
    border: "1px solid transparent"
  } : looks[variant] || looks.ghost;
  return /*#__PURE__*/React.createElement("button", _extends({
    "aria-label": ariaLabel,
    style: {
      width: size,
      height: size,
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: "var(--radius-md)",
      cursor: "pointer",
      transition: "background var(--dur-fast) var(--ease-standard)",
      ...look,
      ...style
    },
    onMouseEnter: e => {
      e.currentTarget.style.background = onDark ? "rgba(255,255,255,0.2)" : "var(--surface-2)";
    },
    onMouseLeave: e => {
      e.currentTarget.style.background = look.background;
    }
  }, rest), children);
}
Object.assign(__ds_scope, { IconButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/buttons/IconButton.jsx", error: String((e && e.message) || e) }); }

// components/data/Avatar.jsx
try { (() => {
/**
 * Avatar — circle or squircle. Renders a photo (src) or initials on a
 * slate tint. Sizes via `size` px.
 */
function Avatar({
  src = null,
  name = "",
  size = 40,
  shape = "circle",
  style = {}
}) {
  const initials = name.split(" ").filter(Boolean).slice(0, 2).map(p => p[0]?.toUpperCase()).join("");
  const radius = shape === "circle" ? "9999px" : "var(--radius-md)";
  return /*#__PURE__*/React.createElement("span", {
    style: {
      width: size,
      height: size,
      borderRadius: radius,
      background: "var(--brand-50)",
      color: "var(--brand-700)",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "var(--font-text)",
      fontWeight: 600,
      fontSize: Math.round(size * 0.4),
      overflow: "hidden",
      flexShrink: 0,
      border: "1px solid var(--border-subtle)",
      ...style
    }
  }, src ? /*#__PURE__*/React.createElement("img", {
    src: src,
    alt: name,
    style: {
      width: "100%",
      height: "100%",
      objectFit: "cover"
    }
  }) : initials || "?");
}
Object.assign(__ds_scope, { Avatar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/Avatar.jsx", error: String((e && e.message) || e) }); }

// components/data/Card.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Card — the base container. White fill, 1px border, soft shadow, 12px
 * radius by default. `tone="dark"` flips to a slate feature card (white
 * text, no border). `interactive` adds a hover lift.
 */
function Card({
  children,
  tone = "default",
  radius = "md",
  padding = 24,
  interactive = false,
  style = {},
  ...rest
}) {
  const radii = {
    sm: "var(--radius-sm)",
    md: "var(--radius-md)",
    lg: "var(--radius-lg)",
    xl: "var(--radius-xl)"
  };
  const tones = {
    default: {
      background: "var(--surface-0)",
      border: "1px solid var(--border-default)",
      color: "var(--text-body)",
      boxShadow: "var(--shadow-sm)"
    },
    flat: {
      background: "var(--surface-0)",
      border: "1px solid var(--border-default)",
      color: "var(--text-body)",
      boxShadow: "none"
    },
    well: {
      background: "var(--surface-2)",
      border: "1px solid var(--border-subtle)",
      color: "var(--text-body)",
      boxShadow: "none"
    },
    dark: {
      background: "var(--brand-700)",
      border: "1px solid transparent",
      color: "#fff",
      boxShadow: "var(--shadow-md)"
    },
    earth: {
      background: "var(--accent-earth)",
      border: "1px solid transparent",
      color: "#fff",
      boxShadow: "var(--shadow-md)"
    }
  };
  const t = tones[tone] || tones.default;
  const base = {
    borderRadius: radii[radius] || radii.md,
    padding,
    boxSizing: "border-box",
    transition: "box-shadow var(--dur-base) var(--ease-standard), transform var(--dur-base) var(--ease-standard)",
    ...t,
    ...style
  };
  return /*#__PURE__*/React.createElement("div", _extends({
    style: base,
    onMouseEnter: interactive ? e => {
      e.currentTarget.style.boxShadow = "var(--shadow-lg)";
      e.currentTarget.style.transform = "translateY(-2px)";
    } : undefined,
    onMouseLeave: interactive ? e => {
      e.currentTarget.style.boxShadow = t.boxShadow;
      e.currentTarget.style.transform = "none";
    } : undefined
  }, rest), children);
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/Card.jsx", error: String((e && e.message) || e) }); }

// components/data/StatCard.jsx
try { (() => {
/**
 * StatCard — the KPI tile used across dashboards. Eyebrow label, big
 * display number, and a top-right icon (optionally in a tinted square).
 * Optional delta line (e.g. "+2 this week").
 */
function StatCard({
  label,
  value,
  icon = null,
  iconTone = "slate",
  delta = null,
  deltaTone = "success",
  style = {}
}) {
  const iconTones = {
    slate: {
      bg: "var(--brand-700)",
      fg: "#fff"
    },
    soft: {
      bg: "var(--brand-50)",
      fg: "var(--brand-700)"
    },
    success: {
      bg: "var(--success-100)",
      fg: "var(--success-600)"
    },
    info: {
      bg: "var(--info-100)",
      fg: "var(--info-600)"
    },
    earth: {
      bg: "var(--accent-earth-100)",
      fg: "var(--accent-earth)"
    },
    none: null
  };
  const it = iconTones[iconTone];
  const deltaColor = deltaTone === "success" ? "var(--success-600)" : deltaTone === "danger" ? "var(--danger-500)" : "var(--text-subtle)";
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--surface-0)",
      border: "1px solid var(--border-default)",
      borderRadius: "var(--radius-md)",
      padding: 20,
      display: "flex",
      flexDirection: "column",
      gap: 14,
      boxShadow: "var(--shadow-xs)",
      boxSizing: "border-box",
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "flex-start",
      justifyContent: "space-between",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-text)",
      fontSize: 12,
      fontWeight: 600,
      letterSpacing: "0.04em",
      textTransform: "uppercase",
      color: "var(--text-subtle)"
    }
  }, label), icon && (it ? /*#__PURE__*/React.createElement("span", {
    style: {
      width: 36,
      height: 36,
      borderRadius: "var(--radius-sm)",
      background: it.bg,
      color: it.fg,
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0
    }
  }, icon) : /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--ink-500)",
      display: "inline-flex",
      flexShrink: 0
    }
  }, icon))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "baseline",
      justifyContent: "space-between",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-display)",
      fontWeight: 700,
      fontSize: 32,
      lineHeight: 1.1,
      color: "var(--text-strong)",
      fontVariantNumeric: "tabular-nums"
    }
  }, value), delta && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-text)",
      fontSize: 13,
      fontWeight: 600,
      color: deltaColor,
      whiteSpace: "nowrap"
    }
  }, delta)));
}
Object.assign(__ds_scope, { StatCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/StatCard.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Badge.jsx
try { (() => {
const TONES = {
  active: {
    bg: "var(--success-100)",
    fg: "var(--success-700-text)"
  },
  success: {
    bg: "var(--success-100)",
    fg: "var(--success-700-text)"
  },
  submitted: {
    bg: "var(--info-100)",
    fg: "var(--info-700-text)"
  },
  reviewing: {
    bg: "var(--info-100)",
    fg: "var(--info-700-text)"
  },
  info: {
    bg: "var(--info-100)",
    fg: "var(--info-700-text)"
  },
  draft: {
    bg: "var(--surface-2)",
    fg: "var(--ink-600)"
  },
  neutral: {
    bg: "var(--surface-2)",
    fg: "var(--ink-600)"
  },
  danger: {
    bg: "var(--danger-100)",
    fg: "var(--danger-700-text)"
  },
  rejected: {
    bg: "var(--danger-100)",
    fg: "var(--danger-700-text)"
  },
  warning: {
    bg: "var(--warning-100)",
    fg: "var(--warning-500)"
  },
  premium: {
    bg: "var(--brand-700)",
    fg: "#fff"
  }
};

/**
 * Status badge — pill, small uppercase label. Used for gig/application
 * status (Active, Submitted, Reviewing, Draft, Rejected) and PREMIUM tags.
 */
function Badge({
  children,
  tone = "neutral",
  uppercase = true,
  style = {}
}) {
  const t = TONES[tone] || TONES.neutral;
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      fontFamily: "var(--font-text)",
      fontSize: 12,
      fontWeight: 600,
      letterSpacing: uppercase ? "0.04em" : 0,
      textTransform: uppercase ? "uppercase" : "none",
      padding: "4px 10px",
      borderRadius: "var(--radius-full)",
      background: t.bg,
      color: t.fg,
      whiteSpace: "nowrap",
      ...style
    }
  }, children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Badge.jsx", error: String((e && e.message) || e) }); }

// components/feedback/ProgressBar.jsx
try { (() => {
/**
 * ProgressBar — thin rounded track with a slate (or custom) fill. Used for
 * profile completion, course progress, and applicant-volume bars.
 */
function ProgressBar({
  value = 0,
  max = 100,
  color = "var(--brand-700)",
  track = "var(--surface-2)",
  height = 8,
  onDark = false,
  style = {}
}) {
  const pct = Math.max(0, Math.min(100, value / max * 100));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: "100%",
      height,
      background: onDark ? "rgba(255,255,255,0.2)" : track,
      borderRadius: "var(--radius-full)",
      overflow: "hidden",
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: `${pct}%`,
      height: "100%",
      background: onDark ? "#fff" : color,
      borderRadius: "var(--radius-full)",
      transition: "width var(--dur-slow) var(--ease-out)"
    }
  }));
}
Object.assign(__ds_scope, { ProgressBar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/ProgressBar.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Tag.jsx
try { (() => {
/**
 * Tag / skill chip — square-ish, neutral or slate-tinted. Used for skills
 * (FIGMA, PYTHON, REACT) and gig meta (Remote, 2 Weeks, On-site).
 */
function Tag({
  children,
  variant = "neutral",
  style = {}
}) {
  const looks = {
    neutral: {
      bg: "var(--surface-2)",
      fg: "var(--ink-700)",
      border: "transparent"
    },
    outline: {
      bg: "transparent",
      fg: "var(--ink-700)",
      border: "var(--border-default)"
    },
    brand: {
      bg: "var(--brand-50)",
      fg: "var(--brand-700)",
      border: "transparent"
    },
    onDark: {
      bg: "rgba(255,255,255,0.14)",
      fg: "#fff",
      border: "transparent"
    }
  };
  const l = looks[variant] || looks.neutral;
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      fontFamily: "var(--font-text)",
      fontSize: 12,
      fontWeight: 600,
      letterSpacing: "0.02em",
      padding: "5px 10px",
      borderRadius: "var(--radius-xs)",
      background: l.bg,
      color: l.fg,
      border: `1px solid ${l.border}`,
      whiteSpace: "nowrap",
      ...style
    }
  }, children);
}
Object.assign(__ds_scope, { Tag });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Tag.jsx", error: String((e && e.message) || e) }); }

// components/forms/Checkbox.jsx
try { (() => {
/**
 * Checkbox — square 4px-radius box, slate fill when checked. Pairs with
 * inline label text (e.g. "I agree to the Terms of Service").
 */
function Checkbox({
  checked = false,
  onChange,
  label,
  id,
  style = {}
}) {
  const cbId = id || (typeof label === "string" ? label.toLowerCase().replace(/\s+/g, "-").slice(0, 24) : undefined);
  return /*#__PURE__*/React.createElement("label", {
    htmlFor: cbId,
    style: {
      display: "inline-flex",
      alignItems: "flex-start",
      gap: 10,
      cursor: "pointer",
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      flexShrink: 0,
      width: 20,
      height: 20,
      marginTop: 1,
      borderRadius: "var(--radius-xs)",
      border: `1.5px solid ${checked ? "var(--brand-700)" : "var(--border-strong)"}`,
      background: checked ? "var(--brand-700)" : "var(--surface-0)",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      transition: "background var(--dur-fast), border-color var(--dur-fast)"
    }
  }, checked && /*#__PURE__*/React.createElement("svg", {
    width: "12",
    height: "12",
    viewBox: "0 0 12 12",
    fill: "none"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M2.5 6.2L4.8 8.5L9.5 3.5",
    stroke: "#fff",
    strokeWidth: "1.8",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }))), /*#__PURE__*/React.createElement("input", {
    id: cbId,
    type: "checkbox",
    checked: checked,
    onChange: onChange,
    style: {
      position: "absolute",
      opacity: 0,
      width: 0,
      height: 0
    }
  }), label && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-text)",
      fontSize: 14,
      lineHeight: 1.5,
      color: "var(--text-body)"
    }
  }, label));
}
Object.assign(__ds_scope, { Checkbox });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Checkbox.jsx", error: String((e && e.message) || e) }); }

// components/forms/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const {
  useState
} = React;
/**
 * Text input with label + helper. White fill, 1px border, 4–8px radius,
 * slate focus ring. Supports password reveal and trailing element.
 */
function Input({
  label,
  helper,
  error,
  type = "text",
  placeholder = "",
  value,
  defaultValue,
  onChange,
  leading = null,
  trailing = null,
  passwordToggle = false,
  id,
  style = {},
  ...rest
}) {
  const [show, setShow] = useState(false);
  const [focus, setFocus] = useState(false);
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);
  const effectiveType = passwordToggle ? show ? "text" : "password" : type;
  const borderColor = error ? "var(--danger-500)" : focus ? "var(--border-focus)" : "var(--border-default)";
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 6,
      width: "100%",
      ...style
    }
  }, label && /*#__PURE__*/React.createElement("label", {
    htmlFor: inputId,
    style: {
      fontFamily: "var(--font-text)",
      fontSize: 14,
      fontWeight: 600,
      color: "var(--text-strong)"
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      alignItems: "center"
    }
  }, leading && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: 12,
      display: "flex",
      alignItems: "center",
      color: "var(--ink-500)",
      pointerEvents: "none"
    }
  }, leading), /*#__PURE__*/React.createElement("input", _extends({
    id: inputId,
    type: effectiveType,
    placeholder: placeholder,
    value: value,
    defaultValue: defaultValue,
    onChange: onChange,
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    style: {
      width: "100%",
      fontFamily: "var(--font-text)",
      fontSize: 16,
      color: "var(--text-strong)",
      background: "var(--surface-0)",
      border: `1px solid ${borderColor}`,
      borderRadius: "var(--radius-sm)",
      padding: "11px 14px",
      paddingLeft: leading ? 42 : 14,
      paddingRight: passwordToggle || trailing ? 44 : 14,
      outline: "none",
      boxShadow: focus ? "var(--shadow-focus)" : "none",
      transition: "border-color var(--dur-fast), box-shadow var(--dur-fast)",
      boxSizing: "border-box"
    }
  }, rest)), passwordToggle && /*#__PURE__*/React.createElement("button", {
    type: "button",
    "aria-label": show ? "Hide password" : "Show password",
    onClick: () => setShow(v => !v),
    style: {
      position: "absolute",
      right: 8,
      background: "none",
      border: "none",
      cursor: "pointer",
      color: "var(--ink-500)",
      display: "flex",
      padding: 6
    }
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": show ? "eye-off" : "eye",
    style: {
      width: 18,
      height: 18
    }
  })), !passwordToggle && trailing && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      right: 10,
      display: "flex",
      alignItems: "center"
    }
  }, trailing)), (helper || error) && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-text)",
      fontSize: 13,
      color: error ? "var(--danger-500)" : "var(--text-subtle)"
    }
  }, error || helper));
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); }

// components/forms/SegmentedControl.jsx
try { (() => {
/**
 * SegmentedControl — the Student / Recruiter style toggle. Active segment
 * is a white card with a soft shadow; inactive segments are flat on a
 * surface-1 track.
 */
function SegmentedControl({
  options = [],
  value,
  onChange,
  style = {}
}) {
  return /*#__PURE__*/React.createElement("div", {
    role: "tablist",
    style: {
      display: "grid",
      gridTemplateColumns: `repeat(${options.length}, 1fr)`,
      gap: 4,
      padding: 4,
      background: "var(--surface-1)",
      border: "1px solid var(--border-default)",
      borderRadius: "var(--radius-sm)",
      ...style
    }
  }, options.map(opt => {
    const val = typeof opt === "string" ? opt : opt.value;
    const label = typeof opt === "string" ? opt : opt.label;
    const icon = typeof opt === "string" ? null : opt.icon;
    const active = val === value;
    return /*#__PURE__*/React.createElement("button", {
      key: val,
      role: "tab",
      "aria-selected": active,
      onClick: () => onChange && onChange(val),
      style: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        fontFamily: "var(--font-text)",
        fontSize: 15,
        fontWeight: 600,
        padding: "10px 12px",
        borderRadius: "var(--radius-xs)",
        border: "none",
        cursor: "pointer",
        color: active ? "var(--brand-700)" : "var(--text-muted)",
        background: active ? "var(--surface-0)" : "transparent",
        boxShadow: active ? "var(--shadow-sm)" : "none",
        transition: "background var(--dur-base) var(--ease-standard), color var(--dur-fast)"
      }
    }, icon, label);
  }));
}
Object.assign(__ds_scope, { SegmentedControl });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/SegmentedControl.jsx", error: String((e && e.message) || e) }); }

// ds-runtime.js
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
// ds-runtime.js — PREVIEW SHIM (auto-derived from components/**/*.jsx).
// Contains JSX; load via <script type="text/babel" src="<rel>/ds-runtime.js"></script>
// after React + Babel. The official compiled library is _ds_bundle.js (used in the
// Design System tab / consuming projects); this shim renders the same components on the
// plain serve/preview route, where the virtual _ds_bundle.js is not served.
// Regenerate after editing any component .jsx.
const {
  useState,
  useEffect,
  useRef,
  useCallback
} = React;

// ---- components/buttons/Button.jsx ----
/**
 * Aavasar Button — solid slate primary, ghost secondary, outline,
 * plus on-dark inversion. 4px radius, soft shadow, quick color states.
 */
function Button({
  children,
  variant = "primary",
  size = "md",
  onDark = false,
  full = false,
  disabled = false,
  iconLeft = null,
  iconRight = null,
  style = {},
  ...rest
}) {
  const sizes = {
    sm: {
      padding: "6px 14px",
      fontSize: 14,
      height: 36
    },
    md: {
      padding: "8px 20px",
      fontSize: 16,
      height: 40
    },
    lg: {
      padding: "12px 24px",
      fontSize: 16,
      height: 48
    }
  };
  const s = sizes[size] || sizes.md;
  const base = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    fontFamily: "var(--font-text)",
    fontWeight: 600,
    fontSize: s.fontSize,
    lineHeight: 1.5,
    padding: s.padding,
    minHeight: s.height,
    width: full ? "100%" : "auto",
    borderRadius: "var(--radius-xs)",
    border: "1px solid transparent",
    cursor: disabled ? "not-allowed" : "pointer",
    transition: "background var(--dur-fast) var(--ease-standard), border-color var(--dur-fast), color var(--dur-fast)",
    boxSizing: "border-box",
    whiteSpace: "nowrap",
    ...style
  };
  const variants = {
    primary: {
      background: "var(--primary)",
      color: "#fff",
      boxShadow: "var(--shadow-xs)"
    },
    secondary: {
      background: "transparent",
      color: "var(--brand-700)"
    },
    outline: {
      background: "var(--surface-0)",
      color: "var(--brand-700)",
      borderColor: "var(--border-default)",
      boxShadow: "var(--shadow-xs)"
    },
    danger: {
      background: "var(--danger-500)",
      color: "#fff",
      boxShadow: "var(--shadow-xs)"
    }
  };
  const onDarkVariants = {
    primary: {
      background: "#fff",
      color: "var(--brand-700)"
    },
    secondary: {
      background: "rgba(255,255,255,0.12)",
      color: "#fff"
    },
    outline: {
      background: "transparent",
      color: "#fff",
      borderColor: "rgba(255,255,255,0.4)"
    },
    danger: {
      background: "var(--danger-500)",
      color: "#fff"
    }
  };
  let look = (onDark ? onDarkVariants : variants)[variant] || variants.primary;
  if (disabled) {
    look = onDark ? {
      background: "rgba(255,255,255,0.15)",
      color: "rgba(255,255,255,0.5)"
    } : {
      background: "var(--ink-300)",
      color: "#fff"
    };
  }
  const hoverBg = {
    primary: "var(--primary-hover)",
    secondary: "var(--brand-50)",
    outline: "var(--surface-1)",
    danger: "var(--danger-600)"
  };
  const handleEnter = e => {
    if (disabled || onDark) return;
    if (variant === "secondary" || variant === "outline") e.currentTarget.style.background = hoverBg[variant];else e.currentTarget.style.background = hoverBg[variant];
  };
  const handleLeave = e => {
    if (disabled) return;
    e.currentTarget.style.background = look.background;
  };
  return /*#__PURE__*/React.createElement("button", _extends({
    style: {
      ...base,
      ...look
    },
    disabled: disabled,
    onMouseEnter: handleEnter,
    onMouseLeave: handleLeave
  }, rest), iconLeft, children, iconRight);
}

// ---- components/buttons/IconButton.jsx ----
/**
 * IconButton — square, subtle, for nav/toolbar actions (bell, settings,
 * help, share). ~12px radius squircle; hover fills with a faint tint.
 */
function IconButton({
  children,
  size = 36,
  variant = "ghost",
  onDark = false,
  ariaLabel = "",
  style = {},
  ...rest
}) {
  const looks = {
    ghost: {
      background: "transparent",
      color: "var(--ink-700)",
      border: "1px solid transparent"
    },
    bordered: {
      background: "var(--surface-0)",
      color: "var(--ink-700)",
      border: "1px solid var(--border-default)"
    }
  };
  const look = onDark ? {
    background: "rgba(255,255,255,0.1)",
    color: "#fff",
    border: "1px solid transparent"
  } : looks[variant] || looks.ghost;
  return /*#__PURE__*/React.createElement("button", _extends({
    "aria-label": ariaLabel,
    style: {
      width: size,
      height: size,
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: "var(--radius-md)",
      cursor: "pointer",
      transition: "background var(--dur-fast) var(--ease-standard)",
      ...look,
      ...style
    },
    onMouseEnter: e => {
      e.currentTarget.style.background = onDark ? "rgba(255,255,255,0.2)" : "var(--surface-2)";
    },
    onMouseLeave: e => {
      e.currentTarget.style.background = look.background;
    }
  }, rest), children);
}

// ---- components/forms/Input.jsx ----
/**
 * Text input with label + helper. White fill, 1px border, 4–8px radius,
 * slate focus ring. Supports password reveal and trailing element.
 */
function Input({
  label,
  helper,
  error,
  type = "text",
  placeholder = "",
  value,
  defaultValue,
  onChange,
  leading = null,
  trailing = null,
  passwordToggle = false,
  id,
  style = {},
  ...rest
}) {
  const [show, setShow] = useState(false);
  const [focus, setFocus] = useState(false);
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);
  const effectiveType = passwordToggle ? show ? "text" : "password" : type;
  const borderColor = error ? "var(--danger-500)" : focus ? "var(--border-focus)" : "var(--border-default)";
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 6,
      width: "100%",
      ...style
    }
  }, label && /*#__PURE__*/React.createElement("label", {
    htmlFor: inputId,
    style: {
      fontFamily: "var(--font-text)",
      fontSize: 14,
      fontWeight: 600,
      color: "var(--text-strong)"
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      alignItems: "center"
    }
  }, leading && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: 12,
      display: "flex",
      alignItems: "center",
      color: "var(--ink-500)",
      pointerEvents: "none"
    }
  }, leading), /*#__PURE__*/React.createElement("input", _extends({
    id: inputId,
    type: effectiveType,
    placeholder: placeholder,
    value: value,
    defaultValue: defaultValue,
    onChange: onChange,
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    style: {
      width: "100%",
      fontFamily: "var(--font-text)",
      fontSize: 16,
      color: "var(--text-strong)",
      background: "var(--surface-0)",
      border: `1px solid ${borderColor}`,
      borderRadius: "var(--radius-sm)",
      padding: "11px 14px",
      paddingLeft: leading ? 42 : 14,
      paddingRight: passwordToggle || trailing ? 44 : 14,
      outline: "none",
      boxShadow: focus ? "var(--shadow-focus)" : "none",
      transition: "border-color var(--dur-fast), box-shadow var(--dur-fast)",
      boxSizing: "border-box"
    }
  }, rest)), passwordToggle && /*#__PURE__*/React.createElement("button", {
    type: "button",
    "aria-label": show ? "Hide password" : "Show password",
    onClick: () => setShow(v => !v),
    style: {
      position: "absolute",
      right: 8,
      background: "none",
      border: "none",
      cursor: "pointer",
      color: "var(--ink-500)",
      display: "flex",
      padding: 6
    }
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": show ? "eye-off" : "eye",
    style: {
      width: 18,
      height: 18
    }
  })), !passwordToggle && trailing && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      right: 10,
      display: "flex",
      alignItems: "center"
    }
  }, trailing)), (helper || error) && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-text)",
      fontSize: 13,
      color: error ? "var(--danger-500)" : "var(--text-subtle)"
    }
  }, error || helper));
}

// ---- components/forms/SegmentedControl.jsx ----
/**
 * SegmentedControl — the Student / Recruiter style toggle. Active segment
 * is a white card with a soft shadow; inactive segments are flat on a
 * surface-1 track.
 */
function SegmentedControl({
  options = [],
  value,
  onChange,
  style = {}
}) {
  return /*#__PURE__*/React.createElement("div", {
    role: "tablist",
    style: {
      display: "grid",
      gridTemplateColumns: `repeat(${options.length}, 1fr)`,
      gap: 4,
      padding: 4,
      background: "var(--surface-1)",
      border: "1px solid var(--border-default)",
      borderRadius: "var(--radius-sm)",
      ...style
    }
  }, options.map(opt => {
    const val = typeof opt === "string" ? opt : opt.value;
    const label = typeof opt === "string" ? opt : opt.label;
    const icon = typeof opt === "string" ? null : opt.icon;
    const active = val === value;
    return /*#__PURE__*/React.createElement("button", {
      key: val,
      role: "tab",
      "aria-selected": active,
      onClick: () => onChange && onChange(val),
      style: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        fontFamily: "var(--font-text)",
        fontSize: 15,
        fontWeight: 600,
        padding: "10px 12px",
        borderRadius: "var(--radius-xs)",
        border: "none",
        cursor: "pointer",
        color: active ? "var(--brand-700)" : "var(--text-muted)",
        background: active ? "var(--surface-0)" : "transparent",
        boxShadow: active ? "var(--shadow-sm)" : "none",
        transition: "background var(--dur-base) var(--ease-standard), color var(--dur-fast)"
      }
    }, icon, label);
  }));
}

// ---- components/forms/Checkbox.jsx ----
/**
 * Checkbox — square 4px-radius box, slate fill when checked. Pairs with
 * inline label text (e.g. "I agree to the Terms of Service").
 */
function Checkbox({
  checked = false,
  onChange,
  label,
  id,
  style = {}
}) {
  const cbId = id || (typeof label === "string" ? label.toLowerCase().replace(/\s+/g, "-").slice(0, 24) : undefined);
  return /*#__PURE__*/React.createElement("label", {
    htmlFor: cbId,
    style: {
      display: "inline-flex",
      alignItems: "flex-start",
      gap: 10,
      cursor: "pointer",
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      flexShrink: 0,
      width: 20,
      height: 20,
      marginTop: 1,
      borderRadius: "var(--radius-xs)",
      border: `1.5px solid ${checked ? "var(--brand-700)" : "var(--border-strong)"}`,
      background: checked ? "var(--brand-700)" : "var(--surface-0)",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      transition: "background var(--dur-fast), border-color var(--dur-fast)"
    }
  }, checked && /*#__PURE__*/React.createElement("svg", {
    width: "12",
    height: "12",
    viewBox: "0 0 12 12",
    fill: "none"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M2.5 6.2L4.8 8.5L9.5 3.5",
    stroke: "#fff",
    strokeWidth: "1.8",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }))), /*#__PURE__*/React.createElement("input", {
    id: cbId,
    type: "checkbox",
    checked: checked,
    onChange: onChange,
    style: {
      position: "absolute",
      opacity: 0,
      width: 0,
      height: 0
    }
  }), label && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-text)",
      fontSize: 14,
      lineHeight: 1.5,
      color: "var(--text-body)"
    }
  }, label));
}

// ---- components/feedback/Badge.jsx ----
const TONES = {
  active: {
    bg: "var(--success-100)",
    fg: "var(--success-700-text)"
  },
  success: {
    bg: "var(--success-100)",
    fg: "var(--success-700-text)"
  },
  submitted: {
    bg: "var(--info-100)",
    fg: "var(--info-700-text)"
  },
  reviewing: {
    bg: "var(--info-100)",
    fg: "var(--info-700-text)"
  },
  info: {
    bg: "var(--info-100)",
    fg: "var(--info-700-text)"
  },
  draft: {
    bg: "var(--surface-2)",
    fg: "var(--ink-600)"
  },
  neutral: {
    bg: "var(--surface-2)",
    fg: "var(--ink-600)"
  },
  danger: {
    bg: "var(--danger-100)",
    fg: "var(--danger-700-text)"
  },
  rejected: {
    bg: "var(--danger-100)",
    fg: "var(--danger-700-text)"
  },
  warning: {
    bg: "var(--warning-100)",
    fg: "var(--warning-500)"
  },
  premium: {
    bg: "var(--brand-700)",
    fg: "#fff"
  }
};

/**
 * Status badge — pill, small uppercase label. Used for gig/application
 * status (Active, Submitted, Reviewing, Draft, Rejected) and PREMIUM tags.
 */
function Badge({
  children,
  tone = "neutral",
  uppercase = true,
  style = {}
}) {
  const t = TONES[tone] || TONES.neutral;
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      fontFamily: "var(--font-text)",
      fontSize: 12,
      fontWeight: 600,
      letterSpacing: uppercase ? "0.04em" : 0,
      textTransform: uppercase ? "uppercase" : "none",
      padding: "4px 10px",
      borderRadius: "var(--radius-full)",
      background: t.bg,
      color: t.fg,
      whiteSpace: "nowrap",
      ...style
    }
  }, children);
}

// ---- components/feedback/Tag.jsx ----
/**
 * Tag / skill chip — square-ish, neutral or slate-tinted. Used for skills
 * (FIGMA, PYTHON, REACT) and gig meta (Remote, 2 Weeks, On-site).
 */
function Tag({
  children,
  variant = "neutral",
  style = {}
}) {
  const looks = {
    neutral: {
      bg: "var(--surface-2)",
      fg: "var(--ink-700)",
      border: "transparent"
    },
    outline: {
      bg: "transparent",
      fg: "var(--ink-700)",
      border: "var(--border-default)"
    },
    brand: {
      bg: "var(--brand-50)",
      fg: "var(--brand-700)",
      border: "transparent"
    },
    onDark: {
      bg: "rgba(255,255,255,0.14)",
      fg: "#fff",
      border: "transparent"
    }
  };
  const l = looks[variant] || looks.neutral;
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      fontFamily: "var(--font-text)",
      fontSize: 12,
      fontWeight: 600,
      letterSpacing: "0.02em",
      padding: "5px 10px",
      borderRadius: "var(--radius-xs)",
      background: l.bg,
      color: l.fg,
      border: `1px solid ${l.border}`,
      whiteSpace: "nowrap",
      ...style
    }
  }, children);
}

// ---- components/feedback/ProgressBar.jsx ----
/**
 * ProgressBar — thin rounded track with a slate (or custom) fill. Used for
 * profile completion, course progress, and applicant-volume bars.
 */
function ProgressBar({
  value = 0,
  max = 100,
  color = "var(--brand-700)",
  track = "var(--surface-2)",
  height = 8,
  onDark = false,
  style = {}
}) {
  const pct = Math.max(0, Math.min(100, value / max * 100));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: "100%",
      height,
      background: onDark ? "rgba(255,255,255,0.2)" : track,
      borderRadius: "var(--radius-full)",
      overflow: "hidden",
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: `${pct}%`,
      height: "100%",
      background: onDark ? "#fff" : color,
      borderRadius: "var(--radius-full)",
      transition: "width var(--dur-slow) var(--ease-out)"
    }
  }));
}

// ---- components/data/Card.jsx ----
/**
 * Card — the base container. White fill, 1px border, soft shadow, 12px
 * radius by default. `tone="dark"` flips to a slate feature card (white
 * text, no border). `interactive` adds a hover lift.
 */
function Card({
  children,
  tone = "default",
  radius = "md",
  padding = 24,
  interactive = false,
  style = {},
  ...rest
}) {
  const radii = {
    sm: "var(--radius-sm)",
    md: "var(--radius-md)",
    lg: "var(--radius-lg)",
    xl: "var(--radius-xl)"
  };
  const tones = {
    default: {
      background: "var(--surface-0)",
      border: "1px solid var(--border-default)",
      color: "var(--text-body)",
      boxShadow: "var(--shadow-sm)"
    },
    flat: {
      background: "var(--surface-0)",
      border: "1px solid var(--border-default)",
      color: "var(--text-body)",
      boxShadow: "none"
    },
    well: {
      background: "var(--surface-2)",
      border: "1px solid var(--border-subtle)",
      color: "var(--text-body)",
      boxShadow: "none"
    },
    dark: {
      background: "var(--brand-700)",
      border: "1px solid transparent",
      color: "#fff",
      boxShadow: "var(--shadow-md)"
    },
    earth: {
      background: "var(--accent-earth)",
      border: "1px solid transparent",
      color: "#fff",
      boxShadow: "var(--shadow-md)"
    }
  };
  const t = tones[tone] || tones.default;
  const base = {
    borderRadius: radii[radius] || radii.md,
    padding,
    boxSizing: "border-box",
    transition: "box-shadow var(--dur-base) var(--ease-standard), transform var(--dur-base) var(--ease-standard)",
    ...t,
    ...style
  };
  return /*#__PURE__*/React.createElement("div", _extends({
    style: base,
    onMouseEnter: interactive ? e => {
      e.currentTarget.style.boxShadow = "var(--shadow-lg)";
      e.currentTarget.style.transform = "translateY(-2px)";
    } : undefined,
    onMouseLeave: interactive ? e => {
      e.currentTarget.style.boxShadow = t.boxShadow;
      e.currentTarget.style.transform = "none";
    } : undefined
  }, rest), children);
}

// ---- components/data/StatCard.jsx ----
/**
 * StatCard — the KPI tile used across dashboards. Eyebrow label, big
 * display number, and a top-right icon (optionally in a tinted square).
 * Optional delta line (e.g. "+2 this week").
 */
function StatCard({
  label,
  value,
  icon = null,
  iconTone = "slate",
  delta = null,
  deltaTone = "success",
  style = {}
}) {
  const iconTones = {
    slate: {
      bg: "var(--brand-700)",
      fg: "#fff"
    },
    soft: {
      bg: "var(--brand-50)",
      fg: "var(--brand-700)"
    },
    success: {
      bg: "var(--success-100)",
      fg: "var(--success-600)"
    },
    info: {
      bg: "var(--info-100)",
      fg: "var(--info-600)"
    },
    earth: {
      bg: "var(--accent-earth-100)",
      fg: "var(--accent-earth)"
    },
    none: null
  };
  const it = iconTones[iconTone];
  const deltaColor = deltaTone === "success" ? "var(--success-600)" : deltaTone === "danger" ? "var(--danger-500)" : "var(--text-subtle)";
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--surface-0)",
      border: "1px solid var(--border-default)",
      borderRadius: "var(--radius-md)",
      padding: 20,
      display: "flex",
      flexDirection: "column",
      gap: 14,
      boxShadow: "var(--shadow-xs)",
      boxSizing: "border-box",
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "flex-start",
      justifyContent: "space-between",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-text)",
      fontSize: 12,
      fontWeight: 600,
      letterSpacing: "0.04em",
      textTransform: "uppercase",
      color: "var(--text-subtle)"
    }
  }, label), icon && (it ? /*#__PURE__*/React.createElement("span", {
    style: {
      width: 36,
      height: 36,
      borderRadius: "var(--radius-sm)",
      background: it.bg,
      color: it.fg,
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0
    }
  }, icon) : /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--ink-500)",
      display: "inline-flex",
      flexShrink: 0
    }
  }, icon))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "baseline",
      justifyContent: "space-between",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-display)",
      fontWeight: 700,
      fontSize: 32,
      lineHeight: 1.1,
      color: "var(--text-strong)",
      fontVariantNumeric: "tabular-nums"
    }
  }, value), delta && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-text)",
      fontSize: 13,
      fontWeight: 600,
      color: deltaColor,
      whiteSpace: "nowrap"
    }
  }, delta)));
}

// ---- components/data/Avatar.jsx ----
/**
 * Avatar — circle or squircle. Renders a photo (src) or initials on a
 * slate tint. Sizes via `size` px.
 */
function Avatar({
  src = null,
  name = "",
  size = 40,
  shape = "circle",
  style = {}
}) {
  const initials = name.split(" ").filter(Boolean).slice(0, 2).map(p => p[0]?.toUpperCase()).join("");
  const radius = shape === "circle" ? "9999px" : "var(--radius-md)";
  return /*#__PURE__*/React.createElement("span", {
    style: {
      width: size,
      height: size,
      borderRadius: radius,
      background: "var(--brand-50)",
      color: "var(--brand-700)",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "var(--font-text)",
      fontWeight: 600,
      fontSize: Math.round(size * 0.4),
      overflow: "hidden",
      flexShrink: 0,
      border: "1px solid var(--border-subtle)",
      ...style
    }
  }, src ? /*#__PURE__*/React.createElement("img", {
    src: src,
    alt: name,
    style: {
      width: "100%",
      height: "100%",
      objectFit: "cover"
    }
  }) : initials || "?");
}
window.AavasarDesignSystem_e30e7a = Object.assign(window.AavasarDesignSystem_e30e7a || {}, {
  Button,
  IconButton,
  Input,
  SegmentedControl,
  Checkbox,
  Badge,
  Tag,
  ProgressBar,
  Card,
  StatCard,
  Avatar
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ds-runtime.js", error: String((e && e.message) || e) }); }

// ui_kits/app/RecruiterDashboard.jsx
try { (() => {
// Aavasar — Recruiter Admin dashboard. Registers <RecruiterDashboard> on window.
(function () {
  const C = () => window.AavasarDesignSystem_e30e7a;
  const Ico = ({
    n,
    s = 20,
    style
  }) => /*#__PURE__*/React.createElement("i", {
    "data-lucide": n,
    style: {
      width: s,
      height: s,
      ...style
    }
  });
  function TopNav() {
    const {
      Button,
      IconButton,
      Avatar
    } = C();
    const [active, setActive] = React.useState("Dashboard");
    const links = ["Dashboard", "Browse Talent", "Resources"];
    return /*#__PURE__*/React.createElement("header", {
      style: {
        position: "sticky",
        top: 0,
        zIndex: 20,
        background: "var(--surface-0)",
        borderBottom: "1px solid var(--border-default)"
      }
    }, /*#__PURE__*/React.createElement("nav", {
      style: {
        height: "var(--nav-height)",
        padding: "0 40px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 32
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 10
      }
    }, /*#__PURE__*/React.createElement("img", {
      src: "../../assets/aavasar-mark.png",
      alt: "",
      style: {
        width: 30,
        height: 30
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: "var(--font-display)",
        fontWeight: 700,
        fontSize: 22,
        color: "var(--brand-700)"
      }
    }, "Aavasar")), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        gap: 6
      }
    }, links.map(l => {
      const on = active === l;
      return /*#__PURE__*/React.createElement("button", {
        key: l,
        onClick: () => setActive(l),
        style: {
          fontFamily: "var(--font-text)",
          fontSize: 15,
          fontWeight: on ? 600 : 500,
          color: on ? "var(--brand-700)" : "var(--text-muted)",
          background: "none",
          border: "1px solid " + (on ? "var(--border-default)" : "transparent"),
          borderRadius: "var(--radius-sm)",
          padding: "7px 12px",
          cursor: "pointer"
        }
      }, l);
    }))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 12
      }
    }, /*#__PURE__*/React.createElement(IconButton, {
      ariaLabel: "Notifications"
    }, /*#__PURE__*/React.createElement(Ico, {
      n: "bell",
      s: 20
    })), /*#__PURE__*/React.createElement(IconButton, {
      ariaLabel: "Help"
    }, /*#__PURE__*/React.createElement(Ico, {
      n: "help-circle",
      s: 20
    })), /*#__PURE__*/React.createElement(Button, {
      variant: "primary"
    }, "Post a Gig"), /*#__PURE__*/React.createElement(Avatar, {
      src: "../../assets/photos/peer-network.jpg",
      name: "Sushma",
      size: 40
    }))));
  }
  function SideNav() {
    const {
      Button
    } = C();
    const [active, setActive] = React.useState("Overview");
    const items = [["Overview", "layout-grid"], ["My Gigs", "briefcase"], ["Applicants", "users"], ["Messages", "mail"], ["Settings", "settings"]];
    return /*#__PURE__*/React.createElement("aside", {
      style: {
        width: 240,
        flexShrink: 0,
        padding: 24,
        display: "flex",
        flexDirection: "column",
        gap: 20,
        borderRight: "1px solid var(--border-default)",
        minHeight: "100%"
      }
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: "var(--font-display)",
        fontWeight: 700,
        fontSize: 20,
        color: "var(--text-strong)"
      }
    }, "Recruiter Admin"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: "var(--font-text)",
        fontSize: 13,
        color: "var(--text-subtle)"
      }
    }, "Manage your talent pipeline")), /*#__PURE__*/React.createElement("nav", {
      style: {
        display: "flex",
        flexDirection: "column",
        gap: 4
      }
    }, items.map(([label, icon]) => {
      const on = active === label;
      return /*#__PURE__*/React.createElement("button", {
        key: label,
        onClick: () => setActive(label),
        style: {
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "10px 12px",
          borderRadius: "var(--radius-sm)",
          border: "none",
          cursor: "pointer",
          textAlign: "left",
          fontFamily: "var(--font-text)",
          fontSize: 15,
          fontWeight: on ? 600 : 500,
          background: on ? "var(--brand-700)" : "transparent",
          color: on ? "#fff" : "var(--text-muted)"
        }
      }, /*#__PURE__*/React.createElement(Ico, {
        n: icon,
        s: 18
      }), label);
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: "auto",
        display: "flex",
        flexDirection: "column",
        gap: 8
      }
    }, /*#__PURE__*/React.createElement("button", {
      style: {
        fontFamily: "var(--font-text)",
        fontSize: 15,
        fontWeight: 600,
        color: "var(--success-600)",
        background: "var(--success-100)",
        border: "none",
        borderRadius: "var(--radius-sm)",
        padding: "10px 12px",
        cursor: "pointer"
      }
    }, "Upgrade Plan"), /*#__PURE__*/React.createElement("button", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "10px 12px",
        borderRadius: "var(--radius-sm)",
        border: "none",
        cursor: "pointer",
        background: "transparent",
        color: "var(--text-muted)",
        fontFamily: "var(--font-text)",
        fontSize: 15
      }
    }, /*#__PURE__*/React.createElement(Ico, {
      n: "log-out",
      s: 18
    }), "Logout")));
  }
  function RecruiterDashboard() {
    const {
      Card,
      StatCard,
      Badge,
      Button,
      Avatar,
      Tag,
      ProgressBar
    } = C();
    React.useEffect(() => {
      lucide.createIcons();
    });
    const gigs = [{
      t: "UI/UX Design Intern",
      sub: "Product Team · Remote",
      date: "Oct 12, 2023",
      apps: 24,
      pct: 80,
      status: ["active", "Active"]
    }, {
      t: "Junior Web Developer",
      sub: "Engineering · Hybrid",
      date: "Oct 15, 2023",
      apps: 12,
      pct: 45,
      status: ["reviewing", "Reviewing"]
    }, {
      t: "Social Media Coordinator",
      sub: "Marketing · Remote",
      date: "Oct 18, 2023",
      apps: 31,
      pct: 95,
      status: ["active", "Active"]
    }, {
      t: "Content Writer (Freelance)",
      sub: "Editorial · Remote",
      date: "Oct 20, 2023",
      apps: 9,
      pct: 30,
      status: ["draft", "Draft"]
    }];
    return /*#__PURE__*/React.createElement("div", {
      style: {
        background: "var(--surface-page)",
        minHeight: "100%"
      }
    }, /*#__PURE__*/React.createElement(TopNav, null), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex"
      }
    }, /*#__PURE__*/React.createElement(SideNav, null), /*#__PURE__*/React.createElement("main", {
      style: {
        flex: 1,
        padding: "32px 40px"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: 28
      }
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
      style: {
        fontFamily: "var(--font-display)",
        fontWeight: 700,
        fontSize: 38,
        color: "var(--text-strong)",
        margin: 0,
        letterSpacing: "-0.02em"
      }
    }, "Welcome back, Sushma!"), /*#__PURE__*/React.createElement("p", {
      style: {
        fontFamily: "var(--font-text)",
        fontSize: 16,
        color: "var(--text-muted)",
        margin: "4px 0 0"
      }
    }, "Today is Tuesday, October 24th, 2023")), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 12
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex"
      }
    }, ["Aayush", "Binod", "Isha"].map((n, i) => /*#__PURE__*/React.createElement("span", {
      key: n,
      style: {
        marginLeft: i ? -10 : 0
      }
    }, /*#__PURE__*/React.createElement(Avatar, {
      name: n,
      size: 36,
      style: {
        border: "2px solid var(--surface-page)"
      }
    }))), /*#__PURE__*/React.createElement("span", {
      style: {
        marginLeft: -10,
        width: 36,
        height: 36,
        borderRadius: "9999px",
        background: "var(--surface-2)",
        border: "2px solid var(--surface-page)",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "var(--font-text)",
        fontSize: 12,
        fontWeight: 600,
        color: "var(--text-muted)"
      }
    }, "+12")), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: "var(--font-text)",
        fontSize: 14,
        color: "var(--text-muted)"
      }
    }, "Recent applicants for UX Researcher"))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: 16,
        marginBottom: 28
      }
    }, /*#__PURE__*/React.createElement(StatCard, {
      label: "Active Gigs",
      value: "14",
      delta: "+2 this week",
      icon: /*#__PURE__*/React.createElement(Ico, {
        n: "briefcase"
      }),
      iconTone: "slate"
    }), /*#__PURE__*/React.createElement(StatCard, {
      label: "New Applicants",
      value: "42",
      delta: "+18%",
      icon: /*#__PURE__*/React.createElement(Ico, {
        n: "user-plus"
      }),
      iconTone: "info"
    }), /*#__PURE__*/React.createElement(StatCard, {
      label: "Pending Interviews",
      value: "8",
      delta: "Next: 2 PM",
      deltaTone: "neutral",
      icon: /*#__PURE__*/React.createElement(Ico, {
        n: "calendar"
      }),
      iconTone: "earth"
    }), /*#__PURE__*/React.createElement(StatCard, {
      label: "Total Hired",
      value: "128",
      delta: "Total",
      deltaTone: "neutral",
      icon: /*#__PURE__*/React.createElement(Ico, {
        n: "check-circle"
      }),
      iconTone: "success"
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "grid",
        gridTemplateColumns: "1.8fr 1fr",
        gap: 28
      }
    }, /*#__PURE__*/React.createElement(Card, {
      padding: 0
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "20px 24px",
        borderBottom: "1px solid var(--border-subtle)"
      }
    }, /*#__PURE__*/React.createElement("h2", {
      style: {
        fontFamily: "var(--font-display)",
        fontWeight: 700,
        fontSize: 20,
        color: "var(--text-strong)",
        margin: 0
      }
    }, "Active Gigs"), /*#__PURE__*/React.createElement("a", {
      href: "#",
      onClick: e => e.preventDefault(),
      style: {
        fontFamily: "var(--font-text)",
        fontSize: 14,
        fontWeight: 600,
        color: "var(--brand-700)",
        textDecoration: "none"
      }
    }, "View All \u2192")), /*#__PURE__*/React.createElement("table", {
      style: {
        width: "100%",
        borderCollapse: "collapse"
      }
    }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, ["Gig Title", "Date Posted", "Applicants", "Status"].map(h => /*#__PURE__*/React.createElement("th", {
      key: h,
      style: {
        textAlign: "left",
        padding: "12px 24px",
        fontFamily: "var(--font-text)",
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: "0.04em",
        textTransform: "uppercase",
        color: "var(--text-subtle)",
        borderBottom: "1px solid var(--border-subtle)"
      }
    }, h)))), /*#__PURE__*/React.createElement("tbody", null, gigs.map(g => /*#__PURE__*/React.createElement("tr", {
      key: g.t
    }, /*#__PURE__*/React.createElement("td", {
      style: {
        padding: "16px 24px",
        borderBottom: "1px solid var(--border-subtle)"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: "var(--font-text)",
        fontWeight: 600,
        fontSize: 15,
        color: "var(--text-strong)"
      }
    }, g.t), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: "var(--font-text)",
        fontSize: 13,
        color: "var(--text-subtle)"
      }
    }, g.sub)), /*#__PURE__*/React.createElement("td", {
      style: {
        padding: "16px 24px",
        borderBottom: "1px solid var(--border-subtle)",
        fontFamily: "var(--font-text)",
        fontSize: 14,
        color: "var(--text-muted)"
      }
    }, g.date), /*#__PURE__*/React.createElement("td", {
      style: {
        padding: "16px 24px",
        borderBottom: "1px solid var(--border-subtle)"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 10
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: "var(--font-display)",
        fontWeight: 700,
        fontSize: 16,
        color: "var(--text-strong)"
      }
    }, g.apps), /*#__PURE__*/React.createElement("div", {
      style: {
        width: 70
      }
    }, /*#__PURE__*/React.createElement(ProgressBar, {
      value: g.pct,
      height: 6
    })))), /*#__PURE__*/React.createElement("td", {
      style: {
        padding: "16px 24px",
        borderBottom: "1px solid var(--border-subtle)"
      }
    }, /*#__PURE__*/React.createElement(Badge, {
      tone: g.status[0]
    }, g.status[1]))))))), /*#__PURE__*/React.createElement(Card, {
      style: {
        padding: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        padding: "20px 22px 12px"
      }
    }, /*#__PURE__*/React.createElement("h2", {
      style: {
        fontFamily: "var(--font-display)",
        fontWeight: 700,
        fontSize: 20,
        color: "var(--text-strong)",
        margin: 0
      }
    }, "New Applicants"), /*#__PURE__*/React.createElement("p", {
      style: {
        fontFamily: "var(--font-text)",
        fontSize: 13,
        color: "var(--text-subtle)",
        margin: "2px 0 0"
      }
    }, "Review top student talent")), /*#__PURE__*/React.createElement("div", {
      style: {
        padding: "0 22px"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        border: "1px solid var(--border-default)",
        borderRadius: "var(--radius-md)",
        padding: 16
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        gap: 12,
        marginBottom: 12
      }
    }, /*#__PURE__*/React.createElement(Avatar, {
      name: "Aayush Shrestha",
      size: 48,
      shape: "squircle"
    }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: "var(--font-text)",
        fontWeight: 700,
        fontSize: 15,
        color: "var(--text-strong)"
      }
    }, "Aayush Shrestha"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: "var(--font-text)",
        fontSize: 13,
        color: "var(--text-muted)"
      }
    }, "Applied for UI/UX Design Intern"))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        gap: 6,
        marginBottom: 14
      }
    }, /*#__PURE__*/React.createElement(Tag, null, "FIGMA"), /*#__PURE__*/React.createElement(Tag, null, "PROTOTYPING"), /*#__PURE__*/React.createElement(Tag, null, "PYTHON")), /*#__PURE__*/React.createElement(Button, {
      variant: "primary",
      full: true
    }, "View Profile")), [["Binod Thapa", "Web Developer Applicant"], ["Isha Giri", "Social Media Coordinator"], ["Rohan Adhikari", "Content Writer Applicant"]].map(([n, r]) => /*#__PURE__*/React.createElement("div", {
      key: n,
      style: {
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "12px 0",
        borderBottom: "1px dashed var(--border-default)"
      }
    }, /*#__PURE__*/React.createElement(Avatar, {
      name: n,
      size: 40
    }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: "var(--font-text)",
        fontWeight: 600,
        fontSize: 14,
        color: "var(--text-strong)"
      }
    }, n), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: "var(--font-text)",
        fontSize: 13,
        color: "var(--text-subtle)"
      }
    }, r)))), /*#__PURE__*/React.createElement("div", {
      style: {
        textAlign: "center",
        padding: "14px 0 18px"
      }
    }, /*#__PURE__*/React.createElement("a", {
      href: "#",
      onClick: e => e.preventDefault(),
      style: {
        fontFamily: "var(--font-text)",
        fontSize: 14,
        fontWeight: 600,
        color: "var(--brand-700)",
        textDecoration: "none"
      }
    }, "View 18 more applicants"))))), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 28,
        borderRadius: "var(--radius-lg)",
        background: "linear-gradient(135deg, var(--brand-700), var(--brand-900))",
        padding: "32px 36px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 32
      }
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
      style: {
        fontFamily: "var(--font-display)",
        fontWeight: 700,
        fontSize: 22,
        color: "#fff",
        margin: "0 0 8px"
      }
    }, "Talent Pulse: October Report"), /*#__PURE__*/React.createElement("p", {
      style: {
        fontFamily: "var(--font-text)",
        fontSize: 15,
        lineHeight: 1.6,
        color: "var(--brand-200)",
        margin: 0,
        maxWidth: 620
      }
    }, "Student interest in your active gigs has increased by 24% compared to last month. Use our new 'Instant Interview' feature to connect with top performers faster. Hiring costs estimated at NPR 45,000 per placement.")), /*#__PURE__*/React.createElement(Button, {
      onDark: true,
      variant: "primary",
      size: "lg",
      style: {
        flexShrink: 0
      }
    }, "Explore Reports")))));
  }
  window.RecruiterDashboard = RecruiterDashboard;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/RecruiterDashboard.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/StudentDashboard.jsx
try { (() => {
// Aavasar — Student Hub dashboard. Registers <StudentDashboard> on window.
(function () {
  const C = () => window.AavasarDesignSystem_e30e7a;
  const Ico = ({
    n,
    s = 20,
    style
  }) => /*#__PURE__*/React.createElement("i", {
    "data-lucide": n,
    style: {
      width: s,
      height: s,
      ...style
    }
  });
  function Sidebar({
    active,
    setActive
  }) {
    const {
      Button
    } = C();
    const items = [["Find Work", "search"], ["My Gigs", "briefcase"], ["Messages", "message-square"], ["Learning", "graduation-cap"]];
    return /*#__PURE__*/React.createElement("aside", {
      style: {
        width: "var(--sidebar-width)",
        flexShrink: 0,
        background: "var(--surface-0)",
        borderRight: "1px solid var(--border-default)",
        display: "flex",
        flexDirection: "column",
        padding: 24,
        gap: 24,
        minHeight: "100%"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 10
      }
    }, /*#__PURE__*/React.createElement("img", {
      src: "../../assets/aavasar-mark.png",
      alt: "",
      style: {
        width: 32,
        height: 32
      }
    }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: "var(--font-display)",
        fontWeight: 700,
        fontSize: 22,
        color: "var(--brand-700)",
        lineHeight: 1
      }
    }, "Aavasar"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: "var(--font-text)",
        fontSize: 12,
        color: "var(--text-subtle)"
      }
    }, "Student Hub"))), /*#__PURE__*/React.createElement("nav", {
      style: {
        display: "flex",
        flexDirection: "column",
        gap: 4
      }
    }, items.map(([label, icon]) => {
      const on = active === label;
      return /*#__PURE__*/React.createElement("button", {
        key: label,
        onClick: () => setActive(label),
        style: {
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "10px 12px",
          borderRadius: "var(--radius-sm)",
          border: "none",
          cursor: "pointer",
          textAlign: "left",
          fontFamily: "var(--font-text)",
          fontSize: 15,
          fontWeight: on ? 600 : 500,
          background: on ? "var(--surface-2)" : "transparent",
          color: on ? "var(--brand-700)" : "var(--text-muted)"
        }
      }, /*#__PURE__*/React.createElement(Ico, {
        n: icon,
        s: 18
      }), label);
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: "auto",
        display: "flex",
        flexDirection: "column",
        gap: 4
      }
    }, /*#__PURE__*/React.createElement(Button, {
      variant: "primary",
      full: true
    }, "Post Profile"), /*#__PURE__*/React.createElement("button", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "10px 12px",
        borderRadius: "var(--radius-sm)",
        border: "none",
        cursor: "pointer",
        background: "transparent",
        color: "var(--text-muted)",
        fontFamily: "var(--font-text)",
        fontSize: 15,
        marginTop: 8
      }
    }, /*#__PURE__*/React.createElement(Ico, {
      n: "help-circle",
      s: 18
    }), "Support"), /*#__PURE__*/React.createElement("button", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "10px 12px",
        borderRadius: "var(--radius-sm)",
        border: "none",
        cursor: "pointer",
        background: "transparent",
        color: "var(--text-muted)",
        fontFamily: "var(--font-text)",
        fontSize: 15
      }
    }, /*#__PURE__*/React.createElement(Ico, {
      n: "log-out",
      s: 18
    }), "Sign Out")));
  }
  function StudentDashboard() {
    const {
      Button,
      Card,
      StatCard,
      Badge,
      ProgressBar,
      Avatar
    } = C();
    const [active, setActive] = React.useState("Find Work");
    React.useEffect(() => {
      lucide.createIcons();
    });
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        minHeight: "100%",
        background: "var(--surface-page)"
      }
    }, /*#__PURE__*/React.createElement(Sidebar, {
      active: active,
      setActive: setActive
    }), /*#__PURE__*/React.createElement("main", {
      style: {
        flex: 1,
        padding: "32px 40px",
        maxWidth: 1180
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 28
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 18
      }
    }, /*#__PURE__*/React.createElement(Avatar, {
      src: "../../assets/photos/peer-network.jpg",
      name: "Pratikshya",
      size: 64,
      shape: "squircle"
    }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
      style: {
        fontFamily: "var(--font-display)",
        fontWeight: 700,
        fontSize: 38,
        color: "var(--text-strong)",
        margin: 0,
        letterSpacing: "-0.02em"
      }
    }, "Welcome back, Pratikshya!"), /*#__PURE__*/React.createElement("p", {
      style: {
        fontFamily: "var(--font-text)",
        fontSize: 16,
        color: "var(--text-muted)",
        margin: "4px 0 0"
      }
    }, "Your profile is 85% complete. Add your latest project to stand out."))), /*#__PURE__*/React.createElement(Button, {
      variant: "outline",
      iconLeft: /*#__PURE__*/React.createElement(Ico, {
        n: "settings",
        s: 16
      })
    }, "Edit Profile")), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: 16,
        marginBottom: 28
      }
    }, /*#__PURE__*/React.createElement(StatCard, {
      label: "Total Earnings",
      value: "NPR 1,24,000",
      icon: /*#__PURE__*/React.createElement(Ico, {
        n: "banknote"
      }),
      iconTone: "success"
    }), /*#__PURE__*/React.createElement(StatCard, {
      label: "Active Gigs",
      value: "3",
      icon: /*#__PURE__*/React.createElement(Ico, {
        n: "rocket"
      }),
      iconTone: "info"
    }), /*#__PURE__*/React.createElement(StatCard, {
      label: "Applications",
      value: "12",
      icon: /*#__PURE__*/React.createElement(Ico, {
        n: "file-text"
      }),
      iconTone: "soft"
    }), /*#__PURE__*/React.createElement(StatCard, {
      label: "Avg Rating",
      value: "4.9/5",
      icon: /*#__PURE__*/React.createElement(Ico, {
        n: "star"
      }),
      iconTone: "soft"
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "grid",
        gridTemplateColumns: "1.7fr 1fr",
        gap: 28
      }
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "baseline",
        marginBottom: 14
      }
    }, /*#__PURE__*/React.createElement("h2", {
      style: {
        fontFamily: "var(--font-display)",
        fontWeight: 700,
        fontSize: 22,
        color: "var(--text-strong)",
        margin: 0
      }
    }, "Active Gigs"), /*#__PURE__*/React.createElement("a", {
      href: "#",
      onClick: e => e.preventDefault(),
      style: {
        fontFamily: "var(--font-text)",
        fontSize: 14,
        fontWeight: 600,
        color: "var(--brand-700)",
        textDecoration: "none"
      }
    }, "View All")), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        flexDirection: "column",
        gap: 16,
        marginBottom: 28
      }
    }, [{
      t: "Frontend UI Bug Fixes",
      c: "Acme Tech Solutions",
      status: ["active", "In Progress"],
      line: "Next Milestone: Unit Testing (Oct 29)",
      amt: "NPR 45,000"
    }, {
      t: "Brand Identity Design",
      c: "Nova Creative",
      status: ["submitted", "Submitted"],
      line: "Status: Under Review",
      amt: "NPR 30,000"
    }].map(g => /*#__PURE__*/React.createElement(Card, {
      key: g.t
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: 14
      }
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: "var(--font-display)",
        fontWeight: 700,
        fontSize: 18,
        color: "var(--text-strong)"
      }
    }, g.t), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 6,
        fontFamily: "var(--font-text)",
        fontSize: 14,
        color: "var(--text-muted)",
        marginTop: 4
      }
    }, /*#__PURE__*/React.createElement(Ico, {
      n: "building-2",
      s: 15
    }), g.c)), /*#__PURE__*/React.createElement(Badge, {
      tone: g.status[0]
    }, g.status[1])), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderTop: "1px solid var(--border-subtle)",
        paddingTop: 14
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: "var(--font-text)",
        fontSize: 14,
        fontWeight: 600,
        color: "var(--text-body)"
      }
    }, g.line), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: "var(--font-display)",
        fontWeight: 700,
        fontSize: 22,
        color: "var(--text-strong)",
        fontVariantNumeric: "tabular-nums"
      }
    }, g.amt))))), /*#__PURE__*/React.createElement("h2", {
      style: {
        fontFamily: "var(--font-display)",
        fontWeight: 700,
        fontSize: 22,
        color: "var(--text-strong)",
        margin: "0 0 14px"
      }
    }, "Recommended for You"), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 16
      }
    }, /*#__PURE__*/React.createElement(Card, {
      tone: "dark",
      style: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        minHeight: 200
      }
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        gap: 8,
        marginBottom: 14
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: "var(--font-text)",
        fontSize: 11,
        fontWeight: 600,
        background: "rgba(255,255,255,0.16)",
        color: "#fff",
        padding: "3px 8px",
        borderRadius: "var(--radius-xs)"
      }
    }, "REACT"), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: "var(--font-text)",
        fontSize: 11,
        fontWeight: 600,
        background: "rgba(255,255,255,0.16)",
        color: "#fff",
        padding: "3px 8px",
        borderRadius: "var(--radius-xs)"
      }
    }, "FIGMA")), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: "var(--font-display)",
        fontWeight: 700,
        fontSize: 22,
        color: "#fff",
        lineHeight: 1.15
      }
    }, "UX/UI Designer for FinTech Startup"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: "var(--font-text)",
        fontSize: 14,
        color: "var(--brand-200)",
        marginTop: 8
      }
    }, "Remote \xB7 20h/week")), /*#__PURE__*/React.createElement(Button, {
      onDark: true,
      variant: "primary",
      full: true
    }, "Apply Now")), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        flexDirection: "column",
        gap: 16
      }
    }, /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: "var(--font-display)",
        fontWeight: 700,
        fontSize: 16,
        color: "var(--text-strong)",
        marginBottom: 8
      }
    }, "Python Scripting for Data Cleanup"), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: "var(--font-text)",
        fontWeight: 700,
        fontSize: 15,
        color: "var(--success-600)"
      }
    }, "NPR 4,000/hr"), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: "var(--font-text)",
        fontSize: 13,
        color: "var(--text-subtle)"
      }
    }, "3 days ago"))), /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: "var(--font-display)",
        fontWeight: 700,
        fontSize: 16,
        color: "var(--text-strong)",
        marginBottom: 8
      }
    }, "Market Research: Gen Z Trends"), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: "var(--font-text)",
        fontWeight: 700,
        fontSize: 15,
        color: "var(--success-600)"
      }
    }, "NPR 20,000 Fixed"), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: "var(--font-text)",
        fontSize: 13,
        color: "var(--text-subtle)"
      }
    }, "New")))))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        flexDirection: "column",
        gap: 20
      }
    }, /*#__PURE__*/React.createElement(Card, {
      style: {
        padding: 20
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 8,
        marginBottom: 14
      }
    }, /*#__PURE__*/React.createElement(Ico, {
      n: "calendar",
      s: 18,
      style: {
        color: "var(--brand-700)"
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: "var(--font-display)",
        fontWeight: 700,
        fontSize: 18,
        color: "var(--text-strong)"
      }
    }, "Upcoming")), [{
      d: "28",
      m: "OCT",
      t: "Interview: Acme Events",
      s: "10:30 AM · Video Call"
    }, {
      d: "30",
      m: "OCT",
      t: "Deadline: Logo Drafts",
      s: "5:00 PM · Submission Port"
    }].map(u => /*#__PURE__*/React.createElement("div", {
      key: u.t,
      style: {
        display: "flex",
        gap: 14,
        alignItems: "center",
        border: "1px solid var(--border-default)",
        borderRadius: "var(--radius-sm)",
        padding: "12px 14px",
        marginBottom: 10
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        textAlign: "center",
        minWidth: 36
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: "var(--font-display)",
        fontWeight: 700,
        fontSize: 20,
        color: "var(--text-strong)",
        lineHeight: 1
      }
    }, u.d), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: "var(--font-text)",
        fontSize: 11,
        color: "var(--text-subtle)"
      }
    }, u.m)), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: "var(--font-text)",
        fontWeight: 600,
        fontSize: 14,
        color: "var(--text-strong)"
      }
    }, u.t), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: "var(--font-text)",
        fontSize: 13,
        color: "var(--text-muted)"
      }
    }, u.s))))), /*#__PURE__*/React.createElement(Card, {
      tone: "earth",
      style: {
        padding: 20
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 10
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: "var(--font-text)",
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: "0.04em",
        textTransform: "uppercase",
        color: "rgba(255,255,255,0.8)",
        background: "rgba(255,255,255,0.16)",
        padding: "4px 8px",
        borderRadius: "var(--radius-xs)"
      }
    }, "Course in Progress"), /*#__PURE__*/React.createElement(Ico, {
      n: "graduation-cap",
      s: 20,
      style: {
        color: "rgba(255,255,255,0.85)"
      }
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: "var(--font-display)",
        fontWeight: 700,
        fontSize: 20,
        color: "#fff",
        marginBottom: 12
      }
    }, "Meta Front-End Developer"), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        justifyContent: "space-between",
        fontFamily: "var(--font-text)",
        fontSize: 13,
        color: "#fff",
        marginBottom: 6
      }
    }, /*#__PURE__*/React.createElement("span", null, "Progress"), /*#__PURE__*/React.createElement("span", null, "68%")), /*#__PURE__*/React.createElement(ProgressBar, {
      value: 68,
      onDark: true,
      height: 8
    }), /*#__PURE__*/React.createElement(Button, {
      onDark: true,
      variant: "primary",
      full: true,
      style: {
        marginTop: 16
      }
    }, "Resume Course")), /*#__PURE__*/React.createElement("div", {
      style: {
        position: "relative",
        borderRadius: "var(--radius-md)",
        overflow: "hidden",
        minHeight: 150,
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        padding: 18,
        background: "var(--brand-900)"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: "absolute",
        inset: 0,
        backgroundImage: "url(../../assets/photos/hero-a.png)",
        backgroundSize: "cover",
        backgroundPosition: "center"
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: "absolute",
        inset: 0,
        background: "linear-gradient(0deg, rgba(18,28,36,0.92) 0%, rgba(18,28,36,0.55) 55%, rgba(18,28,36,0.15) 100%)"
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: "relative"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: "var(--font-display)",
        fontWeight: 700,
        fontSize: 18,
        color: "#fff"
      }
    }, "Join the Peer Network"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: "var(--font-text)",
        fontSize: 13,
        color: "rgba(255,255,255,0.85)"
      }
    }, "Connect with 500+ students on campus")))))));
  }
  window.StudentDashboard = StudentDashboard;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/StudentDashboard.jsx", error: String((e && e.message) || e) }); }

// ui_kits/onboarding/OnboardingFlow.jsx
try { (() => {
// Aavasar — Student onboarding wizard (4 steps). Registers <OnboardingFlow> on window.
(function () {
  const C = () => window.AavasarDesignSystem_e30e7a;
  const Ico = ({
    n,
    s = 18,
    style
  }) => /*#__PURE__*/React.createElement("i", {
    "data-lucide": n,
    style: {
      width: s,
      height: s,
      ...style
    }
  });
  const TOTAL = 4;

  // ---- Top bar + progress ----
  function TopBar({
    step
  }) {
    const pct = step / TOTAL * 100;
    return /*#__PURE__*/React.createElement("header", {
      style: {
        position: "sticky",
        top: 0,
        zIndex: 10,
        background: "var(--surface-0)",
        borderBottom: "1px solid var(--border-default)"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        height: 64,
        padding: "0 32px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 10
      }
    }, /*#__PURE__*/React.createElement("img", {
      src: "../../assets/aavasar-mark.png",
      alt: "",
      style: {
        width: 30,
        height: 30
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: "var(--font-display)",
        fontWeight: 700,
        fontSize: 22,
        color: "var(--brand-700)"
      }
    }, "Aavasar")), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: "var(--font-text)",
        fontSize: 14,
        fontWeight: 600,
        color: "var(--text-muted)"
      }
    }, "Step ", step, " of ", TOTAL)), /*#__PURE__*/React.createElement("div", {
      style: {
        height: 4,
        background: "var(--surface-2)"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        height: "100%",
        width: pct + "%",
        background: step === TOTAL ? "var(--success-500)" : "var(--brand-700)",
        transition: "width var(--dur-slow) var(--ease-out)"
      }
    })));
  }

  // ---- Reusable toggle chip ----
  function Chip({
    label,
    on,
    onClick
  }) {
    return /*#__PURE__*/React.createElement("button", {
      onClick: onClick,
      style: {
        display: "inline-flex",
        alignItems: "center",
        gap: 7,
        fontFamily: "var(--font-text)",
        fontSize: 14,
        fontWeight: 600,
        padding: "9px 16px",
        borderRadius: "var(--radius-full)",
        cursor: "pointer",
        border: "1px solid " + (on ? "var(--brand-700)" : "var(--border-default)"),
        background: on ? "var(--brand-700)" : "var(--surface-0)",
        color: on ? "#fff" : "var(--text-body)",
        transition: "all var(--dur-fast) var(--ease-standard)"
      }
    }, label, on && /*#__PURE__*/React.createElement(Ico, {
      n: "check",
      s: 15
    }));
  }

  // ---- Step 1: Basic Information ----
  function StepBasic({
    next
  }) {
    const {
      Input,
      Button,
      Card
    } = C();
    return /*#__PURE__*/React.createElement("div", {
      style: {
        maxWidth: 640,
        margin: "48px auto"
      }
    }, /*#__PURE__*/React.createElement(Card, {
      padding: 40,
      style: {
        boxShadow: "var(--shadow-md)"
      }
    }, /*#__PURE__*/React.createElement("h1", {
      style: {
        fontFamily: "var(--font-display)",
        fontWeight: 700,
        fontSize: 36,
        color: "var(--text-strong)",
        margin: "0 0 8px",
        letterSpacing: "-0.02em"
      }
    }, "Basic Information"), /*#__PURE__*/React.createElement("p", {
      style: {
        fontFamily: "var(--font-text)",
        fontSize: 16,
        lineHeight: 1.5,
        color: "var(--text-muted)",
        margin: "0 0 28px"
      }
    }, "Tell us about your academic background to help us match you with relevant micro-internships and gigs."), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        flexDirection: "column",
        gap: 20
      }
    }, /*#__PURE__*/React.createElement(Input, {
      label: "University / Institution",
      placeholder: "e.g. Tribhuvan University",
      leading: /*#__PURE__*/React.createElement(Ico, {
        n: "graduation-cap"
      })
    }), /*#__PURE__*/React.createElement(Input, {
      label: "Degree & Major",
      placeholder: "e.g. B.S. Computer Science",
      leading: /*#__PURE__*/React.createElement(Ico, {
        n: "book-open"
      })
    }), /*#__PURE__*/React.createElement(Input, {
      label: "Expected Graduation Year",
      placeholder: "Select Year",
      defaultValue: "2027",
      leading: /*#__PURE__*/React.createElement(Ico, {
        n: "calendar"
      }),
      trailing: /*#__PURE__*/React.createElement(Ico, {
        n: "chevron-down",
        s: 18
      })
    })), /*#__PURE__*/React.createElement(Button, {
      variant: "primary",
      size: "lg",
      full: true,
      style: {
        marginTop: 28
      },
      iconRight: /*#__PURE__*/React.createElement(Ico, {
        n: "arrow-right",
        s: 18
      }),
      onClick: next
    }, "Continue"), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        gap: 12,
        alignItems: "flex-start",
        background: "var(--surface-1)",
        borderRadius: "var(--radius-sm)",
        padding: "14px 16px",
        marginTop: 24
      }
    }, /*#__PURE__*/React.createElement(Ico, {
      n: "info",
      s: 18,
      style: {
        color: "var(--info-500)",
        flexShrink: 0,
        marginTop: 1
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: "var(--font-text)",
        fontSize: 13,
        lineHeight: 1.5,
        color: "var(--text-muted)"
      }
    }, "Your academic details help us verify your student status and unlock exclusive internships. You can update this later in your profile settings."))));
  }

  // ---- Step 2: Skills & Interests ----
  function StepSkills({
    next,
    back
  }) {
    const {
      Input,
      Button,
      Card
    } = C();
    const groups = {
      Design: ["UI Design", "UX Research", "Graphic Design", "Prototyping"],
      Development: ["React", "Tailwind CSS", "Node.js", "Python"],
      "Writing & Data": ["Content Writing", "Copywriting", "Data Analysis"]
    };
    const [picked, setPicked] = React.useState({
      React: true
    });
    const toggle = s => setPicked(p => ({
      ...p,
      [s]: !p[s]
    }));
    return /*#__PURE__*/React.createElement("div", {
      style: {
        maxWidth: 820,
        margin: "48px auto"
      }
    }, /*#__PURE__*/React.createElement("h1", {
      style: {
        fontFamily: "var(--font-display)",
        fontWeight: 700,
        fontSize: 38,
        color: "var(--text-strong)",
        margin: "0 0 8px",
        letterSpacing: "-0.02em"
      }
    }, "What are you good at?"), /*#__PURE__*/React.createElement("p", {
      style: {
        fontFamily: "var(--font-text)",
        fontSize: 17,
        lineHeight: 1.5,
        color: "var(--text-muted)",
        margin: "0 0 28px",
        maxWidth: 620
      }
    }, "Select the skills and interests that best describe your talent. This helps us match you with the right gigs."), /*#__PURE__*/React.createElement(Card, {
      padding: 32,
      style: {
        boxShadow: "var(--shadow-sm)"
      }
    }, /*#__PURE__*/React.createElement(Input, {
      label: "Search for a skill",
      placeholder: "e.g., Python, Video Editing, SEO\u2026",
      leading: /*#__PURE__*/React.createElement(Ico, {
        n: "search"
      })
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 24,
        display: "flex",
        flexDirection: "column",
        gap: 22
      }
    }, Object.entries(groups).map(([g, skills]) => /*#__PURE__*/React.createElement("div", {
      key: g
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: "var(--font-text)",
        fontSize: 12,
        fontWeight: 600,
        letterSpacing: "0.05em",
        textTransform: "uppercase",
        color: "var(--text-subtle)",
        marginBottom: 12
      }
    }, g), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        flexWrap: "wrap",
        gap: 10
      }
    }, skills.map(s => /*#__PURE__*/React.createElement(Chip, {
      key: s,
      label: s,
      on: !!picked[s],
      onClick: () => toggle(s)
    }))))))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: 24
      }
    }, /*#__PURE__*/React.createElement(Button, {
      variant: "outline",
      onClick: back
    }, "Back"), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 16
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: "var(--font-text)",
        fontSize: 14,
        color: "var(--text-subtle)"
      }
    }, "You can always update these later"), /*#__PURE__*/React.createElement(Button, {
      variant: "primary",
      onClick: next
    }, "Continue"))));
  }

  // ---- Step 3: Portfolio & Bio ----
  function StepPortfolio({
    next,
    back
  }) {
    const {
      Input,
      Button,
      Card
    } = C();
    const [bio, setBio] = React.useState("");
    const links = [["GitHub URL", "https://github.com/username", "code"], ["LinkedIn Profile", "https://linkedin.com/in/username", "linkedin"], ["Design Portfolio (Behance/Dribbble)", "https://behance.net/username", "palette"], ["Personal Website", "https://yourwebsite.com", "globe"]];
    return /*#__PURE__*/React.createElement("div", {
      style: {
        maxWidth: 880,
        margin: "40px auto"
      }
    }, /*#__PURE__*/React.createElement("h1", {
      style: {
        fontFamily: "var(--font-display)",
        fontWeight: 700,
        fontSize: 38,
        color: "var(--text-strong)",
        margin: "0 0 8px",
        letterSpacing: "-0.02em"
      }
    }, "Build Your Professional Identity"), /*#__PURE__*/React.createElement("p", {
      style: {
        fontFamily: "var(--font-text)",
        fontSize: 17,
        lineHeight: 1.5,
        color: "var(--text-muted)",
        margin: "0 0 28px",
        maxWidth: 640
      }
    }, "Showcase your best work and tell potential employers who you are. This information will appear on your public profile and job applications."), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "grid",
        gridTemplateColumns: "300px 1fr",
        gap: 20,
        marginBottom: 20
      }
    }, /*#__PURE__*/React.createElement(Card, {
      padding: 24
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: "var(--font-text)",
        fontWeight: 600,
        fontSize: 14,
        color: "var(--text-strong)",
        marginBottom: 14
      }
    }, "Profile Picture"), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 14
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 120,
        height: 120,
        borderRadius: "var(--radius-md)",
        background: "var(--surface-2)",
        border: "2px dashed var(--border-strong)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "var(--ink-400)"
      }
    }, /*#__PURE__*/React.createElement(Ico, {
      n: "camera",
      s: 28
    })), /*#__PURE__*/React.createElement(Button, {
      variant: "primary",
      size: "sm"
    }, "Upload Photo"), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: "var(--font-text)",
        fontSize: 12,
        color: "var(--text-subtle)"
      }
    }, "JPG, PNG or GIF. Max 2MB."))), /*#__PURE__*/React.createElement(Card, {
      padding: 24
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: "var(--font-text)",
        fontWeight: 600,
        fontSize: 14,
        color: "var(--text-strong)",
        marginBottom: 14
      }
    }, "Professional Bio"), /*#__PURE__*/React.createElement("textarea", {
      value: bio,
      onChange: e => setBio(e.target.value),
      placeholder: "Briefly describe your background, key skills, and what you're looking for in your next role\u2026",
      style: {
        width: "100%",
        minHeight: 150,
        resize: "vertical",
        fontFamily: "var(--font-text)",
        fontSize: 15,
        lineHeight: 1.6,
        color: "var(--text-strong)",
        border: "1px solid var(--border-default)",
        borderRadius: "var(--radius-sm)",
        padding: "12px 14px",
        outline: "none",
        boxSizing: "border-box"
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        justifyContent: "space-between",
        marginTop: 8,
        fontFamily: "var(--font-text)",
        fontSize: 13,
        color: "var(--text-subtle)"
      }
    }, /*#__PURE__*/React.createElement("span", null, "Minimum 50 characters"), /*#__PURE__*/React.createElement("span", null, bio.length, "/500")))), /*#__PURE__*/React.createElement(Card, {
      padding: 28,
      style: {
        marginBottom: 20
      }
    }, /*#__PURE__*/React.createElement("h3", {
      style: {
        fontFamily: "var(--font-display)",
        fontWeight: 700,
        fontSize: 20,
        color: "var(--text-strong)",
        margin: "0 0 18px"
      }
    }, "Social & Portfolio Links"), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "18px 24px"
      }
    }, links.map(([label, ph, icon]) => /*#__PURE__*/React.createElement(Input, {
      key: label,
      label: label,
      placeholder: ph,
      leading: /*#__PURE__*/React.createElement(Ico, {
        n: icon
      })
    })))), /*#__PURE__*/React.createElement(Card, {
      padding: 28,
      style: {
        marginBottom: 24
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: 16
      }
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
      style: {
        fontFamily: "var(--font-display)",
        fontWeight: 700,
        fontSize: 20,
        color: "var(--text-strong)",
        margin: "0 0 4px"
      }
    }, "Featured Project"), /*#__PURE__*/React.createElement("p", {
      style: {
        fontFamily: "var(--font-text)",
        fontSize: 14,
        color: "var(--text-muted)",
        margin: 0
      }
    }, "Add one project you're most proud of to stand out.")), /*#__PURE__*/React.createElement(Button, {
      variant: "secondary",
      size: "sm",
      iconLeft: /*#__PURE__*/React.createElement(Ico, {
        n: "plus",
        s: 16
      })
    }, "Add Project")), /*#__PURE__*/React.createElement("div", {
      style: {
        border: "2px dashed var(--border-strong)",
        borderRadius: "var(--radius-md)",
        padding: "40px 24px",
        textAlign: "center"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 48,
        height: 48,
        borderRadius: "var(--radius-sm)",
        background: "var(--surface-2)",
        color: "var(--ink-400)",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 12
      }
    }, /*#__PURE__*/React.createElement(Ico, {
      n: "folder",
      s: 22
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: "var(--font-display)",
        fontWeight: 700,
        fontSize: 18,
        color: "var(--text-strong)",
        marginBottom: 4
      }
    }, "No projects added yet"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: "var(--font-text)",
        fontSize: 14,
        color: "var(--text-muted)"
      }
    }, "Uploading a featured project increases your hiring chances by up to 40%."))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        justifyContent: "space-between"
      }
    }, /*#__PURE__*/React.createElement(Button, {
      variant: "outline",
      onClick: back
    }, "Back"), /*#__PURE__*/React.createElement(Button, {
      variant: "primary",
      onClick: next,
      iconRight: /*#__PURE__*/React.createElement(Ico, {
        n: "check",
        s: 18
      })
    }, "Finish Profile")));
  }

  // ---- Step 4: Profile Complete ----
  function StepComplete({
    restart
  }) {
    const {
      Button,
      Card,
      Avatar,
      Tag
    } = C();
    const confetti = React.useMemo(() => Array.from({
      length: 36
    }).map((_, i) => {
      const colors = ["var(--brand-700)", "var(--success-500)", "var(--info-500)", "var(--star)", "var(--brand-300)"];
      return {
        left: Math.random() * 100,
        delay: Math.random() * 0.6,
        dur: 1.6 + Math.random() * 1.4,
        color: colors[i % colors.length],
        size: 6 + Math.random() * 6,
        rot: Math.random() * 360
      };
    }), []);
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: "relative",
        maxWidth: 560,
        margin: "56px auto",
        textAlign: "center",
        overflow: "hidden"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: "absolute",
        inset: 0,
        top: -40,
        pointerEvents: "none",
        overflow: "hidden",
        height: 400
      }
    }, confetti.map((c, i) => /*#__PURE__*/React.createElement("span", {
      key: i,
      style: {
        position: "absolute",
        left: c.left + "%",
        top: -14,
        width: c.size,
        height: c.size,
        background: c.color,
        borderRadius: 1,
        transform: `rotate(${c.rot}deg)`,
        animation: `aav-fall ${c.dur}s var(--ease-standard) ${c.delay}s forwards`
      }
    }))), /*#__PURE__*/React.createElement("div", {
      style: {
        position: "relative"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 72,
        height: 72,
        borderRadius: "var(--radius-full)",
        background: "var(--success-100)",
        color: "var(--success-600)",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 20
      }
    }, /*#__PURE__*/React.createElement(Ico, {
      n: "check",
      s: 36
    })), /*#__PURE__*/React.createElement("h1", {
      style: {
        fontFamily: "var(--font-display)",
        fontWeight: 700,
        fontSize: 38,
        color: "var(--text-strong)",
        margin: "0 0 10px",
        letterSpacing: "-0.02em"
      }
    }, "You're all set!"), /*#__PURE__*/React.createElement("p", {
      style: {
        fontFamily: "var(--font-text)",
        fontSize: 17,
        lineHeight: 1.5,
        color: "var(--text-muted)",
        margin: "0 auto 28px",
        maxWidth: 420
      }
    }, "Your profile is now live and visible to recruiters. Welcome to the Aavasar ecosystem."), /*#__PURE__*/React.createElement(Card, {
      padding: 24,
      style: {
        textAlign: "left",
        marginBottom: 28
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 16
      }
    }, /*#__PURE__*/React.createElement(Avatar, {
      src: "../../assets/photos/peer-network.jpg",
      name: "Pratikshya Sharma",
      size: 56,
      shape: "squircle"
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 8
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: "var(--font-display)",
        fontWeight: 700,
        fontSize: 18,
        color: "var(--text-strong)",
        whiteSpace: "nowrap"
      }
    }, "Pratikshya Sharma"), /*#__PURE__*/React.createElement(Ico, {
      n: "badge-check",
      s: 16,
      style: {
        color: "var(--info-500)",
        flexShrink: 0
      }
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: "var(--font-text)",
        fontSize: 14,
        color: "var(--text-muted)",
        marginTop: 2
      }
    }, "B.S. Computer Science \xB7 Tribhuvan University"))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        gap: 8,
        marginTop: 14
      }
    }, /*#__PURE__*/React.createElement(Tag, {
      variant: "brand"
    }, "React"), /*#__PURE__*/React.createElement(Tag, {
      variant: "brand"
    }, "Python"), /*#__PURE__*/React.createElement(Tag, null, "UX Research"))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        flexDirection: "column",
        gap: 12
      }
    }, /*#__PURE__*/React.createElement(Button, {
      variant: "primary",
      size: "lg",
      full: true,
      iconRight: /*#__PURE__*/React.createElement(Ico, {
        n: "arrow-right",
        s: 18
      })
    }, "Find Your First Gig"), /*#__PURE__*/React.createElement(Button, {
      variant: "outline",
      size: "lg",
      full: true
    }, "View Public Profile")), /*#__PURE__*/React.createElement("p", {
      style: {
        fontFamily: "var(--font-text)",
        fontSize: 13,
        color: "var(--text-subtle)",
        marginTop: 20
      }
    }, "Need to change something? ", /*#__PURE__*/React.createElement("a", {
      href: "#",
      onClick: e => {
        e.preventDefault();
        restart();
      },
      style: {
        color: "var(--brand-700)",
        fontWeight: 600,
        textDecoration: "none"
      }
    }, "Restart the tour"), ".")));
  }
  function OnboardingFlow() {
    const [step, setStep] = React.useState(1);
    React.useEffect(() => {
      lucide.createIcons();
    });
    const go = n => {
      setStep(n);
      window.scrollTo({
        top: 0
      });
    };
    return /*#__PURE__*/React.createElement("div", {
      style: {
        minHeight: "100%",
        background: "var(--surface-page)"
      }
    }, /*#__PURE__*/React.createElement("style", null, `@keyframes aav-fall { to { transform: translateY(380px) rotate(540deg); opacity: 0; } }`), /*#__PURE__*/React.createElement(TopBar, {
      step: step
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        padding: "0 24px 64px"
      }
    }, step === 1 && /*#__PURE__*/React.createElement(StepBasic, {
      next: () => go(2)
    }), step === 2 && /*#__PURE__*/React.createElement(StepSkills, {
      next: () => go(3),
      back: () => go(1)
    }), step === 3 && /*#__PURE__*/React.createElement(StepPortfolio, {
      next: () => go(4),
      back: () => go(2)
    }), step === 4 && /*#__PURE__*/React.createElement(StepComplete, {
      restart: () => go(1)
    })));
  }
  window.OnboardingFlow = OnboardingFlow;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/onboarding/OnboardingFlow.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/LandingMain.jsx
try { (() => {
// Aavasar marketing — landing page sections. Registers <LandingMain> on window.
(function () {
  const C = () => window.AavasarDesignSystem_e30e7a;
  const wrap = {
    maxWidth: "var(--container-max)",
    margin: "0 auto",
    padding: "0 var(--container-pad)"
  };
  const Ico = ({
    n,
    s = 20,
    style
  }) => /*#__PURE__*/React.createElement("i", {
    "data-lucide": n,
    style: {
      width: s,
      height: s,
      ...style
    }
  });
  function Hero({
    onCta
  }) {
    const {
      Button,
      Tag
    } = C();
    return /*#__PURE__*/React.createElement("section", {
      style: {
        ...wrap,
        paddingTop: 56,
        paddingBottom: 24
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: "relative",
        borderRadius: "var(--radius-xl)",
        overflow: "hidden",
        minHeight: 340,
        display: "flex",
        alignItems: "center",
        background: "var(--brand-900)"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: "absolute",
        inset: 0,
        backgroundImage: "url(../../assets/photos/hero-a.png)",
        backgroundSize: "cover",
        backgroundPosition: "center"
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: "absolute",
        inset: 0,
        background: "linear-gradient(90deg, rgba(18,28,36,0.95) 0%, rgba(18,28,36,0.85) 48%, rgba(18,28,36,0.5) 78%, rgba(18,28,36,0.28) 100%)"
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: "relative",
        padding: "48px 56px",
        maxWidth: 620
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        display: "inline-block",
        fontFamily: "var(--font-text)",
        fontSize: 12,
        fontWeight: 600,
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        color: "var(--brand-200)",
        background: "rgba(255,255,255,0.12)",
        padding: "6px 12px",
        borderRadius: "var(--radius-full)",
        marginBottom: 20
      }
    }, "Empowering Student Careers"), /*#__PURE__*/React.createElement("h1", {
      style: {
        fontFamily: "var(--font-display)",
        fontWeight: 700,
        fontSize: 44,
        lineHeight: 1.1,
        letterSpacing: "-0.02em",
        color: "#fff",
        margin: "0 0 16px"
      }
    }, "Find your next gig and earn on your schedule"), /*#__PURE__*/React.createElement("p", {
      style: {
        fontFamily: "var(--font-text)",
        fontSize: 17,
        lineHeight: 1.55,
        color: "rgba(255,255,255,0.85)",
        margin: "0 0 28px",
        maxWidth: 480
      }
    }, "Join a community of 10,000+ students getting paid for their professional skills while they study. No long-term commitments, just great opportunities."), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        gap: 14
      }
    }, /*#__PURE__*/React.createElement(Button, {
      onDark: true,
      variant: "primary",
      size: "lg",
      onClick: onCta
    }, "Explore All Gigs"), /*#__PURE__*/React.createElement(Button, {
      onDark: true,
      variant: "outline",
      size: "lg",
      onClick: onCta
    }, "How It Works")))));
  }
  function StatsStrip() {
    const items = [{
      v: "10,000+",
      l: "Enrolled Students"
    }, {
      v: "500+",
      l: "Verified Businesses"
    }, {
      v: "4.9/5",
      l: "Average Rating",
      star: true
    }];
    return /*#__PURE__*/React.createElement("section", {
      style: {
        ...wrap,
        paddingBottom: 56
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        background: "var(--surface-2)",
        borderRadius: "var(--radius-lg)",
        padding: "28px 0"
      }
    }, items.map((it, i) => /*#__PURE__*/React.createElement("div", {
      key: it.l,
      style: {
        flex: 1,
        textAlign: "center",
        borderLeft: i ? "1px solid var(--border-default)" : "none"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: "var(--font-display)",
        fontWeight: 800,
        fontSize: 34,
        color: "var(--brand-700)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 6
      }
    }, it.v, it.star && /*#__PURE__*/React.createElement(Ico, {
      n: "star",
      s: 22,
      style: {
        color: "var(--star)",
        fill: "var(--star)"
      }
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: "var(--font-text)",
        fontSize: 14,
        color: "var(--text-muted)",
        marginTop: 4
      }
    }, it.l)))));
  }
  function HowItWorks() {
    const cols = [{
      icon: "graduation-cap",
      h: "For Students",
      steps: [["Create Your Profile", "Highlight your skills, portfolio, and education to stand out to employers."], ["Find Relevant Gigs", "Browse thousands of student-specific tasks and apply with one click."], ["Get Paid Securely", "Complete your tasks and receive payments directly to your account. No hidden fees."]]
    }, {
      icon: "building-2",
      h: "For Businesses",
      steps: [["Post a Task", "Define your project, set your budget, and post in minutes to reach top student talent."], ["Review Top Talent", "Filter through vetted applications and choose the best fit for your needs."], ["Scale Your Team", "Get quality work done efficiently while helping students build their portfolios."]]
    }];
    return /*#__PURE__*/React.createElement("section", {
      style: {
        ...wrap,
        paddingBottom: 64
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        textAlign: "center",
        marginBottom: 40
      }
    }, /*#__PURE__*/React.createElement("h2", {
      style: {
        fontFamily: "var(--font-display)",
        fontWeight: 700,
        fontSize: 34,
        letterSpacing: "-0.02em",
        color: "var(--text-strong)",
        margin: "0 0 10px"
      }
    }, "Seamless Experience for Everyone"), /*#__PURE__*/React.createElement("p", {
      style: {
        fontFamily: "var(--font-text)",
        fontSize: 16,
        color: "var(--text-muted)",
        margin: 0
      }
    }, "Whether you're looking to earn or looking to hire, Aavasar makes it simple, fast, and secure.")), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 64,
        maxWidth: 920,
        margin: "0 auto"
      }
    }, cols.map(col => /*#__PURE__*/React.createElement("div", {
      key: col.h
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 12,
        marginBottom: 24
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 40,
        height: 40,
        borderRadius: "var(--radius-sm)",
        background: "var(--brand-700)",
        color: "#fff",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center"
      }
    }, /*#__PURE__*/React.createElement(Ico, {
      n: col.icon
    })), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: "var(--font-display)",
        fontWeight: 700,
        fontSize: 22,
        color: "var(--text-strong)"
      }
    }, col.h)), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        flexDirection: "column",
        gap: 20
      }
    }, col.steps.map(([h, b], i) => /*#__PURE__*/React.createElement("div", {
      key: h,
      style: {
        display: "flex",
        gap: 16
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        flexShrink: 0,
        width: 28,
        height: 28,
        borderRadius: "var(--radius-full)",
        background: "var(--surface-2)",
        color: "var(--brand-700)",
        fontWeight: 700,
        fontSize: 13,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "var(--font-text)"
      }
    }, i + 1), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: "var(--font-text)",
        fontWeight: 700,
        fontSize: 16,
        color: "var(--text-strong)",
        marginBottom: 4
      }
    }, h), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: "var(--font-text)",
        fontSize: 14,
        lineHeight: 1.5,
        color: "var(--text-muted)"
      }
    }, b)))))))));
  }
  function FeaturedGigs({
    onCta
  }) {
    const {
      Card,
      Badge,
      Tag,
      Button
    } = C();
    return /*#__PURE__*/React.createElement("section", {
      style: {
        ...wrap,
        paddingBottom: 64
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-end",
        marginBottom: 20
      }
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", {
      style: {
        fontFamily: "var(--font-display)",
        fontWeight: 700,
        fontSize: 24,
        color: "var(--text-strong)",
        margin: "0 0 4px"
      }
    }, "Featured Gigs"), /*#__PURE__*/React.createElement("p", {
      style: {
        fontFamily: "var(--font-text)",
        fontSize: 14,
        color: "var(--text-muted)",
        margin: 0
      }
    }, "Log in to apply for these top-tier opportunities.")), /*#__PURE__*/React.createElement("a", {
      href: "#",
      onClick: e => {
        e.preventDefault();
        onCta && onCta();
      },
      style: {
        fontFamily: "var(--font-text)",
        fontSize: 14,
        fontWeight: 600,
        color: "var(--brand-700)",
        textDecoration: "none"
      }
    }, "View all \u2192")), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "grid",
        gridTemplateColumns: "1.6fr 1fr",
        gap: 16
      }
    }, /*#__PURE__*/React.createElement(Card, {
      padding: 0,
      style: {
        overflow: "hidden",
        display: "flex"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 220,
        flexShrink: 0,
        backgroundImage: "url(../../assets/photos/hero-b.png)",
        backgroundSize: "cover",
        backgroundPosition: "center"
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        padding: 24,
        flex: 1
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: 10
      }
    }, /*#__PURE__*/React.createElement(Badge, {
      tone: "premium",
      uppercase: true
    }, "Premium"), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: "var(--font-text)",
        fontWeight: 700,
        fontSize: 18,
        color: "var(--success-600)"
      }
    }, "\u0930\u094145/hr")), /*#__PURE__*/React.createElement("h3", {
      style: {
        fontFamily: "var(--font-display)",
        fontWeight: 700,
        fontSize: 20,
        color: "var(--text-strong)",
        margin: "0 0 8px"
      }
    }, "Lead UI Designer for EdTech MVP"), /*#__PURE__*/React.createElement("p", {
      style: {
        fontFamily: "var(--font-text)",
        fontSize: 15,
        lineHeight: 1.5,
        color: "var(--text-muted)",
        margin: "0 0 16px"
      }
    }, "Help us shape the future of learning by designing a cohesive, accessible, and vibrant mobile interface for K-12 students."), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        gap: 8,
        alignItems: "center"
      }
    }, /*#__PURE__*/React.createElement(Tag, null, "Remote"), /*#__PURE__*/React.createElement(Tag, null, "2 Weeks"), /*#__PURE__*/React.createElement("span", {
      style: {
        flex: 1
      }
    }), /*#__PURE__*/React.createElement(Button, {
      variant: "outline",
      size: "sm",
      onClick: onCta,
      iconLeft: /*#__PURE__*/React.createElement(Ico, {
        n: "lock",
        s: 15
      })
    }, "Log in to Apply")))), /*#__PURE__*/React.createElement(Card, {
      tone: "dark",
      radius: "xl",
      style: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between"
      }
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 44,
        height: 44,
        borderRadius: "var(--radius-sm)",
        background: "rgba(255,255,255,0.16)",
        color: "var(--brand-200)",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 16
      }
    }, /*#__PURE__*/React.createElement(Ico, {
      n: "graduation-cap",
      s: 22
    })), /*#__PURE__*/React.createElement("h3", {
      style: {
        fontFamily: "var(--font-display)",
        fontWeight: 700,
        fontSize: 22,
        color: "var(--brand-200)",
        margin: "0 0 12px"
      }
    }, "Advanced Calculus Tutor"), /*#__PURE__*/React.createElement("p", {
      style: {
        fontFamily: "var(--font-text)",
        fontSize: 15,
        lineHeight: 1.5,
        color: "var(--brand-200)",
        opacity: 0.85,
        margin: 0
      }
    }, "Tutoring for high-school senior preparing for AP exams. 3 hours per week at the City Library.")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: "var(--font-text)",
        fontWeight: 700,
        fontSize: 28,
        color: "var(--brand-200)",
        margin: "16px 0 12px"
      }
    }, "\u0930\u094135/hr"), /*#__PURE__*/React.createElement(Button, {
      onDark: true,
      variant: "primary",
      full: true,
      onClick: onCta
    }, "Sign Up to Apply")))));
  }
  function SuccessStories() {
    const {
      Card,
      Avatar
    } = C();
    const items = [{
      n: "Alex Rivera",
      r: "Design Student @ ArtInst",
      q: "Aavasar helped me land my first UI internship while still in university. The portfolio I built through small gigs was exactly what recruiters were looking for."
    }, {
      n: "Sarah Jenkins",
      r: "CS Major @ TechU",
      q: "I paid for my final semester purely through Python tutoring gigs I found here. The platform is so easy to use and the payments are always on time."
    }, {
      n: "Michael Cho",
      r: "Marketing Junior @ State",
      q: "Managing social media for local startups via Aavasar gave me real-world experience that no classroom could provide. It's been a game changer."
    }];
    return /*#__PURE__*/React.createElement("section", {
      style: {
        background: "var(--surface-1)",
        padding: "56px 0",
        borderTop: "1px solid var(--border-default)",
        borderBottom: "1px solid var(--border-default)"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        ...wrap
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        textAlign: "center",
        marginBottom: 36
      }
    }, /*#__PURE__*/React.createElement("h2", {
      style: {
        fontFamily: "var(--font-display)",
        fontWeight: 700,
        fontSize: 28,
        color: "var(--text-strong)",
        margin: "0 0 8px"
      }
    }, "Success Stories"), /*#__PURE__*/React.createElement("p", {
      style: {
        fontFamily: "var(--font-text)",
        fontSize: 15,
        color: "var(--text-muted)",
        margin: 0
      }
    }, "Hear from students who kickstarted their careers on Aavasar.")), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr",
        gap: 20
      }
    }, items.map(it => /*#__PURE__*/React.createElement(Card, {
      key: it.n,
      style: {
        display: "flex",
        flexDirection: "column",
        gap: 16
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 12
      }
    }, /*#__PURE__*/React.createElement(Avatar, {
      name: it.n,
      size: 44
    }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: "var(--font-text)",
        fontWeight: 700,
        fontSize: 15,
        color: "var(--text-strong)"
      }
    }, it.n), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: "var(--font-text)",
        fontSize: 13,
        color: "var(--text-subtle)"
      }
    }, it.r))), /*#__PURE__*/React.createElement("p", {
      style: {
        fontFamily: "var(--font-text)",
        fontSize: 14,
        lineHeight: 1.6,
        fontStyle: "italic",
        color: "var(--text-body)",
        margin: 0
      }
    }, "\"", it.q, "\""), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 6,
        color: "var(--success-600)",
        fontFamily: "var(--font-text)",
        fontSize: 13,
        fontWeight: 600
      }
    }, /*#__PURE__*/React.createElement(Ico, {
      n: "badge-check",
      s: 16
    }), " Verified Student"))))));
  }
  function RecentGigs({
    onCta
  }) {
    const {
      Card,
      Tag,
      Button
    } = C();
    const gigs = [{
      cat: "PHOTOGRAPHY",
      t: "Event Photographer",
      d: "Looking for a student photographer to cover a 4-hour campus event.",
      rate: "रु25/hr",
      tags: ["4 Hours", "On-site"],
      by: "Acme Events"
    }, {
      cat: "DATA ENTRY",
      t: "Catalog Data Entry",
      d: "Updating product descriptions for a local retail e-commerce store.",
      rate: "रु18/hr",
      tags: ["3 Days", "Remote"],
      by: "Urban Goods"
    }, {
      cat: "VIDEO EDITING",
      t: "Social Media Reels Editor",
      d: "Edit 5 vertical videos for TikTok and Instagram. Raw footage provided.",
      rate: "रु20/hr",
      tags: ["Project-based", "Remote"],
      by: "Creator Studio"
    }];
    return /*#__PURE__*/React.createElement("section", {
      style: {
        ...wrap,
        paddingTop: 64,
        paddingBottom: 48
      }
    }, /*#__PURE__*/React.createElement("h2", {
      style: {
        fontFamily: "var(--font-display)",
        fontWeight: 700,
        fontSize: 24,
        color: "var(--text-strong)",
        margin: "0 0 20px"
      }
    }, "Recently Added Gigs"), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr",
        gap: 20
      }
    }, gigs.map(g => /*#__PURE__*/React.createElement(Card, {
      key: g.t,
      style: {
        display: "flex",
        flexDirection: "column",
        gap: 12
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "baseline"
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: "var(--font-text)",
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: "0.05em",
        color: "var(--text-subtle)"
      }
    }, g.cat), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: "var(--font-text)",
        fontWeight: 700,
        fontSize: 16,
        color: "var(--success-600)"
      }
    }, g.rate)), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: "var(--font-display)",
        fontWeight: 700,
        fontSize: 17,
        color: "var(--text-strong)"
      }
    }, g.t), /*#__PURE__*/React.createElement("p", {
      style: {
        fontFamily: "var(--font-text)",
        fontSize: 14,
        lineHeight: 1.5,
        color: "var(--text-muted)",
        margin: 0,
        flex: 1
      }
    }, g.d), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        gap: 8
      }
    }, g.tags.map(t => /*#__PURE__*/React.createElement(Tag, {
      key: t
    }, t))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderTop: "1px solid var(--border-subtle)",
        paddingTop: 12
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: "var(--font-text)",
        fontSize: 13,
        color: "var(--text-subtle)"
      }
    }, "By ", g.by), /*#__PURE__*/React.createElement("a", {
      href: "#",
      onClick: e => {
        e.preventDefault();
        onCta && onCta();
      },
      style: {
        fontFamily: "var(--font-text)",
        fontSize: 14,
        fontWeight: 600,
        color: "var(--brand-700)",
        textDecoration: "none"
      }
    }, "Apply \u2192"))))), /*#__PURE__*/React.createElement("div", {
      style: {
        textAlign: "center",
        marginTop: 32
      }
    }, /*#__PURE__*/React.createElement(Button, {
      variant: "outline",
      onClick: onCta
    }, "See 50+ More Opportunities")));
  }
  function CtaBand({
    onCta
  }) {
    const {
      Button
    } = C();
    return /*#__PURE__*/React.createElement("section", {
      style: {
        ...wrap,
        paddingBottom: 72
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        borderRadius: "var(--radius-xl)",
        background: "linear-gradient(135deg, var(--brand-700), var(--brand-900))",
        padding: "56px 48px",
        textAlign: "center"
      }
    }, /*#__PURE__*/React.createElement("h2", {
      style: {
        fontFamily: "var(--font-display)",
        fontWeight: 700,
        fontSize: 34,
        color: "#fff",
        letterSpacing: "-0.02em",
        margin: "0 0 14px"
      }
    }, "Your Next Opportunity Starts Here"), /*#__PURE__*/React.createElement("p", {
      style: {
        fontFamily: "var(--font-text)",
        fontSize: 16,
        lineHeight: 1.6,
        color: "var(--brand-200)",
        margin: "0 auto 28px",
        maxWidth: 540
      }
    }, "Join thousands of students and companies building the future of work. Sign up today and browse your first gig in seconds."), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        gap: 14,
        justifyContent: "center"
      }
    }, /*#__PURE__*/React.createElement(Button, {
      onDark: true,
      variant: "primary",
      size: "lg",
      onClick: onCta
    }, "Sign Up Now"), /*#__PURE__*/React.createElement(Button, {
      onDark: true,
      variant: "secondary",
      size: "lg",
      onClick: onCta
    }, "Hire Talent"))));
  }
  function LandingMain({
    onCta
  }) {
    return /*#__PURE__*/React.createElement("main", null, /*#__PURE__*/React.createElement(Hero, {
      onCta: onCta
    }), /*#__PURE__*/React.createElement(StatsStrip, null), /*#__PURE__*/React.createElement(HowItWorks, null), /*#__PURE__*/React.createElement(FeaturedGigs, {
      onCta: onCta
    }), /*#__PURE__*/React.createElement(SuccessStories, null), /*#__PURE__*/React.createElement(RecentGigs, {
      onCta: onCta
    }), /*#__PURE__*/React.createElement(CtaBand, {
      onCta: onCta
    }));
  }
  window.LandingMain = LandingMain;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/LandingMain.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/SignUpScreen.jsx
try { (() => {
// Aavasar — Sign Up split screen (testimonial left, form right). Registers <SignUpScreen>.
function SignUpScreen({
  onClose
}) {
  const {
    Button,
    Input,
    SegmentedControl,
    Checkbox,
    Avatar
  } = window.AavasarDesignSystem_e30e7a;
  const [role, setRole] = React.useState("student");
  const [agree, setAgree] = React.useState(false);
  const Ico = ({
    n,
    s = 18,
    style
  }) => /*#__PURE__*/React.createElement("i", {
    "data-lucide": n,
    style: {
      width: s,
      height: s,
      ...style
    }
  });
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "fixed",
      inset: 0,
      zIndex: 50,
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      background: "var(--surface-page)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: "linear-gradient(160deg, var(--brand-600), var(--brand-800))",
      padding: "56px 64px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 32
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/aavasar-mark.png",
    alt: "",
    style: {
      width: 44,
      height: 44,
      background: "#fff",
      borderRadius: "50%"
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-display)",
      fontWeight: 700,
      fontSize: 34,
      color: "#fff"
    }
  }, "Aavasar")), /*#__PURE__*/React.createElement("div", {
    style: {
      background: "rgba(255,255,255,0.08)",
      borderRadius: "var(--radius-lg)",
      padding: 28,
      maxWidth: 360
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 4,
      marginBottom: 14,
      color: "var(--star)"
    }
  }, [0, 1, 2, 3, 4].map(i => /*#__PURE__*/React.createElement(Ico, {
    key: i,
    n: "star",
    s: 16,
    style: {
      fill: "var(--star)"
    }
  }))), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: "var(--font-text)",
      fontSize: 18,
      lineHeight: 1.6,
      fontStyle: "italic",
      color: "#fff",
      margin: "0 0 20px"
    }
  }, "\"Aavasar helped me land my first UX internship while still in my second year. The platform is incredibly intuitive and professional.\""), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    name: "Sarah Chen",
    size: 44
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-text)",
      fontWeight: 700,
      fontSize: 15,
      color: "#fff"
    }
  }, "Sarah Chen"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-text)",
      fontSize: 13,
      color: "var(--brand-200)"
    }
  }, "Product Design Student"))))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "56px 72px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      overflowY: "auto",
      position: "relative"
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    "aria-label": "Close",
    style: {
      position: "absolute",
      top: 24,
      right: 28,
      background: "none",
      border: "none",
      cursor: "pointer",
      color: "var(--ink-500)"
    }
  }, /*#__PURE__*/React.createElement(Ico, {
    n: "x",
    s: 24
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 420,
      width: "100%",
      margin: "0 auto",
      display: "flex",
      flexDirection: "column",
      gap: 20
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: "var(--font-display)",
      fontWeight: 700,
      fontSize: 34,
      color: "var(--text-strong)",
      margin: "0 0 6px"
    }
  }, "Create your account"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: "var(--font-text)",
      fontSize: 16,
      color: "var(--text-muted)",
      margin: 0
    }
  }, "Join the community and start your journey today.")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-text)",
      fontSize: 14,
      fontWeight: 600,
      color: "var(--text-strong)",
      marginBottom: 8
    }
  }, "I want to join as a:"), /*#__PURE__*/React.createElement(SegmentedControl, {
    value: role,
    onChange: setRole,
    options: [{
      value: "student",
      label: "Student",
      icon: /*#__PURE__*/React.createElement(Ico, {
        n: "graduation-cap"
      })
    }, {
      value: "recruiter",
      label: "Recruiter",
      icon: /*#__PURE__*/React.createElement(Ico, {
        n: "briefcase"
      })
    }]
  })), /*#__PURE__*/React.createElement(Input, {
    label: "Full Name",
    placeholder: "John Doe"
  }), /*#__PURE__*/React.createElement(Input, {
    label: role === "student" ? "Campus Email" : "Work Email",
    type: "email",
    placeholder: role === "student" ? "you@university.edu" : "you@company.com"
  }), /*#__PURE__*/React.createElement(Input, {
    label: "Password",
    passwordToggle: true,
    helper: "Must be at least 8 characters"
  }), /*#__PURE__*/React.createElement(Checkbox, {
    checked: agree,
    onChange: e => setAgree(e.target.checked),
    label: "I agree to the Terms of Service and Privacy Policy."
  }), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "lg",
    full: true,
    disabled: !agree,
    onClick: onClose
  }, "Create Account"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 12,
      color: "var(--text-subtle)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      height: 1,
      background: "var(--border-default)"
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-text)",
      fontSize: 11,
      fontWeight: 600,
      letterSpacing: "0.06em"
    }
  }, "OR CONTINUE WITH"), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      height: 1,
      background: "var(--border-default)"
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "outline",
    onClick: onClose
  }, "Google"), /*#__PURE__*/React.createElement(Button, {
    variant: "outline",
    onClick: onClose
  }, "LinkedIn")), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center",
      fontFamily: "var(--font-text)",
      fontSize: 14,
      color: "var(--text-muted)"
    }
  }, "Already have an account? ", /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: e => {
      e.preventDefault();
      onClose && onClose();
    },
    style: {
      color: "var(--brand-700)",
      fontWeight: 600,
      textDecoration: "none"
    }
  }, "Log in")))));
}
window.SignUpScreen = SignUpScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/SignUpScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/SiteFooter.jsx
try { (() => {
// Aavasar marketing — expanded footer. Registers <SiteFooter> on window.
function SiteFooter() {
  const cols = [{
    h: "Platform",
    items: ["Find Gigs", "Post a Job", "How We Work", "Success Stories", "Pricing"]
  }, {
    h: "Company",
    items: ["About Us", "Our Mission", "Careers", "Press & Media", "Contact Us"]
  }, {
    h: "Support",
    items: ["Help Center", "Safety Center", "Terms of Service", "Privacy Policy", "Cookie Settings"]
  }];
  return /*#__PURE__*/React.createElement("footer", {
    style: {
      background: "var(--surface-3)",
      borderTop: "1px solid var(--border-default)",
      padding: "64px 0 32px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: "var(--container-max)",
      margin: "0 auto",
      padding: "0 var(--container-pad)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1.4fr 1fr 1fr 1fr",
      gap: 48
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 24
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-display)",
      fontWeight: 700,
      fontSize: 24,
      color: "var(--brand-700)"
    }
  }, "Aavasar"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: "var(--font-text)",
      fontSize: 16,
      lineHeight: 1.6,
      color: "var(--text-body)",
      margin: 0,
      maxWidth: 280
    }
  }, "The premier marketplace for student talent. Connecting tomorrow's leaders with today's opportunities through professional gigs and projects."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 12
    }
  }, ["share-2", "at-sign", "globe"].map(n => /*#__PURE__*/React.createElement("span", {
    key: n,
    style: {
      width: 40,
      height: 40,
      borderRadius: "var(--radius-md)",
      background: "var(--surface-1)",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      color: "var(--ink-700)",
      border: "1px solid var(--border-default)"
    }
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": n,
    style: {
      width: 18,
      height: 18
    }
  }))))), cols.map(c => /*#__PURE__*/React.createElement("div", {
    key: c.h,
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-display)",
      fontWeight: 700,
      fontSize: 16,
      color: "var(--text-strong)"
    }
  }, c.h), c.items.map(i => /*#__PURE__*/React.createElement("a", {
    key: i,
    href: "#",
    style: {
      fontFamily: "var(--font-text)",
      fontSize: 15,
      color: "var(--text-muted)",
      textDecoration: "none"
    }
  }, i))))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      borderTop: "1px solid var(--border-default)",
      marginTop: 48,
      paddingTop: 32
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-text)",
      fontSize: 14,
      color: "var(--text-muted)"
    }
  }, "\xA9 2024 Aavasar Inc. All rights reserved."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 24
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-text)",
      fontSize: 14,
      color: "var(--text-muted)"
    }
  }, "English (US)"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-text)",
      fontSize: 14,
      color: "var(--text-muted)"
    }
  }, "NPR (\u0930\u0941)")))));
}
window.SiteFooter = SiteFooter;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/SiteFooter.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/SiteNav.jsx
try { (() => {
// Aavasar marketing — top navigation bar. Registers <SiteNav> on window.
function SiteNav({
  onCta
}) {
  const {
    Button,
    IconButton
  } = window.AavasarDesignSystem_e30e7a;
  const links = ["Find Gigs", "How It Works", "About", "Contact"];
  const [active, setActive] = React.useState("Find Gigs");
  return /*#__PURE__*/React.createElement("header", {
    style: {
      position: "sticky",
      top: 0,
      zIndex: 20,
      background: "var(--surface-0)",
      borderBottom: "1px solid var(--border-default)"
    }
  }, /*#__PURE__*/React.createElement("nav", {
    style: {
      maxWidth: "var(--container-max)",
      margin: "0 auto",
      height: "var(--nav-height)",
      padding: "0 var(--container-pad)",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 32
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: "#",
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      textDecoration: "none"
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/aavasar-mark.png",
    alt: "",
    style: {
      width: 32,
      height: 32
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-display)",
      fontWeight: 700,
      fontSize: 24,
      color: "var(--brand-700)",
      letterSpacing: "-0.01em"
    }
  }, "Aavasar")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 24
    }
  }, links.map(l => /*#__PURE__*/React.createElement("a", {
    key: l,
    href: "#",
    onClick: e => {
      e.preventDefault();
      setActive(l);
    },
    style: {
      fontFamily: "var(--font-text)",
      fontSize: 15,
      fontWeight: active === l ? 600 : 500,
      color: active === l ? "var(--brand-700)" : "var(--text-muted)",
      textDecoration: "none",
      padding: "6px 0",
      borderBottom: active === l ? "2px solid var(--brand-700)" : "2px solid transparent"
    }
  }, l)))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    size: "md",
    onClick: onCta
  }, "Log In"), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "md",
    onClick: onCta
  }, "Sign Up"), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 1,
      height: 24,
      background: "var(--border-strong)"
    }
  }), /*#__PURE__*/React.createElement(IconButton, {
    ariaLabel: "Help"
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "help-circle",
    style: {
      width: 20,
      height: 20
    }
  })))));
}
window.SiteNav = SiteNav;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/SiteNav.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Button = __ds_scope.Button;

__ds_ns.IconButton = __ds_scope.IconButton;

__ds_ns.Avatar = __ds_scope.Avatar;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.StatCard = __ds_scope.StatCard;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.ProgressBar = __ds_scope.ProgressBar;

__ds_ns.Tag = __ds_scope.Tag;

__ds_ns.Checkbox = __ds_scope.Checkbox;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.SegmentedControl = __ds_scope.SegmentedControl;

})();
