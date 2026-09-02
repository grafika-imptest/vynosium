import type { ReactNode } from "react";
import { SectionIndex } from "@/components/ui/primitives";

/**
 * Shared subpage opening. Light by default (document mode); `tone="dark"`
 * is used where a page opens on a navy hero.
 */
export function PageIntro({
  label,
  title,
  lede,
  tone = "light",
  children,
}: {
  label: string;
  title: string;
  lede?: string;
  tone?: "light" | "dark";
  children?: ReactNode;
}) {
  const dark = tone === "dark";
  return (
    <section
      className={`relative z-[2] ${dark ? "bg-navy" : "bg-white"} pb-[var(--space-9)] pt-[calc(var(--space-12)+40px)]`}
    >
      <div className="mx-auto max-w-[var(--max-w)] px-[var(--gutter)]">
        <SectionIndex label={label} tone={dark ? "dark" : "light"} />
        <h1 className={`text-display-lg mt-6 max-w-[22ch] ${dark ? "text-snow" : "text-navy"}`}>
          {title}
        </h1>
        {lede && (
          <p className={`text-lede mt-6 max-w-[64ch] ${dark ? "text-slate-on-dark" : "text-text-secondary"}`}>
            {lede}
          </p>
        )}
        {children}
      </div>
    </section>
  );
}
