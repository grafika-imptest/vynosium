"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { SITE } from "@/lib/data/site";

/**
 * Sticky mobile CTA bar (§4.5). Appears after 40 % of the page has been
 * scrolled. Visibility is toggled by writing a data attribute from the
 * scroll listener — no React state, no re-render while scrolling.
 */
export function MobileCta() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => {
      const bar = barRef.current;
      if (!bar) return;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? window.scrollY / max : 0;
      bar.dataset.visible = String(progress > 0.4);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      ref={barRef}
      data-visible="false"
      className="fixed inset-x-0 bottom-0 z-[120] translate-y-full border-t border-steel/40 bg-navy/95 backdrop-blur-md transition-transform duration-[var(--dur-ui)] data-[visible=true]:translate-y-0 lg:hidden"
      style={{
        transitionTimingFunction: "var(--ease-out)",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      <div className="flex h-16 items-center gap-3 px-[var(--gutter)]">
        <a
          href={SITE.phoneHref}
          className="focus-ring flex h-11 flex-1 items-center justify-center rounded-[var(--radius-pill)] border border-snow/50 text-sm text-snow no-underline"
        >
          Zavolat
        </a>
        <Link
          href="/kontakt"
          className="focus-ring flex h-11 flex-[1.4] items-center justify-center rounded-[var(--radius-pill)] bg-emerald-cta text-sm font-medium text-white no-underline"
        >
          Nezávazná konzultace
        </Link>
      </div>
    </div>
  );
}
