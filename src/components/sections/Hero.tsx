"use client";

import { useEffect, useRef } from "react";
import { useGLScene } from "@/components/gl/useGLScene";
import { buildHeroScene, type HeroSceneState } from "@/components/gl/scenes/heroScene";
import { Pill } from "@/components/ui/primitives";
import { TRUST_NUMBERS } from "@/lib/data/site";
import { gsap, ensureGsapRegistered, ScrollTrigger, prefersReducedMotion } from "@/lib/motion";

/**
 * Hero — the thesis (§3/01).
 *
 * H1 sits in columns 1–8, deliberately off-centre, with the hairline data
 * rail bottom-aligned in 10–12. The asymmetry between the monumental left
 * mass and the thin right line is the entire composition.
 */
export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const state = useRef<HeroSceneState>({ x: 0, y: 0, progress: 0 });

  const { hostRef, disabled } = useGLScene("hero", buildHeroScene(state, "hero"));

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    ensureGsapRegistered();

    // Pointer parallax is written to a ref and consumed by the GL loop —
    // never React state (§6 INP).
    const onMove = (e: PointerEvent) => {
      const rect = section.getBoundingClientRect();
      state.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      state.current.y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    };
    section.addEventListener("pointermove", onMove, { passive: true });

    const ctx = gsap.context(() => {
      const reduced = prefersReducedMotion();

      if (!reduced) {
        const tl = gsap.timeline({ delay: 0.15 });
        tl.fromTo(
          ".hero-line > span",
          { yPercent: 110 },
          { yPercent: 0, duration: 1.1, ease: "expo.out", stagger: 0.09 }
        )
          .fromTo(".hero-fade", { y: 16, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.7, stagger: 0.08 }, "-=0.6")
          .fromTo(".hero-rail", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.6 }, "-=0.5");

        // A real dolly: the field pushes in while the content leaves.
        ScrollTrigger.create({
          trigger: section,
          start: "top top",
          end: "bottom top",
          scrub: 1,
          onUpdate: (self) => {
            state.current.progress = self.progress;
            gsap.set(contentRef.current, { yPercent: -18 * self.progress, autoAlpha: 1 - self.progress * 0.9 });
          },
        });
      }
    }, sectionRef);

    return () => {
      section.removeEventListener("pointermove", onMove);
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[100svh] items-end overflow-hidden bg-navy"
      data-scene="hero"
    >
      {!disabled && <div ref={hostRef} aria-hidden="true" className="absolute inset-0" />}

      {/* Scrim keeps AA contrast over the field (§3/01 layer 4). */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-[2]"
        style={{
          background: "linear-gradient(180deg, rgba(16,42,67,.35), rgba(16,42,67,.88))",
        }}
      />

      <div
        ref={contentRef}
        /*
         * The stack is bottom-aligned, so the bottom padding is what puts
         * the H1 baseline at the 58% mark the layout calls for. A fluid
         * value keeps that ratio on tall screens instead of jamming the
         * CTA against the fold.
         */
        className="relative z-[2] mx-auto grid w-full max-w-[var(--max-w)] grid-cols-1 gap-10 px-[var(--gutter)] pb-[var(--space-10)] pt-[var(--space-12)] lg:grid-cols-12 lg:pb-[clamp(96px,22vh,260px)]"
      >
        <div className="lg:col-span-8">
          <p className="text-label hero-fade text-silver">01 — TEZE</p>

          {/* hero-title caps the size to the 8-column measure — see globals.css */}
          <h1 className="text-display-xl hero-title mt-6 text-snow">
            <span className="mask-line hero-line">
              <span>Investujte do nemovitostí</span>
            </span>
            <span className="mask-line hero-line">
              <span>způsobem, který odpovídá</span>
            </span>
            <span className="mask-line hero-line">
              <span>vašim cílům.</span>
            </span>
          </h1>

          <p className="text-lede hero-fade mt-8 max-w-[62ch] text-slate-on-dark">
            Ať už chcete zvýšit hodnotu bytu rekonstrukcí, vytvořit si pasivní příjem, zhodnotit volný
            kapitál nebo budovat dlouhodobé portfolio, pomůžeme vám najít správnou investiční cestu.
          </p>

          <div className="hero-fade mt-10 flex flex-col gap-4 sm:flex-row">
            <Pill href="#rozcestnik" variant="emerald">
              Vyberte si svůj investiční cíl
            </Pill>
            <Pill href="/investicni-prilezitosti" variant="ghost-dark">
              Prohlédnout investiční příležitosti
            </Pill>
          </div>
        </div>

        {/* Hairline data rail, bottom-aligned in columns 10–12. */}
        <dl className="hero-rail flex flex-row gap-6 border-t border-steel/50 pt-5 lg:col-span-3 lg:col-start-10 lg:flex-col lg:justify-end lg:self-end lg:border-t-0">
          {TRUST_NUMBERS.slice(0, 3).map((item) => (
            <div key={item.label} className="flex-1 lg:border-t lg:border-steel/50 lg:pt-4">
              <dt className="text-label text-slate-on-dark">{item.label}</dt>
              <dd className="text-data mt-2 text-snow">
                {item.value.toLocaleString("cs-CZ", {
                  minimumFractionDigits: item.decimals,
                  maximumFractionDigits: item.decimals,
                })}
                {item.glue}
                {item.unit && ` ${item.unit}`}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
