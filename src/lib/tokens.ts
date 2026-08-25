/**
 * JS/TS mirror of the CSS design tokens in globals.css (design.md §5).
 * Anything consumed by canvas/WebGL/Shader code can't read CSS custom
 * properties per-pixel, so those values are duplicated here. Keep in sync
 * with globals.css by hand — there are only ~15 of these.
 */

export const COLORS = {
  navy: "#102a43",
  emerald: "#1f8a70",
  emeraldHover: "#25a184",
  emeraldActive: "#187059",
  white: "#ffffff",
  mist: "#f5f7fa",
  abyss: "#0b1d2e",
  surface1: "#16324b",
  surface2: "#1b3a54",
  lineDeep: "#243b53",
  snow: "#f8f8f8",
  steel: "#486581",
  slate: "#627d98",
  silver: "#bcccdc",
  lightGray: "#e4e7eb",
} as const;

export const PATH_COLORS = {
  flip: "#1f8a70",
  income: "#2f6fed",
  capital: "#f59e0b",
  wealth: "#6d5bd0",
} as const;

export type InvestmentPath = keyof typeof PATH_COLORS;

/** The identity angle — every gradient, reveal mask, and scroll vector maps to this. */
export const VECTOR_ANGLE_DEG = 38.5;
export const VECTOR_ANGLE_RAD = (VECTOR_ANGLE_DEG * Math.PI) / 180;

export const GL_BASELINE = {
  drift: 0.06,
  grain: 0.035,
  accentEaseMs: 500,
  dprCap: 1.75,
  dprCapMobile: 1.0,
  idleFps: 30,
} as const;

export const DURATIONS = {
  micro: 0.18,
  ui: 0.35,
  reveal: 0.9,
  cinematic: 1.4,
} as const;

export const EASES = {
  out: "cubic-bezier(.22,1,.36,1)" as const,
  inout: "cubic-bezier(.83,0,.17,1)" as const,
  soft: "cubic-bezier(.33,1,.68,1)" as const,
};

export function hexToVec3(hex: string): [number, number, number] {
  const n = parseInt(hex.replace("#", ""), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}
