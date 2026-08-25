"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { useGLScene } from "@/components/gl/useGLScene";
import {
  buildPathSelectorScene,
  type PathSelectorHoverState,
} from "@/components/gl/scenes/pathSelectorScene";
import { PathGlyph, SectionIndex } from "@/components/ui/primitives";
import { INVESTMENT_PATHS, type PathDefinition } from "@/lib/data/paths";
import { PATH_COLORS, type InvestmentPath } from "@/lib/tokens";
import { gsap, ensureGsapRegistered, prefersReducedMotion } from "@/lib/motion";

/**
 * The path selector (§3/03) — the most important section of the homepage.
 * The visitor stops being an audience and becomes a segment.
 *
 * The 2×2 grid is deliberately broken: unequal spans and offset baselines.
 * If a future edit levels the card heights, the section loses its
 * argument. Classes are literal strings so Tailwind's scanner sees them.
 */
const LAYOUT: Record<InvestmentPath, string> = {
  flip: "lg:col-start-1 lg:col-span-6 lg:min-h-[520px] lg:mt-0",
  income: "lg:col-start-7 lg:col-span-6 lg:min-h-[400px] lg:mt-16",
  capital: "lg:col-start-1 lg:col-span-5 lg:min-h-[400px] lg:mt-32",
  wealth: "lg:col-start-6 lg:col-span-7 lg:min-h-[520px] lg:mt-10",
};

export function PathSelector() {
  const sectionRef = useRef<HTMLElement>(null);
  const hover = useRef<PathSelectorHoverState>({
    hovering: false,
    accentHex: PATH_COLORS.flip,
    mouseX: 0.5,
    mouseY: 0.5,
  });

  const { hostRef, disabled } = useGLScene("path-selector", buildPathSelectorScene(hover));

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    ensureGsapRegistered();

    const onMove = (e: PointerEvent) => {
      const rect = section.getBoundingClientRect();
      hover.current.mouseX = (e.clientX - rect.left) / rect.width;
      hover.current.mouseY = (e.clientY - rect.top) / rect.height;
    };
    section.addEventListener("pointermove", onMove, { passive: true });

    // On touch there is no hover, so the card nearest the viewport centre
    // becomes "active" and keeps toning the shader while scrolling.
    let observer: IntersectionObserver | undefined;
    if (window.matchMedia("(hover: none)").matches) {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const id = (entry.target as HTMLElement).dataset.token as InvestmentPath | undefined;
            if (!id) return;
            hover.current.hovering = true;
            hover.current.accentHex = PATH_COLORS[id];
            const rect = entry.target.getBoundingClientRect();
            const sectionRect = section.getBoundingClientRect();
            hover.current.mouseX = (rect.left + rect.width / 2 - sectionRect.left) / sectionRect.width;
            hover.current.mouseY = (rect.top + rect.height / 2 - sectionRect.top) / sectionRect.height;
          });
        },
        { rootMargin: "-40% 0px -40% 0px" }
      );
      section.querySelectorAll("[data-token]").forEach((el) => observer?.observe(el));
    }

    const ctx = gsap.context(() => {
      if (prefersReducedMotion()) return;
      gsap.fromTo(
        ".path-card",
        { y: 40, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.8,
          stagger: 0.08,
          ease: "power2.out",
          scrollTrigger: { trigger: section, start: "top 75%" },
          // Hand `transform` back to CSS so the hover lift still works.
          onComplete: () => gsap.set(".path-card", { clearProps: "transform" }),
        }
      );
    }, sectionRef);

    return () => {
      section.removeEventListener("pointermove", onMove);
      observer?.disconnect();
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="rozcestnik"
      className="relative overflow-hidden bg-navy py-[var(--space-10)]"
      data-scene="path-selector"
    >
      {!disabled && <div ref={hostRef} aria-hidden="true" className="absolute inset-0" />}

      <div className="relative z-[2] mx-auto max-w-[var(--max-w)] px-[var(--gutter)]">
        <SectionIndex index="03" label="ROZCESTNÍK" tone="dark" />
        <h2 className="text-display-lg mt-6 max-w-[18ch] text-snow">Jak chcete své peníze zhodnotit?</h2>
        <p className="text-lede mt-6 max-w-[62ch] text-slate">
          Každý investor má jiný cíl. Vyberte si cestu, která nejlépe odpovídá vašim možnostem
          a očekáváním.
        </p>

        <div className="mt-14 grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-start">
          {INVESTMENT_PATHS.map((path) => (
            <PathCard
              key={path.id}
              path={path}
              layoutClass={LAYOUT[path.id]}
              onHover={(active) => {
                hover.current.hovering = active;
                hover.current.accentHex = PATH_COLORS[path.id];
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
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
      data-token={path.id}
      className={`path-card group focus-ring relative flex min-h-[320px] flex-col justify-between gap-10 rounded-[var(--radius-card)] border border-steel/60 p-10 no-underline transition-[border-color,transform] duration-[var(--dur-ui)] hover:-translate-y-1.5 hover:border-[color:var(--card-accent)] ${layoutClass}`}
      style={
        {
          background: "rgba(22,50,75,0.55)",
          "--card-accent": `var(--color-${path.colorVar})`,
        } as React.CSSProperties
      }
    >
      <div>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <span className="text-[color:var(--card-accent)]">
              <PathGlyph path={path.id} />
            </span>
            <span className="text-label text-slate">
              {path.index} — {path.label}
            </span>
          </div>
          <span
            aria-hidden="true"
            className="mt-2 inline-block h-1.5 w-1.5 rounded-full"
            style={{ background: "var(--card-accent)" }}
          />
        </div>

        <p className="text-display mt-8 max-w-[20ch] text-snow">{path.claim}</p>
      </div>

      <div>
        <dl className="flex flex-wrap gap-x-10 gap-y-3">
          {path.metrics.map((metric) => (
            <div key={metric.label}>
              <dt className="text-label text-steel">{metric.label}</dt>
              <dd className="text-data mt-2 text-slate transition-colors duration-[var(--dur-micro)] group-hover:text-[color:var(--card-accent)]">
                {metric.value}
              </dd>
            </div>
          ))}
        </dl>

        <div className="mt-8 flex items-center justify-between">
          <span className="relative text-[15px] text-snow">
            {path.cta}
            {/* 1px token underline grows from the left on hover */}
            <span
              aria-hidden="true"
              className="absolute -bottom-1.5 left-0 h-px w-full origin-left scale-x-0 bg-[color:var(--card-accent)] transition-transform duration-[var(--dur-ui)] group-hover:scale-x-100"
              style={{ transitionTimingFunction: "var(--ease-out)" }}
            />
          </span>
          <span
            aria-hidden="true"
            className="text-[color:var(--card-accent)] transition-transform duration-[var(--dur-ui)] group-hover:translate-x-1.5"
          >
            <svg width="20" height="12" viewBox="0 0 20 12" fill="none">
              <path d="M0 6h18M13 1l5 5-5 5" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
}
