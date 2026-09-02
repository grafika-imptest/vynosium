import Link from "next/link";
import { BeforeAfterSlider } from "@/components/ui/BeforeAfterSlider";
import { Disclaimer, SectionIndex } from "@/components/ui/primitives";
import { CASE_STUDIES } from "@/lib/data/caseStudies";

/**
 * One realisation, on the second screen.
 *
 * The client's own note: the case studies were stronger than half the copy
 * sitting above them. This is the answer — a single finished project, with
 * the money in and the money out, before the site has asked the reader to
 * believe anything.
 *
 * It is not a carousel and not a grid. One project, five figures, the
 * before/after, and a way through to the rest. The full set stays at
 * /reference; the shelf of them further down the page is what invites
 * comparison, and comparison is not the job of this section.
 */
export function CaseProof() {
  // The ledger is the argument, so the study with the fullest one leads.
  const study = CASE_STUDIES[0];
  /*
   * Five rows on a card this size is a wall. Purchase, works and sale are
   * the spine of the story; the result gets its own emphasis below, and the
   * duration is in the headline already.
   */
  const spine = study.ledger.filter((row) =>
    ["Pořizovací cena", "Náklady na rekonstrukci", "Prodejní cena"].includes(row.label)
  );
  const outcome = study.ledger.find((row) => row.label === "Výsledek projektu");

  return (
    <section className="relative z-[2] bg-white py-[var(--space-10)]">
      <div className="mx-auto max-w-[var(--max-w)] px-[var(--gutter)]">
        <SectionIndex index="04" label="DŮKAZ" tone="light" />
        <h2 className="text-display-lg mt-6 max-w-[20ch] text-navy">
          Takto vypadá investice v praxi.
        </h2>

        <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-6">
            <BeforeAfterSlider
              label={study.slug}
              beforeImage={study.beforeImage}
              afterImage={study.afterImage}
              beforeFrom={study.beforeFrom}
              beforeTo={study.beforeTo}
              afterFrom={study.afterFrom}
              afterTo={study.afterTo}
              alt={`${study.name} — ${study.location}`}
            />
          </div>

          <div className="lg:col-span-6">
            <p className="text-label text-text-muted">
              {study.location} · {study.year}
            </p>
            <h3 className="text-heading mt-3 max-w-[24ch] text-navy">{study.name}</h3>

            {/*
              The three figures read as one sum: what went in, what was spent,
              what came out. Hairlines between them, no box — the numbers are
              the structure.
            */}
            <dl className="mt-8">
              {spine.map((row) => (
                <div
                  key={row.label}
                  className="flex items-baseline justify-between gap-6 border-t border-light-gray py-4"
                >
                  <dt className="text-body-sm text-text-secondary">{row.label}</dt>
                  <dd className="text-data whitespace-nowrap text-navy" style={{ fontSize: "1.0625rem" }}>
                    {row.value}
                  </dd>
                </div>
              ))}
              {outcome && (
                <div className="flex items-baseline justify-between gap-6 border-y border-light-gray py-5">
                  <dt className="text-label text-text-muted">{outcome.label}</dt>
                  <dd className="text-metric whitespace-nowrap text-emerald-on-light">{outcome.value}</dd>
                </div>
              )}
            </dl>

            <p className="text-body mt-6 max-w-[52ch] text-text-secondary">{study.summary}</p>

            <Link
              href={`/reference/${study.slug}`}
              className="focus-ring text-label group mt-8 inline-flex items-center gap-2 text-navy no-underline"
            >
              Prohlédnout celý případ
              <span
                aria-hidden="true"
                className="transition-transform duration-[var(--dur-ui)] group-hover:translate-x-1.5"
              >
                <svg width="18" height="10" viewBox="0 0 18 10" fill="none">
                  <path d="M0 5h16M11 1l4 4-4 4" stroke="currentColor" strokeWidth="1.2" />
                </svg>
              </span>
            </Link>

            <Disclaimer className="mt-8">
              Realizovaný projekt. Uvedené částky jsou skutečné hodnoty tohoto obchodu, nikoli
              modelový propočet ani příslib budoucího výnosu.
            </Disclaimer>
          </div>
        </div>
      </div>
    </section>
  );
}
