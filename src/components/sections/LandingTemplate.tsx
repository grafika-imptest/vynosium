import { SetHeaderVariant } from "@/components/layout/HeaderVariantContext";
import { SectionIndex } from "@/components/ui/SectionIndex";
import { Disclaimer, DISCLAIMERS } from "@/components/ui/Disclaimer";
import { Pill } from "@/components/ui/Pill";
import { PathGlyph } from "@/components/ui/PathGlyph";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { Calculator } from "@/components/sections/Calculator";
import { FAQ } from "@/components/sections/FAQ";
import { PROCESS_STEPS } from "@/lib/data/processSteps";
import { PROJECTS } from "@/lib/data/projects";
import { CASE_STUDIES } from "@/lib/data/caseStudies";
import { PATH_FAQ } from "@/lib/data/pathFaq";
import { computeCalculator } from "@/lib/calculator";
import { formatCzk, formatPercent } from "@/lib/format";
import type { PathDefinition } from "@/lib/data/paths";

export type LandingContent = {
  h1: string;
  heroLede: string;
  profile: string;
  howItWorks: { title: string; text: string }[];
  exampleCapital: number;
  exampleLtv: number;
  exampleHorizon: number;
  benefits: string[];
};

/**
 * Shared PPC template — design.md §3 "4× PPC landing page": same section
 * order and CTA color for every path, only copy + accent token differ.
 * The path's color is used strictly as an accent (top rule, badges,
 * calculator preset), never as a fill — primary CTA stays Emerald on all
 * four per the brand rule.
 */
export function LandingTemplate({ path, content }: { path: PathDefinition; content: LandingContent }) {
  const accentVar = `var(--color-${path.colorVar})`;
  const relevantProjects = PROJECTS.filter((p) => p.strategy === path.id).slice(0, 3);
  const relevantCaseStudy = CASE_STUDIES.find((c) => c.strategy === path.id);
  const example = computeCalculator({
    capital: content.exampleCapital,
    ltv: content.exampleLtv,
    horizonYears: content.exampleHorizon,
    type: path.id,
  });

  return (
    <>
      <SetHeaderVariant variant="dark" />
      <div style={{ height: 2, background: accentVar }} aria-hidden="true" />

      {/* Hero */}
      <section className="relative flex min-h-[80svh] flex-col justify-center overflow-hidden bg-navy px-[var(--gutter)] py-32">
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{ background: "linear-gradient(38.5deg, #0b1d2e 0%, #102a43 55%, #16506b 100%)" }}
        />
        <div className="relative z-10 mx-auto w-full max-w-[var(--max-w)]">
          <span
            className="text-label mb-5 inline-flex items-center gap-2 rounded-full border px-3 py-1"
            style={{ borderColor: accentVar, color: accentVar }}
          >
            <PathGlyph glyph={path.glyph} />
            {path.label.toUpperCase()}
          </span>
          <h1 className="text-display-xl max-w-[16ch] text-snow">{content.h1}</h1>
          <p className="text-lede mt-5 max-w-[52ch] text-slate">{content.heroLede}</p>
          <Pill href="#kalkulacka" variant="emerald" className="mt-8">
            Chci individuální propočet
          </Pill>
        </div>
      </section>

      {/* Pro koho */}
      <section className="bg-white py-[var(--space-9)]">
        <div className="mx-auto max-w-[var(--max-w)] px-[var(--gutter)]">
          <SectionIndex index="01" label="PRO KOHO JE ŘEŠENÍ VHODNÉ" tone="light" className="mb-6" />
          <p className="text-lede max-w-[64ch] text-text-secondary">{content.profile}</p>
        </div>
      </section>

      {/* Jak strategie funguje */}
      <section className="bg-mist py-[var(--space-9)]">
        <div className="mx-auto max-w-[var(--max-w)] px-[var(--gutter)]">
          <SectionIndex index="02" label="JAK STRATEGIE FUNGUJE" tone="light" className="mb-6" />
          <div className="grid grid-cols-1 gap-8 border-t border-light-gray pt-8 sm:grid-cols-2 lg:grid-cols-4">
            {content.howItWorks.map((step, i) => (
              <div key={step.title}>
                <p className="text-label" style={{ color: accentVar }}>
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="text-subheading mt-3 text-navy">{step.title}</h3>
                <p className="text-body-sm mt-2 max-w-[36ch] text-text-secondary">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Konkrétní čísla */}
      <section className="bg-navy py-[var(--space-9)]">
        <div className="mx-auto max-w-[var(--max-w)] px-[var(--gutter)]">
          <SectionIndex index="03" label="KONKRÉTNÍ ČÍSLA" tone="dark" className="mb-6" />
          <h2 className="text-display max-w-[24ch] text-snow">Modelový příklad investice</h2>
          <div className="mt-8 grid grid-cols-2 gap-6 border-t border-steel/40 pt-8 sm:grid-cols-4">
            <Metric label="Vlastní kapitál" value={formatCzk(content.exampleCapital)} accentVar={accentVar} />
            <Metric label="Financování" value={`${content.exampleLtv} %`} accentVar={accentVar} />
            <Metric label="Modelová velikost investice" value={formatCzk(example.investmentSize)} accentVar={accentVar} />
            <Metric
              label="Modelové zhodnocení p.a."
              value={formatPercent(example.modelYieldPercent)}
              accentVar={accentVar}
              emphasize
            />
          </div>
          <Disclaimer className="mt-6 text-slate">{DISCLAIMERS.calculator}</Disclaimer>
        </div>
      </section>

      {/* Výhody */}
      <section className="bg-white py-[var(--space-9)]">
        <div className="mx-auto max-w-[var(--max-w)] px-[var(--gutter)]">
          <SectionIndex index="04" label="VÝHODY" tone="light" className="mb-6" />
          <div className="grid grid-cols-1 gap-x-8 gap-y-6 border-t border-light-gray pt-8 sm:grid-cols-2">
            {content.benefits.map((b, i) => (
              <div key={i} className="flex items-start gap-3">
                <span
                  className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full"
                  style={{ background: accentVar }}
                  aria-hidden="true"
                />
                <p className="text-body text-text-secondary">{b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Jak probíhá spolupráce */}
      <section className="bg-mist py-[var(--space-9)]">
        <div className="mx-auto max-w-[var(--max-w)] px-[var(--gutter)]">
          <SectionIndex index="05" label="JAK PROBÍHÁ SPOLUPRÁCE" tone="light" className="mb-6" />
          <div className="flex flex-wrap gap-x-10 gap-y-4 border-t border-light-gray pt-8">
            {PROCESS_STEPS.map((step, i) => (
              <div key={step.title} className="flex items-center gap-2">
                <span className="text-label text-text-muted">{String(i + 1).padStart(2, "0")}</span>
                <span className="text-body-sm text-navy">{step.title}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vybrané projekty */}
      {relevantProjects.length > 0 && (
        <section className="bg-white py-[var(--space-9)]">
          <div className="mx-auto max-w-[var(--max-w)] px-[var(--gutter)]">
            <SectionIndex index="06" label="VYBRANÉ PROJEKTY" tone="light" className="mb-6" />
            <h2 className="text-display max-w-[24ch] text-navy">Aktuální příležitosti pro tuto strategii</h2>
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relevantProjects.map((p) => (
                <ProjectCard key={p.slug} project={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Reference stejného typu investora */}
      {relevantCaseStudy && (
        <section className="bg-navy py-[var(--space-9)]">
          <div className="mx-auto max-w-[var(--max-w)] px-[var(--gutter)]">
            <SectionIndex index="07" label="REFERENCE" tone="dark" className="mb-6" />
            <div className="max-w-[560px] rounded-[10px] border border-steel/50 bg-surface-1 p-8">
              <h3 className="text-subheading text-snow">{relevantCaseStudy.name}</h3>
              <dl className="mt-5 grid grid-cols-2 gap-4 border-t border-steel/40 pt-5">
                <div>
                  <dt className="text-label text-slate">Pořizovací cena</dt>
                  <dd className="text-data mt-1 text-snow">{relevantCaseStudy.purchasePrice}</dd>
                </div>
                <div>
                  <dt className="text-label text-slate">{relevantCaseStudy.outcomeLabel}</dt>
                  <dd className="text-metric mt-1 text-emerald">{relevantCaseStudy.outcomeValue}</dd>
                </div>
              </dl>
            </div>
          </div>
        </section>
      )}

      {/* Kalkulačka */}
      <div id="kalkulacka">
        <Calculator defaultType={path.id} />
      </div>

      {/* FAQ */}
      <FAQ items={PATH_FAQ[path.id]} index="—" title="Časté otázky k této strategii" />

      {/* Finální CTA */}
      <section className="bg-abyss py-[var(--space-11)]">
        <div className="mx-auto flex max-w-[720px] flex-col items-center gap-6 px-[var(--gutter)] text-center">
          <h2 className="text-display-lg text-snow">{content.h1}</h2>
          <Pill href={`/kontakt?cesta=${path.slug}`} variant="emerald">
            Chci nezávaznou konzultaci
          </Pill>
        </div>
      </section>
    </>
  );
}

function Metric({
  label,
  value,
  accentVar,
  emphasize = false,
}: {
  label: string;
  value: string;
  accentVar: string;
  emphasize?: boolean;
}) {
  return (
    <div>
      <p className="text-label text-slate">{label}</p>
      <p className="text-metric mt-1" style={{ color: emphasize ? accentVar : "var(--color-snow)" }}>
        {value}
      </p>
    </div>
  );
}
