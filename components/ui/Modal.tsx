"use client";

// ─────────────────────────────────────────────
// Modal – accessible overlay wrapper
// Closes on backdrop click automatically.
// ─────────────────────────────────────────────

import { type ReactNode } from "react";

interface ModalProps {
  onClose: () => void;
  children: ReactNode;
  maxWidth?: number;
}

export function Modal({ onClose, children, maxWidth = 480 }: ModalProps) {
  return (
    <div
      style={{
        position:       "fixed",
        inset:          0,
        zIndex:         50,
        display:        "flex",
        alignItems:     "center",
        justifyContent: "center",
        padding:        16,
        background:     "rgba(0,0,0,0.5)",
        backdropFilter: "blur(6px)",
      }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="scale-in"
        style={{
          width:         "100%",
          maxWidth,
          background:    "var(--bg-card)",
          border:        "1px solid var(--border)",
          borderRadius:  16,
          boxShadow:     "var(--shadow-lg)",
          maxHeight:     "90vh",
          display:       "flex",
          flexDirection: "column",
          overflow:      "hidden",
        }}
      >
        {children}
      </div>
    </div>
  );
}

// ── Modal sub-sections ────────────────────────

interface ModalHeaderProps {
  title: string;
  subtitle?: string;
  onClose: () => void;
}

export function ModalHeader({ title, subtitle, onClose }: ModalHeaderProps) {
  return (
    <div style={{
      padding:         "20px 24px",
      borderBottom:    "1px solid var(--border)",
      display:         "flex",
      alignItems:      "center",
      justifyContent:  "space-between",
      flexShrink:      0,
    }}>
      <div>
        <h2 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text)", margin: 0 }}>
          {title}
        </h2>
        {subtitle && (
          <p style={{ fontSize: "0.75rem", color: "var(--text-3)", margin: "2px 0 0" }}>
            {subtitle}
          </p>
        )}
      </div>
      <button
        onClick={onClose}
        style={{
          width:          32,
          height:         32,
          borderRadius:   8,
          border:         "1px solid var(--border)",
          background:     "var(--bg-subtle)",
          color:          "var(--text-2)",
          cursor:         "pointer",
          display:        "flex",
          alignItems:     "center",
          justifyContent: "center",
          fontSize:       "1rem",
          lineHeight:     1,
          fontFamily:     "inherit",
        }}
      >
        ✕
      </button>
    </div>
  );
}

export function ModalBody({ children }: { children: ReactNode }) {
  return (
    <div style={{ padding: "20px 24px", overflowY: "auto", flex: 1 }}>
      {children}
    </div>
  );
}

export function ModalFooter({ children }: { children: ReactNode }) {
  return (
    <div style={{
      padding:      "16px 24px",
      borderTop:    "1px solid var(--border)",
      display:      "flex",
      gap:          10,
      flexShrink:   0,
    }}>
      {children}
    </div>
  );
}