import type { NextConfig } from "next";

/**
 * Fully static output: every page is rendered at build time, so all copy
 * and numbers are in the initial HTML (SEO + LCP) and the site runs on any
 * static host.
 *
 * NEXT_PUBLIC_BASE_PATH covers hosting under a sub-directory (e.g. a
 * GitHub Pages project site). It must stay in sync with BASE_PATH in
 * src/lib/seo.ts, which prefixes the raw asset URLs that next/link and
 * next/image do not touch.
 */
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  basePath: BASE_PATH || undefined,
  trailingSlash: true,
  images: {
    // There is no Image Optimization API on static hosting.
    unoptimized: true,
  },
};

export default nextConfig;
