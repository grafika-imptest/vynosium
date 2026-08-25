"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { gsap, ensureGsapRegistered, prefersReducedMotion } from "@/lib/motion";
import { useGLScene } from "@/components/gl/useGLScene";
import { buildPathSelectorScene, type PathSelectorHoverState } from "@/components/gl/scenes/pathSelectorScene";
import { PathGlyph } from "@/components/ui/PathGlyph";
import { SectionIndex } from "@/components/ui/SectionIndex";
import { INVESTMENT_PATHS, type PathDefinition } from "@/lib/data/paths";
import { COLORS, type InvestmentPath } from "@/lib/tokens";

/**
 * Asymmetric 2×2 (design.md §3/03: deliberately broken grid — unequal
 * spans and offset baselines are what make the section authored rather
 * than generated).
 *
 * These are full literal Tailwind class strings, NOT computed at runtime:
 * the previous styled-jsx version emitted `grid-column` from interpolated
 * values that never applied, which collapsed all four cards into narrow
 * auto-placed columns on wide desktops. Literal strings also keep the
 * classes visible to Tailwind's scanner.
 *
 * Vertical offset uses margin-top (not translate) so `transform` stays
 * free for the hover lift and GSAP's entrance tween.
 */
const LAYOUT: Record<InvestmentPath, string> = {
  flip: "lg:col-start-1 lg:col-span-6 lg:min-h-[520px] lg:mt-0",
  income: "lg:col-start-7 lg:col-span-6 lg:min-h-[400px] lg:mt-16",
  capital: "lg:col-start-1 lg:col-span-5 lg:min-h-[400px] lg:mt-32",
  wealth: "lg:col-start-6 lg:col-span-7 lg:min-h-[520px] lg:mt-10",
};

export function PathSelector() {
  const sectionRef = useRef<HTMLElement>(null);
  const hoverRef = useRef<PathSelectorHoverState>({
    hovering: false,
    accentHex: COLORS.emerald,
    mouseX: 0.5,
    mouseY: 0.5,
  });

  const { hostRef, disabled } = useGLScene("path-selector", () => buildPathSelectorScene(hoverRef));

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const onMove = (e: PointerEvent) => {
      const rect = section.getBoundingClientRect();
      hoverRef.current.mouseX = (e.clientX - rect.left) / rect.width;
      hoverRef.current.mouseY = (e.clientY - rect.top) / rect.height;
    };
    section.addEventListener("pointermove", onMove, { passive: true });
    return () => section.removeEventListener("pointermove", onMove);
  }, []);

  useEffect(() => {
    ensureGsapRegistered();
    const reduced = prefersReducedMotion();
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>(".path-card");
      if (reduced) {
        gsap.set(cards, { opacity: 1 });
        return;
      }
      gsap.from(cards, {
        y: 40,
        opacity: 0,
        duration: 0.7,
        stagger: 0.08,
        ease: "power2.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 75%" },
        // Hand `transform` back to CSS so the :hover lift works afterwards.
        onComplete: () => gsap.set(cards, { clearProps: "transform" }),
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="rozcestnik" className="relative bg-navy py-[var(--space-10)]" data-scene="path-selector">
      {!disabled && <div ref={hostRef} aria-hidden="true" className="absolute inset-0" />}

      <div className="relative z-10 mx-auto max-w-[var(--max-w)] px-[var(--gutter)]">
        <SectionIndex index="03" label="ROZCESTNÍK" tone="dark" className="mb-6" />
        <h2 className="text-display-lg text-snow">Jak chcete své peníze zhodnotit?</h2>
        <p className="text-lede mt-4 max-w-[52ch] text-slate">
          Každý investor má jiný cíl. Vyberte si cestu, která nejlépe odpovídá vašim
          možnostem a očekáváním.
        </p>

        <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-start lg:gap-6">
          {INVESTMENT_PATHS.map((path) => (
            <PathCard
              key={path.id}
              path={path}
              layoutClass={LAYOUT[path.id]}
              onHover={(active) => {
                hoverRef.current.hovering = active;
                hoverRef.current.accentHex = getComputedColor(path.colorVar);
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function getComputedColor(colorVar: string): string {
  if (typeof window === "undefined") return COLORS.emerald;
  return getComputedStyle(document.documentElement).getPropertyValue(`--color-${colorVar}`).trim() || COLORS.emerald;
}

function PathCard({
  path,
  layoutClass,
  onHover,
}: {
  path: PathDefinition;
  layoutClass: string;
  onHover: (active: boolean) => void;
}) {
  return (
    <Link
      href={`/${path.slug}`}
      onPointerEnter={() => onHover(true)}
      onPointerLeave={() => onHover(false)}
      className={`path-card group focus-ring relative flex min-h-[320px] flex-col justify-between gap-10 overflow-hidden rounded-[10px] border border-steel/60 p-10 no-underline transition-[border-color,transform] duration-300 hover:-translate-y-1.5 hover:border-[color:var(--card-accent)] ${layoutClass}`}
      style={{
        background: "rgba(22,50,75,0.55)",
        // @ts-expect-error CSS custom property
        "--card-accent": `var(--color-${path.colorVar})`,
      }}
      data-token={path.id}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="shrink-0" style={{ color: "var(--card-accent)" }}>
            <PathGlyph glyph={path.glyph} />
          </span>
          <span className="text-label whitespace-nowrap text-slate">
            {path.index} — {path.label.toUpperCase()}
          </span>
        </div>
        <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: "var(--card-accent)" }} aria-hidden="true" />
      </div>

      <div>
        <p className="text-display max-w-[22ch] text-snow">{path.headline}</p>
        <p className="text-data mt-4 text-slate transition-colors duration-300 group-hover:text-[color:var(--card-accent)]">
          {path.metricValue}
        </p>
      </div>

      <div className="flex items-center justify-between gap-4">
        <span className="relative text-[15px] text-snow transition-colors duration-300 group-hover:text-[color:var(--card-accent)]">
          {path.cta}
          <span
            className="absolute -bottom-1 left-0 h-px w-0 transition-[width] duration-300 group-hover:w-full"
            style={{ background: "var(--card-accent)" }}
            aria-hidden="true"
          />
        </span>
        <span className="shrink-0 text-snow transition-transform duration-300 group-hover:translate-x-1.5" aria-hidden="true">
          →
        </span>
      </div>
    </Link>
  );
}
