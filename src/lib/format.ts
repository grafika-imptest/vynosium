/**
 * cs-CZ number formatting (§5). Never build these strings by hand:
 * the thousands separator must be a non-breaking space, the decimal mark
 * a comma, and percentages carry a space before the sign.
 */

const czk = new Intl.NumberFormat("cs-CZ", {
  style: "currency",
  currency: "CZK",
  maximumFractionDigits: 0,
});

const plain = new Intl.NumberFormat("cs-CZ", { maximumFractionDigits: 0 });

const oneDecimal = new Intl.NumberFormat("cs-CZ", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

export function formatCzk(value: number): string {
  return czk.format(Math.round(value));
}

/** Large sums read better in millions/billions on metric blocks. */
export function formatCzkCompact(value: number): string {
  if (Math.abs(value) >= 1_000_000_000) return `${oneDecimal.format(value / 1_000_000_000)} mld. Kč`;
  if (Math.abs(value) >= 1_000_000) return `${plain.format(value / 1_000_000)} mil. Kč`;
  return formatCzk(value);
}

export function formatNumber(value: number): string {
  return plain.format(value);
}

export function formatPercent(value: number, decimals = 1): string {
  const fmt = new Intl.NumberFormat("cs-CZ", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
  return `${fmt.format(value)} %`;
}

export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("cs-CZ", { day: "numeric", month: "long", year: "numeric" }).format(
    new Date(iso)
  );
}
