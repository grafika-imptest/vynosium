"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Disclaimer, ModelMark, Pill, SectionIndex } from "@/components/ui/primitives";
import { INVESTMENT_PATHS } from "@/lib/data/paths";
import { DISCLAIMERS } from "@/lib/data/site";
import { ScenarioChart, buildChart, scenariosFor } from "@/components/sections/ScenarioChart";
import { capitalFromSlider, computeCalculator, sliderFromCapital } from "@/lib/calculator";
import { formatCzk, formatPercent } from "@/lib/format";
import type { InvestmentPath } from "@/lib/tokens";

const DEFAULTS = { capital: 2_000_000, ltv: 30, horizon: 5 };

/**
 * Base year of the projection. A constant, not new Date(): this is a client
 * component in a statically exported page, so reading the clock at render
 * time would drift from the built HTML. Bump it with the data.
 */
const START_YEAR = 2026;

/**
 * Investment calculator (§3/08). The section that hands over control —
 * a visitor who moved a slider has invested attention.
 *
 * INP discipline (§6): a slider `input` event writes to refs and then
 * paints the ledger, the slider fills and the chart geometry straight into
 * the DOM. No React re-render per event, and no rAF loop either — a hidden
 * or backgrounded tab gets no frames, which used to freeze the whole
 * read-out mid-drag. React state is committed once per gesture (on pointer
 * release) purely so the CTA href and the screen-reader table stay in sync.
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

  // Committed values — updated at the end of a gesture, not during it.
  const [committed, setCommitted] = useState({
    capital: DEFAULTS.capital,
    ltv: DEFAULTS.ltv,
    horizonYears: DEFAULTS.horizon,
    type: defaultType,
  });

  const rootRef = useRef<HTMLDivElement>(null);
  const liveRef = useRef<HTMLDivElement>(null);
  const liveTimer = useRef<number | undefined>(undefined);

  /**
   * Paints the whole read-out from the current ref values.
   *
   * Called straight from the input handlers, NOT from a rAF loop. The loop
   * this replaces meant the calculator only updated when the browser was
   * painting — and a browser does not run requestAnimationFrame for a
   * hidden or backgrounded tab, so the numbers and the chart could sit
   * frozen while the sliders moved. Range inputs already coalesce their
   * events to roughly one per frame, so writing directly costs the same and
   * cannot go stale. React still is not involved: no re-render per event.
   */
  const render = useCallback(() => {
    const root = rootRef.current;
    if (!root) return;

    const write = (name: string, value: string) => {
      const el = root.querySelector<HTMLElement>(`[data-out="${name}"]`);
      if (el) el.textContent = value;
    };

    {
      const input = {
        capital: capitalRef.current,
        ltv: ltvRef.current,
        horizonYears: horizonRef.current,
        type: typeRef.current,
      };
      const output = computeCalculator(input);

      // Slider value labels are written by their own input handler; this
      // function owns the ledger and the chart.
      write("investmentSize", formatCzk(output.investmentSize));
      // Unit lives in the label ("Cashflow měsíčně"), not glued to the
      // digits — a "/ měs." suffix pushed the number out of its column.
      write("cashflow", formatCzk(output.monthlyCashflow));
      write("yield", `${formatPercent(output.modelYieldPercent)} p.a.`);
      write("finalValue", formatCzk(output.finalValue));
      write("chartCapital", formatCzk(input.capital));

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

      /*
       * Chart update, in place. The same geometry function the server render
       * used, so what this writes and what React would render agree — no
       * re-render needed while a slider is moving.
       */
      const scenarios = scenariosFor(input.type, output.modelYieldPercent);
      const geo = buildChart(input.capital, input.horizonYears, scenarios, START_YEAR);

      for (const l of geo.lines) {
        root.querySelector(`[data-chart-line="${l.key}"]`)?.setAttribute("points", l.line);
        root.querySelector(`[data-chart-area="${l.key}"]`)?.setAttribute("points", l.area);
        const label = root.querySelector(`[data-chart-label="${l.key}"]`);
        if (label) {
          label.setAttribute("x", String(l.labelX));
          label.setAttribute("y", String(l.labelY));
          label.textContent = l.label;
        }
        const rate = root.querySelector(`[data-chart-rate="${l.key}"]`);
        if (rate) rate.textContent = l.label;
      }
      geo.yTicks.forEach((tick, i) => {
        const grid = root.querySelector(`[data-chart-grid="${i}"]`);
        if (grid) {
          grid.setAttribute("y1", String(tick.y));
          grid.setAttribute("y2", String(tick.y));
        }
        const text = root.querySelector(`[data-chart-ytick="${i}"]`);
        if (text) {
          text.setAttribute("y", String(tick.y + 4));
          text.textContent = tick.label;
        }
      });
      geo.xTicks.forEach((tick, i) => {
        const text = root.querySelector(`[data-chart-xtick="${i}"]`);
        if (text) {
          text.setAttribute("x", String(tick.x));
          text.textContent = tick.label;
        }
      });

      // The live region must not announce every step of a drag.
      window.clearTimeout(liveTimer.current);
      liveTimer.current = window.setTimeout(() => {
        if (liveRef.current) {
          liveRef.current.textContent = summarise(input, output);
        }
      }, 400);
    }
  }, []);

  // First paint after hydration, and a cleanup for the pending announcement.
  useEffect(() => {
    render();
    return () => window.clearTimeout(liveTimer.current);
  }, [render]);

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
    <section className="relative z-[2] bg-navy py-[var(--space-10)]">
      <div ref={rootRef} className="relative z-[2] mx-auto max-w-[var(--max-w)] px-[var(--gutter)]">
        <SectionIndex index={index} label="KALKULAČKA" tone="dark" />
        <h2 className="text-display-lg mt-6 max-w-[18ch] text-snow">
          Co mohou vaše peníze v nemovitostech dokázat?
        </h2>

        <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-12">
          {/* Graph sits above the controls on mobile — thumb reach. */}
          <div className="order-1 lg:order-2 lg:col-span-8">
            <div
              className="rounded-[var(--radius-card)] border border-steel/50 p-6"
              style={{ background: "rgba(22,50,75,0.55)" }}
            >
              <ScenarioChart
                capital={committed.capital}
                years={committed.horizonYears}
                scenarios={scenariosFor(committed.type, initialOutput.modelYieldPercent)}
                startYear={START_YEAR}
              />
              <p className="text-label mt-2 text-slate-on-dark">
                Modelový vývoj hodnoty majetku při vstupu{" "}
                <span data-out="chartCapital">{formatCzk(committed.capital)}</span>
              </p>
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
                render();
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
                render();
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
                render();
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
                                commit();
                      }}
                      className="focus-ring text-label whitespace-nowrap rounded-[var(--radius-pill)] border px-4 py-2.5 transition-colors duration-[var(--dur-micro)]"
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

