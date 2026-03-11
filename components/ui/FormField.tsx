"use client";

// ─────────────────────────────────────────────
// FormField – label + input wrapper with consistent styling
// ─────────────────────────────────────────────

import { type ReactNode, type CSSProperties } from "react";

interface FormFieldProps {
  label: string;
  hint?: string;
  action?: ReactNode;
  children: ReactNode;
}

const LABEL_STYLE: CSSProperties = {
  fontSize:      "0.75rem",
  fontWeight:    600,
  color:         "var(--text-2)",
  textTransform: "uppercase",
  letterSpacing: "0.06em",
};

const HINT_STYLE: CSSProperties = {
  fontSize:  "0.72rem",
  color:     "var(--text-3)",
  marginTop: 5,
};

export function FormField({ label, hint, action, children }: FormFieldProps) {
  return (
    <div>
      <div style={{
        display:        "flex",
        justifyContent: "space-between",
        alignItems:     "center",
        marginBottom:   6,
      }}>
        <label style={LABEL_STYLE}>{label}</label>
        {action}
      </div>
      {children}
      {hint && <p style={HINT_STYLE}>{hint}</p>}
    </div>
  );
}

// ── Shared input style (export for inline use) ─
export const INPUT_STYLE: CSSProperties = {
  width:        "100%",
  padding:      "9px 12px",
  border:       "1px solid var(--border)",
  borderRadius: 8,
  outline:      "none",
  background:   "var(--bg-subtle)",
  color:        "var(--text)",
  fontSize:     "0.875rem",
  fontFamily:   "JetBrains Mono, monospace",
  transition:   "border-color 0.15s",
};

export function handleFocus(e: React.FocusEvent<HTMLInputElement>) {
  e.target.style.borderColor = "var(--accent)";
}

export function handleBlur(e: React.FocusEvent<HTMLInputElement>) {
  e.target.style.borderColor = "var(--border)";
}