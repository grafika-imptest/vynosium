import type { NextConfig } from "next";

/**
 * GitHub Pages serves this as a project site at
 * https://grafikadva-maker.github.io/vynosium/ — no Node server, so the
 * app must be a fully static export, and every internal path needs the
 * /vynosium base path. next/link and next/image's OPTIMIZED loader pick
 * up basePath automatically; local <Image> src strings under
 * images.unoptimized do not — see src/lib/basePath.ts, which must stay
 * in sync with this default.
 */
const REPO_BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "/vynosium";

const nextConfig: NextConfig = {
  output: "export",
  basePath: REPO_BASE_PATH,
  trailingSlash: true,
  images: {
    // No Image Optimization API on static hosting.
    unoptimized: true,
  },
  eslint: {
    // eslint-config-next@15 vs the eslint@9.39 create-next-app scaffolded
    // is a known unresolved version mismatch (see commit history) —
    // `tsc --noEmit` is the enforced correctness gate instead. Revisit
    // once the eslint/eslint-config-next pairing is fixed.
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
