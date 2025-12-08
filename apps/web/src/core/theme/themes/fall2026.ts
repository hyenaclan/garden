import type { ThemeConfig } from "../types";

export const fall2026: Omit<ThemeConfig, "startDate" | "endDate"> = {
  id: "fall2026",
  name: "Fall 2026",
  description:
    "Cozy autumn theme with warm oranges, rustic browns, and harvest golds",
  colors: {
    light: {
      background: "oklch(0.97 0.02 60)", // Warm cream
      foreground: "oklch(0.20 0.04 40)", // Deep brown
      card: "oklch(0.98 0.02 60)",
      cardForeground: "oklch(0.20 0.04 40)",
      popover: "oklch(0.98 0.02 60)",
      popoverForeground: "oklch(0.20 0.04 40)",
      primary: "oklch(0.50 0.16 40)", // Warm autumn orange-brown
      primaryForeground: "oklch(0.97 0.02 60)",
      secondary: "oklch(0.85 0.10 60)", // Soft harvest gold
      secondaryForeground: "oklch(0.22 0.04 40)",
      muted: "oklch(0.88 0.06 50)",
      mutedForeground: "oklch(0.45 0.08 40)",
      accent: "oklch(0.75 0.14 35)", // Burnt orange
      accentForeground: "oklch(0.98 0.02 60)",
      destructive: "oklch(0.55 0.20 20)",
      destructiveForeground: "oklch(0.97 0.02 60)",
      border: "oklch(0.86 0.04 50)",
      input: "oklch(0.86 0.04 50)",
      ring: "oklch(0.50 0.16 40)",
      radius: "0.5rem",
    },
    dark: {
      background: "oklch(0.13 0.03 40)", // Deep autumn night
      foreground: "oklch(0.92 0.02 60)", // Warm white
      card: "oklch(0.17 0.04 40)",
      cardForeground: "oklch(0.92 0.02 60)",
      popover: "oklch(0.17 0.04 40)",
      popoverForeground: "oklch(0.92 0.02 60)",
      primary: "oklch(0.62 0.18 40)", // Bright autumn orange
      primaryForeground: "oklch(0.13 0.03 40)",
      secondary: "oklch(0.30 0.10 60)", // Deep harvest gold
      secondaryForeground: "oklch(0.88 0.03 60)",
      muted: "oklch(0.26 0.06 50)",
      mutedForeground: "oklch(0.65 0.08 50)",
      accent: "oklch(0.45 0.14 35)", // Deep burnt orange
      accentForeground: "oklch(0.92 0.02 60)",
      destructive: "oklch(0.55 0.20 20)",
      destructiveForeground: "oklch(0.92 0.02 60)",
      border: "oklch(0.26 0.05 50)",
      input: "oklch(0.26 0.05 50)",
      ring: "oklch(0.62 0.18 40)",
      radius: "0.5rem",
    },
  },
};
