import type { InvestmentPath } from "@/lib/tokens";

/**
 * Investment opportunities (§3/09, §15).
 *
 * PLACEHOLDER DATA — mirrors the CMS `Project` model field for field, so
 * swapping this array for a CMS query needs no component changes. Metrics
 * flagged `model: true` render with the ᴹ mark.
 */

export type ProjectStatus = "open" | "last" | "closed" | "prepared";

export const STATUS_LABEL: Record<ProjectStatus, string> = {
  open: "Otevřeno",
  last: "Poslední podíly",
  closed: "Uzavřeno",
  prepared: "Připravujeme",
};

export interface ProjectMetric {
  label: string;
  value: string;
  /** Model / expected value → gets the ᴹ mark and the legend below. */
  model?: boolean;
  /** Highlighted as the headline yield of the card. */
  emphasis?: boolean;
}

export interface Project {
  slug: string;
  name: string;
  location: string;
  region: string;
  strategy: InvestmentPath;
  status: ProjectStatus;
  minCapital: number;
  featured?: boolean;
  summary: string;
  /** Duotone placeholder gradient stops until real photography lands. */
  imageFrom: string;
  imageTo: string;
  metrics: ProjectMetric[];
  thesis: string[];
  locationNotes: { title: string; text: string }[];
  scenario: { node: string; amount: string; time: string }[];
  financing: { label: string; value: string }[];
  gallery: { caption: string; kind: "foto" | "vizualizace" | "půdorys" }[];
}

export const PROJECTS: Project[] = [
  {
    slug: "vinohrady-byt-3kk",
    name: "Vinohrady — byt 3+kk",
    location: "Praha 2, Vinohrady",
    region: "Praha",
    strategy: "flip",
    status: "open",
    minCapital: 1_500_000,
    featured: true,
    summary:
      "Cihlový dům z roku 1928, byt v původním stavu ve druhém patře. Rekonstrukce v rozsahu jádra, rozvodů a povrchů.",
    imageFrom: "#16324b",
    imageTo: "#1f8a70",
    metrics: [
      { label: "Kupní cena", value: "9 850 000 Kč" },
      { label: "Investiční náklady", value: "1 840 000 Kč", model: true },
      { label: "Celková investice", value: "12 090 000 Kč", model: true },
      { label: "Hodnota po rekonstrukci", value: "14 300 000 Kč", model: true },
      { label: "Potenciál zhodnocení", value: "18,3 %", model: true, emphasis: true },
      { label: "Investiční horizont", value: "11 měsíců", model: true },
    ],
    thesis: [
      "Byt je nabízen pod cenou srovnatelných rekonstruovaných jednotek v okolí o zhruba 22 %, protože je v původním stavu a majitel řeší dědické vypořádání.",
      "Dům prošel v roce 2021 rekonstrukcí střechy a stoupaček, takže do modelu nevstupují velké společné investice.",
      "Dispozice umožňuje oddělit ložnici bez zásahu do nosných konstrukcí — nejnákladnější položka rekonstrukce tedy odpadá.",
      "Prodej cílí na segment, ve kterém se srovnatelné byty v roce 2025 prodávaly do 90 dnů od inzerce.",
    ],
    locationNotes: [
      { title: "Dostupnost", text: "6 minut pěšky na metro A, tramvaj přímo před domem." },
      { title: "Vybavenost", text: "Kompletní občanská vybavenost v docházkové vzdálenosti, dvě základní školy do 700 m." },
      { title: "Rozvoj", text: "V okolí neprobíhá výstavba, která by rozšířila nabídku srovnatelných bytů." },
      { title: "Poptávka", text: "Průměrná doba inzerce srovnatelných bytů v lokalitě: 68 dnů." },
    ],
    scenario: [
      { node: "Nákup", amount: "9 850 000 Kč", time: "měsíc 0" },
      { node: "Rekonstrukce", amount: "1 840 000 Kč", time: "měsíc 1–5" },
      { node: "Prodej", amount: "14 300 000 Kč", time: "měsíc 8–11" },
      { node: "Modelový výnos", amount: "2 210 000 Kč", time: "po odečtení nákladů" },
    ],
    financing: [
      { label: "Doporučené LTV", value: "50 %" },
      { label: "Vlastní kapitál", value: "6 045 000 Kč" },
      { label: "Model. výnos z kapitálu", value: "26,4 %" },
    ],
    gallery: [
      { caption: "Obývací prostor — původní stav", kind: "foto" },
      { caption: "Vizualizace po rekonstrukci", kind: "vizualizace" },
      { caption: "Půdorys — navrhovaný stav", kind: "půdorys" },
    ],
  },
  {
    slug: "smichov-investicni-byt",
    name: "Smíchov — investiční byt 2+kk",
    location: "Praha 5, Smíchov",
    region: "Praha",
    strategy: "income",
    status: "open",
    minCapital: 900_000,
    summary:
      "Novostavba z roku 2019, byt připravený k okamžitému pronájmu. Nájemní poptávka doložená daty z lokality.",
    imageFrom: "#16324b",
    imageTo: "#2f6fed",
    metrics: [
      { label: "Kupní cena", value: "7 400 000 Kč" },
      { label: "Očekávané nájemné", value: "26 500 Kč / měs.", model: true },
      { label: "Náklady a rezerva", value: "7 400 Kč / měs.", model: true },
      { label: "Orientační výnos", value: "5,6 % p.a.", model: true, emphasis: true },
      { label: "Obsazenost v lokalitě", value: "97 %" },
      { label: "Investiční horizont", value: "5+ let" },
    ],
    thesis: [
      "Byt nevyžaduje žádnou investici před pronájmem — cashflow začíná v prvním měsíci.",
      "Lokalita má stabilní nájemní poptávku danou docházkovou vzdáleností k business parku a k metru B.",
      "Model počítá s jedním měsícem neobsazenosti ročně a s rezervou na opravy ve výši 5 % nájemného.",
    ],
    locationNotes: [
      { title: "Dostupnost", text: "9 minut na metro B, přímé spojení do centra." },
      { title: "Poptávka", text: "Průměrná doba obsazení nájemního bytu v lokalitě: 14 dnů." },
      { title: "Rozvoj", text: "Dokončovaná administrativní budova zvýší v okolí počet pracovních míst." },
    ],
    scenario: [
      { node: "Nákup", amount: "7 400 000 Kč", time: "měsíc 0" },
      { node: "Pronájem", amount: "26 500 Kč / měs.", time: "měsíc 1" },
      { node: "Model. hodnota po 5 letech", amount: "8 690 000 Kč", time: "rok 5" },
    ],
    financing: [
      { label: "Doporučené LTV", value: "60 %" },
      { label: "Vlastní kapitál", value: "2 960 000 Kč" },
      { label: "Model. výnos z kapitálu", value: "7,2 % p.a." },
    ],
    gallery: [
      { caption: "Obývací pokoj", kind: "foto" },
      { caption: "Půdorys bytu", kind: "půdorys" },
    ],
  },
  {
    slug: "brno-kralovo-pole",
    name: "Brno — Královo Pole, 2+1",
    location: "Brno, Královo Pole",
    region: "Brno",
    strategy: "flip",
    status: "last",
    minCapital: 1_200_000,
    summary:
      "Byt v cihlovém domě po částečné rekonstrukci domu. Zásah do dispozice zvýší prodejní hodnotu.",
    imageFrom: "#16324b",
    imageTo: "#1f8a70",
    metrics: [
      { label: "Kupní cena", value: "5 250 000 Kč" },
      { label: "Investiční náklady", value: "1 180 000 Kč", model: true },
      { label: "Hodnota po rekonstrukci", value: "7 600 000 Kč", model: true },
      { label: "Potenciál zhodnocení", value: "16,9 %", model: true, emphasis: true },
      { label: "Investiční horizont", value: "9 měsíců", model: true },
    ],
    thesis: [
      "Cena odpovídá stavu bytu, nikoli stavu domu — dům má po rekonstrukci střechy a fasády.",
      "Přesun kuchyně umožní vytvořit plnohodnotné 3+kk, což je v lokalitě nejžádanější dispozice.",
    ],
    locationNotes: [
      { title: "Dostupnost", text: "Tramvaj do centra 12 minut, blízkost technické univerzity." },
      { title: "Poptávka", text: "Silná poptávka po bytech 3+kk v cenovém pásmu do 8 mil. Kč." },
    ],
    scenario: [
      { node: "Nákup", amount: "5 250 000 Kč", time: "měsíc 0" },
      { node: "Rekonstrukce", amount: "1 180 000 Kč", time: "měsíc 1–4" },
      { node: "Prodej", amount: "7 600 000 Kč", time: "měsíc 7–9" },
    ],
    financing: [
      { label: "Doporučené LTV", value: "45 %" },
      { label: "Vlastní kapitál", value: "3 540 000 Kč" },
      { label: "Model. výnos z kapitálu", value: "22,1 %" },
    ],
    gallery: [
      { caption: "Kuchyně — původní stav", kind: "foto" },
      { caption: "Navrhovaná dispozice", kind: "půdorys" },
    ],
  },
  {
    slug: "plzen-portfolio-3-byty",
    name: "Plzeň — portfolio tří bytů",
    location: "Plzeň, Jižní Předměstí",
    region: "Plzeň",
    strategy: "wealth",
    status: "prepared",
    minCapital: 3_000_000,
    featured: true,
    summary:
      "Tři nájemní jednotky v jednom domě. Společná správa snižuje provozní náklady na jednotku.",
    imageFrom: "#16324b",
    imageTo: "#6d5bd0",
    metrics: [
      { label: "Kupní cena celkem", value: "13 900 000 Kč" },
      { label: "Očekávané nájemné", value: "58 200 Kč / měs.", model: true },
      { label: "Orientační výnos", value: "5,1 % p.a.", model: true, emphasis: true },
      { label: "Počet jednotek", value: "3" },
      { label: "Investiční horizont", value: "10+ let" },
    ],
    thesis: [
      "Tři jednotky v jednom domě znamenají jednu správu, jednoho technika a jedno vyúčtování.",
      "Riziko neobsazenosti je rozložené — výpadek jedné jednotky sníží cashflow o třetinu, ne o celek.",
    ],
    locationNotes: [
      { title: "Dostupnost", text: "10 minut pěšky do centra, tramvajová zastávka před domem." },
      { title: "Poptávka", text: "Stabilní nájemní poptávka daná blízkostí univerzity a nemocnice." },
    ],
    scenario: [
      { node: "Nákup", amount: "13 900 000 Kč", time: "měsíc 0" },
      { node: "Pronájem všech jednotek", amount: "58 200 Kč / měs.", time: "měsíc 1–3" },
      { node: "Model. hodnota po 10 letech", amount: "19 600 000 Kč", time: "rok 10" },
    ],
    financing: [
      { label: "Doporučené LTV", value: "65 %" },
      { label: "Vlastní kapitál", value: "4 865 000 Kč" },
      { label: "Model. výnos z kapitálu", value: "8,4 % p.a." },
    ],
    gallery: [
      { caption: "Dům z ulice", kind: "foto" },
      { caption: "Schéma jednotek", kind: "půdorys" },
    ],
  },
  {
    slug: "ostrava-poruba-1kk",
    name: "Ostrava — Poruba, 1+kk",
    location: "Ostrava, Poruba",
    region: "Ostrava",
    strategy: "capital",
    status: "open",
    minCapital: 600_000,
    summary:
      "Menší jednotka s nízkým vstupem a rychlou likviditou. Vhodné pro první vstup do nemovitostí.",
    imageFrom: "#16324b",
    imageTo: "#f59e0b",
    metrics: [
      { label: "Kupní cena", value: "2 350 000 Kč" },
      { label: "Očekávané nájemné", value: "11 200 Kč / měs.", model: true },
      { label: "Orientační výnos", value: "5,9 % p.a.", model: true, emphasis: true },
      { label: "Investiční horizont", value: "3–7 let" },
    ],
    thesis: [
      "Nízká vstupní cena a široká poptávka po malých jednotkách znamenají kratší dobu prodeje při výstupu.",
      "Byt je po rekonstrukci z roku 2022, v horizontu modelu se nepředpokládá další investice.",
    ],
    locationNotes: [
      { title: "Dostupnost", text: "Tramvaj do centra 18 minut, univerzitní kampus 5 minut." },
      { title: "Poptávka", text: "Nejvyšší nájemní poptávka v regionu v segmentu malých bytů." },
    ],
    scenario: [
      { node: "Nákup", amount: "2 350 000 Kč", time: "měsíc 0" },
      { node: "Pronájem", amount: "11 200 Kč / měs.", time: "měsíc 1" },
      { node: "Model. hodnota po 5 letech", amount: "2 790 000 Kč", time: "rok 5" },
    ],
    financing: [
      { label: "Doporučené LTV", value: "40 %" },
      { label: "Vlastní kapitál", value: "1 410 000 Kč" },
      { label: "Model. výnos z kapitálu", value: "7,6 % p.a." },
    ],
    gallery: [{ caption: "Interiér po rekonstrukci", kind: "foto" }],
  },
  {
    slug: "karlin-loft-2kk",
    name: "Karlín — loft 2+kk",
    location: "Praha 8, Karlín",
    region: "Praha",
    strategy: "flip",
    status: "closed",
    minCapital: 2_000_000,
    summary: "Uzavřený projekt. Ponecháno v přehledu jako doklad realizace.",
    imageFrom: "#16324b",
    imageTo: "#486581",
    metrics: [
      { label: "Kupní cena", value: "8 100 000 Kč" },
      { label: "Investiční náklady", value: "1 560 000 Kč" },
      { label: "Prodejní cena", value: "11 250 000 Kč" },
      { label: "Realizovaný výnos", value: "16,4 %", emphasis: true },
      { label: "Doba realizace", value: "10 měsíců" },
    ],
    thesis: ["Projekt byl uzavřen v roce 2025 a je zde ponechán jako doklad realizace."],
    locationNotes: [{ title: "Dostupnost", text: "Metro B Křižíkova, 4 minuty." }],
    scenario: [
      { node: "Nákup", amount: "8 100 000 Kč", time: "měsíc 0" },
      { node: "Rekonstrukce", amount: "1 560 000 Kč", time: "měsíc 1–6" },
      { node: "Prodej", amount: "11 250 000 Kč", time: "měsíc 10" },
    ],
    financing: [{ label: "Realizované LTV", value: "50 %" }],
    gallery: [{ caption: "Po rekonstrukci", kind: "foto" }],
  },
];

export function getProject(slug: string): Project | undefined {
  return PROJECTS.find((p) => p.slug === slug);
}

export const REGIONS = Array.from(new Set(PROJECTS.map((p) => p.region)));
