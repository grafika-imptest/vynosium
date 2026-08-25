"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { gsap, ensureGsapRegistered, prefersReducedMotion } from "@/lib/motion";
import { INVESTMENT_PATHS } from "@/lib/data/paths";

type NavLink = { href: string; label: string };

export function MobileMenu({
  open,
  onClose,
  links,
}: {
  open: boolean;
  onClose: () => void;
  links: NavLink[];
}) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<HTMLAnchorElement[]>([]);

  useEffect(() => {
    ensureGsapRegistered();
    const el = overlayRef.current;
    if (!el) return;

    if (open) {
      document.body.style.overflow = "hidden";
      if (prefersReducedMotion()) {
        gsap.set(el, { clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)" });
        gsap.set(linksRef.current, { opacity: 1, y: 0 });
        return;
      }
      const tl = gsap.timeline();
      tl.fromTo(
        el,
        { clipPath: "polygon(0% 0%, 0% 0%, -30% 100%, 0% 100%)" },
        {
          clipPath: "polygon(0% 0%, 130% 0%, 100% 100%, 0% 100%)",
          duration: 0.9,
          ease: "expo.inOut",
        }
      ).to(
        linksRef.current,
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.06, ease: "power2.out" },
        "-=0.35"
      );
    } else {
      document.body.style.overflow = "";
      gsap.set(linksRef.current, { opacity: 0, y: 28 });
    }
  }, [open]);

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[60] bg-navy lg:hidden"
      style={{
        clipPath: "polygon(0% 0%, 0% 0%, -30% 100%, 0% 100%)",
        visibility: open ? "visible" : "hidden",
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Hlavní menu"
    >
      <div className="flex h-full flex-col justify-between px-[var(--gutter)] pt-8 pb-[env(safe-area-inset-bottom)]">
        <div className="flex items-center justify-between">
          <span className="text-label text-slate">MENU</span>
          <button
            type="button"
            onClick={onClose}
            className="focus-ring flex h-11 w-11 items-center justify-center"
            aria-label="Zavřít menu"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M1 1L19 19" stroke="#F8F8F8" strokeWidth="1.5" />
              <path d="M19 1L1 19" stroke="#F8F8F8" strokeWidth="1.5" />
            </svg>
          </button>
        </div>

        <nav className="flex flex-col gap-1" aria-label="Menu">
          {links.map((link, i) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={onClose}
              ref={(node) => {
                if (node) linksRef.current[i] = node;
              }}
              className="focus-ring border-b border-steel/30 py-3 text-[28px] text-snow opacity-0"
              style={{ transform: "translateY(28px)" }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex flex-col gap-6 pb-8">
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            {INVESTMENT_PATHS.map((path) => (
              <Link
                key={path.id}
                href={`/${path.slug}`}
                onClick={onClose}
                className="focus-ring flex items-center gap-2 text-sm text-slate"
              >
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ background: `var(--color-${path.colorVar})` }}
                  aria-hidden="true"
                />
                {path.label}
              </Link>
            ))}
          </div>
          <Link
            href="/kontakt"
            onClick={onClose}
            className="focus-ring inline-flex min-h-12 items-center justify-center rounded-[9999px] bg-emerald px-6 text-[15px] font-medium text-white"
          >
            Nezávazná konzultace
          </Link>
        </div>
      </div>
    </div>
  );
}
