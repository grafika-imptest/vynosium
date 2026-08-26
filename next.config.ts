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

/*
 * A build and a dev server in the same checkout share `.next` and corrupt
 * each other — chunk 404s and dead hydration, which cost an afternoon once.
 * NEXT_DIST_DIR lets a verification build write elsewhere while a dev server
 * keeps running:
 *
 *   NEXT_DIST_DIR=.next-verify npm run build
 *
 * With `output: export` the exported site lands inside that same directory
 * rather than in `out` — verified, not assumed. CI sets nothing, keeps `.next`
 * and `out`, and the deploy step still uploads `out`.
 */
const DIST_DIR = process.env.NEXT_DIST_DIR;

const nextConfig: NextConfig = {
  output: "export",
  basePath: BASE_PATH || undefined,
  trailingSlash: true,
  ...(DIST_DIR ? { distDir: DIST_DIR } : {}),
  images: {
    // There is no Image Optimization API on static hosting.
    unoptimized: true,
  },
};

export default nextConfig;
