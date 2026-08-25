import { SectionIndex } from "@/components/ui/SectionIndex";
import { Disclaimer, DISCLAIMERS } from "@/components/ui/Disclaimer";
import { WHY_REAL_ESTATE } from "@/lib/data/whyRealEstate";

/** Editorial, hairline-only, no cards. design.md §3/05. */
export function WhyRealEstate() {
  return (
    <section className="bg-white py-[var(--space-10)]" data-scene="why-real-estate">
      <div className="mx-auto max-w-[var(--max-w)] px-[var(--gutter)]">
        <SectionIndex index="05" label="PROČ NEMOVITOSTI" tone="light" className="mb-8" />
        <div className="grid grid-cols-1 border-t border-light-gray sm:grid-cols-3 lg:grid-cols-5">
          {WHY_REAL_ESTATE.map((item, i) => (
            <div
              key={item.title}
              className="border-b border-light-gray px-0 py-8 pr-6 sm:border-r sm:px-6 sm:py-10 lg:[&:nth-child(5)]:border-r-0"
            >
              <p className="text-label text-text-muted">{String(i + 1).padStart(2, "0")}</p>
              <h3 className="text-subheading mt-4 text-navy">{item.title}</h3>
              <p className="text-body-sm mt-3 max-w-[42ch] text-text-secondary">{item.text}</p>
            </div>
          ))}
        </div>
        <Disclaimer className="mt-8">{DISCLAIMERS.general}</Disclaimer>
      </div>
    </section>
  );
}
