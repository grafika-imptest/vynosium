import type { InvestmentPath } from "@/lib/tokens";

/**
 * MOCK DATA — no real listings supplied. Structure matches design.md §6
 * CMS model (Project) so swapping in real content later is a data-only
 * change, not a component rewrite.
 */
export type ProjectStatus = "open" | "last-units" | "closed" | "upcoming";

export type Project = {
  slug: string;
  name: string;
  location: string;
  strategy: InvestmentPath;
  status: ProjectStatus;
  featured?: boolean;
  purchasePrice: string;
  renovationCost?: string;
  totalInvestment: string;
  investmentSize: number; // CZK, for min-capital filtering
  expectedRent?: string;
  expectedYield: string;
  yieldValue: number; // percent, for sorting
  estimatedValueAfter?: string;
  appreciationPotential?: string;
  horizon: string;
  thesis: string[];
  locationText: string;
  financingNote: string;
};

export const PROJECT_STATUS_LABEL: Record<ProjectStatus, string> = {
  open: "Otevřeno",
  "last-units": "Poslední podíly",
  closed: "Uzavřeno",
  upcoming: "Připravujeme",
};

export const PROJECTS: Project[] = [
  {
    slug: "vinohrady-byt-3kk",
    name: "Vinohrady — byt 3+kk",
    location: "Praha 2",
    strategy: "flip",
    status: "open",
    featured: true,
    purchasePrice: "6 200 000 Kč",
    renovationCost: "1 100 000 Kč",
    totalInvestment: "7 400 000 Kč",
    investmentSize: 7_400_000,
    expectedYield: "19–23 %ᴹ",
    yieldValue: 21,
    estimatedValueAfter: "9 100 000 Kčᴹ",
    appreciationPotential: "23 %ᴹ",
    horizon: "8–12 měs.",
    thesis: [
      "Byt v původním stavu v žádané lokalitě Vinohrad kupujeme pod tržní cenou díky rychlému uzavření obchodu bez řetězce.",
      "Rekonstrukce cílí na dispoziční úpravu a standard odpovídající aktuální poptávce v lokalitě — kuchyň, koupelna, podlahy, elektroinstalace.",
      "Po dokončení plánujeme prodej investorovi nebo koncovému kupci hledajícímu bydlení v hotovém stavu.",
    ],
    locationText:
      "Vinohrady patří dlouhodobě mezi nejstabilnější pražské lokality s vysokou poptávkou po bydlení i pronájmu, výbornou občanskou vybaveností a dostupností MHD.",
    financingNote: "Možné financování až do 70 % LTV; vlastní kapitál od cca 2,2 mil. Kč.",
  },
  {
    slug: "smichov-investicni-byt",
    name: "Smíchov — investiční byt",
    location: "Praha 5",
    strategy: "income",
    status: "open",
    purchasePrice: "5 100 000 Kč",
    totalInvestment: "5 450 000 Kč",
    investmentSize: 5_450_000,
    expectedRent: "18 500 Kč / měs.",
    expectedYield: "5,4 % p.a.ᴹ",
    yieldValue: 5.4,
    horizon: "dlouhodobě",
    thesis: [
      "Menší byt 2+kk v docházkové vzdálenosti od stanice metra, typický profil pro dlouhodobý pronájem jednotlivcům i párům.",
      "Nájemní poptávka v lokalitě dlouhodobě převyšuje nabídku srovnatelných bytů.",
      "Po zaplnění nájmu je nemovitost spravovaná — komunikaci s nájemníkem i běžnou údržbu řešíme za vás.",
    ],
    locationText:
      "Smíchov je dobře napojen na centrum i větší zaměstnavatele, s rostoucí občanskou vybaveností podél nábřeží.",
    financingNote: "Doporučené LTV do 60 % pro stabilní měsíční cashflow.",
  },
  {
    slug: "brno-kralovo-pole",
    name: "Brno — Královo Pole",
    location: "Brno",
    strategy: "capital",
    status: "last-units",
    purchasePrice: "4 300 000 Kč",
    totalInvestment: "4 900 000 Kč",
    investmentSize: 4_900_000,
    expectedYield: "9–11 % p.a.ᴹ",
    yieldValue: 10,
    estimatedValueAfter: "5 600 000 Kčᴹ",
    appreciationPotential: "14 %ᴹ",
    horizon: "3–5 let",
    thesis: [
      "Byt v rozvíjející se části Králova Pole s plánovaným rozšířením technologického parku v okolí.",
      "Kombinace mírné rekonstrukce a pronájmu vysokoškolským studentům a mladým profesionálům.",
      "Střednědobý horizont umožňuje těžit jak z cashflow, tak z očekávaného růstu hodnoty lokality.",
    ],
    locationText: "Královo Pole těží z blízkosti univerzitních kampusů a rostoucí koncentrace IT firem.",
    financingNote: "Financování do 65 % LTV, poslední volné podíly v tomto kole.",
  },
  {
    slug: "portfolio-ostrava-2",
    name: "Portfolio Ostrava — 2 jednotky",
    location: "Ostrava",
    strategy: "wealth",
    status: "open",
    purchasePrice: "6 900 000 Kč",
    totalInvestment: "7 600 000 Kč",
    investmentSize: 7_600_000,
    expectedRent: "24 000 Kč / měs.",
    expectedYield: "6,1 % p.a.ᴹ",
    yieldValue: 6.1,
    horizon: "dlouhodobě",
    thesis: [
      "Dvě menší bytové jednotky ve stejné budově, pořízené jako základ rozšiřitelného portfolia.",
      "Diverzifikace rizika mezi dvěma nájemníky namísto jednoho, s prostorem pro postupné přikupování dalších jednotek.",
      "Vhodné pro investora, který chce postupně budovat portfolio spíše než jednu velkou pozici.",
    ],
    locationText: "Lokalita s nižší vstupní cenou a stabilní nájemní poptávkou vůči pořizovacím nákladům.",
    financingNote: "Lze financovat jednotky samostatně nebo jako jeden celek, LTV do 70 %.",
  },
  {
    slug: "zizkov-rekonstrukce",
    name: "Žižkov — rekonstrukce 2+1",
    location: "Praha 3",
    strategy: "flip",
    status: "closed",
    purchasePrice: "4 800 000 Kč",
    renovationCost: "900 000 Kč",
    totalInvestment: "5 700 000 Kč",
    investmentSize: 5_700_000,
    expectedYield: "21 %ᴹ",
    yieldValue: 21,
    estimatedValueAfter: "6 900 000 Kčᴹ",
    appreciationPotential: "21 %ᴹ",
    horizon: "9 měs.",
    thesis: [
      "Byt v činžovním domě na Žižkově prošel kompletní rekonstrukcí v horizontu devíti měsíců.",
      "Realizovaný projekt slouží jako referenční příklad — viz případová studie v sekci Reference.",
    ],
    locationText: "Žižkov nabízí kombinaci dostupnějších cen a rostoucí atraktivity mezi mladšími kupci.",
    financingNote: "Projekt je uzavřený, financování se u nových kol může lišit.",
  },
  {
    slug: "plzen-novostavba",
    name: "Plzeň — novostavba 2+kk",
    location: "Plzeň",
    strategy: "income",
    status: "upcoming",
    purchasePrice: "4 600 000 Kč",
    totalInvestment: "4 850 000 Kč",
    investmentSize: 4_850_000,
    expectedRent: "15 000 Kč / měs.",
    expectedYield: "4,8 % p.a.ᴹ",
    yieldValue: 4.8,
    horizon: "dlouhodobě",
    thesis: [
      "Byt v připravované novostavbě s nízkými budoucími náklady na údržbu a energie.",
      "Vhodné pro investora preferujícího nový standard bydlení bez nutnosti rekonstrukce.",
    ],
    locationText: "Lokalita s dobrou dopravní dostupností centra Plzně a rostoucí nabídkou občanské vybavenosti.",
    financingNote: "Předprodej — podmínky financování budou upřesněny před dokončením výstavby.",
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return PROJECTS.find((p) => p.slug === slug);
}
