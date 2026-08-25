import type { InvestmentPath } from "@/lib/tokens";
import type { FaqItem } from "@/lib/data/faq";

export const PATH_FAQ: Record<InvestmentPath, FaqItem[]> = {
  flip: [
    {
      q: "Jak dlouho trvá typická rekonstrukce a prodej?",
      a: "Obvykle 6–14 měsíců od nákupu po prodej, podle rozsahu rekonstrukce a rychlosti prodeje. Přesný harmonogram je součástí propočtu ještě před nákupem.",
      defaultOpen: true,
    },
    {
      q: "Kolik vlastního kapitálu potřebuji?",
      a: "Záleží na ceně nemovitosti a zvolené míře financování. V kalkulačce níže si nastavíte vlastní kapitál a hned uvidíte orientační dopad na výnos.",
    },
    {
      q: "Kdo řídí rekonstrukci?",
      a: "Rekonstrukci koordinujeme s prověřenými dodavateli a průběžně vás informujeme o postupu i případných odchylkách od rozpočtu.",
    },
    {
      q: "Co když se nemovitost neprodá za očekávanou cenu?",
      a: "Prodejní cena se vždy odvíjí od aktuální tržní situace. Proto uvádíme rozpětí očekávaného výnosu, ne jedno pevné číslo, a scénář nikdy negarantujeme.",
    },
    {
      q: "Mohu podobný projekt zopakovat?",
      a: "Ano, řada investorů u nás rekonstrukce opakuje. Po prvním dokončeném projektu vám rádi nabídneme další odpovídající příležitost.",
    },
  ],
  income: [
    {
      q: "Kdo se stará o nájemníky a údržbu?",
      a: "Správu nemovitosti — komunikaci s nájemníky i běžnou údržbu — pro vás můžeme zajistit my, pokud o to budete mít zájem.",
      defaultOpen: true,
    },
    {
      q: "Co když nemovitost zůstane bez nájemníka?",
      a: "Neobsazenost je běžné tržní riziko, se kterým v propočtu počítáme. Lokalitu vybíráme mimo jiné s ohledem na poptávku po pronájmu.",
    },
    {
      q: "Jaký výnos mohu z pronájmu očekávat?",
      a: "Orientační výnos z pronájmu se u aktuálních příležitostí pohybuje řádově mezi 5–7 % p.a., vždy jako modelová hodnota, ne garance.",
    },
    {
      q: "Je nutné využít hypotéku?",
      a: "Ne, lze investovat i jen z vlastních prostředků. Financování může zvýšit výnos vlastního kapitálu, ale zvyšuje i riziko.",
    },
    {
      q: "Jak často dostávám přehled o cashflow?",
      a: "Pravidelný přehled příjmů a nákladů dostáváte v rámci správy nemovitosti — rozsah reportingu si nastavíme podle vašich preferencí.",
    },
  ],
  capital: [
    {
      q: "Proč nemovitost místo jiných investičních nástrojů?",
      a: "Nemovitost je hmotné aktivum s potenciálem růstu hodnoty i pravidelného příjmu, které nekoreluje 1:1 s kapitálovými trhy.",
      defaultOpen: true,
    },
    {
      q: "Na jak dlouho mám kapitál vázat?",
      a: "Typický horizont pro zhodnocení kapitálu je 3–5 let. Kratší i delší horizont lze zvolit v kalkulačce, výnos se podle toho mění.",
    },
    {
      q: "Jaké je riziko poklesu hodnoty?",
      a: "Hodnota nemovitosti se může v čase snížit stejně jako zvýšit. Proto v kalkulačce ukazujeme i konzervativnější scénář (P10), ne jen ten nejpravděpodobnější.",
    },
    {
      q: "Mohu kapitál v případě potřeby dříve vybrat?",
      a: "Nemovitost lze prodat i dříve, výnos se ale odvíjí od aktuální tržní situace v okamžiku prodeje.",
    },
    {
      q: "Jak vybíráte lokality s růstovým potenciálem?",
      a: "Sledujeme plánovaný rozvoj infrastruktury, zaměstnavatelů a poptávky po bydlení v dané lokalitě, ne jen aktuální cenu.",
    },
  ],
  wealth: [
    {
      q: "Jak portfolio postupně rozšiřovat?",
      a: "Po první nemovitosti vám na základě vývoje cashflow a hodnoty portfolia navrhneme, kdy a jakou další příležitost přidat.",
      defaultOpen: true,
    },
    {
      q: "Je lepší více menších jednotek, nebo jedna velká?",
      a: "Více menších jednotek rozkládá riziko mezi více nájemníků a lokalit. Volba závisí na vašem kapitálu a preferencích.",
    },
    {
      q: "Jak se portfolio spravuje v čase?",
      a: "Nabízíme průběžnou správu všech nemovitostí v portfoliu, včetně konsolidovaného přehledu výnosů a nákladů.",
    },
    {
      q: "Jaký je dlouhodobý horizont budování portfolia?",
      a: "Typicky roky, ne měsíce — portfolio se buduje postupně podle dostupného kapitálu a tržních příležitostí.",
    },
    {
      q: "Pomůžete i s financováním dalších nemovitostí?",
      a: "Ano, pomůžeme nastavit strukturu financování odpovídající aktuálnímu stavu portfolia a vašim cílům.",
    },
  ],
};
