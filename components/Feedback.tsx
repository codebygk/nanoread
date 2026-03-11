"use client";

// ─────────────────────────────────────────────
// LoadingSkeleton – shimmer placeholder while
//                   the summary is being fetched
// ─────────────────────────────────────────────

const SKELETON_WIDTHS = [80, 95, 70, 85, 60] as const;

export function LoadingSkeleton() {
  return (
    <div
      className="scale-in"
      style={{
        background:   "var(--bg-card)",
        border:       "1px solid var(--border)",
        borderRadius: 16,
        overflow:     "hidden",
        boxShadow:    "var(--shadow)",
      }}
    >
      <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--border)" }}>
        <div className="skeleton" style={{ height: 20, width: "60%", marginBottom: 10 }} />
        <div className="skeleton" style={{ height: 14, width: "40%" }} />
      </div>
      <div style={{ padding: "24px" }}>
        {SKELETON_WIDTHS.map((width, i) => (
          <div
            key={i}
            className="skeleton"
            style={{ height: 14, width: `${width}%`, marginBottom: 10 }}
          />
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// ErrorAlert – inline error with optional CTA
// ─────────────────────────────────────────────

interface ErrorAlertProps {
  message:        string;
  onOpenSettings: () => void;
}

export function ErrorAlert({ message, onOpenSettings }: ErrorAlertProps) {
  const isKeyError = message.toLowerCase().includes("key");

  return (
    <div
      className="scale-in"
      style={{
        background:   "var(--error-bg)",
        border:       "1px solid var(--error-border)",
        borderRadius: 12,
        padding:      "14px 16px",
        display:      "flex",
        alignItems:   "flex-start",
        gap:          12,
        marginBottom: 24,
      }}
    >
      <span style={{ fontSize: "1rem", flexShrink: 0, marginTop: 1 }}>⚠️</span>
      <div>
        <p style={{
          color:      "var(--error-text)",
          fontSize:   "0.875rem",
          fontWeight: 500,
          lineHeight: 1.5,
        }}>
          {message}
        </p>
        {isKeyError && (
          <button
            onClick={onOpenSettings}
            style={{
              color:      "var(--accent)",
              fontSize:   "0.8rem",
              marginTop:  6,
              background: "none",
              border:     "none",
              cursor:     "pointer",
              fontFamily: "inherit",
              padding:    0,
              fontWeight: 600,
            }}
          >
            Open Settings →
          </button>
        )}
      </div>
    </div>
  );
}