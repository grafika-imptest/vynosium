"use client";

import { useEffect, useRef } from "react";

export type MagnetState = { current: { x: number; y: number; active: boolean; accentHex: string } };

/**
 * 28px diff-blend disk that follows the cursor via a rAF loop (never React
 * state — design.md §6 INP rule), growing to 64px + accent tint over
 * interactive zones. Disabled entirely on touch.
 */
export function CursorMagnet({ stateRef }: { stateRef: MagnetState }) {
  const dotRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (window.matchMedia("(hover: none)").matches) return;
    let raf = 0;
    const tick = () => {
      const el = dotRef.current;
      const target = stateRef.current;
      if (el) {
        pos.current.x += (target.x - pos.current.x) * 0.15;
        pos.current.y += (target.y - pos.current.y) * 0.15;
        const size = target.active ? 64 : 28;
        el.style.transform = `translate(${pos.current.x - size / 2}px, ${pos.current.y - size / 2}px)`;
        el.style.width = `${size}px`;
        el.style.height = `${size}px`;
        el.style.background = target.active ? target.accentHex : "#F8F8F8";
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [stateRef]);

  if (typeof window !== "undefined" && window.matchMedia("(hover: none)").matches) return null;

  return (
    <div
      ref={dotRef}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[70] hidden rounded-full transition-[width,height] duration-200 sm:block"
      style={{ mixBlendMode: "difference", width: 28, height: 28 }}
    />
  );
}
