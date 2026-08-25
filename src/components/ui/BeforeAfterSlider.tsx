"use client";

import { useRef } from "react";

/**
 * Pure pointer-drag reveal, deliberately no GSAP (design.md §3/11: "čistý
 * pointer drag"). Since a "before" photo isn't available yet, both sides
 * render as labeled navy/emerald-graded placeholders — swap the two
 * gradient divs for real before/after media.
 */
export function BeforeAfterSlider({ label }: { label: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const afterRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const setSplit = (clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100));
    if (afterRef.current) afterRef.current.style.clipPath = `inset(0 0 0 ${pct}%)`;
    if (handleRef.current) handleRef.current.style.left = `${pct}%`;
  };

  return (
    <div
      ref={containerRef}
      className="relative aspect-[4/3] w-full touch-none select-none overflow-hidden rounded-[10px]"
      onPointerDown={(e) => {
        dragging.current = true;
        (e.target as HTMLElement).setPointerCapture(e.pointerId);
        setSplit(e.clientX);
      }}
      onPointerMove={(e) => {
        if (dragging.current) setSplit(e.clientX);
      }}
      onPointerUp={() => {
        dragging.current = false;
      }}
    >
      <div
        className="absolute inset-0 flex items-end p-4"
        style={{ background: "linear-gradient(38.5deg, #0b1d2e, #16324b)" }}
      >
        <span className="text-label text-slate">PŘED</span>
      </div>
      <div
        ref={afterRef}
        className="absolute inset-0 flex items-end p-4"
        style={{ background: "linear-gradient(38.5deg, #16324b, #1f8a70)", clipPath: "inset(0 0 0 50%)" }}
      >
        <span className="text-label text-snow">PO</span>
      </div>
      <div
        ref={handleRef}
        className="absolute inset-y-0 w-px bg-emerald"
        style={{ left: "50%" }}
        aria-hidden="true"
      />
      <span className="sr-only">{label} — táhněte pro srovnání stavu před a po rekonstrukci</span>
    </div>
  );
}
