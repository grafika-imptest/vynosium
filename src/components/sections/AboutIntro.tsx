"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, ensureGsapRegistered, prefersReducedMotion } from "@/lib/motion";
import { Pill } from "@/components/ui/Pill";
import { SectionIndex } from "@/components/ui/SectionIndex";

const MODULES = ["Výběr", "Prověření", "Financování", "Rekonstrukce", "Pronájem", "Prodej", "Správa"];

// Seven points on the identity vector (38.5°), evenly spaced.
const POINTS: [number, number][] = [
  [20, 420],
  [66.7, 382.9],
  [113.3, 345.8],
  [160, 308.6],
  [206.7, 271.5],
  [253.3, 234.4],
  [300, 197.3],
];

const PATH_D = `M ${POINTS.map(([x, y]) => `${x},${y}`).join(" L ")}`;

/** design.md §3/06 — "one partner for the whole process", made visually literal. */
export function AboutIntro() {
  const sectionRef = useRef<HTMLElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const dotsRef = useRef<(SVGCircleElement | null)[]>([]);
  const labelsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    ensureGsapRegistered();
    const reduced = prefersReducedMotion();
    const ctx = gsap.context(() => {
      const path = pathRef.current;
      if (!path) return;
      const length = path.getTotalLength();
      gsap.set(path, { strokeDasharray: length, strokeDashoffset: reduced ? 0 : length });
      gsap.set(dotsRef.current, { opacity: reduced ? 1 : 0.15 });
      gsap.set(labelsRef.current, { opacity: reduced ? 1 : 0.3 });

      if (reduced) return;

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 75%",
        end: "bottom 60%",
        scrub: 0.6,
        onUpdate: (self) => {
          gsap.set(path, { strokeDashoffset: length * (1 - self.progress) });
          const litCount = Math.floor(self.progress * MODULES.length + 0.5);
          dotsRef.current.forEach((el, i) => {
            if (el) gsap.to(el, { opacity: i < litCount ? 1 : 0.15, duration: 0.3 });
          });
          labelsRef.current.forEach((el, i) => {
            if (el) gsap.to(el, { opacity: i < litCount ? 1 : 0.3, duration: 0.3 });
          });
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="bg-white py-[var(--space-10)]" data-scene="about-intro">
      <div className="mx-auto grid max-w-[var(--max-w)] grid-cols-1 gap-12 px-[var(--gutter)] lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-5">
          <SectionIndex index="06" label="VYNÓSIUM" tone="light" className="mb-6" />
          <h2 className="text-display text-navy">Investování do nemovitostí nemusí být složité.</h2>
          <p className="text-body-sm mt-5 max-w-[46ch] text-text-secondary">
            Výběr příležitosti, prověření, financování, rekonstrukci, pronájem i prodej
            řešíme jako jeden propojený proces s jedním partnerem, ne sérii oddělených
            dodavatelů.
          </p>
          <Pill href="/jak-investujeme" variant="ghost-light" className="mt-7">
            Jak Vynósium funguje
          </Pill>
        </div>

        <div className="lg:col-span-7">
          <svg viewBox="0 0 340 460" className="w-full" role="img" aria-label="Diagram propojeného investičního procesu Vynósium" data-om-raster>
            <path ref={pathRef} d={PATH_D} fill="none" stroke="var(--color-emerald)" strokeWidth={1.5} />
            {POINTS.map(([x, y], i) => (
              <circle
                key={i}
                ref={(el) => {
                  dotsRef.current[i] = el;
                }}
                cx={x}
                cy={y}
                r={4}
                fill="var(--color-emerald)"
              />
            ))}
          </svg>
          <div className="mt-2 grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-4">
            {MODULES.map((label, i) => (
              <div
                key={label}
                ref={(el) => {
                  labelsRef.current[i] = el;
                }}
                className="flex items-center gap-2"
              >
                <span className="text-label text-text-muted">{String(i + 1).padStart(2, "0")}</span>
                <span className="text-body-sm text-navy">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
