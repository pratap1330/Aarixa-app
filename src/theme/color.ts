export const BRAND_THEMES = {
  blue: {
    primary: "#3A6FF8",
    primaryDark: "#152C5B",
    primarySoft: "#E8F0FF",
  },
  green: {
    primary: "#22C55E",
    primaryDark: "#16A34A",
    primarySoft: "#E8F9EF",
  },
  red: {
    primary: "#EF4444",
    primaryDark: "#DC2626",
    primarySoft: "#FEECEC",
  },
  yellow: {
    primary: "#F4B400",
    primaryDark: "#D89B00",
    primarySoft: "#FFF7DB",
  },
  purple: {
    primary: "#8B5CF6",
    primaryDark: "#7C3AED",
    primarySoft: "#F1EAFE",
  },
} as const;

export type BrandThemeKey = keyof typeof BRAND_THEMES;

const baseLightColors = {
  background: "#FFFFFF",
  text: "#1E1E1E",
  card: "#FFFFFF",
};

const baseDarkColors = {
  background: "#000000",
  text: "#FFFFFF",
  card: "#121212",
};

export const getThemeColors = (mode: "light" | "dark", brandKey: BrandThemeKey) => {
  const brand = BRAND_THEMES[brandKey] ?? BRAND_THEMES.blue;
  const baseColors = mode === "light" ? baseLightColors : baseDarkColors;

  return {
    ...baseColors,
    ...brand,
    primaryContrast: "#FFFFFF",
  };
};
