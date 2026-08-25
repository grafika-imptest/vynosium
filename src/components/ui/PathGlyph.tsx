/**
 * Abstract geometric glyphs derived from the monogram's ascending vector —
 * design.md §3/09 explicitly bans real-estate iconography (house, key,
 * roof, handshake). Each glyph is 24px, 1.5px stroke, no perspective.
 */

const common = {
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

/** 01 · Zhodnotit byt — vzestupná úsečka se zlomem */
function AscendGlyph() {
  return (
    <svg {...common}>
      <path d="M3.5 17L9 11.5L12.5 14.5L20.5 5" />
      <path d="M14.5 5H20.5V11" />
    </svg>
  );
}

/** 02 · Pasivní příjem — opakující se horizontální takty */
function PulseGlyph() {
  return (
    <svg {...common}>
      <path d="M3.5 12H7" />
      <path d="M7 12L9.5 6L13 18L15.5 12" />
      <path d="M15.5 12H20.5" />
    </svg>
  );
}

/** 03 · Zhodnocení kapitálu — plná plocha v obrysu */
function BlockGlyph() {
  return (
    <svg {...common}>
      <rect x="4" y="4" width="16" height="16" rx="1" />
      <path d="M4 14L10 8L14 12L20 6" fill="none" />
    </svg>
  );
}

/** 04 · Budování majetku — tři narůstající moduly */
function StackGlyph() {
  return (
    <svg {...common}>
      <rect x="4" y="14" width="4.5" height="6" />
      <rect x="10" y="9.5" width="4.5" height="10.5" />
      <rect x="16" y="4.5" width="4.5" height="15.5" />
    </svg>
  );
}

const GLYPHS = {
  ascend: AscendGlyph,
  pulse: PulseGlyph,
  block: BlockGlyph,
  stack: StackGlyph,
};

export function PathGlyph({ glyph }: { glyph: keyof typeof GLYPHS }) {
  const Component = GLYPHS[glyph];
  return <Component />;
}
