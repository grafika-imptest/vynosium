"use client";

import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { Flip, ensureGsapRegistered, gsap, prefersReducedMotion } from "@/lib/motion";
import { BeforeAfterSlider } from "@/components/ui/BeforeAfterSlider";
import { CASE_STUDIES, CASE_STUDY_CATEGORY_LABEL, type CaseStudyCategory } from "@/lib/data/caseStudies";

type FilterValue = "all" | CaseStudyCategory;

export function ReferenceExplorer() {
  const [filter, setFilter] = useState<FilterValue>("all");
  const gridRef = useRef<HTMLDivElement>(null);

  const visible = useMemo(
    () => (filter === "all" ? CASE_STUDIES : CASE_STUDIES.filter((c) => c.category === filter)),
    [filter]
  );

  const applyFilter = (next: FilterValue) => {
    ensureGsapRegistered();
    if (prefersReducedMotion() || !gridRef.current) {
      setFilter(next);
      return;
    }
    const state = Flip.getState(gridRef.current.children);
    setFilter(next);
    requestAnimationFrame(() => {
      Flip.from(state, { duration: 0.5, ease: "power2.inOut", absolute: true });
    });
  };

  return (
    <section className="bg-mist py-[var(--space-9)]">
      <div className="mx-auto max-w-[var(--max-w)] px-[var(--gutter)]">
        <div className="flex flex-wrap gap-3">
          <FilterPill active={filter === "all"} onClick={() => applyFilter("all")}>
            Vše
          </FilterPill>
          {(Object.keys(CASE_STUDY_CATEGORY_LABEL) as CaseStudyCategory[]).map((c) => (
            <FilterPill key={c} active={filter === c} onClick={() => applyFilter(c)}>
              {CASE_STUDY_CATEGORY_LABEL[c]}
            </FilterPill>
          ))}
        </div>

        <div ref={gridRef} className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((study) => (
            <article key={study.slug} className="rounded-[10px] border border-light-gray bg-white p-6">
              <BeforeAfterSlider label={study.name} />
              <h3 className="text-subheading mt-5 text-navy">{study.name}</h3>
              <p className="text-body-sm mt-2 text-text-secondary">{study.description}</p>
              <div className="mt-4 border-t border-light-gray pt-4">
                <p className="text-label text-text-muted">{study.outcomeLabel}</p>
                <p className="text-metric mt-1 text-emerald">{study.outcomeValue}</p>
              </div>
              <Link
                href={`/reference/${study.slug}`}
                className="focus-ring mt-4 inline-flex text-sm text-navy underline decoration-light-gray hover:decoration-emerald"
              >
                Celá případová studie
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function FilterPill({
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
