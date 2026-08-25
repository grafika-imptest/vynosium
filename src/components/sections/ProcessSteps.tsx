"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, ensureGsapRegistered, prefersReducedMotion } from "@/lib/motion";
import { Pill } from "@/components/ui/Pill";
import { SectionIndex } from "@/components/ui/SectionIndex";
import { PROCESS_STEPS } from "@/lib/data/processSteps";

/**
 * Pinned horizontal drive on desktop (6 panels × 60vw, master scrub draws
 * the identity vector alongside it); a vertical stack with the same line
 * drawn in the left margin on mobile, where the horizontal pin is
 * disabled outright rather than shrunk (design.md §3/07 — fighting native
 * scroll on mobile is explicitly called out as the wrong trade-off).
 */
export function ProcessSteps() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const lineDesktopRef = useRef<SVGPathElement>(null);
  const lineMobileRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    ensureGsapRegistered();
    const reduced = prefersReducedMotion();

    if (reduced) return;

    const mm = gsap.matchMedia();

    mm.add(
      {
        isDesktop: "(min-width: 1024px)",
        isMobile: "(max-width: 1023px)",
      },
      (context) => {
        const { isDesktop } = context.conditions as { isDesktop: boolean };

        if (isDesktop && trackRef.current && sectionRef.current) {
          const track = trackRef.current;
          const line = lineDesktopRef.current;
          const totalScroll = () => track.scrollWidth - window.innerWidth;
          if (line) {
            const len = line.getTotalLength();
            gsap.set(line, { strokeDasharray: len, strokeDashoffset: len });
          }

          const st = ScrollTrigger.create({
            trigger: sectionRef.current,
            start: "top top",
            end: () => `+=${totalScroll()}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              gsap.set(track, { x: -totalScroll() * self.progress });
              if (line) {
                const len = line.getTotalLength();
                gsap.set(line, { strokeDashoffset: len * (1 - self.progress) });
              }
            },
          });

          return () => st.kill();
        }

        // Mobile: vertical scrub, no pin.
        const line = lineMobileRef.current;
        if (line && sectionRef.current) {
          const len = line.getTotalLength();
          gsap.set(line, { strokeDasharray: len, strokeDashoffset: len });
          const st = ScrollTrigger.create({
            trigger: sectionRef.current,
            start: "top 80%",
            end: "bottom bottom",
            scrub: 0.6,
            onUpdate: (self) => gsap.set(line, { strokeDashoffset: len * (1 - self.progress) }),
          });
          return () => st.kill();
        }
      }
    );

    return () => mm.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-navy" data-scene="process-steps">
      <div className="relative z-10 px-[var(--gutter)] pt-[var(--space-9)] lg:absolute lg:inset-x-0 lg:top-0 lg:pt-[var(--space-8)]">
        <SectionIndex index="07" label="JAK INVESTUJEME" tone="dark" className="mb-4" />
        <h2 className="text-display-lg max-w-[14ch] text-snow">Od první konzultace k výnosu.</h2>
      </div>

      {/* Desktop: horizontal pinned track */}
      <div className="relative hidden h-screen items-center overflow-hidden lg:flex">
        <svg
          className="pointer-events-none absolute inset-0 h-full w-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            ref={lineDesktopRef}
            d="M 0 90 L 100 10"
            vectorEffect="non-scaling-stroke"
            stroke="var(--color-emerald)"
            strokeWidth={1.5}
            fill="none"
          />
        </svg>
        <div ref={trackRef} className="flex will-change-transform">
          {PROCESS_STEPS.map((step, i) => (
            <div key={step.title} className="flex w-[60vw] shrink-0 flex-col justify-center px-10">
              <p className="text-label text-slate">{String(i + 1).padStart(2, "0")}/06</p>
              <h3 className="text-display mt-4 max-w-[14ch] text-snow">{step.title}</h3>
              <p className="text-body-sm mt-4 max-w-[46ch] text-slate">{step.text}</p>
              <div className="mt-6 border-t border-steel/40 pt-4">
                <p className="text-label text-slate">{step.artifactLabel}</p>
                <p className="text-metric mt-1 text-emerald">{step.artifactValue}</p>
              </div>
              {i === PROCESS_STEPS.length - 1 && (
                <div className="mt-8 flex flex-wrap gap-4">
                  <Pill href="#rozcestnik" variant="ghost-dark">
                    Vybrat svou cestu
                  </Pill>
                  <Pill href="/kontakt" variant="emerald">
                    Nezávazná konzultace
                  </Pill>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Mobile: vertical stack */}
      <div className="relative flex flex-col gap-12 px-[var(--gutter)] py-[var(--space-9)] lg:hidden">
        <svg
          className="pointer-events-none absolute left-[calc(var(--gutter)/2)] top-0 h-full w-px"
          viewBox="0 0 1 100"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            ref={lineMobileRef}
            d="M 0.5 0 L 0.5 100"
            vectorEffect="non-scaling-stroke"
            stroke="var(--color-emerald)"
            strokeWidth={1.5}
          />
        </svg>
        {PROCESS_STEPS.map((step, i) => (
          <div key={step.title} className="pl-6">
            <p className="text-label text-slate">{String(i + 1).padStart(2, "0")}/06</p>
            <h3 className="text-display mt-3 text-snow">{step.title}</h3>
            <p className="text-body-sm mt-3 max-w-[46ch] text-slate">{step.text}</p>
            <div className="mt-5 border-t border-steel/40 pt-3">
              <p className="text-label text-slate">{step.artifactLabel}</p>
              <p className="text-metric mt-1 text-emerald">{step.artifactValue}</p>
            </div>
          </div>
        ))}
        <div className="flex flex-col gap-4 pl-6">
          <Pill href="#rozcestnik" variant="ghost-dark">
            Vybrat svou cestu
          </Pill>
          <Pill href="/kontakt" variant="emerald">
            Nezávazná konzultace
          </Pill>
        </div>
      </div>
    </section>
  );
}
