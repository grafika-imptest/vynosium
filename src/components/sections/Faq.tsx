"use client";

import { useState } from "react";
import { SectionIndex } from "@/components/ui/primitives";

/**
 * FAQ ledger (§3/12). Questions in the investor's language, answers of at
 * most three sentences.
 *
 * The risk question is open by default — transparency used as a weapon.
 * Height animates via a CSS grid-rows transition, so there is no JS
 * measurement and the hairline below never jumps.
 */
export function Faq({
  items,
  index,
  heading = "Co se investoři ptají nejčastěji",
  tone = "light",
}: {
  items: readonly { q: string; a: string; openByDefault?: boolean }[];
  index?: string;
  heading?: string;
  tone?: "light" | "dark";
}) {
  const [open, setOpen] = useState<Set<number>>(
    () => new Set(items.map((item, i) => (item.openByDefault ? i : -1)).filter((i) => i >= 0))
  );

  const dark = tone === "dark";

  const toggle = (i: number) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });

  return (
    <section className={`relative z-[2] py-[var(--space-10)] ${dark ? "bg-navy" : "bg-white"}`}>
      <div className="mx-auto max-w-[var(--max-w)] px-[var(--gutter)]">
        <SectionIndex index={index} label="OTÁZKY" tone={dark ? "dark" : "light"} />
        <h2 className={`text-display mt-6 max-w-[20ch] ${dark ? "text-snow" : "text-navy"}`}>{heading}</h2>

        <ul className="mt-12 max-w-[68ch]">
          {items.map((item, i) => {
            const isOpen = open.has(i);
            return (
              <li
                key={item.q}
                className={`border-b ${
                  dark
                    ? isOpen
                      ? "border-emerald"
                      : "border-steel/40"
                    : isOpen
                      ? "border-emerald"
                      : "border-light-gray"
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggle(i)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-panel-${i}`}
                  id={`faq-button-${i}`}
                  className={`focus-ring flex min-h-14 w-full items-start justify-between gap-6 py-5 text-left ${
                    dark ? "text-snow" : "text-navy"
                  }`}
                >
                  <span className="text-subheading">{item.q}</span>
                  <span
                    aria-hidden="true"
                    className={`text-data mt-1 shrink-0 ${isOpen ? (dark ? "text-emerald-on-dark" : "text-emerald-on-light") : dark ? "text-slate-on-dark" : "text-text-muted"}`}
                  >
                    {isOpen ? "−" : "+"}
                  </span>
                </button>

                <div className="accordion-body" data-open={isOpen}>
                  <div>
                    <p
                      id={`faq-panel-${i}`}
                      role="region"
                      aria-labelledby={`faq-button-${i}`}
                      className={`text-body pb-6 ${dark ? "text-slate-on-dark" : "text-text-secondary"}`}
                    >
                      {item.a}
                    </p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
