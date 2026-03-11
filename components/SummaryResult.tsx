"use client";

// ─────────────────────────────────────────────
// SummaryResult – displays a completed summary
// ─────────────────────────────────────────────

import { marked }                           from "marked";
import { CopyIcon, CheckIcon, ExternalLinkIcon } from "@/components/icons";
import { truncateUrl }                      from "@/lib/utils";
import type { SummarizeResult }             from "@/types";

interface SummaryResultProps {
  result:  SummarizeResult;
  copied:  boolean;
  onCopy:  () => void;
  onReset: () => void;
}

export function SummaryResult({ result, copied, onCopy, onReset }: SummaryResultProps) {
  return (
    <div className="scale-in">
      {/* ── Result card ── */}
      <div style={{
        background:   "var(--bg-card)",
        border:       "1px solid var(--border)",
        borderRadius: 16,
        overflow:     "hidden",
        boxShadow:    "var(--shadow-md)",
      }}>
        <ResultHeader result={result} copied={copied} onCopy={onCopy} />

        <div style={{ padding: "24px" }}>
          <div
            className="prose"
            dangerouslySetInnerHTML={{ __html: marked.parse(result.summary) as string }}
          />
        </div>
      </div>

      {/* ── Reset CTA ── */}
      <div style={{ textAlign: "center", marginTop: 20 }}>
        <button
          onClick={onReset}
          style={{
            display:    "inline-flex",
            alignItems: "center",
            gap:        6,
            color:      "var(--text-3)",
            fontSize:   "0.85rem",
            background: "none",
            border:     "none",
            cursor:     "pointer",
            fontFamily: "inherit",
            padding:    0,
            transition: "color 0.15s",
          }}
          onMouseOver={e => (e.currentTarget.style.color = "var(--accent)")}
          onMouseOut={e  => (e.currentTarget.style.color = "var(--text-3)")}
        >
          ← Summarize another page
        </button>
      </div>
    </div>
  );
}

// ── Sub-components ────────────────────────────

interface ResultHeaderProps {
  result: SummarizeResult;
  copied: boolean;
  onCopy: () => void;
}

function ResultHeader({ result, copied, onCopy }: ResultHeaderProps) {
  return (
    <div style={{
      padding:        "18px 24px",
      borderBottom:   "1px solid var(--border)",
      background:     "var(--bg-subtle)",
      display:        "flex",
      alignItems:     "flex-start",
      justifyContent: "space-between",
      gap:            16,
    }}>
      {/* Title + URL */}
      <div style={{ minWidth: 0, flex: 1 }}>
        <h2 style={{
          fontSize:     "1rem",
          fontWeight:   600,
          color:        "var(--text)",
          lineHeight:   1.4,
          marginBottom: 4,
          overflow:     "hidden",
          textOverflow: "ellipsis",
          whiteSpace:   "nowrap",
        }}>
          {result.title}
        </h2>
        <a
          href={result.url}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display:      "inline-flex",
            alignItems:   "center",
            gap:          4,
            color:        "var(--text-3)",
            fontSize:     "0.75rem",
            textDecoration: "none",
            fontFamily:   "JetBrains Mono, monospace",
            overflow:     "hidden",
            textOverflow: "ellipsis",
            whiteSpace:   "nowrap",
            maxWidth:     "100%",
          }}
        >
          {truncateUrl(result.url)}
          <ExternalLinkIcon />
        </a>
      </div>

      {/* Copy button */}
      <button
        onClick={onCopy}
        style={{
          display:      "inline-flex",
          alignItems:   "center",
          gap:          6,
          padding:      "7px 14px",
          borderRadius: 8,
          border:       "1px solid var(--border)",
          background:   copied ? "var(--accent)" : "var(--bg-card)",
          color:        copied ? "white"          : "var(--text-2)",
          fontSize:     "0.8rem",
          fontWeight:   500,
          cursor:       "pointer",
          transition:   "all 0.15s",
          fontFamily:   "inherit",
          flexShrink:   0,
        }}
      >
        {copied
          ? <><CheckIcon /> Copied!</>
          : <><CopyIcon />  Copy</>
        }
      </button>
    </div>
  );
}