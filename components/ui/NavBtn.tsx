"use client";

// ─────────────────────────────────────────────
// NavBtn – small pill button used in the nav bar
// ─────────────────────────────────────────────

import { type ReactNode } from "react";

interface NavBtnProps {
  onClick: () => void;
  children: ReactNode;
}

export function NavBtn({ onClick, children }: NavBtnProps) {
  return (
    <button
      onClick={onClick}
      style={{
        display:     "inline-flex",
        alignItems:  "center",
        gap:         6,
        padding:     "7px 12px",
        borderRadius: 8,
        border:       "1px solid var(--border)",
        background:   "var(--bg-subtle)",
        color:        "var(--text-2)",
        fontSize:     "0.8rem",
        fontWeight:   500,
        cursor:       "pointer",
        transition:   "all 0.15s",
        fontFamily:   "inherit",
      }}
      onMouseOver={e => {
        e.currentTarget.style.borderColor = "var(--accent)";
        e.currentTarget.style.color       = "var(--accent)";
      }}
      onMouseOut={e => {
        e.currentTarget.style.borderColor = "var(--border)";
        e.currentTarget.style.color       = "var(--text-2)";
      }}
    >
      {children}
    </button>
  );
}