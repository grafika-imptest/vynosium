import type { InvestmentPath } from "@/lib/tokens";

export type PathDefinition = {
  id: InvestmentPath;
  index: string;
  label: string;
  slug: string;
  colorVar: string; // Tailwind color token name, e.g. "path-flip"
  headline: string;
  metricLabel: string;
  metricValue: string;
  cta: string;
  glyph: "ascend" | "pulse" | "block" | "stack";
};

export const INVESTMENT_PATHS: PathDefinition[] = [
  {
    id: "flip",
    index: "01",
    label: "Zhodnotit byt",
    slug: "zhodnotit-byt",
    colorVar: "path-flip",
    headline: "Koupit, rekonstruovat a následně prodat se ziskem.",
    metricLabel: "výnos",
    metricValue: "18–24 %ᴹ · horizont 6–14 měs.",
    cta: "Chci zhodnotit byt",
    glyph: "ascend",
  },
  {
    id: "income",
    index: "02",
    label: "Pasivní příjem",
    slug: "pasivni-prijem",
    colorVar: "path-income",
    headline: "Investiční byt, který vám pravidelně vydělává na nájmu.",
    metricLabel: "výnos",
    metricValue: "5–7 % p.a.ᴹ · dlouhodobý pronájem",
    cta: "Chci pasivní příjem",
    glyph: "pulse",
  },
  {
    id: "capital",
    index: "03",
    label: "Zhodnocení kapitálu",
    slug: "zhodnoceni-kapitalu",
    colorVar: "path-capital",
    headline: "Proměňte volný kapitál v reálné aktivum s potenciálem růstu.",
    metricLabel: "výnos",
    metricValue: "8–12 % p.a.ᴹ · horizont 3–5 let",
    cta: "Chci zhodnotit kapitál",
    glyph: "block",
  },
  {
    id: "wealth",
    index: "04",
    label: "Budování majetku",
    slug: "budovani-majetku",
    colorVar: "path-wealth",
    headline: "Jedna nemovitost může být jen začátek portfolia.",
    metricLabel: "horizont",
    metricValue: "dlouhodobě · postupné rozšiřování portfolia",
    cta: "Chci budovat majetek",
    glyph: "stack",
  },
];

export function getPathBySlug(slug: string): PathDefinition | undefined {
  return INVESTMENT_PATHS.find((p) => p.slug === slug);
}
