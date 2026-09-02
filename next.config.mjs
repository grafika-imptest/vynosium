/**
 * Plain .mjs rather than .ts, so Next reads it directly instead of
 * transpiling it first. The shape is still type-checked, through the JSDoc
 * annotation on the object below.
 *
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
 * NEXT_DIST_DIR names where the EXPORTED SITE is written, in place of `out`:
 *
 *   NEXT_DIST_DIR=.next-verify npm run build   ->  .next-verify/index.html
 *
 * It does NOT move the build itself. Measured on an empty checkout with no
 * dev server running: the build put 316 files including BUILD_ID into
 * `.next`, and only the 170 exported files into `.next-verify`. So this is
 * not the escape hatch it was once documented as — a production build always
 * overwrites `.next`, and a dev server using that directory ends up serving
 * a mismatch: the page renders, the chunks 404, nothing hydrates, and no
 * click does anything.
 *
 * There is no config-level fix for that. Either build in a separate checkout
 * (a throwaway `git worktree` with node_modules junctioned in), or restart
 * the dev server after publishing. scripts/publish.ps1 says the same.
 */
const DIST_DIR = process.env.NEXT_DIST_DIR;

/** @type {import("next").NextConfig} */
const nextConfig = {
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
