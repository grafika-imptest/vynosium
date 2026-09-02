"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { useHeaderVariant } from "@/components/layout/HeaderVariantContext";
import { PathTile } from "@/components/ui/primitives";
import { INVESTMENT_PATHS } from "@/lib/data/paths";
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
          <div className="nav-bar relative mx-auto flex h-full max-w-[var(--max-w)] items-center justify-between px-[var(--gutter)]">
            {/*
              Claim under the mark, not beside it. On one line it was as wide
              as the logo and pushed the navigation, which is why it used to
              be broken into two lines and dropped below 1180px; stacked, it
              costs no width at all and reads as one line again.

              The artwork stays claim-free and the claim stays live text: it
              keeps its own letter-spacing, takes the header's colour variant,
              and stays selectable and translatable.
            */}
            <div className="flex shrink-0 flex-col gap-1.5">
              <Link href="/" className="focus-ring" aria-label={`${SITE.name} — domů`}>
                <Image
                  src={withBasePath(
                    dark ? "/brand/logo-navbar-white.svg" : "/brand/logo-navbar-color.svg"
                  )}
                  alt={SITE.name}
                  width={185}
                  height={35}
                  priority
                  className="h-7 w-auto"
                />
              </Link>
              <span
                className={`text-label hidden whitespace-nowrap md:inline-block ${
                  dark ? "text-[#9fb3c8]" : "text-text-muted"
                }`}
                style={{ letterSpacing: "0.22em", fontSize: "10px" }}
              >
                {SITE.claim}
              </span>
            </div>

            <nav className="hidden items-center gap-7 lg:flex" aria-label="Hlavní navigace">
              {/*
                The four strategies are the site's first question — "which of
                these are you?" — so they lead the navigation rather than
                waiting inside a page. The panel repeats the selector's own
                glyph and token per path, the same pair the footer uses: a
                visitor who has seen the section recognises the colour, and
                one who has not is not being asked to learn a code.

                Hover and focus open it in CSS. There is no state, no timer
                and nothing to leave stuck open; the trigger's own padding
                bridges the gap to the panel, so the pointer never crosses
                dead space on the way down.
              */}
              <Link
                href="/#rozcestnik"
                className={`paths-trigger focus-ring group relative block py-2 text-sm no-underline transition-opacity duration-[var(--dur-micro)] ${
                  dark ? "text-snow" : "text-navy"
                } opacity-[0.72] hover:opacity-100`}
                style={{ letterSpacing: "0.02em" }}
              >
                Investiční cesty
                <span
                  className="absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-emerald transition-transform duration-300 group-hover:scale-x-100"
                  style={{ transitionTimingFunction: "var(--ease-out)" }}
                />
              </Link>

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

            {/*
              No phone number here: the reference navbar carries one action,
              and the number stays reachable in the footer and in the sticky
              mobile bar, where tapping it actually makes a call.
            */}
            <div className="hidden items-center lg:flex">
              <Link
                href="/kontakt"
                className="focus-ring inline-flex min-h-12 items-center whitespace-nowrap rounded-[var(--radius-pill)] bg-emerald-cta px-6 text-[15px] font-medium text-white no-underline transition-colors duration-[var(--dur-micro)] hover:bg-emerald-cta-hover"
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

            {/*
              The panel spans the header's own width instead of hanging under
              the trigger. Centred on a nav item it ran off the left edge at
              1600 and would have run off the right at 1024; anchored to the
              container it cannot do either at any width.

              It opens from the trigger through :has() rather than from a
              wrapper, which is what lets it live out here. It stays open
              while the pointer is inside it (its own :hover) and while a
              keyboard is inside it (focus-within), and the panel's top
              padding covers the gap under the bar so the pointer never
              crosses dead space.
            */}
            <div className="paths-panel absolute inset-x-[var(--gutter)] top-full z-[110] max-lg:hidden">
              <div className="mt-3 grid grid-cols-4 gap-2 rounded-[var(--radius-card)] border border-steel/50 bg-navy p-3">
                {INVESTMENT_PATHS.map((path) => (
                  <Link
                    key={path.id}
                    href={`/${path.slug}`}
                    className="focus-ring flex flex-col gap-3 rounded-[8px] border border-transparent p-4 no-underline transition-colors duration-[var(--dur-micro)] hover:border-[color:var(--card-accent)] hover:bg-white/[0.04]"
                    style={{ "--card-accent": `var(--color-path-${path.id})` } as React.CSSProperties}
                  >
                    <PathTile path={path.id} />
                    {/* Goal first here too — this menu is where a first-time
                        visitor picks, and they pick by what they want. */}
                    <span className="text-[15px] text-snow">{path.goal}</span>
                    <span className="text-label text-label-wrap text-slate-on-dark">{path.label}</span>
                    <span className="text-body-sm text-slate-on-dark">{path.goalMechanic}</span>
                    <span
                      className="text-label text-label-wrap mt-auto"
                      style={{ color: `var(--color-path-${path.id}-on-dark)` }}
                    >
                      {path.metrics[0].label} {path.metrics[0].value}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
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
