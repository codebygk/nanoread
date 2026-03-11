"use client";

// ─────────────────────────────────────────────
// NoApiKeyBanner – shown when no API key is set
// ─────────────────────────────────────────────

import { SettingsIcon } from "@/components/icons";
import { FREE_TIER_LIMIT } from "@/lib/constants";

interface NoApiKeyBannerProps {
  freeUsed: number;          // how many free generations used so far
  onOpenSettings: () => void;
}

export function NoApiKeyBanner({ freeUsed, onOpenSettings }: NoApiKeyBannerProps) {
  const remaining = FREE_TIER_LIMIT - freeUsed;
  const limitHit  = remaining <= 0;

  return (
    <div
      className="fade-up-2"
      style={{
        display:      "flex",
        alignItems:   "flex-start",
        gap:          14,
        background:   "var(--bg-card)",
        border:       `1.5px solid ${limitHit ? "#ef4444" : "var(--accent)"}`,
        borderRadius: 12,
        padding:      "14px 18px",
        marginBottom: 20,
        boxShadow:    limitHit
          ? "0 2px 12px rgba(239,68,68,0.10)"
          : "0 2px 12px rgba(13,148,136,0.10)",
        transition: "border-color 0.2s, box-shadow 0.2s",
      }}
    >
      {/* Icon */}
      <div style={{
        flexShrink:     0,
        width:          36,
        height:         36,
        borderRadius:   10,
        background:     limitHit ? "rgba(239,68,68,0.10)" : "var(--accent-bg)",
        display:        "flex",
        alignItems:     "center",
        justifyContent: "center",
        fontSize:       "1.1rem",
      }}>
        {limitHit ? "🔒" : "✨"}
      </div>

      {/* Text */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {limitHit ? (
          <>
            <p style={{ fontSize: "0.88rem", fontWeight: 600, color: "var(--text)", margin: "0 0 3px" }}>
              Free limit reached
            </p>
            <p style={{ fontSize: "0.81rem", color: "var(--text-2)", margin: "0 0 10px", lineHeight: 1.55 }}>
              You've used all {FREE_TIER_LIMIT} free summaries. Add your own API key to keep going --
              Groq offers a generous free tier.
            </p>
          </>
        ) : (
          <>
            <p style={{ fontSize: "0.88rem", fontWeight: 600, color: "var(--text)", margin: "0 0 3px" }}>
              {remaining} free {remaining === 1 ? "summary" : "summaries"} remaining
            </p>
            <p style={{ fontSize: "0.81rem", color: "var(--text-2)", margin: "0 0 0", lineHeight: 1.55 }}>
              Add your own API key in Settings to get unlimited summaries.
            </p>
          </>
        )}

        <button
          onClick={onOpenSettings}
          style={{
            marginTop:    8,
            display:      "inline-flex",
            alignItems:   "center",
            gap:          6,
            padding:      "6px 14px",
            borderRadius: 8,
            border:       "none",
            background:   limitHit ? "#ef4444" : "var(--accent)",
            color:        "white",
            fontSize:     "0.81rem",
            fontWeight:   600,
            cursor:       "pointer",
            fontFamily:   "inherit",
            transition:   "opacity 0.15s",
          }}
          onMouseOver={e => (e.currentTarget.style.opacity = "0.85")}
          onMouseOut={e  => (e.currentTarget.style.opacity = "1")}
        >
          <SettingsIcon size={13} />
          {limitHit ? "Add API Key" : "Open Settings"}
        </button>
      </div>

      {/* Pills showing used/total */}
      {!limitHit && (
        <div style={{
          display:        "flex",
          flexShrink:     0,
          alignSelf:      "center",
          gap:            4,
        }}>
          {Array.from({ length: FREE_TIER_LIMIT }).map((_, i) => (
            <div
              key={i}
              style={{
                width:        10,
                height:       10,
                borderRadius: "50%",
                background:   i < freeUsed ? "var(--accent)" : "var(--border)",
                transition:   "background 0.2s",
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}