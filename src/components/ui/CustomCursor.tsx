"use client";

import { useEffect, useRef } from "react";

/** Anything that should make the cursor grow. */
const INTERACTIVE_SELECTOR =
  'a, button, input, select, textarea, label, summary, [role="button"], [data-cursor="active"]';

const BASE_SIZE = 14;
const ACTIVE_SIZE = 56;

/**
 * Real custom cursor: the native pointer is hidden (desktop fine-pointer
 * only) and replaced by a disc that inverts whatever is underneath via
 * `mix-blend-mode: difference`, growing over interactive elements.
 *
 * Position/size are written straight to the DOM inside a rAF loop —
 * design.md §6 forbids React state updates on pointermove (INP ≤ 150ms).
 * Touch/coarse-pointer devices keep their native behaviour and this
 * renders nothing.
 */
export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const target = useRef({ x: -200, y: -200 });
  const pos = useRef({ x: -200, y: -200 });
  const size = useRef(BASE_SIZE);
  const targetSize = useRef(BASE_SIZE);
  const seen = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    // Only hide the native cursor once we know we're replacing it, so a
    // JS failure can never leave the page with no pointer at all.
    document.documentElement.classList.add("has-custom-cursor");

    const onMove = (e: PointerEvent) => {
      target.current.x = e.clientX;
      target.current.y = e.clientY;
      if (!seen.current) {
        // Avoid the dot flying in from the corner on first move.
        pos.current.x = e.clientX;
        pos.current.y = e.clientY;
        seen.current = true;
      }
    };

    // pointerover bubbles and only fires when the hovered element changes,
    // so this is far cheaper than a closest() lookup on every move.
    const onOver = (e: PointerEvent) => {
      const el = e.target as Element | null;
      const interactive = Boolean(el?.closest?.(INTERACTIVE_SELECTOR));
      targetSize.current = interactive ? ACTIVE_SIZE : BASE_SIZE;
    };

    const onLeaveWindow = () => {
      target.current.x = -200;
      target.current.y = -200;
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerover", onOver, { passive: true });
    document.addEventListener("pointerleave", onLeaveWindow);

    let raf = requestAnimationFrame(function tick() {
      const el = dotRef.current;
      if (el) {
        pos.current.x += (target.current.x - pos.current.x) * 0.18;
        pos.current.y += (target.current.y - pos.current.y) * 0.18;
        size.current += (targetSize.current - size.current) * 0.18;
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
      document.removeEventListener("pointerleave", onLeaveWindow);
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
