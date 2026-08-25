"use client";

import { useEffect, useRef } from "react";

/**
 * Before/after split (§3/11).
 *
 * Pure pointer drag — no GSAP, no React state. The divider position is
 * written directly to the DOM, so dragging costs one style write per
 * frame instead of a render. Works with tap-and-hold, drag and keyboard.
 */
export function BeforeAfterSlider({
  beforeFrom,
  beforeTo,
  afterFrom,
  afterTo,
  label,
}: {
  beforeFrom: string;
  beforeTo: string;
  afterFrom: string;
  afterTo: string;
  label: string;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const afterRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const apply = (ratio: number) => {
    const clamped = Math.min(Math.max(ratio, 0), 1);
    const percent = clamped * 100;
    if (afterRef.current) afterRef.current.style.clipPath = `inset(0 0 0 ${percent}%)`;
    if (handleRef.current) handleRef.current.style.left = `${percent}%`;
  };

  useEffect(() => {
    apply(0.5);
    const root = rootRef.current;
    if (!root) return;

    let dragging = false;

    const ratioFrom = (clientX: number) => {
      const rect = root.getBoundingClientRect();
      return (clientX - rect.left) / rect.width;
    };

    const onDown = (e: PointerEvent) => {
      dragging = true;
      root.setPointerCapture(e.pointerId);
      const ratio = ratioFrom(e.clientX);
      apply(ratio);
      if (inputRef.current) inputRef.current.value = String(Math.round(ratio * 100));
    };
    const onMove = (e: PointerEvent) => {
      if (!dragging) return;
      const ratio = ratioFrom(e.clientX);
      apply(ratio);
      if (inputRef.current) inputRef.current.value = String(Math.round(ratio * 100));
    };
    const onUp = (e: PointerEvent) => {
      dragging = false;
      if (root.hasPointerCapture(e.pointerId)) root.releasePointerCapture(e.pointerId);
    };

    root.addEventListener("pointerdown", onDown);
    root.addEventListener("pointermove", onMove, { passive: true });
    root.addEventListener("pointerup", onUp);
    root.addEventListener("pointercancel", onUp);

    return () => {
      root.removeEventListener("pointerdown", onDown);
      root.removeEventListener("pointermove", onMove);
      root.removeEventListener("pointerup", onUp);
      root.removeEventListener("pointercancel", onUp);
    };
  }, []);

  return (
    <div className="relative">
      <div
        ref={rootRef}
        className="relative aspect-[16/10] w-full touch-none overflow-hidden rounded-[var(--radius-card)] border border-steel/50"
        style={{ background: `linear-gradient(38.5deg, ${beforeFrom}, ${beforeTo})` }}
      >
        <span className="text-label absolute left-4 top-4 z-[2] text-snow/70">Před</span>

        <div
          ref={afterRef}
          className="absolute inset-0"
          style={{ background: `linear-gradient(38.5deg, ${afterFrom}, ${afterTo})` }}
        >
          <span className="text-label absolute right-4 top-4 text-snow">Po</span>
        </div>

        <div
          ref={handleRef}
          aria-hidden="true"
          className="absolute inset-y-0 w-px bg-emerald"
          style={{ left: "50%" }}
        >
          <span className="absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full border border-emerald bg-navy" />
        </div>
      </div>

      {/* Keyboard-accessible mirror of the drag. */}
      <label className="sr-only" htmlFor={`split-${label}`}>
        Poměr zobrazení před a po rekonstrukci — {label}
      </label>
      <input
        ref={inputRef}
        id={`split-${label}`}
        type="range"
        min={0}
        max={100}
        defaultValue={50}
        className="calc-range focus-ring mt-3"
        onInput={(e) => apply(Number(e.currentTarget.value) / 100)}
      />
    </div>
  );
}
