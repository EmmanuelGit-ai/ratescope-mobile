// RateScope Design System
// ALL colors, spacing, and typography live here
// NEVER hardcode values in components

export const colors = {
  brand: {
    green: "#1B7A4D",
    amber: "#D97706",
    red: "#DC2626",
  },
  score: {
    high: "#1B7A4D",
    mid: "#D97706",
    low: "#DC2626",
  },
  surface: {
    dark: "#0F172A",
    card: "#1E293B",
    hover: "#334155",
    border: "#475569",
  },
  text: {
    primary: "#F1F5F9",
    secondary: "#94A3B8",
    muted: "#64748B",
  },
  transparent: "transparent",
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const fontSize = {
  xs: 11,
  sm: 13,
  md: 15,
  lg: 17,
  xl: 20,
  xxl: 24,
  hero: 32,
  display: 40,
};

export const borderRadius = {
  sm: 6,
  md: 10,
  lg: 14,
  xl: 20,
  full: 9999,
};

export const fontWeight = {
  normal: "400" as const,
  medium: "500" as const,
  semibold: "600" as const,
  bold: "700" as const,
};

export function getScoreColor(score: number): string {
  if (score >= 4.0) return colors.score.high;
  if (score >= 3.0) return colors.score.mid;
  return colors.score.low;
}

export function getScoreLabel(score: number): string {
  if (score >= 4.5) return "Exceptional";
  if (score >= 4.0) return "Excellent";
  if (score >= 3.5) return "Great";
  if (score >= 3.0) return "Good";
  if (score >= 2.5) return "Average";
  if (score >= 2.0) return "Below Average";
  return "Poor";
}

export function getModifierColor(score: number): string {
  if (score >= 0.7) return colors.score.high;
  if (score >= 0.4) return colors.score.mid;
  return colors.score.low;
}
