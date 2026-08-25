"use client";

import Link from "next/link";
import { useState } from "react";
import { ARTICLES, ARTICLE_CATEGORIES, type ArticleCategory } from "@/lib/data/articles";

export function MagazineList() {
  const [category, setCategory] = useState<ArticleCategory | "all">("all");
  const visible = category === "all" ? ARTICLES : ARTICLES.filter((a) => a.category === category);

  return (
    <section className="bg-white pb-[var(--space-10)]">
      <div className="mx-auto max-w-[var(--max-w)] px-[var(--gutter)]">
        <div className="flex flex-wrap gap-2">
          <CategoryPill active={category === "all"} onClick={() => setCategory("all")}>
            Vše
          </CategoryPill>
          {ARTICLE_CATEGORIES.map((c) => (
            <CategoryPill key={c} active={category === c} onClick={() => setCategory(c)}>
              {c}
            </CategoryPill>
          ))}
        </div>

        <div className="mt-8 divide-y divide-light-gray border-t border-light-gray">
          {visible.map((article) => (
            <Link
              key={article.slug}
              href={`/magazin/${article.slug}`}
              className="focus-ring group flex flex-col gap-2 py-6"
            >
              <span className="text-label text-emerald">{article.category}</span>
              <h2 className="text-subheading text-navy group-hover:underline">{article.title}</h2>
              <p className="text-body-sm max-w-[64ch] text-text-secondary">{article.perex}</p>
              <span className="text-disclaimer text-text-muted">
                {new Date(article.publishedAt).toLocaleDateString("cs-CZ", { year: "numeric", month: "long", day: "numeric" })}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function CategoryPill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="focus-ring rounded-[9999px] border px-4 py-2 text-xs uppercase tracking-[0.1em] transition-colors"
      style={{
        borderColor: active ? "var(--color-emerald)" : "var(--color-light-gray)",
        color: active ? "var(--color-emerald)" : "var(--color-text-secondary)",
      }}
      aria-pressed={active}
    >
      {children}
    </button>
  );
}
