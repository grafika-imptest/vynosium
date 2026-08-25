/**
 * Case studies (§3/11, §21). PLACEHOLDER DATA — mirrors the CMS
 * `CaseStudy` model. Realised figures carry no ᴹ mark; anything still
 * projected does.
 */

export type CaseCategory = "rekonstrukce" | "pronajem" | "portfolio";

export const CASE_CATEGORY_LABEL: Record<CaseCategory, string> = {
  rekonstrukce: "Rekonstrukce",
  pronajem: "Pronájem",
  portfolio: "Portfolio",
};

export interface CaseStudy {
  slug: string;
  name: string;
  location: string;
  category: CaseCategory;
  year: string;
  /** One-line result, used as the rail card headline. */
  result: string;
  summary: string;
  ledger: { label: string; value: string }[];
  story: { title: string; text: string }[];
  quote?: { text: string; author: string };
  hasVideo?: boolean;
  /** Duotone placeholders until real before/after photography lands. */
  beforeFrom: string;
  beforeTo: string;
  afterFrom: string;
  afterTo: string;
  relatedPath: string;
}

export const CASE_STUDIES: CaseStudy[] = [
  {
    slug: "vinohrady-2plus1",
    name: "Vinohrady — 2+1 po rekonstrukci",
    location: "Praha 2",
    category: "rekonstrukce",
    year: "2024",
    result: "Zhodnocení 21,4 % za 11 měsíců",
    summary:
      "Byt v původním stavu, kompletní rekonstrukce včetně rozvodů, prodej po jedenácti měsících od nákupu.",
    ledger: [
      { label: "Pořizovací cena", value: "8 400 000 Kč" },
      { label: "Náklady na rekonstrukci", value: "1 620 000 Kč" },
      { label: "Délka realizace", value: "11 měsíců" },
      { label: "Prodejní cena", value: "12 150 000 Kč" },
      { label: "Výsledek projektu", value: "+21,4 %" },
    ],
    story: [
      {
        title: "Výchozí stav",
        text: "Byt nebyl rekonstruovaný od 80. let. Cena odpovídala stavu, dům byl ale po opravě střechy a stoupaček.",
      },
      {
        title: "Zásah",
        text: "Kompletní rozvody, nové jádro, posun příčky mezi kuchyní a obývacím pokojem. Bez zásahu do nosných konstrukcí.",
      },
      {
        title: "Výstup",
        text: "Prodej za 46 dnů od zahájení inzerce, o 3 % nad odhadovanou cenou z modelu.",
      },
    ],
    quote: {
      text: "Nejvíc pro mě znamenalo, že rozpočet z propočtu před koupí seděl i na konci projektu.",
      author: "Investor, Praha",
    },
    hasVideo: true,
    beforeFrom: "#243b53",
    beforeTo: "#486581",
    afterFrom: "#16324b",
    afterTo: "#1f8a70",
    relatedPath: "/zhodnotit-byt",
  },
  {
    slug: "karlin-loft",
    name: "Karlín — loft 2+kk",
    location: "Praha 8",
    category: "rekonstrukce",
    year: "2025",
    result: "Zhodnocení 16,4 % za 10 měsíců",
    summary: "Nákup pod tržní cenou, rekonstrukce v otevřené dispozici, prodej v segmentu s krátkou dobou inzerce.",
    ledger: [
      { label: "Pořizovací cena", value: "8 100 000 Kč" },
      { label: "Náklady na rekonstrukci", value: "1 560 000 Kč" },
      { label: "Délka realizace", value: "10 měsíců" },
      { label: "Prodejní cena", value: "11 250 000 Kč" },
      { label: "Výsledek projektu", value: "+16,4 %" },
    ],
    story: [
      { title: "Výchozí stav", text: "Byt po předchozím nájemci, technicky funkční, ale morálně zastaralý." },
      { title: "Zásah", text: "Povrchy, koupelna, kuchyň, světelný plán. Konstrukční zásahy nebyly nutné." },
      { title: "Výstup", text: "Prodej za 61 dnů, kupující z investičního segmentu." },
    ],
    beforeFrom: "#243b53",
    beforeTo: "#486581",
    afterFrom: "#16324b",
    afterTo: "#1f8a70",
    relatedPath: "/zhodnotit-byt",
  },
  {
    slug: "brno-zabovresky-pronajem",
    name: "Žabovřesky — nájemní byt 2+kk",
    location: "Brno",
    category: "pronajem",
    year: "2023",
    result: "Čistý výnos 5,8 % p.a., obsazenost 100 %",
    summary: "Nákup, drobná úprava dispozice, pronájem do tří týdnů od dokončení. Ve správě od roku 2023.",
    ledger: [
      { label: "Pořizovací cena", value: "5 900 000 Kč" },
      { label: "Náklady na úpravy", value: "310 000 Kč" },
      { label: "Nájemné", value: "22 400 Kč / měsíc" },
      { label: "Obsazenost", value: "100 % (24 měsíců)" },
      { label: "Výsledek projektu", value: "5,8 % p.a. čistého výnosu" },
    ],
    story: [
      { title: "Výchozí stav", text: "Byt po rekonstrukci z roku 2018, nevyžadoval velkou investici." },
      { title: "Zásah", text: "Vestavěné úložné prostory a vybavení, které zkrátilo dobu hledání nájemníka." },
      { title: "Výstup", text: "Nájemník od roku 2023 beze změny, bez výpadku nájemného." },
    ],
    quote: { text: "Za dva roky jsem řešil jednu věc — podpis prodloužení smlouvy.", author: "Investor, Brno" },
    beforeFrom: "#243b53",
    beforeTo: "#486581",
    afterFrom: "#16324b",
    afterTo: "#2f6fed",
    relatedPath: "/pasivni-prijem",
  },
  {
    slug: "plzen-portfolio",
    name: "Plzeň — portfolio dvou bytů",
    location: "Plzeň",
    category: "portfolio",
    year: "2022–2025",
    result: "Druhá akvizice financovaná z cashflow prvního bytu",
    summary:
      "Investor začal jedním bytem. Druhá nemovitost byla pořízena po třech letech, z části z výnosů první.",
    ledger: [
      { label: "Vstupní kapitál", value: "2 700 000 Kč" },
      { label: "Počet nemovitostí", value: "2" },
      { label: "Hodnota portfolia", value: "11 800 000 Kč" },
      { label: "Čistý měsíční příjem", value: "23 100 Kč" },
      { label: "Výsledek projektu", value: "Portfolio bez dalšího vkladu kapitálu" },
    ],
    story: [
      { title: "Výchozí stav", text: "Jeden byt pořízený s 60% financováním v roce 2022." },
      { title: "Zásah", text: "Cashflow reinvestováno, bonita připravena na druhý úvěr v předstihu." },
      { title: "Výstup", text: "Druhá akvizice v roce 2025 bez nutnosti doplnit vlastní kapitál." },
    ],
    beforeFrom: "#243b53",
    beforeTo: "#486581",
    afterFrom: "#16324b",
    afterTo: "#6d5bd0",
    relatedPath: "/budovani-majetku",
  },
  {
    slug: "ostrava-kapital",
    name: "Ostrava — vstup do nemovitostí",
    location: "Ostrava",
    category: "pronajem",
    year: "2024",
    result: "Vstup 1 200 000 Kč, výnos 6,1 % p.a.",
    summary: "První investice klienta. Nízký vstupní kapitál, jednotka s nejkratší dobou obsazení v regionu.",
    ledger: [
      { label: "Pořizovací cena", value: "2 300 000 Kč" },
      { label: "Vlastní kapitál", value: "1 200 000 Kč" },
      { label: "Nájemné", value: "11 000 Kč / měsíc" },
      { label: "Doba do obsazení", value: "9 dnů" },
      { label: "Výsledek projektu", value: "6,1 % p.a. čistého výnosu" },
    ],
    story: [
      { title: "Výchozí stav", text: "Investor bez předchozí zkušenosti s nemovitostmi." },
      { title: "Zásah", text: "Výběr jednotky s nejkratší dobou inzerce v regionu, financování 48 % LTV." },
      { title: "Výstup", text: "Obsazeno do devíti dnů od dokončení přípravy." },
    ],
    beforeFrom: "#243b53",
    beforeTo: "#486581",
    afterFrom: "#16324b",
    afterTo: "#f59e0b",
    relatedPath: "/zhodnoceni-kapitalu",
  },
];

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return CASE_STUDIES.find((c) => c.slug === slug);
}
