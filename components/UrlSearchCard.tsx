"use client";

// ─────────────────────────────────────────────
// UrlSearchCard – URL input form, status row,
//                 and example quick-links
// ─────────────────────────────────────────────

import { type RefObject } from "react";
import { CheckIcon, LinkIcon } from "@/components/icons";
import { EXAMPLE_URLS }        from "@/lib/constants";
import { getEndpointLabel }    from "@/lib/utils";
import type { Settings }       from "@/types";

interface UrlSearchCardProps {
  url:         string;
  loading:     boolean;
  settings:    Settings;
  inputRef:    RefObject<HTMLInputElement | null>;
  onChange:    (url: string) => void;
  onSubmit:    (e: React.FormEvent | null, overrideUrl?: string) => void;
  disabled?:   boolean;
}

export function UrlSearchCard({
  url,
  loading,
  settings,
  inputRef,
  onChange,
  onSubmit,
  disabled = false,
}: UrlSearchCardProps) {
  const isValidUrl = (raw: string): boolean => {
    const trimmed = raw.trim();
    if (!trimmed) return false;
    try {
      const withScheme = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
      const parsed = new URL(withScheme);
      return parsed.hostname.includes(".");
    } catch {
      return false;
    }
  };

  const isDisabled    = loading || !isValidUrl(url) || disabled;
  const endpointLabel = getEndpointLabel(settings.baseUrl);

  return (
    <>
      <div className="fade-up-2" style={{
        background:   "var(--bg-card)",
        border:       "1px solid var(--border)",
        borderRadius: 16,
        padding:      20,
        boxShadow:    "var(--shadow-md)",
        marginBottom: 20,
      }}>
        {/* -- URL input row -- */}
        <form onSubmit={onSubmit}>
          {/* Desktop: input + button inline. Mobile: stacked */}
          <div className="url-input-row"
            onFocusCapture={e => (e.currentTarget.style.borderColor = "var(--accent)")}
            onBlurCapture={e  => (e.currentTarget.style.borderColor = "var(--border)")}
          >
            <span style={{ flexShrink: 0, color: "var(--text-3)", display: "flex" }}>
              <LinkIcon size={16} />
            </span>

            <input
              ref={inputRef}
              type="url"
              inputMode="url"
              value={url}
              onChange={e => onChange(e.target.value)}
              placeholder="Paste a URL to summarize..."
              disabled={loading}
              style={{
                flex:       1,
                background: "transparent",
                border:     "none",
                outline:    "none",
                color:      "var(--text)",
                fontSize:   "0.9375rem",
                fontFamily: "inherit",
                padding:    "8px 0",
                minWidth:   0,
              }}
            />

            <SubmitButton loading={loading} disabled={isDisabled} />
          </div>
        </form>

        {/* -- Status row -- */}
        <StatusRow
          endpointLabel={endpointLabel}
          model={settings.model}
          hasApiKey={!!settings.apiKey}
        />
      </div>

      <style>{`
        .url-input-row {
          display:       flex;
          align-items:   center;
          gap:           10px;
          background:    var(--bg-subtle);
          border:        1.5px solid var(--border);
          border-radius: 10px;
          padding:       4px 4px 4px 14px;
          transition:    border-color 0.15s;
        }

        @media (max-width: 480px) {
          .url-input-row {
            flex-wrap:  wrap;
            padding:    10px 12px;
            gap:        8px;
          }
          .url-input-row input {
            width: 100%;
            flex:  1 1 100%;
          }
          .url-submit-btn {
            width:           100% !important;
            justify-content: center;
          }
        }
      `}</style>
    </>
  );
}

// -- Sub-components ----------------------------

interface SubmitButtonProps {
  loading:  boolean;
  disabled: boolean;
}

function SubmitButton({ loading, disabled }: SubmitButtonProps) {
  return (
    <button
      type="submit"
      disabled={disabled}
      className="url-submit-btn"
      style={{
        background:   disabled ? "var(--border)" : "var(--accent)",
        color:        disabled ? "var(--text-3)" : "white",
        border:       "none",
        borderRadius: 7,
        padding:      "9px 20px",
        fontSize:     "0.875rem",
        fontWeight:   600,
        cursor:       disabled ? "not-allowed" : "pointer",
        display:      "flex",
        alignItems:   "center",
        gap:          7,
        transition:   "all 0.15s",
        flexShrink:   0,
        fontFamily:   "inherit",
        whiteSpace:   "nowrap",
      }}
    >
      {loading
        ? <><span className="spinner" /> Summarizing...</>
        : "Summarize"
      }
    </button>
  );
}

interface StatusRowProps {
  endpointLabel: string;
  model:         string;
  hasApiKey:     boolean;
}

function StatusRow({ endpointLabel, model, hasApiKey }: StatusRowProps) {
  // Truncate model name on small screens
  const shortModel = model.length > 20 ? model.slice(0, 18) + "..." : model;

  return (
    <div style={{
      display:        "flex",
      alignItems:     "center",
      justifyContent: "space-between",
      marginTop:      12,
      flexWrap:       "wrap",
      gap:            6,
    }}>
      <span style={{
        display:      "inline-flex",
        alignItems:   "center",
        gap:          5,
        background:   "var(--accent-bg)",
        color:        "var(--accent)",
        fontSize:     "0.75rem",
        fontWeight:   500,
        padding:      "3px 10px",
        borderRadius: 20,
        maxWidth:     "80%",
        overflow:     "hidden",
        textOverflow: "ellipsis",
        whiteSpace:   "nowrap",
      }}>
        <span style={{
          width:        6,
          height:       6,
          borderRadius: "50%",
          background:   "var(--accent)",
          display:      "inline-block",
          flexShrink:   0,
        }} />
        {endpointLabel} - {shortModel}
      </span>

      <span style={{
        fontSize:   "0.75rem",
        color:      hasApiKey ? "var(--success)" : "var(--accent)",
        display:    "flex",
        alignItems: "center",
        gap:        4,
        fontWeight: 500,
        flexShrink: 0,
      }}>
        {hasApiKey
          ? <><CheckIcon /> User API Key</>
          : <><CheckIcon /> Free API Key</>
        }
      </span>
    </div>
  );
}

// -- Example chips -----------------------------

interface ExampleChipsProps {
  onSelect: (url: string) => void;
}

export function ExampleChips({ onSelect }: ExampleChipsProps) {
  return (
    <div className="fade-up-3" style={{
      display:        "flex",
      alignItems:     "center",
      gap:            8,
      flexWrap:       "wrap",
      justifyContent: "center",
      marginBottom:   32,
    }}>
      <span style={{ fontSize: "0.75rem", color: "var(--text-3)", fontWeight: 500 }}>
        Try:
      </span>
      {EXAMPLE_URLS.map(ex => (
        <button
          key={ex.url}
          onClick={() => onSelect(ex.url)}
          style={{
            display:      "inline-flex",
            alignItems:   "center",
            gap:          5,
            padding:      "5px 12px",
            borderRadius: 20,
            border:       "1px solid var(--border)",
            background:   "var(--bg-card)",
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
          {ex.label}
        </button>
      ))}
    </div>
  );
}