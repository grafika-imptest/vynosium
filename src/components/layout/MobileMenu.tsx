"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { gsap, ensureGsapRegistered, prefersReducedMotion } from "@/lib/motion";
import { NAV_LINKS } from "@/components/layout/Header";
import { PathTile } from "@/components/ui/primitives";
import { INVESTMENT_PATHS } from "@/lib/data/paths";
import { SITE } from "@/lib/data/site";
import { withBasePath } from "@/lib/seo";

/**
 * Full-screen navy overlay opened with a clip-path wipe along 38.5°
 * (§4.1). Below the links sit the four paths, each with its own glyph and
 * token — the shortest route from a paid click to a converting landing page.
 */
export function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;
    ensureGsapRegistered();

    const reduced = prefersReducedMotion();

    if (open) {
      document.body.style.overflow = "hidden";
      overlay.style.pointerEvents = "auto";
      const items = listRef.current?.querySelectorAll("li") ?? [];

      if (reduced) {
        gsap.set(overlay, { autoAlpha: 1, clipPath: "none" });
        gsap.set(items, { autoAlpha: 1, y: 0 });
      } else {
        gsap
          .timeline()
          .set(overlay, { autoAlpha: 1 })
          .fromTo(
            overlay,
            { clipPath: "polygon(0 0, 0 0, -60% 100%, -60% 100%)" },
            {
              clipPath: "polygon(0 0, 160% 0, 100% 100%, -60% 100%)",
              duration: 0.6,
              ease: "expo.inOut",
            }
          )
          .fromTo(items, { y: 28, autoAlpha: 0 }, { y: 0, autoAlpha: 1, stagger: 0.06, duration: 0.4 }, "-=0.2");
      }
    } else {
      document.body.style.overflow = "";
      overlay.style.pointerEvents = "none";
      gsap.to(overlay, { autoAlpha: 0, duration: reduced ? 0 : 0.3 });
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-label="Hlavní menu"
      aria-hidden={!open}
      className="invisible fixed inset-0 z-[150] flex flex-col bg-navy opacity-0 lg:hidden"
    >
      <div className="flex h-22 items-center justify-between px-[var(--gutter)]">
        {/*
          The mark alone, no claim: the overlay covers the header, so this is
          the only thing saying whose menu this is, and the claim repeated
          here was competing with the navigation for the same line.
        */}
        <Link href="/" onClick={onClose} className="focus-ring shrink-0" aria-label={`${SITE.name} — domů`}>
          <Image
            src={withBasePath("/brand/logo-navbar-white.svg")}
            alt={SITE.name}
            width={185}
            height={35}
            className="h-7 w-auto"
          />
        </Link>
        <button
          type="button"
          onClick={onClose}
          aria-label="Zavřít menu"
          className="focus-ring flex h-11 w-11 items-center justify-center text-snow"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
            <path d="M4 4l12 12M16 4L4 16" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-[var(--gutter)] pb-8">
        <ul ref={listRef} className="flex flex-col gap-1">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                onClick={onClose}
                className="focus-ring text-display block border-b border-steel/40 py-4 text-snow no-underline"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <p className="text-label mt-8 text-silver">Investiční cesty</p>
        {/* Same glyph-and-token pair as the selector and the footer: on a
            phone this list is often the first place the four strategies are
            seen at all, so it has to name them, not colour-code them. */}
        <ul className="mt-4 flex flex-col gap-2">
          {INVESTMENT_PATHS.map((path) => (
            <li key={path.id}>
              <Link
                href={`/${path.slug}`}
                onClick={onClose}
                className="focus-ring flex min-h-11 items-center gap-3 text-[15px] text-snow no-underline"
              >
                <PathTile path={path.id} />
                {path.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div
        className="border-t border-steel/40 px-[var(--gutter)] py-5"
        style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 20px)" }}
      >
        <Link
          href="/kontakt"
          onClick={onClose}
          className="focus-ring flex min-h-12 w-full items-center justify-center whitespace-nowrap rounded-[var(--radius-pill)] bg-emerald-cta px-6 text-[15px] font-medium text-white no-underline"
        >
          Nezávazná konzultace
        </Link>
      </div>
    </div>
  );
}
