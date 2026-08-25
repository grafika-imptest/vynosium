/**
 * Typed mirror of the design tokens in globals.css (§5).
 *
 * Only values that JS genuinely needs (shader uniforms, canvas fills,
 * Intl output) live here. Anything that can stay in CSS stays in CSS —
 * this file must never become a second source of truth for styling.
 */

export type InvestmentPath = "flip" | "income" | "capital" | "wealth";

export const COLORS = {
  navy: "#102a43",
  abyss: "#0b1d2e",
  surface1: "#16324b",
  surface2: "#1b3a54",
  lineDeep: "#243b53",
  emerald: "#1f8a70",
  snow: "#f8f8f8",
  steel: "#486581",
  slate: "#627d98",
  silver: "#bcccdc",
  lightGray: "#e4e7eb",
  mist: "#f5f7fa",
  white: "#ffffff",
} as const;

export const PATH_COLORS: Record<InvestmentPath, string> = {
  flip: "#1f8a70",
  income: "#2f6fed",
  capital: "#f59e0b",
  wealth: "#6d5bd0",
};

/** The identity angle. Every gradient, reveal and flow vector maps to it. */
export const VECTOR_ANGLE_DEG = 38.5;
export const VECTOR_ANGLE_RAD = (VECTOR_ANGLE_DEG * Math.PI) / 180;

/** Hex → normalised RGB triple for Three.js uniforms. */
export function hexToRgb(hex: string): [number, number, number] {
  const v = parseInt(hex.replace("#", ""), 16);
  return [((v >> 16) & 255) / 255, ((v >> 8) & 255) / 255, (v & 255) / 255];
}
