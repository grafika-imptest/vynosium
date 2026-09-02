"use client";

import { useEffect, useRef } from "react";
import { Pill, SectionIndex } from "@/components/ui/primitives";
import { gsap, ensureGsapRegistered, prefersReducedMotion } from "@/lib/motion";
import { VECTOR_ANGLE_DEG } from "@/lib/tokens";

/**
 * Vynosium introduced (§3/06).
 *
 * The right half is a connection diagram: seven modules strung on ONE
 * line drawn at 38.5°. The line is scrubbed by scroll and each module
 * lights up as the line passes it — this is the visual equivalent of the
 * claim "one partner for the whole process", not an illustration of it.
 */
const MODULES = [
  "Výběr",
  "Prověření",
  "Financování",
  "Rekonstrukce",
  "Pronájem",
  "Prodej",
  "Správa",
];

/**
 * Geometry. Labels sit to the RIGHT of their node on the same baseline, so
 * the run has to stop short of the right edge to leave room for the widest
 * one ("REKONSTRUKCE" ≈ 110px at 11px mono with .14em tracking). The
 * previous alternating above/below placement collided its own labels and
 * pushed the last node off the canvas.
 */
const VIEW_W = 700;
const VIEW_H = 500;
const LABEL_GAP = 16;
const LABEL_ROOM = 150;
const X0 = 30;
const RUN = VIEW_W - X0 - LABEL_ROOM;
const RISE = RUN * Math.tan((VECTOR_ANGLE_DEG * Math.PI) / 180);
const Y0 = VIEW_H - 40;

export function AboutIntro() {
  const sectionRef = useRef<HTMLElement>(null);
  const lineRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const line = lineRef.current;
    if (!section || !line) return;
    ensureGsapRegistered();

    const ctx = gsap.context(() => {
      const length = line.getTotalLength();
      const nodes = section.querySelectorAll<SVGGElement>("[data-node]");

      if (prefersReducedMotion()) {
        gsap.set(line, { strokeDasharray: length, strokeDashoffset: 0 });
        gsap.set(nodes, { opacity: 1 });
        return;
      }

      gsap.set(line, { strokeDasharray: length, strokeDashoffset: length });
      gsap.set(nodes, { opacity: 0.25 });

      // Scrubbed motion is linear, always (§5 motion law).
      gsap.to(line, {
        strokeDashoffset: 0,
        ease: "none",
        scrollTrigger: { trigger: section, start: "top 70%", end: "bottom 60%", scrub: 1 },
      });

      nodes.forEach((node, i) => {
        gsap.to(node, {
          opacity: 1,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: `top ${70 - i * 4}%`,
            end: `+=${120}`,
            scrub: 1,
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative z-[2] bg-white py-[var(--space-10)]">
      <div className="mx-auto grid max-w-[var(--max-w)] grid-cols-1 gap-12 px-[var(--gutter)] lg:grid-cols-12">
        <div className="lg:col-span-5">
          <SectionIndex label="SLUŽBA, KTERÁ NEKONČÍ U KOUPĚ" tone="light" />
          <h2 className="text-display mt-6 max-w-[16ch] text-navy">
            Investování do nemovitostí nemusí být složité.
          </h2>
          <p className="text-body mt-6 max-w-[54ch] text-text-secondary">
            Hodnota není v jednotlivé službě, ale v tom, že na sebe kroky navazují. Výběr nemovitosti
            zná ekonomiku rekonstrukce, rekonstrukce zná požadavky nájemního trhu a financování zná
            plán dalších akvizic.
          </p>
          <p className="text-body mt-4 max-w-[54ch] text-text-secondary">
            Investor tak nemá čtyři dodavatele a čtyři verze pravdy, ale jeden propočet a jednu
            odpovědnost.
          </p>
          <Pill href="/jak-investujeme" variant="ghost-light" className="mt-8">
            Jak Vynosium funguje
          </Pill>
        </div>

        <div className="lg:col-span-7">
          <svg
            viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
            className="h-auto w-full"
            role="img"
            aria-label="Diagram propojení: výběr, prověření, financování, rekonstrukce, pronájem, prodej a správa na jedné linii."
          >
            {/* Hairline grid — the drawing-board ground the whole system sits on */}
            <g stroke="var(--color-light-gray)" strokeWidth="1">
              {Array.from({ length: 5 }, (_, i) => (
                <line key={`h${i}`} x1="0" x2={VIEW_W} y1={80 * (i + 1)} y2={80 * (i + 1)} />
              ))}
            </g>

            <path
              ref={lineRef}
              d={`M ${X0} ${Y0} L ${X0 + RUN} ${Y0 - RISE}`}
              stroke="url(#vector-gradient)"
              strokeWidth="1.5"
              fill="none"
            />

            <defs>
              {/* The core gradient, expressed along the identity angle */}
              <linearGradient id="vector-gradient" x1="0" y1="1" x2="1" y2="0">
                <stop offset="0%" stopColor="#102a43" />
                <stop offset="46%" stopColor="#16506b" />
                <stop offset="100%" stopColor="#1f8a70" />
              </linearGradient>
            </defs>

            {MODULES.map((label, i) => {
              const t = i / (MODULES.length - 1);
              const x = X0 + RUN * t;
              const y = Y0 - RISE * t;
              return (
                <g key={label} data-node>
                  <circle
                    cx={x}
                    cy={y}
                    r="4"
                    fill="var(--color-white)"
                    stroke="var(--color-emerald)"
                    strokeWidth="1.5"
                  />
                  {/* Label rides beside its node, no connector tick: the run
                      is diagonal, so a horizontal offset alone already keeps
                      every label clear of its neighbours. */}
                  <text
                    x={x + LABEL_GAP}
                    y={y + 4}
                    fill="var(--color-text-secondary)"
                    style={{ font: "500 11px var(--font-mono)", letterSpacing: "0.14em" }}
                  >
                    {label.toUpperCase()}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>
    </section>
  );
}
