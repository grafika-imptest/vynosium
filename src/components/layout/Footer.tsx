import Image from "next/image";
import Link from "next/link";
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
            <Image
              src={withBasePath("/brand/logo-horizontal-white.svg")}
              alt={SITE.name}
              width={160}
              height={43}
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
            <ul className="mt-5 flex flex-col gap-3">
              {INVESTMENT_PATHS.map((path) => (
                <li key={path.id}>
                  <Link
                    href={`/${path.slug}`}
                    className="focus-ring text-body-sm flex items-center gap-3 text-snow/80 no-underline transition-colors duration-[var(--dur-micro)] hover:text-snow"
                  >
                    <span
                      className="inline-block h-1.5 w-1.5 shrink-0 rounded-full"
                      style={{ background: `var(--color-${path.colorVar})` }}
                    />
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
              className="focus-ring mt-6 inline-flex min-h-12 items-center rounded-[var(--radius-pill)] border border-snow/50 px-6 text-[15px] text-snow no-underline transition-colors duration-[var(--dur-micro)] hover:border-snow"
            >
              Nezávazná konzultace
            </Link>
          </div>
        </div>

        <div
          className="mt-[var(--space-10)] flex flex-col gap-4 border-t py-6 md:flex-row md:items-center md:justify-between"
          style={{ borderColor: "rgba(72,101,129,0.4)" }}
        >
          <ul className="flex flex-wrap gap-5">
            {LEGAL.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="focus-ring text-disclaimer text-silver no-underline hover:text-snow"
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li className="text-disclaimer text-silver">© 2026 {SITE.name}</li>
          </ul>
          {/* The only place on the site where the group is named (§1). */}
          <p className="text-disclaimer text-right text-slate-on-dark">{SITE.group}</p>
        </div>
      </div>
    </footer>
  );
}
