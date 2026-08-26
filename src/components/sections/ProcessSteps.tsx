"use client";

import { useEffect, useRef } from "react";
import { Pill, SectionIndex } from "@/components/ui/primitives";
import { PROCESS_STEPS } from "@/lib/data/site";
import { gsap, ensureGsapRegistered, ScrollTrigger, prefersReducedMotion } from "@/lib/motion";
import { VECTOR_ANGLE_DEG } from "@/lib/tokens";

/**
 * How we invest — six steps (§3/07).
 *
 * Desktop: a pinned horizontal track of six 60vw panels driven by
 * vertical scroll, with ONE line running its whole length at 38.5° whose
 * stroke-dashoffset is scrubbed to progress — the monogram's arrow is
 * literally drawn as the model is explained.
 *
 * Mobile: the pin is REMOVED, not shrunk. Six full-width blocks stack and
 * the same vector is drawn vertically in the left margin, so the metaphor
 * survives the layout change instead of fighting native scrolling.
 */
export function ProcessSteps() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<SVGLineElement>(null);
  const vLineRef = useRef<SVGLineElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;
    ensureGsapRegistered();

    const ctx = gsap.context(() => {
      const reduced = prefersReducedMotion();

      const mm = gsap.matchMedia();

      mm.add("(min-width: 1024px)", () => {
        if (reduced) return;

        const distance = () => track.scrollWidth - window.innerWidth + 80;

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "+=420%",
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
          },
        });

        // Scrubbed movement never eases (§5).
        tl.to(track, { x: () => -distance(), ease: "none" }, 0);

        const line = lineRef.current;
        if (line) {
          const length = line.getTotalLength();
          gsap.set(line, { strokeDasharray: length, strokeDashoffset: length });
          tl.to(line, { strokeDashoffset: 0, ease: "none" }, 0);
        }

        gsap.utils.toArray<HTMLElement>(".process-panel").forEach((panel, i) => {
          gsap.fromTo(
            panel.querySelectorAll(".process-fade"),
            { y: 24, autoAlpha: 0 },
            {
              y: 0,
              autoAlpha: 1,
              duration: 0.5,
              ease: "expo.out",
              stagger: 0.06,
              scrollTrigger: {
                trigger: section,
                start: () => `top+=${i * 60}% top`,
                toggleActions: "play none none reverse",
              },
            }
          );
        });

        return () => tl.kill();
      });

      mm.add("(max-width: 1023px)", () => {
        const vLine = vLineRef.current;
        if (!vLine || reduced) return;
        const length = vLine.getTotalLength();
        gsap.set(vLine, { strokeDasharray: length, strokeDashoffset: length });
        gsap.to(vLine, {
          strokeDashoffset: 0,
          ease: "none",
          scrollTrigger: { trigger: section, start: "top 80%", end: "bottom 60%", scrub: 1 },
        });
      });

      ScrollTrigger.refresh();
      return () => mm.revert();
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="jak-investujeme"
      className="relative z-[2] overflow-hidden bg-navy py-[var(--space-10)] lg:py-0"
    >
      <div className="mx-auto max-w-[var(--max-w)] px-[var(--gutter)] lg:pt-[var(--space-10)]">
        <SectionIndex index="07" label="JAK INVESTUJEME" tone="dark" />
        <h2 className="text-display-lg mt-6 max-w-[16ch] text-snow">Od první konzultace k výnosu.</h2>
      </div>

      {/* Desktop: the vector runs the full length of the pinned track. */}
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-1/2 hidden h-[420px] w-full lg:block"
        viewBox="0 0 1000 420"
        preserveAspectRatio="none"
      >
        <line
          ref={lineRef}
          x1="0"
          y1="400"
          x2="1000"
          y2={400 - 1000 * Math.tan((VECTOR_ANGLE_DEG * Math.PI) / 180) * 0.12}
          stroke="url(#process-gradient)"
          strokeWidth="1.5"
        />
        <defs>
          <linearGradient id="process-gradient" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0%" stopColor="#243b53" />
            <stop offset="46%" stopColor="#16506b" />
            <stop offset="100%" stopColor="#1f8a70" />
          </linearGradient>
        </defs>
      </svg>

      <div className="relative mt-12 lg:mt-16 lg:h-[62vh]">
        {/* Mobile: same vector, drawn vertically in the left margin. */}
        <svg
          aria-hidden="true"
          className="absolute left-2 top-0 h-full w-4 lg:hidden"
          viewBox="0 0 10 1000"
          preserveAspectRatio="none"
        >
          <line ref={vLineRef} x1="5" y1="1000" x2="5" y2="0" stroke="#1f8a70" strokeWidth="1.5" />
        </svg>

        <div
          ref={trackRef}
          className="flex flex-col gap-8 pl-10 lg:flex-row lg:gap-0 lg:pl-[var(--gutter)]"
        >
          {PROCESS_STEPS.map((step) => (
            <article
              key={step.index}
              className="process-panel w-full shrink-0 lg:w-[60vw] lg:pr-[var(--space-10)]"
            >
              <p className="process-fade text-label text-emerald-on-dark">
                {step.index}/06
              </p>
              <h3 className="process-fade text-heading mt-5 max-w-[18ch] text-snow">{step.title}</h3>
              <p className="process-fade text-body mt-4 max-w-[46ch] text-slate-on-dark">{step.text}</p>

              <div className="process-fade mt-8 max-w-[380px] rounded-[var(--radius-card)] border border-steel/50 p-5">
                <p className="text-label text-slate-on-dark">{step.artifact.label}</p>
                <dl className="mt-4 flex flex-col gap-3">
                  {step.artifact.rows.map(([label, value]) => (
                    <div key={label} className="flex items-baseline justify-between gap-6 border-b border-steel/30 pb-2 last:border-b-0">
                      <dt className="text-body-sm text-slate-on-dark">{label}</dt>
                      <dd className="text-data text-snow">{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </article>
          ))}

          <div className="process-panel flex w-full shrink-0 flex-col justify-center gap-4 lg:w-[40vw] lg:pr-[var(--gutter)]">
            <p className="text-body max-w-[36ch] text-slate-on-dark">
              Každý krok má vlastní výstup, který dostanete písemně. Žádná fáze nezačíná dřív, než je
              uzavřená ta předchozí.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Pill href="#rozcestnik" variant="ghost-dark">
                Vybrat svou cestu
              </Pill>
              <Pill href="/kontakt" variant="emerald">
                Nezávazná konzultace
              </Pill>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
