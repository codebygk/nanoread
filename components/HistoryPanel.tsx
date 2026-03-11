"use client";

// ─────────────────────────────────────────────
// HistoryPanel – recent summaries list modal
// ─────────────────────────────────────────────

import { Modal }            from "@/components/ui/Modal";
import { timeAgo }          from "@/lib/utils";
import type { HistoryItem } from "@/types";

interface HistoryPanelProps {
  history:  HistoryItem[];
  onSelect: (item: HistoryItem) => void;
  onClear:  () => void;
  onClose:  () => void;
}

export default function HistoryPanel({
  history,
  onSelect,
  onClear,
  onClose,
}: HistoryPanelProps) {
  return (
    <Modal onClose={onClose} maxWidth={520}>
      {/* -- Header -- */}
      <div style={{
        padding:        "20px 24px",
        borderBottom:   "1px solid var(--border)",
        display:        "flex",
        alignItems:     "center",
        justifyContent: "space-between",
        flexShrink:     0,
      }}>
        <div>
          <h2 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text)", margin: 0 }}>
            History
          </h2>
          <p style={{ fontSize: "0.75rem", color: "var(--text-3)", margin: "2px 0 0" }}>
            {history.length} saved {history.length === 1 ? "summary" : "summaries"}
          </p>
        </div>

        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {history.length > 0 && (
            <button
              onClick={onClear}
              style={{
                padding:      "6px 12px",
                borderRadius: 7,
                border:       "1px solid var(--border)",
                background:   "var(--bg-subtle)",
                color:        "var(--text-3)",
                fontSize:     "0.78rem",
                fontWeight:   500,
                cursor:       "pointer",
                fontFamily:   "inherit",
                transition:   "all 0.15s",
              }}
              onMouseOver={e => (e.currentTarget.style.color = "#ef4444")}
              onMouseOut={e  => (e.currentTarget.style.color = "var(--text-3)")}
            >
              Clear all
            </button>
          )}
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
              fontFamily:     "inherit",
            }}
          >
            x
          </button>
        </div>
      </div>

      {/* -- List -- */}
      <div style={{ overflowY: "auto", flex: 1, padding: "12px" }}>
        {history.length === 0
          ? <EmptyState />
          : (
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {history.map(item => (
                <HistoryCard key={item.id} item={item} onSelect={onSelect} />
              ))}
            </div>
          )
        }
      </div>
    </Modal>
  );
}

// -- Sub-components ----------------------------

function EmptyState() {
  return (
    <div style={{ textAlign: "center", padding: "48px 24px" }}>
      <div style={{ fontSize: "2.5rem", marginBottom: 12 }}>📋</div>
      <p style={{ color: "var(--text-3)", fontSize: "0.875rem" }}>
        No history yet. Summarize a page to see it here.
      </p>
    </div>
  );
}

interface HistoryCardProps {
  item:     HistoryItem;
  onSelect: (item: HistoryItem) => void;
}

function HistoryCard({ item, onSelect }: HistoryCardProps) {
  return (
    <button
      onClick={() => onSelect(item)}
      style={{
        width:        "100%",
        textAlign:    "left",
        padding:      "14px 16px",
        borderRadius: 10,
        border:       "1px solid var(--border)",
        background:   "var(--bg-subtle)",
        cursor:       "pointer",
        transition:   "all 0.15s",
        fontFamily:   "inherit",
        display:      "block",
      }}
      onMouseOver={e => {
        e.currentTarget.style.borderColor = "var(--accent)";
        e.currentTarget.style.background  = "var(--accent-bg)";
      }}
      onMouseOut={e => {
        e.currentTarget.style.borderColor = "var(--border)";
        e.currentTarget.style.background  = "var(--bg-subtle)";
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
        <div style={{ minWidth: 0, flex: 1 }}>
          <p style={{
            fontWeight:   600,
            fontSize:     "0.875rem",
            color:        "var(--text)",
            margin:       "0 0 3px",
            overflow:     "hidden",
            textOverflow: "ellipsis",
            whiteSpace:   "nowrap",
          }}>
            {item.title}
          </p>
          <p style={{
            fontSize:     "0.75rem",
            color:        "var(--text-3)",
            margin:       0,
            fontFamily:   "JetBrains Mono, monospace",
            overflow:     "hidden",
            textOverflow: "ellipsis",
            whiteSpace:   "nowrap",
          }}>
            {item.url}
          </p>
        </div>

        <div style={{
          flexShrink:    0,
          textAlign:     "right",
          display:       "flex",
          flexDirection: "column",
          gap:           4,
          alignItems:    "flex-end",
        }}>
          <span style={{
            background:   "var(--accent-bg)",
            color:        "var(--accent)",
            fontSize:     "0.7rem",
            fontWeight:   500,
            padding:      "2px 8px",
            borderRadius: 10,
            fontFamily:   "JetBrains Mono, monospace",
            whiteSpace:   "nowrap",
            maxWidth:     120,
            overflow:     "hidden",
            textOverflow: "ellipsis",
          }}>
            {item.model}
          </span>
          <span style={{ fontSize: "0.7rem", color: "var(--text-3)" }}>
            {timeAgo(item.timestamp)}
          </span>
        </div>
      </div>
    </button>
  );
}