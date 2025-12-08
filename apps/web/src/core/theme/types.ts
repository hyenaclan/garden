/**
 * Theme configuration types for the application
 */

export interface ThemeColors {
  background: string;
  foreground: string;
  card: string;
  cardForeground: string;
  popover: string;
  popoverForeground: string;
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  muted: string;
  mutedForeground: string;
  accent: string;
  accentForeground: string;
  destructive: string;
  destructiveForeground: string;
  border: string;
  input: string;
  ring: string;
  radius: string;
}

export interface ThemeModeConfig {
  light: ThemeColors;
  dark: ThemeColors;
}

export interface ThemeConfig {
  id: string;
  name: string;
  description?: string;
  startDate: string; // ISO 8601 date string (YYYY-MM-DD)
  endDate: string; // ISO 8601 date string (YYYY-MM-DD)
  colors: ThemeModeConfig;
}

export interface ThemeRegistry {
  themes: ThemeConfig[];
  defaultTheme: string; // theme id to use as fallback
}
