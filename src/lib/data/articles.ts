/**
 * Magazine (§3/§22). PLACEHOLDER DATA — mirrors the CMS `Article` model.
 * Every article must link to the investment path it belongs to: the blog
 * is an SEO entry into the path selector, never a dead end.
 */

export const CATEGORIES = [
  "Jak investovat",
  "Financování",
  "Pronájem",
  "Rekonstrukce",
  "Lokality",
  "Daně a legislativa",
  "Investiční strategie",
] as const;

export type ArticleCategory = (typeof CATEGORIES)[number];

export interface Article {
  slug: string;
  title: string;
  category: ArticleCategory;
  perex: string;
  author: string;
  publishedAt: string;
  readingMinutes: number;
  relatedPath: { label: string; href: string };
  body: { heading: string; paragraphs: string[] }[];
}

export const ARTICLES: Article[] = [
  {
    slug: "jak-zacit-investovat-do-nemovitosti",
    title: "Jak začít investovat do nemovitostí, když kupujete první byt",
    category: "Jak investovat",
    perex:
      "První investiční byt se nevybírá podle toho, jestli by se v něm dalo bydlet. Rozhoduje propočet, likvidita a horizont.",
    author: "Redakce Vynosium",
    publishedAt: "2026-02-11",
    readingMinutes: 6,
    relatedPath: { label: "Zhodnocení kapitálu", href: "/zhodnoceni-kapitalu" },
    body: [
      {
        heading: "Nejdřív horizont, potom nemovitost",
        paragraphs: [
          "Otázka nezní „jaký byt koupit“, ale „kdy budu peníze potřebovat zpět“. Horizont určuje typ nemovitosti, výši financování i to, jestli dává smysl rekonstrukce.",
          "Investor s pětiletým horizontem hledá jinou nemovitost než ten, kdo staví majetek na dvacet let. Zaměnit tyto dvě situace je nejčastější chyba prvního nákupu.",
        ],
      },
      {
        heading: "Čistý výnos, ne hrubý",
        paragraphs: [
          "Hrubý výnos je nájemné dělené kupní cenou. Neobsahuje neobsazenost, správu, daň, opravy ani poplatky spojené s koupí.",
          "Rozdíl mezi hrubým a čistým výnosem bývá 1,5 až 2,5 procentního bodu. U investice za 6 milionů korun jde o desítky tisíc ročně.",
        ],
      },
      {
        heading: "Likvidita je součást rizika",
        paragraphs: [
          "Nemovitost není účet. Prodej trvá měsíce a v horším trhu déle. Proto do investice nepatří peníze, které mohou být potřeba nečekaně.",
        ],
      },
    ],
  },
  {
    slug: "financovani-investicniho-bytu-hypotekou",
    title: "Financování investičního bytu: jak páka mění výnos i riziko",
    category: "Financování",
    perex:
      "Úvěr zvyšuje výnos z vlastního kapitálu, ale zároveň zvyšuje citlivost na neobsazenost a růst sazeb. Obojí patří do modelu.",
    author: "Redakce Vynosium",
    publishedAt: "2026-01-28",
    readingMinutes: 7,
    relatedPath: { label: "Pasivní příjem", href: "/pasivni-prijem" },
    body: [
      {
        heading: "Co dělá páka s výnosem",
        paragraphs: [
          "Při 50% financování vložíte polovinu kapitálu, ale zhodnocení se počítá z celé hodnoty nemovitosti. Výnos z vlastního kapitálu tak roste.",
          "Stejný mechanismus působí i opačně. Pokles hodnoty se promítne do vlastního kapitálu dvojnásobně.",
        ],
      },
      {
        heading: "Kde je hranice",
        paragraphs: [
          "Nad 70 % LTV se model stává citlivým na výpadek nájmu — splátka nezmizí, příjem ano. Proto v kalkulačce nad touto hranicí zobrazujeme upozornění.",
        ],
      },
      {
        heading: "Sazba a fixace",
        paragraphs: [
          "Délka fixace by měla odpovídat horizontu investice. Krátká fixace u dlouhé držby přenáší úrokové riziko přímo do cashflow.",
        ],
      },
    ],
  },
  {
    slug: "dlouhodoby-pronajem-vs-kratkodoby",
    title: "Dlouhodobý nebo krátkodobý pronájem: co skutečně zbyde",
    category: "Pronájem",
    perex:
      "Krátkodobý pronájem vykazuje vyšší hrubý výnos. Po odečtení provozu, obsazenosti a regulace bývá rozdíl podstatně menší.",
    author: "Redakce Vynosium",
    publishedAt: "2026-01-14",
    readingMinutes: 5,
    relatedPath: { label: "Pasivní příjem", href: "/pasivni-prijem" },
    body: [
      {
        heading: "Provozní náročnost",
        paragraphs: [
          "Krátkodobý pronájem je provoz, ne investice. Úklid, komunikace, obměna hostů a sezónnost tvoří náklad, který dlouhodobý pronájem nemá.",
        ],
      },
      {
        heading: "Regulace",
        paragraphs: [
          "Podmínky se liší podle města i podle domu. Souhlas SVJ a místní regulace mohou model změnit ze dne na den.",
        ],
      },
    ],
  },
  {
    slug: "rekonstrukce-ktera-zvysi-hodnotu",
    title: "Rekonstrukce, která zvýší hodnotu — a ta, která jen stojí peníze",
    category: "Rekonstrukce",
    perex:
      "Ne každá investovaná koruna se vrací. Rozhoduje dispozice, stav rozvodů a to, co v dané lokalitě kupující skutečně ocení.",
    author: "Redakce Vynosium",
    publishedAt: "2025-12-09",
    readingMinutes: 6,
    relatedPath: { label: "Zhodnotit byt", href: "/zhodnotit-byt" },
    body: [
      {
        heading: "Dispozice před povrchy",
        paragraphs: [
          "Přesun jedné příčky může přidat pokoj a posunout byt do jiného cenového segmentu. Nová kuchyňská linka to nedokáže.",
        ],
      },
      {
        heading: "Rozpočet vzniká před koupí",
        paragraphs: [
          "Rozpočet po koupi je odhad ceny, kterou musíte zaplatit. Rozpočet před koupí je podmínka, za které kupujete.",
        ],
      },
    ],
  },
  {
    slug: "jak-vybrat-lokalitu",
    title: "Jak vybrat lokalitu podle dat, ne podle pocitu",
    category: "Lokality",
    perex:
      "Doba inzerce, obsazenost a poměr nabídky k poptávce řeknou o lokalitě víc než plán rozvoje na dvacet let dopředu.",
    author: "Redakce Vynosium",
    publishedAt: "2025-11-20",
    readingMinutes: 5,
    relatedPath: { label: "Investiční příležitosti", href: "/investicni-prilezitosti" },
    body: [
      {
        heading: "Tři ukazatele, které stačí",
        paragraphs: [
          "Průměrná doba inzerce, podíl nabídky k počtu domácností a vývoj nájemného za posledních 24 měsíců.",
          "Pokud lokalita neobstojí ve všech třech, plán rozvoje na tom nic nezmění.",
        ],
      },
    ],
  },
  {
    slug: "zdaneni-prijmu-z-najmu",
    title: "Zdanění příjmu z nájmu: fyzická nebo právnická osoba",
    category: "Daně a legislativa",
    perex:
      "Volba formy vlastnictví ovlivní výnos víc než vyjednaná sleva z kupní ceny. Rozhodovat by se mělo před koupí.",
    author: "Redakce Vynosium",
    publishedAt: "2025-10-30",
    readingMinutes: 8,
    relatedPath: { label: "Budování majetku", href: "/budovani-majetku" },
    body: [
      {
        heading: "Co rozhoduje",
        paragraphs: [
          "Počet nemovitostí, horizont držby, plán reinvestic a to, zda příjem potřebujete vyplácet, nebo jej necháváte v podnikání.",
          "Tento text je obecný přehled, ne daňové poradenství. Konkrétní řešení patří k daňovému poradci.",
        ],
      },
    ],
  },
  {
    slug: "kdy-prodat-investicni-nemovitost",
    title: "Kdy prodat investiční nemovitost",
    category: "Investiční strategie",
    perex:
      "Prodej není odměna za dobré rozhodnutí, ale další rozhodnutí. Rozhoduje výnos z aktuální hodnoty, ne z pořizovací ceny.",
    author: "Redakce Vynosium",
    publishedAt: "2025-10-02",
    readingMinutes: 6,
    relatedPath: { label: "Budování majetku", href: "/budovani-majetku" },
    body: [
      {
        heading: "Výnos z tržní hodnoty",
        paragraphs: [
          "Pokud nemovitost vzrostla na hodnotě, klesl její výnos vůči aktuální ceně. To je okamžik, kdy má smysl porovnat držení s prodejem a reinvesticí.",
        ],
      },
    ],
  },
];

export function getArticle(slug: string): Article | undefined {
  return ARTICLES.find((a) => a.slug === slug);
}
