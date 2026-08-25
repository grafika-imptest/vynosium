import type { Metadata } from "next";
import { LegalPage } from "@/components/layout/LegalPage";

export const metadata: Metadata = { title: "GDPR" };

/**
 * PLACEHOLDER TEXT — generic GDPR structure, not a reviewed legal
 * document. Must be replaced by counsel-approved content before launch.
 */
export default function GdprPage() {
  return (
    <LegalPage
      title="Zpracování osobních údajů (GDPR)"
      updated="[doplnit datum]"
      sections={[
        {
          heading: "Správce osobních údajů",
          body: [
            "Správcem osobních údajů je Vynósium [doplnit přesný obchodní název a IČO], se sídlem [doplnit adresu].",
          ],
        },
        {
          heading: "Jaké údaje zpracováváme",
          body: [
            "V souvislosti s poptávkovým formulářem a kalkulačkou zpracováváme zejména jméno, telefon, e-mail a údaje o vaší investiční poptávce, které nám sami poskytnete.",
          ],
        },
        {
          heading: "Účel a právní základ zpracování",
          body: [
            "Údaje zpracováváme za účelem vyřízení vaší poptávky a přípravy nabídky, na základě vašeho souhlasu nebo oprávněného zájmu jednat o smlouvě.",
          ],
        },
        {
          heading: "Vaše práva",
          body: [
            "Máte právo na přístup k osobním údajům, jejich opravu, výmaz, omezení zpracování a přenositelnost, a právo vznést námitku. [Doplnit kontakt pro uplatnění práv a odkaz na Úřad pro ochranu osobních údajů.]",
          ],
        },
      ]}
    />
  );
}
