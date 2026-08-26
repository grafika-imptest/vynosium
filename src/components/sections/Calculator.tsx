"use client";

import { useEffect, useRef, useState } from "react";
import { useGLScene } from "@/components/gl/useGLScene";
import {
  buildCalculatorRibbonScene,
  RIBBON_SAMPLES,
  type RibbonTarget,
} from "@/components/gl/scenes/calculatorRibbonScene";
import { Disclaimer, ModelMark, Pill, SectionIndex } from "@/components/ui/primitives";
import { INVESTMENT_PATHS } from "@/lib/data/paths";
import { DISCLAIMERS } from "@/lib/data/site";
import {
  capitalFromSlider,
  computeCalculator,
  sampleRibbonSeries,
  sliderFromCapital,
} from "@/lib/calculator";
import { formatCzk, formatPercent } from "@/lib/format";
import type { InvestmentPath } from "@/lib/tokens";

const CLIP_MIN = -0.55;
const CLIP_MAX = 0.65;

const DEFAULTS = { capital: 2_000_000, ltv: 30, horizon: 5 };

/**
 * Investment calculator (§3/08). The section that hands over control —
 * a visitor who moved a slider has invested attention.
 *
 * INP discipline (§6): slider `input` events write ONLY to refs. A single
 * rAF loop recomputes the model, writes the ledger digits and slider
 * labels straight into the DOM, and pushes new ribbon vertices to the GL
 * scene. React state is committed once per gesture (on `change`, i.e.
 * pointer release) purely so the CTA href and the screen-reader table
 * stay in sync — dragging never schedules a render.
 */
export function Calculator({
  defaultType = "income",
  index = "08",
}: {
  defaultType?: InvestmentPath;
  index?: string;
}) {
  const capitalRef = useRef(DEFAULTS.capital);
  const ltvRef = useRef(DEFAULTS.ltv);
  const horizonRef = useRef(DEFAULTS.horizon);
  const typeRef = useRef<InvestmentPath>(defaultType);
  const dirty = useRef(true);

  // Committed values — updated at the end of a gesture, not during it.
  const [committed, setCommitted] = useState({
    capital: DEFAULTS.capital,
    ltv: DEFAULTS.ltv,
    horizonYears: DEFAULTS.horizon,
    type: defaultType,
  });

  const target = useRef<RibbonTarget>({ median: [], low: [], high: [] });
  const { hostRef, disabled } = useGLScene("calculator-ribbon", buildCalculatorRibbonScene(target));

  const rootRef = useRef<HTMLDivElement>(null);
  const liveRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const write = (name: string, value: string) => {
      const el = root.querySelector<HTMLElement>(`[data-out="${name}"]`);
      if (el) el.textContent = value;
    };

    let liveTimer: number | undefined;
    let raf = requestAnimationFrame(function tick() {
      raf = requestAnimationFrame(tick);
      if (!dirty.current) return;
      dirty.current = false;

      const input = {
        capital: capitalRef.current,
        ltv: ltvRef.current,
        horizonYears: horizonRef.current,
        type: typeRef.current,
      };
      const output = computeCalculator(input);

      // Slider value labels are written by their own input handler; this
      // loop owns the ledger and the ribbon.
      write("investmentSize", formatCzk(output.investmentSize));
      // Unit lives in the label ("Cashflow měsíčně"), not glued to the
      // digits — a "/ měs." suffix pushed the number out of its column.
      write("cashflow", formatCzk(output.monthlyCashflow));
      write("yield", `${formatPercent(output.modelYieldPercent)} p.a.`);
      write("finalValue", formatCzk(output.finalValue));

      // Leverage warning above 70 % LTV (§4.3) — text, never colour alone.
      const warning = root.querySelector<HTMLElement>('[data-out="ltvWarning"]');
      if (warning) warning.dataset.visible = String(input.ltv > 70);

      // Track fills are CSS custom properties, written here rather than
      // re-rendered.
      const setFill = (name: string, ratio: number) => {
        const el = root.querySelector<HTMLInputElement>(`[data-range="${name}"]`);
        if (el) el.style.setProperty("--fill", `${Math.round(ratio * 100)}%`);
      };
      setFill("capital", sliderFromCapital(input.capital));
      setFill("ltv", input.ltv / 80);
      setFill("horizon", (input.horizonYears - 1) / 14);

      // Same sample count the scene sized its buffers with.
      const series = sampleRibbonSeries(input, RIBBON_SAMPLES);
      const all = [...series.median, ...series.low, ...series.high];
      const min = Math.min(...all);
      const max = Math.max(...all);
      const span = Math.max(max - min, 1);
      const norm = (v: number) => CLIP_MIN + ((v - min) / span) * (CLIP_MAX - CLIP_MIN);
      target.current = {
        median: series.median.map(norm),
        low: series.low.map(norm),
        high: series.high.map(norm),
      };

      // The live region must not fire on every frame of a drag.
      window.clearTimeout(liveTimer);
      liveTimer = window.setTimeout(() => {
        if (liveRef.current) {
          liveRef.current.textContent = summarise(input, output);
        }
      }, 400);
    });

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(liveTimer);
    };
  }, []);

  const commit = () => {
    setCommitted({
      capital: capitalRef.current,
      ltv: ltvRef.current,
      horizonYears: horizonRef.current,
      type: typeRef.current,
    });
  };

  const initialOutput = computeCalculator(committed);
  const ctaHref = `/kontakt?kapital=${committed.capital}&ltv=${committed.ltv}&horizont=${committed.horizonYears}&typ=${committed.type}`;

  return (
    /*
      No z-index on the section itself: the single GL canvas sits at z-1 and
      has to paint OVER this navy background, with the content lifted above
      it. Carrying z-2 here hid the whole ribbon behind the section's own
      background — every other shader section leaves the section at z-auto.
    */
    <section className="relative bg-navy py-[var(--space-10)]" data-scene="calculator">
      <div ref={rootRef} className="relative z-[2] mx-auto max-w-[var(--max-w)] px-[var(--gutter)]">
        <SectionIndex index={index} label="KALKULAČKA" tone="dark" />
        <h2 className="text-display-lg mt-6 max-w-[18ch] text-snow">
          Co mohou vaše peníze v nemovitostech dokázat?
        </h2>

        <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-12">
          {/* Graph sits above the controls on mobile — thumb reach. */}
          <div className="order-1 lg:order-2 lg:col-span-8">
            <div
              className="relative aspect-[16/10] w-full overflow-hidden rounded-[var(--radius-card)] border border-steel/50"
              // Transparent while the GL stage is live: the ribbon is painted
              // by the canvas *behind* this content layer, so any wash here
              // would sit on top of it. The static fallback brings its own.
              style={disabled ? { background: "rgba(22,50,75,0.55)" } : undefined}
              role="img"
              aria-label="Modelový vývoj hodnoty investice včetně pásma scénářů P10 až P90."
            >
              {!disabled ? (
                <div ref={hostRef} className="absolute inset-0" />
              ) : (
                <StaticRibbon input={committed} />
              )}
              <p className="text-label absolute left-4 top-4 text-slate-on-dark">Model. hodnota majetku</p>
              <p className="text-label absolute bottom-4 right-4 text-slate-on-dark">Pásmo scénářů P10–P90</p>
            </div>

            <div ref={liveRef} aria-live="polite" className="sr-only" />

            {/* Screen-reader mirror of the chart (§3/08 a11y). */}
            <table className="sr-only">
              <caption>Modelové výstupy kalkulačky</caption>
              <tbody>
                <tr>
                  <th scope="row">Modelová velikost investice</th>
                  <td>{formatCzk(initialOutput.investmentSize)}</td>
                </tr>
                <tr>
                  <th scope="row">Orientační cashflow měsíčně</th>
                  <td>{formatCzk(initialOutput.monthlyCashflow)}</td>
                </tr>
                <tr>
                  <th scope="row">Modelové zhodnocení</th>
                  <td>{formatPercent(initialOutput.modelYieldPercent)} p.a.</td>
                </tr>
                <tr>
                  <th scope="row">Hodnota majetku po {committed.horizonYears} letech</th>
                  <td>{formatCzk(initialOutput.finalValue)}</td>
                </tr>
              </tbody>
            </table>

            <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-8 border-t border-steel/50 pt-6 xl:grid-cols-4">
              <LedgerRow
                out="investmentSize"
                label="Velikost investice"
                initial={formatCzk(initialOutput.investmentSize)}
                basis="vlastní kapitál + financování"
              />
              <LedgerRow
                out="cashflow"
                label="Cashflow měsíčně"
                initial={formatCzk(initialOutput.monthlyCashflow)}
                basis="po nákladech a splátce"
              />
              <LedgerRow
                out="yield"
                label="Zhodnocení"
                initial={`${formatPercent(initialOutput.modelYieldPercent)} p.a.`}
                basis="z vlastního kapitálu, před zdaněním"
              />
              <LedgerRow
                out="finalValue"
                label="Hodnota majetku"
                initial={formatCzk(initialOutput.finalValue)}
                basis={`po ${committed.horizonYears} letech`}
                emphasise
              />
            </dl>

            <Disclaimer tone="dark" className="mt-6">
              {DISCLAIMERS.calculator}
            </Disclaimer>

            <Pill href={ctaHref} variant="emerald" className="mt-6">
              Chci individuální propočet
            </Pill>
          </div>

          {/* Controls */}
          <div className="order-2 flex flex-col gap-8 lg:order-1 lg:col-span-4">
            <Slider
              name="capital"
              label="Vlastní kapitál"
              initialText={formatCzk(DEFAULTS.capital)}
              min={0}
              max={1}
              step={0.001}
              defaultValue={sliderFromCapital(DEFAULTS.capital)}
              onInput={(v) => {
                capitalRef.current = capitalFromSlider(v);
                dirty.current = true;
                return formatCzk(capitalRef.current);
              }}
              onCommit={commit}
            />
            <Slider
              name="ltv"
              label="Financování (LTV)"
              initialText={`${DEFAULTS.ltv} %`}
              min={0}
              max={80}
              step={5}
              defaultValue={DEFAULTS.ltv}
              onInput={(v) => {
                ltvRef.current = v;
                dirty.current = true;
                return `${v} %`;
              }}
              onCommit={commit}
            />
            <p
              data-out="ltvWarning"
              data-visible="false"
              className="text-disclaimer -mt-4 text-fn-warning opacity-0 transition-opacity duration-[var(--dur-micro)] data-[visible=true]:opacity-100"
            >
              Nad 70 % financování výrazně roste citlivost investice na výpadek nájmu i na růst sazeb.
            </p>
            <Slider
              name="horizon"
              label="Délka investice"
              initialText={`${DEFAULTS.horizon} let`}
              min={1}
              max={15}
              step={1}
              defaultValue={DEFAULTS.horizon}
              onInput={(v) => {
                horizonRef.current = v;
                dirty.current = true;
                return `${v} let`;
              }}
              onCommit={commit}
            />

            <div>
              <p className="text-label mb-4 text-silver">Preferovaný typ investice</p>
              <div className="flex flex-wrap gap-2">
                {INVESTMENT_PATHS.map((path) => {
                  const active = committed.type === path.id;
                  return (
                    <button
                      key={path.id}
                      type="button"
                      aria-pressed={active}
                      onClick={() => {
                        typeRef.current = path.id;
                        dirty.current = true;
                        commit();
                      }}
                      className="focus-ring text-label rounded-[var(--radius-pill)] border px-4 py-2.5 transition-colors duration-[var(--dur-micro)]"
                      style={{
                        borderColor: active ? `var(--color-${path.colorVar})` : "rgba(72,101,129,0.6)",
                        color: active ? `var(--color-${path.colorVar}-on-dark)` : "var(--color-slate-on-dark)",
                      }}
                    >
                      {path.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <p className="text-body-sm max-w-[46ch] text-slate-on-dark">
              Model počítá s pořizovacími náklady, provozními náklady, neobsazeností a úrokem z
              financování. Hodnoty jsou uvedeny před zdaněním.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function LedgerRow({
  out,
  label,
  initial,
  basis,
  emphasise = false,
}: {
  out: string;
  label: string;
  initial: string;
  basis: string;
  emphasise?: boolean;
}) {
  return (
    <div>
      <dt className="text-label text-silver">{label}</dt>
      {/*
        Fluid size and no wrapping: a nine-digit result ("13 866 371 Kč") at
        a fixed 2rem overran its column and lost the currency off the right
        edge. The number is the point of this section — it may shrink, it
        may not break.
      */}
      <dd
        data-out={out}
        className={`text-metric mt-3 whitespace-nowrap ${
          emphasise ? "text-emerald-on-dark" : "text-snow"
        }`}
        style={
          emphasise
            ? { fontSize: "clamp(1.25rem, 1.6vw, 2rem)" }
            : { fontSize: "clamp(1.0625rem, 1.15vw, 1.5rem)" }
        }
      >
        {initial}
      </dd>
      <dd className="text-label mt-2 text-slate-on-dark">
        {basis}
        <ModelMark tone="dark" />
      </dd>
    </div>
  );
}

/**
 * Uncontrolled range input. `onInput` writes to refs and returns the text
 * to paint next to the label; React is not involved until `onCommit`.
 */
function Slider({
  name,
  label,
  initialText,
  min,
  max,
  step,
  defaultValue,
  onInput,
  onCommit,
}: {
  name: string;
  label: string;
  initialText: string;
  min: number;
  max: number;
  step: number;
  defaultValue: number;
  onInput: (value: number) => string;
  onCommit: () => void;
}) {
  const valueRef = useRef<HTMLSpanElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.setProperty("--fill", `${Math.round(((defaultValue - min) / (max - min)) * 100)}%`);
    el.setAttribute("aria-valuetext", initialText);
  }, [defaultValue, min, max, initialText]);

  return (
    <div>
      <div className="mb-3 flex items-baseline justify-between gap-4">
        <label htmlFor={`range-${name}`} className="text-label text-silver">
          {label}
        </label>
        <span ref={valueRef} className="text-data text-snow">
          {initialText}
        </span>
      </div>
      <input
        ref={inputRef}
        id={`range-${name}`}
        data-range={name}
        type="range"
        min={min}
        max={max}
        step={step}
        defaultValue={defaultValue}
        className="calc-range focus-ring"
        onInput={(e) => {
          const el = e.currentTarget;
          const text = onInput(Number(el.value));
          if (valueRef.current) valueRef.current.textContent = text;
          el.setAttribute("aria-valuetext", text);
        }}
        onChange={() => {
          /* value is read from the ref; `change` only commits the gesture */
        }}
        onPointerUp={onCommit}
        onKeyUp={onCommit}
        onBlur={onCommit}
      />
    </div>
  );
}

function summarise(
  input: { capital: number; ltv: number; horizonYears: number },
  output: { investmentSize: number; monthlyCashflow: number; modelYieldPercent: number; finalValue: number }
): string {
  return `Vlastní kapitál ${formatCzk(input.capital)}, financování ${input.ltv} procent, horizont ${
    input.horizonYears
  } let. Modelová velikost investice ${formatCzk(
    output.investmentSize
  )}, orientační měsíční cashflow ${formatCzk(output.monthlyCashflow)}, modelové zhodnocení ${formatPercent(
    output.modelYieldPercent
  )} ročně, modelová hodnota majetku ${formatCzk(output.finalValue)}.`;
}

/**
 * No-WebGL / reduced-motion fallback: the same composition rendered as a
 * static SVG area chart with the same core gradient and the same scenario
 * band. Identical picture, zero movement.
 */
function StaticRibbon({
  input,
}: {
  input: { capital: number; ltv: number; horizonYears: number; type: InvestmentPath };
}) {
  const { median, low, high } = sampleRibbonSeries(input, 40);
  const all = [...median, ...low, ...high];
  const min = Math.min(...all);
  const max = Math.max(...all);
  const span = Math.max(max - min, 1);
  const toPoints = (series: number[]) =>
    series
      .map((v, i) => `${(i / (series.length - 1)) * 100},${95 - ((v - min) / span) * 85}`)
      .join(" ");

  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-full w-full">
      <defs>
        <linearGradient id="static-ribbon" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#102a43" />
          <stop offset="46%" stopColor="#16506b" />
          <stop offset="100%" stopColor="#1f8a70" />
        </linearGradient>
      </defs>
      <polygon points={`${toPoints(low)} ${toPoints(high).split(" ").reverse().join(" ")}`} fill="#486581" opacity="0.25" />
      <polygon points={`0,100 ${toPoints(median)} 100,100`} fill="url(#static-ribbon)" opacity="0.92" />
      <polyline points={toPoints(median)} fill="none" stroke="#1f8a70" strokeWidth="0.6" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}
