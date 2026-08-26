/**
 * Site-wide copy and figures.
 *
 * PLACEHOLDER DATA. Every number below is a stand-in until Vynosium
 * supplies audited figures; each one is rendered with its basis (period /
 * source) and, where it is a model, with the ᴹ mark. Do not publish
 * without replacing these values.
 */

export const SITE = {
  name: "Vynósium",
  legalName: "Vynósium s.r.o.",
  claim: "CHYTRÁ CESTA K VÝNOSŮM",
  tagline: "Investujte do nemovitostí způsobem, který odpovídá vašim cílům.",
  group: "Vynósium je součástí skupiny Real Luxembourg.",
  phone: "+420 000 000 000",
  phoneHref: "tel:+420000000000",
  email: "info@vynosium.cz",
  address: {
    street: "Adresa sídla 000/0",
    city: "Praha",
    zip: "110 00",
    country: "Česká republika",
  },
} as const;

/**
 * §3/02 — four numbers, each with a stated basis.
 *
 * `glue` is a symbol that belongs to the digits and must never be split
 * from them ("+"); `unit` is a word that is set on its own, smaller line
 * so a long unit ("mld. Kč") cannot wrap the number itself.
 */
export const TRUST_NUMBERS = [
  {
    value: 2.4,
    decimals: 1,
    glue: "",
    unit: "mld. Kč",
    label: "Hodnota realizovaných obchodů",
    basis: "kumulativně 2016–2025 · interní evidence",
  },
  {
    value: 64,
    decimals: 0,
    glue: "+",
    unit: "",
    label: "Realizovaných projektů",
    basis: "dokončené projekty k 12/2025",
  },
  {
    value: 9,
    decimals: 0,
    glue: "",
    unit: "let",
    label: "Zkušeností na trhu",
    basis: "od založení 2016",
  },
  {
    value: 96,
    decimals: 0,
    glue: "",
    unit: "%",
    label: "Obsazenost spravovaných nemovitostí",
    basis: "průměr 2025 · portfolio ve správě",
  },
] as const;

/** §3/05 — five reasons, verbatim intent from the brief. */
export const WHY_REAL_ESTATE = [
  {
    title: "Reálné aktivum",
    text: "Nemovitost je hmotný majetek s doložitelnou hodnotou. Lze ji ocenit, pojistit, pronajmout i prodat.",
  },
  {
    title: "Potenciál růstu hodnoty",
    text: "Hodnotu ovlivňuje lokalita, stav a poptávka. Rekonstrukce je jediná páka, kterou má investor plně pod kontrolou.",
  },
  {
    title: "Pravidelný příjem",
    text: "Pronájem generuje měsíční příjem. Rozhodující je čistý výnos po nákladech a neobsazenosti, ne hrubé nájemné.",
  },
  {
    title: "Možnost využití financování",
    text: "Část investice lze pokrýt úvěrem. Páka zvyšuje výnos z vlastního kapitálu — a zároveň riziko.",
  },
  {
    title: "Dlouhodobé budování majetku",
    text: "Reinvestice výnosů umožňuje rozšiřovat portfolio postupně, bez nutnosti jednorázově velkého kapitálu.",
  },
] as const;

/** §3/10 — six arguments, deliberately quiet. */
export const WHY_VYNOSIUM = [
  {
    title: "Investice postavené na číslech",
    text: "Každý projekt má propočet před koupí: náklady, scénáře, výnos, rizika. Bez propočtu nekupujeme.",
  },
  {
    title: "Kompletní servis",
    text: "Výběr, prověření, financování, rekonstrukce, pronájem i prodej vede jeden partner.",
  },
  {
    title: "Ověřené příležitosti",
    text: "Prověřujeme právní stav, technický stav domu i reálnou poptávku v lokalitě. Většinu nabídek vyřadíme.",
  },
  {
    title: "Financování",
    text: "Strukturu úvěru řešíme jako součást investice, ne jako samostatnou agendu po podpisu rezervace.",
  },
  {
    title: "Správa",
    text: "Nájemníci, revize, havárie a vyúčtování jsou naše práce. Investor dostává přehled, ne úkoly.",
  },
  {
    title: "Dlouhodobé partnerství",
    text: "Většina investorů s námi realizuje druhý projekt. To je jediná reference, která má váhu.",
  },
] as const;

/** §3/07 — six steps of the process. */
export const PROCESS_STEPS = [
  {
    index: "01",
    title: "Definujeme váš cíl",
    text: "Určíme horizont, dostupný kapitál, potřebu likvidity a míru rizika, kterou jste ochoten nést.",
    artifact: { label: "Vstupní parametry", rows: [["Horizont", "1–15 let"], ["Kapitál", "od 300 000 Kč"], ["Cíl", "výnos / příjem / majetek"]] },
  },
  {
    index: "02",
    title: "Najdeme příležitost",
    text: "Prověřujeme nabídky na trhu i mimo inzerci. Do užšího výběru postoupí jednotky procent.",
    artifact: { label: "Trychtýř výběru", rows: [["Prověřeno", "180 nabídek"], ["Užší výběr", "12"], ["Realizováno", "1–2"]] },
  },
  {
    index: "03",
    title: "Spočítáme ekonomiku",
    text: "Kupní cena, rekonstrukce, poplatky, financování, daně a scénáře výnosu. Model dostanete písemně.",
    artifact: { label: "Rozpad nákladů", rows: [["Kupní cena", "68 %"], ["Rekonstrukce", "22 %"], ["Poplatky a rezerva", "10 %"]] },
  },
  {
    index: "04",
    title: "Zajistíme realizaci",
    text: "Koupě, financování a rekonstrukce pod jedním vedením. Průběžně vidíte čerpání rozpočtu.",
    artifact: { label: "Harmonogram", rows: [["Koupě", "4–8 týdnů"], ["Rekonstrukce", "10–16 týdnů"], ["Kolaudace a předání", "2 týdny"]] },
  },
  {
    index: "05",
    title: "Nemovitost pronajmeme nebo prodáme",
    text: "Podle strategie a stavu trhu v okamžiku dokončení. Rozhodnutí děláte vy, na základě přepočtu.",
    artifact: { label: "Scénáře", rows: [["Pronájem", "výnos p.a."], ["Prodej", "jednorázový zisk"], ["Kombinace", "držení + prodej"]] },
  },
  {
    index: "06",
    title: "Pokračujeme dál",
    text: "Správa, roční vyhodnocení a plán další akvizice. Portfolio roste podle plánu, ne podle nabídky.",
    artifact: { label: "Roční cyklus", rows: [["Vyhodnocení", "1× ročně"], ["Rozhodnutí", "držet / prodat"], ["Reinvestice", "další akvizice"]] },
  },
] as const;

/** §3/12 — questions in the investor's own language. */
export const FAQ = [
  {
    q: "Kolik vlastních prostředků potřebuji?",
    a: "Model začíná na 300 000 Kč u podílu na projektu a na zhruba 1 200 000 Kč u samostatného investičního bytu s financováním. Konkrétní částku určí typ investice a podmínky banky.",
  },
  {
    q: "Mohu investici financovat hypotékou?",
    a: "Ano. Financování je součástí propočtu od začátku — LTV ovlivňuje výnos z vlastního kapitálu i měsíční cashflow. Strukturu úvěru řešíme s vámi před koupí.",
  },
  {
    q: "Jaká jsou rizika a jak s nimi pracujete?",
    a: "Hlavní rizika jsou neobsazenost, prodloužení rekonstrukce, růst úrokových sazeb a pokles cen. Každý model proto obsahuje i spodní scénář a rezervu v rozpočtu. Výnos negarantujeme.",
    openByDefault: true,
  },
  {
    q: "Kdo se stará o nemovitost po koupi?",
    a: "Správu zajišťujeme my — inzerce, výběr nájemníka, revize, havárie a vyúčtování. Investor dostává pravidelný přehled.",
  },
  {
    q: "Jak vybíráte nájemníky?",
    a: "Prověřujeme bonitu a historii, vyžadujeme kauci a smlouvu na dobu určitou s jasnými podmínkami prodloužení.",
  },
  {
    q: "Kdo řídí rekonstrukci a kdo nese její riziko?",
    a: "Rekonstrukci vede náš projektový tým podle rozpočtu schváleného před koupí. Rozpočet obsahuje rezervu; její čerpání vidíte průběžně.",
  },
  {
    q: "Jak vybíráte investiční příležitosti?",
    a: "Posuzujeme cenu vůči lokalitě, technický stav domu, právní stav a doloženou nájemní poptávku. Do nabídky se dostane jen zlomek prověřených nemovitostí.",
  },
  {
    q: "Jaké výnosy mohu očekávat?",
    a: "Podle strategie modelově 4,8–6,2 % p.a. u pronájmu a 18–24 % za projekt u rekonstrukce a prodeje. Jde o modelové hodnoty, nikoli garanci.",
  },
  {
    q: "Kdy dostanu peníze zpět?",
    a: "U pronájmu měsíčně formou cashflow, jistina se uvolní až prodejem. U rekonstrukce a prodeje jednorázově po prodeji, typicky za 6–14 měsíců.",
  },
  {
    q: "Mohu investovat přes právnickou osobu?",
    a: "Ano. Volba mezi fyzickou a právnickou osobou má daňové dopady, které probereme před podpisem s daňovým poradcem.",
  },
  {
    q: "Jak se počítá zdanění výnosu?",
    a: "Závisí na formě vlastnictví, délce držby a typu příjmu. Model uvádíme před zdaněním a daňový dopad počítáme individuálně.",
  },
  {
    q: "Co když budu chtít z investice vystoupit dřív?",
    a: "Nemovitost lze prodat kdykoli, likvidita ale není okamžitá — počítejte s několika měsíci. Proto horizont určujeme hned na začátku.",
  },
] as const;

export const DISCLAIMERS = {
  general:
    "Uvedené informace jsou obecného charakteru a nepředstavují investiční doporučení. Vynósium negarantuje výnos.",
  calculator:
    "Orientační model. Nejde o garantovaný výsledek ani investiční doporučení.",
  modelValues:
    "Označené hodnoty (ᴹ) jsou modelové nebo očekávané, nikoli historická data.",
  scenario:
    "Modelový výpočet. Skutečný výsledek se může lišit podle vývoje trhu, nákladů a obsazenosti.",
} as const;
