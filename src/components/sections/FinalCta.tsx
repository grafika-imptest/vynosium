"use client";

import { useEffect, useRef } from "react";
import { useGLScene } from "@/components/gl/useGLScene";
import { buildHeroScene, type HeroSceneState } from "@/components/gl/scenes/heroScene";
import { Pill } from "@/components/ui/primitives";
import { gsap, ensureGsapRegistered, ScrollTrigger, prefersReducedMotion } from "@/lib/motion";

/**
 * Closing CTA (§3/13).
 *
 * The hero's depth field returns, darkened, and the monogram's flow
 * converges into a single point behind the button: the circle closes
 * where the site opened. Nothing else is on screen.
 */
export function FinalCta() {
  const sectionRef = useRef<HTMLElement>(null);
  const state = useRef<HeroSceneState>({ x: 0, y: 0, progress: 0 });

  const { hostRef, disabled } = useGLScene("final-cta", buildHeroScene(state, "finale"));

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    ensureGsapRegistered();

    const ctx = gsap.context(() => {
      if (prefersReducedMotion()) return;

      ScrollTrigger.create({
        trigger: section,
        start: "top bottom",
        end: "bottom bottom",
        scrub: 1,
        onUpdate: (self) => {
          state.current.progress = self.progress;
        },
      });

      gsap.fromTo(
        ".final-cta-button",
        { scale: 0.96, autoAlpha: 0 },
        {
          scale: 1,
          autoAlpha: 1,
          duration: 0.6,
          ease: "back.out(1.4)",
          scrollTrigger: { trigger: section, start: "top 60%" },
          onComplete: () => {
            // Breathing is opacity only — the system has no shadows to pulse.
            gsap.to(".final-cta-button", {
              opacity: 0.86,
              duration: 3,
              repeat: -1,
              yoyo: true,
              ease: "sine.inOut",
            });
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[100svh] items-center justify-center overflow-hidden bg-abyss"
      data-scene="final-cta"
    >
      {!disabled && <div ref={hostRef} aria-hidden="true" className="absolute inset-0" />}

      <div className="relative z-[2] mx-auto max-w-[720px] px-[var(--gutter)] text-center">
        <h2 className="text-display-lg text-snow">Vaše další investice může začít jedním rozhovorem.</h2>
        <p className="text-lede mt-6 text-slate">
          Řekněte nám, kolik chcete investovat a co od investice čekáte. Připravíme modelový propočet
          pro váš scénář — nezávazně a bez prezentací.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <span className="final-cta-button inline-flex">
            <Pill href="/kontakt" variant="emerald">
              Domluvit nezávaznou konzultaci
            </Pill>
          </span>
          <Pill href="/investicni-prilezitosti" variant="ghost-dark">
            Prohlédnout investiční příležitosti
          </Pill>
        </div>
      </div>
    </section>
  );
}
