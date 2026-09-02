import Link from "next/link";
import { SectionIndex } from "@/components/ui/primitives";

/**
 * How it works, in three steps.
 *
 * The homepage used to carry the whole six-step process rail. The client's
 * note was that the homepage reads as an investment memorandum, and this was
 * the longest single reason why: six panels, six artefact tables, scrolled
 * sideways.
 *
 * Three steps is not a shortened list — it is a different sentence. The six
 * are the operational sequence and belong on /jak-investujeme, where someone
 * who has already decided goes to check the mechanics. What a first-time
 * reader needs is the shape: you say what you want, we do the work, you get
 * paid. The link under it goes to the full version.
 */
const STEPS = [
  {
    index: "01",
    title: "Řeknete nám svůj cíl",
    text: "Kolik chcete investovat, na jak dlouho a co od investice čekáte. Podle toho vybereme strategii — ne naopak.",
  },
  {
    index: "02",
    title: "My najdeme, spočítáme a zrealizujeme",
    text: "Akvizice, financování, rekonstrukce, nájem i prodej. Jeden propočet, jedna odpovědnost, průběžné výkazy.",
  },
  {
    index: "03",
    title: "Vy dostáváte výnos",
    text: "Nájem každý měsíc, nebo zisk z prodeje. Pak se rozhodnete, jestli reinvestovat do dalšího projektu.",
  },
];

/**
 * The whole loop, as the client framed the positioning: Vynosium is not "buy
 * an investment flat", it is "build wealth through property" — and this is
 * the chain that makes the difference concrete.
 */
const CHAIN = [
  "Najdeme",
  "Koupíme",
  "Financujeme",
  "Zhodnotíme",
  "Pronajmeme",
  "Spravujeme",
  "Prodáme",
  "Reinvestujeme",
];

export function HowItWorks() {
  return (
    <section className="relative z-[2] bg-navy py-[var(--space-10)]">
      <div className="mx-auto max-w-[var(--max-w)] px-[var(--gutter)]">
        <SectionIndex index="06" label="JAK TO FUNGUJE" tone="dark" />
        <h2 className="text-display-lg mt-6 max-w-[20ch] text-snow">Jeden partner pro celou investici.</h2>

        <ol className="mt-14 grid grid-cols-1 gap-px bg-steel/40 md:grid-cols-3">
          {STEPS.map((step) => (
            <li key={step.index} className="bg-navy p-8 lg:p-10">
              <p className="text-label text-emerald-on-dark">{step.index}</p>
              <h3 className="text-heading mt-6 max-w-[18ch] text-snow">{step.title}</h3>
              <p className="text-body mt-4 max-w-[38ch] text-slate-on-dark">{step.text}</p>
            </li>
          ))}
        </ol>

        {/*
          The chain the client wants this brand to own: not "we sell you a
          flat" but the whole loop, in one line. It is the sentence the
          seven-module diagram on /jak-investujeme draws — kept here as text
          because the homepage cannot afford the diagram's height again.
        */}
        <ol className="mt-12 flex flex-wrap items-center gap-x-3 gap-y-3 border-t border-steel/40 pt-8">
          {CHAIN.map((link, i) => (
            <li key={link} className="text-label flex items-center gap-3 text-silver">
              {i > 0 && (
                <span aria-hidden="true" className="text-emerald-on-dark">
                  →
                </span>
              )}
              {link}
            </li>
          ))}
        </ol>

        <Link
          href="/jak-investujeme"
          className="focus-ring text-label group mt-10 inline-flex items-center gap-2 text-snow no-underline"
        >
          Celý proces krok za krokem
          <span
            aria-hidden="true"
            className="transition-transform duration-[var(--dur-ui)] group-hover:translate-x-1.5"
          >
            <svg width="18" height="10" viewBox="0 0 18 10" fill="none">
              <path d="M0 5h16M11 1l4 4-4 4" stroke="currentColor" strokeWidth="1.2" />
            </svg>
          </span>
        </Link>
      </div>
    </section>
  );
}
