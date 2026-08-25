"use client";

import { useMemo, useRef, useState } from "react";
import { Flip, ensureGsapRegistered, gsap, prefersReducedMotion } from "@/lib/motion";
import { SectionIndex } from "@/components/ui/SectionIndex";
import { Disclaimer, DISCLAIMERS } from "@/components/ui/Disclaimer";
import { Pill } from "@/components/ui/Pill";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { INVESTMENT_PATHS } from "@/lib/data/paths";
import { PROJECTS } from "@/lib/data/projects";
import type { InvestmentPath } from "@/lib/tokens";

type FilterValue = "all" | InvestmentPath;

export function Opportunities() {
  const [filter, setFilter] = useState<FilterValue>("all");
  const gridRef = useRef<HTMLDivElement>(null);

  const visible = useMemo(
    () => (filter === "all" ? PROJECTS : PROJECTS.filter((p) => p.strategy === filter)),
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
      if (!gridRef.current) return;
      Flip.from(state, {
        duration: 0.5,
        ease: "power2.inOut",
        absolute: true,
        onEnter: (els) => gsap.fromTo(els, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.4 }),
        onLeave: (els) => gsap.to(els, { opacity: 0, duration: 0.2 }),
      });
    });
  };

  return (
    <section className="bg-mist py-[var(--space-10)]" data-scene="opportunities">
      <div className="mx-auto max-w-[var(--max-w)] px-[var(--gutter)]">
        <SectionIndex index="09" label="AKTUÁLNÍ PŘÍLEŽITOSTI" tone="light" className="mb-6" />
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h2 className="text-display text-navy">Aktuální investiční příležitosti</h2>
            <p className="text-body-sm mt-3 max-w-[52ch] text-text-secondary">
              Vybrané projekty prezentujeme prostřednictvím konkrétních čísel, scénářů a
              očekávaného vývoje.
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-3" role="group" aria-label="Filtr podle strategie">
          <FilterPill active={filter === "all"} onClick={() => applyFilter("all")}>
            Všechny
          </FilterPill>
          {INVESTMENT_PATHS.map((p) => (
            <FilterPill key={p.id} active={filter === p.id} onClick={() => applyFilter(p.id)}>
              {p.label}
            </FilterPill>
          ))}
        </div>

        <div ref={gridRef} className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((project, i) => (
            <ProjectCard key={project.slug} project={project} featured={project.featured && i === 0} />
          ))}
        </div>

        <Disclaimer className="mt-6">{DISCLAIMERS.modelValues}</Disclaimer>

        <div className="mt-8">
          <Pill href="/investicni-prilezitosti" variant="emerald">
            Zobrazit všechny příležitosti
          </Pill>
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
      className="focus-ring rounded-[9999px] border px-4 py-2 text-xs tracking-[0.1em] uppercase transition-colors"
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
