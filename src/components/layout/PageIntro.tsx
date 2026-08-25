import { SectionIndex } from "@/components/ui/SectionIndex";

/**
 * Shared light-surface page header for subpages that aren't the cinematic
 * navy Hero — White background, hairline rule, index label. Keeps every
 * subpage's opening beat consistent without re-deriving the pattern.
 */
export function PageIntro({
  index,
  label,
  title,
  lede,
  children,
}: {
  index: string;
  label: string;
  title: string;
  lede?: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="bg-white pb-12 pt-36">
      <div className="mx-auto max-w-[var(--max-w)] border-b border-light-gray px-[var(--gutter)] pb-12">
        <SectionIndex index={index} label={label} tone="light" className="mb-6" />
        <h1 className="text-display-lg max-w-[18ch] text-navy">{title}</h1>
        {lede && <p className="text-lede mt-5 max-w-[56ch] text-text-secondary">{lede}</p>}
        {children}
      </div>
    </section>
  );
}
