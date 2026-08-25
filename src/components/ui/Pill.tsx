import Link from "next/link";
import type { ReactNode } from "react";

type PillVariant = "emerald" | "ghost-dark" | "ghost-light";

const base =
  "focus-ring inline-flex min-h-12 items-center justify-center gap-2 rounded-[9999px] px-7 py-3.5 text-[15px] font-medium transition-colors duration-[180ms] no-underline";

const variants: Record<PillVariant, string> = {
  emerald:
    "bg-emerald text-white hover:bg-emerald-hover active:bg-emerald-active",
  "ghost-dark": "border border-snow/50 text-snow hover:border-snow hover:text-snow",
  "ghost-light": "border border-steel text-navy hover:border-navy",
};

export function Pill({
  href,
  variant = "emerald",
  children,
  className = "",
  onClick,
  type,
}: {
  href?: string;
  variant?: PillVariant;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit";
}) {
  const classes = `${base} ${variants[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type ?? "button"} onClick={onClick} className={classes}>
      {children}
    </button>
  );
}
