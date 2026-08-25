import type { Metadata } from "next";
import { LandingTemplate } from "@/components/sections/LandingTemplate";
import { INVESTMENT_PATHS } from "@/lib/data/paths";

export const metadata: Metadata = {
  title: "Jedna nemovitost může být jen začátek.",
  description:
    "Budujte dlouhodobé portfolio nemovitostí krok za krokem — od první investice po správu celého portfolia.",
};

const path = INVESTMENT_PATHS.find((p) => p.id === "wealth")!;

export default function BudovaniMajetkuPage() {
  return (
    <LandingTemplate
      path={path}
      content={{
        h1: "Jedna nemovitost může být jen začátek.",
        heroLede:
          "Pomůžeme vám postupně vybudovat portfolio nemovitostí — od první investice po správu a plánované rozšiřování.",
        profile:
          "Řešení je vhodné pro investory s dlouhodobým horizontem, kteří chtějí systematicky budovat majetek přes více nemovitostí místo jedné velké pozice a ocení konsolidovanou správu portfolia.",
        howItWorks: [
          {
            title: "První investice",
            text: "Začneme jednou nemovitostí odpovídající vašemu kapitálu a cílům.",
          },
          {
            title: "Vyhodnocení výsledku",
            text: "Po zaběhnutí nemovitosti vyhodnotíme cashflow a hodnotu portfolia.",
          },
          {
            title: "Plánované rozšiřování",
            text: "Navrhneme, kdy a jakou další nemovitost do portfolia přidat.",
          },
          {
            title: "Konsolidovaná správa",
            text: "Celé portfolio spravujeme s jedním přehledem výnosů a nákladů.",
          },
        ],
        exampleCapital: 5_000_000,
        exampleLtv: 40,
        exampleHorizon: 8,
        benefits: [
          "Diverzifikace rizika mezi více nemovitostí a nájemníků.",
          "Postupné budování bez nutnosti jedné velké počáteční investice.",
          "Konsolidovaná správa celého portfolia na jednom místě.",
          "Dlouhodobé partnerství při plánování dalších investic.",
          "Podpora s financováním dalších nemovitostí v portfoliu.",
        ],
      }}
    />
  );
}
