"use client";

import Link from "next/link";
import { useRef } from "react";
import { SectionIndex } from "@/components/ui/SectionIndex";
import { Pill } from "@/components/ui/Pill";
import { BeforeAfterSlider } from "@/components/ui/BeforeAfterSlider";
import { CASE_STUDIES } from "@/lib/data/caseStudies";

/**
 * Horizontal rail. A dedicated per-rail Lenis instance would be the fully
 * faithful "inertial drag" per design.md, but that's a large addition for
 * one rail — native overflow-x with scroll-snap plus a lightweight
 * pointer-drag-to-scroll gets the same interaction at a fraction of the
 * complexity, and stays honest about the trade-off.
 */
export function References() {
  const railRef = useRef<HTMLDivElement>(null);
  const dragState = useRef({ dragging: false, startX: 0, startScroll: 0 });

  return (
    <section className="bg-navy py-[var(--space-10)]" data-scene="references">
      <div className="mx-auto max-w-[var(--max-w)] px-[var(--gutter)]">
        <SectionIndex index="11" label="REFERENCE" tone="dark" className="mb-6" />
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <h2 className="text-display-lg max-w-[16ch] text-snow">Důkaz, že systém funguje v praxi.</h2>
          <Pill href="/reference" variant="ghost-dark">
            Zobrazit všechny reference
          </Pill>
        </div>
      </div>

      <div
        ref={railRef}
        className="mt-10 flex cursor-grab gap-6 overflow-x-auto px-[var(--gutter)] pb-4 [scrollbar-width:none] active:cursor-grabbing [&::-webkit-scrollbar]:hidden"
        style={{ scrollSnapType: "x proximity" }}
        onPointerDown={(e) => {
          const el = railRef.current;
          if (!el) return;
          dragState.current = { dragging: true, startX: e.clientX, startScroll: el.scrollLeft };
          el.setPointerCapture(e.pointerId);
        }}
        onPointerMove={(e) => {
          const el = railRef.current;
          if (!el || !dragState.current.dragging) return;
          el.scrollLeft = dragState.current.startScroll - (e.clientX - dragState.current.startX);
        }}
        onPointerUp={() => {
          dragState.current.dragging = false;
        }}
      >
        {CASE_STUDIES.map((study) => (
          <article
            key={study.slug}
            className="w-[min(85vw,420px)] shrink-0 rounded-[10px] border border-steel/50 bg-surface-1 p-6"
            style={{ scrollSnapAlign: "start" }}
          >
            <BeforeAfterSlider label={study.name} />
            <h3 className="text-subheading mt-5 text-snow">{study.name}</h3>
            <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-steel/40 pt-4">
              <Metric label="Pořizovací cena" value={study.purchasePrice} />
              <Metric label="Náklady na rekonstrukci" value={study.renovationCost} />
              <Metric label="Délka realizace" value={study.duration} />
              <Metric label="Výsledek" value={study.result} />
            </dl>
            <div className="mt-4 border-t border-steel/40 pt-4">
              <p className="text-label text-slate">{study.outcomeLabel}</p>
              <p className="text-metric mt-1 text-emerald">{study.outcomeValue}</p>
            </div>
            <Link
              href={`/reference/${study.slug}`}
              className="focus-ring mt-5 inline-flex text-sm text-snow underline decoration-steel underline-offset-4 hover:decoration-emerald"
            >
              Celá případová studie
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-label text-slate">{label}</dt>
      <dd className="text-data mt-1 text-snow">{value}</dd>
    </div>
  );
}
