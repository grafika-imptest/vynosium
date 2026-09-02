"use client";

import { useEffect, useRef } from "react";
import { Pill } from "@/components/ui/primitives";
import { TRUST_NUMBERS } from "@/lib/data/site";
import { withBasePath } from "@/lib/seo";
import { gsap, ensureGsapRegistered, ScrollTrigger, prefersReducedMotion } from "@/lib/motion";

/**
 * Proof line under the claim.
 *
 * Composed from the trust data rather than typed out, so the figures cannot
 * drift from the band below — except the entry ticket, which is a commercial
 * term and lives nowhere else yet.
 *
 * NOTE: the figures in TRUST_NUMBERS are still placeholders. They now sit in
 * the most prominent position on the site, which is exactly where an invented
 * number does the most damage. Replace them before launch.
 */
const HERO_PROOF = [
  "Od 300 000 Kč",
  `${TRUST_NUMBERS[1].value}${TRUST_NUMBERS[1].glue} realizovaných projektů`,
  `${TRUST_NUMBERS[0].value.toLocaleString("cs-CZ", {
    minimumFractionDigits: TRUST_NUMBERS[0].decimals,
    maximumFractionDigits: TRUST_NUMBERS[0].decimals,
  })} ${TRUST_NUMBERS[0].unit} v realizovaných obchodech`,
];

/**
 * Hero — the thesis (§3/01).
 *
 * H1 sits in columns 1–9, deliberately off-centre, with the proof line and
 * both calls to action stacked under it. The asymmetry between the monumental
 * left mass and the open right edge is the composition.
 *
 * Layer 1 is a muted, looping clip of the real product; the shader field it
 * replaced stays in use for the closing CTA reprise (§3/13). The clip is
 * visible without any JS — nothing about the background is gated on a tween
 * — and the scrim above it keeps AA contrast on the copy.
 */
export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    ensureGsapRegistered();

    const reduced = prefersReducedMotion();

    // Reduced motion keeps the first frame as a still backdrop.
    if (reduced) videoRef.current?.pause();

    const ctx = gsap.context(() => {
      if (!reduced) {
        const tl = gsap.timeline({ delay: 0.15 });
        tl.fromTo(
          ".hero-line > span",
          { yPercent: 110 },
          { yPercent: 0, duration: 1.1, ease: "expo.out", stagger: 0.09 }
        )
          .fromTo(".hero-fade", { y: 16, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.7, stagger: 0.08 }, "-=0.6");

        // A real dolly: the clip pushes in while the content leaves.
        ScrollTrigger.create({
          trigger: section,
          start: "top top",
          end: "bottom top",
          scrub: 1,
          onUpdate: (self) => {
            gsap.set(contentRef.current, { yPercent: -18 * self.progress, autoAlpha: 1 - self.progress * 0.9 });
            if (mediaRef.current) gsap.set(mediaRef.current, { scale: 1.08 + 0.1 * self.progress });
          },
        });
      }
    }, sectionRef);

    /*
     * Pointer parallax is driven straight through GSAP — never React state
     * (§6 INP). The clip drifts against the pointer, never with it. quickTo
     * overwrites competing tweens on its target, so this element carries
     * transforms only; opacity is never animated here.
     */
    let onMove: ((e: PointerEvent) => void) | undefined;
    const media = mediaRef.current;
    if (!reduced && media) {
      const xTo = gsap.quickTo(media, "xPercent", { duration: 0.9, ease: "power3.out" });
      const yTo = gsap.quickTo(media, "yPercent", { duration: 0.9, ease: "power3.out" });
      onMove = (e: PointerEvent) => {
        const rect = section.getBoundingClientRect();
        xTo(-(((e.clientX - rect.left) / rect.width) * 2 - 1) * 2.2);
        yTo(-(((e.clientY - rect.top) / rect.height) * 2 - 1) * 2.2);
      };
      section.addEventListener("pointermove", onMove, { passive: true });
    }

    return () => {
      if (onMove) section.removeEventListener("pointermove", onMove);
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[100svh] items-end overflow-hidden bg-navy"
      data-scene="hero"
    >
      {/*
       * Over-scaled so the parallax never exposes the clip's edges. The base
       * transform is inline rather than a utility class: GSAP composes the
       * whole transform on this element and reads its starting value from
       * the element itself.
       */}
      <div
        ref={mediaRef}
        aria-hidden="true"
        className="absolute inset-0"
        style={{ transform: "scale(1.08)" }}
      >
        <video
          ref={videoRef}
          className="h-full w-full object-cover"
          src={withBasePath("/video/hero.mp4")}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          disablePictureInPicture
          tabIndex={-1}
        />
      </div>

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
        <div className="lg:col-span-9">
          <p className="text-label hero-fade text-silver">01 — TEZE</p>

          {/*
            The claim is the client's own wording. What it replaced —
            "Investujte do nemovitostí způsobem, který odpovídá vašim cílům"
            — was true of every competitor on the market; this one says what
            the company does and what it takes off the investor's hands.
          */}
          <h1 className="text-display-xl hero-title mt-6 text-snow">
            <span className="mask-line hero-line">
              <span>Nemovitosti, které vydělávají.</span>
            </span>
            <span className="mask-line hero-line">
              <span>My najdeme příležitost,</span>
            </span>
            <span className="mask-line hero-line">
              <span>spočítáme ji a celé</span>
            </span>
            <span className="mask-line hero-line">
              <span>investování zařídíme.</span>
            </span>
          </h1>

          {/*
            Proof on one line directly under the claim, replacing the
            hairline rail that used to sit in columns 10–12 — up there it read
            as a footnote. The entry ticket comes first: it answers the
            question that stops most readers ("is this for someone like me?")
            before the scale answers "can they actually do it?".
          */}
          <p className="hero-fade text-data mt-8 flex flex-wrap items-center gap-x-4 gap-y-2 text-snow">
            {HERO_PROOF.map((item, i) => (
              <span key={item} className="flex items-center gap-4">
                {i > 0 && <span aria-hidden="true" className="h-3 w-px bg-steel" />}
                {item}
              </span>
            ))}
          </p>

          <div className="hero-fade mt-10 flex flex-col gap-4 sm:flex-row">
            <Pill href="#rozcestnik" variant="emerald">
              Chci zjistit, jak investovat
            </Pill>
            <Pill href="/investicni-prilezitosti" variant="ghost-dark">
              Prohlédnout příležitosti
            </Pill>
          </div>
        </div>
      </div>
    </section>
  );
}
