import type { ThemeConfig } from "../types";

export const summer2026: Omit<ThemeConfig, "startDate" | "endDate"> = {
  id: "summer2026",
  name: "Summer 2026",
  description: "Warm, sunny summer theme with golden yellows and lush greens",
  colors: {
    light: {
      background: "oklch(0.98 0.02 90)", // Warm sunny white
      foreground: "oklch(0.15 0.03 120)", // Deep warm grey-green
      card: "oklch(0.99 0.02 90)",
      cardForeground: "oklch(0.15 0.03 120)",
      popover: "oklch(0.99 0.02 90)",
      popoverForeground: "oklch(0.15 0.03 120)",
      primary: "oklch(0.55 0.18 130)", // Warm vibrant green
      primaryForeground: "oklch(0.98 0.02 90)",
      secondary: "oklch(0.88 0.08 90)", // Soft golden yellow
      secondaryForeground: "oklch(0.20 0.03 120)",
      muted: "oklch(0.90 0.05 100)",
      mutedForeground: "oklch(0.42 0.08 120)",
      accent: "oklch(0.80 0.12 85)", // Bright sunshine yellow
      accentForeground: "oklch(0.20 0.03 120)",
      destructive: "oklch(0.55 0.20 20)",
      destructiveForeground: "oklch(0.98 0.02 90)",
      border: "oklch(0.88 0.04 100)",
      input: "oklch(0.88 0.04 100)",
      ring: "oklch(0.55 0.18 130)",
      radius: "0.5rem",
    },
    dark: {
      background: "oklch(0.14 0.02 120)", // Warm summer night
      foreground: "oklch(0.92 0.02 90)", // Warm white
      card: "oklch(0.18 0.03 120)",
      cardForeground: "oklch(0.92 0.02 90)",
      popover: "oklch(0.18 0.03 120)",
      popoverForeground: "oklch(0.92 0.02 90)",
      primary: "oklch(0.68 0.20 130)", // Bright summer green
      primaryForeground: "oklch(0.14 0.02 120)",
      secondary: "oklch(0.32 0.08 90)", // Deep golden
      secondaryForeground: "oklch(0.88 0.03 90)",
      muted: "oklch(0.28 0.05 120)",
      mutedForeground: "oklch(0.68 0.08 120)",
      accent: "oklch(0.45 0.12 85)", // Deep sunshine yellow
      accentForeground: "oklch(0.92 0.02 90)",
      destructive: "oklch(0.55 0.20 20)",
      destructiveForeground: "oklch(0.92 0.02 90)",
      border: "oklch(0.28 0.04 120)",
      input: "oklch(0.28 0.04 120)",
      ring: "oklch(0.68 0.20 130)",
      radius: "0.5rem",
    },
  },
};
