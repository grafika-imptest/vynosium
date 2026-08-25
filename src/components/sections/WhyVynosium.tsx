import { SectionIndex } from "@/components/ui/SectionIndex";
import { WHY_VYNOSIUM } from "@/lib/data/whyVynosium";

/** Deliberately quiet — hairlines + fade only. design.md §3/10 + §8.11. */
export function WhyVynosium() {
  return (
    <section className="bg-white py-[var(--space-10)]" data-scene="why-vynosium">
      <div className="mx-auto max-w-[var(--max-w)] px-[var(--gutter)]">
        <SectionIndex index="10" label="PROČ VYNÓSIUM" tone="light" className="mb-8" />
        <div className="grid grid-cols-1 border-t border-light-gray sm:grid-cols-2 lg:grid-cols-3">
          {WHY_VYNOSIUM.map((item) => (
            <div key={item.title} className="border-b border-r border-light-gray py-8 pr-6 last:border-r-0">
              <h3 className="text-subheading text-navy">{item.title}</h3>
              <p className="text-body-sm mt-3 max-w-[44ch] text-text-secondary">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
