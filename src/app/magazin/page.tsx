import type { Metadata } from "next";
import Link from "next/link";
import { SetHeaderVariant } from "@/components/layout/HeaderVariantContext";
import { PageIntro } from "@/components/layout/PageIntro";
import { FinalCta } from "@/components/sections/FinalCta";
import { JsonLd } from "@/components/seo/JsonLd";
import { ARTICLES } from "@/lib/data/articles";
import { formatDate } from "@/lib/format";
import { breadcrumbSchema } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Magazín",
  description:
    "Jak investovat do nemovitostí, financování, pronájem, rekonstrukce, lokality a daně — texty psané pro investora, ne pro vyhledávač.",
  alternates: { canonical: "/magazin" },
};

/**
 * Typographic listing (§22) — no large thumbnails, just hairlines and
 * type. Every article links onward to an investment path; the blog is an
 * SEO entry into the path selector, never a dead end.
 */
export default function MagazinePage() {
  return (
    <>
      <SetHeaderVariant variant="light" />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Domů", path: "/" },
          { name: "Magazín", path: "/magazin" },
        ])}
      />

      <PageIntro
        index="—"
        label="MAGAZÍN"
        title="Texty, které počítají."
        lede="Bez marketingových slibů. Každý článek končí odkazem na investiční cestu, ke které se vztahuje."
      />

      <section className="relative z-[2] bg-white pb-[var(--space-10)]">
        <div className="mx-auto max-w-[var(--max-w)] px-[var(--gutter)]">
          <ul className="border-t border-light-gray">
            {ARTICLES.map((article) => (
              <li key={article.slug} className="group border-b border-light-gray">
                <Link
                  href={`/magazin/${article.slug}`}
                  className="focus-ring grid grid-cols-1 gap-4 py-8 no-underline lg:grid-cols-12"
                >
                  <div className="lg:col-span-3">
                    <span className="text-label inline-flex rounded-[var(--radius-pill)] border border-light-gray px-3 py-1.5 text-text-muted">
                      {article.category}
                    </span>
                  </div>
                  <div className="lg:col-span-7">
                    <h2 className="text-heading text-navy transition-colors duration-[var(--dur-micro)] group-hover:text-emerald">
                      {article.title}
                    </h2>
                    <p className="text-body-sm mt-3 max-w-[68ch] text-text-secondary">{article.perex}</p>
                  </div>
                  <div className="lg:col-span-2 lg:text-right">
                    <p className="text-label text-text-muted">{formatDate(article.publishedAt)}</p>
                    <p className="text-label mt-2 text-text-muted">{article.readingMinutes} min čtení</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <FinalCta />
    </>
  );
}
