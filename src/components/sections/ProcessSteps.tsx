"use client";

import { useEffect, useRef } from "react";
import { Pill, SectionIndex } from "@/components/ui/primitives";
import { PROCESS_STEPS } from "@/lib/data/site";
import { gsap, ensureGsapRegistered, ScrollTrigger, prefersReducedMotion } from "@/lib/motion";

/**
 * How we invest — six steps (§3/07).
 *
 * Desktop: a pinned horizontal track driven by vertical scroll, with ONE
 * connector line running along the step numbers whose stroke-dashoffset is
 * scrubbed to progress — the line is drawn from step to step exactly as the
 * model is explained, and it stays welded to the numbers because it lives
 * inside the moving track.
 *
 * Mobile: the pin is REMOVED, not shrunk. Six full-width blocks stack and
 * the vector is drawn vertically in the left margin, so the metaphor
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
            /*
             * Tuned to the panel width: the narrower panels travel ~2400px,
             * and 340% of a 900px viewport gives ~0.8px of movement per px
             * of scroll — roughly 600px of scroll per step, enough to read
             * one without the section overstaying.
             */
            end: "+=340%",
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

        /*
         * Panel copy fades in when the panel itself arrives — which means
         * the trigger has to measure the panel inside the horizontally
         * scrubbed track, not guess from vertical scroll offsets.
         * `containerAnimation` is exactly that: it maps the panel's
         * position within `tl` to scroll progress.
         *
         * The previous version keyed each panel to `top+=${i * 60}%` of the
         * section, which has no relation to the track's travel rate: the
         * panels moved through the viewport far ahead of their triggers, so
         * you scrolled past empty navy boxes and the text only appeared
         * once the panel was already leaving.
         */
        const panels = gsap.utils.toArray<HTMLElement>(".process-panel", section);
        panels.forEach((panel) => {
          gsap.fromTo(
            panel.querySelectorAll(".process-fade"),
            { y: 24, autoAlpha: 0 },
            {
              y: 0,
              autoAlpha: 1,
              duration: 0.5,
              ease: "expo.out",
              stagger: 0.06,
              /*
               * Critical: without this, `fromTo` applies the hidden state
               * immediately. The first two panels are already on screen when
               * the pin starts, so their trigger never fires — and they sat
               * at opacity 0 forever. Empty navy boxes were exactly what you
               * were scrolling through.
               */
              immediateRender: false,
              scrollTrigger: {
                trigger: panel,
                containerAnimation: tl,
                // Panel's left edge crossing 88% of the viewport width.
                start: "left 88%",
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
      style={
        {
          /*
           * Step 01 has to start exactly where the heading starts. The
           * heading sits in a centred max-w container, so its left edge is
           * the centring offset plus the gutter — the track needs the same
           * padding, otherwise it hangs left of the heading on wide screens.
           */
          "--track-pad": "calc(max(0px, (100vw - var(--max-w)) / 2) + var(--gutter))",
          /* Narrower panels = smaller gaps between steps. */
          "--step-w": "clamp(340px, 30vw, 500px)",
          /* Vertical centre of the index row: where the connector runs. */
          "--step-line-y": "14px",
        } as React.CSSProperties
      }
    >
      <div className="mx-auto max-w-[var(--max-w)] px-[var(--gutter)] lg:pt-[var(--space-10)]">
        <SectionIndex index="07" label="JAK INVESTUJEME" tone="dark" />
        <h2 className="text-display-lg mt-6 max-w-[16ch] text-snow">Od první konzultace k výnosu.</h2>
      </div>

      <div className="relative mt-12 lg:mt-16">
        {/* Mobile: the vector, drawn vertically in the left margin. */}
        <svg
          aria-hidden="true"
          className="absolute left-2 top-0 h-full w-4 lg:hidden"
          viewBox="0 0 10 1000"
          preserveAspectRatio="none"
        >
          <line ref={vLineRef} x1="5" y1="1000" x2="5" y2="0" stroke="#1f8a70" strokeWidth="1.5" />
        </svg>

        {/*
          The track carries the connector line itself, so the line travels
          with the panels and stays welded to the step numbers instead of
          drifting behind them. Its own dash offset is scrubbed by the same
          timeline, so it draws from one step to the next as you scroll.
        */}
        <div
          ref={trackRef}
          className="flex flex-col gap-8 pl-10 lg:relative lg:flex-row lg:gap-0 lg:pl-[var(--track-pad)]"
        >
          <svg
            aria-hidden="true"
            className="pointer-events-none absolute left-0 top-[var(--step-line-y)] hidden h-px w-full lg:block"
            preserveAspectRatio="none"
            viewBox="0 0 1000 1"
          >
            <line
              ref={lineRef}
              x1="0"
              y1="0.5"
              x2="1000"
              y2="0.5"
              stroke="url(#process-gradient)"
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
            />
            <defs>
              <linearGradient id="process-gradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#243b53" />
                <stop offset="30%" stopColor="#16506b" />
                <stop offset="100%" stopColor="#35b795" />
              </linearGradient>
            </defs>
          </svg>

          {PROCESS_STEPS.map((step) => (
            <article
              key={step.index}
              className="process-panel w-full shrink-0 lg:w-[var(--step-w)] lg:pr-[var(--space-8)]"
            >
              <p className="process-fade text-label flex h-7 items-center gap-3 text-emerald-on-dark">
                {/* Node on the connector line, at the number's own baseline. */}
                <span aria-hidden="true" className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-on-dark" />
                {step.index}/06
              </p>
              <h3 className="process-fade text-heading mt-4 max-w-[18ch] text-snow">{step.title}</h3>
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

          <div className="process-panel flex w-full shrink-0 flex-col justify-center gap-4 lg:w-[var(--step-w)] lg:pr-[var(--gutter)]">
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
