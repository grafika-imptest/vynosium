import Image from "next/image";
import Link from "next/link";
import { PathTile } from "@/components/ui/primitives";
import { INVESTMENT_PATHS } from "@/lib/data/paths";
import { SITE } from "@/lib/data/site";
import { withBasePath } from "@/lib/seo";

const NAVIGATION = [
  { href: "/investicni-prilezitosti", label: "Investiční příležitosti" },
  { href: "/jak-investujeme", label: "Jak investujeme" },
  { href: "/kalkulacka", label: "Kalkulačka" },
  { href: "/o-nas", label: "O nás" },
  { href: "/reference", label: "Reference" },
  { href: "/magazin", label: "Magazín" },
  { href: "/kontakt", label: "Kontakt" },
];

const LEGAL = [
  { href: "/gdpr", label: "GDPR" },
  { href: "/cookies", label: "Cookies" },
  { href: "/obchodni-podminky", label: "Obchodní podmínky" },
];

/** §3/14 — four columns, hairline bottom bar, group affiliation last. */
export function Footer() {
  return (
    <footer className="relative z-[2] bg-navy pt-[var(--space-10)]">
      <div className="mx-auto max-w-[var(--max-w)] px-[var(--gutter)]">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            {/*
              The same claim-free mark as the header, so the brand reads
              identically at both ends of the page. The claim under it is live
              text, which is why the logo that carries its own is not used.
            */}
            <Image
              src={withBasePath("/brand/logo-navbar-white.svg")}
              alt={SITE.name}
              width={185}
              height={35}
              className="h-8 w-auto"
            />
            <p className="text-label mt-5 text-silver">{SITE.claim}</p>
            <address className="text-body-sm mt-5 not-italic text-slate-on-dark">
              {SITE.address.street}
              <br />
              {SITE.address.zip} {SITE.address.city}
              <br />
              {SITE.address.country}
            </address>
          </div>

          <nav aria-label="Navigace v patičce">
            <p className="text-label text-slate-on-dark">Navigace</p>
            <ul className="mt-5 flex flex-col gap-3">
              {NAVIGATION.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="focus-ring text-body-sm text-snow/80 no-underline transition-colors duration-[var(--dur-micro)] hover:text-snow"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Investiční cesty">
            <p className="text-label text-slate-on-dark">Investiční cesty</p>
            {/* Each path wears its own glyph and token here, the same pair
                the selector uses — four coloured dots would ask the reader
                to remember a legend that is a whole page away. */}
            <ul className="mt-5 flex flex-col gap-2">
              {INVESTMENT_PATHS.map((path) => (
                <li key={path.id}>
                  <Link
                    href={`/${path.slug}`}
                    className="focus-ring text-body-sm flex items-center gap-3 text-snow/80 no-underline transition-colors duration-[var(--dur-micro)] hover:text-snow"
                  >
                    <PathTile path={path.id} />
                    {path.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="text-label text-slate-on-dark">Kontakt</p>
            <ul className="mt-5 flex flex-col gap-3">
              <li>
                <a href={SITE.phoneHref} className="focus-ring text-body-sm text-snow no-underline">
                  {SITE.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${SITE.email}`} className="focus-ring text-body-sm text-snow no-underline">
                  {SITE.email}
                </a>
              </li>
            </ul>
            <Link
              href="/kontakt"
              className="focus-ring mt-6 inline-flex min-h-12 items-center whitespace-nowrap rounded-[var(--radius-pill)] border border-snow/50 px-6 text-[15px] text-snow no-underline transition-colors duration-[var(--dur-micro)] hover:border-snow"
            >
              Nezávazná konzultace
            </Link>
          </div>
        </div>

        {/*
          Bottom bar: one line, one type size, one centre line.

          Each half carries the disclaimer size for its own items rather than
          each item carrying it — the li elements used to inherit 16px/25.6px
          body type while the links inside them were 12px, which left the ©
          six pixels above the links beside it.

          The size class stays off the row itself: .text-disclaimer also sets
          an 80ch measure for prose, and on the row that capped the whole bar
          at 703px and folded it into two lines. A Tailwind max-w-none does
          not win that fight — the custom class is unlayered.

          Below lg it becomes two stacked groups, where the two halves
          together (about 790px) stop fitting the content width.
        */}
        <div
          className="mt-[var(--space-10)] flex flex-col gap-x-8 gap-y-4 border-t py-6 lg:flex-row lg:items-center lg:justify-between"
          style={{ borderColor: "rgba(72,101,129,0.4)" }}
        >
          <ul className="text-disclaimer flex flex-wrap items-center gap-x-5 gap-y-2 text-silver">
            <li>© 2026 {SITE.name}</li>
            {LEGAL.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="focus-ring no-underline hover:text-snow">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="text-disclaimer flex flex-wrap items-center gap-x-4 gap-y-2 text-slate-on-dark">
            {/* The only place on the site where the group is named (§1). */}
            <p>{SITE.group}</p>
            <span aria-hidden="true" className="hidden h-3 w-px bg-steel/60 sm:block" />
            <a
              href="https://impnet.cz"
              target="_blank"
              rel="noreferrer noopener"
              className="focus-ring group inline-flex items-center gap-2 no-underline"
            >
              Developed by
              {/* The mark carries the name, so the words beside it are the
                  caption — hence alt on the image and no second label. */}
              <Image
                src={withBasePath("/brand/impnet-white.svg")}
                alt="IMPnet"
                width={500}
                height={136}
                className="h-4 w-auto opacity-70 transition-opacity duration-[var(--dur-micro)] group-hover:opacity-100"
              />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
