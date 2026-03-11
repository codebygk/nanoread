"use client";

// ─────────────────────────────────────────────
// NoApiKeyBanner – shown when no API key is set
// ─────────────────────────────────────────────

import { SettingsIcon } from "@/components/icons";

interface NoApiKeyBannerProps {
  onOpenSettings: () => void;
}

export function NoApiKeyBanner({ onOpenSettings }: NoApiKeyBannerProps) {
  return (
    <div
      className="fade-up-2"
      style={{
        display:      "flex",
        alignItems:   "flex-start",
        gap:          14,
        background:   "var(--bg-card)",
        border:       "1.5px solid #f59e0b",
        borderRadius: 12,
        padding:      "16px 20px",
        marginBottom: 20,
        boxShadow:    "0 2px 12px rgba(245,158,11,0.12)",
      }}
    >
      <div style={{
        flexShrink:     0,
        width:          36,
        height:         36,
        borderRadius:   10,
        background:     "rgba(245,158,11,0.12)",
        display:        "flex",
        alignItems:     "center",
        justifyContent: "center",
        fontSize:       "1.1rem",
      }}>
        🔑
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{
          fontSize:   "0.9rem",
          fontWeight: 600,
          color:      "var(--text)",
          margin:     "0 0 4px",
        }}>
          No API key configured
        </p>
        <p style={{
          fontSize:   "0.82rem",
          color:      "var(--text-2)",
          margin:     "0 0 10px",
          lineHeight: 1.55,
        }}>
          You need to add your own API key to use this tool. Supports OpenAI, Groq (free tier),
          Ollama (local &amp; free), OpenRouter, and more.
        </p>
        <button
          onClick={onOpenSettings}
          style={{
            display:      "inline-flex",
            alignItems:   "center",
            gap:          6,
            padding:      "7px 16px",
            borderRadius: 8,
            border:       "none",
            background:   "#f59e0b",
            color:        "white",
            fontSize:     "0.82rem",
            fontWeight:   600,
            cursor:       "pointer",
            fontFamily:   "inherit",
            transition:   "opacity 0.15s",
          }}
          onMouseOver={e => (e.currentTarget.style.opacity = "0.85")}
          onMouseOut={e  => (e.currentTarget.style.opacity = "1")}
        >
          <SettingsIcon size={13} />
          Open Settings
        </button>
      </div>
    </div>
  );
}