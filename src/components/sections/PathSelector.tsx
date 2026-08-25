"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { gsap, ensureGsapRegistered, prefersReducedMotion } from "@/lib/motion";
import { useGLScene } from "@/components/gl/useGLScene";
import { buildPathSelectorScene, type PathSelectorHoverState } from "@/components/gl/scenes/pathSelectorScene";
import { CursorMagnet, type MagnetState } from "@/components/ui/CursorMagnet";
import { PathGlyph } from "@/components/ui/PathGlyph";
import { SectionIndex } from "@/components/ui/SectionIndex";
import { INVESTMENT_PATHS, type PathDefinition } from "@/lib/data/paths";
import { COLORS } from "@/lib/tokens";

const LAYOUT: Record<string, { colStart: number; colSpan: number; height: number; offsetY: number }> = {
  flip: { colStart: 1, colSpan: 6, height: 520, offsetY: 0 },
  income: { colStart: 7, colSpan: 6, height: 400, offsetY: 64 },
  capital: { colStart: 1, colSpan: 5, height: 400, offsetY: 128 },
  wealth: { colStart: 6, colSpan: 7, height: 520, offsetY: 40 },
};

export function PathSelector() {
  const sectionRef = useRef<HTMLElement>(null);
  const hoverRef = useRef<PathSelectorHoverState>({
    hovering: false,
    accentHex: COLORS.emerald,
    mouseX: 0.5,
    mouseY: 0.5,
  });
  const magnetRef = useRef<MagnetState["current"]>({ x: 0, y: 0, active: false, accentHex: COLORS.emerald });

  const { hostRef, disabled } = useGLScene("path-selector", () => buildPathSelectorScene(hoverRef));

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const onMove = (e: PointerEvent) => {
      const rect = section.getBoundingClientRect();
      hoverRef.current.mouseX = (e.clientX - rect.left) / rect.width;
      hoverRef.current.mouseY = (e.clientY - rect.top) / rect.height;
      magnetRef.current.x = e.clientX;
      magnetRef.current.y = e.clientY;
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
        // Leave the CSS-driven translateY(offsetY) (desktop asymmetric
        // layout) in control once the tween ends, otherwise GSAP's
        // leftover inline transform permanently shadows the :hover lift.
        onComplete: () => gsap.set(cards, { clearProps: "transform" }),
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="rozcestnik" className="relative bg-navy py-[var(--space-10)]" data-scene="path-selector">
      {!disabled && <div ref={hostRef} aria-hidden="true" className="absolute inset-0" />}
      <CursorMagnet stateRef={magnetRef} />

      <div className="relative z-10 mx-auto max-w-[var(--max-w)] px-[var(--gutter)]">
        <SectionIndex index="03" label="ROZCESTNÍK" tone="dark" className="mb-6" />
        <h2 className="text-display-lg text-snow">Jak chcete své peníze zhodnotit?</h2>
        <p className="text-lede mt-4 max-w-[52ch] text-slate">
          Každý investor má jiný cíl. Vyberte si cestu, která nejlépe odpovídá vašim
          možnostem a očekáváním.
        </p>

        <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-6">
          {INVESTMENT_PATHS.map((path) => (
            <PathCard
              key={path.id}
              path={path}
              layout={LAYOUT[path.id]}
              onHover={(active) => {
                const accent = getComputedColor(path.colorVar);
                hoverRef.current.hovering = active;
                hoverRef.current.accentHex = accent;
                magnetRef.current.active = active;
                magnetRef.current.accentHex = accent;
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
  layout,
  onHover,
}: {
  path: PathDefinition;
  layout: { colStart: number; colSpan: number; height: number; offsetY: number };
  onHover: (active: boolean) => void;
}) {
  return (
    <Link
      href={`/${path.slug}`}
      onPointerEnter={() => onHover(true)}
      onPointerLeave={() => onHover(false)}
      className="path-card group focus-ring relative flex flex-col justify-between overflow-hidden rounded-[10px] border p-10 no-underline transition-[border-color,transform] duration-300"
      style={{
        borderColor: "rgba(72,101,129,0.6)",
        background: "rgba(22,50,75,0.55)",
        // @ts-expect-error custom property
        "--card-accent": `var(--color-${path.colorVar})`,
      }}
      data-token={path.id}
    >
      <style jsx>{`
        .path-card:hover {
          border-color: var(--card-accent);
        }
        .path-card:hover .path-metric,
        .path-card:hover .path-cta {
          color: var(--card-accent);
        }
        .path-card:hover .path-underline {
          width: 100%;
        }
        .path-card:hover .path-arrow {
          transform: translateX(6px);
        }
        /* Asymmetric desktop layout only — a 1-col mobile grid has no
           track for these column lines, so applying them unscoped would
           push cards into phantom implicit columns and overflow. */
        @media (min-width: 1024px) {
          .path-card {
            grid-column: ${layout.colStart} / span ${layout.colSpan};
            min-height: ${layout.height}px;
            transform: translateY(${layout.offsetY}px);
          }
          .path-card:hover {
            transform: translateY(${layout.offsetY}px) translateY(-6px);
          }
        }
      `}</style>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span style={{ color: "var(--card-accent)" }}>
            <PathGlyph glyph={path.glyph} />
          </span>
          <span className="text-label text-slate">
            {path.index} — {path.label.toUpperCase()}
          </span>
        </div>
        <span className="h-2 w-2 rounded-full" style={{ background: "var(--card-accent)" }} aria-hidden="true" />
      </div>

      <div>
        <p className="text-display text-snow" style={{ maxWidth: "22ch" }}>
          {path.headline}
        </p>
        <p className="path-metric text-data mt-4 text-slate transition-colors duration-300">{path.metricValue}</p>
      </div>

      <div className="flex items-center justify-between">
        <span className="relative text-[15px] text-snow">
          <span className="path-cta transition-colors duration-300">{path.cta}</span>
          <span className="path-underline absolute -bottom-1 left-0 h-px w-0 transition-[width] duration-300" style={{ background: "var(--card-accent)" }} />
        </span>
        <span className="path-arrow text-snow transition-transform duration-300" aria-hidden="true">
          →
        </span>
      </div>
    </Link>
  );
}
