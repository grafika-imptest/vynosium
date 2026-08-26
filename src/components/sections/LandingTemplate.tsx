import Link from "next/link";
import { SetHeaderVariant } from "@/components/layout/HeaderVariantContext";
import { Calculator } from "@/components/sections/Calculator";
import { ContactForm } from "@/components/sections/ContactForm";
import { Faq } from "@/components/sections/Faq";
import { HeroPhoto } from "@/components/sections/HeroPhoto";
import { Opportunities } from "@/components/sections/Opportunities";
import {
  Disclaimer,
  PathGlyph,
  Pill,
  SectionIndex,
} from "@/components/ui/primitives";
import { JsonLd } from "@/components/seo/JsonLd";
import { PROCESS_STEPS, DISCLAIMERS } from "@/lib/data/site";
import { CASE_STUDIES } from "@/lib/data/caseStudies";
import { PATH_FAQ } from "@/lib/data/pathFaq";
import type { PathDefinition } from "@/lib/data/paths";
import { breadcrumbSchema, faqSchema } from "@/lib/seo";

/*
 * HERO SCRIM — two layers over the photograph.
 *
 * A flat base, because the copy runs the full height of the section and
 * these four photographs put their brightest area in a different place
 * each time; and the identity vector on top of it, which deepens the
 * bottom-left where the heading and the figures sit and opens the top
 * right, so the picture is still a picture.
 *
 * The numbers are measured, not chosen. Composited against the brightest
 * pixel inside each text box, across all four photographs, the floors are
 * 9.0:1 for the heading, 5.8:1 for the lede and 4.6:1 for the smallest
 * label — every element clears AA on every page.
 *
 * The lede takes Silver rather than Slate for the same reason as the
 * closing CTA: over a photograph Slate measured 3.9:1.
 */
const HERO_SCRIM_BASE = "rgba(11,29,46,0.66)";
const HERO_SCRIM_VECTOR =
  "linear-gradient(38.5deg, rgba(16,42,67,0.9) 0%, rgba(16,42,67,0.55) 52%, rgba(16,42,67,0.2) 100%)";

/**
 * Shared PPC landing template (§25–29).
 *
 * One template, one variable: the path token and the copy. The token may
 * be a step louder here than on the homepage — a 2px top line and accents
 * in badges and figures — but never a section fill and never a button
 * fill. The primary CTA stays Emerald on all four, so the conversion
 * element is the same object everywhere on the site.
 *
 * These pages are designed mobile-first: most paid traffic lands here.
 */
export function LandingTemplate({ path }: { path: PathDefinition }) {
  // The pure token is for lines and dots; text takes the surface-specific
  // variant, because 11-24px type has to clear 4.5:1 either way (§5).
  const accent = `var(--color-${path.colorVar})`;
  const accentOnDark = `var(--color-${path.colorVar}-on-dark)`;
  const accentOnLight = `var(--color-${path.colorVar}-on-light)`;
  const cases = CASE_STUDIES.filter((c) => c.relatedPath === `/${path.slug}`).slice(0, 2);

  return (
    <>
      <SetHeaderVariant variant="dark" />
      <JsonLd data={faqSchema(PATH_FAQ[path.id])} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Domů", path: "/" },
          { name: path.label, path: `/${path.slug}` },
        ])}
      />

      {/* 2px token line — the loudest the path colour ever gets. */}
      <div aria-hidden="true" className="fixed inset-x-0 top-0 z-[130] h-0.5" style={{ background: accent }} />

      {/* 1 — hero */}
      <section className="relative z-[2] overflow-hidden bg-navy pb-[var(--space-10)] pt-[calc(var(--space-12)+40px)]">
        {/*
          The strategy's own photograph, drifting against the copy on scroll.
          `priority` because this is the LCP element on a page that paid
          traffic lands on directly.
        */}
        <HeroPhoto src={`/photo/cesty/${path.slug}.jpg`} priority />
        <div aria-hidden="true" className="absolute inset-0" style={{ background: HERO_SCRIM_BASE }} />
        <div aria-hidden="true" className="absolute inset-0" style={{ background: HERO_SCRIM_VECTOR }} />

        <div className="relative z-[1] mx-auto max-w-[var(--max-w)] px-[var(--gutter)]">
          <div className="flex items-center gap-4" style={{ color: accentOnDark }}>
            <PathGlyph path={path.id} />
            <span className="text-label">
              {path.index} — {path.label}
            </span>
          </div>

          <h1 className="text-display-lg mt-8 max-w-[18ch] text-snow">{path.landingH1}</h1>
          {/* Silver, not Slate: over a photograph Slate lands at 3.9:1 here.
              Same call as the closing CTA, for the same reason. */}
          <p className="text-lede mt-6 max-w-[62ch] text-silver">{path.landingLede}</p>

          <dl className="mt-10 flex flex-wrap gap-x-12 gap-y-6 border-t border-steel/50 pt-6">
            {path.metrics.map((metric) => (
              <div key={metric.label}>
                <dt className="text-label text-slate-on-dark">{metric.label}</dt>
                <dd className="text-metric mt-3" style={{ color: accentOnDark }}>
                  {metric.value}
                </dd>
              </div>
            ))}
          </dl>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Pill href="#formular" variant="emerald">
              {path.cta}
            </Pill>
            <Pill href="#cisla" variant="ghost-dark">
              Ukázat modelový propočet
            </Pill>
          </div>

          <Disclaimer tone="dark" className="mt-6">
            {DISCLAIMERS.modelValues}
          </Disclaimer>
        </div>
      </section>

      {/* 2 — who it fits */}
      <section className="relative z-[2] bg-white py-[var(--space-10)]">
        <div className="mx-auto grid max-w-[var(--max-w)] grid-cols-1 gap-12 px-[var(--gutter)] lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionIndex index="01" label="PRO KOHO" tone="light" />
            <h2 className="text-display mt-6 max-w-[16ch] text-navy">
              Komu tato cesta dává smysl
            </h2>
          </div>
          <ul className="lg:col-span-7">
            {path.profile.map((item) => (
              <li key={item} className="border-b border-light-gray py-5 first:border-t">
                <p className="text-body max-w-[64ch] text-text-secondary">{item}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 3 — how the strategy works */}
      <section className="relative z-[2] bg-mist py-[var(--space-10)]">
        <div className="mx-auto max-w-[var(--max-w)] px-[var(--gutter)]">
          <SectionIndex index="02" label="JAK TO FUNGUJE" tone="light" />
          <h2 className="text-display mt-6 max-w-[18ch] text-navy">Strategie krok za krokem</h2>

          <ol className="mt-12 grid grid-cols-1 gap-px bg-light-gray md:grid-cols-2 lg:grid-cols-4">
            {path.mechanics.map((step, i) => (
              <li key={step.title} className="bg-mist p-8">
                <span className="text-label" style={{ color: accentOnLight }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="text-subheading mt-5 text-navy">{step.title}</h3>
                <p className="text-body-sm mt-3 max-w-[42ch] text-text-secondary">{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 4 — the numbers, in full */}
      <section id="cisla" className="relative z-[2] bg-white py-[var(--space-10)]">
        <div className="mx-auto grid max-w-[var(--max-w)] grid-cols-1 gap-12 px-[var(--gutter)] lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionIndex index="03" label="KONKRÉTNÍ ČÍSLA" tone="light" />
            <h2 className="text-display mt-6 max-w-[16ch] text-navy">Modelová investice</h2>
            <p className="text-body mt-6 max-w-[52ch] text-text-secondary">
              Takto vypadá propočet, který dostanete před rozhodnutím. Stejnou strukturu má každý
              projekt — proto se dají porovnávat mezi sebou.
            </p>
            <Disclaimer className="mt-6">{DISCLAIMERS.scenario}</Disclaimer>
          </div>

          <div className="lg:col-span-7">
            <dl className="rounded-[var(--radius-card)] border border-light-gray">
              {path.example.map((row) => (
                <div
                  key={row.label}
                  className="flex items-baseline justify-between gap-6 border-b border-light-gray px-6 py-4 last:border-b-0"
                >
                  <dt className="text-body-sm text-text-secondary">{row.label}</dt>
                  <dd className="text-data text-navy">
                    {row.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* 5 — advantages */}
      <section className="relative z-[2] bg-white pb-[var(--space-10)]">
        <div className="mx-auto max-w-[var(--max-w)] px-[var(--gutter)]">
          <SectionIndex index="04" label="VÝHODY" tone="light" />
          <div className="mt-8 grid grid-cols-1 gap-px bg-light-gray md:grid-cols-3">
            {path.advantages.map((item) => (
              <article key={item.title} className="bg-white p-8">
                <h3 className="text-subheading text-navy">{item.title}</h3>
                <p className="text-body-sm mt-3 max-w-[42ch] text-text-secondary">{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 6 — how the cooperation runs */}
      <section className="relative z-[2] bg-navy py-[var(--space-10)]">
        <div className="mx-auto max-w-[var(--max-w)] px-[var(--gutter)]">
          <SectionIndex index="05" label="SPOLUPRÁCE" tone="dark" />
          <h2 className="text-display mt-6 max-w-[18ch] text-snow">Jak probíhá spolupráce</h2>
          <ol className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {PROCESS_STEPS.map((step) => (
              <li
                key={step.index}
                className="rounded-[var(--radius-card)] border border-steel/50 p-6"
              >
                <span className="text-label" style={{ color: accentOnDark }}>
                  {step.index}/06
                </span>
                <h3 className="text-subheading mt-4 text-snow">{step.title}</h3>
                <p className="text-body-sm mt-3 max-w-[42ch] text-slate-on-dark">{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 7 — only projects of this strategy */}
      <Opportunities
        index="06"
        initialStrategy={path.id}
        heading="Projekty této strategie"
        lede="Zobrazeny jsou projekty odpovídající zvolené cestě. Filtr lze rozšířit."
      />

      {/* 8 — references of the same investor type */}
      {cases.length > 0 && (
        <section className="relative z-[2] bg-white py-[var(--space-10)]">
          <div className="mx-auto max-w-[var(--max-w)] px-[var(--gutter)]">
            <SectionIndex index="07" label="REFERENCE" tone="light" />
            <h2 className="text-display mt-6 max-w-[20ch] text-navy">Stejná strategie v praxi</h2>
            <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
              {cases.map((study) => (
                <article
                  key={study.slug}
                  className="rounded-[var(--radius-card)] border border-light-gray p-6"
                >
                  <p className="text-label text-text-muted">
                    {study.location} · {study.year}
                  </p>
                  <h3 className="text-subheading mt-4 text-navy">{study.name}</h3>
                  <p className="text-data mt-3" style={{ color: accentOnLight }}>
                    {study.result}
                  </p>
                  <dl className="mt-5">
                    {study.ledger.slice(0, 3).map((row) => (
                      <div
                        key={row.label}
                        className="flex items-baseline justify-between gap-6 border-b border-light-gray py-3 last:border-b-0"
                      >
                        <dt className="text-body-sm text-text-secondary">{row.label}</dt>
                        <dd className="text-data text-navy">{row.value}</dd>
                      </div>
                    ))}
                  </dl>
                  <Link
                    href={`/reference/${study.slug}`}
                    className="focus-ring text-label mt-6 inline-flex text-navy no-underline"
                  >
                    Detail případové studie →
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 9 — calculator pre-tuned to this strategy */}
      <Calculator defaultType={path.id} index="08" />

      {/* 10 — five questions of this path */}
      <Faq items={PATH_FAQ[path.id]} index="09" heading="Otázky k této cestě" tone="light" />

      {/* 11 — own conversion form, own measurement */}
      <section id="formular" className="relative z-[2] bg-mist py-[var(--space-10)]">
        <div className="mx-auto grid max-w-[var(--max-w)] grid-cols-1 gap-12 px-[var(--gutter)] lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionIndex index="10" label="KONZULTACE" tone="light" />
            <h2 className="text-display mt-6 max-w-[16ch] text-navy">
              Spočítáme to na vaše čísla.
            </h2>
            <p className="text-body mt-6 max-w-[52ch] text-text-secondary">
              Napište nám kapitál a horizont. Připravíme modelový propočet pro tuto strategii —
              nezávazně a bez prezentací.
            </p>
          </div>
          <div className="lg:col-span-7">
            <ContactForm defaultPriority={path.id} />
          </div>
        </div>
      </section>
    </>
  );
}
