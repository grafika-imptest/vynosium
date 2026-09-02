/**
 * Institutions shown in the hero's right column.
 *
 * PLACEHOLDERS. All four are real, named companies, so this strip makes a
 * claim about somebody else's business every time it renders. Nothing here
 * says what any of them does for Vynosium, on purpose: the roles were not
 * supplied and inventing them ("financing", "fund administration") would be
 * putting words in a bank's mouth.
 *
 * Before this goes anywhere public it needs, from the client, confirmation
 * that each relationship exists and may be shown.
 *
 * The files are the client's own white SVGs, prepared by
 * scripts/prepare-partner-logos.mjs — three copied through, the Equity
 * Solutions one inverted, because the supplied file is a negative (a white
 * tile with the wordmark knocked out of it) and would have rendered as a
 * white blob beside three transparent marks.
 *
 * `renderHeight` is optical, not mathematical: Audit One is a single line of
 * caps and the other three stack two lines, so matching their box heights
 * would leave Audit One's letters half again as tall as everyone else's.
 * These heights match the letters, not the boxes.
 */
export type Partner = {
  name: string;
  src: string;
  /** Intrinsic size, from the file's viewBox. */
  width: number;
  height: number;
  /** CSS height at lg and up; phones scale it down (see --logo-scale). */
  renderHeight: number;
};

export const PARTNERS: Partner[] = [
  { name: "Audit One", src: "/brand/partners/audit-one.svg", width: 1132, height: 195, renderHeight: 15 },
  { name: "AVANT investiční společnost", src: "/brand/partners/avant.svg", width: 640, height: 211, renderHeight: 21 },
  {
    name: "Česká spořitelna",
    src: "/brand/partners/ceska-sporitelna.svg",
    width: 542,
    height: 244,
    renderHeight: 23,
  },
  {
    name: "Equity Solutions",
    src: "/brand/partners/equity-solutions.svg",
    width: 327,
    height: 157,
    renderHeight: 21,
  },
];
