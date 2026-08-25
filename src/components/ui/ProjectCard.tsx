import Link from "next/link";
import { INVESTMENT_PATHS } from "@/lib/data/paths";
import { PROJECT_STATUS_LABEL, type Project } from "@/lib/data/projects";

const STATUS_COLOR: Record<Project["status"], string> = {
  open: "var(--color-emerald)",
  "last-units": "var(--color-fn-warning)",
  closed: "var(--color-steel)",
  upcoming: "var(--color-slate)",
};

export function ProjectCard({ project, featured = false }: { project: Project; featured?: boolean }) {
  const path = INVESTMENT_PATHS.find((p) => p.id === project.strategy);
  const closed = project.status === "closed";

  return (
    <article
      className={`group relative overflow-hidden rounded-[10px] border ${
        closed ? "border-dashed" : ""
      } transition-transform duration-300 hover:-translate-y-1.5 ${featured ? "sm:col-span-2" : ""}`}
      style={{
        borderColor: "var(--color-light-gray)",
        opacity: closed ? 0.4 : 1,
      }}
    >
      <div
        className="aspect-[16/10] w-full"
        style={{ background: "linear-gradient(38.5deg, #16324b, #1b3a54)" }}
        aria-hidden="true"
      />
      <div className="p-6">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-subheading text-navy">{project.name}</h3>
          <span
            className="text-label whitespace-nowrap rounded-full border px-2.5 py-1"
            style={{ borderColor: STATUS_COLOR[project.status], color: STATUS_COLOR[project.status] }}
          >
            {PROJECT_STATUS_LABEL[project.status]}
          </span>
        </div>
        <p className="text-body-sm mt-1 text-text-muted">{project.location}</p>

        {path && (
          <span
            className="text-label mt-3 inline-flex items-center gap-2 rounded-full border px-2.5 py-1"
            style={{ borderColor: `var(--color-${path.colorVar})`, color: `var(--color-${path.colorVar})` }}
          >
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: `var(--color-${path.colorVar})` }} />
            {path.label}
          </span>
        )}

        <div className="mt-5 grid grid-cols-3 gap-x-4 gap-y-4 border-t border-light-gray pt-5">
          <Metric label="Kupní cena" value={project.purchasePrice} />
          <Metric label="Celková investice" value={project.totalInvestment} />
          {project.expectedRent ? (
            <Metric label="Očekávané nájemné" value={project.expectedRent} />
          ) : (
            <Metric label="Horizont" value={project.horizon} />
          )}
          <Metric label="Orientační výnos" value={project.expectedYield} emphasize />
          {project.expectedRent && <Metric label="Horizont" value={project.horizon} />}
        </div>

        {!closed && (
          <Link
            href={`/investicni-prilezitosti/${project.slug}`}
            className="focus-ring mt-6 inline-flex min-h-11 items-center rounded-[9999px] border border-steel px-5 text-sm text-navy hover:border-navy"
          >
            Detail investice
          </Link>
        )}
      </div>
    </article>
  );
}

function Metric({ label, value, emphasize = false }: { label: string; value: string; emphasize?: boolean }) {
  return (
    <div>
      <p className="text-label text-text-muted">{label}</p>
      <p className={`text-data mt-1 ${emphasize ? "text-emerald" : "text-navy"}`}>{value}</p>
    </div>
  );
}
