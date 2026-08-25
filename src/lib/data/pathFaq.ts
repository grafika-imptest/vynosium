import type { InvestmentPath } from "@/lib/tokens";

/** Five questions per landing page (§25–29), phrased as the investor asks them. */
export const PATH_FAQ: Record<InvestmentPath, { q: string; a: string }[]> = {
  flip: [
    {
      q: "Jak dlouho je kapitál vázaný?",
      a: "Modelově 6 až 14 měsíců podle rozsahu rekonstrukce a rychlosti prodeje. Harmonogram dostanete před koupí.",
    },
    {
      q: "Co když se byt neprodá za odhadovanou cenu?",
      a: "Model obsahuje i spodní scénář. Pokud trh nabídne lepší nájemní výnos, projekt lze převést do pronájmu.",
    },
    {
      q: "Kdo hlídá rozpočet rekonstrukce?",
      a: "Projektový tým Vynósium. Rozpočet vzniká před koupí a jeho čerpání vidíte průběžně.",
    },
    {
      q: "Mohu projekt financovat úvěrem?",
      a: "Ano, u rekonstrukčních projektů obvykle do 50 % LTV. Vyšší páka zvyšuje výnos i citlivost na prodloužení realizace.",
    },
    {
      q: "Jak se daní zisk z prodeje?",
      a: "Závisí na době držby a formě vlastnictví. Modely uvádíme před zdaněním, daňový dopad počítáme individuálně.",
    },
  ],
  income: [
    {
      q: "Je uváděný výnos hrubý, nebo čistý?",
      a: "Čistý — po odečtení správy, rezervy na opravy a modelové neobsazenosti. Hrubé nájemné neuvádíme jako výnos.",
    },
    {
      q: "Co se stane, když nájemník přestane platit?",
      a: "Kauce pokrývá první výpadek, smlouva obsahuje podmínky ukončení. Model počítá s jedním měsícem neobsazenosti ročně.",
    },
    {
      q: "Kdo řeší havárie a revize?",
      a: "Správa Vynósium. Investor dostává přehled a vyúčtování, ne úkoly.",
    },
    {
      q: "Kolik potřebuji vlastního kapitálu?",
      a: "S financováním modelově od 1 200 000 Kč. Konkrétní částku určí banka podle bonity a typu nemovitosti.",
    },
    {
      q: "Můžu byt kdykoli prodat?",
      a: "Ano, ale likvidita není okamžitá. Počítejte s několika měsíci od rozhodnutí po převod peněz.",
    },
  ],
  capital: [
    {
      q: "Proč nemovitost, a ne konzervativní produkt?",
      a: "Nemovitost je reálné aktivum, které lze ocenit, pronajmout i refinancovat. Za cenu nižší likvidity.",
    },
    {
      q: "Jaký je minimální vstup?",
      a: "Modelově od 600 000 Kč u menších jednotek mimo Prahu, s financováním.",
    },
    {
      q: "Jak rychle se dostanu k penězům?",
      a: "Prodej trvá typicky 2 až 5 měsíců. Proto do investice nepatří prostředky, které mohou být potřeba nečekaně.",
    },
    {
      q: "Chrání nemovitost před inflací?",
      a: "Historicky se nájemné i ceny pohybují s cenovou hladinou. Nejde ale o garanci ani o pravidlo platné v každém období.",
    },
    {
      q: "Dostanu vyhodnocení investice?",
      a: "Jednou ročně: hodnota, výnos, náklady a doporučení držet nebo prodat.",
    },
  ],
  wealth: [
    {
      q: "Kolik nemovitostí dává smysl?",
      a: "Rozhoduje bonita a cashflow, ne počet. Model ukazuje, kdy má další akvizice smysl.",
    },
    {
      q: "Kdy mohu koupit druhou nemovitost?",
      a: "V okamžiku, kdy cashflow a bonita unesou další úvěr. U modelových portfolií to bývá po třech až pěti letech.",
    },
    {
      q: "Jak řešíte financování napříč portfoliem?",
      a: "Struktura úvěrů se plánuje dopředu, aby další akvizice nenarazila na limit bonity.",
    },
    {
      q: "Je vhodnější fyzická, nebo právnická osoba?",
      a: "U tří a více nemovitostí bývá právnická osoba výhodnější. Rozhodnutí patří k daňovému poradci, ne do článku.",
    },
    {
      q: "Lze portfolio předat dál?",
      a: "Ano, struktura vlastnictví se nastavuje s ohledem na předání majetku už při první akvizici.",
    },
  ],
};
