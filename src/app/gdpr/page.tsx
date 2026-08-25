import type { Metadata } from "next";
import { LegalPage } from "@/components/layout/LegalPage";
import { absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Zpracování osobních údajů",
  description: "Jak Vynósium zpracovává osobní údaje zájemců o investici a jaká máte práva.",
  alternates: { canonical: absoluteUrl("/gdpr") },
  robots: { index: false, follow: true },
};

export default function GdprPage() {
  return (
    <LegalPage
      label="GDPR"
      title="Zpracování osobních údajů"
      intro="Přehled toho, jaké údaje sbíráme, proč je potřebujeme a jak dlouho je uchováváme."
      sections={[
        {
          heading: "Správce údajů",
          paragraphs: [
            "Správcem osobních údajů je společnost provozující web vynosium.cz. Kontaktní údaje najdete na stránce Kontakt.",
          ],
        },
        {
          heading: "Jaké údaje zpracováváme",
          paragraphs: [
            "Jméno, telefon, e-mail a údaje, které sami uvedete ve formuláři (investiční priorita, rozsah investice, poznámka).",
            "Dále technické údaje o návštěvě webu v rozsahu, ke kterému jste udělil souhlas v cookie liště.",
          ],
        },
        {
          heading: "Účel a právní základ",
          paragraphs: [
            "Údaje z formuláře zpracováváme za účelem kontaktování a přípravy nabídky, tedy na základě opatření před uzavřením smlouvy.",
            "Marketingové nástroje spouštíme až po udělení souhlasu.",
          ],
        },
        {
          heading: "Doba uchování",
          paragraphs: ["Údaje uchováváme po dobu jednání a následně po dobu vyžadovanou právními předpisy."],
        },
        {
          heading: "Vaše práva",
          paragraphs: [
            "Máte právo na přístup k údajům, opravu, výmaz, omezení zpracování, přenositelnost a vznesení námitky.",
            "Žádost lze podat na kontaktní e-mail uvedený na stránce Kontakt.",
          ],
        },
      ]}
    />
  );
}
