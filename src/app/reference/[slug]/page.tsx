import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SetHeaderVariant } from "@/components/layout/HeaderVariantContext";
import { BeforeAfterSlider } from "@/components/ui/BeforeAfterSlider";
import { Pill, SectionIndex } from "@/components/ui/primitives";
import { JsonLd } from "@/components/seo/JsonLd";
import { CASE_STUDIES, CASE_CATEGORY_LABEL, getCaseStudy } from "@/lib/data/caseStudies";
import { absoluteUrl, breadcrumbSchema } from "@/lib/seo";

export function generateStaticParams() {
  return CASE_STUDIES.map((study) => ({ slug: study.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) return {};
  return {
    title: study.name,
    description: study.summary,
    alternates: { canonical: absoluteUrl(`/reference/${study.slug}`) },
  };
}

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) notFound();

  return (
    <>
      <SetHeaderVariant variant="dark" />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Domů", path: "/" },
          { name: "Reference", path: "/reference" },
          { name: study.name, path: `/reference/${study.slug}` },
        ])}
      />

      <section className="relative z-[2] bg-navy pb-[var(--space-9)] pt-[calc(var(--space-12)+40px)]">
        <div className="mx-auto max-w-[var(--max-w)] px-[var(--gutter)]">
          <SectionIndex
            label={`${CASE_CATEGORY_LABEL[study.category]} · ${study.year}`}
            tone="dark"
          />
          <h1 className="text-display-lg mt-6 max-w-[20ch] text-snow">{study.name}</h1>
          <p className="text-lede mt-4 text-slate-on-dark">{study.location}</p>
          <p className="text-data mt-6 text-emerald-on-dark">{study.result}</p>

          <div className="mt-10 max-w-[820px]">
            <BeforeAfterSlider
              beforeImage={study.beforeImage}
              afterImage={study.afterImage}
              alt={study.name}
              beforeFrom={study.beforeFrom}
              beforeTo={study.beforeTo}
              afterFrom={study.afterFrom}
              afterTo={study.afterTo}
              label={study.slug}
            />
          </div>
        </div>
      </section>

      <section className="relative z-[2] bg-white py-[var(--space-10)]">
        <div className="mx-auto grid max-w-[var(--max-w)] grid-cols-1 gap-12 px-[var(--gutter)] lg:grid-cols-12">
          <div className="lg:col-span-7">
            {study.story.map((block, i) => (
              <article key={block.title} className="border-t border-light-gray py-8 first:border-t-0 first:pt-0">
                <p className="text-label text-text-muted">{String(i + 1).padStart(2, "0")}</p>
                <h2 className="text-heading mt-4 text-navy">{block.title}</h2>
                <p className="text-body mt-4 max-w-[64ch] text-text-secondary">{block.text}</p>
              </article>
            ))}

            {study.quote && (
              <blockquote className="mt-6 border-l border-emerald pl-6">
                <p className="text-lede text-navy">„{study.quote.text}“</p>
                <footer className="text-label mt-3 text-text-muted">{study.quote.author}</footer>
              </blockquote>
            )}
          </div>

          <div className="lg:col-span-5">
            <div className="sticky top-24 rounded-[var(--radius-card)] border border-light-gray p-6">
              <SectionIndex label="ČÍSLA ŘÁDEK PO ŘÁDKU" tone="light" />
              <dl className="mt-6">
                {study.ledger.map((row) => (
                  <div
                    key={row.label}
                    className="flex items-baseline justify-between gap-6 border-b border-light-gray py-3 last:border-b-0"
                  >
                    <dt className="text-body-sm text-text-secondary">{row.label}</dt>
                    <dd className="text-data text-navy">{row.value}</dd>
                  </div>
                ))}
              </dl>

              <Pill href={study.relatedPath} variant="ghost-light" className="mt-6 w-full">
                Chci stejnou strategii
              </Pill>
              <Pill href="/kontakt" variant="emerald" className="mt-3 w-full">
                Nezávazná konzultace
              </Pill>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-[2] bg-mist py-[var(--space-8)]">
        <div className="mx-auto max-w-[var(--max-w)] px-[var(--gutter)]">
          <Link
            href="/reference"
            className="focus-ring text-label inline-flex items-center gap-2 text-navy no-underline"
          >
            <span aria-hidden="true">←</span> Všechny reference
          </Link>
        </div>
      </section>
    </>
  );
}
