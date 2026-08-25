import type { InvestmentPath } from "@/lib/tokens";

/** MOCK DATA — placeholder case studies; replace with real, consented project data before launch. */
export type CaseStudyCategory = "rekonstrukce" | "pronajem" | "portfolio";

export const CASE_STUDY_CATEGORY_LABEL: Record<CaseStudyCategory, string> = {
  rekonstrukce: "Rekonstrukce",
  pronajem: "Pronájem",
  portfolio: "Portfolio",
};

export type CaseStudy = {
  slug: string;
  name: string;
  strategy: InvestmentPath;
  category: CaseStudyCategory;
  purchasePrice: string;
  renovationCost: string;
  duration: string;
  result: string;
  outcomeLabel: string;
  outcomeValue: string;
  quote: string;
  description: string;
};

export const CASE_STUDIES: CaseStudy[] = [
  {
    slug: "vinohrady-2plus1",
    name: "Vinohrady, Praha 2 — byt 2+1",
    strategy: "flip",
    category: "rekonstrukce",
    purchasePrice: "4 100 000 Kč",
    renovationCost: "980 000 Kč",
    duration: "7 měsíců",
    result: "Prodej za 6 350 000 Kč",
    outcomeLabel: "Realizovaný zisk",
    outcomeValue: "1 270 000 Kčᴹ",
    quote: "Od nákupu po prodej jsem věděl, na čem jsem — žádná překvapení v rozpočtu.",
    description:
      "Byt v původním stavu prošel kompletní rekonstrukcí dispozice, kuchyně, koupelny a elektroinstalace. Po dokončení byl prodán do sedmi měsíců od nákupu.",
  },
  {
    slug: "karlin-loft",
    name: "Karlín, Praha 8 — loftový byt",
    strategy: "flip",
    category: "rekonstrukce",
    purchasePrice: "5 600 000 Kč",
    renovationCost: "1 350 000 Kč",
    duration: "9 měsíců",
    result: "Prodej za 8 400 000 Kč",
    outcomeLabel: "Realizovaný zisk",
    outcomeValue: "1 450 000 Kčᴹ",
    quote: "Loftový koncept byl riskantnější volba, ale propočet i realizace se vyplatily.",
    description:
      "Průmyslový prostor v Karlíně jsme přestavěli na moderní loftový byt s otevřenou dispozicí, který odpovídá aktuální poptávce v lokalitě.",
  },
  {
    slug: "brno-zabovresky",
    name: "Brno-Žabovřesky — 3+kk",
    strategy: "income",
    category: "pronajem",
    purchasePrice: "3 700 000 Kč",
    renovationCost: "620 000 Kč",
    duration: "6 měsíců",
    result: "Dlouhodobý pronájem",
    outcomeLabel: "Aktuální výnos",
    outcomeValue: "5,8 % p.a.ᴹ",
    quote: "Oceňuji hlavně to, že se o nájemníky nemusím starat sám.",
    description:
      "Byt po mírné rekonstrukci je od uvedení do provozu nepřetržitě pronajatý, správu včetně komunikace s nájemníky zajišťuje Vynósium.",
  },
  {
    slug: "ostrava-privoz",
    name: "Ostrava-Přívoz — byt 2+kk",
    strategy: "capital",
    category: "rekonstrukce",
    purchasePrice: "2 900 000 Kč",
    renovationCost: "410 000 Kč",
    duration: "4 roky drženo",
    result: "Aktuální odhad 3 950 000 Kč",
    outcomeLabel: "Zhodnocení kapitálu",
    outcomeValue: "19 %ᴹ",
    quote: "Vsadili jsme na rozvoj lokality a zatím se to potvrzuje.",
    description:
      "Byt jsme pořídili s výhledem na plánovaný rozvoj okolí. Po čtyřech letech držení odhadovaná hodnota nemovitosti odpovídá původnímu modelovému scénáři.",
  },
  {
    slug: "portfolio-liberec",
    name: "Liberec — portfolio 3 jednotek",
    strategy: "wealth",
    category: "portfolio",
    purchasePrice: "8 200 000 Kč",
    renovationCost: "1 100 000 Kč",
    duration: "postupně od 2021",
    result: "3 pronajaté jednotky",
    outcomeLabel: "Kombinovaný výnos",
    outcomeValue: "6,4 % p.a.ᴹ",
    quote: "Od jedné jednotky jsme se za tři roky dostali ke třem — přesně jak jsme plánovali.",
    description:
      "Portfolio jsme budovali postupně od jedné jednotky, s reinvesticí cashflow do dalšího nákupu. Všechny tři jednotky jsou dlouhodobě pronajaté.",
  },
];
