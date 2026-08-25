import { SetHeaderVariant } from "@/components/layout/HeaderVariantContext";
import { PageIntro } from "@/components/layout/PageIntro";
import { Disclaimer } from "@/components/ui/primitives";

/**
 * Shell for the legal pages. The copy in these pages is a PLACEHOLDER
 * skeleton — the wording must be supplied and approved by Vynósium's
 * legal counsel before launch.
 */
export function LegalPage({
  label,
  title,
  intro,
  sections,
}: {
  label: string;
  title: string;
  intro: string;
  sections: { heading: string; paragraphs: string[] }[];
}) {
  return (
    <>
      <SetHeaderVariant variant="light" />
      <PageIntro index="—" label={label} title={title} lede={intro} />

      <section className="relative z-[2] bg-white pb-[var(--space-11)]">
        <div className="mx-auto max-w-[var(--max-w)] px-[var(--gutter)]">
          <div className="max-w-[68ch]">
            {sections.map((section) => (
              <article key={section.heading} className="border-t border-light-gray py-8">
                <h2 className="text-heading text-navy">{section.heading}</h2>
                {section.paragraphs.map((p) => (
                  <p key={p} className="text-body mt-4 text-text-secondary">
                    {p}
                  </p>
                ))}
              </article>
            ))}

            <Disclaimer className="mt-8">
              Tento dokument je pracovní verze. Před spuštěním webu musí být text schválen právním
              zástupcem společnosti.
            </Disclaimer>
          </div>
        </div>
      </section>
    </>
  );
}
