import { useMemo } from "react";
import type { ThemeColors } from "@/core/theme/types";
import { useTheme } from "@/core/ui/ThemeProvider";

export type GardenCanvasPalette = {
  stageBackground: string;
  gridLine: string;
  gridLineOpacity: number;
  bedPlaceholderFill: string;
  selectionStroke: string;
  rotateButtonFill: string;
  rotateButtonStroke: string;
  rotateIconFill: string;
};

function getThemeColors(
  mode: "light" | "dark",
  config: { colors: { light: ThemeColors; dark: ThemeColors } },
): ThemeColors {
  return mode === "dark" ? config.colors.dark : config.colors.light;
}

export function useGardenCanvasPalette(): GardenCanvasPalette {
  const { theme, activeThemeConfig } = useTheme();

  return useMemo(() => {
    const colors = getThemeColors(theme, activeThemeConfig);

    return {
      stageBackground: "#FFFFFF", // TODO -- replace with something textured grass background or somethiing
      gridLine: colors.border,
      gridLineOpacity: theme === "dark" ? 0.35 : 0.55,
      bedPlaceholderFill: colors.secondary,
      selectionStroke: colors.primary,
      rotateButtonFill: colors.popover,
      rotateButtonStroke: colors.primary,
      rotateIconFill: colors.primary,
    };
  }, [activeThemeConfig, theme]);
}
