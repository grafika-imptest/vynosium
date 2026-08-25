import type { Metadata } from "next";
import { SetHeaderVariant } from "@/components/layout/HeaderVariantContext";
import { PageIntro } from "@/components/layout/PageIntro";
import { FinalCta } from "@/components/sections/FinalCta";
import { Disclaimer, SectionIndex } from "@/components/ui/primitives";
import { JsonLd } from "@/components/seo/JsonLd";
import { DEAL_HISTORY, TEAM } from "@/lib/data/team";
import { SITE, DISCLAIMERS } from "@/lib/data/site";
import { absoluteUrl, breadcrumbSchema } from "@/lib/seo";

export const metadata: Metadata = {
  title: "O nás",
  description:
    "Kdo za Vynósium stojí, jaké projekty jsme realizovali a jaké zázemí máme. Zkušenosti, data a dlouhodobý pohled místo prezentací.",
  alternates: { canonical: absoluteUrl("/o-nas") },
};

export default function AboutPage() {
  return (
    <>
      <SetHeaderVariant variant="light" />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Domů", path: "/" },
          { name: "O nás", path: "/o-nas" },
        ])}
      />

      <PageIntro
        index="—"
        label="O NÁS"
        title="Investice do nemovitostí stavíme na zkušenostech, datech a dlouhodobém pohledu."
        lede="Nejsme makléři. Kupujeme, počítáme, rekonstruujeme a spravujeme — a stejná čísla, která ukazujeme investorovi, používáme při vlastním rozhodování."
      />

      <section className="relative z-[2] bg-white py-[var(--space-9)]">
        <div className="mx-auto grid max-w-[var(--max-w)] grid-cols-1 gap-16 px-[var(--gutter)] lg:grid-cols-12">
          {/* Offset portrait column — never the broker-in-a-suit portrait. */}
          <div className="lg:col-span-5">
            <SectionIndex index="01" label="TÝM" tone="light" />
            <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2">
              {TEAM.map((member) => (
                <article key={`${member.name}-${member.position}`} style={{ marginTop: member.offset }}>
                  <div
                    className="flex aspect-[3/4] w-full items-end justify-start rounded-[var(--radius-card)] border border-light-gray p-4"
                    style={{ background: "linear-gradient(38.5deg, #16324b, #1b3a54)" }}
                  >
                    <span className="text-label text-silver">{member.position}</span>
                  </div>
                  <h2 className="text-subheading mt-4 text-navy">{member.name}</h2>
                  <p className="text-label mt-2 text-text-muted">{member.specialization}</p>
                  <p className="text-body-sm mt-3 max-w-[34ch] text-text-secondary">{member.text}</p>
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="focus-ring text-body-sm mt-3 inline-block text-navy underline decoration-light-gray underline-offset-4 hover:decoration-emerald"
                  >
                    LinkedIn
                  </a>
                </article>
              ))}
            </div>
            <Disclaimer className="mt-8">
              Jména, pozice i portréty jsou zástupné — nahrazují se skutečnými údaji týmu před
              spuštěním webu.
            </Disclaimer>
          </div>

          <div className="lg:col-span-7">
            <SectionIndex index="02" label="HISTORIE OBCHODŮ" tone="light" />
            <div className="mt-8 overflow-x-auto rounded-[var(--radius-card)] border border-light-gray">
              <table className="w-full min-w-[420px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-light-gray">
                    {["Období", "Realizované projekty", "Objem"].map((head) => (
                      <th key={head} className="text-label px-5 py-4 text-text-muted">
                        {head}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {DEAL_HISTORY.map((row) => (
                    <tr key={row.period} className="border-b border-light-gray last:border-b-0 even:bg-mist">
                      <td className="text-data px-5 py-4 text-navy">{row.period}</td>
                      <td className="text-data px-5 py-4 text-text-secondary">{row.projects}</td>
                      <td className="text-data px-5 py-4 text-emerald">{row.volume}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Disclaimer className="mt-4">{DISCLAIMERS.modelValues}</Disclaimer>

            <div className="mt-12 max-w-[64ch]">
              <SectionIndex index="03" label="ZÁZEMÍ" tone="light" />
              <h2 className="text-heading mt-6 text-navy">Skupina za Vynósium</h2>
              <p className="text-body mt-4 text-text-secondary">
                {SITE.group} Zázemí skupiny nám umožňuje plánovat v delším horizontu a nedělat
                v jednotlivých projektech kompromisy kvůli krátkodobému tlaku na výsledek.
              </p>
              <p className="text-body mt-4 text-text-secondary">
                Pro investora to znamená jedinou praktickou věc: projekt se nemusí prodat dřív, než
                dává smysl ho prodat.
              </p>
            </div>
          </div>
        </div>
      </section>

      <FinalCta />
    </>
  );
}
