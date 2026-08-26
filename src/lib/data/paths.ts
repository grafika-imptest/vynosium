import type { InvestmentPath } from "@/lib/tokens";

/**
 * The four investment paths (§3/03 + landing pages §25–29).
 *
 * All numbers here are MODEL ranges. Their labels say so in words
 * ("Modelový výnos"), which is what tells the reader they are projections —
 * there is no marker glyph on the site any more.
 * In production this record is fed by the CMS `PathPage` type.
 */

export interface PathDefinition {
  id: InvestmentPath;
  index: string;
  slug: string;
  /** Short label used in nav, chips and badges. */
  label: string;
  /** Card headline — a claim, never a description. */
  claim: string;
  /** Two metrics maximum on a card (§4.2). */
  metrics: { label: string; value: string }[];
  cta: string;
  /** CSS variable suffix: var(--color-path-flip) etc. */
  colorVar: `path-${InvestmentPath}`;
  /** Landing page H1, taken verbatim from the brief. */
  landingH1: string;
  landingLede: string;
  /** Who the strategy fits. */
  profile: string[];
  /** How the strategy works, 3–4 steps. */
  mechanics: { title: string; text: string }[];
  advantages: { title: string; text: string }[];
  /** Model example, fully broken down. */
  example: { label: string; value: string; model?: boolean }[];
}

export const INVESTMENT_PATHS: PathDefinition[] = [
  {
    id: "flip",
    index: "01",
    slug: "zhodnotit-byt",
    label: "Zhodnotit byt",
    claim: "Koupit, rekonstruovat a následně prodat se ziskem.",
    metrics: [
      { label: "Modelový výnos", value: "18–24 %" },
      { label: "Horizont", value: "6–14 měsíců" },
    ],
    cta: "Chci zhodnotit byt",
    colorVar: "path-flip",
    landingH1: "Kupte chytře. Zvyšte hodnotu. Prodejte se ziskem.",
    landingLede:
      "Vyhledáme byt s podhodnocenou cenou, spočítáme ekonomiku rekonstrukce a projekt dovedeme až k prodeji. Vy rozhodujete o číslech, my o realizaci.",
    profile: [
      "Máte volný kapitál od 1 500 000 Kč a chcete ho zhodnotit v kratším horizontu.",
      "Nechcete řešit řemeslníky, rozpočty ani prodej.",
      "Rozhodujete se podle propočtu, ne podle dojmu z prohlídky.",
    ],
    mechanics: [
      {
        title: "Výběr bytu pod tržní cenou",
        text: "Prověřujeme nabídky i mimo inzerci. Do propočtu jde jen byt, u kterého sedí cena, dispozice i stav domu.",
      },
      {
        title: "Rozpočet a harmonogram rekonstrukce",
        text: "Rozpočet vzniká před koupí, ne po ní. Rezerva na neočekávané položky je vždy součástí modelu.",
      },
      {
        title: "Realizace pod jedním dohledem",
        text: "Projekt vede jeden člověk. Průběžně vidíte čerpání rozpočtu i posun harmonogramu.",
      },
      {
        title: "Prodej nebo převedení do pronájmu",
        text: "Pokud trh v okamžiku dokončení nabízí lepší nájemní výnos, model přepočítáme a rozhodnete se znovu.",
      },
    ],
    advantages: [
      { title: "Krátký horizont", text: "Kapitál je vázaný měsíce, ne roky." },
      { title: "Cena vstupu je řízená", text: "Kupujeme jen tehdy, když propočet dává smysl po odečtení všech nákladů." },
      { title: "Rozpad nákladů předem", text: "Vidíte kupní cenu, rekonstrukci, poplatky i daňový dopad před podpisem." },
    ],
    example: [
      { label: "Kupní cena", value: "5 400 000 Kč" },
      { label: "Rekonstrukce", value: "1 250 000 Kč", model: true },
      { label: "Celková investice", value: "6 920 000 Kč", model: true },
      { label: "Odhad prodejní ceny", value: "8 300 000 Kč", model: true },
      { label: "Doba realizace", value: "9 měsíců", model: true },
      { label: "Modelový výnos", value: "19,9 %", model: true },
    ],
  },
  {
    id: "income",
    index: "02",
    slug: "pasivni-prijem",
    label: "Pasivní příjem",
    claim: "Investiční byt, který každý měsíc vydělává.",
    metrics: [
      { label: "Modelový výnos", value: "4,8–6,2 % p.a." },
      { label: "Horizont", value: "5+ let" },
    ],
    cta: "Chci pasivní příjem",
    colorVar: "path-income",
    landingH1: "Investiční byt bez každodenních starostí.",
    landingLede:
      "Vybereme nemovitost s prokazatelnou nájemní poptávkou, zajistíme nájemníka a převezmeme správu. Vy sledujete výnos, ne provoz.",
    profile: [
      "Chcete pravidelný příjem, ne jednorázový zisk.",
      "Nemáte čas na inzerci, prohlídky, opravy a komunikaci s nájemníky.",
      "Zajímá vás čistý výnos po nákladech, ne hrubé nájemné.",
    ],
    mechanics: [
      {
        title: "Lokalita s doloženou poptávkou",
        text: "Vycházíme z dat o obsazenosti a délce inzerce v dané lokalitě, ne z obecného tvrzení o růstu města.",
      },
      {
        title: "Nastavení nájmu",
        text: "Nájemné určuje trh a stav bytu. Model počítá s neobsazeností i s náklady na správu.",
      },
      {
        title: "Výběr nájemníka a smlouva",
        text: "Prověření bonity, kauce, smlouva a předání. Riziková místa řešíme ve smlouvě, ne dodatečně.",
      },
      {
        title: "Správa",
        text: "Havárie, revize, komunikace, vyúčtování. Vy dostáváte přehled, ne úkoly.",
      },
    ],
    advantages: [
      { title: "Příjem, který neřídíte denně", text: "Provoz je náš, výnos váš." },
      { title: "Model počítá s neobsazeností", text: "Výnos uvádíme po odečtení nákladů a rezervy, ne hrubý." },
      { title: "Možnost financování", text: "Vlastní kapitál lze doplnit hypotékou a zvýšit tak výnos na vložený kapitál." },
    ],
    example: [
      { label: "Kupní cena", value: "6 200 000 Kč" },
      { label: "Vlastní kapitál", value: "2 480 000 Kč" },
      { label: "Očekávané nájemné", value: "24 500 Kč / měsíc", model: true },
      { label: "Náklady a rezerva", value: "−6 900 Kč / měsíc", model: true },
      { label: "Splátka financování", value: "−16 100 Kč / měsíc", model: true },
      { label: "Modelový výnos z kapitálu", value: "5,4 % p.a.", model: true },
    ],
  },
  {
    id: "capital",
    index: "03",
    slug: "zhodnoceni-kapitalu",
    label: "Zhodnocení kapitálu",
    claim: "Volný kapitál převedený do reálného aktiva.",
    metrics: [
      { label: "Modelové zhodnocení", value: "6–9 % p.a." },
      { label: "Horizont", value: "3–7 let" },
    ],
    cta: "Chci zhodnotit kapitál",
    colorVar: "path-capital",
    landingH1: "Proměňte volný kapitál v reálné aktivum.",
    landingLede:
      "Peníze na účtu ztrácejí hodnotu tiše. Nemovitost je aktivum, které lze ocenit, pronajmout, financovat i prodat.",
    profile: [
      "Máte kapitál, který nepotřebujete v nejbližších letech.",
      "Chcete aktivum, které vidíte a jehož hodnotu lze doložit.",
      "Nechcete spravovat portfolio cenných papírů ani sledovat trh denně.",
    ],
    mechanics: [
      {
        title: "Definice horizontu a likvidity",
        text: "Nejdřív určíme, kdy peníze budete potřebovat. Teprve pak vybíráme typ nemovitosti.",
      },
      {
        title: "Výběr aktiva",
        text: "Preferujeme byty s širokou poptávkou — takové aktivum se prodává rychleji než specifický objekt.",
      },
      {
        title: "Držení a průběžné vyhodnocení",
        text: "Jednou ročně dostanete přepočet: hodnota, výnos, náklady, doporučení držet nebo prodat.",
      },
    ],
    advantages: [
      { title: "Reálné aktivum", text: "Hodnota je vázaná na nemovitost, ne na tržní sentiment." },
      { title: "Ocenitelnost", text: "Aktivum lze kdykoli ocenit, refinancovat nebo prodat." },
      { title: "Ochrana proti inflaci", text: "Nájemné i ceny se historicky pohybují s cenovou hladinou — bez garance." },
    ],
    example: [
      { label: "Vložený kapitál", value: "4 000 000 Kč" },
      { label: "Model. hodnota po 5 letech", value: "5 180 000 Kč", model: true },
      { label: "Kumulovaný nájemní příjem", value: "742 000 Kč", model: true },
      { label: "Modelové zhodnocení", value: "7,1 % p.a.", model: true },
      { label: "Horizont", value: "5 let" },
    ],
  },
  {
    id: "wealth",
    index: "04",
    slug: "budovani-majetku",
    label: "Budování majetku",
    claim: "Portfolio, které roste po jednotlivých krocích.",
    metrics: [
      { label: "Modelový růst portfolia", value: "5–8 % p.a." },
      { label: "Horizont", value: "10+ let" },
    ],
    cta: "Chci budovat majetek",
    colorVar: "path-wealth",
    landingH1: "Jedna nemovitost může být jen začátek.",
    landingLede:
      "Portfolio nevzniká nákupem, ale plánem. Nastavíme pořadí akvizic, financování a reinvestice tak, aby další byt platil předchozí.",
    profile: [
      "Přemýšlíte v horizontu deseti a více let.",
      "Chcete majetek, který lze předat dál.",
      "Zajímá vás struktura financování napříč více nemovitostmi, ne jednotlivá koupě.",
    ],
    mechanics: [
      {
        title: "Plán akvizic",
        text: "Určíme pořadí nákupů podle kapitálu, bonity a výnosu — ne podle toho, co je zrovna v nabídce.",
      },
      {
        title: "Financování napříč portfoliem",
        text: "Struktura úvěrů se plánuje dopředu, aby další akvizice nenarazila na limit bonity.",
      },
      {
        title: "Reinvestice výnosů",
        text: "Cashflow z prvních nemovitostí tvoří vlastní zdroje pro další. Model ukazuje, kdy to nastane.",
      },
      {
        title: "Průběžná správa portfolia",
        text: "Jednou ročně vyhodnocujeme, která nemovitost drží výnos a která má být prodána.",
      },
    ],
    advantages: [
      { title: "Plán místo nákupů", text: "Každá akvizice má místo v modelu celého portfolia." },
      { title: "Jeden partner", text: "Výběr, financování, rekonstrukce, pronájem i správa pod jednou odpovědností." },
      { title: "Mezigenerační horizont", text: "Struktura vlastnictví se nastavuje s ohledem na předání majetku." },
    ],
    example: [
      { label: "Vstupní kapitál", value: "3 500 000 Kč" },
      { label: "Počet nemovitostí po 10 letech", value: "3", model: true },
      { label: "Model. hodnota portfolia", value: "19 400 000 Kč", model: true },
      { label: "Model. čistý měsíční příjem", value: "38 700 Kč", model: true },
      { label: "Horizont", value: "10 let" },
    ],
  },
];

export function getPath(slug: string): PathDefinition | undefined {
  return INVESTMENT_PATHS.find((p) => p.slug === slug);
}

export function getPathById(id: InvestmentPath): PathDefinition {
  const found = INVESTMENT_PATHS.find((p) => p.id === id);
  if (!found) throw new Error(`Unknown investment path: ${id}`);
  return found;
}
