"use client";

// ─────────────────────────────────────────────
// useTheme – syncs light/dark preference with
//            localStorage and the <html> class
// ─────────────────────────────────────────────

import { useState, useCallback } from "react";
import { STORAGE_KEYS } from "@/lib/constants";

interface UseThemeReturn {
  dark: boolean;
  toggleTheme: () => void;
  initTheme: () => void;
}

export function useTheme(): UseThemeReturn {
  const [dark, setDark] = useState(false);

  const initTheme = useCallback(() => {
    const saved      = localStorage.getItem(STORAGE_KEYS.THEME);
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const isDark      = saved === "dark" || (!saved && prefersDark);
    setDark(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  const toggleTheme = useCallback(() => {
    setDark(prev => {
      const next = !prev;
      localStorage.setItem(STORAGE_KEYS.THEME, next ? "dark" : "light");
      document.documentElement.classList.toggle("dark", next);
      return next;
    });
  }, []);

  return { dark, toggleTheme, initTheme };
}