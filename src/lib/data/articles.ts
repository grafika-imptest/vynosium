import type { InvestmentPath } from "@/lib/tokens";

/** MOCK DATA — placeholder editorial content; replace before launch. */
export const ARTICLE_CATEGORIES = [
  "Jak investovat",
  "Financování",
  "Pronájem",
  "Rekonstrukce",
  "Lokality",
  "Daně a legislativa",
  "Investiční strategie",
] as const;

export type ArticleCategory = (typeof ARTICLE_CATEGORIES)[number];

export type Article = {
  slug: string;
  title: string;
  /** Shorter <title>-tag text for articles whose full H1 exceeds the ~60-char §6 SEO budget once " | Vynósium" is appended. Falls back to `title`. */
  metaTitle?: string;
  category: ArticleCategory;
  perex: string;
  content: { heading: string; text: string }[];
  relatedPath: InvestmentPath;
  publishedAt: string;
};

export const ARTICLES: Article[] = [
  {
    slug: "jak-zacit-investovat-do-nemovitosti",
    title: "Jak začít investovat do nemovitostí, když máte první volný kapitál",
    metaTitle: "Jak začít investovat do nemovitostí",
    category: "Jak investovat",
    perex:
      "Než vyberete konkrétní nemovitost, vyplatí se ujasnit si cíl — chcete jednorázový zisk, pravidelný příjem, nebo obojí postupně.",
    relatedPath: "capital",
    publishedAt: "2026-02-10",
    content: [
      {
        heading: "Nejdřív cíl, pak nemovitost",
        text: "Investoři často začínají výběrem konkrétního bytu, aniž by si ujasnili, co od investice vlastně očekávají. Cíl — rychlý zisk z rekonstrukce, dlouhodobý příjem z pronájmu, nebo postupné budování portfolia — určuje, jaký typ nemovitosti a lokality dává smysl.",
      },
      {
        heading: "Kolik kapitálu skutečně potřebujete",
        text: "Vstupní kapitál se liší podle míry financování, kterou jste ochotni využít. Vyšší financování zvyšuje modelový výnos vlastního kapitálu, ale zároveň zvyšuje riziko — nad 70 % LTV je potřeba počítat s vyšší citlivostí na výkyvy trhu.",
      },
      {
        heading: "První kroky",
        text: "Doporučujeme začít nezávaznou konzultací, kde probereme kapitál, horizont a cíl, a teprve poté hledat konkrétní příležitost odpovídající zvolené strategii.",
      },
    ],
  },
  {
    slug: "financovani-investicniho-bytu-hypotekou",
    title: "Financování investičního bytu hypotékou — na co si dát pozor",
    metaTitle: "Financování investičního bytu hypotékou",
    category: "Financování",
    perex: "Financování může zvýšit výnos vlastního kapitálu, ale mění i rizikový profil celé investice.",
    relatedPath: "income",
    publishedAt: "2026-01-22",
    content: [
      {
        heading: "Jak financování mění výnos",
        text: "Čím vyšší podíl financování, tím vyšší modelový výnos vlastního kapitálu — protože stejný výnos z nemovitosti se dělí na menší vlastní vklad. Zároveň ale roste citlivost na výpadek nájmu nebo růst úrokových sazeb.",
      },
      {
        heading: "Kde je rozumná hranice",
        text: "V naší kalkulačce upozorňujeme na zvýšenou rizikovost páky nad 70 % LTV. Konzervativnější investoři často volí 40–60 % financování jako kompromis mezi výnosem a stabilitou.",
      },
    ],
  },
  {
    slug: "dlouhodoby-pronajem-vs-kratkodoby",
    title: "Dlouhodobý pronájem vs. rekonstrukce a prodej — co se komu vyplatí",
    metaTitle: "Dlouhodobý pronájem vs. rekonstrukce a prodej",
    category: "Pronájem",
    perex: "Obě strategie mají jiný poměr rizika, výnosu a časové náročnosti — výběr závisí na vašem cíli a kapacitě.",
    relatedPath: "income",
    publishedAt: "2026-01-05",
    content: [
      {
        heading: "Dlouhodobý pronájem",
        text: "Nižší, ale stabilnější a předvídatelnější výnos formou pravidelného cashflow. Vhodné pro investory preferující nižší riziko a dlouhodobý horizont.",
      },
      {
        heading: "Rekonstrukce a prodej",
        text: "Vyšší modelový výnos v kratším horizontu, ale i vyšší riziko spojené s náklady na rekonstrukci a cenou při prodeji.",
      },
    ],
  },
  {
    slug: "na-co-si-dat-pozor-pri-rekonstrukci",
    title: "Na co si dát pozor při rekonstrukci investičního bytu",
    metaTitle: "Rekonstrukce investičního bytu: na co dát pozor",
    category: "Rekonstrukce",
    perex: "Rozpočet, harmonogram a výběr dodavatele rozhodují o tom, jestli se rekonstrukce vyplatí.",
    relatedPath: "flip",
    publishedAt: "2025-12-15",
    content: [
      {
        heading: "Rozpočet s rezervou",
        text: "Do rozpočtu rekonstrukce je vhodné počítat rezervu na neočekávané vícepráce, které se u starších bytů objevují často — zejména u rozvodů a instalací.",
      },
      {
        heading: "Realistický harmonogram",
        text: "Delší harmonogram znamená vyšší náklady na financování po dobu rekonstrukce. Proto plánujeme harmonogram konzervativně už v propočtu.",
      },
    ],
  },
  {
    slug: "jak-vybrat-lokalitu-s-potencialem",
    title: "Jak vybrat lokalitu s růstovým potenciálem",
    category: "Lokality",
    perex: "Cena dnes neříká nic o hodnotě zítra — rozhoduje rozvoj infrastruktury a poptávka po bydlení.",
    relatedPath: "capital",
    publishedAt: "2025-11-28",
    content: [
      {
        heading: "Signály růstového potenciálu",
        text: "Plánovaný rozvoj dopravní infrastruktury, noví zaměstnavatelé v okolí a rostoucí poptávka po nájemním bydlení jsou silnější indikátory budoucí hodnoty než aktuální cena za metr čtvereční.",
      },
    ],
  },
  {
    slug: "dane-z-prijmu-pronajem-nemovitosti",
    title: "Zdanění příjmů z pronájmu nemovitosti — základní přehled",
    metaTitle: "Zdanění příjmů z pronájmu nemovitosti",
    category: "Daně a legislativa",
    perex: "Obecný přehled principů zdanění příjmů z pronájmu — vždy doporučujeme konzultaci s daňovým poradcem.",
    relatedPath: "income",
    publishedAt: "2025-11-10",
    content: [
      {
        heading: "Obecný princip",
        text: "Příjmy z pronájmu nemovitosti podléhají dani z příjmu; konkrétní výpočet záleží na vaší celkové daňové situaci. Tento článek je obecného charakteru a nenahrazuje individuální daňové poradenství.",
      },
    ],
  },
  {
    slug: "budovani-portfolia-nemovitosti-krok-za-krokem",
    title: "Budování portfolia nemovitostí krok za krokem",
    category: "Investiční strategie",
    perex: "Portfolio se nebuduje najednou — klíčové je pořadí kroků a reinvestice cashflow.",
    relatedPath: "wealth",
    publishedAt: "2025-10-20",
    content: [
      {
        heading: "Začněte jednou nemovitostí",
        text: "První nemovitost slouží jako základ — teprve po jejím zaběhnutí a vyhodnocení cashflow dává smysl uvažovat o rozšíření portfolia.",
      },
      {
        heading: "Reinvestice cashflow",
        text: "Pravidelný příjem z první nemovitosti může sloužit jako část kapitálu pro další investici, čímž se portfolio postupně rozšiřuje.",
      },
    ],
  },
];

export function getArticleBySlug(slug: string): Article | undefined {
  return ARTICLES.find((a) => a.slug === slug);
}
