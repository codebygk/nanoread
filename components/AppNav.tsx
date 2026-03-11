"use client";

// ─────────────────────────────────────────────
// AppNav – sticky top navigation bar
// ─────────────────────────────────────────────

import { NavBtn }       from "@/components/ui/NavBtn";
import { FileTextIcon, HistoryIcon, SettingsIcon, SunIcon, MoonIcon } from "@/components/icons";
import Image from "next/image";

interface AppNavProps {
  historyCount:    number;
  hasApiKey:       boolean;
  dark:            boolean;
  onOpenHistory:   () => void;
  onOpenSettings:  () => void;
  onToggleTheme:   () => void;
}

export function AppNav({
  historyCount,
  hasApiKey,
  dark,
  onOpenHistory,
  onOpenSettings,
  onToggleTheme,
}: AppNavProps) {
  return (
    <nav
      className="fade-up"
      style={{
        position:       "sticky",
        top:            0,
        zIndex:         40,
        background:     "var(--bg)",
        borderBottom:   "1px solid var(--border)",
        backdropFilter: "blur(12px)",
      }}
    >
      <div style={{
        maxWidth:       920,
        margin:         "0 auto",
        padding:        "0 16px",
        height:         56,
        display:        "flex",
        alignItems:     "center",
        justifyContent: "space-between",
        gap:            8,
      }}>
        <Logo />

        <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
          {/* History */}
          <NavBtn onClick={onOpenHistory}>
            <HistoryIcon />
            <span className="nav-label">History</span>
            {historyCount > 0 && (
              <span style={{
                background:   "var(--accent)",
                color:        "white",
                fontSize:     10,
                fontWeight:   600,
                padding:      "1px 8px",
                borderRadius: 10,
                lineHeight:   1.6,
              }}>
                {historyCount}
              </span>
            )}
          </NavBtn>

          {/* Settings */}
          <NavBtn onClick={onOpenSettings}>
            <SettingsIcon />
            <span className="nav-label">Settings</span>
            {!hasApiKey && (
              <span style={{
                width:        6,
                height:       6,
                borderRadius: "50%",
                background:   "#f59e0b",
                display:      "inline-block",
                flexShrink:   0,
              }} />
            )}
          </NavBtn>

          {/* Theme toggle */}
          <button
            onClick={onToggleTheme}
            aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
            style={{
              width:          36,
              height:         36,
              borderRadius:   8,
              border:         "1px solid var(--border)",
              background:     "var(--bg-subtle)",
              color:          "var(--text-2)",
              display:        "flex",
              alignItems:     "center",
              justifyContent: "center",
              cursor:         "pointer",
              transition:     "all 0.15s",
              flexShrink:     0,
            }}
            onMouseOver={e => (e.currentTarget.style.borderColor = "var(--accent)")}
            onMouseOut={e  => (e.currentTarget.style.borderColor = "var(--border)")}
          >
            {dark ? <SunIcon /> : <MoonIcon />}
          </button>
        </div>
      </div>

      <style>{`
        @media (max-width: 480px) {
          .nav-label { display: none; }
        }
      `}</style>
    </nav>
  );
}

// -- Logo --------------------------------------

function Logo() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
      <Image src={"/favicon.svg"} width={30} height={30} alt="nanoread-logo" />
      <span style={{
        fontWeight:    600,
        fontSize:      "0.95rem",
        color:         "var(--text)",
        letterSpacing: "-0.02em",
        overflow:      "hidden",
        textOverflow:  "ellipsis",
        whiteSpace:    "nowrap",
      }}>
        Nanoread
      </span>
    </div>
  );
}