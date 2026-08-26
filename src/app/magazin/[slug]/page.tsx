import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SetHeaderVariant } from "@/components/layout/HeaderVariantContext";
import { Pill, SectionIndex } from "@/components/ui/primitives";
import { JsonLd } from "@/components/seo/JsonLd";
import { ARTICLES, getArticle } from "@/lib/data/articles";
import { formatDate } from "@/lib/format";
import { absoluteUrl, articleSchema, breadcrumbSchema } from "@/lib/seo";

export function generateStaticParams() {
  return ARTICLES.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return {};
  return {
    title: article.title,
    description: article.perex,
    alternates: { canonical: absoluteUrl(`/magazin/${article.slug}`) },
    openGraph: { type: "article", title: article.title, description: article.perex },
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  return (
    <>
      <SetHeaderVariant variant="light" />
      <JsonLd data={articleSchema(article)} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Domů", path: "/" },
          { name: "Magazín", path: "/magazin" },
          { name: article.title, path: `/magazin/${article.slug}` },
        ])}
      />

      <article className="relative z-[2] bg-white pb-[var(--space-10)] pt-[calc(var(--space-12)+40px)]">
        <div className="mx-auto grid max-w-[var(--max-w)] grid-cols-1 gap-12 px-[var(--gutter)] lg:grid-cols-12">
          <div className="lg:col-span-8">
            <SectionIndex label={article.category} tone="light" />
            <h1 className="text-display mt-6 max-w-[24ch] text-navy">{article.title}</h1>
            <p className="text-lede mt-6 max-w-[68ch] text-text-secondary">{article.perex}</p>
            <p className="text-label mt-6 text-text-muted">
              {article.author} · {formatDate(article.publishedAt)} · {article.readingMinutes} min čtení
            </p>

            <div className="mt-12 max-w-[68ch]">
              {article.body.map((section) => (
                <section key={section.heading} className="border-t border-light-gray py-8">
                  <h2 className="text-heading text-navy">{section.heading}</h2>
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph} className="text-body mt-4 text-text-secondary">
                      {paragraph}
                    </p>
                  ))}
                </section>
              ))}
            </div>

            {/* Mandatory onward link to the relevant investment path (§22). */}
            <div className="mt-10 rounded-[var(--radius-card)] border border-light-gray p-8">
              <h2 className="text-heading text-navy">Související investiční cesta</h2>
              <p className="text-body mt-3 max-w-[56ch] text-text-secondary">
                Téma tohoto článku se nejvíc týká strategie {article.relatedPath.label}. Podívejte se,
                jak funguje v praxi a s jakými čísly.
              </p>
              <Pill href={article.relatedPath.href} variant="emerald" className="mt-6">
                {article.relatedPath.label}
              </Pill>
            </div>
          </div>

          {/* Sticky table of contents */}
          <aside className="lg:col-span-4">
            <nav className="sticky top-24 border-l border-light-gray pl-6" aria-label="Obsah článku">
              <p className="text-label text-text-muted">Obsah</p>
              <ul className="mt-4 flex flex-col gap-3">
                {article.body.map((section) => (
                  <li key={section.heading}>
                    <span className="text-body-sm text-text-secondary">{section.heading}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/magazin"
                className="focus-ring text-label mt-8 inline-flex text-navy no-underline"
              >
                ← Všechny články
              </Link>
            </nav>
          </aside>
        </div>
      </article>
    </>
  );
}
