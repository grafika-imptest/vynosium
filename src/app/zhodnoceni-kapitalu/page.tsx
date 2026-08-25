import type { Metadata } from "next";
import { LandingTemplate } from "@/components/sections/LandingTemplate";
import { getPathById } from "@/lib/data/paths";
import { absoluteUrl } from "@/lib/seo";

const path = getPathById("capital");

export const metadata: Metadata = {
  title: path.landingH1,
  description: path.landingLede,
  alternates: { canonical: absoluteUrl(`/${path.slug}`) },
};

/** PPC landing page — keyword cluster: zhodnocení kapitálu, investice do nemovitostí. */
export default function CapitalLandingPage() {
  return <LandingTemplate path={path} />;
}
