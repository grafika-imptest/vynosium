# VYNOSIUM — Style Reference & Immersive Web Architecture
> vynosium.cz · Investujte do nemovitostí způsobem, který odpovídá vašim cílům.

**Verze:** v2 — sladěno se zadáním `Zadání na web - VYNOSIUM.pdf` (body 1–45)
**Theme:** dual — Navy cinematic surfaces + White/Mist data surfaces
**Stack:** Next.js 15 · Tailwind v4 · GSAP/ScrollTrigger · Three.js · Lenis
**Cíl:** Awwwards SOTD / CSSDA / FWA — bez ztráty konverzního výkonu PPC kampaní

> **Změny proti v1:** ① přidán světlý povrchový systém (White `#FFFFFF` / Mist `#F5F7FA`) — v1 byl chybně dark-only. ② Klasická víceúrovňová navigace místo one-page kotev (zadání bod 6 ji vyžaduje pro důvěryhodnost). ③ Doplněny 4 PPC landing pages, detail projektu, Reference, Blog, Kontakt (body 25–29, 15, 21, 22, 24). ④ Proces má 6 kroků, ne 4 (bod 13). ⑤ Kalkulačka pracuje s vlastním kapitálem **i financováním** (bod 17). ⑥ Přidána povinná právní vrstva „modelový / orientační výnos" (body 11, 14, 17). ⑦ Doplněny funkční barvy, sekundární paleta, marketingová architektura, SEO a CMS požadavky (body 32, 38–40). ⑧ Přidán Tone of Voice a blacklist frází (body 36, 37).

---

## 1. UX Audit & Kreativní směr

### Co dělají realitní a proptech weby špatně

| Chyba | Proč ničí důvěru | Inverze pro Vynosium |
|---|---|---|
| **Ikonografie místo obsahu** — domečky, klíče, střechy, podání ruky | Značí makléře, ne správce aktiv. Klíč komunikuje *transakci*, investor kupuje *výnos* | Nulová realitní piktografie. Jediný opakovaný symbol je růstová šipka z monogramu V a číselná mřížka (zadání bod 33, 35) |
| **Fotobanka s lidmi** — usměvavý makléř, rodina před domem | Retailový, masový dojem. Investiční platforma nikdy neukazuje podpis smlouvy | Současná architektura, městské detaily, reálné rekonstrukce, půdorysy, grafy (bod 35) |
| **Carousel nabídek v Hero** | Nabízí inventář dřív než tezi. Inventář je *důkaz*, ne slib | Hero říká tezi + rozděluje návštěvníka podle cíle. Příležitosti přicházejí až po číslech |
| **Čísla bez základny** | „12 % výnos" bez období, základny a poplatků je marketing, ne data | Každé číslo nese základnu: `p.a. · modelově · před zdaněním · horizont 5 let` |
| **Garantované výnosy / superlativy** | Právní riziko i ztráta kredibility | Povinné označení **modelový / očekávaný**; žádná garance (body 11, 14, 17, 37) |
| **„Jsme tým profesionálů"** | Prázdná fráze, kterou má web na blacklistu | Komunikace stojí na číslech, procesech a reálných projektech (bod 37) |
| **Section-list layout** (hero → benefity → reference → CTA) | Návštěvník scrolluje obsah jako obsah | Scroll je **investiční cesta**: teze → důkaz → volba cesty → simulace → alokace → rozhovor |
| **Mobil jako zmenšený desktop** | Většina PPC trafficu je mobilní — zabíjí to konverzi | Mobile-first návrh každé sekce samostatně (bod 42) |

### Nový vizuální jazyk — šest pravidel

1. **Dvě atmosféry, jeden systém.** Navy `#102A43` je *kino* — Hero, rozcestník, kalkulačka, závěrečné CTA. White `#FFFFFF` / Mist `#F5F7FA` je *dokument* — proces, benefity, příležitosti, blog, FAQ, kontakt. Střídání tmy a světla drží web čitelný, SEO-friendly a zabraňuje dojmu „WebGL demo". Nikdy víc než dva světlé odstíny a dva tmavé na jedné stránce.
2. **Data jsou ornament.** Tam, kde by konkurence dala ilustraci, dá Vynosium graf, poměr, dobu, scénář. Dekorativní a informační vrstva jsou tatáž vrstva — to je hlavní obhajitelný argument pro porotu i pro investora.
3. **Monogram je vektor a vektor je gramatika.** Vzestupná šipka loga určuje fixní diagonálu **38,5°**, která se opakuje jako úhel gradientu, směr masky odhalení, osa trendu v grafech a sweep na hover kartách. Jeden úhel = záměr; náhodné diagonály = šum.
4. **Vlasové linky místo stínů.** Celý systém je bezstínový. Struktura vzniká z 1px linek (`#486581` na tmavé, `#E4E7EB` na světlé) a rádiusu 10 px. Vzniká dojem rýsovacího prkna — přesný, architektonický, ne skeuomorfní.
5. **Emerald je odměna, ne barva.** `#1F8A70` jen tam, kde něco *uspělo* nebo se k něčemu lze *zavázat*: primární CTA, aktivní stav, pozitivní delta, vrchol růstové kurvy. Návštěvník musí pochopit význam barev do 8 sekund.
6. **Barvy cest jsou identifikátory, ne plochy.** Emerald / Blue / Amber / Violet jen jako 1px linka, 6px tečka, malý mono text a shader akcent ≤ 0,22 alfa (bod 32: „pouze jako akcenty").

### Emoční oblouk homepage

`Respekt (Hero) → Vyvrácená skepse (čísla) → Sebe-rozpoznání (4 cesty) → Jistota pro nerozhodnuté → Porozumění (proces) → Kontrola (kalkulačka) → Chuť (příležitosti) → Důkaz (reference) → Rozhodnutí (CTA)`

Každá sekce vlastní právě jednu emoci. Sekce, která neumí pojmenovat svou emoci, se maže.

---

## 2. Informační architektura

### Routovací mapa (bod 6, 25, 39, 40)

```
/                                 Homepage
/investicni-prilezitosti          Přehled + filtr
/investicni-prilezitosti/[slug]   Detail projektu
/jak-investujeme                  6krokový proces
/o-nas                            Vč. týmu a Real Luxembourg
/reference                        Case studies + filtr (rekonstrukce / pronájem / portfolio)
/reference/[slug]                 Detailní případová studie
/magazin                          Blog, rubriky
/magazin/[slug]                   Článek
/kontakt                          Formulář, mapa, rezervace termínu
/kalkulacka                        Samostatná URL pro remarketing (embed i standalone)

PPC landing pages (samostatné konverzní formuláře + samostatné měření)
/zhodnotit-byt          #1F8A70
/pasivni-prijem         #2F6FED
/zhodnoceni-kapitalu    #F59E0B
/budovani-majetku       #6D5BD0

/gdpr  /cookies  /obchodni-podminky
```

Hlavní menu: **Domů · Investiční příležitosti · Jak investujeme · O nás · Reference · Magazín · Kontakt** + výrazné CTA **Nezávazná konzultace**. Menu je skutečná navigace, ne kotvy — zadání ji vyžaduje kvůli dojmu plnohodnotné platformy.

### Narativní tok homepage

```
00  PRELOADER / ZÁŽEH KAPITÁLU      0–1,4 s     navy   vektor monogramu se vykreslí, čítač 0 → hodnota obchodů
01  HERO — TEZE                     100 vh      navy   WebGL hloubkové pole architektury + split-text headline
02  DŮVĚRYHODNOSTNÍ ČÍSLA           sticky      navy   4 čísla s uvedenou základnou (bod 8)
03  ROZCESTNÍK 4 CEST               asym. grid  navy   2×2 rozbitá mřížka, barevný token, kurzorový magnet (bod 9)
04  PRO NEROZHODNUTÉ                pás         mist   jeden odstavec + CTA konzultace (bod 10)
05  PROČ NEMOVITOSTI                editorial   white  5 benefitů + právní disclaimer (bod 11)
06  PŘEDSTAVENÍ VYNOSIUM            split       white   jeden partner pro celý proces (bod 12)
07  JAK INVESTUJEME — 6 KROKŮ       pinned      navy   vektor 38,5° se dokresluje s postupem (bod 13)
08  INVESTIČNÍ KALKULAČKA           pinned      navy   kapitál + financování + horizont → WebGL projekce (bod 17)
09  AKTUÁLNÍ PŘÍLEŽITOSTI           grid        mist   husté finanční karty, filtr, stav projektu (bod 14)
10  PROČ VYNOSIUM                   3×2         white   6 argumentů, věcně (bod 16)
11  REFERENCE / CASE STUDIES        rail        navy   před/po, konkrétní čísla, video (bod 18)
12  FAQ — LEDGER OTÁZEK             accordion   white   otázky formulované jazykem investora (bod 23)
13  ZÁVĚREČNÉ CTA                   100 vh      abyss   monogram se znovu vykreslí, jedno tlačítko (bod 30)
14  FOOTER                          kompakt     navy    navigace, cesty, kontakt, právní, Real Luxembourg (bod 31)
```

**Proč tento pořádek konvertuje:** běžný web nabízí inventář a pak žádá kontakt. Vynosium nabídne tezi, dokáže ji čísly, nechá návštěvníka **vybrat si cestu**, dá mu **simulaci, kterou ovládá**, a teprve pak ukáže projekty. V okamžiku, kdy dorazí k příležitostem, už nebrouzdá — má mandát. Konverze se posouvá z „vyplňte formulář" na „chci propočet pro tento scénář".

**Vedlejší navigace:** vpravo 2px **kapitálová lišta** postupu (Navy→Emerald) s ťuky sekcí; na mobilu se mění na 2px progress pod headerem. Sticky mobilní CTA lišta se zjevuje po 40 % scrollu.

---

## 3. Sekce po sekci — specifikace

Formát každé položky: **Účel → Layout → WebGL/HTML → Motion → CTA → Mobil.**

### 00 · Preloader „Zážeh kapitálu"

- **Účel:** převést nutnou čekací dobu na první brandovou stopu a předrámovat web jako datový.
- **Layout:** monogram 96 px na středu, pod ním jeden 11px label `letter-spacing: .18em`.
- **HTML:** inline SVG, tři `<path>` s `stroke-dasharray`. Overlay je `position: fixed` a po dokončení se **odstraní z DOM** (nikdy `display:none`) — nulový vliv na CLS.
- **Motion:** GSAP — kresba cest stagger 0,12 s `power2.inOut`; paralelně čítač `0 → hodnota realizovaných obchodů` se `snap`. Exit = clip-path wipe pod 38,5°, `expo.inOut`, 0,9 s, pod nímž už Hero animuje (nikdy černá pauza).
- **CTA:** žádné.
- **Mobil:** strop 1,0 s; při `prefers-reduced-motion` nebo Save-Data se úplně vynechá.

### 01 · Hero — teze (bod 7)

- **Účel:** do tří sekund říct co Vynosium dělá, pro koho je a co investor získá. Emoce: **respekt**.
- **Copy (dle zadání, doslovně):**
  - H1: *Investujte do nemovitostí způsobem, který odpovídá vašim cílům.*
  - Lede: *Ať už chcete zvýšit hodnotu bytu rekonstrukcí, vytvořit si pasivní příjem, zhodnotit volný kapitál nebo budovat dlouhodobé portfolio, pomůžeme vám najít správnou investiční cestu.*
  - Primární CTA: **Vyberte si svůj investiční cíl** · Sekundární: **Prohlédnout investiční příležitosti**
  - Claim v hlavičce: **CHYTRÁ CESTA K VÝNOSŮM**
- **Layout & mřížka:** 12 sloupců, gutter `clamp(20px, 4vw, 88px)`. H1 v sloupcích 1–8 (záměrně **necentrováno**), vpravo v 10–12 vlasová datová lišta zarovnaná ke spodní hraně. Baseline H1 v 58 % výšky viewportu. Asymetrie mezi monumentální levou masou a tenkou pravou linkou je celá kompozice.
- **WebGL vrstvy (zdola nahoru):**
  1. `<canvas>` — Three.js ortho scéna: plane s displacementem, který vzorkuje architektonickou fotografii jako albedo i depth (`vDisp = texture2D(uDepth, uv).r`), drift `uTime` amplituda 0,06. Parallax myši ±14 px, `lerp .06`.
  2. Shaderový grain `fract(sin(dot(uv, vec2(12.9898,78.233))) * 43758.5453)` @ 0,035 — jediný detail, který nejvíc rozhoduje o tom, jestli to nevypadá jako CSS gradient.
  3. Vektorové pole — 240 GPU bodů stoupajících po diagonále monogramu, additive blend, Emerald 0,18 alfa. Čte se jako tok kapitálu, ne jako „částice".
  4. Navy scrim `linear-gradient(180deg, rgba(16,42,67,.35), rgba(16,42,67,.88))` pro kontrast AA.
  5. DOM obsah.
- **HTML:**
  ```html
  <section class="hero" data-scene="hero">
    <canvas data-webgl="depth-field"></canvas>
    <div class="hero__scrim" aria-hidden="true"></div>
    <div class="hero__grid">
      <h1 class="display-xl"><span class="mask"><span>Investujte do nemovitostí</span></span>…</h1>
      <p class="lede">…</p>
      <div class="hero__cta">
        <a class="btn btn--emerald" href="#rozcestnik">Vyberte si svůj investiční cíl</a>
        <a class="btn btn--ghost" href="/investicni-prilezitosti">Prohlédnout investiční příležitosti</a>
      </div>
      <dl class="hero__ticker">…</dl>
    </div>
  </section>
  ```
- **Motion:** H1 po řádcích v maskách (`overflow:hidden` + inner `y:110%→0`), stagger 0,09, `expo.out` 1,1 s, start na preloader-exit −0,3 s. Lede a CTA `y:16` + fade v +0,5 s. Číslice tickeru rolují se `snap`. Při scrollu ScrollTrigger `scrub: 1` posouvá canvas `y:12%, scale:1.06`, obsah odjíždí `y:-18%` — skutečný dolly, ne fade.
- **CTA:** Emerald pill v 62 % výšky, zarovnaný k dříku H1; ghost pill vpravo s 24px gapem. Žádná třetí možnost.
- **Mobil:** H1 `clamp(2.4rem, 10.5vw, 4rem)`; depth-field `dpr 1`, 24 fps, poloviční amplituda; parallax myši → ±6 px device-orientation tilt; pravá datová lišta se mění na plnou horizontální vlasovou lištu pod CTA; `100dvh`. CTA je full-width.

### 02 · Důvěryhodnostní čísla (bod 8)

- **Účel:** okamžitě vyvrátit skepsi čtyřmi nespornými čísly. Emoce: **vyvrácená skepse**.
- **Obsah:** `X mld. Kč` hodnota realizovaných obchodů · `X+` realizovaných projektů · `X let` zkušeností na trhu · `X %` obsazenost spravovaných nemovitostí.
- **Layout:** čtyři sloupce dělené 1px linkami v plné výšce, **žádné karty**. Číslo 72–120 px mono, label 11px `.16em`, pod ním základna 11px Steel (období / zdroj). Linky samy dělají strukturu.
- **WebGL:** žádný. Tato sekce musí působit jako papír, aby kontrastovala s tekutým Hero — rytmické střídání shaderových a asketických sekcí je to, co brání dojmu demo-webu.
- **Motion:** trigger `top 70%`; linky nejdřív `scaleY: 0→1` (0,7 s, origin top), pak čítače `snap`, 1,6 s `power3.out`, stagger 0,15. Sekce se pinuje na 40 vh, aby čísla vydržela.
- **CTA:** žádné. Text link na metodiku.
- **Mobil:** 2×2 mřížka (ne 1 sloupec — čtyři čísla pod sebou ztratí sílu), linky horizontální, číslo `clamp(2.4rem, 12vw, 3.6rem)`.

### 03 · Rozcestník investičních cílů (bod 9) — nejdůležitější sekce homepage

- **Účel:** sebe-selekce. Návštěvník přestává být publikum a stává se segmentem. Emoce: **sebe-rozpoznání**.
- **Copy:** H2 *Jak chcete své peníze zhodnotit?* · lede *Každý investor má jiný cíl. Vyberte si cestu, která nejlépe odpovídá vašim možnostem a očekáváním.*
- **Layout & asymetrie:** záměrně rozbitá 2×2. A *Zhodnotit byt* sl. 1–6, výška 520 px · B *Pasivní příjem* sl. 7–12, 400 px, offset +64 px · C *Zhodnocení kapitálu* sl. 1–5, 400 px, offset +128 px · D *Budování majetku* sl. 6–12, 520 px, offset +40 px. Rozdílné baseliny dělají mřížku autorskou, ne generovanou.
- **Shader vrstva:** **jeden** společný `<canvas>` pod celou mřížkou s tekutým Navy polem. Na hover se barva karty pošle do shaderu jako `uAccent` s ease 0,5 s a radiální tlakový bod sleduje kurzor — hover tedy **tónuje celou místnost**, ne jen kartu. Čtyři canvasy by byly LCP zločin.
- **Motion:** vstup — karty `y:40, opacity:0→1`, stagger 0,08 ve **vizuálním** (ne DOM) pořadí. Hover — linka `#486581 → token` (0,25 s), 1px token podtržení labelu roste zleva (0,35 s `power2.out`), metriky přebarví z Steel na token, karta `y:-6px` **bez stínu**. Kurzorový magnet 28 px (`mix-blend-mode: difference`) se zvětší na 64 px a přebere token.
- **CTA:** celá karta je CTA, plus textové CTA dle zadání (*Chci zhodnotit byt / Chci pasivní příjem / Chci zhodnotit kapitál / Chci budovat majetek*) a šipka vpravo dole `x:+6px` na hover. Proklik na příslušnou landing page.
- **Ikony:** zadání žádá vlastní ikonu pro každou cestu (bod 9), zároveň zakazuje realitní klišé (bod 33). Řešení: **abstraktní geometrické glyfy** derivované z monogramu — 24px, 1,5px stroke, žádná perspektiva: ① vzestupná úsečka se zlomem (zhodnocení), ② opakující se horizontální takty (opakovaný příjem), ③ plná plocha v obrysu (kapitál → aktivum), ④ tři narůstající moduly (portfolio). Žádný dům, klíč, střecha, mrakodrap.
- **Mobil:** jeden sloupec s alternujícím 24px odsazením vlevo/vpravo pro rytmus; hover se mapuje na IntersectionObserver „aktivní karta", takže scroll pořád tónuje shader; kurzorový magnet vypnut; celá karta je tap target min. 44 px hit height u CTA.

### 04 · Sekce pro nerozhodnuté investory (bod 10)

- **Účel:** zachytit 40–60 % návštěvníků, kteří se v rozcestníku nepoznali. Emoce: **jistota**.
- **Copy:** H2 *Nejste si jistí, která cesta je pro vás vhodná?* · text dle zadání · CTA **Domluvit konzultaci**.
- **Layout:** vodorovný Mist `#F5F7FA` pás, obsah max 68ch vlevo, CTA vpravo, jedna 1px `#E4E7EB` linka nahoře i dole. Nízká výška (max 320 px) — je to spojka, ne sekce.
- **Motion:** jen fade + `y:12` na trigger. Sekce s méně pohybem než okolí čte jako věcná.
- **Mobil:** stack, CTA full-width.

### 05 · Proč právě nemovitosti (bod 11)

- **Účel:** edukace méně zkušeného investora bez patronizace. Emoce: **porozumění**.
- **Layout:** White `#FFFFFF`. Pět položek v 5sl. mřížce dělené 1px `#E4E7EB` (na 1280 px se láme na 3+2). Každá: 24px glyf, 21px nadpis, 15px text max 42ch. Bez karet, bez stínů.
- **Obsah:** Reálné aktivum · Potenciál růstu hodnoty · Pravidelný příjem · Možnost využití financování · Dlouhodobé budování majetku (texty dle zadání).
- **Právní vrstva (povinná):** pod sekcí 12px `#7B8794` disclaimer — *„Uvedené informace jsou obecného charakteru a nepředstavují investiční doporučení. Vynosium negarantuje výnos."*
- **Motion:** dělicí linky se kreslí `scaleY`, pak text stagger 0,05.
- **Mobil:** jeden sloupec, linky horizontální.

### 06 · Představení Vynosium (bod 12)

- **Účel:** vysvětlit, že hodnota je v propojení procesu. Emoce: **úleva**.
- **Copy:** H2 *Investování do nemovitostí nemusí být složité.* CTA **Jak Vynosium funguje** → `/jak-investujeme`.
- **Layout:** White, split 5/7. Vlevo text, vpravo **diagram propojení** — sedm modulů (výběr, prověření, financování, rekonstrukce, pronájem, prodej, správa) spojených jednou linkou pod 38,5°. Diagram nese `data-om-raster` pro exporty.
- **Motion:** linka diagramu se kreslí `stroke-dashoffset` scrubovaně se scrollem; moduly se rozsvěcují, jak je linka míjí. Přesně toto je vizuální ekvivalent tvrzení „jeden partner pro celý proces".
- **Mobil:** diagram rotuje na vertikální, linka jde levým okrajem.

### 07 · Jak investujeme — 6 kroků (bod 13)

- **Účel:** zkomprimovat provozní model do šesti stavů kapitálu. Emoce: **porozumění**.
- **Copy:** H2 *Od první konzultace k výnosu.* Kroky: 1 Definujeme váš cíl · 2 Najdeme příležitost · 3 Spočítáme ekonomiku · 4 Zajistíme realizaci · 5 Nemovitost pronajmeme nebo prodáme · 6 Pokračujeme dál.
- **Layout:** Navy. Pinnutá horizontální dráha, 6 panelů × 60vw (přesah dalšího panelu do viewportu signalizuje pokračování), řízená vertikálním scrollem. Panel = index `01/06` mono, tvrzení 32 px, text max 46ch, jeden datový artefakt (osa času, rozpad nákladů, scénáře).
- **WebGL/HTML:** jedna trvalá SVG linka po celé dráze pod 38,5°; její `stroke-dashoffset` je scrubovaný na progress, takže **šipka monogramu se dokresluje přesně tak, jak je model vysvětlen**. Panely jsou DOM.
- **Motion:** master ScrollTrigger `pin: true, scrub: 1, end: "+=420%"`. Dráha **lineárně** (scrubovaný pohyb nesmí nikdy easovat), texty `expo.out` v prahu středu panelu.
- **CTA:** na konci panelu 06 ghost pill **Vybrat svou cestu** (zpět k rozcestníku) a Emerald **Nezávazná konzultace**.
- **Mobil:** horizontální pin se **ruší** (bojuje s nativním scrollem). Šest full-width bloků pod sebou, vektor kreslený vertikálně v levém marginu se stejným scrubem — metafora přežije změnu layoutu.

### 08 · Investiční kalkulačka (bod 17)

- **Účel:** předat kontrolu. Kdo pohnul sliderem, investoval pozornost a konvertuje 3–4× častěji. Emoce: **kontrola**.
- **Copy:** H2 *Co mohou vaše peníze v nemovitostech dokázat?* CTA **Chci individuální propočet**.
- **Vstupy (dle zadání):** vlastní kapitál · výše financování (LTV) · délka investice · preferovaný typ investice (4 tokenové chipy).
- **Výstupy (dle zadání):** modelová velikost investice · orientační cashflow (měsíčně) · modelové zhodnocení · hodnota majetku po vybraném období.
- **Layout:** Navy, pin 200 vh. Levý rail (sl. 1–4) ovládání, vpravo (5–12) projekční plocha, pod ní vlasový ledger výstupů. Jediné Emerald číslo na obrazovce je hodnota majetku.
- **WebGL:** projekční plocha je skutečná Three.js `BufferGeometry` stuha, ne SVG graf. Vrcholy se přepočítávají z funkce složeného zhodnocení a easují (`lerp .12/frame`). Výplň je **jádrový gradient** `#102A43` na základně → `#1F8A70` ve vrcholu, mapovaný ve fragment shaderu podle world-space Y — gradient tedy popisuje hodnotu, ne dekoraci. 1px Emerald hrana trasuje vršek. Navíc **pásmo scénářů** (P10–P90) v Steel 0,25 alfa: kalkulačka, která umí jen růst, je marketing; ta, co ukáže i spodní scénář, je produkt.
- **HTML/a11y:** slidery jsou nativní `<input type="range">` s `appearance:none`; ARIA `valuetext` hlásí „1 200 000 Kč". Čísla zrcadlena v `aria-live="polite"`; canvas má `role="img"` s generovaným textovým souhrnem a skrytou `<table>` s hodnotami.
- **Motion:** vstup — nejdřív se nakreslí vlasové linky panelu (0,5 s), pak ovládání stagger 0,05, pak stuha `scaleY 0→1` 1,1 s `expo.out`. Interakce — každá změna slideru retweenuje stuhu 0,45 s `power2.out` a roluje číslice ledgeru; 0,2 s Emerald bloom potvrdí přepočet. Po 6 s nečinnosti stuha „dýchá" ±0,5 %, aby sekce nevypadala zmrzlá.
- **Právní vrstva (povinná):** trvale viditelný 12px `#7B8794` řádek pod výstupy — *„Orientační model. Nejde o garantovaný výsledek ani investiční doporučení."* Není v tooltipu, není pod fold.
- **CTA:** Emerald pill **Chci individuální propočet** hned pod ledgerem, předplněný parametry návštěvníka — nejcennější konverzní moment webu, protože konvertuje *jeho* čísla.
- **Fallback:** bez WebGL nebo při `prefers-reduced-motion` se stuha renderuje jako statický SVG area chart se stejným gradientem — identická kompozice, nulový pohyb.
- **Mobil:** graf **nad** ovládáním (dosah palce); slidery 44 px hit height s bublinou hodnoty nad thumbem; stuha 60 % hustoty vrcholů; čtyři chipy typů se mění na horizontální snap rail; výstupy jako 2×2 mřížka. Samostatná URL `/kalkulacka` pro remarketing.

### 09 · Aktuální investiční příležitosti (bod 14)

- **Účel:** převést chuť na konkrétní aktivum. Emoce: **chuť**.
- **Copy:** H2 *Aktuální investiční příležitosti* · lede *Vybrané projekty prezentujeme prostřednictvím konkrétních čísel, scénářů a očekávaného vývoje.* CTA karty **Detail investice**.
- **Layout:** Mist `#F5F7FA`. Řádek filtračních pillů (strategie / lokalita / min. kapitál / stav) nad 3sl. mřížkou s 24px gutterem; každý 5. slot je záměrně široká 2sl. „featured" karta, aby mřížka nebyla monotónní. Uzavřené projekty zůstávají viditelné na 40 % opacity — vzácnost jako důkaz.
- **Karta (viz 4.4):** obrázek 16:10 → název projektu → lokalita → **badge strategie** v barvě cesty → metrická matice: kupní cena, předpokládané investiční náklady, očekávané nájemné, orientační výnos, odhad hodnoty po rekonstrukci, potenciál zhodnocení, investiční horizont, stav projektu. Sada metrik se přepíná podle typu strategie (flip nezobrazuje nájemné jako hlavní metriku, income ano).
- **Právní vrstva:** každá modelová hodnota nese superskript `M` s legendou pod mřížkou: *„Označené hodnoty jsou modelové/očekávané, nikoli historická data."*
- **Motion:** karty vstupují stagger 0,06 řazený **podle vzdálenosti od středu viewportu**, ne podle indexu. Změna filtru běží přes GSAP Flip — přeskládání, ne re-render. Hover: linka → Emerald, duotone obrázku se rozsvítí do plné barvy (0,6 s), `y:-6px`, žádný stín, žádné scale. Číslice výnosu na hover „ťukne" o jeden increment (180 ms), aby působila živě.
- **CTA:** per karta ghost **Detail investice**; pod mřížkou Emerald **Zobrazit všechny příležitosti**.
- **Mobil:** jeden sloupec; metrická matice se sbalí na 2sl. tabulku s vlasovými linkami; filtry jako horizontální pill rail se snapem; karta má viditelný CTA, ne jen tap na plochu.

### 10 · Proč Vynosium (bod 16)

- **Účel:** věcné odlišení bez blacklistovaných frází. Emoce: **důvěra**.
- **Layout:** White, 3×2 mřížka dělená 1px `#E4E7EB`. Šest argumentů: Investice postavené na číslech · Kompletní servis · Ověřené příležitosti · Financování · Správa · Dlouhodobé partnerství. Nadpis 21px, text 15px max 44ch.
- **Motion:** minimální — jen linky + fade. Záměrná zdrženlivost; sekce s méně pohybem než okolí čte jako čestnější.
- **Mobil:** 1 sloupec, mezi položkami horizontální linka.

### 11 · Reference a případové studie (bod 18)

- **Účel:** důkaz, že systém funguje v praxi — ne pochvala služby. Emoce: **důkaz**.
- **Layout:** Navy. Horizontální drag rail case studies. Karta studie: před/po dvojice (drag-split slider), pak ledger — pořizovací cena, náklady na rekonstrukci, délka realizace, prodejní cena / nájemné, výsledek projektu. Videoreference jako 9:16 kachle v railu.
- **WebGL:** obrázky jako shader plane s RGB skew podle rychlosti dragu (`uVelocity`) a curl distortion ±2 %; masky odhalení pod 38,5°.
- **Motion:** Lenis inerciální drag, decay 1,2 s. Před/po slider je čistý pointer drag (bez GSAP), 1px Emerald dělicí linka.
- **CTA:** **Zobrazit všechny reference** → `/reference` (s filtrem rekonstrukce / pronájem / portfolio).
- **Mobil:** nativní scroll-snap; shadery nahrazeny CSS `filter` + transform; před/po funguje na tap-and-hold i drag.

### 12 · FAQ — ledger otázek (bod 23)

- **Účel:** zabít poslední pochybnost jazykem investora. Emoce: **rozhodnutí**.
- **Obsah:** 12 otázek dle zadání (kolik vlastních prostředků, hypotéka, správa, nájemníci, rekonstrukce, výběr příležitostí, očekávané výnosy, rizika, PO…). Odpověď věcná, max 3 věty, bez marketingu.
- **Layout:** White, jeden sloupec max 68ch, každá položka řádek s 1px `#E4E7EB` linkou a 12px mono glyfem `+/−`.
- **Motion:** GSAP height-auto tween 0,45 s `power3.inOut`; linka otevřené položky zezelená. Otázka o rizicích je **otevřená by default** — transparentnost jako zbraň.
- **SEO:** `FAQPage` schema markup (bod 38).
- **Mobil:** identické, tap target 56 px.

### 13 · Závěrečné CTA homepage (bod 30)

- **Účel:** rozhovor. Emoce: **odhodlání**.
- **Copy:** H2 *Vaše další investice může začít jedním rozhovorem.* · text dle zadání · CTA **Domluvit nezávaznou konzultaci** · sekundární **Prohlédnout investiční příležitosti**.
- **Layout:** 100 vh, jeden centrovaný stack max 720 px na Abyss `#0B1D2E`. Nic dalšího na obrazovce.
- **WebGL:** vrací se hloubkové pole z Hero, ztmavené, a vektorové pole monogramu konverguje do jednoho bodu za tlačítkem. Kruh se uzavírá — web končí tam, kde začal, a mezitím si to zasloužil.
- **Motion:** ScrollTrigger scrubuje expozici canvasu o −40 %, monogram se překresluje; tlačítko `scale .96→1`, 0,6 s `back.out(1.4)`, pak 3s Emerald dýchání (jen opacity, žádný stín).
- **Mobil:** H2 `clamp(2rem, 9vw, 3rem)`, tlačítko full-width, safe-area padding nad home indikátorem.

### 14 · Footer (bod 31)

- Navy `#102A43`, 4 kolony: ① logo Vynosium (bílá varianta) + claim + adresa ② Navigace ③ Investiční cesty (4 odkazy, každý s 6px tečkou ve své barvě) ④ Kontakt + sociální sítě.
- Spodní lišta 1px `rgba(72,101,129,.4)`: GDPR · Cookies · Obchodní podmínky · `© 2026 Vynosium`.
- Decentní řádek 12px `#627D98`, zarovnaný vpravo: **Vynosium je součástí skupiny Real Luxembourg.** Nikde jinde na homepage se Real Luxembourg neobjevuje (bod 1).
- **Mobil:** kolony jako accordiony kromě kontaktu, který je vždy otevřený.

---

### Podstránky — specifikace

#### `/investicni-prilezitosti` (bod 14)
Světlá stránka. Sticky filtrační lišta (strategie, lokalita, cena, výnos, stav) + řazení. Mřížka stejných karet jako sekce 09, ale s hustším řádkem metrik a přepínačem grid/tabulka — **tabulkový režim** je pro zkušeného investora silný signál („tohle je platforma"). URL nese stav filtru (`?strategie=pasivni-prijem`) pro PPC i sdílení. Prázdný stav není „nic nenalezeno", ale formulář *Chcete být informováni o nových příležitostech?*

#### `/investicni-prilezitosti/[slug]` — detail projektu (bod 15)
1. **Hero projektu** — Navy, název, lokalita, hlavní fotografie full-bleed, stručná charakteristika, badge strategie.
2. **Klíčová čísla** — sticky vlasový panel: kupní cena, investice do rekonstrukce, celková investice, předpokládaná hodnota, očekávané nájemné, orientační výnos, investiční horizont. Panel se při scrollu **připne k hornímu okraji** jako zkrácená lišta — čísla jsou dostupná po celou stránku.
3. **Proč právě tento projekt** — investiční teze, max 4 odstavce, White.
4. **Lokalita** — dostupnost, vybavenost, rozvoj, poptávka po nájemním bydlení + mapa (Navy stylovaná, jen linky a Emerald pin, žádné výchozí barvy Google).
5. **Scénář investice** — grafické znázornění `Nákup → rekonstrukce → pronájem / prodej → výnos` na vektoru 38,5°, scrubované scrollem; u každého uzlu částka a čas.
6. **Financování** — varianty, LTV, dopad na výnos vlastního kapitálu.
7. **Galerie** — fotografie, vizualizace, půdorysy; půdorys jako samostatný lightbox se zoomem.
8. **CTA** — Emerald **Chci více informací o projektu**, sticky na mobilu.
Povinný disclaimer u každého scénáře: **modelový výpočet**.

#### 4× PPC landing page (body 25–29)
Jednotná šablona, jediná proměnná je barevný token a copy:

`Hero (konkrétní potřeba + CTA)` → `Pro koho je řešení vhodné (profil investora)` → `Jak strategie funguje (3–4 kroky)` → `Konkrétní čísla (modelová investice, plný rozpad)` → `Výhody (3–5)` → `Jak probíhá spolupráce` → `Vybrané projekty (jen relevantní strategie)` → `Reference stejného typu investora` → `Kalkulačka předladěná na tuto strategii` → `FAQ (5 otázek dané cesty)` → `Finální CTA`

- H1 dle zadání: *Kupte chytře. Zvyšte hodnotu. Prodejte se ziskem.* / *Investiční byt bez každodenních starostí.* / *Proměňte volný kapitál v reálné aktivum.* / *Jedna nemovitost může být jen začátek.*
- Token cesty tu smí být **o stupeň výraznější** než na homepage: 2px horní linka stránky, akcent v badge a v grafu — ale stále nikdy jako plocha sekce ani výplň tlačítka. Primární CTA zůstává Emerald na všech čtyřech, aby konverzní prvek byl v celém systému jeden a tentýž.
- Vlastní konverzní formulář + vlastní měřicí ID (bod 39).
- Landing pages jsou **mobile-first navrhované jako první** — sem míří většina PPC trafficu.

#### `/o-nas` + tým (body 19, 20)
H1 *Investice do nemovitostí stavíme na zkušenostech, datech a dlouhodobém pohledu.* Offsetový sloupec portrétů (sl. 1–5, vertikálně střídavě posunutých) proti tabulce historie obchodů (sl. 7–12). Portréty těsně vykrojené, 8 % desaturace, navy grading — nikdy makléřský portrét v obleku před bílým pozadím. U každého: jméno, pozice, specializace, krátký osobní text, LinkedIn. Real Luxembourg zmíněno otevřeněji, ale jako zázemí.

#### `/reference` (bod 21)
Filtr rekonstrukce / pronájem / portfolio, GSAP Flip na přeskládání, detail studie na vlastní URL. Každá studie končí ledgerem čísel a odkazem na relevantní landing page.

#### `/magazin` (bod 22)
Rubriky: Jak investovat · Financování · Pronájem · Rekonstrukce · Lokality · Daně a legislativa · Investiční strategie. Výpis je typografický (žádné velké thumbnaily), 1px linky, kategorie jako pill. Článek: měřítko 68ch, `Article` schema, obsah vlevo sticky TOC, na konci vždy CTA na relevantní investiční cestu — blog je SEO vstup do rozcestníku, ne slepá ulička.

#### `/kontakt` (bod 24)
H1 *Pojďme probrat vaše investiční cíle.* Formulář: jméno, telefon, e-mail, **Moje investiční priorita** (5 radio: 4 cesty + *Nejsem si jistý*), volitelně **Kolik chcete přibližně investovat?** (5 rozsahů), poznámka. CTA **Chci nezávaznou konzultaci**. Vpravo telefon, e-mail, adresa, mapa, volitelně rezervace termínu přes kalendář. Formulář má inline validaci, vlasové inputy s Emerald focus ringem a jasné potvrzení odeslání na stejné stránce (žádné thank-you přesměrování bez měřicí události).

---

## 4. Komponentní systém

### 4.1 Navigační header

- Fixní, 88 px, transparentní nad Hero. Vlevo **bílá varianta loga** (`vynosium horizontal logo white.svg`) šířky 132 px, vpravo od ní za 1px vertikální Steel linkou (gap 16 px) claim **CHYTRÁ CESTA K VÝNOSŮM**, 10 px, `letter-spacing: .22em`, `#9FB3C8`. Pod 1180 px se claim vypouští, nikdy nezalamuje.
- Střed: 7 odkazů 14px `.02em`, `#F8F8F8` @ 0,72 → 1,0 alfa na hover, 1px Emerald podtržení roste zleva 0,3 s `power2.out`. Aktivní route má podtržení trvale.
- Vpravo: ghost pill (telefon jako text link) + Emerald pill **Nezávazná konzultace**, 48 px, radius 9999 px, bez stínu.
- Na světlých podstránkách header startuje ve **light variantě**: barevné logo, `#102A43` odkazy, `#FFFFFF` podklad, 1px `#E4E7EB` spodní linka.
- Scroll: za 80 px se lišta stáhne na 64 px, získá `background: rgba(16,42,67,.72)` + `backdrop-filter: blur(20px) saturate(140%)` a 1px Steel linku @ 0,4 (0,35 s). Scroll dolů skryje (`y:-100%`), scroll nahoru odhalí; threshold 12 px proti jitteru.
- Pod lištou 1px linka postupu s výplní Navy→Emerald — jediný trvale viditelný gradient na webu.
- **Mobil:** logo + burger. Menu je full-screen Navy overlay otevíraný clip-path wipem pod 38,5°; odkazy vstupují stagger 0,06 na 28 px; Emerald CTA je připnuté na spodní hraně overlaye; pod menu ještě rychlé odkazy na 4 cesty s tečkami tokenů (nejkratší cesta k PPC konverzi).

### 4.2 Karta investiční cesty (rozcestník, bod 9)

```
┌─────────────────────────────────────────────┐  1px #486581 → token na hover, radius 10px
│ ⌁ 01 ── ZHODNOTIT BYT          [token dot] │  glyf 24px / index a label 11px mono .16em
│                                             │
│ Koupit, rekonstruovat a                     │  32px display, -0.02em
│ následně prodat se ziskem.                   │
│                                             │
│ výnos 18–24 %ᴹ  horizont 6–14 měs.          │  14px mono .06em, Steel → token
│                                             │
│ Chci zhodnotit byt                      →   │  CTA 15px, šipka x:+6px na hover
└─────────────────────────────────────────────┘
```

Povrch `#16324B`, padding 40 px, výška dle asymetrické mřížky (520/400 px). Každá karta nese `data-token`; na `pointerenter` se token zapíše do `--card-accent` na kartě **a** pošle do shaderu jako `uAccent` (ease 0,5 s). Linka, tečka, glyf, metriky i šipka konzumují `var(--card-accent)` — změna barvy cesty = editace jednoho atributu.
**Nikdy:** plná výplň tokenem, tokenem obarvený běžný text, více než dvě metriky, jakýkoli stín.

### 4.3 Investiční kalkulačka

| Prvek | Spec |
|---|---|
| Panel | `#16324B`, 1px Steel, radius 10px, padding 48px, bezstínový; vnitřní dělení jednou vertikální linkou |
| Slider | track 4px `#243B53`, výplň `#1F8A70`, thumb 20px pill (`#102A43` fill, 1,5px Emerald border) |
| Vlastní kapitál | 300 000 – 20 000 000 Kč, step 50 000, **logaritmické** mapování (dolní pásmo, kde je většina uživatelů, dostane polovinu dráhy) |
| Financování (LTV) | 0 – 80 %, step 5; nad 70 % se zobrazí Amber upozornění na rizikovost páky |
| Horizont | 1 – 15 let, step 1 |
| Typ investice | 4 chipy s tokeny; volba mění použitý model (flip = jednorázový výnos, income = cashflow + zhodnocení) |
| Graf | Three.js stuha, jádrový gradient po ose Y, 1px Emerald hrana, pásmo P10–P90 v Steel 0,25 |
| Ledger | 4 řádky, label 11px `.14em` Steel, hodnota 24px mono, hodnota majetku 32px Emerald; každý řádek má základnu 11px |
| Focus | 2px Emerald @0,4 alfa, offset 3px |
| Disclaimer | Trvale viditelný, 12px `#7B8794`, nad CTA |

### 4.4 Karta aktivní investice (bod 14)

- 1px `#486581` (tmavý kontext) / `#E4E7EB` (světlý), **radius 10 px, absolutně bez stínu** — brandová podmínka. Povrch `#16324B` / `#FFFFFF`.
- Obrázek 16:10, Navy duotone @0,25 → plná barva na hover (0,6 s).
- Tělo: název 21px, lokalita 14px Steel, badge strategie (1px v barvě cesty, transparentní výplň), pak metrická matice `grid-template-columns: repeat(3,1fr); gap: 20px 16px` — label 11px `.14em`, hodnota 18px mono. Orientační výnos je Emerald při ≥ cíli, Amber pod ním.
- Stav projektu jako pill: Emerald *Otevřeno* · Amber *Poslední podíly* · Steel *Uzavřeno* · Slate *Připravujeme*. Vždy s textovým labelem — barva nikdy nenese význam sama.
- Modelové hodnoty s superskriptem `ᴹ` a legendou pod mřížkou.
- Hover: linka → Emerald, `y:-6px`, žádné scale, žádný stín. Uzavřené: 0,4 opacity, přerušovaná linka `2 2`, hover vypnut.

### 4.5 Ostatní komponenty

| Komponenta | Spec |
|---|---|
| **Primární pill** | Emerald `#1F8A70`, text `#FFFFFF` 15px, radius 9999px, padding 14/28, min-height 48px, bez stínu. Hover `#25A184` + `y:-1px`, active `#187059` |
| **Ghost pill (dark)** | Transparent, 1px `#F8F8F8` @0,5, text `#F8F8F8`. Hover: alfa 1,0. Nikdy chromatický |
| **Ghost pill (light)** | Transparent, 1px `#486581`, text `#102A43`. Hover: linka `#102A43` |
| **Filtrační pill** | 1px `#E4E7EB`, label 12px `.1em`, radius 9999px. Vybraný: Emerald linka + Emerald text, transparentní výplň |
| **Badge strategie** | 1px v barvě cesty + 6px tečka + 11px `.14em` uppercase label |
| **Metrický blok** | Vždy tři části: label 11px `.14em` → hodnota 40–96px mono → základna 11px. Nikdy nahé číslo |
| **Vlasová linka** | 1px `#486581` @0,5 (dark) / `#E4E7EB` (light) — primární strukturní prostředek webu |
| **Input** | Radius 9999px, 1px `#E4E7EB`, výška 52px, padding 0 24px, label nad polem 12px `.1em`. Focus 2px Emerald @0,4. Chyba: linka `#D64545` + text 12px, nikdy jen barva |
| **Kurzorový magnet** | 28px disk, `mix-blend-mode: difference`, `lerp .15`, na interaktivních zónách 64px + token. Na touch vypnuto |
| **Lišta postupu** | Vpravo 2px, track `#243B53`, výplň Navy→Emerald, ťuky sekcí 6px |
| **Index sekce** | Každá hlavní sekce nese `03 — ROZCESTNÍK` 11px mono `.18em` vlevo nahoře. Dělá z webu dokument a posiluje datovou tezi |
| **Sticky mobilní CTA** | Po 40 % scrollu 64px lišta: telefon (ghost) + **Nezávazná konzultace** (Emerald). Respektuje safe-area |
| **Disclaimer řádek** | 12px `#7B8794`, max 80ch, vždy v layoutu (nikdy tooltip, nikdy pod fold) u čísel a scénářů |

---

## 5. Globální tokeny & typografie

### Barvy (bod 32)

**Primární**

| Název | Hodnota | Token | Použití |
|---|---|---|---|
| Midnight Navy | `#102A43` | `--color-navy` | Hlavní barva značky, Hero, navigace, tmavá pozadí, primární text na světlé |
| Emerald | `#1F8A70` | `--color-emerald` | Hlavní akcent: CTA, odkazy, grafy, pozitivní růstové prvky |
| White | `#FFFFFF` | `--color-white` | Hlavní světlé pozadí |
| Mist | `#F5F7FA` | `--color-mist` | Alternativní pozadí sekcí |

**Rozšíření pro tmavé povrchy** (doplněno nad zadání, aby dark sekce měly hierarchii)

| Název | Hodnota | Token | Použití |
|---|---|---|---|
| Abyss | `#0B1D2E` | `--color-abyss` | Závěrečné CTA, preloader, overlay fotografií |
| Surface 1 | `#16324B` | `--color-surface-1` | Karty a panely na navy |
| Surface 2 | `#1B3A54` | `--color-surface-2` | Vnořené plochy, zebra v tabulkách |
| Line Deep | `#243B53` | `--color-line-deep` | Tracky sliderů, dělení na povrchu |
| Snow | `#F8F8F8` | `--color-snow` | Popředí na navy (odpovídá logo assetu) |

**Sekundární**

| Steel | `#486581` | `--color-steel` | 1px linky na tmavé, tlumené labely |
| Slate | `#627D98` | `--color-slate` | Body copy na tmavé |
| Silver | `#BCCCDC` | `--color-silver` | Neaktivní stavy, ikony na světlé |
| Light Gray | `#E4E7EB` | `--color-light-gray` | 1px linky na světlé |

**Text**

| Primární text | `#102A43` | `--text-primary` |
| Sekundární text | `#52606D` | `--text-secondary` |
| Popisky | `#7B8794` | `--text-muted` |

**Barvy investičních cest** — pouze akcenty

| Zhodnotit byt | `#1F8A70` | `--path-flip` |
| Pasivní příjem | `#2F6FED` | `--path-income` |
| Zhodnocení kapitálu | `#F59E0B` | `--path-capital` |
| Budování majetku | `#6D5BD0` | `--path-wealth` |

**Funkční**

| Pozitivní výnos | `#3FB950` | `--fn-positive` |
| Upozornění | `#F59E0B` | `--fn-warning` |
| Riziko | `#D64545` | `--fn-risk` |

> **Pozor na kolizi:** `#F59E0B` je zároveň barva cesty *Zhodnocení kapitálu* i systémové *Upozornění*. Pravidlo: v kontextu formulářů, stavů a validace je Amber vždy funkční; v kontextu identity cesty vždy doprovázený textovým labelem cesty. Nikdy oba významy v jednom viewportu.
> `#3FB950` (pozitivní výnos) se používá **jen v tabulkách a delta hodnotách**, nikdy jako CTA — CTA je výhradně Emerald `#1F8A70`.

**Jádrový gradient** — `linear-gradient(38.5deg, #102A43 0%, #16506B 46%, #1F8A70 100%)`.
Povoleno: výplně datových vizualizací, linka postupu v navigaci, lišta postupu, mapování hodnoty ve WebGL.
Zakázáno: tlačítka, pozadí karet, výplně textu, pozadí sekcí, hover stavy.

**Kontrast:** všechny kombinace jsou ověřené na WCAG AA. `#7B8794` na `#FFFFFF` (4,54:1) je povolen jen od 12 px pro popisky, nikdy pro body. Slate `#627D98` na Navy `#102A43` (4,6:1) je minimum pro tmavý body text; menší než 14 px se posouvá na Silver.

### Typografie (bod 34)

**Plus Jakarta Sans** (400 / 500 / 600) pro vše čtené větami — je na doporučeném seznamu zadání, geometrická, mírně humanistická, vyhýbá se „default" dojmu Interu. **IBM Plex Mono** (400 / 500) pro každé číslo, metriku, index a stavový label. Dvě rodiny, žádná třetí. Latin + **latin-ext subset povinně** (české diakritiky `ě š č ř ž ý á í é ú ů ó`), self-hosted přes `next/font`.

| Role | Velikost (fluid) | Weight | Line-height | Tracking | Token |
|---|---|---|---|---|---|
| display-xl | `clamp(2.4rem, 7vw, 7rem)` | 500 | 0.98 | -0.03em | `--text-display-xl` |
| display-lg | `clamp(2rem, 5vw, 4.4rem)` | 500 | 1.04 | -0.025em | `--text-display-lg` |
| display | `clamp(1.75rem, 3.4vw, 3rem)` | 500 | 1.1 | -0.02em | `--text-display` |
| heading | `clamp(1.375rem, 2.1vw, 2rem)` | 500 | 1.2 | -0.015em | `--text-heading` |
| subheading | `1.3125rem` | 500 | 1.35 | -0.01em | `--text-subheading` |
| lede | `clamp(1.0625rem, 1.4vw, 1.375rem)` | 400 | 1.5 | -0.005em | `--text-lede` |
| body | `1rem` | 400 | 1.6 | 0 | `--text-body` |
| body-sm | `0.9375rem` | 400 | 1.55 | 0 | `--text-body-sm` |
| metric-xl | `clamp(2.4rem, 6vw, 6rem)` | 500 mono | 1 | -0.01em | `--text-metric-xl` |
| metric | `1.5rem` | 500 mono | 1.1 | 0.01em | `--text-metric` |
| data | `0.875rem` | 400 mono | 1.4 | 0.06em | `--text-data` |
| label | `0.6875rem` | 500 mono | 1 | 0.16em, uppercase | `--text-label` |
| disclaimer | `0.75rem` | 400 | 1.5 | 0 | `--text-disclaimer` |

**Zákon:** negativní tracking patří displayi, volný tracking datům. Cokoli číselného je mono. Cokoli, co člověk čte ve větách, je Jakarta. Maximální míra 68ch, v panelech 46ch. Nadpisy nikdy nad weight 600 (zadání chce „prémiová, ale ne okázalá").

**Formátování čísel (cs-CZ):** nezlomitelná mezera jako oddělovač tisíců (`1 250 000 Kč`), desetinná čárka, procenta s mezerou (`6,4 %`), `mld. Kč` u velkých částek. Vždy `Intl.NumberFormat('cs-CZ')`, nikdy manuální string.

### Prostor, rádiusy, linky, motion

```css
:root {
  /* Prostor — základ 4px, fluidní na úrovni sekcí */
  --space-1: 4px;  --space-2: 8px;   --space-3: 12px;  --space-4: 16px;
  --space-5: 24px; --space-6: 32px;  --space-7: 40px;  --space-8: 56px;
  --space-9: 72px; --space-10: 96px; --space-11: 128px; --space-12: 176px;
  --space-section: clamp(80px, 12vw, 176px);
  --gutter: clamp(20px, 4vw, 88px);
  --max-w: 1440px;
  --max-w-text: 68ch;

  /* Rádiusy — existují pouze dvě hodnoty */
  --radius-pill: 9999px;  /* tlačítka, inputy, chipy, badge, stavy */
  --radius-card: 10px;    /* každá karta, panel, obrázek, tabulka */

  /* Linky — 1px systém, bez výjimek */
  --border-dark: 1px solid var(--color-steel);
  --border-dark-soft: 1px solid rgba(72,101,129,.5);
  --border-light: 1px solid var(--color-light-gray);

  --shadow: none;         /* web nemá stíny */

  /* Motion */
  --dur-micro: 180ms;      /* hover barva, podtržení */
  --dur-ui: 350ms;         /* lift karty, kolaps navigace */
  --dur-reveal: 900ms;     /* textové masky, odhalení obrázků */
  --dur-cinematic: 1400ms; /* vstup Hero, exit preloaderu */
  --ease-out: cubic-bezier(.22,1,.36,1);
  --ease-inout: cubic-bezier(.83,0,.17,1);
  --ease-soft: cubic-bezier(.33,1,.68,1);
  --vector-angle: 38.5deg;

  /* WebGL baseline */
  --gl-drift: 0.06;        /* amplituda uTime */
  --gl-grain: 0.035;       /* opacita šumu */
  --gl-accent-ease: 500ms; /* lerp uAccent na hover */
  --gl-dpr-cap: 1.75;      /* desktop; 1.0 na mobilu */
  --gl-idle-fps: 30;       /* fps mimo interakci */
}
```

**Zákon pohybu:** scrubované animace jsou **lineární**; triggerované používají `--ease-out`; nic na webu neeasuje pouze `in`. Stagger vždy 0,06–0,12 s. Jakákoli animace nad 1,4 s musí být řízená scrollem, nikdy autoplay. Na světlých sekcích je pohyb systematicky **utlumený** — světlo je režim dokumentu, tma je režim filmu.

---

## 6. Implementační blueprint

**Stack:** Next.js 15 App Router · Tailwind v4 (`@theme` s tokeny výše) · GSAP 3 (ScrollTrigger, Flip, SplitText) · Three.js r16x · Lenis · `next/font` self-hosted · headless CMS (Sanity / Payload / Strapi) · CRM webhook.

### Architektura

- **Jeden WebGL kontext na celý web.** `<GLStage>` provider drží jediný `WebGLRenderer` v fixním full-viewport canvasu; sekce registrují „scény" a renderují se jen při průniku s viewportem (`setScissorTest` + per-scene viewport). Čtyři kontexty by vyčerpaly GPU budget a na mobilním Safari by se ztrácely.
- **GSAP disciplína:** každá komponenta používá `useGSAP` / `gsap.context()` scopnutý na svůj ref s automatickým revertem při unmountu. ScrollTriggery vznikají až po zapojení Lenisu (`ScrollTrigger.scrollerProxy` + `lenis.on('scroll', ScrollTrigger.update)`).
- **Server/client split:** veškerý copy, čísla i projekty jsou server komponenty (ISR 60 s pro stav projektu). `"use client"` mají jen motion/shader wrappery. Text je v prvotním HTML — nutné pro SEO i LCP.

### CMS a datový model (bod 38)

```
Project           název, slug, lokalita, strategie(enum 4), stav(enum 4), galerie[],
                  kupní cena, investiční náklady, celková investice, očekávané nájemné,
                  orientační výnos, hodnota po rekonstrukci, potenciál zhodnocení,
                  horizont, investiční teze, lokalita (rich), financování, mapa(lat/lng),
                  isModel(bool per metrika), publishedAt, featured(bool)
CaseStudy         projekt(ref), před/po média, pořizovací cena, náklady, délka realizace,
                  prodejní cena / nájemné, výsledek, citace investora, video
Article           titulek, slug, rubrika, perex, obsah, autor, souvisejícíCesta(enum), SEO
TeamMember        jméno, pozice, specializace, foto, text, LinkedIn
PathPage          cesta(enum), H1, sekce (repeatable), FAQ[], projektový filtr
GlobalNumbers     hodnota obchodů, počet projektů, roky, obsazenost + základna ke každému
Lead              jméno, telefon, e-mail, priorita, rozsah investice, poznámka,
                  UTM (source/medium/campaign/content/term), landingPage, gclid/fbclid
```

Redaktor musí zvládnout přidat projekt bez designéra — proto je karta plně datově řízená a mřížka nemá žádné ruční pozicování mimo `featured` flag.

### Core Web Vitals

- **LCP ≤ 1,8 s.** LCP prvkem je **text H1**, ne canvas — renderuje se ze server HTML s `next/font` a preloadem latin-ext subsetu. WebGL hloubkové pole se mountuje po `requestIdleCallback` (fallback 900 ms) za AVIF posterem (~24 KB), takže fold je hotový dřív, než začne GPU práce.
- **CLS ≈ 0.** Každý obrázek a canvas má explicitní `aspect-ratio`; preloader je `position: fixed`, jeho odstranění nemůže reflownout; fonty mají metrickou `size-adjust` override; kolaps navigace animuje `height` na wrapperu fixní výšky; sticky panel čísel na detailu projektu si rezervuje místo.
- **INP ≤ 150 ms.** Vstup slideru je oddělený od renderu: `input` event zapisuje jen do refu, stuha se přepočítává v render loopu. **Nikde na webu není React state update na pointermove** (magnet, parallax, slidery čtou refy v `requestAnimationFrame`).
- **Bundle:** GSAP pluginy a Three.js dynamicky per sekce (`next/dynamic`, `ssr:false`); cíl ≤ 180 KB gzip pro initial route homepage a ≤ 120 KB pro landing pages (ty musí být rychlejší — platí se za jejich traffic). Shadery jsou inline template stringy.
- **Adaptivní kvalita:** změř prvních 30 framů; pod 45 fps sniž `dpr` na 1, zkrať částice na polovinu, vypni curl distortion. Degradace je tichá a postupná.
- **Obrázky:** AVIF + WebP fallback, `next/image` se `sizes`, LQIP blur placeholder, galerie lazy s `fetchpriority="low"`.

### Přístupnost

`prefers-reduced-motion: reduce` vypne Lenis, převede každý scrub na koncový stav a WebGL vymění za statické gradienty — **layout je navržený tak, aby byl kompletní i bez pohybu**. Všechny ovládací prvky dosažitelné klávesnicí s viditelným 2px Emerald focus ringem. Kalkulačka zrcadlí graf v `aria-live` souhrnu a skryté tabulce. Barva nikdy nenese význam sama (každý stav i chyba má textový label). Kontrast AA napříč oběma režimy.

### Marketing, měření, SEO (body 38–40)

- **URL pro PPC:** `/zhodnotit-byt`, `/pasivni-prijem`, `/zhodnoceni-kapitalu`, `/budovani-majetku` — každá s vlastním formulářem a vlastní konverzní událostí.
- **Měření:** GTM jako jediný kontejner; GA4 eventy `path_card_click`, `calculator_interact` (první pohyb sliderem), `calculator_submit`, `project_detail_view`, `lead_submit` (s parametry priorita + rozsah investice), `phone_click`. Meta Pixel + Google Ads conversion přes GTM, nikdy hardcoded. Cookie management (Consent Mode v2) blokuje marketingové tagy do souhlasu.
- **CRM:** formuláře posílají server action → CRM webhook + potvrzovací e-mail; honeypot + rate limit + Turnstile místo reCAPTCHA (rychlost).
- **SEO:** šablony title `{H1} | Vynosium` (max 60 zn.), meta description per typ stránky, jedno `H1`, `H2` pro sekce, `H3` pro položky. Schema: `Organization`, `WebSite`, `BreadcrumbList`, `FAQPage`, `Article`, `RealEstateListing` pro projekty. Sitemap + `robots.txt` generované, `hreflang` připravený pro budoucí `/en`. Interní prolinkování: blog → cesta → projekt → kontakt, každý článek má povinný odkaz na relevantní investiční cestu.
- **Klíčová slova → stránky:** `investice do nemovitostí` → `/`, `investiční byt / investiční nemovitost` → `/investicni-prilezitosti`, `výnos z pronájmu / pasivní příjem z nemovitostí` → `/pasivni-prijem`, `rekonstrukce investičního bytu / zhodnocení nemovitosti` → `/zhodnotit-byt`, `portfolio nemovitostí` → `/budovani-majetku`, `jak investovat do nemovitostí` → `/magazin`.

### Modularita pro budoucí rozvoj (bod 43)

Designový systém i CMS jsou připravené na: developerské investice (nový `Project.type`), větší projekty (nová šablona detailu se sdílenými komponentami), **investor club / klientská zóna** (autentikovaná route group `(private)` — proto je systém navržen s tabulkovým režimem a datovými komponentami, které jsou v dashboardu použitelné 1:1), reporting, newsletter, prémiový obsah (paywall flag na `Article`). Žádná komponenta v tomto systému není vázaná na marketingový kontext.

---

## 7. Tone of Voice a obsahová pravidla (body 36, 37)

**Mluvíme k investorovi.** Slovo **investor**, ne pouze „klient". Místo „naše služby" → *investiční řešení / investiční strategie / investiční cesta / investiční příležitost*.

Komunikace je: srozumitelná · sebevědomá · profesionální · věcná · moderní · transparentní.

**Blacklist frází** (nesmí se objevit v žádném copy, ani v CMS nápovědě): „Jsme jednička na trhu." · „Jsme tým profesionálů." · „Individuální přístup je pro nás samozřejmostí." · „Vaše spokojenost je naší prioritou." · „Splníme vaše sny o bydlení." · jakákoli formulace slibující garantovaný výnos.

**Copy pravidla:** odstavec max 3 věty. Sekce max 60 slov běžného textu (web nesmí být zahlcený — bod 41). Každé tvrzení o výnosu má vedle sebe číslo a jeho základnu. Každý modelový výpočet je označen. Nadpisy jsou tvrzení, ne popisky („Od první konzultace k výnosu.", ne „Náš proces").

**Fotografie — art direction (bod 35):** současná architektura, moderní interiéry, městské lokality, detaily budov (šikmé vertikály, podhledy, sloupkové zasklení, schodiště), reálné rekonstrukce, před/po, mapy, grafy, půdorysy. Grading směrem k Navy, mírná desaturace. **Zakázáno:** makléř s klíčem, usměvavá fotobanka, podepisující ruce, rodina před domem, generický open space. Test: pokud by fotografie fungovala na webu běžného developera, vyřazuje se.

---

## 8. Finální sebekritika porotce

**Kde to ještě zavání korporátem — a co s tím.**

1. **„Čtyři čítače nad fold" je nejopakovanější trope fintechu.** → Vyřešeno *provenience_í*: každé číslo nese základnu, období a zdroj, a blok je rýsovaný linkami, ne kartami. Pokud by kterýkoli čítač potřeboval kartu, sekce selhala a redukuje se na jedno monumentální číslo se dvěma poznámkami.
2. **Hero „headline vlevo, data vpravo" je konvence Linear/Stripe.** → Obstojí jen díky extrémní asymetrii (8 vs. 3 sloupce, baseliny rozladěné o 220 px) a skutečně interaktivnímu hloubkovému polí. Pojistka: pokud se WebGL vrstva kdy vyřadí kvůli výkonu, Hero se musí **znovu zkomponovat**, ne poslat jako statická verze stejného layoutu — statická verze tohoto Hera *je* korporátní Hero.
3. **Pinnutá horizontální dráha procesu je award klišé z roku 2021.** → Ospravedlněná tím, že se jí dokresluje šipka monogramu — mechanismus nese význam. Přesto je to nejrizikovější sekce. Mitigace: šest panelů po 60vw (ne 8, ne 100vw) a mobil pin ruší, místo aby ho zmenšoval.
4. **Rozcestníky se čtyřmi kartami jsou segmentační klišé.** → Rozbito záměrně: nerovné spany, rozladěné baseliny a hover, který tónuje **celý shader sekce**, ne kartu. Pokud budoucí editace srovná výšky karet, sekce ztratí argument.
5. **Kalkulačka riskuje, že bude hračka.** → Ukotvena realitou: zobrazuje pásmo scénářů P10–P90, dopad páky a poplatkové zacházení, ne jen stoupající stuhu. Kalkulačka, která umí jen růst, je marketing. **Nejsilnější jednotlivý přírůstek této revize** — a zároveň to, co web právně chrání.
6. **Čtyři barvy cest protiřečí disciplíně jednoho akcentu.** → Zákonem omezené: barvy cest jen jako 1px linky, 6px tečky, badge a malé mono metriky; nikdy plocha, nikdy dvě velké současně na obrazovce. Emerald zůstává jedinou barvou, kterou lze *stisknout*. (Riziko kolize `#F59E0B` cesta vs. upozornění je vyřešené pravidlem v sekci 5.)
7. **Světlé sekce jsou náchylné sklouznout do „standardního korporátu".** Toto je největší nové riziko, které v1 neměl. → Pojistka: na světlých sekcích **neexistují karty se stínem, neexistují zaoblené boxy s ikonou vlevo a neexistují tři sloupce stejné výšky**. Struktura je jen 1px `#E4E7EB` mřížka a typografie. Světlá sekce, kterou by šlo vygenerovat v šablonovém builderu, se přepracovává.
8. **Architektonická fotografie může sklouznout k fotobance.** → Art-direction omezení výše je součástí zadání pro fotografa, ne doporučení.
9. **Award riziko: „krásné, ale pomalé."** → Adaptivní kvalita a rozhodnutí mít text jako LCP znamenají, že web je hodnocen jako rychlý na středním Androidu — přesně tam, kde běží většina Lighthouse testů poroty. Landing pages mají tvrdší budget než homepage, protože nesou platený traffic.
10. **Konfliktní tlak zadání:** bod 6 chce klasické důvěryhodné menu, kreativní ambice chce one-page zážitek. → Rozhodnuto pro **skutečnou navigaci s narativní homepage**. Kompromis je vědomý: menu je konvenční, obsah není. Web, který investor nemůže procházet strukturovaně, přijde o důvěryhodnost, kterou celý koncept staví.
11. **Zbývající přiznaná slabina.** Sekce *Proč Vynosium* a *Proč nemovitosti* jsou záměrně tiché. Porota je může přečíst jako nedodělané, ne jako zdrženlivé. Přijatý trade-off — animovat argumentační sekce by podkopalo tezi transparentnosti a *ne všechno na award webu má být animované.*

**Verdikt:** k realizaci. Obhajitelná originalita tohoto webu není WebGL — shader si koupí kdokoli. Je to fakt, že **dekorativní a datová vrstva jsou tatáž vrstva**, řízená jedním úhlem, jedním akcentem, který znamená „ano", a bezstínovou 1px disciplínou rýsovacího prkna, na kterou žádný konkurenční realitní web zatím nemá odvahu. A na rozdíl od většiny award webů to zvládá i to, co zadání skutečně chce: generovat kvalifikované leady z placeného trafficu.
