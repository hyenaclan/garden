import type { ThemeRegistry } from "./types";
import { winter2026 } from "./themes/winter2026";
import { spring2026 } from "./themes/spring2026";
import { summer2026 } from "./themes/summer2026";
import { fall2026 } from "./themes/fall2026";
import { default2025 } from "./themes/default2025";

/**
 * Theme registry configuration
 *
 * This is the central location for all theme scheduling.
 * All date ranges are defined here for easy management.
 *
 * Add new themes to the themes array and they will automatically
 * be queued based on their startDate and endDate.
 *
 * The defaultTheme is used as a fallback when no theme matches
 * the current date (e.g., before the first theme or after the last theme).
 *
 * Note: Date comparisons use UTC timezone. Ensure date ranges are continuous
 * (no gaps) to avoid unexpected fallback to defaultTheme.
 */
export const themeRegistry: ThemeRegistry = {
  themes: [
    {
      ...default2025,
      startDate: "2025-01-01", // Start of 2025
      endDate: "2025-12-20", // Day before winter solstice 2025
    },
    {
      ...winter2026,
      startDate: "2025-12-21", // Winter solstice 2025
      endDate: "2026-03-19", // Day before spring equinox 2026
    },
    {
      ...spring2026,
      startDate: "2026-03-20", // Spring equinox 2026
      endDate: "2026-06-20", // Day before summer solstice 2026
    },
    {
      ...summer2026,
      startDate: "2026-06-21", // Summer solstice 2026
      endDate: "2026-09-21", // Day before fall equinox 2026
    },
    {
      ...fall2026,
      startDate: "2026-09-22", // Fall equinox 2026
      endDate: "2026-12-20", // Day before winter solstice 2026
    },
  ],
  defaultTheme: "default2025", // Fallback theme (current season)
};

// Re-export individual themes for direct access if needed
export { default2025, winter2026, spring2026, summer2026, fall2026 };
