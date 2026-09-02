import Image from "next/image";
import Link from "next/link";
import { PathBadge, StatusPill } from "@/components/ui/primitives";
import { STATUS_LABEL, type Project, type ProjectMetric } from "@/lib/data/projects";
import { formatCzk } from "@/lib/format";
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

  /*
   * The three decision figures, picked by meaning rather than by position:
   * the return (whichever metric the data marks as the headline one), the
   * horizon, and the entry ticket. Picking metrics[0..2] would have shown
   * "kupní cena" and "investiční náklady" on the flip projects — costs, not
   * reasons to click.
   */
  const headline = [
    project.metrics.find((m) => m.emphasis),
    project.metrics.find((m) => m.label.toLowerCase().includes("horizont")),
    { label: "Potřebný kapitál", value: formatCzk(project.minCapital) },
  ].filter((m): m is ProjectMetric => Boolean(m));

  return (
    <article
      className={`group relative flex flex-col overflow-hidden rounded-[var(--radius-card)] border bg-white transition-[border-color,transform] duration-[var(--dur-ui)] ${
        closed
          ? "border-dashed border-light-gray opacity-40"
          : "border-light-gray hover:-translate-y-1.5 hover:border-emerald"
      } ${featured ? "xl:col-span-2" : ""}`}
      /* The metric values size themselves against this width — see below. */
      style={{ containerType: "inline-size" }}
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
        {/*
          Both pills live on the photograph, one per corner. The strategy
          used to sit beside the title, where it had a third of the card's
          width and broke "ZHODNOTIT BYT" across two lines inside its own
          pill. Up here each stays on one line, the title gets the full
          column, and the two corners frame the image.
        */}
        <div className="absolute inset-x-4 top-4 z-[2] flex flex-wrap items-start justify-between gap-2">
          <StatusPill label={STATUS_LABEL[project.status]} tone={project.status} onImage />
          <PathBadge path={project.strategy} label={path.label} onImage />
        </div>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-subheading text-navy">
          <Link href={`/investicni-prilezitosti/${project.slug}`} className="focus-ring no-underline">
            <span className="absolute inset-0" aria-hidden="true" />
            {project.name}
          </Link>
        </h3>
        <p className="text-body-sm mt-1 text-text-muted">{project.location}</p>

        {/*
          Three figures, not six. The client's note was that the opportunities
          should read as a marketplace, and a marketplace card answers three
          questions on sight: what can it return, for how long, and how much
          do I need. The rest of the ledger is on the detail page, one click
          away, where someone comparing two projects actually wants it.

          The labels take the wrapping variant of the label type: the default
          sets line-height 1, which is right for a single-line eyebrow and
          far too tight for "POTŘEBNÝ / KAPITÁL".
        */}
        <dl
          className={`mt-6 grid grid-cols-2 gap-x-5 gap-y-5 border-t border-light-gray pt-5 ${
            featured ? "sm:grid-cols-3" : ""
          }`}
        >
          {headline.map((metric) => (
            <div key={metric.label}>
              <dt className="text-label text-label-wrap text-text-muted">{metric.label}</dt>
              <dd
                className={`text-data mt-1.5 whitespace-nowrap ${
                  metric.emphasis ? "text-emerald-on-light" : "text-navy"
                }`}
                /*
                   Sized against the CARD, not the viewport: the same 768px
                   screen shows a 421px card three-up and a 332px card
                   two-up, and only the second one has to shrink. A cell is
                   about (card - 68) / 2, and a seven-figure amount needs
                   146px at 17px.
                 */
                style={{ fontSize: "clamp(0.9375rem, 5.4cqi - 3px, 1.0625rem)" }}
              >
                {metric.value}
              </dd>
            </div>
          ))}
        </dl>

        {/*
          How much of the round is taken. This is the marketplace's own
          signal — what other investors already did — so it is a bar and a
          number, never a colour alone, and it says "obsazeno" on a closed
          project rather than showing a full bar with no explanation.
        */}
        <div className="mt-6">
          <p className="text-label text-text-muted">
            {project.reservedPercent >= 100 ? "Obsazeno" : `${project.reservedPercent} % rezervováno`}
          </p>
          <div
            className="mt-2 h-1 w-full overflow-hidden rounded-full bg-light-gray"
            role="img"
            aria-label={`Rezervováno ${project.reservedPercent} procent`}
          >
            <div
              className="h-full rounded-full"
              style={{
                width: `${project.reservedPercent}%`,
                background:
                  project.reservedPercent >= 100
                    ? "var(--color-steel)"
                    : "var(--color-emerald)",
              }}
            />
          </div>
        </div>

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
