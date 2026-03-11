"use client";

import { HistoryItem } from "@/app/page";

interface Props {
  history: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
  onClear: () => void;
  onClose: () => void;
}

function timeAgo(ts: number) {
  const mins = Math.floor((Date.now() - ts) / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return new Date(ts).toLocaleDateString();
}

export default function HistoryPanel({ history, onSelect, onClear, onClose }: Props) {
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 50,
      display: "flex", alignItems: "center", justifyContent: "center", padding: 16,
      background: "rgba(0,0,0,0.5)", backdropFilter: "blur(6px)",
    }} onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="scale-in" style={{
        width: "100%", maxWidth: 720,
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
        borderRadius: 16,
        boxShadow: "var(--shadow-lg)",
        maxHeight: "85vh",
        display: "flex", flexDirection: "column",
        overflow: "hidden",
      }}>
        {/* Header */}
        <div style={{
          padding: "20px 24px",
          borderBottom: "1px solid var(--border)",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          flexShrink: 0,
        }}>
          <div>
            <h2 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text)", margin: 0 }}>History</h2>
            <p style={{ fontSize: "0.75rem", color: "var(--text-3)", margin: "2px 0 0" }}>{history.length} saved summaries</p>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {history.length > 0 && (
              <button onClick={onClear} style={{
                padding: "6px 12px", borderRadius: 7,
                border: "1px solid var(--border)",
                background: "var(--bg-subtle)",
                color: "var(--text-3)",
                fontSize: "0.78rem", fontWeight: 500,
                cursor: "pointer", fontFamily: "inherit",
              }}>Clear all</button>
            )}
            <button onClick={onClose} style={{
              width: 32, height: 32, borderRadius: 8,
              border: "1px solid var(--border)",
              background: "var(--bg-subtle)",
              color: "var(--text-2)",
              cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "1rem",
              fontFamily: "inherit",
            }}>✕</button>
          </div>
        </div>

        {/* List */}
        <div style={{ overflowY: "auto", flex: 1, padding: "12px" }}>
          {history.length === 0 ? (
            <div style={{ textAlign: "center", padding: "48px 24px" }}>
              <div style={{ fontSize: "2.5rem", marginBottom: 12 }}>📋</div>
              <p style={{ color: "var(--text-3)", fontSize: "0.875rem" }}>No history yet. Summarize a page to see it here.</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {history.map(item => (
                <button key={item.id} onClick={() => onSelect(item)} style={{
                  width: "100%", textAlign: "left",
                  padding: "14px 16px", borderRadius: 10,
                  border: "1px solid var(--border)",
                  background: "var(--bg-subtle)",
                  cursor: "pointer", transition: "all 0.15s",
                  fontFamily: "inherit",
                  display: "block",
                }}
                  onMouseOver={e => {
                    e.currentTarget.style.borderColor = "var(--accent)";
                    e.currentTarget.style.background = "var(--accent-bg)";
                  }}
                  onMouseOut={e => {
                    e.currentTarget.style.borderColor = "var(--border)";
                    e.currentTarget.style.background = "var(--bg-subtle)";
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <p style={{ fontWeight: 600, fontSize: "0.875rem", color: "var(--text)", margin: "0 0 3px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {item.title}
                      </p>
                      <p style={{ fontSize: "0.75rem", color: "var(--text-3)", margin: 0, fontFamily: "Geist Mono, monospace", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {item.url}
                      </p>
                    </div>
                    <div style={{ flexShrink: 0, textAlign: "right", display: "flex", flexDirection: "column", gap: 4, alignItems: "flex-end" }}>
                      <span style={{
                        background: "var(--accent-bg)", color: "var(--accent)",
                        fontSize: "0.7rem", fontWeight: 500,
                        padding: "2px 8px", borderRadius: 10,
                        fontFamily: "Geist Mono, monospace",
                        whiteSpace: "nowrap",
                        maxWidth: 240, overflow: "hidden", textOverflow: "ellipsis",
                      }}>{item.model}</span>
                      <span style={{ fontSize: "0.7rem", color: "var(--text-3)" }}>{timeAgo(item.timestamp)}</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}