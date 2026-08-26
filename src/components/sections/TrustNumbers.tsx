"use client";

import { useEffect, useRef } from "react";
import { SectionIndex } from "@/components/ui/primitives";
import { TRUST_NUMBERS } from "@/lib/data/site";
import { gsap, ensureGsapRegistered, ScrollTrigger, prefersReducedMotion } from "@/lib/motion";

/**
 * Credibility numbers (§3/02).
 *
 * No WebGL and no cards — four columns divided by full-height hairlines.
 * The section has to feel like paper so it contrasts with the fluid hero;
 * alternating shader and ascetic sections is what stops the site reading
 * as a WebGL demo. Every number carries its basis.
 */
export function TrustNumbers() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    ensureGsapRegistered();
    const ctx = gsap.context(() => {
      if (prefersReducedMotion()) return;

      const trigger = { trigger: sectionRef.current, start: "top 70%" };

      gsap.fromTo(
        ".trust-line",
        { scaleY: 0 },
        { scaleY: 1, duration: 0.7, ease: "power2.out", transformOrigin: "top", scrollTrigger: trigger }
      );

      gsap.utils.toArray<HTMLElement>(".trust-value").forEach((el, i) => {
        const target = Number(el.dataset.value ?? 0);
        const decimals = Number(el.dataset.decimals ?? 0);
        const glue = el.dataset.glue ?? "";
        const counter = { v: 0 };

        gsap.to(counter, {
          v: target,
          duration: 1.6,
          delay: i * 0.15,
          ease: "power3.out",
          snap: { v: decimals ? 0.1 : 1 },
          scrollTrigger: trigger,
          onUpdate: () => {
            el.textContent =
              counter.v.toLocaleString("cs-CZ", {
                minimumFractionDigits: decimals,
                maximumFractionDigits: decimals,
              }) + glue;
          },
        });
      });

      ScrollTrigger.refresh();
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative z-[2] bg-navy py-[var(--space-10)]">
      <div className="mx-auto max-w-[var(--max-w)] px-[var(--gutter)]">
        <SectionIndex index="02" label="DŮVĚRYHODNOST" tone="dark" />

        <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4 lg:gap-x-0">
          {TRUST_NUMBERS.map((item, i) => (
            <div key={item.label} className="relative lg:px-8 lg:first:pl-0">
              {i > 0 && (
                <span
                  aria-hidden="true"
                  className="trust-line absolute left-0 top-0 hidden h-full w-px bg-steel/50 lg:block"
                />
              )}
              {/*
                Digits and unit are separate lines: the unit is a word, not
                part of the number, and letting it share the metric size
                wrapped "mld. Kč" across three lines in a 250px column.
                The counter writes only into .trust-value, so the unit
                never moves while the number rolls.
              */}
              <p className="text-metric-xl metric-value whitespace-nowrap text-snow">
                <span
                  className="trust-value"
                  data-value={item.value}
                  data-decimals={item.decimals}
                  data-glue={item.glue}
                >
                  {item.value.toLocaleString("cs-CZ", {
                    minimumFractionDigits: item.decimals,
                    maximumFractionDigits: item.decimals,
                  })}
                  {item.glue}
                </span>
              </p>
              {item.unit && <p className="text-metric mt-1 text-snow/90">{item.unit}</p>}
              {/* Labels here wrap to two lines, so they need leading the
                  single-line label token does not carry. */}
              <p className="text-label text-label-wrap mt-5 text-snow/80">{item.label}</p>
              <p className="text-label text-label-wrap mt-3 text-slate-on-dark">{item.basis}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
