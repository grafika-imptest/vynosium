import type { Metadata } from "next";
import { LandingTemplate } from "@/components/sections/LandingTemplate";
import { INVESTMENT_PATHS } from "@/lib/data/paths";

export const metadata: Metadata = {
  title: "Proměňte volný kapitál v reálné aktivum.",
  description:
    "Zhodnoťte volný kapitál investicí do nemovitosti s potenciálem růstu hodnoty — modelový propočet i scénáře P10–P90.",
};

const path = INVESTMENT_PATHS.find((p) => p.id === "capital")!;

export default function ZhodnoceniKapitaluPage() {
  return (
    <LandingTemplate
      path={path}
      content={{
        h1: "Proměňte volný kapitál v reálné aktivum.",
        heroLede:
          "Volný kapitál zhodnotíme v nemovitosti s potenciálem růstu hodnoty — reálné aktivum, které nekoreluje 1:1 s kapitálovými trhy.",
        profile:
          "Řešení je vhodné pro investory s volným kapitálem, kteří hledají alternativu ke kapitálovým trhům se střednědobým horizontem 3–5 let a chtějí část majetku držet v hmotném aktivu.",
        howItWorks: [
          {
            title: "Analýza lokality",
            text: "Vybereme lokalitu s potenciálem růstu hodnoty na základě rozvoje infrastruktury a poptávky.",
          },
          {
            title: "Nákup a případná úprava",
            text: "Nemovitost pořídíme a v případě potřeby mírně upravíme pro zvýšení hodnoty.",
          },
          {
            title: "Držení a monitoring",
            text: "Sledujeme vývoj hodnoty a lokality po celou dobu investičního horizontu.",
          },
          {
            title: "Realizace zhodnocení",
            text: "Podle situace na trhu navrhneme optimální okamžik pro prodej nebo další držení.",
          },
        ],
        exampleCapital: 4_000_000,
        exampleLtv: 20,
        exampleHorizon: 4,
        benefits: [
          "Reálné aktivum jako alternativa ke kapitálovým trhům.",
          "Lokality vybírané s ohledem na růstový potenciál, ne jen aktuální cenu.",
          "Transparentní scénář včetně konzervativnější varianty (P10).",
          "Střednědobý horizont 3–5 let.",
          "Možnost kombinovat s mírným financováním.",
        ],
      }}
    />
  );
}
