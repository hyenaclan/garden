import type { ThemeConfig } from "../types";

export const spring2026: Omit<ThemeConfig, "startDate" | "endDate"> = {
  id: "spring2026",
  name: "Spring 2026",
  description:
    "Fresh, vibrant spring theme with blooming greens and soft pastels",
  colors: {
    light: {
      background: "oklch(0.98 0.01 145)", // Soft spring white with green hint
      foreground: "oklch(0.18 0.03 145)", // Deep green-grey
      card: "oklch(0.99 0.01 145)",
      cardForeground: "oklch(0.18 0.03 145)",
      popover: "oklch(0.99 0.01 145)",
      popoverForeground: "oklch(0.18 0.03 145)",
      primary: "oklch(0.50 0.16 145)", // Fresh spring green
      primaryForeground: "oklch(0.98 0.01 145)",
      secondary: "oklch(0.90 0.05 145)", // Light mint
      secondaryForeground: "oklch(0.22 0.03 145)",
      muted: "oklch(0.88 0.06 145)", // Vibrant muted green
      mutedForeground: "oklch(0.45 0.08 145)",
      accent: "oklch(0.85 0.08 100)", // Soft yellow-green (new growth)
      accentForeground: "oklch(0.22 0.03 145)",
      destructive: "oklch(0.55 0.20 20)",
      destructiveForeground: "oklch(0.98 0.01 145)",
      border: "oklch(0.88 0.03 145)",
      input: "oklch(0.88 0.03 145)",
      ring: "oklch(0.50 0.16 145)",
      radius: "0.5rem",
    },
    dark: {
      background: "oklch(0.12 0.02 145)", // Deep forest night
      foreground: "oklch(0.92 0.02 145)", // Bright spring white
      card: "oklch(0.15 0.03 145)",
      cardForeground: "oklch(0.92 0.02 145)",
      popover: "oklch(0.15 0.03 145)",
      popoverForeground: "oklch(0.92 0.02 145)",
      primary: "oklch(0.65 0.18 145)", // Bright spring green
      primaryForeground: "oklch(0.12 0.02 145)",
      secondary: "oklch(0.28 0.06 145)", // Deep mint
      secondaryForeground: "oklch(0.85 0.03 145)",
      muted: "oklch(0.30 0.04 145)", // Visible dark green
      mutedForeground: "oklch(0.65 0.08 145)",
      accent: "oklch(0.40 0.10 100)", // Deep yellow-green
      accentForeground: "oklch(0.90 0.03 145)",
      destructive: "oklch(0.55 0.20 20)",
      destructiveForeground: "oklch(0.92 0.02 145)",
      border: "oklch(0.28 0.04 145)",
      input: "oklch(0.28 0.04 145)",
      ring: "oklch(0.65 0.18 145)",
      radius: "0.5rem",
    },
  },
};
