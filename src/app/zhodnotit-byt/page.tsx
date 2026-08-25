import type { Metadata } from "next";
import { LandingTemplate } from "@/components/sections/LandingTemplate";
import { INVESTMENT_PATHS } from "@/lib/data/paths";

export const metadata: Metadata = {
  title: "Kupte chytře. Zvyšte hodnotu. Prodejte se ziskem.",
  description:
    "Rekonstrukce investičního bytu se ziskem — vyberte nemovitost, spočítejte ekonomiku a nechte Vynósium koordinovat celý proces.",
};

const path = INVESTMENT_PATHS.find((p) => p.id === "flip")!;

export default function ZhodnotitBytPage() {
  return (
    <LandingTemplate
      path={path}
      content={{
        h1: "Kupte chytře. Zvyšte hodnotu. Prodejte se ziskem.",
        heroLede:
          "Najdeme byt pod tržní cenou, spočítáme ekonomiku rekonstrukce a koordinujeme celý proces až k prodeji se ziskem.",
        profile:
          "Řešení je vhodné pro investory s volným kapitálem od cca 2 mil. Kč, kteří chtějí zhodnotit prostředky v horizontu jednotek měsíců až roku a jsou ochotni nést vyšší riziko výměnou za vyšší modelový výnos.",
        howItWorks: [
          {
            title: "Výběr nemovitosti",
            text: "Najdeme byt s potenciálem růstu hodnoty po rekonstrukci, obvykle pod tržní cenou.",
          },
          {
            title: "Propočet ekonomiky",
            text: "Spočítáme náklady na rekonstrukci a modelovou prodejní cenu ještě před nákupem.",
          },
          {
            title: "Realizace rekonstrukce",
            text: "Koordinujeme dodavatele a průběžně vás informujeme o postupu i rozpočtu.",
          },
          {
            title: "Prodej se ziskem",
            text: "Řídíme prodej hotové nemovitosti investorovi nebo koncovému kupci.",
          },
        ],
        exampleCapital: 2_500_000,
        exampleLtv: 40,
        exampleHorizon: 1,
        benefits: [
          "Transparentní propočet nákladů a modelového výnosu ještě před nákupem.",
          "Koordinace rekonstrukce s prověřenými dodavateli.",
          "Krátký investiční horizont v řádu měsíců.",
          "Zkušenost s desítkami realizovaných rekonstrukcí.",
          "Podpora při prodeji hotové nemovitosti.",
        ],
      }}
    />
  );
}
