"use client";

import { useEffect, useRef } from "react";
import { gsap, ensureGsapRegistered, prefersReducedMotion } from "@/lib/motion";
import { useGLScene } from "@/components/gl/useGLScene";
import { buildHeroScene } from "@/components/gl/scenes/heroScene";
import { Pill } from "@/components/ui/Pill";

/** Closes the loop: the depth field from Hero returns, darker. design.md §3/13. */
export function FinalCTA() {
  const buttonRef = useRef<HTMLDivElement>(null);
  const { hostRef, disabled } = useGLScene("final-cta-depth-field", buildHeroScene);

  useEffect(() => {
    ensureGsapRegistered();
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.from(buttonRef.current, {
        scale: 0.96,
        opacity: 0,
        duration: 0.6,
        ease: "back.out(1.4)",
        scrollTrigger: { trigger: buttonRef.current, start: "top 85%" },
        onComplete: () => {
          gsap.to(buttonRef.current, {
            opacity: 0.85,
            duration: 3,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
          });
        },
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <section
      className="relative flex min-h-[100svh] items-center justify-center overflow-hidden bg-abyss px-[var(--gutter)] py-[var(--space-11)]"
      data-scene="final-cta"
    >
      {!disabled && <div ref={hostRef} className="absolute inset-0" />}
      <div aria-hidden="true" className="absolute inset-0" style={{ background: "rgba(11,29,46,0.72)" }} />

      <div className="relative z-10 mx-auto flex max-w-[720px] flex-col items-center gap-8 text-center">
        <h2 className="text-display-lg text-snow">Vaše další investice může začít jedním rozhovorem.</h2>
        <p className="text-body max-w-[52ch] text-slate">
          Probereme váš cíl, časový horizont a dostupný kapitál a společně navrhneme
          investiční strategii, která dává smysl.
        </p>
        <div ref={buttonRef} className="flex w-full flex-col gap-4 pb-[env(safe-area-inset-bottom)] sm:w-auto sm:flex-row">
          <Pill href="/kontakt" variant="emerald" className="w-full sm:w-auto">
            Domluvit nezávaznou konzultaci
          </Pill>
          <Pill href="/investicni-prilezitosti" variant="ghost-dark" className="w-full sm:w-auto">
            Prohlédnout investiční příležitosti
          </Pill>
        </div>
      </div>
    </section>
  );
}
