import { Pill, SectionIndex } from "@/components/ui/primitives";
import { Reveal } from "@/components/motion/Reveal";

/**
 * For undecided investors (§3/04). Catches the 40–60 % who did not
 * recognise themselves in the path selector. It is a connector, not a
 * section: low height, one hairline above and below, minimal movement.
 */
export function Undecided() {
  return (
    <section className="relative z-[2] border-y border-light-gray bg-mist">
      <Reveal className="mx-auto flex max-w-[var(--max-w)] flex-col gap-8 px-[var(--gutter)] py-[var(--space-9)] lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-[68ch]">
          <SectionIndex label="NEROZHODNUTÍ" tone="light" />
          <h2 className="text-heading mt-5 text-navy">
            Nejste si jistí, která cesta je pro vás vhodná?
          </h2>
          <p className="text-body mt-4 text-text-secondary">
            Nemusíte se rozhodnout hned. Projdeme s vámi možnosti, spočítáme modelové varianty pro váš
            kapitál a horizont a doporučíme cestu, která odpovídá tomu, co od investice čekáte.
          </p>
        </div>
        <Pill href="/kontakt" variant="emerald" className="shrink-0">
          Domluvit konzultaci
        </Pill>
      </Reveal>
    </section>
  );
}
