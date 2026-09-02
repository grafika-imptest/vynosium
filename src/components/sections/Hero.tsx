"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { Pill } from "@/components/ui/primitives";
import { PARTNERS } from "@/lib/data/partners";
import { TRUST_NUMBERS } from "@/lib/data/site";
import { withBasePath } from "@/lib/seo";
import { gsap, ensureGsapRegistered, ScrollTrigger, prefersReducedMotion } from "@/lib/motion";

/**
 * Proof under the claim.
 *
 * Three figures, each split into digits, unit and caption. As one mono
 * sentence with pipe separators this was the least readable line on the
 * site: 14px at a single weight, nothing for the eye to land on, and on a
 * narrow desktop it wrapped and left a separator hanging at the start of the
 * second line. The digits now carry the weight, the unit steps back into
 * silver, and the caption says which figure it is — the same three-part
 * shape the credibility band below uses, at a size that supports the H1
 * instead of competing with it.
 *
 * Composed from the trust data rather than typed out, so the figures cannot
 * drift from that band — except the entry ticket, which is a commercial term
 * and lives nowhere else yet.
 *
 * NOTE: the figures in TRUST_NUMBERS are still placeholders. They now sit in
 * the most prominent position on the site, which is exactly where an invented
 * number does the most damage. Replace them before launch.
 */
const HERO_PROOF = [
  { digits: "300 000", unit: "Kč", caption: "Minimální vstup" },
  {
    digits: `${TRUST_NUMBERS[1].value}${TRUST_NUMBERS[1].glue}`,
    unit: "",
    caption: TRUST_NUMBERS[1].label,
  },
  {
    digits: TRUST_NUMBERS[0].value.toLocaleString("cs-CZ", {
      minimumFractionDigits: TRUST_NUMBERS[0].decimals,
      maximumFractionDigits: TRUST_NUMBERS[0].decimals,
    }),
    unit: TRUST_NUMBERS[0].unit,
    /*
     * Shortened from the band's own label ("Hodnota realizovaných obchodů").
     * At caption size, two neighbouring captions both opening with
     * "realizovaných" read as a stutter; the figure and the band below carry
     * the full wording and the basis. The number itself still comes from the
     * data.
     */
    caption: "Realizovaných obchodů",
  },
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

      {/*
        Scrim keeps AA contrast over the field (§3/01 layer 4).

        Three stops rather than two: the clip's brightest area is the window
        wall on the right, and it lands exactly where the third proof figure
        and the second CTA sit. On a straight .35 → .88 ramp that region was
        only ~.73 covered, and the caption there measured 4.44:1 against the
        brightest frame — under AA for 11px type. Reaching .86 by 62% darkens
        the band that carries copy and leaves the upper two thirds of the
        photograph alone.
      */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-[2]"
        style={{
          background:
            "linear-gradient(180deg, rgba(16,42,67,.35) 0%, rgba(16,42,67,.86) 62%, rgba(16,42,67,.92) 100%)",
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
        /*
         * Phone padding is tighter at both ends. The stack is bottom-aligned
         * inside a 100svh section, so the top padding is invisible until the
         * content is taller than the screen — and on a 375x812 phone the
         * claim, three figures and two CTAs are: at 176px top and 96px bottom
         * the section ran 913px and the second CTA fell off the fold.
         * Trimming padding that nothing sees costs nothing and brings both
         * calls to action back above it.
         */
        className="relative z-[2] mx-auto grid w-full max-w-[var(--max-w)] grid-cols-1 gap-8 px-[var(--gutter)] lg:gap-10 pb-10 pt-[var(--space-10)] sm:pb-[var(--space-10)] sm:pt-[var(--space-12)] lg:grid-cols-12 lg:pb-[clamp(96px,22vh,260px)]"
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
          <dl className="hero-fade hero-proof mt-9">
            {HERO_PROOF.map((item) => (
              <div key={item.caption} className="hero-proof-item">
                {/*
                  Caption first in the DOM: read aloud, "minimální vstup,
                  300 000 Kč" is the order that makes sense. The column
                  reverses it on screen, where the number is the hook.
                */}
                <dt className="text-label text-label-wrap text-silver">{item.caption}</dt>
                <dd className="text-metric text-snow">
                  {item.digits}
                  {item.unit && <span className="hero-proof-unit">{item.unit}</span>}
                </dd>
              </div>
            ))}
          </dl>

          <div className="hero-fade mt-10 flex flex-col gap-4 sm:flex-row">
            <Pill href="#rozcestnik" variant="emerald">
              Chci zjistit, jak investovat
            </Pill>
            <Pill href="/investicni-prilezitosti" variant="ghost-dark">
              Prohlédnout příležitosti
            </Pill>
          </div>
        </div>

        <HeroPartners />
      </div>
    </section>
  );
}

/**
 * Partner marks in the hero's open right column (columns 10–12).
 *
 * This replaced a full section under the credibility band. Four logos never
 * needed a band of their own — a strip that wide invites a marquee and reads
 * as a badge wall — and the right column has been empty since the hairline
 * rail came out of it in September. Down here the marks are a quiet aside to
 * the claim: present for anyone who looks, silent for anyone who doesn't.
 *
 * They are the client's white SVGs held at 55% opacity, which is the whole
 * treatment: white marks at full strength out-shout the H1 they are meant to
 * support. No tiles, no borders, no hover — on a photograph that furniture is
 * what makes a logo strip look bolted on.
 *
 * Bottom-aligned with the CTA row on a desktop; on a phone there is no right
 * column, so the marks become one short row under the calls to action at 68%
 * of their size (see --logo-scale), which is what keeps the hero inside one
 * screen.
 */
function HeroPartners() {
  return (
    <aside className="hero-fade hero-partners lg:col-span-3 lg:self-end">
      {/* Silver, not slate: slate measured 3.22:1 here against the brightest
          frame of the clip, and this is 11px type. */}
      <p className="text-label text-silver">Partneři</p>
      <ul className="hero-partners-list">
        {PARTNERS.map((partner) => (
          <li key={partner.name}>
            <Image
              src={withBasePath(partner.src)}
              alt={partner.name}
              width={partner.width}
              height={partner.height}
              /* Optical height per mark; the phone scale is applied in CSS. */
              style={{ "--logo-h": `${partner.renderHeight}px` } as React.CSSProperties}
            />
          </li>
        ))}
      </ul>
    </aside>
  );
}
