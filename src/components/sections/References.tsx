"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { BeforeAfterSlider } from "@/components/ui/BeforeAfterSlider";
import { Pill, SectionIndex } from "@/components/ui/primitives";
import { CASE_STUDIES } from "@/lib/data/caseStudies";
import { ensureGsapRegistered, prefersReducedMotion } from "@/lib/motion";

/**
 * References and case studies (§3/11). Proof that the system works in
 * practice — not praise for the service.
 *
 * A horizontal drag rail with native scroll-snap underneath, so touch
 * keeps its own inertia and the keyboard can still reach every card.
 */
export function References() {
  const railRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail || prefersReducedMotion()) return;
    ensureGsapRegistered();

    // Pointer drag on desktop; touch devices keep native scrolling.
    if (window.matchMedia("(hover: none)").matches) return;

    let dragging = false;
    let startX = 0;
    let startScroll = 0;

    const onDown = (e: PointerEvent) => {
      if ((e.target as HTMLElement).closest("input, a, button")) return;
      dragging = true;
      startX = e.clientX;
      startScroll = rail.scrollLeft;
      rail.style.cursor = "grabbing";
    };
    const onMove = (e: PointerEvent) => {
      if (!dragging) return;
      rail.scrollLeft = startScroll - (e.clientX - startX);
    };
    const onUp = () => {
      dragging = false;
      rail.style.cursor = "";
    };

    rail.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerup", onUp);

    return () => {
      rail.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, []);

  return (
    <section className="relative z-[2] overflow-hidden bg-navy py-[var(--space-10)]">
      <div className="mx-auto max-w-[var(--max-w)] px-[var(--gutter)]">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <SectionIndex index="11" label="REFERENCE" tone="dark" />
            <h2 className="text-display mt-6 max-w-[20ch] text-snow">
              Projekty, u kterých sedí čísla i na konci.
            </h2>
          </div>
          <Pill href="/reference" variant="ghost-dark">
            Zobrazit všechny reference
          </Pill>
        </div>
      </div>

      <div
        ref={railRef}
        className="mt-12 flex snap-x snap-mandatory gap-6 overflow-x-auto px-[var(--gutter)] pb-6"
      >
        {CASE_STUDIES.map((study) => (
          <article
            key={study.slug}
            className="w-[86vw] shrink-0 snap-start rounded-[var(--radius-card)] border border-steel/50 p-6 sm:w-[520px]"
            style={{ background: "rgba(22,50,75,0.55)" }}
          >
            <BeforeAfterSlider
              beforeFrom={study.beforeFrom}
              beforeTo={study.beforeTo}
              afterFrom={study.afterFrom}
              afterTo={study.afterTo}
              label={study.slug}
            />

            <h3 className="text-subheading mt-6 text-snow">{study.name}</h3>
            <p className="text-body-sm mt-1 text-slate-on-dark">
              {study.location} · {study.year}
              {study.hasVideo && " · videoreference"}
            </p>

            <dl className="mt-5 flex flex-col gap-2">
              {study.ledger.map((row) => (
                <div
                  key={row.label}
                  className="flex items-baseline justify-between gap-6 border-b border-steel/30 pb-2 last:border-b-0"
                >
                  <dt className="text-body-sm text-slate-on-dark">{row.label}</dt>
                  <dd className="text-data text-snow">{row.value}</dd>
                </div>
              ))}
            </dl>

            <Link
              href={`/reference/${study.slug}`}
              className="text-label mt-6 inline-flex items-center gap-2 text-emerald-on-dark no-underline"
            >
              Detail případové studie
              <svg width="18" height="10" viewBox="0 0 18 10" fill="none" aria-hidden="true">
                <path d="M0 5h16M11 1l4 4-4 4" stroke="currentColor" strokeWidth="1.2" />
              </svg>
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
