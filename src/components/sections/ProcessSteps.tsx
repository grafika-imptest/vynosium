"use client";

import { useEffect, useRef } from "react";
import { Pill, SectionIndex } from "@/components/ui/primitives";
import { PROCESS_STEPS } from "@/lib/data/site";

/**
 * How we invest — six steps (§3/07).
 *
 * A snap rail the visitor scrolls themselves, not a pinned+scrubbed track.
 *
 * The pinned version is what §8 of the brief calls the riskiest section on
 * the page, and it earned that: it broke three separate ways in testing —
 * ScrollTrigger measuring its range against a document that the preloader's
 * scroll lock had shortened, panel copy pre-hidden by triggers that could
 * never fire, and a connector tween that stayed at zero while its sibling
 * in the same timeline advanced. Each fix exposed the next.
 *
 * What survives here is everything the section was for: six steps read
 * horizontally, one connector line through the numbers, and the vector
 * drawn as you arrive. What is gone is the dependency on pinning, scrubbing
 * and frame timing — the rail is native scrolling with CSS snap, the reveal
 * is one IntersectionObserver toggling a class, and the connector is a CSS
 * transition. Nothing here can leave content invisible or frozen.
 */
export function ProcessSteps() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    /*
     * The hidden start state is applied by JS (`process-anim`), never by the
     * stylesheet: markup that ships hidden and waits for a trigger is how
     * this section lost its content twice already.
     *
     * The reveal then has two independent ways to fire — the observer, and a
     * timer that runs regardless. IntersectionObserver delivery is tied to
     * the rendering pipeline, so a hidden or backgrounded tab can withhold
     * it indefinitely; a timer cannot be withheld. Whichever lands first
     * wins, and "invisible forever" is not reachable.
     */
    section.classList.add("process-anim");

    /*
     * The sweep is an instruction ("this scrolls sideways"), so it retires
     * the moment it is obeyed. Threshold rather than zero: a trackpad's
     * inertia can register a pixel or two without the reader meaning it.
     */
    const rail = section.querySelector<HTMLElement>(".process-rail");
    const onRailScroll = () => {
      if (!rail || rail.scrollLeft < 24) return;
      section.classList.add("process-scrolled");
      rail.removeEventListener("scroll", onRailScroll);
    };
    rail?.addEventListener("scroll", onRailScroll, { passive: true });

    const reveal = () => section.classList.add("process-in");
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          reveal();
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(section);
    const fallback = window.setTimeout(reveal, 4000);

    return () => {
      observer.disconnect();
      window.clearTimeout(fallback);
      rail?.removeEventListener("scroll", onRailScroll);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="jak-investujeme"
      className="process-section relative z-[2] bg-navy py-[var(--space-10)]"
      style={
        {
          /*
           * Step 01 starts exactly where the heading starts: the centring
           * offset of the max-w container plus the gutter. In % of the
           * section, not vw — vw includes the scrollbar, which pushed the
           * rail 8px right of the heading.
           */
          "--track-pad": "calc(max(0px, (100% - var(--max-w)) / 2) + var(--gutter))",
          /* Narrower panels keep the gaps between steps small. */
          "--step-w": "clamp(300px, 30vw, 460px)",
          /* Vertical centre of the index row: where the connector runs. */
          "--step-line-y": "14px",
          /* Length of the travelling segment. Long enough to read as a
             gesture, short enough to stay a hint and not a progress bar. */
          "--sweep-w": "clamp(160px, 22vw, 320px)",
        } as React.CSSProperties
      }
    >
      <div className="mx-auto max-w-[var(--max-w)] px-[var(--gutter)]">
        <SectionIndex index="07" label="JAK INVESTUJEME" tone="dark" />
        <h2 className="text-display-lg mt-6 max-w-[16ch] text-snow">Od první konzultace k výnosu.</h2>
      </div>

      {/*
        Native horizontal scrolling with snap: the visitor sets the pace, and
        the next panel peeking in at the right edge is what signals there is
        more. scroll-padding keeps a snapped panel aligned with the heading.
      */}
      <div
        className="process-rail mt-12 flex snap-x snap-mandatory overflow-x-auto pb-8 pl-[var(--track-pad)] pr-[var(--gutter)]"
        style={{ scrollPaddingLeft: "var(--track-pad)" }}
      >
        {/*
          Connector: one dim rail through every step number, drawn on arrival,
          with a bright segment sweeping along it to say the rail scrolls
          sideways. Both live in .process-line — see globals.css. z-0 with the
          panels above it, so it reads as ground rather than as a rule laid
          over the content.
        */}
        <div
          aria-hidden="true"
          className="process-line pointer-events-none absolute left-[var(--track-pad)] right-0 top-0 z-0 h-px origin-left"
        />

        {PROCESS_STEPS.map((step) => (
          <article
            key={step.index}
            className="process-panel relative z-[1] w-[var(--step-w)] shrink-0 snap-start pr-[var(--space-8)]"
          >
            <p className="text-label flex h-7 w-fit items-center gap-3 bg-navy pr-3 text-emerald-on-dark">
              {/* Node sitting on the connector, at the number's own baseline. */}
              <span
                aria-hidden="true"
                className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-on-dark"
              />
              {step.index}/06
            </p>
            <h3 className="text-heading mt-4 max-w-[18ch] text-snow">{step.title}</h3>
            <p className="text-body mt-3 max-w-[42ch] text-slate-on-dark">{step.text}</p>

            <div className="mt-6 rounded-[var(--radius-card)] border border-steel/50 p-5">
              <p className="text-label text-slate-on-dark">{step.artifact.label}</p>
              <dl className="mt-4 flex flex-col gap-3">
                {step.artifact.rows.map(([label, value]) => (
                  <div
                    key={label}
                    className="flex items-baseline justify-between gap-6 border-b border-steel/30 pb-2 last:border-b-0"
                  >
                    <dt className="text-body-sm text-slate-on-dark">{label}</dt>
                    <dd className="text-data text-snow">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </article>
        ))}

        <div className="process-panel relative z-[1] flex w-[var(--step-w)] shrink-0 snap-start flex-col justify-center gap-5 pr-[var(--gutter)]">
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
    </section>
  );
}
