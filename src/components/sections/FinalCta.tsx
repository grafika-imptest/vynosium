"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { Pill } from "@/components/ui/primitives";
import { withBasePath } from "@/lib/seo";
import { gsap, ensureGsapRegistered, prefersReducedMotion } from "@/lib/motion";

/**
 * Closing CTA (§3/13).
 *
 * The section the whole page funnels into: one photograph of the thing on
 * offer — a conversation — with the invitation over it. Nothing else is on
 * screen.
 *
 * The photograph carries pure white highlights, so the scrim is measured
 * rather than eyeballed; see the SCRIM note below for the numbers.
 *
 * No GL and no entrance transform on the photo: the browser paints it from
 * the first frame, so nothing about the closing pitch depends on a context,
 * an idle callback or a tween that might not run.
 */

/*
 * SCRIM — worst-case contrast, computed against the brightest pixel in the
 * region the copy sits over. That pixel is #ffffff, so these are floors, not
 * averages:
 *
 *   flat 0.62 + centre wash 0.45  ->  effective 0.79 behind the copy
 *   heading  #f8f8f8  ->  7.8:1
 *   lede     #bcccdc  ->  5.1:1   (AA body text: 4.5:1)
 *
 * The lede is Silver rather than the usual Slate: Slate cannot clear 4.5:1
 * over this photograph at any scrim that still lets the image read.
 */
const SCRIM_BASE = "rgba(11,29,46,0.62)";
const SCRIM_WASH =
  "radial-gradient(ellipse 78% 62% at 50% 46%, rgba(11,29,46,0.45) 0%, rgba(11,29,46,0.28) 58%, rgba(11,29,46,0) 100%)";

export function FinalCta() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    ensureGsapRegistered();

    const ctx = gsap.context(() => {
      if (prefersReducedMotion()) return;

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
      {/*
        Decorative: the copy already names what this is, so the photograph is
        hidden from assistive technology rather than described twice.
      */}
      <Image
        src={withBasePath("/photo/rozhovor.jpg")}
        alt=""
        aria-hidden="true"
        fill
        sizes="100vw"
        /* Portrait crops so tightly that dead centre is just the table: shift
           the frame left so one of the two people stays in shot. */
        className="object-cover object-[38%_50%] sm:object-center"
      />
      <div aria-hidden="true" className="absolute inset-0" style={{ background: SCRIM_BASE }} />
      <div aria-hidden="true" className="absolute inset-0" style={{ background: SCRIM_WASH }} />

      <div className="relative z-[2] mx-auto max-w-[720px] px-[var(--gutter)] text-center">
        <h2 className="text-display-lg text-snow">Vaše další investice může začít jedním rozhovorem.</h2>
        <p className="text-lede mt-6 text-silver">
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
