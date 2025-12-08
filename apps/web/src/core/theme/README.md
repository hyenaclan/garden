# Theme System

A configuration-based theme system with date-based theme queuing for seasonal themes.

## Overview

The theme system allows you to:

- Define multiple themes in separate configuration files
- Automatically switch themes based on date ranges
- Configure both light and dark mode for each theme
- Easily add new themes without modifying core code

## Directory Structure

```
core/theme/
├── config.ts             # Theme registry (main config file)
├── types.ts              # TypeScript type definitions
├── utils.ts              # Utility functions for theme management
├── themes/
│   ├── winter2026.ts    # Winter theme colors
│   ├── spring2026.ts    # Spring theme colors
│   ├── summer2026.ts    # Summer theme colors
│   └── fall2026.ts      # Fall theme colors
└── README.md            # This file
```

## How It Works

1. **Theme Files**: Each season has its own file in `themes/` defining colors for both light and dark modes
2. **Main Config**: The `config.ts` file imports all themes and assigns date ranges
3. **Date-Based Selection**: The `ThemeProvider` automatically selects the active theme based on the current date
4. **On-Load Checking**: The theme is checked and applied when users first visit the site
5. **Dynamic Application**: Theme colors are applied via CSS custom properties at runtime

**Important Notes**:

- This is a living system. As new seasonal themes are created for upcoming periods, older themes should be removed to keep the codebase clean. Only themes for current and upcoming seasons need to be maintained.
- **Timezone**: Date comparisons use UTC timezone for consistency across all regions. This means theme changes occur at midnight UTC, not local time.
- **Date Ranges**: Ensure theme date ranges are continuous (no gaps) to avoid unexpected fallback to the default theme.

## Adding a New Theme

1. Create a new theme file in `themes/`:

```typescript
// themes/myTheme.ts
import type { ThemeConfig } from "../types";

export const myTheme: Omit<ThemeConfig, "startDate" | "endDate"> = {
  id: "myTheme",
  name: "My Theme",
  description: "A custom theme",
  colors: {
    light: {
      background: "oklch(0.98 0.01 145)",
      foreground: "oklch(0.18 0.03 145)",
      // ... define all color tokens
    },
    dark: {
      background: "oklch(0.12 0.02 145)",
      foreground: "oklch(0.92 0.02 145)",
      // ... define all color tokens
    },
  },
};
```

2. Add it to the theme registry in `config.ts` with date ranges:

```typescript
import { myTheme } from "./themes/myTheme";

export const themeRegistry: ThemeRegistry = {
  themes: [
    {
      ...winter2026,
      startDate: "2025-12-21",
      endDate: "2026-03-19",
    },
    {
      ...spring2026,
      startDate: "2026-03-20",
      endDate: "2026-06-20",
    },
    {
      ...summer2026,
      startDate: "2026-06-21",
      endDate: "2026-09-21",
    },
    {
      ...fall2026,
      startDate: "2026-09-22",
      endDate: "2026-12-20",
    },
    {
      ...myTheme,
      startDate: "2027-01-01", // Your custom date range
      endDate: "2027-03-31",
    },
  ],
  defaultTheme: "spring2026",
};
```

**Important**: All date ranges are managed in `config.ts`. This keeps all scheduling logic in one place for easy updates.

## Removing Old Themes

As seasons pass, old theme files should be removed to keep the codebase clean:

1. **Delete the theme file** from `themes/`:

   ```bash
   rm themes/oldTheme.ts
   ```

2. **Remove from config.ts**:
   - Remove the import statement
   - Remove the theme object from the `themes` array
   - Remove the re-export (if present)

3. **Example**: When winter 2026 ends (March 19, 2026), you would:

   ```typescript
   // Remove this import
   - import { winter2026 } from "./themes/winter2026";

   // Remove this from themes array
   - {
   -   ...winter2026,
   -   startDate: "2025-12-21",
   -   endDate: "2026-03-19",
   - },

   // Remove from re-exports
   - export { winter2026, spring2026, summer2026, fall2026 };
   + export { spring2026, summer2026, fall2026 };
   ```

**Best Practice**: Keep only the current season's theme plus the next 2-3 upcoming seasons. Remove themes once they're more than a month past their end date.

## Theme Configuration

### Required Color Tokens

Each theme must define these color tokens for both light and dark modes:

- `background` - Main background color
- `foreground` - Main text color
- `card` - Card background
- `cardForeground` - Card text
- `popover` - Popover background
- `popoverForeground` - Popover text
- `primary` - Primary brand color
- `primaryForeground` - Text on primary
- `secondary` - Secondary color
- `secondaryForeground` - Text on secondary
- `muted` - Muted background
- `mutedForeground` - Muted text
- `accent` - Accent color
- `accentForeground` - Text on accent
- `destructive` - Error/danger color
- `destructiveForeground` - Text on destructive
- `border` - Border color
- `input` - Input border color
- `ring` - Focus ring color
- `radius` - Border radius value

### Date Format

Dates must be in ISO 8601 format: `YYYY-MM-DD`

Example: `"2026-03-20"`

### OKLCH Color Format

All colors use the OKLCH color space for better perceptual uniformity:

```
oklch(lightness chroma hue)
```

- **Lightness**: 0 (black) to 1 (white)
- **Chroma**: 0 (grayscale) to ~0.4 (saturated)
- **Hue**: 0-360 degrees

Example: `oklch(0.50 0.16 145)` = medium lightness, moderate saturation, green hue

## Usage in Components

### Getting Current Theme Info

```typescript
import { useTheme } from "@/core/ui/ThemeProvider";

function MyComponent() {
  const { theme, activeThemeConfig } = useTheme();

  return (
    <div>
      <p>Current mode: {theme}</p>
      <p>Active theme: {activeThemeConfig.name}</p>
      <p>Description: {activeThemeConfig.description}</p>
    </div>
  );
}
```

### Toggling Light/Dark Mode

```typescript
import { useTheme } from "@/core/ui/ThemeProvider";

function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
      Toggle {theme === "dark" ? "Light" : "Dark"} Mode
    </button>
  );
}
```

## Utility Functions

### `getActiveTheme(currentDate?: Date): ThemeConfig`

Returns the theme configuration for the given date (defaults to today).

### `getThemeById(themeId: string): ThemeConfig | undefined`

Looks up a theme by its ID.

### `getAllThemes(): ThemeConfig[]`

Returns all available themes.

### `applyThemeColors(colors: ThemeColors, mode: "light" | "dark")`

Applies theme colors to CSS custom properties. Called automatically by ThemeProvider.

## Type Safety

The theme system uses TypeScript interfaces to enforce structure at compile time:

- **`ThemeColors`** - Defines all 20 required color tokens. TypeScript will throw a compile error if any are missing.
- **`ThemeModeConfig`** - Requires both `light` and `dark` modes to be defined.
- **`ThemeConfig`** - Enforces the complete theme structure including metadata and colors.

**No runtime validation needed** - if your theme file compiles without TypeScript errors, it has all required properties.

## Theme Queuing Logic

The system automatically selects themes based on date:

1. When a user visits the site, check if current date falls within any theme's `startDate` to `endDate` range
2. If match found, use that theme
3. If no match, fall back to the `defaultTheme` specified in the registry
4. The theme remains active for the duration of the user's session

## Development

### Testing Different Dates

To test theme switching, you can temporarily modify `getActiveTheme()` in `utils.ts`:

```typescript
// For testing only - remove after testing
export function getActiveTheme(currentDate: Date = new Date("2026-07-15")) {
  // This will always use summer theme
  // ...
}
```

## Best Practices

1. **Date Ranges**: Ensure theme date ranges don't overlap
2. **Complete Coverage**: Make sure all days of the year are covered by some theme
3. **Consistent Naming**: Use consistent naming for theme IDs (lowercase, no spaces)
4. **Color Contrast**: Ensure sufficient contrast between foreground/background colors
5. **Test Both Modes**: Always test both light and dark mode for each theme
6. **OKLCH Values**: Keep lightness between 0.1-0.95 for best results
7. **Seasonal Themes**: Align theme dates with actual seasonal changes in your target region

## Troubleshooting

### Theme not changing

- Check that date ranges don't overlap
- Verify date format is `YYYY-MM-DD`
- Check browser console for errors
- Ensure theme is added to registry

### Colors not applying

- Check that all required color tokens are defined
- Verify OKLCH syntax is correct
- Clear localStorage and refresh
- Check browser DevTools for CSS custom property values

### Performance

The theme system is optimized for performance:

- Theme colors are applied once at load time
- No timers, intervals, or continuous polling
- Theme selection happens only on initial page load
- Theme configs are statically imported (tree-shakeable)
