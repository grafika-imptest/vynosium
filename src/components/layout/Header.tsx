"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { useHeaderVariant } from "@/components/layout/HeaderVariantContext";
import { SITE } from "@/lib/data/site";
import { withBasePath } from "@/lib/seo";

/** Real navigation, not anchors — the brief requires it for credibility. */
export const NAV_LINKS = [
  { href: "/investicni-prilezitosti", label: "Investiční příležitosti" },
  { href: "/jak-investujeme", label: "Jak investujeme" },
  { href: "/o-nas", label: "O nás" },
  { href: "/reference", label: "Reference" },
  { href: "/magazin", label: "Magazín" },
  { href: "/kontakt", label: "Kontakt" },
];

/**
 * Adaptive header (§4.1).
 *
 * Scroll state is written straight to the DOM from the scroll listener —
 * collapsing the bar, hiding on scroll-down, revealing on scroll-up and
 * filling the progress line. None of it goes through React state, so
 * scrolling never schedules a render.
 */
export function Header() {
  const { variant } = useHeaderVariant();
  const dark = variant === "dark";
  const pathname = usePathname();

  const barRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    let lastY = window.scrollY;
    let hidden = false;
    let collapsed = false;

    const onScroll = () => {
      const bar = barRef.current;
      const inner = innerRef.current;
      if (!bar || !inner) return;

      const y = window.scrollY;
      const shouldCollapse = y > 80;

      if (shouldCollapse !== collapsed) {
        collapsed = shouldCollapse;
        inner.dataset.collapsed = String(collapsed);
      }

      // 12px threshold keeps the bar from flickering on jitter.
      if (Math.abs(y - lastY) > 12) {
        const shouldHide = y > lastY && y > 240 && !menuOpen;
        if (shouldHide !== hidden) {
          hidden = shouldHide;
          bar.style.transform = hidden ? "translateY(-100%)" : "translateY(0)";
        }
        lastY = y;
      }

      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? Math.min(y / max, 1) : 0;
      if (progressRef.current) progressRef.current.style.transform = `scaleX(${progress})`;
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [menuOpen]);

  return (
    <>
      <header
        ref={barRef}
        className="fixed inset-x-0 top-0 z-[100] transition-transform duration-[var(--dur-ui)]"
        style={{ transitionTimingFunction: "var(--ease-out)" }}
      >
        <div
          ref={innerRef}
          data-collapsed="false"
          className={`group/bar h-22 transition-[height,background-color,backdrop-filter] duration-[var(--dur-ui)] data-[collapsed=true]:h-16 ${
            dark
              ? "border-b border-transparent data-[collapsed=true]:border-steel/40 data-[collapsed=true]:bg-navy/72 data-[collapsed=true]:backdrop-blur-[20px] data-[collapsed=true]:backdrop-saturate-[140%]"
              : "border-b border-light-gray bg-white"
          }`}
        >
          <div className="mx-auto flex h-full max-w-[var(--max-w)] items-center justify-between px-[var(--gutter)]">
            <div className="flex items-center gap-4">
              <Link href="/" className="focus-ring shrink-0" aria-label={`${SITE.name} — domů`}>
                <Image
                  src={withBasePath(
                    dark ? "/brand/logo-horizontal-white.svg" : "/brand/logo-horizontal-color.svg"
                  )}
                  alt={SITE.name}
                  width={132}
                  height={35}
                  priority
                  className="h-[26px] w-auto"
                />
              </Link>
              {/* Claim is dropped below 1180px — it must never wrap. */}
              <span
                className={`text-label hidden border-l pl-4 min-[1180px]:inline-block ${
                  dark ? "border-steel text-[#9fb3c8]" : "border-light-gray text-text-muted"
                }`}
                style={{ letterSpacing: "0.22em", fontSize: "10px" }}
              >
                {SITE.claim}
              </span>
            </div>

            <nav className="hidden items-center gap-7 lg:flex" aria-label="Hlavní navigace">
              {NAV_LINKS.map((link) => {
                const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={`focus-ring group relative text-sm no-underline transition-opacity duration-[var(--dur-micro)] ${
                      dark ? "text-snow" : "text-navy"
                    } ${active ? "opacity-100" : "opacity-[0.72] hover:opacity-100"}`}
                    style={{ letterSpacing: "0.02em" }}
                  >
                    {link.label}
                    {/* 1px emerald underline grows from the left */}
                    <span
                      className={`absolute -bottom-1.5 left-0 h-px w-full origin-left bg-emerald transition-transform duration-300 ${
                        active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                      }`}
                      style={{ transitionTimingFunction: "var(--ease-out)" }}
                    />
                  </Link>
                );
              })}
            </nav>

            <div className="hidden items-center gap-5 lg:flex">
              <a
                href={SITE.phoneHref}
                className={`focus-ring text-sm no-underline ${dark ? "text-snow/72" : "text-navy"}`}
              >
                {SITE.phone}
              </a>
              <Link
                href="/kontakt"
                className="focus-ring inline-flex min-h-12 items-center rounded-[var(--radius-pill)] bg-emerald-cta px-6 text-[15px] font-medium text-white no-underline transition-colors duration-[var(--dur-micro)] hover:bg-emerald-cta-hover"
              >
                Nezávazná konzultace
              </Link>
            </div>

            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Otevřít menu"
              aria-expanded={menuOpen}
              className={`focus-ring flex h-11 w-11 flex-col items-center justify-center gap-1.5 lg:hidden ${
                dark ? "text-snow" : "text-navy"
              }`}
            >
              <span className="block h-px w-6 bg-current" />
              <span className="block h-px w-6 bg-current" />
            </button>
          </div>

          {/* Progress line — the only permanently visible gradient (§4.1). */}
          <div
            ref={progressRef}
            aria-hidden="true"
            className="h-px w-full origin-left scale-x-0"
            style={{ background: "var(--gradient-core)" }}
          />
        </div>
      </header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
