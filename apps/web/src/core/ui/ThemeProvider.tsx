import { createContext, useContext, useEffect, useState, useRef } from "react";
import type { ThemeConfig } from "../theme/types";
import {
  getActiveTheme,
  applyThemeColors,
  getNextThemeChangeDate,
  MS_PER_DAY,
} from "../theme/utils";

type ThemeMode = "light" | "dark";

interface ThemeContextType {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  activeThemeConfig: ThemeConfig;
  nextThemeChangeDate: Date | null;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Initialize with a function to safely get the active theme
  const [theme, setTheme] = useState<ThemeMode>(() => {
    const savedMode = localStorage.getItem("theme-mode") as ThemeMode | null;
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    return savedMode || (prefersDark ? "dark" : "light");
  });

  const [activeThemeConfig, setActiveThemeConfig] = useState<ThemeConfig>(
    () => {
      return getActiveTheme();
    },
  );

  const [nextThemeChangeDate, setNextThemeChangeDate] = useState<Date | null>(
    () => {
      return getNextThemeChangeDate();
    },
  );

  // Ref to track the daily interval for cleanup
  const dailyIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize theme on mount
  useEffect(() => {
    // Apply the theme colors based on the initialized state
    const colors =
      theme === "dark"
        ? activeThemeConfig.colors.dark
        : activeThemeConfig.colors.light;
    applyThemeColors(colors, theme);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Intentionally empty - only run on mount

  // Check for theme changes daily
  useEffect(() => {
    const checkThemeChange = () => {
      const currentTheme = getActiveTheme();

      // If the active theme has changed, update it
      if (currentTheme.id !== activeThemeConfig.id) {
        setActiveThemeConfig(currentTheme);

        // Apply the new theme colors with current mode
        const colors =
          theme === "dark"
            ? currentTheme.colors.dark
            : currentTheme.colors.light;
        applyThemeColors(colors, theme);

        // Update next theme change date
        setNextThemeChangeDate(getNextThemeChangeDate());
      }
    };

    // Check at midnight every day
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const timeUntilMidnight = tomorrow.getTime() - now.getTime();

    // Set initial timeout to check at midnight
    const midnightTimeout = setTimeout(() => {
      checkThemeChange();

      // Then check every 24 hours (store in ref for cleanup)
      dailyIntervalRef.current = setInterval(checkThemeChange, MS_PER_DAY);
    }, timeUntilMidnight);

    // Cleanup function
    return () => {
      clearTimeout(midnightTimeout);
      if (dailyIntervalRef.current) {
        clearInterval(dailyIntervalRef.current);
        dailyIntervalRef.current = null;
      }
    };
  }, [activeThemeConfig.id, theme]);

  const updateTheme = (newMode: ThemeMode) => {
    setTheme(newMode);
    localStorage.setItem("theme-mode", newMode);

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
        nextThemeChangeDate,
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
