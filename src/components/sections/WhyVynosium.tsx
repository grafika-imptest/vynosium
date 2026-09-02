import { SectionIndex } from "@/components/ui/primitives";
import { Reveal } from "@/components/motion/Reveal";
import { WHY_VYNOSIUM } from "@/lib/data/site";

/**
 * Why Vynosium (§3/10). Six arguments, stated plainly.
 *
 * Deliberately the quietest section on the page: hairline grid, no
 * movement beyond a fade. A section with less motion than its neighbours
 * reads as more honest — that trade-off is accepted, not accidental.
 */
export function WhyVynosium() {
  return (
    <section className="relative z-[2] bg-white py-[var(--space-10)]">
      <div className="mx-auto max-w-[var(--max-w)] px-[var(--gutter)]">
        <SectionIndex label="PROČ VYNOSIUM" tone="light" />
        <h2 className="text-display mt-6 max-w-[20ch] text-navy">
          Jeden partner pro celou investici.
        </h2>

        <Reveal
          selector=".why-cell"
          className="mt-12 grid grid-cols-1 gap-px bg-light-gray md:grid-cols-2 lg:grid-cols-3"
        >
          {WHY_VYNOSIUM.map((item, i) => (
            <article key={item.title} className="why-cell bg-white p-8">
              <p className="text-label text-text-muted">{String(i + 1).padStart(2, "0")}</p>
              <h3 className="text-subheading mt-5 text-navy">{item.title}</h3>
              <p className="text-body-sm mt-3 max-w-[44ch] text-text-secondary">{item.text}</p>
            </article>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
