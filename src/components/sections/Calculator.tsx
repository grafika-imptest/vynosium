"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useGLScene } from "@/components/gl/useGLScene";
import { buildCalculatorRibbonScene, type RibbonTarget } from "@/components/gl/scenes/calculatorRibbonScene";
import { SectionIndex } from "@/components/ui/SectionIndex";
import { Disclaimer, DISCLAIMERS } from "@/components/ui/Disclaimer";
import { Pill } from "@/components/ui/Pill";
import { INVESTMENT_PATHS } from "@/lib/data/paths";
import {
  capitalFromSlider,
  computeCalculator,
  sampleRibbonSeries,
  sliderFromCapital,
} from "@/lib/calculator";
import { formatCzk, formatPercent } from "@/lib/format";
import { prefersReducedMotion } from "@/lib/motion";
import type { InvestmentPath } from "@/lib/tokens";

const COLOR_Y_MIN = -0.55;
const COLOR_Y_MAX = 0.65;

export function Calculator({ defaultType = "income" }: { defaultType?: InvestmentPath }) {
  const [capital, setCapital] = useState(2_000_000);
  const [ltv, setLtv] = useState(30);
  const [horizonYears, setHorizonYears] = useState(5);
  const [type, setType] = useState<InvestmentPath>(defaultType);

  const output = useMemo(
    () => computeCalculator({ capital, ltv, horizonYears, type }),
    [capital, ltv, horizonYears, type]
  );

  const targetRef = useRef<RibbonTarget>({ median: [], low: [], high: [] });
  const reduced = useMemo(() => prefersReducedMotion(), []);

  useEffect(() => {
    const { median, low, high } = sampleRibbonSeries({ capital, ltv, horizonYears, type });
    const allValues = [...median, ...low, ...high];
    const min = Math.min(...allValues);
    const max = Math.max(...allValues);
    const span = Math.max(max - min, 1);
    const norm = (v: number) => COLOR_Y_MIN + ((v - min) / span) * (COLOR_Y_MAX - COLOR_Y_MIN);
    targetRef.current = { median: median.map(norm), low: low.map(norm), high: high.map(norm) };
  }, [capital, ltv, horizonYears, type]);

  const { hostRef, disabled } = useGLScene("calculator-ribbon", () => buildCalculatorRibbonScene(targetRef));

  const summaryText = `Vlastní kapitál ${formatCzk(capital)}, financování ${ltv} %, horizont ${horizonYears} let. Modelová velikost investice ${formatCzk(
    output.investmentSize
  )}, orientační měsíční cashflow ${formatCzk(output.monthlyCashflow)}, modelové zhodnocení ${formatPercent(
    output.modelYieldPercent
  )} p.a., hodnota majetku po ${horizonYears} letech ${formatCzk(output.finalValue)}.`;

  const ctaHref = `/kontakt?kapital=${capital}&ltv=${ltv}&horizont=${horizonYears}&typ=${type}`;

  return (
    <section className="relative bg-navy py-[var(--space-10)]" data-scene="calculator">
      <div className="mx-auto max-w-[var(--max-w)] px-[var(--gutter)]">
        <SectionIndex index="08" label="KALKULAČKA" tone="dark" className="mb-6" />
        <h2 className="text-display-lg max-w-[16ch] text-snow">Co mohou vaše peníze v nemovitostech dokázat?</h2>

        <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-12">
          {/* Graph — above controls on mobile (thumb reach), right side on desktop */}
          <div className="order-1 lg:order-2 lg:col-span-8">
            <div
              className="relative aspect-[16/10] w-full overflow-hidden rounded-[10px] border border-steel/50 bg-surface-1"
              role="img"
              aria-label={summaryText}
            >
              {!disabled ? (
                <div ref={hostRef} className="absolute inset-0" />
              ) : (
                <StaticRibbonFallback median={sampleRibbonSeries({ capital, ltv, horizonYears, type }).median} />
              )}
            </div>

            <div aria-live="polite" className="sr-only">
              {summaryText}
            </div>

            <table className="sr-only">
              <caption>Modelové výstupy kalkulačky</caption>
              <tbody>
                <tr>
                  <th scope="row">Modelová velikost investice</th>
                  <td>{formatCzk(output.investmentSize)}</td>
                </tr>
                <tr>
                  <th scope="row">Orientační cashflow měsíčně</th>
                  <td>{formatCzk(output.monthlyCashflow)}</td>
                </tr>
                <tr>
                  <th scope="row">Modelové zhodnocení p.a.</th>
                  <td>{formatPercent(output.modelYieldPercent)}</td>
                </tr>
                <tr>
                  <th scope="row">Hodnota majetku po {horizonYears} letech</th>
                  <td>{formatCzk(output.finalValue)}</td>
                </tr>
              </tbody>
            </table>

            <div className="mt-6 grid grid-cols-2 gap-6 border-t border-steel/40 pt-6 lg:grid-cols-4">
              <Ledger label="Velikost investice" value={formatCzk(output.investmentSize)} />
              <Ledger label="Cashflow měsíčně" value={formatCzk(output.monthlyCashflow)} />
              <Ledger label="Zhodnocení p.a." value={formatPercent(output.modelYieldPercent)} />
              <Ledger label="Hodnota majetku" value={formatCzk(output.finalValue)} emphasize />
            </div>

            <Disclaimer className="mt-5">{DISCLAIMERS.calculator}</Disclaimer>

            <Pill href={ctaHref} variant="emerald" className="mt-6">
              Chci individuální propočet
            </Pill>
          </div>

          {/* Controls */}
          <div className="order-2 flex flex-col gap-8 lg:order-1 lg:col-span-4">
            <SliderField
              label="Vlastní kapitál"
              valueText={formatCzk(capital)}
              min={0}
              max={1}
              step={0.001}
              value={sliderFromCapital(capital)}
              onChange={(t) => setCapital(capitalFromSlider(t))}
            />
            <SliderField
              label="Financování (LTV)"
              valueText={`${ltv} %`}
              min={0}
              max={80}
              step={5}
              value={ltv}
              onChange={(v) => setLtv(v)}
              warning={ltv > 70 ? "Nad 70 % roste rizikovost páky." : undefined}
            />
            <SliderField
              label="Délka investice"
              valueText={`${horizonYears} let`}
              min={1}
              max={15}
              step={1}
              value={horizonYears}
              onChange={(v) => setHorizonYears(v)}
            />
            <div>
              <p className="text-label mb-3 text-slate">Preferovaný typ investice</p>
              <div className="flex flex-wrap gap-2">
                {INVESTMENT_PATHS.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setType(p.id)}
                    className="focus-ring rounded-[9999px] border px-4 py-2 text-xs uppercase tracking-[0.1em] transition-colors"
                    style={{
                      borderColor: type === p.id ? `var(--color-${p.colorVar})` : "rgba(72,101,129,0.6)",
                      color: type === p.id ? `var(--color-${p.colorVar})` : "var(--color-slate)",
                    }}
                    aria-pressed={type === p.id}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Ledger({ label, value, emphasize = false }: { label: string; value: string; emphasize?: boolean }) {
  return (
    <div>
      <p className="text-label text-slate">{label}</p>
      <p className={`text-metric mt-1 ${emphasize ? "text-emerald text-[1.75rem]" : "text-snow"}`}>{value}</p>
    </div>
  );
}

function SliderField({
  label,
  valueText,
  min,
  max,
  step,
  value,
  onChange,
  warning,
}: {
  label: string;
  valueText: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (v: number) => void;
  warning?: string;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <label className="text-label text-slate">{label}</label>
        <span className="text-data text-snow">{valueText}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-valuetext={valueText}
        className="calc-range focus-ring w-full"
      />
      {warning && <p className="text-disclaimer mt-2 text-fn-warning">{warning}</p>}
      <style jsx>{`
        .calc-range {
          appearance: none;
          height: 4px;
          border-radius: 9999px;
          background: var(--color-line-deep);
          min-height: 44px;
          display: block;
        }
        .calc-range::-webkit-slider-runnable-track {
          height: 4px;
          border-radius: 9999px;
          background: var(--color-line-deep);
        }
        .calc-range::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 9999px;
          background: var(--color-navy);
          border: 1.5px solid var(--color-emerald);
          margin-top: -8px;
          cursor: pointer;
        }
        .calc-range::-moz-range-track {
          height: 4px;
          border-radius: 9999px;
          background: var(--color-line-deep);
        }
        .calc-range::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 9999px;
          background: var(--color-navy);
          border: 1.5px solid var(--color-emerald);
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}

function StaticRibbonFallback({ median }: { median: number[] }) {
  const min = Math.min(...median);
  const max = Math.max(...median);
  const span = Math.max(max - min, 1);
  const points = median
    .map((v, i) => {
      const x = (i / (median.length - 1)) * 100;
      const y = 100 - ((v - min) / span) * 90 - 5;
      return `${x},${y}`;
    })
    .join(" ");
  const areaPoints = `0,100 ${points} 100,100`;

  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-full w-full">
      <defs>
        <linearGradient id="ribbon-fallback-gradient" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#102A43" />
          <stop offset="100%" stopColor="#1F8A70" />
        </linearGradient>
      </defs>
      <polygon points={areaPoints} fill="url(#ribbon-fallback-gradient)" opacity={0.5} />
      <polyline points={points} fill="none" stroke="#1F8A70" strokeWidth={0.6} vectorEffect="non-scaling-stroke" />
    </svg>
  );
}
