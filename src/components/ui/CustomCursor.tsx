"use client";

import { useEffect, useRef } from "react";
import { PathGlyph } from "@/components/ui/primitives";
import { INVESTMENT_PATHS } from "@/lib/data/paths";
import type { InvestmentPath } from "@/lib/tokens";

/** Elements that make the magnet grow and pick up the local token colour. */
const INTERACTIVE_SELECTOR =
  'a, button, input, select, textarea, label, summary, [role="button"], [data-cursor="active"]';

const BASE_SIZE = 14;
const ACTIVE_SIZE = 56;
/** With a glyph inside, the disc has to be wide enough to read it. */
const GLYPH_SIZE = 84;

/**
 * Accent hand-off. Sections that own a colour (the path selector tones the
 * whole room per card) push their token in here and the magnet takes it —
 * together with that path's glyph, so the cursor says which strategy is
 * under it, not just which colour.
 *
 * A module-scoped ref rather than context or state on purpose: this is read
 * inside the rAF loop, and §6 forbids a React render on pointer move.
 */
const accent: { hex: string | null; path: InvestmentPath | null } = { hex: null, path: null };

export function setCursorAccent(hex: string | null, path: InvestmentPath | null = null) {
  accent.hex = hex;
  accent.path = hex ? path : null;
}

/**
 * Cursor magnet (§4.5): a disc that inverts whatever is underneath via
 * `mix-blend-mode: difference` and grows over interactive zones. Over a path
 * card it takes that path's colour and shows its glyph.
 *
 * Position, size and the glyph swap are written straight to the DOM inside a
 * rAF loop — §6 forbids React state updates on pointermove (INP ≤ 150 ms).
 * All four glyphs are mounted once and toggled; nothing is built per frame.
 * Coarse pointers keep their native behaviour and this renders nothing.
 */
export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const target = useRef({ x: -200, y: -200 });
  const pos = useRef({ x: -200, y: -200 });
  const size = useRef(BASE_SIZE);
  const targetSize = useRef(BASE_SIZE);
  const hoverSize = useRef(BASE_SIZE);
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
      hoverSize.current = el?.closest?.(INTERACTIVE_SELECTOR) ? ACTIVE_SIZE : BASE_SIZE;
    };

    const onLeave = () => {
      target.current.x = -200;
      target.current.y = -200;
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerover", onOver, { passive: true });
    document.addEventListener("pointerleave", onLeave);

    let appliedAccent: string | null = null;
    let appliedPath: InvestmentPath | null = null;

    let raf = requestAnimationFrame(function tick() {
      const el = dotRef.current;
      if (el) {
        // A glyph needs the bigger disc regardless of what is hovered.
        targetSize.current = accent.path ? GLYPH_SIZE : hoverSize.current;

        pos.current.x += (target.current.x - pos.current.x) * 0.15;
        pos.current.y += (target.current.y - pos.current.y) * 0.15;
        size.current += (targetSize.current - size.current) * 0.15;
        const s = size.current;
        el.style.width = `${s}px`;
        el.style.height = `${s}px`;
        el.style.transform = `translate3d(${pos.current.x - s / 2}px, ${pos.current.y - s / 2}px, 0)`;

        // Only touch the paint properties when the accent actually changed.
        // `difference` blending is what makes the plain white disc legible
        // on any ground, but differencing a *hue* muddies it — an accent
        // disc therefore paints normally.
        if (accent.hex !== appliedAccent) {
          appliedAccent = accent.hex;
          el.style.backgroundColor = accent.hex ?? "#ffffff";
          el.style.mixBlendMode = accent.hex ? "normal" : "difference";
        }

        if (accent.path !== appliedPath) {
          appliedPath = accent.path;
          for (const glyph of el.children) {
            const active = (glyph as HTMLElement).dataset.path === accent.path;
            (glyph as HTMLElement).style.opacity = active ? "1" : "0";
          }
        }
      }
      raf = requestAnimationFrame(tick);
    });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
      document.removeEventListener("pointerleave", onLeave);
      document.documentElement.classList.remove("has-custom-cursor");
      accent.hex = null;
      accent.path = null;
    };
  }, []);

  return (
    <div
      ref={dotRef}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[200] hidden place-items-center rounded-full bg-white [html.has-custom-cursor_&]:grid"
      style={{ mixBlendMode: "difference", width: BASE_SIZE, height: BASE_SIZE }}
    >
      {INVESTMENT_PATHS.map((path) => (
        <span
          key={path.id}
          data-path={path.id}
          /*
           * Sized in percent, so the glyph grows with the disc without a
           * second write per frame. Abyss rather than white: every path
           * token is a mid-to-light hue, and dark line art is the only
           * thing that reads on all four.
           */
          className="col-start-1 row-start-1 grid h-[38%] w-[38%] place-items-center text-abyss opacity-0 transition-opacity duration-150"
        >
          <PathGlyph path={path.id} className="h-full w-full" />
        </span>
      ))}
    </div>
  );
}
