"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { MobileMenu } from "@/components/layout/MobileMenu";

const NAV_LINKS = [
  { href: "/", label: "Domů" },
  { href: "/investicni-prilezitosti", label: "Investiční příležitosti" },
  { href: "/jak-investujeme", label: "Jak investujeme" },
  { href: "/o-nas", label: "O nás" },
  { href: "/reference", label: "Reference" },
  { href: "/magazin", label: "Magazín" },
  { href: "/kontakt", label: "Kontakt" },
];

/**
 * Fixed nav. On homepage it starts transparent over the dark Hero; on
 * light subpages it starts in the light variant per design.md §4.1. Past
 * 80px scroll it always compacts into the navy/blur bar so it stays
 * legible over whatever section is currently underneath it.
 */
export function Header({ startVariant = "dark" }: { startVariant?: "dark" | "light" }) {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [progress, setProgress] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      const y = window.scrollY;
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(1, Math.max(0, y / max)) : 0);
      setScrolled(y > 80);

      const delta = y - lastY.current;
      if (Math.abs(delta) > 12) {
        setHidden(delta > 0 && y > 160);
        lastY.current = y;
      }
      raf = requestAnimationFrame(update);
    };
    raf = requestAnimationFrame(update);
    return () => cancelAnimationFrame(raf);
  }, []);

  const dark = scrolled ? true : startVariant === "dark";

  return (
    <>
      <header
        className="fixed inset-x-0 top-0 z-50 transition-transform duration-350"
        style={{
          transform: hidden ? "translateY(-100%)" : "translateY(0)",
          transitionDuration: "350ms",
          transitionTimingFunction: "cubic-bezier(.22,1,.36,1)",
        }}
      >
        <div
          className="transition-[height,background-color,backdrop-filter] duration-350"
          style={{
            height: scrolled ? 64 : 88,
            background: scrolled ? "rgba(16,42,67,0.72)" : dark ? "transparent" : "var(--color-white)",
            backdropFilter: scrolled ? "blur(20px) saturate(140%)" : undefined,
            borderBottom: scrolled
              ? "1px solid rgba(72,101,129,0.4)"
              : dark
                ? "1px solid transparent"
                : "1px solid var(--color-light-gray)",
            transitionTimingFunction: "cubic-bezier(.22,1,.36,1)",
          }}
        >
          <div className="mx-auto flex h-full max-w-[var(--max-w)] items-center justify-between px-[var(--gutter)]">
            <div className="flex items-center gap-4">
              <Link href="/" className="focus-ring shrink-0" aria-label="Vynosium — domů">
                <Image
                  src={dark ? "/brand/logo-horizontal-white.svg" : "/brand/logo-horizontal-color.svg"}
                  alt="Vynosium"
                  width={132}
                  height={35}
                  priority
                  className="h-[26px] w-auto"
                />
              </Link>
              <div
                className="hidden items-center gap-4 min-[1180px]:flex"
                style={{ borderLeft: dark ? "1px solid var(--color-steel)" : "1px solid var(--color-light-gray)" }}
              >
                <span
                  className="pl-4 text-[10px] font-medium"
                  style={{ letterSpacing: "0.22em", color: dark ? "#9fb3c8" : "var(--color-text-muted)" }}
                >
                  CHYTRÁ CESTA K VÝNOSŮM
                </span>
              </div>
            </div>

            <nav className="hidden items-center gap-7 lg:flex" aria-label="Hlavní navigace">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="focus-ring group relative py-2 text-sm tracking-[0.02em]"
                  style={{ color: dark ? "rgba(248,248,248,0.72)" : "var(--color-navy)" }}
                >
                  {link.label}
                  <span
                    className="absolute -bottom-0.5 left-0 h-px w-0 bg-emerald transition-[width] duration-300 group-hover:w-full"
                    aria-hidden="true"
                  />
                </Link>
              ))}
            </nav>

            <div className="hidden items-center gap-5 lg:flex">
              <a
                href="tel:+420000000000"
                className="focus-ring text-sm"
                style={{ color: dark ? "rgba(248,248,248,0.72)" : "var(--color-navy)" }}
              >
                +420 000 000 000
              </a>
              <Link
                href="/kontakt"
                className="focus-ring inline-flex min-h-12 items-center rounded-[9999px] bg-emerald px-6 text-[15px] font-medium text-white transition-colors hover:bg-emerald-hover"
              >
                Nezávazná konzultace
              </Link>
            </div>

            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="focus-ring flex h-11 w-11 items-center justify-center lg:hidden"
              aria-label="Otevřít menu"
              aria-expanded={mobileOpen}
            >
              <BurgerIcon dark={dark} />
            </button>
          </div>
        </div>

        <div className="h-px w-full" style={{ background: "var(--color-line-deep)" }}>
          <div
            className="h-px"
            style={{
              width: `${progress * 100}%`,
              background: "linear-gradient(90deg, #102a43, #1f8a70)",
            }}
          />
        </div>
      </header>

      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} links={NAV_LINKS} />
    </>
  );
}

function BurgerIcon({ dark }: { dark: boolean }) {
  const color = dark ? "#F8F8F8" : "#102A43";
  return (
    <svg width="22" height="16" viewBox="0 0 22 16" fill="none" aria-hidden="true">
      <path d="M0 1H22" stroke={color} strokeWidth="1.5" />
      <path d="M0 8H22" stroke={color} strokeWidth="1.5" />
      <path d="M0 15H22" stroke={color} strokeWidth="1.5" />
    </svg>
  );
}
