"use client";

import { useEffect, useRef } from "react";
import { Pill, SectionIndex } from "@/components/ui/primitives";
import { gsap, ensureGsapRegistered, prefersReducedMotion } from "@/lib/motion";
import { VECTOR_ANGLE_DEG } from "@/lib/tokens";

/**
 * Vynósium introduced (§3/06).
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

const X0 = 40;
const Y0 = 440;
const RUN = 520;
const RISE = RUN * Math.tan((VECTOR_ANGLE_DEG * Math.PI) / 180);

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
          <SectionIndex index="06" label="VYNÓSIUM" tone="light" />
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
            Jak Vynósium funguje
          </Pill>
        </div>

        <div className="lg:col-span-7">
          <svg
            viewBox="0 0 600 480"
            className="h-auto w-full"
            role="img"
            aria-label="Diagram propojení: výběr, prověření, financování, rekonstrukce, pronájem, prodej a správa na jedné linii."
          >
            {/* Hairline grid — the drawing-board ground the whole system sits on */}
            <g stroke="#e4e7eb" strokeWidth="1">
              {Array.from({ length: 6 }, (_, i) => (
                <line key={`h${i}`} x1="0" x2="600" y1={80 * (i + 1)} y2={80 * (i + 1)} />
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
              const above = i % 2 === 0;
              return (
                <g key={label} data-node>
                  <circle cx={x} cy={y} r="4" fill="#ffffff" stroke="#1f8a70" strokeWidth="1.5" />
                  <line
                    x1={x}
                    y1={y}
                    x2={x}
                    y2={above ? y - 26 : y + 26}
                    stroke="#e4e7eb"
                    strokeWidth="1"
                  />
                  <text
                    x={x}
                    y={above ? y - 34 : y + 42}
                    textAnchor="middle"
                    fill="#52606d"
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
