import type { Metadata } from "next";
import { LandingTemplate } from "@/components/sections/LandingTemplate";
import { INVESTMENT_PATHS } from "@/lib/data/paths";

export const metadata: Metadata = {
  title: "Investiční byt bez každodenních starostí.",
  description:
    "Dlouhodobý pronájem investičního bytu se správou, kterou za vás zajistí Vynósium — pravidelný cashflow bez starostí s nájemníky.",
};

const path = INVESTMENT_PATHS.find((p) => p.id === "income")!;

export default function PasivniPrijemPage() {
  return (
    <LandingTemplate
      path={path}
      content={{
        h1: "Investiční byt bez každodenních starostí.",
        heroLede:
          "Vybereme investiční byt s dobrou nájemní poptávkou a postaráme se o pronájem i správu — vy sledujete jen výsledek.",
        profile:
          "Řešení je vhodné pro investory hledající pravidelný měsíční příjem s nižším rizikem než u krátkodobých strategií, ideálně s horizontem v řádu let a bez zájmu řešit provoz nemovitosti sami.",
        howItWorks: [
          {
            title: "Výběr lokality",
            text: "Zvolíme byt v lokalitě s dlouhodobě stabilní nájemní poptávkou.",
          },
          {
            title: "Zajištění nájemníka",
            text: "Postaráme se o obsazení bytu a nastavení nájemní smlouvy.",
          },
          {
            title: "Průběžná správa",
            text: "Komunikaci s nájemníkem i běžnou údržbu řešíme za vás.",
          },
          {
            title: "Pravidelný přehled",
            text: "Dostáváte pravidelný přehled cashflow a stavu nemovitosti.",
          },
        ],
        exampleCapital: 3_000_000,
        exampleLtv: 30,
        exampleHorizon: 10,
        benefits: [
          "Pravidelný měsíční příjem z nájmu.",
          "Kompletní správa nemovitosti — nájemníci, údržba, komunikace.",
          "Nižší riziko oproti krátkodobým strategiím.",
          "Lokality vybírané s ohledem na dlouhodobou poptávku po pronájmu.",
          "Možnost kombinovat s financováním pro vyšší výnos vlastního kapitálu.",
        ],
      }}
    />
  );
}
