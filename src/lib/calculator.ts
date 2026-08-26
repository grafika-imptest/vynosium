/**
 * Investment model behind the calculator (§3/08).
 *
 * Every figure this produces is a MODEL, not a promise — the UI is
 * required to render the disclaimer alongside it. The
 * assumptions below are deliberately explicit and named so a reviewer can
 * argue with them; a calculator whose parameters are hidden inside the
 * formula is marketing, not a product.
 */

import type { InvestmentPath } from "@/lib/tokens";

export const MODEL_ASSUMPTIONS = {
  /** Gross rental yield on total property value, per year. */
  grossYield: { flip: 0.045, income: 0.058, capital: 0.05, wealth: 0.055 },
  /** Share of gross rent eaten by management, vacancy, tax, repairs. */
  operatingCostRatio: 0.28,
  /** Model price appreciation of the asset itself, per year. */
  appreciation: { flip: 0.03, income: 0.032, capital: 0.035, wealth: 0.035 },
  /** One-off uplift from renovation, realised on flip strategies. */
  renovationUplift: 0.14,
  /** Interest rate on the financed part. */
  mortgageRate: 0.052,
  /** Acquisition costs (legal, tax, fees) as a share of purchase price. */
  acquisitionCostRatio: 0.04,
  /** Scenario band applied to the annualised return (P10 / P90). */
  scenarioSpread: 0.35,
} as const;

export interface CalculatorInput {
  /** Investor equity in CZK. */
  capital: number;
  /** Financing share of the total investment, 0–80 %. */
  ltv: number;
  horizonYears: number;
  type: InvestmentPath;
}

export interface CalculatorOutput {
  /** Total model size of the investment (equity + financing). */
  investmentSize: number;
  financing: number;
  /** Model monthly cashflow after costs and debt service. */
  monthlyCashflow: number;
  /** Model annualised return on the investor's own equity. */
  modelYieldPercent: number;
  /** Model value of the investor's net assets at the end of the horizon. */
  finalValue: number;
  /** Total model gain over the horizon (finalValue − capital). */
  totalGain: number;
}

const MAX_LTV = 80;

export function clampInput(input: CalculatorInput): CalculatorInput {
  return {
    capital: Math.min(Math.max(input.capital, 300_000), 20_000_000),
    ltv: Math.min(Math.max(input.ltv, 0), MAX_LTV),
    horizonYears: Math.min(Math.max(Math.round(input.horizonYears), 1), 15),
    type: input.type,
  };
}

/** Model equity value at `years` into the horizon. */
export function projectedEquity(input: CalculatorInput, years: number): number {
  const { capital, ltv, type } = clampInput(input);
  const a = MODEL_ASSUMPTIONS;

  const investmentSize = capital / (1 - ltv / 100);
  const debt = investmentSize - capital;
  // Acquisition costs are paid out of equity on day one.
  const deployed = investmentSize * (1 - a.acquisitionCostRatio);

  const uplift = type === "flip" ? 1 + a.renovationUplift : 1;
  const propertyValue = deployed * uplift * Math.pow(1 + a.appreciation[type], years);

  const grossRent = deployed * a.grossYield[type] * years;
  const netRent = grossRent * (1 - a.operatingCostRatio);
  const interest = debt * a.mortgageRate * years;

  // Flips do not hold long enough for rent to matter; the model treats
  // rental income as zero for the first year of a flip strategy.
  const rentContribution = type === "flip" && years <= 1 ? 0 : netRent;

  return propertyValue - debt + rentContribution - interest;
}

export function computeCalculator(input: CalculatorInput): CalculatorOutput {
  const { capital, ltv, horizonYears, type } = clampInput(input);
  const a = MODEL_ASSUMPTIONS;

  const investmentSize = capital / (1 - ltv / 100);
  const financing = investmentSize - capital;
  const deployed = investmentSize * (1 - a.acquisitionCostRatio);

  const monthlyGross = (deployed * a.grossYield[type]) / 12;
  const monthlyNet = monthlyGross * (1 - a.operatingCostRatio);
  const monthlyDebtService = (financing * a.mortgageRate) / 12;
  const monthlyCashflow = monthlyNet - monthlyDebtService;

  const finalValue = projectedEquity({ capital, ltv, horizonYears, type }, horizonYears);
  const modelYieldPercent =
    (Math.pow(Math.max(finalValue, 1) / capital, 1 / horizonYears) - 1) * 100;

  return {
    investmentSize,
    financing,
    monthlyCashflow,
    modelYieldPercent,
    finalValue,
    totalGain: finalValue - capital,
  };
}

/* --------------------------------------------------------------------------
   Logarithmic capital slider (§4.3): most investors sit in the lower band,
   so the lower band gets half the travel.
   ------------------------------------------------------------------------ */

const CAPITAL_MIN = 300_000;
const CAPITAL_MAX = 20_000_000;
const CAPITAL_STEP = 50_000;

export function capitalFromSlider(t: number): number {
  const clamped = Math.min(Math.max(t, 0), 1);
  const raw = CAPITAL_MIN * Math.pow(CAPITAL_MAX / CAPITAL_MIN, clamped);
  return Math.round(raw / CAPITAL_STEP) * CAPITAL_STEP;
}

export function sliderFromCapital(capital: number): number {
  const clamped = Math.min(Math.max(capital, CAPITAL_MIN), CAPITAL_MAX);
  return Math.log(clamped / CAPITAL_MIN) / Math.log(CAPITAL_MAX / CAPITAL_MIN);
}
