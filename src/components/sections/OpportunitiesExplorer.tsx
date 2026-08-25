"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Flip, ensureGsapRegistered, gsap, prefersReducedMotion } from "@/lib/motion";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { Pill } from "@/components/ui/Pill";
import { INVESTMENT_PATHS } from "@/lib/data/paths";
import { PROJECTS, PROJECT_STATUS_LABEL, type Project } from "@/lib/data/projects";
import { formatCzk } from "@/lib/format";

type SortKey = "yield-desc" | "yield-asc" | "price-asc" | "price-desc";
type ViewMode = "grid" | "table";

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "yield-desc", label: "Výnos: nejvyšší" },
  { value: "yield-asc", label: "Výnos: nejnižší" },
  { value: "price-asc", label: "Cena: od nejnižší" },
  { value: "price-desc", label: "Cena: od nejvyšší" },
];

const LOCATIONS = Array.from(new Set(PROJECTS.map((p) => p.location))).sort();

export function OpportunitiesExplorer({ initialStrategy }: { initialStrategy?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [strategy, setStrategy] = useState<string>(initialStrategy ?? searchParams.get("strategie") ?? "all");
  const [location, setLocation] = useState<string>("all");
  const [minCapital, setMinCapital] = useState<number>(0);
  const [sort, setSort] = useState<SortKey>("yield-desc");
  const [view, setView] = useState<ViewMode>("grid");
  const gridRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    let list = PROJECTS.slice();
    if (strategy !== "all") list = list.filter((p) => p.strategy === strategy);
    if (location !== "all") list = list.filter((p) => p.location === location);
    if (minCapital > 0) list = list.filter((p) => p.investmentSize >= minCapital);

    list.sort((a, b) => {
      switch (sort) {
        case "yield-desc":
          return b.yieldValue - a.yieldValue;
        case "yield-asc":
          return a.yieldValue - b.yieldValue;
        case "price-asc":
          return a.investmentSize - b.investmentSize;
        case "price-desc":
          return b.investmentSize - a.investmentSize;
      }
    });
    return list;
  }, [strategy, location, minCapital, sort]);

  const applyStrategy = (next: string) => {
    ensureGsapRegistered();
    const url = next === "all" ? "/investicni-prilezitosti" : `/investicni-prilezitosti?strategie=${next}`;
    router.push(url, { scroll: false });

    if (prefersReducedMotion() || !gridRef.current) {
      setStrategy(next);
      return;
    }
    const state = Flip.getState(gridRef.current.children);
    setStrategy(next);
    requestAnimationFrame(() => {
      Flip.from(state, { duration: 0.5, ease: "power2.inOut", absolute: true });
    });
  };

  return (
    <section className="bg-mist py-[var(--space-9)]">
      <div className="mx-auto max-w-[var(--max-w)] px-[var(--gutter)]">
        {/* Filter bar */}
        <div className="sticky top-16 z-20 -mx-[var(--gutter)] border-b border-light-gray bg-mist/95 px-[var(--gutter)] py-4 backdrop-blur">
          <div className="flex flex-wrap items-center gap-3">
            <FilterPill active={strategy === "all"} onClick={() => applyStrategy("all")}>
              Všechny strategie
            </FilterPill>
            {INVESTMENT_PATHS.map((p) => (
              <FilterPill key={p.id} active={strategy === p.id} onClick={() => applyStrategy(p.id)}>
                {p.label}
              </FilterPill>
            ))}

            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="focus-ring rounded-[9999px] border border-light-gray bg-white px-4 py-2 text-xs uppercase tracking-[0.1em] text-text-secondary"
              aria-label="Filtrovat podle lokality"
            >
              <option value="all">Všechny lokality</option>
              {LOCATIONS.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>

            <select
              value={minCapital}
              onChange={(e) => setMinCapital(Number(e.target.value))}
              className="focus-ring rounded-[9999px] border border-light-gray bg-white px-4 py-2 text-xs uppercase tracking-[0.1em] text-text-secondary"
              aria-label="Minimální kapitál"
            >
              <option value={0}>Min. kapitál — bez omezení</option>
              <option value={5_000_000}>od 5 mil. Kč</option>
              <option value={6_000_000}>od 6 mil. Kč</option>
              <option value={7_000_000}>od 7 mil. Kč</option>
            </select>

            <div className="ml-auto flex items-center gap-3">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                className="focus-ring rounded-[9999px] border border-light-gray bg-white px-4 py-2 text-xs uppercase tracking-[0.1em] text-text-secondary"
                aria-label="Řazení"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>

              <div className="flex overflow-hidden rounded-[9999px] border border-light-gray" role="group" aria-label="Zobrazení">
                <button
                  type="button"
                  onClick={() => setView("grid")}
                  className="focus-ring px-3 py-2 text-xs uppercase tracking-[0.1em]"
                  style={{
                    background: view === "grid" ? "var(--color-navy)" : "transparent",
                    color: view === "grid" ? "var(--color-white)" : "var(--color-text-secondary)",
                  }}
                  aria-pressed={view === "grid"}
                >
                  Mřížka
                </button>
                <button
                  type="button"
                  onClick={() => setView("table")}
                  className="focus-ring px-3 py-2 text-xs uppercase tracking-[0.1em]"
                  style={{
                    background: view === "table" ? "var(--color-navy)" : "transparent",
                    color: view === "table" ? "var(--color-white)" : "var(--color-text-secondary)",
                  }}
                  aria-pressed={view === "table"}
                >
                  Tabulka
                </button>
              </div>
            </div>
          </div>
        </div>

        <p className="mt-6 text-sm text-text-muted">
          {filtered.length} {filtered.length === 1 ? "příležitost" : filtered.length < 5 ? "příležitosti" : "příležitostí"}
        </p>

        {filtered.length === 0 ? (
          <EmptyState />
        ) : view === "grid" ? (
          <div ref={gridRef} className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </div>
        ) : (
          <TableView projects={filtered} />
        )}
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

function TableView({ projects }: { projects: Project[] }) {
  return (
    <div className="mt-6 overflow-x-auto rounded-[10px] border border-light-gray bg-white">
      <table className="w-full min-w-[720px] border-collapse text-left">
        <thead>
          <tr className="border-b border-light-gray">
            {["Projekt", "Lokalita", "Strategie", "Celková investice", "Orientační výnos", "Horizont", "Stav"].map((h) => (
              <th key={h} className="text-label px-4 py-3 text-text-muted">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {projects.map((p) => {
            const path = INVESTMENT_PATHS.find((x) => x.id === p.strategy);
            return (
              <tr key={p.slug} className="border-b border-light-gray last:border-b-0 hover:bg-mist">
                <td className="px-4 py-3">
                  <Link href={`/investicni-prilezitosti/${p.slug}`} className="focus-ring text-sm text-navy underline decoration-light-gray hover:decoration-emerald">
                    {p.name}
                  </Link>
                </td>
                <td className="text-data px-4 py-3 text-text-secondary">{p.location}</td>
                <td className="px-4 py-3">
                  <span className="text-label" style={{ color: path ? `var(--color-${path.colorVar})` : undefined }}>
                    {path?.label}
                  </span>
                </td>
                <td className="text-data px-4 py-3 text-navy">{formatCzk(p.investmentSize)}</td>
                <td className="text-data px-4 py-3 text-emerald">{p.expectedYield}</td>
                <td className="text-data px-4 py-3 text-text-secondary">{p.horizon}</td>
                <td className="text-label px-4 py-3 text-text-muted">{PROJECT_STATUS_LABEL[p.status]}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="mt-6 rounded-[10px] border border-light-gray bg-white p-10 text-center">
      <p className="text-subheading text-navy">Žádné příležitosti neodpovídají zvolenému filtru.</p>
      <p className="text-body-sm mt-3 max-w-[52ch] mx-auto text-text-secondary">
        Chcete být informováni, jakmile se objeví nová příležitost odpovídající vašim kritériím?
      </p>
      <Pill href="/kontakt" variant="emerald" className="mt-6">
        Chci být informován o nových příležitostech
      </Pill>
    </div>
  );
}
