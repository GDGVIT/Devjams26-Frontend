import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // The track artwork now ships as baked PNGs (see scripts/bake-assets.mjs),
    // which the optimizer can re-encode. Next only emits WebP by default;
    // adding AVIF ahead of it roughly halves those again, with WebP as the
    // fallback for browsers that don't support AVIF.
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;

