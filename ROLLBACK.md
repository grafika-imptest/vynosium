# Návrat produkce na verzi před redesignem

Tag `v1-client-review` označuje web ve stavu, který klient viděl před
feedbackem ze září 2026. Nová práce jde do větve `redesign-2026-09`,
`master` zůstává stát na v1.

**Pozor na jednu věc:** GitHub Pages servírují **sestavený výstup** z větve
`gh-pages`, ne zdroj z `master`. `git checkout` tagu proto sám o sobě živý web
nezmění — je potřeba ten stav znovu sestavit a publikovat.

---

## Varianta A — ručně, bez asistenta (3 příkazy)

Ve složce `C:\Users\Omen\Documents\claude\vynosium2`:

```bash
git checkout v1-client-review
```
```bash
powershell -ExecutionPolicy Bypass -File scripts/publish.ps1
```
```bash
git checkout redesign-2026-09
```

Skript sestaví web a force-pushne ho do `gh-pages`. Odmítne publikovat, když
build selže nebo nevyrobí `index.html`, a upozorní, když jsou v kopii
necommitnuté změny (publikovaly by se). Produkce naskočí do 1–2 minut na
<https://grafika-imptest.github.io/vynosium/>.

Zpátky na redesign se pak dostaneš stejným skriptem spuštěným na větvi
`redesign-2026-09`.

---

## Varianta B — prompt do nové session Claude Code

Zkopíruj celé následující zadání:

> Vrať produkční web Vynosium na verzi před redesignem.
>
> Kontext, který potřebuješ:
> - Repo: `C:\Users\Omen\Documents\claude\vynosium2` (Next 15, statický export).
> - Produkce: <https://grafika-imptest.github.io/vynosium/>. GitHub Pages
>   servírují **sestavený výstup z větve `gh-pages`**, ne zdroj z `master` —
>   Actions byl v outage, tak se deploy dělá ručně. Checkout tagu proto živý
>   web nezmění, musí se znovu sestavit a publikovat.
> - Tag `v1-client-review` = odsouhlasený stav před redesignem. Větev
>   `redesign-2026-09` = práce na nové verzi. `master` stojí na v1.
> - Publikuje `scripts/publish.ps1` (build do `.next-deploy`, force-push do
>   `gh-pages`; odmítne publikovat při chybě buildu).
>
> Postup:
> 1. Zkontroluj `git status`. Pokud jsou necommitnuté změny, **zastav se
>    a zeptej se mě** — publikovaly by se do produkce.
> 2. `git checkout v1-client-review`
> 3. `powershell -ExecutionPolicy Bypass -File scripts/publish.ps1`
> 4. `git checkout redesign-2026-09`
> 5. Vyčkej 1–2 minuty a **ověř na produkci**, že se vrátila v1: homepage
>    vrací 200 a obsahuje `photo/rozhovor.jpg`; stránka `/zhodnotit-byt/`
>    obsahuje `photo/cesty/zhodnotit-byt.jpg`. Napiš mi, co jsi naměřil.
>
> Nemaž a nepřepisuj větev `redesign-2026-09` ani tag `v1-client-review`.
> Když něco nevyjde, řekni mi to a nic neobcházej.

---

## Co po sobě nechat, když se vracíš nadobro

Pokud se rozhodneš u v1 zůstat, řekni to asistentovi zvlášť — je k tomu
potřeba přesunout `master` a to není součástí výše uvedeného postupu. Rollback
záměrně mění **jen to, co je live**, ne historii.

## Až se GitHub Actions vzpamatuje

V nastavení repa (Settings → Pages) přepnout zdroj zpět na „GitHub Actions".
Pak se deploy spouští sám z `master` a tenhle postup zůstává jen pro nouzi.
Přepnutí musí udělat člověk — token v repu má admin práva, ale Pages API mu
vrací 403 (fine-grained PAT bez oprávnění „Pages: write").
