import { SetHeaderVariant } from "@/components/layout/HeaderVariantContext";

export function LegalPage({
  title,
  updated,
  sections,
}: {
  title: string;
  updated: string;
  sections: { heading: string; body: string[] }[];
}) {
  return (
    <>
      <SetHeaderVariant variant="light" />
      <section className="bg-white pb-[var(--space-10)] pt-36">
        <div className="mx-auto max-w-[var(--max-w-text)] px-[var(--gutter)]">
          <h1 className="text-display text-navy">{title}</h1>
          <p className="text-disclaimer mt-3 text-text-muted">Aktualizováno: {updated}</p>
          <div className="mt-10 flex flex-col gap-8">
            {sections.map((s) => (
              <div key={s.heading}>
                <h2 className="text-heading text-navy">{s.heading}</h2>
                <div className="mt-3 flex flex-col gap-3">
                  {s.body.map((p, i) => (
                    <p key={i} className="text-body text-text-secondary">
                      {p}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
