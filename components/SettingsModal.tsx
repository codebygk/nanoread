"use client";

// ─────────────────────────────────────────────
// SettingsModal – LLM provider / model / API key
// ─────────────────────────────────────────────

import { useState } from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "@/components/ui/Modal";
import { FormField, INPUT_STYLE, handleFocus, handleBlur } from "@/components/ui/FormField";
import { PROVIDER_PRESETS, type ProviderPreset } from "@/lib/constants";
import type { Settings } from "@/types";

interface SettingsModalProps {
  settings: Settings;
  onSave:   (next: Settings) => void;
  onClose:  () => void;
}

export default function SettingsModal({ settings, onSave, onClose }: SettingsModalProps) {
  const [local,        setLocal]        = useState<Settings>({ ...settings });
  const [showKey,      setShowKey]      = useState(false);
  const [activePreset, setActivePreset] = useState<string | null>(null);

  const applyPreset = (preset: ProviderPreset) => {
    setLocal(prev => ({ ...prev, baseUrl: preset.baseUrl, model: preset.model, apiKey: "" }));
    setActivePreset(preset.label);
  };

  const currentPreset = PROVIDER_PRESETS.find(p => p.label === activePreset);

  return (
    <Modal onClose={onClose}>
      <ModalHeader
        title="LLM Settings"
        subtitle="Configure your AI provider"
        onClose={onClose}
      />

      <ModalBody>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

          {/* ── Quick presets ── */}
          <FormField label="Quick Presets">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
              {PROVIDER_PRESETS.map(preset => (
                <button
                  key={preset.label}
                  onClick={() => applyPreset(preset)}
                  style={{
                    padding:      "8px 10px",
                    borderRadius: 8,
                    border:       activePreset === preset.label
                      ? "1.5px solid var(--accent)"
                      : "1px solid var(--border)",
                    background: activePreset === preset.label
                      ? "var(--accent-bg)"
                      : "var(--bg-subtle)",
                    color:      activePreset === preset.label
                      ? "var(--accent)"
                      : "var(--text-2)",
                    fontSize:   "0.8rem",
                    fontWeight: 500,
                    cursor:     "pointer",
                    transition: "all 0.15s",
                    fontFamily: "inherit",
                  }}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </FormField>

          {/* ── Base URL ── */}
          <FormField
            label="Base URL"
            hint="Compatible with OpenAI, Groq, Ollama, OpenRouter, LM Studio, Together, Mistral…"
            action={
              <span style={{ fontSize: "0.7rem", color: "var(--text-3)" }}>
                OpenAI-compatible endpoint
              </span>
            }
          >
            <input
              type="text"
              value={local.baseUrl || ""}
              placeholder="https://api.openai.com/v1"
              onChange={e => { setLocal({ ...local, baseUrl: e.target.value }); setActivePreset(null); }}
              style={INPUT_STYLE}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
          </FormField>

          {/* ── Model ── */}
          <FormField
            label="Model"
            hint="Examples: llama3.2, mistral, llama-3.3-70b-versatile"
          >
            <input
              type="text"
              value={local.model}
              placeholder="gpt-4o-mini"
              onChange={e => setLocal({ ...local, model: e.target.value })}
              style={INPUT_STYLE}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
          </FormField>

          {/* ── API Key ── */}
          <FormField
            label="API Key"
            hint="For Ollama/LM Studio, enter any placeholder - no real key needed. Stored only in your browser."
            action={
              currentPreset?.keyLink
                ? (
                  <a
                    href={currentPreset.keyLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ fontSize: "0.72rem", color: "var(--accent)", textDecoration: "none", fontWeight: 500 }}
                  >
                    Get {currentPreset.label} key →
                  </a>
                )
                : undefined
            }
          >
            <div style={{ position: "relative" }}>
              <input
                type={showKey ? "text" : "password"}
                value={local.apiKey}
                placeholder={currentPreset?.keyHint ?? "your-api-key"}
                onChange={e => setLocal({ ...local, apiKey: e.target.value })}
                style={{ ...INPUT_STYLE, paddingRight: 52 }}
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
              <button
                type="button"
                onClick={() => setShowKey(prev => !prev)}
                style={{
                  position:  "absolute",
                  right:     10,
                  top:       "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border:    "none",
                  cursor:    "pointer",
                  color:     "var(--text-3)",
                  fontSize:  "0.72rem",
                  fontWeight: 500,
                  fontFamily: "inherit",
                }}
              >
                {showKey ? "Hide" : "Show"}
              </button>
            </div>
          </FormField>

          {/* ── Info banner ── */}
          <div style={{
            padding:      "12px 14px",
            borderRadius: 10,
            background:   "var(--accent-bg)",
            border:       "1px solid var(--border)",
            fontSize:     "0.8rem",
            color:        "var(--text-2)",
            lineHeight:   1.5,
          }}>
            <strong style={{ color: "var(--text)" }}>Need a free key?</strong>{" "}
            <strong>Groq</strong> offers a generous free tier with fast models - great for getting started.{" "}
            <strong>Ollama</strong> runs fully local with no key needed.
          </div>
        </div>
      </ModalBody>

      <ModalFooter>
        <button
          onClick={onClose}
          style={{
            flex:         1,
            padding:      "10px",
            borderRadius: 8,
            border:       "1px solid var(--border)",
            background:   "var(--bg-subtle)",
            color:        "var(--text-2)",
            fontSize:     "0.875rem",
            fontWeight:   500,
            cursor:       "pointer",
            fontFamily:   "inherit",
            transition:   "all 0.15s",
          }}
        >
          Cancel
        </button>
        <button
          onClick={() => onSave(local)}
          style={{
            flex:         1,
            padding:      "10px",
            borderRadius: 8,
            border:       "none",
            background:   "var(--accent)",
            color:        "white",
            fontSize:     "0.875rem",
            fontWeight:   600,
            cursor:       "pointer",
            fontFamily:   "inherit",
            transition:   "opacity 0.15s",
          }}
          onMouseOver={e => (e.currentTarget.style.opacity = "0.88")}
          onMouseOut={e  => (e.currentTarget.style.opacity = "1")}
        >
          Save Settings
        </button>
      </ModalFooter>
    </Modal>
  );
}