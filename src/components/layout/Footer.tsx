import Image from "next/image";
import Link from "next/link";
import { INVESTMENT_PATHS } from "@/lib/data/paths";
import { withBasePath } from "@/lib/basePath";

const NAV_LINKS = [
  { href: "/", label: "Domů" },
  { href: "/investicni-prilezitosti", label: "Investiční příležitosti" },
  { href: "/jak-investujeme", label: "Jak investujeme" },
  { href: "/o-nas", label: "O nás" },
  { href: "/reference", label: "Reference" },
  { href: "/magazin", label: "Magazín" },
  { href: "/kontakt", label: "Kontakt" },
];

const LEGAL_LINKS = [
  { href: "/gdpr", label: "GDPR" },
  { href: "/cookies", label: "Cookies" },
  { href: "/obchodni-podminky", label: "Obchodní podmínky" },
];

export function Footer() {
  return (
    <footer className="bg-navy text-snow">
      <div className="mx-auto max-w-[var(--max-w)] px-[var(--gutter)] py-[var(--space-11)]">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
          <div className="flex flex-col gap-5">
            <Image
              src={withBasePath("/brand/logo-horizontal-white.svg")}
              alt="Vynosium"
              width={140}
              height={37}
              className="h-[28px] w-auto"
            />
            <p className="text-label text-slate">CHYTRÁ CESTA K VÝNOSŮM</p>
            <p className="text-sm text-slate">
              Praha, Česká republika
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <p className="text-label text-slate">Navigace</p>
            {NAV_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className="focus-ring text-sm text-snow/80 hover:text-snow">
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex flex-col gap-3">
            <p className="text-label text-slate">Investiční cesty</p>
            {INVESTMENT_PATHS.map((path) => (
              <Link
                key={path.id}
                href={`/${path.slug}`}
                className="focus-ring flex items-center gap-2 text-sm text-snow/80 hover:text-snow"
              >
                <span
                  className="h-1.5 w-1.5 shrink-0 rounded-full"
                  style={{ background: `var(--color-${path.colorVar})` }}
                  aria-hidden="true"
                />
                {path.label}
              </Link>
            ))}
          </div>

          <div className="flex flex-col gap-3">
            <p className="text-label text-slate">Kontakt</p>
            <a href="tel:+420000000000" className="focus-ring text-sm text-snow/80 hover:text-snow">
              +420 000 000 000
            </a>
            <a href="mailto:info@vynosium.cz" className="focus-ring text-sm text-snow/80 hover:text-snow">
              info@vynosium.cz
            </a>
            <div className="flex gap-4 pt-1">
              <a href="#" className="focus-ring text-sm text-snow/80 hover:text-snow" aria-label="LinkedIn">
                LinkedIn
              </a>
              <a href="#" className="focus-ring text-sm text-snow/80 hover:text-snow" aria-label="Instagram">
                Instagram
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t" style={{ borderColor: "rgba(72,101,129,.4)" }}>
        <div className="mx-auto flex max-w-[var(--max-w)] flex-col-reverse items-center justify-between gap-4 px-[var(--gutter)] py-6 sm:flex-row">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {LEGAL_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className="focus-ring text-xs text-slate hover:text-snow">
                {link.label}
              </Link>
            ))}
            <span className="text-xs text-slate">© 2026 Vynosium</span>
          </div>
          <p className="text-xs text-slate">Vynosium je součástí skupiny Real Luxembourg.</p>
        </div>
      </div>
    </footer>
  );
}
