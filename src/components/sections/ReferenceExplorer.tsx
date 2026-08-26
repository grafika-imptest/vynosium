"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { Flip, ensureGsapRegistered, prefersReducedMotion } from "@/lib/motion";
import { withBasePath } from "@/lib/seo";
import { CASE_STUDIES, CASE_CATEGORY_LABEL, type CaseCategory } from "@/lib/data/caseStudies";

type Filter = CaseCategory | "all";

/** Case study list (§21). Filtering reflows through Flip, not a re-mount. */
export function ReferenceExplorer() {
  const [filter, setFilter] = useState<Filter>("all");
  const gridRef = useRef<HTMLDivElement>(null);

  const visible = useMemo(
    () => (filter === "all" ? CASE_STUDIES : CASE_STUDIES.filter((c) => c.category === filter)),
    [filter]
  );

  const change = (next: Filter) => {
    ensureGsapRegistered();
    if (!gridRef.current || prefersReducedMotion()) {
      setFilter(next);
      return;
    }
    const state = Flip.getState(gridRef.current.querySelectorAll("[data-flip-card]"));
    setFilter(next);
    requestAnimationFrame(() => {
      Flip.from(state, { duration: 0.5, ease: "power2.out", absolute: true, scale: false });
    });
  };

  return (
    <section className="relative z-[2] bg-white py-[var(--space-9)]">
      <div className="mx-auto max-w-[var(--max-w)] px-[var(--gutter)]">
        <div className="flex snap-x gap-2 overflow-x-auto pb-2">
          {(["all", "rekonstrukce", "pronajem", "portfolio"] as Filter[]).map((option) => {
            const active = filter === option;
            return (
              <button
                key={option}
                type="button"
                aria-pressed={active}
                onClick={() => change(option)}
                className="focus-ring text-label shrink-0 snap-start whitespace-nowrap rounded-[var(--radius-pill)] border px-4 py-2.5 transition-colors duration-[var(--dur-micro)]"
                style={{
                  borderColor: active ? "var(--color-emerald)" : "var(--color-light-gray)",
                  color: active ? "var(--color-emerald-on-light)" : "var(--color-text-muted)",
                }}
              >
                {option === "all" ? "Vše" : CASE_CATEGORY_LABEL[option as CaseCategory]}
              </button>
            );
          })}
        </div>

        <div ref={gridRef} className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {visible.map((study) => (
            <article
              key={study.slug}
              data-flip-card
              className="group relative flex flex-col rounded-[var(--radius-card)] border border-light-gray bg-white transition-[border-color,transform] duration-[var(--dur-ui)] hover:-translate-y-1.5 hover:border-emerald"
            >
              <div
                className="relative aspect-[16/10] w-full overflow-hidden rounded-t-[var(--radius-card)]"
                style={
                  study.afterImage
                    ? undefined
                    : { background: `linear-gradient(38.5deg, ${study.afterFrom}, ${study.afterTo})` }
                }
              >
                {study.afterImage && (
                  <Image
                    src={withBasePath(study.afterImage)}
                    alt={`${study.name} — po realizaci`}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                    className="object-cover"
                  />
                )}
              </div>
              <div className="flex flex-1 flex-col p-6">
                <p className="text-label text-text-muted">
                  {CASE_CATEGORY_LABEL[study.category]} · {study.year}
                </p>
                <h2 className="text-subheading mt-4 text-navy">
                  <Link href={`/reference/${study.slug}`} className="focus-ring no-underline">
                    <span className="absolute inset-0" aria-hidden="true" />
                    {study.name}
                  </Link>
                </h2>
                <p className="text-data mt-3 text-emerald-on-light">{study.result}</p>
                <p className="text-body-sm mt-4 text-text-secondary">{study.summary}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
