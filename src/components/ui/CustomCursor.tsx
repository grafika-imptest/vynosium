"use client";

import { useEffect, useRef } from "react";

/** Elements that make the magnet grow and pick up the local token colour. */
const INTERACTIVE_SELECTOR =
  'a, button, input, select, textarea, label, summary, [role="button"], [data-cursor="active"]';

const BASE_SIZE = 14;
const ACTIVE_SIZE = 56;

/**
 * Cursor magnet (§4.5): a disc that inverts whatever is underneath via
 * `mix-blend-mode: difference` and grows over interactive zones.
 *
 * Position and size are written straight to the DOM inside a rAF loop —
 * §6 forbids React state updates on pointermove (INP ≤ 150 ms). Coarse
 * pointers keep their native behaviour and this renders nothing.
 */
export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const target = useRef({ x: -200, y: -200 });
  const pos = useRef({ x: -200, y: -200 });
  const size = useRef(BASE_SIZE);
  const targetSize = useRef(BASE_SIZE);
  const seen = useRef(false);

  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    // Hide the native cursor only once we know we are replacing it, so a
    // JS failure can never leave the page with no pointer at all.
    document.documentElement.classList.add("has-custom-cursor");

    const onMove = (e: PointerEvent) => {
      target.current.x = e.clientX;
      target.current.y = e.clientY;
      if (!seen.current) {
        pos.current.x = e.clientX;
        pos.current.y = e.clientY;
        seen.current = true;
      }
    };

    // pointerover bubbles and only fires when the hovered element changes,
    // so this is far cheaper than a closest() lookup on every move.
    const onOver = (e: PointerEvent) => {
      const el = e.target as Element | null;
      targetSize.current = el?.closest?.(INTERACTIVE_SELECTOR) ? ACTIVE_SIZE : BASE_SIZE;
    };

    const onLeave = () => {
      target.current.x = -200;
      target.current.y = -200;
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerover", onOver, { passive: true });
    document.addEventListener("pointerleave", onLeave);

    let raf = requestAnimationFrame(function tick() {
      const el = dotRef.current;
      if (el) {
        pos.current.x += (target.current.x - pos.current.x) * 0.15;
        pos.current.y += (target.current.y - pos.current.y) * 0.15;
        size.current += (targetSize.current - size.current) * 0.15;
        const s = size.current;
        el.style.width = `${s}px`;
        el.style.height = `${s}px`;
        el.style.transform = `translate3d(${pos.current.x - s / 2}px, ${pos.current.y - s / 2}px, 0)`;
      }
      raf = requestAnimationFrame(tick);
    });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
      document.removeEventListener("pointerleave", onLeave);
      document.documentElement.classList.remove("has-custom-cursor");
    };
  }, []);

  return (
    <div
      ref={dotRef}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[200] hidden rounded-full bg-white [html.has-custom-cursor_&]:block"
      style={{ mixBlendMode: "difference", width: BASE_SIZE, height: BASE_SIZE }}
    />
  );
}
