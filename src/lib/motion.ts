"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Flip } from "gsap/Flip";

let registered = false;

/**
 * Registers GSAP plugins exactly once, on the client.
 *
 * SplitText is a Club plugin and is deliberately not used: every headline
 * that needs a line reveal is authored as explicit `.mask-line` spans in
 * the server HTML instead, so the text is in the initial markup (LCP/SEO)
 * and the reveal needs no runtime DOM surgery.
 */
export function ensureGsapRegistered() {
  if (registered || typeof window === "undefined") return;
  gsap.registerPlugin(ScrollTrigger, Flip);
  registered = true;
}

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Motion tokens mirrored from §5 so tweens never hardcode timings. */
export const EASE = {
  out: "power3.out",
  expo: "expo.out",
  inOut: "power3.inOut",
} as const;

export const DUR = {
  micro: 0.18,
  ui: 0.35,
  reveal: 0.9,
  cinematic: 1.4,
} as const;

export { gsap, ScrollTrigger, Flip };
