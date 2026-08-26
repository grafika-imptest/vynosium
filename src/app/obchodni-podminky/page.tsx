import type { Metadata } from "next";
import { LegalPage } from "@/components/layout/LegalPage";
import { absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Obchodní podmínky",
  description: "Podmínky poskytování služeb a rozsah odpovědnosti.",
  alternates: { canonical: absoluteUrl("/obchodni-podminky") },
  robots: { index: false, follow: true },
};

export default function TermsPage() {
  return (
    <LegalPage
      label="PODMÍNKY"
      title="Obchodní podmínky"
      intro="Rámec, ve kterém spolupráce probíhá, a hranice toho, co web a jeho čísla znamenají."
      sections={[
        {
          heading: "Rozsah služeb",
          paragraphs: [
            "Vynosium zprostředkovává investiční příležitosti v nemovitostech a zajišťuje související služby — výběr, prověření, financování, realizaci, pronájem a správu.",
          ],
        },
        {
          heading: "Povaha uváděných čísel",
          paragraphs: [
            "Všechny hodnoty označené jako modelové nebo očekávané jsou propočty, nikoli garantovaný výsledek.",
            "Obsah webu není investičním doporučením ani nabídkou ve smyslu zákona o podnikání na kapitálovém trhu.",
          ],
        },
        {
          heading: "Rizika",
          paragraphs: [
            "Investice do nemovitostí je spojena s rizikem poklesu hodnoty, neobsazenosti, prodloužení realizace a růstu nákladů financování.",
            "Likvidita nemovitosti je omezená — prodej trvá zpravidla měsíce.",
          ],
        },
        {
          heading: "Smluvní vztah",
          paragraphs: [
            "Konkrétní práva a povinnosti vznikají až podpisem smlouvy k danému projektu. Konzultace je nezávazná a bezplatná.",
          ],
        },
      ]}
    />
  );
}
