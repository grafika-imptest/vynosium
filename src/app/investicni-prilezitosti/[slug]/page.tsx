import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SetHeaderVariant } from "@/components/layout/HeaderVariantContext";
import { ScenarioVector } from "@/components/sections/ScenarioVector";
import { Faq } from "@/components/sections/Faq";
import {
  Disclaimer,
  ModelMark,
  PathBadge,
  Pill,
  SectionIndex,
  StatusPill,
} from "@/components/ui/primitives";
import { JsonLd } from "@/components/seo/JsonLd";
import { getPathById } from "@/lib/data/paths";
import { PATH_FAQ } from "@/lib/data/pathFaq";
import { PROJECTS, STATUS_LABEL, getProject } from "@/lib/data/projects";
import { DISCLAIMERS } from "@/lib/data/site";
import { formatCzk } from "@/lib/format";
import { absoluteUrl, breadcrumbSchema, realEstateListingSchema, withBasePath } from "@/lib/seo";

export function generateStaticParams() {
  return PROJECTS.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return {
    title: project.name,
    description: project.summary,
    alternates: { canonical: absoluteUrl(`/investicni-prilezitosti/${project.slug}`) },
  };
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const path = getPathById(project.strategy);

  return (
    <>
      <SetHeaderVariant variant="dark" />
      <JsonLd data={realEstateListingSchema(project)} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Domů", path: "/" },
          { name: "Investiční příležitosti", path: "/investicni-prilezitosti" },
          { name: project.name, path: `/investicni-prilezitosti/${project.slug}` },
        ])}
      />

      {/* 1 — project hero */}
      <section className="relative z-[2] bg-navy pb-[var(--space-9)] pt-[calc(var(--space-12)+40px)]">
        <div className="mx-auto max-w-[var(--max-w)] px-[var(--gutter)]">
          <div className="flex flex-wrap items-center gap-3">
            <PathBadge path={project.strategy} label={path.label} tone="dark" />
            <StatusPill label={STATUS_LABEL[project.status]} tone={project.status} />
          </div>
          <h1 className="text-display-lg mt-6 max-w-[20ch] text-snow">{project.name}</h1>
          <p className="text-lede mt-4 text-slate-on-dark">{project.location}</p>
          <p className="text-body mt-6 max-w-[64ch] text-slate-on-dark">{project.summary}</p>
        </div>

        <div className="mx-auto mt-10 h-[46vh] max-w-[var(--max-w)] px-[var(--gutter)]">
          <div
            className="relative h-full w-full overflow-hidden rounded-[var(--radius-card)] border border-steel/50"
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
                priority
                sizes="(min-width: 1440px) 1264px, 92vw"
                className="object-cover"
              />
            )}
          </div>
        </div>
      </section>

      {/* 2 — key numbers, sticky through the page */}
      <section className="relative z-[2] bg-white">
        <div className="mx-auto max-w-[var(--max-w)] px-[var(--gutter)]">
          <div className="sticky top-16 z-[3] border-b border-light-gray bg-white/95 py-5 backdrop-blur">
            <dl className="grid grid-cols-2 gap-x-6 gap-y-5 md:grid-cols-3 lg:grid-cols-6">
              {project.metrics.map((metric) => (
                <div key={metric.label}>
                  <dt className="text-label text-text-muted">{metric.label}</dt>
                  <dd className={`text-data mt-2 ${metric.emphasis ? "text-emerald-on-light" : "text-navy"}`}>
                    {metric.value}
                    {metric.model && <ModelMark tone="light" />}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
          <Disclaimer className="pt-4">{DISCLAIMERS.modelValues}</Disclaimer>
        </div>
      </section>

      {/* 3 — investment thesis */}
      <section className="relative z-[2] bg-white py-[var(--space-10)]">
        <div className="mx-auto grid max-w-[var(--max-w)] grid-cols-1 gap-12 px-[var(--gutter)] lg:grid-cols-12">
          <div className="lg:col-span-7">
            <SectionIndex index="01" label="INVESTIČNÍ TEZE" tone="light" />
            <h2 className="text-display mt-6 max-w-[18ch] text-navy">Proč právě tento projekt</h2>
            {project.thesis.map((paragraph) => (
              <p key={paragraph} className="text-body mt-5 max-w-[64ch] text-text-secondary">
                {paragraph}
              </p>
            ))}
          </div>

          {/* 4 — location */}
          <div className="lg:col-span-5">
            <SectionIndex index="02" label="LOKALITA" tone="light" />
            <dl className="mt-6 border-t border-light-gray">
              {project.locationNotes.map((note) => (
                <div key={note.title} className="border-b border-light-gray py-5">
                  <dt className="text-subheading text-navy">{note.title}</dt>
                  <dd className="text-body-sm mt-2 max-w-[46ch] text-text-secondary">{note.text}</dd>
                </div>
              ))}
            </dl>
            {/* Map placeholder — navy styling, lines and one emerald pin only. */}
            <div
              className="mt-6 aspect-[4/3] w-full rounded-[var(--radius-card)] border border-light-gray"
              style={{
                background:
                  "repeating-linear-gradient(38.5deg, #f5f7fa 0 22px, #ffffff 22px 44px)",
              }}
              role="img"
              aria-label={`Mapa lokality ${project.location} — v produkci nahrazena mapou se stylem Vynosium.`}
            >
              <div className="flex h-full items-center justify-center">
                <span className="inline-block h-3 w-3 rounded-full border-2 border-emerald" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5 — scenario on the 38.5° vector */}
      <section className="relative z-[2] bg-navy py-[var(--space-10)]">
        <div className="mx-auto max-w-[var(--max-w)] px-[var(--gutter)]">
          <SectionIndex index="03" label="SCÉNÁŘ INVESTICE" tone="dark" />
          <h2 className="text-display mt-6 max-w-[20ch] text-snow">Jak projekt probíhá v čase</h2>
          <div className="mt-10">
            <ScenarioVector nodes={project.scenario} tone="dark" />
          </div>
        </div>
      </section>

      {/* 6 — financing, 7 — gallery */}
      <section className="relative z-[2] bg-white py-[var(--space-10)]">
        <div className="mx-auto grid max-w-[var(--max-w)] grid-cols-1 gap-12 px-[var(--gutter)] lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionIndex index="04" label="FINANCOVÁNÍ" tone="light" />
            <h2 className="text-heading mt-6 text-navy">Dopad páky na výnos z vlastního kapitálu</h2>
            <dl className="mt-6 border-t border-light-gray">
              {project.financing.map((row) => (
                <div
                  key={row.label}
                  className="flex items-baseline justify-between gap-6 border-b border-light-gray py-4"
                >
                  <dt className="text-body-sm text-text-secondary">{row.label}</dt>
                  <dd className="text-data text-navy">{row.value}</dd>
                </div>
              ))}
              <div className="flex items-baseline justify-between gap-6 border-b border-light-gray py-4">
                <dt className="text-body-sm text-text-secondary">Minimální vstup</dt>
                <dd className="text-data text-navy">{formatCzk(project.minCapital)}</dd>
              </div>
            </dl>
            <Disclaimer className="mt-4">{DISCLAIMERS.scenario}</Disclaimer>
          </div>

          <div className="lg:col-span-7">
            <SectionIndex index="05" label="GALERIE" tone="light" />
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {project.gallery.map((item) => {
                // Only the photo slot has real photography so far; the plan
                // and the visualisation stay drafting-board placeholders
                // until the client supplies them.
                const usePhoto = item.kind === "foto" && Boolean(project.image);
                return (
                  <figure key={item.caption}>
                    <div
                      className="relative aspect-[4/3] w-full overflow-hidden rounded-[var(--radius-card)] border border-light-gray"
                      style={
                        usePhoto
                          ? undefined
                          : {
                              background:
                                item.kind === "půdorys"
                                  ? "repeating-linear-gradient(38.5deg, #ffffff 0 18px, #f5f7fa 18px 36px)"
                                  : `linear-gradient(38.5deg, ${project.imageFrom}, ${project.imageTo})`,
                            }
                      }
                    >
                      {usePhoto && (
                        <Image
                          src={withBasePath(project.image as string)}
                          alt={item.caption}
                          fill
                          sizes="(min-width: 1024px) 360px, 90vw"
                          className="object-cover"
                        />
                      )}
                    </div>
                    <figcaption className="text-label mt-3 text-text-muted">
                      {item.kind} — {item.caption}
                    </figcaption>
                  </figure>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <Faq
        items={PATH_FAQ[project.strategy]}
        index="06"
        heading={`Otázky k této strategii`}
        tone="light"
      />

      {/* 8 — CTA */}
      <section className="relative z-[2] bg-mist py-[var(--space-9)]">
        <div className="mx-auto flex max-w-[var(--max-w)] flex-col gap-6 px-[var(--gutter)] lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-heading text-navy">Chci více informací o projektu</h2>
            <p className="text-body mt-3 max-w-[56ch] text-text-secondary">
              Pošleme vám kompletní propočet včetně scénářů, rozpadu nákladů a variant financování.
            </p>
          </div>
          <Pill href={`/kontakt?typ=${project.strategy}`} variant="emerald" className="shrink-0">
            Chci více informací
          </Pill>
        </div>
      </section>
    </>
  );
}
