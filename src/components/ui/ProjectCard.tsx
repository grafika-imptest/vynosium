import Image from "next/image";
import Link from "next/link";
import { ModelMark, PathBadge, StatusPill } from "@/components/ui/primitives";
import { STATUS_LABEL, type Project } from "@/lib/data/projects";
import { getPathById } from "@/lib/data/paths";
import { withBasePath } from "@/lib/seo";

/**
 * Investment card (§4.4).
 *
 * 1px hairline, 10px radius, absolutely no shadow — brand condition. The
 * metric matrix is the content; the image is duotone until hover. Closed
 * projects stay visible at 0.4 opacity with a dashed line: scarcity as
 * proof.
 */
export function ProjectCard({ project, featured = false }: { project: Project; featured?: boolean }) {
  const path = getPathById(project.strategy);
  const closed = project.status === "closed";

  return (
    <article
      className={`group relative flex flex-col overflow-hidden rounded-[var(--radius-card)] border bg-white transition-[border-color,transform] duration-[var(--dur-ui)] ${
        closed
          ? "border-dashed border-light-gray opacity-40"
          : "border-light-gray hover:-translate-y-1.5 hover:border-emerald"
      } ${featured ? "lg:col-span-2" : ""}`}
    >
      <div
        className="relative aspect-[16/10] w-full overflow-hidden"
        style={
          project.image
            ? undefined
            : { background: `linear-gradient(38.5deg, ${project.imageFrom}, ${project.imageTo})` }
        }
      >
        {project.image && (
          <Image
            src={withBasePath(project.image)}
            alt={`${project.name} — ${project.location}`}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
        )}
        {/* Navy duotone lifts to full colour on hover (§4.4). */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-navy/25 transition-opacity duration-[600ms] group-hover:opacity-0"
        />
        <div className="absolute left-4 top-4">
          <StatusPill label={STATUS_LABEL[project.status]} tone={project.status} />
        </div>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-subheading text-navy">
              <Link href={`/investicni-prilezitosti/${project.slug}`} className="focus-ring no-underline">
                <span className="absolute inset-0" aria-hidden="true" />
                {project.name}
              </Link>
            </h3>
            <p className="text-body-sm mt-1 text-text-muted">{project.location}</p>
          </div>
          <PathBadge path={project.strategy} label={path.label} />
        </div>

        <dl className="mt-6 grid grid-cols-2 gap-x-4 gap-y-5 border-t border-light-gray pt-5 sm:grid-cols-3">
          {project.metrics.map((metric) => (
            <div key={metric.label}>
              <dt className="text-label text-text-muted">{metric.label}</dt>
              <dd
                className={`text-data mt-2 ${metric.emphasis ? "text-emerald-on-light" : "text-navy"}`}
                style={{ fontSize: "1.125rem" }}
              >
                {metric.value}
                {metric.model && <ModelMark tone="light" />}
              </dd>
            </div>
          ))}
        </dl>

        <p className="text-body-sm mt-5 max-w-[52ch] text-text-secondary">{project.summary}</p>

        <span className="text-label mt-6 inline-flex items-center gap-2 text-navy">
          Detail investice
          <span
            aria-hidden="true"
            className="transition-transform duration-[var(--dur-ui)] group-hover:translate-x-1.5"
          >
            <svg width="18" height="10" viewBox="0 0 18 10" fill="none">
              <path d="M0 5h16M11 1l4 4-4 4" stroke="currentColor" strokeWidth="1.2" />
            </svg>
          </span>
        </span>
      </div>
    </article>
  );
}
