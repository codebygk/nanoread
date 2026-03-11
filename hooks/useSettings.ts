"use client";

// ─────────────────────────────────────────────
// useSettings – persists LLM settings to localStorage
// ─────────────────────────────────────────────

import { useState, useCallback } from "react";
import { DEFAULT_SETTINGS, STORAGE_KEYS } from "@/lib/constants";
import type { Settings } from "@/types";

interface UseSettingsReturn {
  settings: Settings;
  saveSettings: (next: Settings) => void;
  loadSettings: () => void;
}

export function useSettings(): UseSettingsReturn {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);

  const loadSettings = useCallback(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (raw) setSettings(JSON.parse(raw) as Settings);
    } catch {
      // Malformed storage - fall back to defaults silently
    }
  }, []);

  const saveSettings = useCallback((next: Settings) => {
    setSettings(next);
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(next));
    } catch {
      // Storage unavailable (e.g. private browsing quota exceeded)
    }
  }, []);

  return { settings, saveSettings, loadSettings };
}