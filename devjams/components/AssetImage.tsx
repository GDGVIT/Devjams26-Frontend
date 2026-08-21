"use client";

import Image, { type ImageProps } from "next/image";

type AssetImageProps = Omit<ImageProps, "src"> & {
  src: string;
};

/**
 * The gradient-blob artwork ships as flat PNGs baked from assets-src/ by
 * scripts/bake-assets.mjs. Call sites still name the logical asset
 * ("/assets/web.svg"); this maps it onto the baked file.
 *
 * Everything else (real vector art like gemini.svg, the logo letters) passes
 * straight through to next/image, which optimizes rasters into AVIF/WebP per
 * device on its own — so there is no hand-maintained quality split any more.
 */
const BAKED_ASSETS = new Set([
  "android",
  "web",
  "cloud",
  "maps",
  "dino-menu",
  "cursor",
  "notebookllm",
  "leftbracket",
  "rightbracket",
  "umbrella",
  "logo/triangle",
  "logo/circle",
]);

function resolveSrc(src: string) {
  const name = src.replace(/^\/?assets\//, "").replace(/\.svg$/, "");
  return BAKED_ASSETS.has(name) ? `/assets/baked/${name}.png` : src;
}

export default function AssetImage({ src, ...props }: AssetImageProps) {
  return <Image {...props} alt={props.alt ?? ""} src={resolveSrc(src)} />;
}
