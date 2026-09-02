import { Disclaimer, SectionIndex } from "@/components/ui/primitives";

/**
 * What each route actually lets you do (client review, item 10).
 *
 * The client asked for a comparison against a savings account and a fund.
 * This is the most legally exposed thing on the site — it says something
 * about other people's products and, done carelessly, implies a return — so
 * it compares MECHANICS, not yields: whether the thing is a real asset,
 * whether a bank will lend against it, whether anyone manages it for you,
 * whether its value can be actively raised.
 *
 * Every cell is a property of the instrument, checkable by anyone. There is
 * not a single number in the table, which is what keeps it defensible: the
 * moment it carries "5,8 % vs 2,1 %" it becomes investment advice with a
 * comparison the firm cannot substantiate for every reader.
 *
 * If the client insists on returns side by side, that is their call to make
 * in writing — see the note in the commit that added this.
 */
const ROWS = [
  {
    property: "Reálné aktivum",
    note: "Hmotný majetek s doložitelnou hodnotou",
    values: [false, false, true, true],
  },
  {
    property: "Pravidelný příjem",
    note: "Výplata v průběhu držby",
    values: [true, "partial", true, true],
  },
  {
    property: "Bankovní páka",
    note: "Možnost financovat část cizím kapitálem",
    values: [false, false, true, true],
  },
  {
    property: "Aktivní zvýšení hodnoty",
    note: "Hodnotu lze ovlivnit zásahem, ne jen trhem",
    values: [false, false, true, true],
  },
  {
    property: "Kompletní správa",
    note: "O provoz se stará někdo jiný",
    values: [true, true, false, true],
  },
] as const;

const COLUMNS = ["Spořicí účet", "Investiční fond", "Nemovitost vlastními silami", "Vynosium"];

/** A mark, and a word for it — colour and shape never carry meaning alone. */
function Cell({ value }: { value: boolean | "partial" }) {
  const { glyph, label, tone } =
    value === true
      ? { glyph: "✓", label: "ano", tone: "text-emerald-on-light" }
      : value === "partial"
        ? { glyph: "~", label: "částečně", tone: "text-fn-warning-on-light" }
        : { glyph: "✕", label: "ne", tone: "text-text-muted" };

  return (
    <span className={`text-data ${tone}`} title={label}>
      <span aria-hidden="true">{glyph}</span>
      <span className="sr-only">{label}</span>
    </span>
  );
}

export function Comparison() {
  return (
    <section className="relative z-[2] bg-mist py-[var(--space-10)]">
      <div className="mx-auto max-w-[var(--max-w)] px-[var(--gutter)]">
        <SectionIndex label="MECHANIKA, NE VÝNOSY" tone="light" />
        <h2 className="text-display mt-6 max-w-[24ch] text-navy">
          Co které řešení umožňuje
        </h2>
        <p className="text-lede mt-6 max-w-[62ch] text-text-secondary">
          Ne která investice je nejlepší — to závisí na vašem cíli a horizontu. Tohle je jen
          přehled, co která forma technicky dovoluje.
        </p>

        <div className="mt-12 overflow-x-auto rounded-[var(--radius-card)] border border-light-gray bg-white">
          <table className="w-full min-w-[720px] border-collapse text-left">
            <thead>
              <tr className="border-b border-light-gray">
                <th className="text-label px-6 py-5 text-text-muted">Vlastnost</th>
                {COLUMNS.map((column, i) => (
                  <th
                    key={column}
                    className={`text-label px-6 py-5 ${
                      i === COLUMNS.length - 1 ? "text-navy" : "text-text-muted"
                    }`}
                  >
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row) => (
                <tr key={row.property} className="border-b border-light-gray last:border-b-0">
                  <th scope="row" className="px-6 py-5 font-normal">
                    <span className="text-body block text-navy">{row.property}</span>
                    <span className="text-body-sm mt-1 block max-w-[34ch] text-text-muted">
                      {row.note}
                    </span>
                  </th>
                  {row.values.map((value, i) => (
                    <td
                      key={`${row.property}-${i}`}
                      className={`px-6 py-5 ${i === row.values.length - 1 ? "bg-mist" : ""}`}
                    >
                      <Cell value={value} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Disclaimer className="mt-6">
          Přehled vlastností jednotlivých forem investování, nikoli srovnání výnosů ani investiční
          doporučení. Konkrétní podmínky se liší podle produktu, banky a nemovitosti.
        </Disclaimer>
      </div>
    </section>
  );
}
