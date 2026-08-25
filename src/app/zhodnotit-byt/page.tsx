import type { Metadata } from "next";
import { LandingTemplate } from "@/components/sections/LandingTemplate";
import { getPathById } from "@/lib/data/paths";
import { absoluteUrl } from "@/lib/seo";

const path = getPathById("flip");

export const metadata: Metadata = {
  title: path.landingH1,
  description: path.landingLede,
  alternates: { canonical: absoluteUrl(`/${path.slug}`) },
};

/** PPC landing page — keyword cluster: rekonstrukce investičního bytu, zhodnocení nemovitosti. */
export default function FlipLandingPage() {
  return <LandingTemplate path={path} />;
}
