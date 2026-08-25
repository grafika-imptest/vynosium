# Vynósium — web

Investiční platforma pro nemovitosti. Next.js 15 (App Router, statický
export) · Tailwind v4 · GSAP 3 (ScrollTrigger, Flip) · Three.js · Lenis.

Zdroj pravdy pro design je `VYNOSIUM-STYLE-REFERENCE.md` (design.md).
Každá barva, mezera, rádius a doba trvání v kódu se musí dát dohledat
v §5 toho dokumentu.

## Spuštění

```bash
npm run dev
```

```bash
npm run build
```

Build zapisuje statický export do `out/`. **Nepouštěj `npm run build`,
zatímco běží `npm run dev`** — sdílejí složku `.next` a přepíšou si
artefakty (projeví se to jako 404 na chunky a nefunkční hydratace).

## Architektura

| Vrstva | Kde | Poznámka |
|---|---|---|
| Tokeny | `src/app/globals.css` | `@theme` + `:root`, jediný zdroj hodnot |
| WebGL | `src/components/gl/` | **jeden** kontext (`GLStage`), sekce registrují scény |
| Motion | `src/lib/motion.ts`, `src/components/motion/` | GSAP + Lenis, `prefers-reduced-motion` vypíná vše |
| Data | `src/lib/data/` | tvar odpovídá CMS modelu (§6) — výměna za CMS dotaz nevyžaduje změnu komponent |
| Sekce | `src/components/sections/` | pořadí odpovídá narativu §2 |
| SEO | `src/lib/seo.ts`, `src/app/sitemap.ts`, `robots.ts` | Organization, WebSite, BreadcrumbList, FAQPage, Article, RealEstateListing |

### Pravidla, která se nesmí porušit

1. **Jeden WebGL kontext.** Sekce nikdy nevytváří vlastní `<canvas>` —
   registruje se přes `useGLScene`. Víc kontextů shodí mobilní Safari.
2. **Žádné stíny.** Struktura vzniká z 1px linek (`#486581` na tmavé,
   `#E4E7EB` na světlé) a dvou rádiusů (10px / 9999px).
3. **Úhel 38,5°.** Každý gradient, odhalení i vektor toku má tento úhel
   (`--vector-angle`, `VECTOR_ANGLE_DEG`).
4. **Žádný React state na pointermove.** Kurzor, parallax i slidery píší
   do refů a čtou se v `requestAnimationFrame` (INP ≤ 150 ms).
5. **Modelová čísla nesou `ᴹ` a disclaimer je v layoutu**, nikdy
   v tooltipu ani pod foldem.

## Co je zástupné a musí se doplnit před spuštěním

- **Všechna čísla** v `src/lib/data/` (projekty, reference, důvěryhodnostní
  čísla, historie obchodů) — jde o placeholdery, ne o data Vynósium.
- **Tým** v `src/lib/data/team.ts` — jména, pozice, portréty, LinkedIn.
- **Kontakty** v `src/lib/data/site.ts` — telefon, e-mail, adresa, IČO.
- **Fotografie** — dnes jsou všude duotone gradienty. Art direction: současná
  architektura, reálné rekonstrukce, půdorysy, grafy. Žádná fotobanka.
- **Právní texty** (`/gdpr`, `/cookies`, `/obchodni-podminky`) — kostra
  k doplnění právníkem.
- **Napojení formulářů**: `NEXT_PUBLIC_LEAD_ENDPOINT` (CRM webhook). Bez něj
  formulář validuje a potvrdí, ale otevřeně přizná, že data neodešla.
- **Měření**: GTM kontejner + Consent Mode v2, události `path_card_click`,
  `calculator_interact`, `calculator_submit`, `lead_submit`, `phone_click`.
- **Mapy** na detailu projektu a kontaktu — dnes vlasový placeholder.

## Proměnné prostředí

| Proměnná | Výchozí | Účel |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | `https://www.vynosium.cz` | kanonické URL, sitemap, schema |
| `NEXT_PUBLIC_BASE_PATH` | prázdné | hosting v podadresáři (GitHub Pages) |
| `NEXT_PUBLIC_LEAD_ENDPOINT` | prázdné | CRM webhook pro formuláře |

## Routy

```
/                                 narativní homepage (14 sekcí)
/investicni-prilezitosti          přehled + filtr + tabulkový režim
/investicni-prilezitosti/[slug]   detail projektu
/jak-investujeme                  6krokový proces
/kalkulacka                       samostatná kalkulačka pro remarketing
/o-nas                            tým, historie obchodů, zázemí skupiny
/reference · /reference/[slug]    případové studie
/magazin · /magazin/[slug]        magazín
/kontakt                          formulář a spojení
/zhodnotit-byt · /pasivni-prijem · /zhodnoceni-kapitalu · /budovani-majetku
                                  PPC landing pages
/gdpr · /cookies · /obchodni-podminky
```
