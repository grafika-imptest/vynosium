"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, ensureGsapRegistered, prefersReducedMotion } from "@/lib/motion";
import { TRUST_NUMBERS } from "@/lib/data/trustNumbers";
import { SectionIndex } from "@/components/ui/SectionIndex";

/**
 * "Papír" contrast to the fluid Hero: four columns divided by hairlines,
 * no cards, no WebGL. design.md §3/02.
 */
export function TrustNumbers() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    ensureGsapRegistered();
    const reduced = prefersReducedMotion();
    const ctx = gsap.context(() => {
      const lines = gsap.utils.toArray<HTMLElement>(".trust-line");
      const values = gsap.utils.toArray<HTMLElement>(".trust-value");

      if (reduced) {
        gsap.set(values, { opacity: 1 });
        return;
      }

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 70%",
        once: true,
        onEnter: () => {
          const tl = gsap.timeline();
          tl.fromTo(lines, { scaleY: 0 }, { scaleY: 1, duration: 0.7, ease: "power2.out", stagger: 0.1 });
          values.forEach((el, i) => {
            const numberEl = el.querySelector<HTMLElement>(".trust-value-number");
            const display = el.dataset.display ?? "";
            // Parse the display string itself ("1,2" → 1.2, "64+" → 64) so
            // the tween target always matches what's actually shown —
            // n.value carries the true magnitude (e.g. 1_200_000_000) which
            // is for data/schema use, not for driving this animation.
            const hasDecimal = display.includes(",");
            const target = parseFloat(display.replace(",", ".").replace(/[^0-9.]/g, "")) || 0;
            const counter = { v: 0 };
            tl.to(
              counter,
              {
                v: target,
                duration: 1.6,
                ease: "power3.out",
                onUpdate: () => {
                  if (!numberEl) return;
                  numberEl.textContent = hasDecimal
                    ? counter.v.toFixed(1).replace(".", ",")
                    : `${Math.round(counter.v)}${display.includes("+") ? "+" : ""}`;
                },
              },
              i === 0 ? "-=0.3" : "<0.15"
            );
          });
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative bg-navy py-[var(--space-9)]"
      data-scene="trust-numbers"
    >
      <div className="mx-auto max-w-[var(--max-w)] px-[var(--gutter)]">
        <SectionIndex index="02" label="ČÍSLA" tone="dark" className="mb-8" />
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4 lg:gap-x-0">
          {TRUST_NUMBERS.map((n) => (
            <div key={n.id} className="relative pl-6 lg:pl-8">
              <div className="trust-line absolute left-0 top-0 h-full w-px origin-top bg-steel" />
              <p className="trust-value text-metric-xl text-emerald" data-display={n.display}>
                <span className="trust-value-number">{n.display}</span>
                {n.unit ? <span className="ml-2 text-lg text-slate">{n.unit}</span> : null}
              </p>
              <p className="text-label mt-3 text-slate">{n.label}</p>
              <p className="text-disclaimer mt-1 text-text-muted">{n.base}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
