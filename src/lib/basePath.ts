/**
 * next/image with `unoptimized: true` (required for static export — no
 * Image Optimization API on GitHub Pages) renders a plain <img> and does
 * NOT auto-prepend Next's configured basePath to local src strings the
 * way the optimized loader does. Every local image src passed to
 * next/image must go through this helper instead, or it 404s once the
 * site is served from /vynosium/ instead of /.
 *
 * Keep BASE_PATH in sync with `basePath` in next.config.ts — both must
 * describe the same GitHub Pages project path.
 */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "/vynosium";

export function withBasePath(path: string): string {
  return `${BASE_PATH}${path}`;
}
