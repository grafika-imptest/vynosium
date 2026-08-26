"use client";

import { useEffect, useRef } from "react";
import { Disclaimer } from "@/components/ui/primitives";
import { DISCLAIMERS } from "@/lib/data/site";
import { gsap, ensureGsapRegistered, prefersReducedMotion } from "@/lib/motion";
import { VECTOR_ANGLE_DEG } from "@/lib/tokens";

/**
 * Investment scenario (§15/5): purchase → renovation → rent or sale →
 * return, plotted on the 38.5° vector and scrubbed by scroll. Every node
 * carries an amount and a time, and the model disclaimer sits with it.
 */
export function ScenarioVector({
  nodes,
  tone = "dark",
}: {
  nodes: { node: string; amount: string; time: string }[];
  tone?: "dark" | "light";
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<SVGLineElement>(null);

  const X0 = 60;
  const Y0 = 300;
  const RUN = 660;
  const RISE = RUN * Math.tan((VECTOR_ANGLE_DEG * Math.PI) / 180) * 0.45;

  useEffect(() => {
    const root = rootRef.current;
    const line = lineRef.current;
    if (!root || !line) return;
    ensureGsapRegistered();

    const ctx = gsap.context(() => {
      const length = line.getTotalLength();
      const marks = root.querySelectorAll("[data-node]");

      if (prefersReducedMotion()) {
        gsap.set(line, { strokeDasharray: length, strokeDashoffset: 0 });
        gsap.set(marks, { opacity: 1 });
        return;
      }

      gsap.set(line, { strokeDasharray: length, strokeDashoffset: length });
      gsap.set(marks, { opacity: 0.25 });

      gsap.to(line, {
        strokeDashoffset: 0,
        ease: "none",
        scrollTrigger: { trigger: root, start: "top 75%", end: "bottom 65%", scrub: 1 },
      });

      marks.forEach((mark, i) => {
        gsap.to(mark, {
          opacity: 1,
          ease: "none",
          scrollTrigger: { trigger: root, start: `top ${74 - i * 6}%`, end: "+=140", scrub: 1 },
        });
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  const dark = tone === "dark";

  return (
    <div ref={rootRef}>
      <svg
        viewBox="0 0 780 340"
        className="h-auto w-full"
        role="img"
        aria-label={nodes.map((n) => `${n.node}: ${n.amount}, ${n.time}`).join("; ")}
      >
        <line
          ref={lineRef}
          x1={X0}
          y1={Y0}
          x2={X0 + RUN}
          y2={Y0 - RISE}
          stroke="url(#scenario-gradient)"
          strokeWidth="1.5"
        />
        <defs>
          <linearGradient id="scenario-gradient" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0%" stopColor={dark ? "#243b53" : "#102a43"} />
            <stop offset="46%" stopColor="#16506b" />
            <stop offset="100%" stopColor="#1f8a70" />
          </linearGradient>
        </defs>

        {nodes.map((node, i) => {
          const t = nodes.length === 1 ? 0 : i / (nodes.length - 1);
          const x = X0 + RUN * t;
          const y = Y0 - RISE * t;
          return (
            <g key={node.node} data-node>
              <circle
                cx={x}
                cy={y}
                r="4"
                fill={dark ? "#102a43" : "#ffffff"}
                stroke="#1f8a70"
                strokeWidth="1.5"
              />
              <line x1={x} y1={y - 10} x2={x} y2={y - 46} stroke={dark ? "#486581" : "#e4e7eb"} />
              <text
                x={x}
                y={y - 58}
                textAnchor="middle"
                fill={dark ? "#f8f8f8" : "#102a43"}
                style={{ font: "500 13px var(--font-sans)" }}
              >
                {node.node}
              </text>
              <text
                x={x}
                y={y + 26}
                textAnchor="middle"
                fill={dark ? "#f8f8f8" : "#102a43"}
                style={{ font: "500 13px var(--font-mono)", letterSpacing: "0.04em" }}
              >
                {node.amount}
              </text>
              <text
                x={x}
                y={y + 44}
                textAnchor="middle"
                fill={dark ? "var(--color-slate-on-dark)" : "var(--color-text-muted)"}
                style={{ font: "400 11px var(--font-mono)", letterSpacing: "0.14em" }}
              >
                {node.time.toUpperCase()}
              </text>
            </g>
          );
        })}
      </svg>

      <Disclaimer tone={dark ? "dark" : "light"} className="mt-4">
        {DISCLAIMERS.scenario}
      </Disclaimer>
    </div>
  );
}
