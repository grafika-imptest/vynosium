import type { InvestmentPath } from "@/lib/tokens";

/**
 * Illustrative model only — not investment advice, not a guarantee.
 * Yield assumptions below are placeholder round numbers for demonstrating
 * the calculator mechanics; a real deployment must source these from
 * Vynósium's actual underwriting data before launch.
 */
const MODEL_ANNUAL_YIELD: Record<InvestmentPath, number> = {
  flip: 0.22, // one-time, but modeled as if compounded for the ribbon curve
  income: 0.06,
  capital: 0.1,
  wealth: 0.07,
};

const MODEL_MONTHLY_CASHFLOW_RATE: Record<InvestmentPath, number> = {
  flip: 0,
  income: 0.0045,
  capital: 0.001,
  wealth: 0.003,
};

export type CalculatorInput = {
  capital: number; // own capital, CZK
  ltv: number; // 0..80, percent
  horizonYears: number; // 1..15
  type: InvestmentPath;
};

export type CalculatorOutput = {
  investmentSize: number;
  monthlyCashflow: number;
  modelYieldPercent: number;
  finalValue: number;
  seriesMedian: number[]; // yearly points, length = horizonYears + 1
  seriesLow: number[]; // P10
  seriesHigh: number[]; // P90
};

export const RIBBON_SAMPLES = 40;

/**
 * Fixed-length (RIBBON_SAMPLES) continuous curve sample, independent of
 * horizonYears — keeps the WebGL ribbon's vertex count constant so
 * changing the horizon slider never needs to rebuild geometry, only
 * re-target the existing vertices for a smooth ease.
 */
export function sampleRibbonSeries(input: CalculatorInput): { median: number[]; low: number[]; high: number[] } {
  const { capital, ltv, horizonYears, type } = input;
  const annualYield = MODEL_ANNUAL_YIELD[type];
  const leverageBoost = 1 + (ltv / 100) * 0.6;
  const effectiveYield = annualYield * leverageBoost;

  const median: number[] = [];
  const low: number[] = [];
  const high: number[] = [];
  for (let i = 0; i < RIBBON_SAMPLES; i++) {
    const t = (i / (RIBBON_SAMPLES - 1)) * horizonYears;
    median.push(capital * Math.pow(1 + effectiveYield, t));
    low.push(capital * Math.pow(1 + effectiveYield * 0.45, t));
    high.push(capital * Math.pow(1 + effectiveYield * 1.55, t));
  }
  return { median, low, high };
}

export function computeCalculator({ capital, ltv, horizonYears, type }: CalculatorInput): CalculatorOutput {
  const investmentSize = ltv > 0 ? capital / (1 - ltv / 100) : capital;
  const annualYield = MODEL_ANNUAL_YIELD[type];
  const leverageBoost = 1 + (ltv / 100) * 0.6; // financing amplifies return on own capital
  const effectiveYield = annualYield * leverageBoost;

  const seriesMedian: number[] = [];
  const seriesLow: number[] = [];
  const seriesHigh: number[] = [];
  for (let year = 0; year <= horizonYears; year++) {
    const median = capital * Math.pow(1 + effectiveYield, year);
    seriesMedian.push(median);
    seriesLow.push(capital * Math.pow(1 + effectiveYield * 0.45, year));
    seriesHigh.push(capital * Math.pow(1 + effectiveYield * 1.55, year));
  }

  const monthlyCashflow = investmentSize * MODEL_MONTHLY_CASHFLOW_RATE[type];
  const finalValue = seriesMedian[seriesMedian.length - 1];

  return {
    investmentSize,
    monthlyCashflow,
    modelYieldPercent: effectiveYield * 100,
    finalValue,
    seriesMedian,
    seriesLow,
    seriesHigh,
  };
}

/** Logarithmic slider mapping — §4.3: lower band gets half the travel. */
export function capitalFromSlider(t: number): number {
  // t in 0..1 → 300 000..20 000 000, log-mapped, rounded to nearest 50 000.
  const min = 300_000;
  const max = 20_000_000;
  const value = min * Math.pow(max / min, t);
  return Math.round(value / 50_000) * 50_000;
}

export function sliderFromCapital(value: number): number {
  const min = 300_000;
  const max = 20_000_000;
  return Math.log(value / min) / Math.log(max / min);
}
