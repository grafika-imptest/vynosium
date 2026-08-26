import Link from "next/link";
import type { ReactNode } from "react";
import type { InvestmentPath } from "@/lib/tokens";

/* ============================================================================
   Shared primitives (§4.5). Every one of these is shadowless by
   construction: structure comes from 1px hairlines and the two radii.
   ========================================================================== */

type PillVariant = "emerald" | "ghost-dark" | "ghost-light";

const PILL_BASE =
  "focus-ring inline-flex min-h-12 items-center justify-center gap-2 whitespace-nowrap rounded-[var(--radius-pill)] px-7 text-[15px] font-medium no-underline transition-all duration-[var(--dur-micro)]";

const PILL_VARIANTS: Record<PillVariant, string> = {
  emerald:
    "bg-emerald-cta text-white hover:bg-emerald-cta-hover hover:-translate-y-px active:bg-emerald-active",
  "ghost-dark": "border border-snow/50 text-snow hover:border-snow",
  "ghost-light": "border border-steel text-navy hover:border-navy",
};

export function Pill({
  href,
  variant = "emerald",
  children,
  className = "",
  external = false,
}: {
  href: string;
  variant?: PillVariant;
  children: ReactNode;
  className?: string;
  external?: boolean;
}) {
  const classes = `${PILL_BASE} ${PILL_VARIANTS[variant]} ${className}`;
  if (external || href.startsWith("tel:") || href.startsWith("mailto:") || href.startsWith("#")) {
    return (
      <a href={href} className={classes}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}

export function ButtonPill({
  onClick,
  variant = "emerald",
  children,
  className = "",
  ...rest
}: {
  onClick?: () => void;
  variant?: PillVariant;
  children: ReactNode;
  className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`${PILL_BASE} ${PILL_VARIANTS[variant]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}

/**
 * Section index — `03 — ROZCESTNÍK`. Present on every major section: it
 * makes the site read as a document and reinforces the data thesis.
 */
export function SectionIndex({
  index,
  label,
  tone,
  className = "",
}: {
  index: string;
  label: string;
  tone: "dark" | "light";
  className?: string;
}) {
  return (
    <p className={`text-label ${tone === "dark" ? "text-silver" : "text-text-muted"} ${className}`}>
      {index} — {label}
    </p>
  );
}

/**
 * Mandatory legal line (§4.5). Always in the layout — never a tooltip,
 * never below the fold, always next to the numbers it qualifies.
 */
export function Disclaimer({
  children,
  tone = "light",
  className = "",
}: {
  children: ReactNode;
  tone?: "light" | "dark";
  className?: string;
}) {
  return (
    <p className={`text-disclaimer ${tone === "dark" ? "text-silver" : "text-text-muted"} ${className}`}>
      {children}
    </p>
  );
}

/*
 * The ᴹ superscript that used to mark projected numbers is gone, removed at
 * the client's request: read at 9-11px next to a figure it looked like a
 * typo, not a caveat, and it was doing that on every card and every table.
 *
 * The `model: true` flags in the data are therefore currently unrendered.
 * They stay because they mirror the CMS field and say which rows are
 * projections; nothing on screen depends on them today.
 *
 * What carries the caveat now is the written disclaimer under every set of
 * model figures — the labels ("Modelový výnos", "Orientační výnos") plus
 * DISCLAIMERS.modelValues. If a future edit removes one of those blocks,
 * that page loses its grounding entirely, so they are not decoration.
 */

/**
 * Metric block (§4.5): label → value → basis. A naked number is never
 * allowed; the basis is what separates data from marketing.
 */
export function Metric({
  label,
  value,
  basis,
  tone = "dark",
  size = "md",
  accent,
}: {
  label: string;
  value: ReactNode;
  basis?: string;
  tone?: "dark" | "light";
  size?: "md" | "xl";
  accent?: string;
}) {
  return (
    <div>
      <p className={`text-label ${tone === "dark" ? "text-silver" : "text-text-muted"}`}>{label}</p>
      <p
        className={`${size === "xl" ? "text-metric-xl" : "text-metric"} mt-3 ${
          tone === "dark" ? "text-snow" : "text-navy"
        }`}
        style={accent ? { color: accent } : undefined}
      >
        {value}
      </p>
      {basis && (
        <p className={`text-label mt-3 ${tone === "dark" ? "text-slate-on-dark" : "text-text-muted"}`}>{basis}</p>
      )}
    </div>
  );
}

/**
 * Strategy badge: 1px token line + 6px dot + 11px uppercase label.
 *
 * The label takes the surface-specific text variant of the token (11px has
 * to clear 4.5:1); the line and the dot keep the pure token, where
 * contrast ratios do not apply.
 */
export function PathBadge({
  path,
  label,
  tone = "light",
}: {
  path: InvestmentPath;
  label: string;
  tone?: "light" | "dark";
}) {
  return (
    <span
      className="text-label inline-flex items-center gap-2 rounded-[var(--radius-pill)] border px-3 py-1.5"
      style={{
        borderColor: `var(--color-path-${path})`,
        color: `var(--color-path-${path}-on-${tone})`,
      }}
    >
      <span
        className="inline-block h-1.5 w-1.5 rounded-full"
        style={{ background: `var(--color-path-${path})` }}
      />
      {label}
    </span>
  );
}

/**
 * Status pill. Colour never carries meaning on its own — every state
 * ships with its text label.
 */
export function StatusPill({
  label,
  tone,
}: {
  label: string;
  tone: "open" | "last" | "closed" | "prepared";
}) {
  // Line and dot carry the raw state colour; the 11px label carries the
  // reading variant — Amber at #F59E0B is 2.15:1 on white.
  const { line, text } = {
    open: { line: "var(--color-emerald)", text: "var(--color-emerald-on-light)" },
    last: { line: "var(--color-fn-warning)", text: "var(--color-fn-warning-on-light)" },
    closed: { line: "var(--color-steel)", text: "var(--color-steel)" },
    prepared: { line: "var(--color-slate)", text: "var(--color-text-secondary)" },
  }[tone];

  return (
    <span
      className="text-label inline-flex items-center gap-2 rounded-[var(--radius-pill)] border px-3 py-1.5"
      style={{ borderColor: line, color: text }}
    >
      <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ background: line }} />
      {label}
    </span>
  );
}

/**
 * Abstract path glyph derived from the monogram (§3/03). No houses, keys,
 * roofs or skylines exist anywhere in this system.
 */
export function PathGlyph({ path, className = "" }: { path: InvestmentPath; className?: string }) {
  const common = {
    width: 24,
    height: 24,
    viewBox: "0 0 24 24",
    fill: "none",
    strokeWidth: 1.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    stroke: "currentColor",
    className,
    "aria-hidden": true,
  };

  switch (path) {
    // Rising line with a break — value lifted by an intervention.
    case "flip":
      return (
        <svg {...common}>
          <path d="M2 18 L9 13 L13 15 L22 5" />
          <path d="M22 10 V5 h-5" />
        </svg>
      );
    // Repeating bars — recurring income.
    case "income":
      return (
        <svg {...common}>
          <path d="M3 7h18M3 12h18M3 17h11" />
        </svg>
      );
    // Outlined mass — capital turned into an asset.
    case "capital":
      return (
        <svg {...common}>
          <path d="M4 20V8l8-4 8 4v12" />
          <path d="M4 20h16" />
        </svg>
      );
    // Three growing modules — a portfolio built in steps.
    case "wealth":
    default:
      return (
        <svg {...common}>
          <path d="M3 20V15h4v5" />
          <path d="M10 20V10h4v10" />
          <path d="M17 20V5h4v15" />
        </svg>
      );
  }
}

/**
 * Path glyph on a tinted tile — for lists where the four strategies sit
 * under each other and a 6px dot asks the reader to learn a colour code
 * before it means anything (footer, mobile menu).
 *
 * Distinct from PathBadge above, which is the labelled pill; this one is the
 * mark on its own. Structure is a 1px border and a radius, as everywhere
 * else: the system has no shadows, and a filled chip would read as a button.
 *
 * The var() names are composed at runtime, so the token and its reading
 * variant must live in `:root` — inside `@theme` Tailwind tree-shakes any
 * variable no generated utility references, and the glyph then silently
 * inherits body text.
 */
export function PathTile({
  path,
  tone = "dark",
  className = "",
}: {
  path: InvestmentPath;
  tone?: "light" | "dark";
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={`grid h-9 w-9 shrink-0 place-items-center rounded-[8px] border transition-colors duration-[var(--dur-micro)] ${className}`}
      style={{
        borderColor: `color-mix(in oklab, var(--color-path-${path}) 45%, transparent)`,
        background: `color-mix(in oklab, var(--color-path-${path}) 14%, transparent)`,
        color: `var(--color-path-${path}-on-${tone})`,
      }}
    >
      <PathGlyph path={path} className="h-[18px] w-[18px]" />
    </span>
  );
}

/** Hairline. The primary structural device of the whole site. */
export function Hairline({ tone = "light", className = "" }: { tone?: "dark" | "light"; className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`h-px w-full ${tone === "dark" ? "bg-steel/50" : "bg-light-gray"} ${className}`}
    />
  );
}
