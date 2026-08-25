"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import {
  gsap,
  ScrollTrigger,
  SplitText,
  ensureGsapRegistered,
  prefersReducedMotion,
} from "@/lib/motion";
import { HeroDepthField } from "@/components/gl/HeroDepthField";
import { SectionIndex } from "@/components/ui/SectionIndex";
import { Pill } from "@/components/ui/Pill";
import { TRUST_NUMBERS } from "@/lib/data/trustNumbers";
import { PRELOADER_EXIT_EVENT } from "@/components/sections/Preloader";

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasHostRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const h1Ref = useRef<HTMLHeadingElement>(null);
  const ledeRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const tickerRef = useRef<HTMLDListElement>(null);

  useEffect(() => {
    ensureGsapRegistered();
    const reduced = prefersReducedMotion();
    // Guards against React StrictMode's dev-only double-invoke: without
    // this, two overlapping intro timelines can be created and the later
    // one's .from() call resets already-animated elements back to their
    // hidden starting state.
    let hasRun = false;
    let introTimeline: gsap.core.Timeline | null = null;
    let scrollTrigger: ScrollTrigger | null = null;
    let introTimer: ReturnType<typeof setTimeout> | undefined;

    const runIntro = () => {
      if (hasRun) return;
      hasRun = true;

      if (reduced) {
        gsap.set([ledeRef.current, ctaRef.current, tickerRef.current], { opacity: 1, y: 0 });
        return;
      }
      const split = SplitText.create(h1Ref.current, {
        type: "lines",
        mask: "lines",
        linesClass: "line",
      });
      introTimeline = gsap.timeline();
      introTimeline
        .from(split.lines, {
          yPercent: 110,
          duration: 1.1,
          ease: "expo.out",
          stagger: 0.09,
        })
        .from(ledeRef.current, { y: 16, opacity: 0, duration: 0.7, ease: "power2.out" }, "-=0.6")
        .from(ctaRef.current, { y: 16, opacity: 0, duration: 0.7, ease: "power2.out" }, "-=0.55")
        .from(
          tickerRef.current ? Array.from(tickerRef.current.children) : [],
          { y: 12, opacity: 0, duration: 0.6, stagger: 0.06, ease: "power2.out" },
          "-=0.5"
        );
    };

    if (reduced) {
      runIntro();
    } else {
      window.addEventListener(PRELOADER_EXIT_EVENT, runIntro, { once: true });
      // Fallback in case the preloader already finished before this mounted.
      introTimer = setTimeout(runIntro, 1600);

      scrollTrigger = ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom top",
        scrub: 1,
        animation: gsap
          .timeline()
          .to(canvasHostRef.current, { yPercent: 12, scale: 1.06, ease: "none" }, 0)
          .to(contentRef.current, { yPercent: -18, ease: "none" }, 0),
      });
    }

    return () => {
      window.removeEventListener(PRELOADER_EXIT_EVENT, runIntro);
      clearTimeout(introTimer);
      introTimeline?.kill();
      scrollTrigger?.kill();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      data-scene="hero"
      className="relative isolate flex min-h-[100svh] flex-col justify-end overflow-hidden bg-navy pb-16 pt-32 sm:pb-24"
    >
      <div ref={canvasHostRef} className="absolute inset-0">
        <HeroDepthField />
      </div>
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(16,42,67,.35), rgba(16,42,67,.88))",
        }}
      />

      <div className="absolute left-[var(--gutter)] top-28 z-10">
        <SectionIndex index="01" label="TEZE" tone="dark" />
      </div>

      <div
        ref={contentRef}
        className="relative z-10 mx-auto grid w-full max-w-[var(--max-w)] grid-cols-1 gap-10 px-[var(--gutter)] lg:grid-cols-12 lg:gap-6"
      >
        <div className="lg:col-span-8">
          <h1
            ref={h1Ref}
            className="text-display-xl text-snow"
            style={{ maxWidth: "13ch" }}
          >
            Investujte do nemovitostí způsobem, který odpovídá vašim cílům.
          </h1>
          <p ref={ledeRef} className="text-lede mt-6 max-w-[46ch] text-slate">
            Ať už chcete zvýšit hodnotu bytu rekonstrukcí, vytvořit si pasivní příjem,
            zhodnotit volný kapitál nebo budovat dlouhodobé portfolio, pomůžeme vám
            najít správnou investiční cestu.
          </p>
          <div ref={ctaRef} className="mt-9 flex flex-wrap gap-4">
            <Pill href="#rozcestnik" variant="emerald">
              Vyberte si svůj investiční cíl
            </Pill>
            <Pill href="/investicni-prilezitosti" variant="ghost-dark">
              Prohlédnout investiční příležitosti
            </Pill>
          </div>
        </div>

        <div className="hidden lg:col-span-4 lg:col-start-10 lg:flex lg:items-end lg:justify-end">
          <dl ref={tickerRef} className="flex w-full flex-col gap-4 border-l border-steel/50 pl-6">
            {TRUST_NUMBERS.slice(0, 3).map((n) => (
              <div key={n.id}>
                <dt className="text-label text-slate">{n.label}</dt>
                <dd className="mt-1 font-mono text-2xl text-snow">
                  {n.display}
                  {n.unit ? <span className="ml-1 text-base text-slate">{n.unit}</span> : null}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <div className="relative z-10 mt-10 border-t border-steel/40 pt-4 lg:hidden">
        <dl className="mx-auto flex max-w-[var(--max-w)] justify-between px-[var(--gutter)]">
          {TRUST_NUMBERS.slice(0, 3).map((n) => (
            <div key={n.id}>
              <dt className="text-label text-slate">{n.label}</dt>
              <dd className="mt-1 font-mono text-lg text-snow">
                {n.display}
                {n.unit ? <span className="ml-1 text-xs text-slate">{n.unit}</span> : null}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
