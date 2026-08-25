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
  totalInvestment: string;
  expectedRent?: string;
  expectedYield: string;
  horizon: string;
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
    totalInvestment: "7 400 000 Kč",
    expectedYield: "19–23 %ᴹ",
    horizon: "8–12 měs.",
  },
  {
    slug: "smichov-investicni-byt",
    name: "Smíchov — investiční byt",
    location: "Praha 5",
    strategy: "income",
    status: "open",
    purchasePrice: "5 100 000 Kč",
    totalInvestment: "5 450 000 Kč",
    expectedRent: "18 500 Kč / měs.",
    expectedYield: "5,4 % p.a.ᴹ",
    horizon: "dlouhodobě",
  },
  {
    slug: "brno-kralovo-pole",
    name: "Brno — Královo Pole",
    location: "Brno",
    strategy: "capital",
    status: "last-units",
    purchasePrice: "4 300 000 Kč",
    totalInvestment: "4 900 000 Kč",
    expectedYield: "9–11 % p.a.ᴹ",
    horizon: "3–5 let",
  },
  {
    slug: "portfolio-ostrava-2",
    name: "Portfolio Ostrava — 2 jednotky",
    location: "Ostrava",
    strategy: "wealth",
    status: "open",
    purchasePrice: "6 900 000 Kč",
    totalInvestment: "7 600 000 Kč",
    expectedRent: "24 000 Kč / měs.",
    expectedYield: "6,1 % p.a.ᴹ",
    horizon: "dlouhodobě",
  },
  {
    slug: "zizkov-rekonstrukce",
    name: "Žižkov — rekonstrukce 2+1",
    location: "Praha 3",
    strategy: "flip",
    status: "closed",
    purchasePrice: "4 800 000 Kč",
    totalInvestment: "5 700 000 Kč",
    expectedYield: "21 %ᴹ",
    horizon: "9 měs.",
  },
  {
    slug: "plzen-novostavba",
    name: "Plzeň — novostavba 2+kk",
    location: "Plzeň",
    strategy: "income",
    status: "upcoming",
    purchasePrice: "4 600 000 Kč",
    totalInvestment: "4 850 000 Kč",
    expectedRent: "15 000 Kč / měs.",
    expectedYield: "4,8 % p.a.ᴹ",
    horizon: "dlouhodobě",
  },
];
