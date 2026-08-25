/**
 * cs-CZ number formatting per design.md §5: nezlomitelná mezera jako
 * oddělovač tisíců, desetinná čárka, "mld. Kč" u velkých částek. Always
 * Intl.NumberFormat('cs-CZ') — never a manual string.
 */

const czFormatter = new Intl.NumberFormat("cs-CZ", { maximumFractionDigits: 0 });
const czDecimalFormatter = new Intl.NumberFormat("cs-CZ", { maximumFractionDigits: 1 });

export function formatCzk(value: number): string {
  return `${czFormatter.format(Math.round(value))} Kč`;
}

/** For very large sums, e.g. "2,4 mld. Kč" */
export function formatCzkBillions(value: number): string {
  const billions = value / 1_000_000_000;
  return `${czDecimalFormatter.format(billions)} mld. Kč`;
}

export function formatPercent(value: number, decimals = 1): string {
  const formatter = new Intl.NumberFormat("cs-CZ", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
  return `${formatter.format(value)} %`;
}

export function formatNumber(value: number): string {
  return czFormatter.format(Math.round(value));
}

export function formatYears(value: number): string {
  const rem10 = value % 10;
  const rem100 = value % 100;
  let unit = "let";
  if (rem10 === 1 && rem100 !== 11) unit = "rok";
  else if (rem10 >= 2 && rem10 <= 4 && (rem100 < 12 || rem100 > 14)) unit = "roky";
  return `${value} ${unit}`;
}

export function formatMonths(value: number): string {
  const rem10 = value % 10;
  const rem100 = value % 100;
  let unit = "měsíců";
  if (rem10 === 1 && rem100 !== 11) unit = "měsíc";
  else if (rem10 >= 2 && rem10 <= 4 && (rem100 < 12 || rem100 > 14)) unit = "měsíce";
  return `${value} ${unit}`;
}
