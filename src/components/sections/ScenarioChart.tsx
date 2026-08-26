import { MODEL_ASSUMPTIONS } from "@/lib/calculator";
import type { InvestmentPath } from "@/lib/tokens";

/**
 * Scenario chart for the calculator (§3/08).
 *
 * Plain SVG, computed synchronously from the inputs — deliberately not
 * WebGL. The shader ribbon it replaces depended on a GL context, an idle
 * callback and a rAF handshake, and any one of those failing left the most
 * important number on the site as an empty box. This renders in the server
 * HTML, needs no JS to be correct, and the calculator's rAF loop updates
 * the same nodes in place while a slider is dragged.
 *
 * Four scenarios, one baseline: the model rate for the chosen strategy,
 * the same rate plus and minus the scenario spread, and the CNB inflation
 * target as the "doing nothing" comparison.
 */

const VB_W = 1000;
const VB_H = 560;
const PLOT = { left: 64, right: 812, top: 56, bottom: 452 };
/** Fixed number of x-axis slots — see the note in buildChart. */
const X_TICKS = 6;

export interface Scenario {
  key: string;
  label: string;
  ratePct: number;
  /** Line colour — a text-safe token, these carry labels. */
  color: string;
}

export function scenariosFor(type: InvestmentPath, modelRatePct: number): Scenario[] {
  const spread = MODEL_ASSUMPTIONS.scenarioSpread;
  const favourable = modelRatePct * (1 + spread);
  const conservative = modelRatePct * (1 - spread);
  return [
    { key: "favourable", label: "Příznivý scénář", ratePct: favourable, color: "var(--color-emerald-on-dark)" },
    { key: "model", label: "Modelový scénář", ratePct: modelRatePct, color: "var(--color-path-income-on-dark)" },
    { key: "conservative", label: "Konzervativní scénář", ratePct: conservative, color: "var(--color-path-wealth-on-dark)" },
    { key: "inflation", label: "Inflační cíl ČNB", ratePct: 2, color: "var(--color-path-capital-on-dark)" },
  ];
}

export interface ChartGeometry {
  lines: { key: string; line: string; area: string; labelX: number; labelY: number; label: string }[];
  yTicks: { y: number; label: string }[];
  xTicks: { x: number; label: string }[];
}

const millions = new Intl.NumberFormat("cs-CZ", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});
const percent = new Intl.NumberFormat("cs-CZ", { maximumFractionDigits: 1 });

/** Pure geometry — shared by the initial render and the live updates. */
export function buildChart(
  capital: number,
  years: number,
  scenarios: Scenario[],
  startYear: number
): ChartGeometry {
  const value = (ratePct: number, year: number) => capital * Math.pow(1 + ratePct / 100, year);
  const top = Math.max(...scenarios.map((s) => value(s.ratePct, years)));
  // Headroom so the highest line never touches the frame.
  const max = capital + (top - capital) * 1.08;
  const span = Math.max(max - capital, 1);

  const x = (year: number) => PLOT.left + (year / Math.max(years, 1)) * (PLOT.right - PLOT.left);
  const y = (v: number) => PLOT.bottom - ((v - capital) / span) * (PLOT.bottom - PLOT.top);

  const lines = scenarios.map((s) => {
    const points: string[] = [];
    for (let year = 0; year <= years; year++) {
      points.push(`${x(year).toFixed(1)},${y(value(s.ratePct, year)).toFixed(1)}`);
    }
    const endY = y(value(s.ratePct, years));
    return {
      key: s.key,
      line: points.join(" "),
      // Area closes back along the baseline.
      area: `${points.join(" ")} ${x(years).toFixed(1)},${PLOT.bottom} ${PLOT.left},${PLOT.bottom}`,
      labelX: x(years) - 12,
      labelY: endY - 10,
      label: `${percent.format(s.ratePct)} %`,
    };
  });

  const yTicks = Array.from({ length: 5 }, (_, i) => {
    const v = capital + (span * i) / 4;
    return {
      y: y(v),
      label: `${millions.format(v / 1_000_000)} mil.`,
    };
  });

  /*
   * Always exactly X_TICKS nodes, so the live update can address them by
   * index. A variable-length axis left stale labels behind: the DOM keeps
   * whatever the last longer horizon rendered, and the final year showed a
   * year from a previous setting. Unused slots are blanked, never removed.
   */
  const xTicks: { x: number; label: string }[] = [];
  const seen = new Set<number>();
  for (let i = 0; i < X_TICKS; i++) {
    const year = Math.round((i / (X_TICKS - 1)) * years);
    if (seen.has(year)) {
      xTicks.push({ x: -999, label: "" });
      continue;
    }
    seen.add(year);
    xTicks.push({ x: x(year), label: year === 0 ? "Investice" : String(startYear + year) });
  }

  return { lines, yTicks, xTicks };
}

export function ScenarioChart({
  capital,
  years,
  scenarios,
  startYear,
}: {
  capital: number;
  years: number;
  scenarios: Scenario[];
  startYear: number;
}) {
  const geo = buildChart(capital, years, scenarios, startYear);

  return (
    <figure className="m-0">
      {/* Legend */}
      <ul className="flex flex-wrap gap-x-6 gap-y-2">
        {scenarios.map((s) => (
          <li key={s.key} className="text-label flex items-center gap-2 text-silver">
            <span
              aria-hidden="true"
              className="inline-block h-2 w-2 rounded-full"
              style={{ background: s.color }}
            />
            {s.label}
            <span data-chart-rate={s.key} style={{ color: s.color }}>
              {geo.lines.find((l) => l.key === s.key)?.label}
            </span>
          </li>
        ))}
      </ul>

      <svg
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        className="mt-6 h-auto w-full"
        data-scenario-chart
        role="img"
        aria-label="Modelový vývoj hodnoty investice ve čtyřech scénářích."
      >
        <defs>
          {scenarios.map((s) => (
            <linearGradient key={s.key} id={`fill-${s.key}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={s.color} stopOpacity="0.28" />
              <stop offset="100%" stopColor={s.color} stopOpacity="0.02" />
            </linearGradient>
          ))}
        </defs>

        {/* Hairline grid + value axis on the right */}
        {geo.yTicks.map((tick, i) => (
          <g key={`y${i}`}>
            <line
              data-chart-grid={i}
              x1={PLOT.left}
              x2={PLOT.right}
              y1={tick.y}
              y2={tick.y}
              stroke="var(--color-steel)"
              strokeOpacity="0.35"
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
            />
            <text
              data-chart-ytick={i}
              x={PLOT.right + 20}
              y={tick.y + 4}
              fill="var(--color-slate-on-dark)"
              style={{ font: "400 13px var(--font-mono)", letterSpacing: "0.04em" }}
            >
              {tick.label}
            </text>
          </g>
        ))}

        {/* Areas first, then lines, so the strokes stay crisp. Highest rate
            painted first so the flatter scenarios read on top of it. */}
        {geo.lines.map((l) => (
          <polygon key={`a-${l.key}`} data-chart-area={l.key} points={l.area} fill={`url(#fill-${l.key})`} />
        ))}
        {geo.lines.map((l) => {
          const scenario = scenarios.find((s) => s.key === l.key);
          return (
            <polyline
              key={`l-${l.key}`}
              data-chart-line={l.key}
              points={l.line}
              fill="none"
              stroke={scenario?.color}
              strokeWidth="2"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
            />
          );
        })}

        {/* Rate label at the end of each line */}
        {geo.lines.map((l) => {
          const scenario = scenarios.find((s) => s.key === l.key);
          return (
            <text
              key={`t-${l.key}`}
              data-chart-label={l.key}
              x={l.labelX}
              y={l.labelY}
              textAnchor="end"
              fill={scenario?.color}
              style={{ font: "500 15px var(--font-mono)" }}
            >
              {l.label}
            </text>
          );
        })}

        {/* Year axis */}
        <line
          x1={PLOT.left}
          x2={PLOT.right}
          y1={PLOT.bottom}
          y2={PLOT.bottom}
          stroke="var(--color-steel)"
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
        />
        {geo.xTicks.map((tick, i) => (
          <text
            key={`x${i}`}
            data-chart-xtick={i}
            x={tick.x}
            y={PLOT.bottom + 32}
            textAnchor={i === 0 ? "start" : "middle"}
            fill="var(--color-slate-on-dark)"
            style={{ font: "400 13px var(--font-mono)", letterSpacing: "0.04em" }}
          >
            {tick.label}
          </text>
        ))}
      </svg>
    </figure>
  );
}
