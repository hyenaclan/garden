import { createContext, useContext, useEffect, useState } from "react";
import type { ThemeConfig } from "../theme/types";
import { getActiveTheme, applyThemeColors } from "../theme/utils";

type ThemeMode = "light" | "dark";

interface ThemeContextType {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  activeThemeConfig: ThemeConfig;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Storage key constant
const THEME_MODE_STORAGE_KEY = "theme-mode";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Initialize with a function to safely get the active theme
  const [theme, setTheme] = useState<ThemeMode>(() => {
    // SSR guard: return default if window is not available
    if (typeof window === "undefined") return "light";

    const savedMode = localStorage.getItem(
      THEME_MODE_STORAGE_KEY,
    ) as ThemeMode | null;
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    return savedMode || (prefersDark ? "dark" : "light");
  });

  const [activeThemeConfig] = useState<ThemeConfig>(() => getActiveTheme());

  // Apply theme colors on mount
  useEffect(() => {
    const colors =
      theme === "dark"
        ? activeThemeConfig.colors.dark
        : activeThemeConfig.colors.light;
    applyThemeColors(colors, theme);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  const updateTheme = (newMode: ThemeMode) => {
    setTheme(newMode);
    // SSR guard for localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem(THEME_MODE_STORAGE_KEY, newMode);
    }

    // Apply the new mode with the current theme config
    const colors =
      newMode === "dark"
        ? activeThemeConfig.colors.dark
        : activeThemeConfig.colors.light;
    applyThemeColors(colors, newMode);
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme: updateTheme,
        activeThemeConfig,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
