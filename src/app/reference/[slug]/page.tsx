import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { SetHeaderVariant } from "@/components/layout/HeaderVariantContext";
import { PageIntro } from "@/components/layout/PageIntro";
import { BeforeAfterSlider } from "@/components/ui/BeforeAfterSlider";
import { Pill } from "@/components/ui/Pill";
import { Disclaimer, DISCLAIMERS } from "@/components/ui/Disclaimer";
import { CASE_STUDIES, CASE_STUDY_CATEGORY_LABEL } from "@/lib/data/caseStudies";
import { INVESTMENT_PATHS } from "@/lib/data/paths";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/seo";

export function generateStaticParams() {
  return CASE_STUDIES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const study = CASE_STUDIES.find((c) => c.slug === slug);
  if (!study) return {};
  return { title: study.name, description: study.description };
}

export default async function CaseStudyDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const study = CASE_STUDIES.find((c) => c.slug === slug);
  if (!study) notFound();
  const path = INVESTMENT_PATHS.find((p) => p.id === study.strategy)!;

  return (
    <>
      <SetHeaderVariant variant="light" />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Domů", path: "/" },
          { name: "Reference", path: "/reference" },
          { name: study.name, path: `/reference/${study.slug}` },
        ])}
      />
      <PageIntro index={CASE_STUDY_CATEGORY_LABEL[study.category]} label="REFERENCE" title={study.name} lede={study.description} />

      <section className="bg-white pb-[var(--space-9)]">
        <div className="mx-auto grid max-w-[var(--max-w)] grid-cols-1 gap-10 px-[var(--gutter)] lg:grid-cols-12">
          <div className="lg:col-span-7">
            <BeforeAfterSlider label={study.name} />
            <blockquote className="text-lede mt-6 border-l-2 border-emerald pl-5 text-navy">
              „{study.quote}“
            </blockquote>
          </div>
          <div className="lg:col-span-5">
            <div className="rounded-[10px] border border-light-gray p-6">
              <p className="text-label mb-4 text-text-muted">Ledger čísel</p>
              <dl className="grid grid-cols-2 gap-4">
                <Row label="Pořizovací cena" value={study.purchasePrice} />
                <Row label="Náklady na rekonstrukci" value={study.renovationCost} />
                <Row label="Délka realizace" value={study.duration} />
                <Row label="Výsledek" value={study.result} />
              </dl>
              <div className="mt-4 border-t border-light-gray pt-4">
                <p className="text-label text-text-muted">{study.outcomeLabel}</p>
                <p className="text-metric-xl mt-1 text-emerald" style={{ fontSize: "2rem" }}>
                  {study.outcomeValue}
                </p>
              </div>
            </div>
            <Disclaimer className="mt-4">{DISCLAIMERS.modelValues}</Disclaimer>
            <Pill href={`/${path.slug}`} variant="emerald" className="mt-6">
              Chci podobnou investici — {path.label}
            </Pill>
          </div>
        </div>
      </section>
    </>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-label text-text-muted">{label}</dt>
      <dd className="text-data mt-1 text-navy">{value}</dd>
    </div>
  );
}
