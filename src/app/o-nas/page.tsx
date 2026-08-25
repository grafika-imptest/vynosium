import type { Metadata } from "next";
import { SetHeaderVariant } from "@/components/layout/HeaderVariantContext";
import { PageIntro } from "@/components/layout/PageIntro";
import { SectionIndex } from "@/components/ui/SectionIndex";
import { TEAM } from "@/lib/data/team";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/seo";

export const metadata: Metadata = {
  title: "O nás",
  description:
    "Vynósium staví investice do nemovitostí na zkušenostech, datech a dlouhodobém pohledu — poznejte tým a historii obchodů.",
};

const DEAL_HISTORY = [
  { year: "2019–2020", projects: "8 projektů", volume: "140 mil. Kčᴹ" },
  { year: "2021", projects: "11 projektů", volume: "210 mil. Kčᴹ" },
  { year: "2022", projects: "14 projektů", volume: "260 mil. Kčᴹ" },
  { year: "2023", projects: "13 projektů", volume: "240 mil. Kčᴹ" },
  { year: "2024–2025", projects: "18 projektů", volume: "350 mil. Kčᴹ" },
];

export default function AboutPage() {
  return (
    <>
      <SetHeaderVariant variant="light" />
      <JsonLd data={breadcrumbSchema([{ name: "Domů", path: "/" }, { name: "O nás", path: "/o-nas" }])} />
      <PageIntro
        index="—"
        label="O NÁS"
        title="Investice do nemovitostí stavíme na zkušenostech, datech a dlouhodobém pohledu."
      />

      <section className="bg-white py-[var(--space-9)]">
        <div className="mx-auto grid max-w-[var(--max-w)] grid-cols-1 gap-16 px-[var(--gutter)] lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionIndex index="01" label="TÝM" tone="light" className="mb-6" />
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
              {TEAM.map((member) => (
                <div key={member.name} style={{ marginTop: member.offset }}>
                  <div
                    className="flex aspect-[3/4] w-full items-center justify-center rounded-[10px]"
                    style={{ background: "linear-gradient(38.5deg, #16324b, #1b3a54)" }}
                  >
                    <span className="text-display text-slate">
                      {member.name
                        .split(" ")
                        .map((p) => p[0])
                        .join("")}
                    </span>
                  </div>
                  <h3 className="text-subheading mt-4 text-navy">{member.name}</h3>
                  <p className="text-label mt-1 text-text-muted">{member.position}</p>
                  <p className="text-body-sm mt-2 text-text-secondary">{member.specialization}</p>
                  <p className="text-body-sm mt-2 max-w-[32ch] text-text-secondary">{member.text}</p>
                  <a href="#" className="focus-ring mt-2 inline-block text-sm text-navy underline decoration-light-gray hover:decoration-emerald">
                    LinkedIn
                  </a>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-7">
            <SectionIndex index="02" label="HISTORIE OBCHODŮ" tone="light" className="mb-6" />
            <div className="overflow-x-auto rounded-[10px] border border-light-gray">
              <table className="w-full min-w-[420px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-light-gray">
                    {["Období", "Realizované projekty", "Objem"].map((h) => (
                      <th key={h} className="text-label px-4 py-3 text-text-muted">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {DEAL_HISTORY.map((row) => (
                    <tr key={row.year} className="border-b border-light-gray last:border-b-0">
                      <td className="text-data px-4 py-3 text-navy">{row.year}</td>
                      <td className="text-data px-4 py-3 text-text-secondary">{row.projects}</td>
                      <td className="text-data px-4 py-3 text-emerald">{row.volume}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-10 max-w-[56ch]">
              <SectionIndex index="03" label="ZÁZEMÍ" tone="light" className="mb-4" />
              <p className="text-body text-text-secondary">
                Vynósium je součástí skupiny Real Luxembourg, která nám dává finanční i provozní
                zázemí pro dlouhodobé plánování a stabilní růst — bez nutnosti dělat kompromisy
                v jednotlivých projektech kvůli krátkodobému tlaku na výsledky.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
