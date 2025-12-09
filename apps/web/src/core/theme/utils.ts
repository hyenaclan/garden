import type { ThemeConfig, ThemeColors } from "./types";
import { themeRegistry } from "./config"; // Theme registry from config.ts

/**
 * Gets the active theme based on the current date
 * Uses UTC timezone for consistency across regions
 * @param currentDate - The date to check against (defaults to today)
 * @returns The active theme configuration
 */
export function getActiveTheme(currentDate: Date = new Date()): ThemeConfig {
  const dateString = currentDate.toISOString().split("T")[0]; // YYYY-MM-DD format (UTC)

  // Find theme where currentDate is between startDate and endDate
  const activeTheme = themeRegistry.themes.find((theme) => {
    return dateString >= theme.startDate && dateString <= theme.endDate;
  });

  // If no theme matches, return the default theme
  if (!activeTheme) {
    const defaultTheme = themeRegistry.themes.find(
      (theme) => theme.id === themeRegistry.defaultTheme,
    );
    if (!defaultTheme) {
      throw new Error(
        `Default theme "${themeRegistry.defaultTheme}" not found in theme registry`,
      );
    }
    return defaultTheme;
  }

  return activeTheme;
}

/**
 * Gets a theme by its ID
 * @param themeId - The theme ID to look up
 * @returns The theme configuration or undefined if not found
 */
export function getThemeById(themeId: string): ThemeConfig | undefined {
  return themeRegistry.themes.find((theme) => theme.id === themeId);
}

/**
 * Gets all available themes
 * @returns Array of all theme configurations
 */
export function getAllThemes(): ThemeConfig[] {
  return themeRegistry.themes;
}

/**
 * Applies theme colors to CSS custom properties
 * @param colors - The theme colors to apply
 * @param mode - 'light' or 'dark'
 */
export function applyThemeColors(colors: ThemeColors, mode: "light" | "dark") {
  const root = document.documentElement;

  // Apply each color as a CSS custom property
  Object.entries(colors).forEach(([key, value]) => {
    // Convert camelCase to kebab-case (e.g., primaryForeground -> primary-foreground)
    const cssVarName = `--${key.replace(/([A-Z])/g, "-$1").toLowerCase()}`;
    root.style.setProperty(cssVarName, value);
  });

  // Update dark mode class
  if (mode === "dark") {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
}
