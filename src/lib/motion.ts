"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Flip } from "gsap/Flip";
import { SplitText } from "gsap/SplitText";
import { DURATIONS, EASES } from "@/lib/tokens";

let registered = false;

/** Registers GSAP plugins exactly once, client-side only. Safe to call from every component. */
export function ensureGsapRegistered() {
  if (registered || typeof window === "undefined") return;
  gsap.registerPlugin(ScrollTrigger, Flip, SplitText);
  registered = true;
}

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function prefersSaveData(): boolean {
  if (typeof navigator === "undefined") return false;
  const nav = navigator as Navigator & { connection?: { saveData?: boolean } };
  return Boolean(nav.connection?.saveData);
}

export { gsap, ScrollTrigger, Flip, SplitText, DURATIONS, EASES };
