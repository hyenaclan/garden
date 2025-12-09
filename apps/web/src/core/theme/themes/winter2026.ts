import type { ThemeConfig } from "../types";

export const winter2026: Omit<ThemeConfig, "startDate" | "endDate"> = {
  id: "winter2026",
  name: "Winter 2026",
  description: "Cool, crisp winter theme with icy blues and frost whites",
  colors: {
    light: {
      background: "oklch(0.98 0.01 240)", // Soft icy white
      foreground: "oklch(0.15 0.02 240)", // Deep blue-grey
      card: "oklch(0.99 0.01 240)",
      cardForeground: "oklch(0.15 0.02 240)",
      popover: "oklch(0.99 0.01 240)",
      popoverForeground: "oklch(0.15 0.02 240)",
      primary: "oklch(0.45 0.15 240)", // Cool winter blue
      primaryForeground: "oklch(0.98 0.01 240)",
      secondary: "oklch(0.90 0.03 240)", // Light frost blue
      secondaryForeground: "oklch(0.20 0.02 240)",
      muted: "oklch(0.92 0.02 240)",
      mutedForeground: "oklch(0.45 0.03 240)",
      accent: "oklch(0.88 0.05 200)", // Soft ice blue
      accentForeground: "oklch(0.20 0.02 240)",
      destructive: "oklch(0.55 0.20 20)",
      destructiveForeground: "oklch(0.98 0.01 240)",
      border: "oklch(0.88 0.02 240)",
      input: "oklch(0.88 0.02 240)",
      ring: "oklch(0.45 0.15 240)",
      radius: "0.5rem",
    },
    dark: {
      background: "oklch(0.12 0.02 240)", // Deep winter night
      foreground: "oklch(0.92 0.01 240)", // Bright snow white
      card: "oklch(0.15 0.02 240)",
      cardForeground: "oklch(0.92 0.01 240)",
      popover: "oklch(0.15 0.02 240)",
      popoverForeground: "oklch(0.92 0.01 240)",
      primary: "oklch(0.65 0.18 240)", // Bright winter blue
      primaryForeground: "oklch(0.12 0.02 240)",
      secondary: "oklch(0.25 0.04 240)", // Dark frost
      secondaryForeground: "oklch(0.85 0.02 240)",
      muted: "oklch(0.22 0.03 240)",
      mutedForeground: "oklch(0.70 0.03 240)",
      accent: "oklch(0.35 0.08 200)", // Deep ice blue
      accentForeground: "oklch(0.90 0.02 240)",
      destructive: "oklch(0.55 0.20 20)",
      destructiveForeground: "oklch(0.92 0.01 240)",
      border: "oklch(0.25 0.03 240)",
      input: "oklch(0.25 0.03 240)",
      ring: "oklch(0.65 0.18 240)",
      radius: "0.5rem",
    },
  },
};
