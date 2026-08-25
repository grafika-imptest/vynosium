import { Pill } from "@/components/ui/Pill";

/** Low-motion connective strip for the 40-60% of visitors who didn't self-select a path. design.md §3/04. */
export function Undecided() {
  return (
    <section className="border-y border-light-gray bg-mist py-10 sm:py-12" data-scene="undecided">
      <div className="mx-auto flex max-w-[var(--max-w)] flex-col items-start justify-between gap-6 px-[var(--gutter)] sm:flex-row sm:items-center">
        <div className="max-w-[68ch]">
          <h2 className="text-heading text-navy">Nejste si jistí, která cesta je pro vás vhodná?</h2>
          <p className="text-body-sm mt-2 text-text-secondary">
            Probereme váš cíl, možnosti a časový horizont a společně najdeme investiční
            strategii, která dává smysl právě vám.
          </p>
        </div>
        <Pill href="/kontakt" variant="ghost-light" className="w-full sm:w-auto">
          Domluvit konzultaci
        </Pill>
      </div>
    </section>
  );
}
