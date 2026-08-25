import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { SetHeaderVariant } from "@/components/layout/HeaderVariantContext";
import { SectionIndex } from "@/components/ui/SectionIndex";
import { Pill } from "@/components/ui/Pill";
import { ARTICLES, getArticleBySlug } from "@/lib/data/articles";
import { INVESTMENT_PATHS } from "@/lib/data/paths";

export function generateStaticParams() {
  return ARTICLES.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return {};
  return { title: article.title, description: article.perex };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) notFound();
  const path = INVESTMENT_PATHS.find((p) => p.id === article.relatedPath)!;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.perex,
    datePublished: article.publishedAt,
    author: { "@type": "Organization", name: "Vynósium" },
  };

  return (
    <>
      <SetHeaderVariant variant="light" />
      {/* eslint-disable-next-line react/no-danger */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="bg-white pb-[var(--space-10)] pt-36">
        <div className="mx-auto max-w-[var(--max-w)] px-[var(--gutter)]">
          <SectionIndex index={article.category} label="MAGAZÍN" tone="light" className="mb-6" />
          <h1 className="text-display-lg max-w-[24ch] text-navy">{article.title}</h1>
          <p className="text-disclaimer mt-4 text-text-muted">
            {new Date(article.publishedAt).toLocaleDateString("cs-CZ", { year: "numeric", month: "long", day: "numeric" })}
          </p>

          <div className="mt-12 grid grid-cols-1 gap-12 border-t border-light-gray pt-10 lg:grid-cols-12">
            <nav className="hidden lg:col-span-3 lg:block">
              <div className="sticky top-28">
                <p className="text-label mb-4 text-text-muted">Obsah</p>
                <ul className="flex flex-col gap-3">
                  {article.content.map((section) => (
                    <li key={section.heading}>
                      <a
                        href={`#${slugify(section.heading)}`}
                        className="focus-ring text-sm text-text-secondary hover:text-navy"
                      >
                        {section.heading}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </nav>

            <article className="lg:col-span-9">
              <div className="flex flex-col gap-8">
                {article.content.map((section) => (
                  <div key={section.heading} id={slugify(section.heading)}>
                    <h2 className="text-heading text-navy">{section.heading}</h2>
                    <p className="text-body mt-3 max-w-[68ch] text-text-secondary">{section.text}</p>
                  </div>
                ))}
              </div>

              <div className="mt-12 rounded-[10px] border border-light-gray bg-mist p-8">
                <p className="text-subheading text-navy">Zajímá vás strategie {path.label.toLowerCase()}?</p>
                <p className="text-body-sm mt-2 max-w-[52ch] text-text-secondary">{path.headline}</p>
                <Pill href={`/${path.slug}`} variant="emerald" className="mt-5">
                  {path.cta}
                </Pill>
              </div>
            </article>
          </div>
        </div>
      </section>
    </>
  );
}

const DIACRITIC_MARKS_RE = new RegExp("[\\u0300-\\u036f]", "g");

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(DIACRITIC_MARKS_RE, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
