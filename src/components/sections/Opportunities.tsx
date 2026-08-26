"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { Disclaimer, Pill, SectionIndex } from "@/components/ui/primitives";
import { INVESTMENT_PATHS } from "@/lib/data/paths";
import { PROJECTS, REGIONS, STATUS_LABEL, type Project, type ProjectStatus } from "@/lib/data/projects";
import { DISCLAIMERS } from "@/lib/data/site";
import { formatCzk } from "@/lib/format";
import { Flip, ensureGsapRegistered, prefersReducedMotion } from "@/lib/motion";
import type { InvestmentPath } from "@/lib/tokens";

type StrategyFilter = InvestmentPath | "all";
type RegionFilter = string | "all";
type StatusFilter = ProjectStatus | "all";

/**
 * Opportunities (§3/09 on the homepage, §14 on the listing page).
 *
 * Filtering reorders the existing nodes through GSAP Flip rather than
 * re-mounting them, so cards travel to their new slots. The model values are
 * named as such in their labels and the legend sits under the grid, in
 * layout — no superscript marker.
 */
export function Opportunities({
  index,
  compact = false,
  showTableToggle = false,
  initialStrategy = "all",
  heading = "Aktuální investiční příležitosti",
  lede = "Vybrané projekty prezentujeme prostřednictvím konkrétních čísel, scénářů a očekávaného vývoje.",
}: {
  index?: string;
  /** Homepage variant: fewer cards, no table mode, link to the full list. */
  compact?: boolean;
  showTableToggle?: boolean;
  initialStrategy?: StrategyFilter;
  heading?: string;
  lede?: string;
}) {
  const [strategy, setStrategy] = useState<StrategyFilter>(initialStrategy);
  const [region, setRegion] = useState<RegionFilter>("all");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [table, setTable] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);
  const flipState = useRef<Flip.FlipState | null>(null);

  const visible = useMemo(() => {
    const list = PROJECTS.filter(
      (p) =>
        (strategy === "all" || p.strategy === strategy) &&
        (region === "all" || p.region === region) &&
        (status === "all" || p.status === status)
    );
    return compact ? list.slice(0, 3) : list;
  }, [strategy, region, status, compact]);

  // Capture positions before the filtered list paints, then Flip into place.
  useEffect(() => {
    ensureGsapRegistered();
    if (!gridRef.current || prefersReducedMotion()) return;
    if (flipState.current) {
      Flip.from(flipState.current, { duration: 0.5, ease: "power2.out", scale: false, absolute: true });
      flipState.current = null;
    }
  }, [visible, table]);

  const beforeFilterChange = () => {
    if (!gridRef.current || prefersReducedMotion()) return;
    flipState.current = Flip.getState(gridRef.current.querySelectorAll("[data-flip-card]"));
  };

  return (
    <section id="prilezitosti" className="relative z-[2] bg-mist py-[var(--space-10)]">
      <div className="mx-auto max-w-[var(--max-w)] px-[var(--gutter)]">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <SectionIndex index={index} label="PŘÍLEŽITOSTI" tone="light" />
            <h2 className="text-display mt-6 max-w-[18ch] text-navy">{heading}</h2>
            <p className="text-lede mt-5 max-w-[60ch] text-text-secondary">{lede}</p>
          </div>
          {showTableToggle && (
            <div className="flex gap-2">
              <FilterPill active={!table} onClick={() => setTable(false)}>
                Mřížka
              </FilterPill>
              <FilterPill active={table} onClick={() => setTable(true)}>
                Tabulka
              </FilterPill>
            </div>
          )}
        </div>

        {/* Filters — horizontal snap rail on mobile */}
        <div className="mt-10 flex snap-x gap-2 overflow-x-auto pb-2">
          <FilterPill
            active={strategy === "all"}
            onClick={() => {
              beforeFilterChange();
              setStrategy("all");
            }}
          >
            Všechny strategie
          </FilterPill>
          {INVESTMENT_PATHS.map((path) => (
            <FilterPill
              key={path.id}
              active={strategy === path.id}
              accent={`var(--color-${path.colorVar}-on-light)`}
              onClick={() => {
                beforeFilterChange();
                setStrategy(path.id);
              }}
            >
              {path.label}
            </FilterPill>
          ))}
        </div>

        {!compact && (
          <div className="mt-3 flex snap-x gap-2 overflow-x-auto pb-2">
            <FilterPill
              active={region === "all"}
              onClick={() => {
                beforeFilterChange();
                setRegion("all");
              }}
            >
              Celá ČR
            </FilterPill>
            {REGIONS.map((r) => (
              <FilterPill
                key={r}
                active={region === r}
                onClick={() => {
                  beforeFilterChange();
                  setRegion(r);
                }}
              >
                {r}
              </FilterPill>
            ))}
            <span aria-hidden="true" className="mx-2 w-px shrink-0 bg-light-gray" />
            <FilterPill
              active={status === "all"}
              onClick={() => {
                beforeFilterChange();
                setStatus("all");
              }}
            >
              Všechny stavy
            </FilterPill>
            {(Object.keys(STATUS_LABEL) as ProjectStatus[]).map((s) => (
              <FilterPill
                key={s}
                active={status === s}
                onClick={() => {
                  beforeFilterChange();
                  setStatus(s);
                }}
              >
                {STATUS_LABEL[s]}
              </FilterPill>
            ))}
          </div>
        )}

        {visible.length === 0 ? (
          <EmptyState />
        ) : table ? (
          <ProjectTable projects={visible} />
        ) : (
          <div ref={gridRef} className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {visible.map((project, i) => (
              <div key={project.slug} data-flip-card className={project.featured && i % 5 === 3 ? "lg:col-span-2" : ""}>
                <ProjectCard project={project} />
              </div>
            ))}
          </div>
        )}

        <Disclaimer className="mt-8">{DISCLAIMERS.modelValues}</Disclaimer>

        {compact && (
          <Pill href="/investicni-prilezitosti" variant="emerald" className="mt-8">
            Zobrazit všechny příležitosti
          </Pill>
        )}
      </div>
    </section>
  );
}

function FilterPill({
  active,
  accent,
  onClick,
  children,
}: {
  active: boolean;
  accent?: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className="focus-ring text-label shrink-0 snap-start whitespace-nowrap rounded-[var(--radius-pill)] border px-4 py-2.5 transition-colors duration-[var(--dur-micro)]"
      style={{
        borderColor: active ? accent ?? "var(--color-emerald)" : "var(--color-light-gray)",
        color: active ? accent ?? "var(--color-emerald-on-light)" : "var(--color-text-muted)",
      }}
    >
      {children}
    </button>
  );
}

/** The empty state is a signup, not a dead end (§14). */
function EmptyState() {
  return (
    <div className="mt-10 rounded-[var(--radius-card)] border border-light-gray bg-white p-10">
      <h3 className="text-heading text-navy">Chcete být informováni o nových příležitostech?</h3>
      <p className="text-body mt-4 max-w-[56ch] text-text-secondary">
        Pro zvolenou kombinaci filtrů teď nemáme otevřený projekt. Nechte nám parametry, které
        hledáte, a ozveme se, jakmile bude odpovídající příležitost k dispozici.
      </p>
      <Pill href="/kontakt" variant="emerald" className="mt-6">
        Chci být informován
      </Pill>
    </div>
  );
}

/** Table mode — a strong signal to an experienced investor (§14). */
function ProjectTable({ projects }: { projects: Project[] }) {
  return (
    <div className="mt-10 overflow-x-auto rounded-[var(--radius-card)] border border-light-gray bg-white">
      <table className="w-full min-w-[720px] border-collapse text-left">
        <thead>
          <tr className="border-b border-light-gray">
            {["Projekt", "Lokalita", "Strategie", "Min. kapitál", "Hlavní metrika", "Stav"].map((h) => (
              <th key={h} className="text-label px-5 py-4 text-text-muted">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {projects.map((project) => {
            const headline = project.metrics.find((m) => m.emphasis) ?? project.metrics[0];
            return (
              <tr key={project.slug} className="border-b border-light-gray last:border-b-0 even:bg-mist">
                <td className="px-5 py-4">
                  <Link
                    href={`/investicni-prilezitosti/${project.slug}`}
                    className="focus-ring text-body-sm text-navy underline decoration-light-gray underline-offset-4 hover:decoration-emerald"
                  >
                    {project.name}
                  </Link>
                </td>
                <td className="text-body-sm px-5 py-4 text-text-secondary">{project.location}</td>
                <td className="text-body-sm px-5 py-4 text-text-secondary">
                  {INVESTMENT_PATHS.find((p) => p.id === project.strategy)?.label}
                </td>
                <td className="text-data px-5 py-4 text-navy">{formatCzk(project.minCapital)}</td>
                <td className="text-data px-5 py-4 text-emerald-on-light">{headline?.value}</td>
                <td className="text-body-sm px-5 py-4 text-text-secondary">
                  {STATUS_LABEL[project.status]}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
