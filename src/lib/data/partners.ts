/**
 * Institutions shown in the strip under the credibility numbers.
 *
 * PLACEHOLDERS. These four logos were supplied as stand-ins, and all four are
 * real, named companies - so the strip makes a claim about somebody else's
 * business every time it renders. Nothing here says what any of them does for
 * Vynosium, on purpose: the roles were not supplied and inventing them
 * ("financing", "fund administration") would be putting words in a bank's
 * mouth. The copy in PartnerStrip names the categories the chain needs and
 * lets the logos stand as a set.
 *
 * Before this goes anywhere public it needs, from the client: confirmation
 * that each relationship exists and may be shown, and ideally transparent SVG
 * or high-resolution files. Two of these are 80-325px raster tiles, which is
 * why the strip caps the render size instead of scaling them up.
 *
 * `renderHeight` is optical, not mathematical. Four marks at one shared
 * height look wrong when one is a 5:1 wordmark and another is a square tile -
 * the square reads as a third of the area. These heights balance them by eye;
 * intrinsic dimensions come from the prepared files (scripts/prepare-partner-logos.ps1).
 */
export type Partner = {
  name: string;
  src: string;
  /** Intrinsic pixels of the prepared file. */
  width: number;
  height: number;
  /** CSS height in the strip, chosen so the marks carry similar visual weight. */
  renderHeight: number;
};

export const PARTNERS: Partner[] = [
  { name: "Audit One", src: "/brand/partners/audit-one.png", width: 198, height: 39, renderHeight: 26 },
  { name: "AVANT", src: "/brand/partners/avant.png", width: 290, height: 96, renderHeight: 34 },
  {
    name: "Česká spořitelna",
    src: "/brand/partners/ceska-sporitelna.png",
    width: 325,
    height: 155,
    renderHeight: 50,
  },
  {
    name: "Equity Solutions",
    src: "/brand/partners/equity-solutions.png",
    width: 80,
    height: 81,
    renderHeight: 52,
  },
];
