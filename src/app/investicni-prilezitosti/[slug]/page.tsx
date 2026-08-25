import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { SetHeaderVariant } from "@/components/layout/HeaderVariantContext";
import { SectionIndex } from "@/components/ui/SectionIndex";
import { Disclaimer, DISCLAIMERS } from "@/components/ui/Disclaimer";
import { Pill } from "@/components/ui/Pill";
import { INVESTMENT_PATHS } from "@/lib/data/paths";
import { PROJECTS, PROJECT_STATUS_LABEL, getProjectBySlug } from "@/lib/data/projects";
import { computeCalculator } from "@/lib/calculator";
import { formatCzk, formatPercent } from "@/lib/format";

export function generateStaticParams() {
  return PROJECTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return {};
  return {
    title: project.name,
    description: project.thesis[0],
  };
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  const path = INVESTMENT_PATHS.find((p) => p.id === project.strategy)!;

  const financingScenarios = [0, 30, 50, 70].map((ltv) => {
    const out = computeCalculator({
      capital: project.investmentSize * (1 - ltv / 100),
      ltv,
      horizonYears: 5,
      type: project.strategy,
    });
    return { ltv, ...out };
  });

  return (
    <>
      <SetHeaderVariant variant="light" />

      {/* 1 · Hero projektu */}
      <section className="relative flex min-h-[70svh] flex-col justify-end overflow-hidden bg-navy px-[var(--gutter)] pb-14 pt-32">
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{ background: "linear-gradient(38.5deg, #0b1d2e, #16324b 60%, #1b3a54)" }}
        />
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{ background: "linear-gradient(180deg, rgba(16,42,67,.2), rgba(16,42,67,.85))" }}
        />
        <div className="relative z-10 mx-auto w-full max-w-[var(--max-w)]">
          <span
            className="text-label mb-4 inline-flex items-center gap-2 rounded-full border px-3 py-1"
            style={{ borderColor: `var(--color-${path.colorVar})`, color: `var(--color-${path.colorVar})` }}
          >
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: `var(--color-${path.colorVar})` }} />
            {path.label}
          </span>
          <h1 className="text-display-lg max-w-[20ch] text-snow">{project.name}</h1>
          <p className="text-lede mt-3 text-slate">{project.location}</p>
        </div>
      </section>

      {/* 2 · Klíčová čísla — sticky panel */}
      <div className="sticky top-16 z-20 border-b border-light-gray bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-[var(--max-w)] flex-wrap gap-x-8 gap-y-3 overflow-x-auto px-[var(--gutter)] py-4">
          <KeyNumber label="Kupní cena" value={project.purchasePrice} />
          {project.renovationCost && <KeyNumber label="Investice do rekonstrukce" value={project.renovationCost} />}
          <KeyNumber label="Celková investice" value={project.totalInvestment} />
          {project.estimatedValueAfter && <KeyNumber label="Předpokládaná hodnota" value={project.estimatedValueAfter} />}
          {project.expectedRent && <KeyNumber label="Očekávané nájemné" value={project.expectedRent} />}
          <KeyNumber label="Orientační výnos" value={project.expectedYield} emphasize />
          <KeyNumber label="Investiční horizont" value={project.horizon} />
          <KeyNumber label="Stav" value={PROJECT_STATUS_LABEL[project.status]} />
        </div>
      </div>

      {/* 3 · Proč právě tento projekt */}
      <section className="bg-white py-[var(--space-9)]">
        <div className="mx-auto max-w-[var(--max-w)] px-[var(--gutter)]">
          <SectionIndex index="03" label="INVESTIČNÍ TEZE" tone="light" className="mb-6" />
          <h2 className="text-display max-w-[24ch] text-navy">Proč právě tento projekt</h2>
          <div className="mt-6 flex flex-col gap-4">
            {project.thesis.map((p, i) => (
              <p key={i} className="text-body max-w-[68ch] text-text-secondary">
                {p}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* 4 · Lokalita */}
      <section className="bg-mist py-[var(--space-9)]">
        <div className="mx-auto grid max-w-[var(--max-w)] grid-cols-1 gap-10 px-[var(--gutter)] lg:grid-cols-12">
          <div className="lg:col-span-6">
            <SectionIndex index="04" label="LOKALITA" tone="light" className="mb-6" />
            <h2 className="text-display text-navy">{project.location}</h2>
            <p className="text-body mt-5 max-w-[52ch] text-text-secondary">{project.locationText}</p>
          </div>
          <div className="lg:col-span-6">
            <div
              className="flex aspect-[4/3] w-full items-center justify-center rounded-[10px] border border-steel/50"
              style={{ background: "var(--color-navy)" }}
            >
              <span className="text-label text-slate">MAPA LOKALITY</span>
            </div>
          </div>
        </div>
      </section>

      {/* 5 · Scénář investice */}
      <section className="bg-navy py-[var(--space-9)]">
        <div className="mx-auto max-w-[var(--max-w)] px-[var(--gutter)]">
          <SectionIndex index="05" label="SCÉNÁŘ INVESTICE" tone="dark" className="mb-8" />
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-4">
            {[
              { label: "Nákup", value: project.purchasePrice, time: "měsíc 0" },
              {
                label: project.renovationCost ? "Rekonstrukce" : "Příprava",
                value: project.renovationCost ?? "—",
                time: "1.–6. měsíc",
              },
              {
                label: project.expectedRent ? "Pronájem" : "Prodej",
                value: project.expectedRent ?? project.estimatedValueAfter ?? "—",
                time: project.expectedRent ? "od 7. měsíce" : "po dokončení",
              },
              { label: "Orientační výnos", value: project.expectedYield, time: project.horizon },
            ].map((step, i) => (
              <div key={step.label} className="relative border-t-2 border-emerald pt-5">
                <p className="text-label text-slate">
                  {String(i + 1).padStart(2, "0")} — {step.time}
                </p>
                <h3 className="text-subheading mt-2 text-snow">{step.label}</h3>
                <p className="text-metric mt-2 text-emerald">{step.value}</p>
              </div>
            ))}
          </div>
          <Disclaimer className="mt-8 text-slate">{DISCLAIMERS.scenario}</Disclaimer>
        </div>
      </section>

      {/* 6 · Financování */}
      <section className="bg-white py-[var(--space-9)]">
        <div className="mx-auto max-w-[var(--max-w)] px-[var(--gutter)]">
          <SectionIndex index="06" label="FINANCOVÁNÍ" tone="light" className="mb-6" />
          <h2 className="text-display max-w-[24ch] text-navy">Varianty financování</h2>
          <p className="text-body-sm mt-3 max-w-[60ch] text-text-secondary">{project.financingNote}</p>
          <div className="mt-8 overflow-x-auto rounded-[10px] border border-light-gray">
            <table className="w-full min-w-[560px] border-collapse text-left">
              <thead>
                <tr className="border-b border-light-gray">
                  {["Financování (LTV)", "Vlastní kapitál", "Modelové zhodnocení p.a.", "Hodnota po 5 letech"].map((h) => (
                    <th key={h} className="text-label px-4 py-3 text-text-muted">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {financingScenarios.map((s) => (
                  <tr key={s.ltv} className="border-b border-light-gray last:border-b-0">
                    <td className="text-data px-4 py-3 text-navy">{s.ltv} %</td>
                    <td className="text-data px-4 py-3 text-text-secondary">
                      {formatCzk(project.investmentSize * (1 - s.ltv / 100))}
                    </td>
                    <td className="text-data px-4 py-3 text-emerald">{formatPercent(s.modelYieldPercent)}</td>
                    <td className="text-data px-4 py-3 text-navy">{formatCzk(s.finalValue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Disclaimer className="mt-4">{DISCLAIMERS.calculator}</Disclaimer>
        </div>
      </section>

      {/* 7 · Galerie */}
      <section className="bg-mist py-[var(--space-9)]">
        <div className="mx-auto max-w-[var(--max-w)] px-[var(--gutter)]">
          <SectionIndex index="07" label="GALERIE" tone="light" className="mb-6" />
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="flex aspect-[4/3] items-center justify-center rounded-[10px] border border-light-gray"
                style={{ background: i % 2 === 0 ? "#16324b" : "#1b3a54" }}
              >
                <span className="text-label text-slate">{i === 5 ? "PŮDORYS" : `FOTO ${i + 1}`}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8 · CTA */}
      <section className="bg-white py-[var(--space-9)]">
        <div className="mx-auto flex max-w-[var(--max-w)] flex-col items-start gap-5 px-[var(--gutter)]">
          <h2 className="text-display max-w-[24ch] text-navy">Máte zájem o tento projekt?</h2>
          <Pill href={`/kontakt?projekt=${project.slug}`} variant="emerald">
            Chci více informací o projektu
          </Pill>
          <Link href="/investicni-prilezitosti" className="focus-ring text-sm text-text-secondary underline decoration-light-gray hover:decoration-emerald">
            ← Zpět na všechny příležitosti
          </Link>
        </div>
      </section>

      {/* Sticky mobile CTA */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-light-gray bg-white/95 p-3 backdrop-blur sm:hidden">
        <Pill href={`/kontakt?projekt=${project.slug}`} variant="emerald" className="w-full">
          Chci více informací
        </Pill>
      </div>
    </>
  );
}

function KeyNumber({ label, value, emphasize = false }: { label: string; value: string; emphasize?: boolean }) {
  return (
    <div className="shrink-0">
      <p className="text-label text-text-muted">{label}</p>
      <p className={`text-data mt-1 ${emphasize ? "text-emerald" : "text-navy"}`}>{value}</p>
    </div>
  );
}
