import { Disclaimer, SectionIndex } from "@/components/ui/primitives";
import { Reveal } from "@/components/motion/Reveal";
import { WHY_REAL_ESTATE, DISCLAIMERS } from "@/lib/data/site";

/**
 * Why real estate (§3/05). Education without condescension.
 *
 * Five items in a hairline-divided grid — no cards, no shadows, no
 * rounded box with an icon on the left. A light section that a template
 * builder could generate has to be reworked.
 */
export function WhyRealEstate() {
  return (
    <section className="relative z-[2] bg-white py-[var(--space-10)]">
      <div className="mx-auto max-w-[var(--max-w)] px-[var(--gutter)]">
        <SectionIndex label="PROČ NEMOVITOSTI" tone="light" />
        <h2 className="text-display mt-6 max-w-[20ch] text-navy">
          Nemovitost je aktivum, které lze spočítat.
        </h2>

        <Reveal
          selector=".why-item"
          className="mt-12 grid grid-cols-1 gap-px bg-light-gray md:grid-cols-3 lg:grid-cols-5"
        >
          {WHY_REAL_ESTATE.map((item, i) => (
            <article key={item.title} className="why-item bg-white p-6 first:pl-0 lg:p-8">
              <p className="text-label text-text-muted">{String(i + 1).padStart(2, "0")}</p>
              <h3 className="text-subheading mt-5 text-navy">{item.title}</h3>
              <p className="text-body-sm mt-3 max-w-[42ch] text-text-secondary">{item.text}</p>
            </article>
          ))}
        </Reveal>

        <Disclaimer className="mt-8">{DISCLAIMERS.general}</Disclaimer>
      </div>
    </section>
  );
}
