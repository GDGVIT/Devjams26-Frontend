"use client";

import Image, { type ImageProps } from "next/image";

type ResponsiveSvgProps = Omit<ImageProps, "src"> & {
  src: string;
};

function variantPath(src: string, quality: "high-quality" | "low-quality") {
  const relativePath = src.replace(/^\/?assets\//, "");
  return `/assets/${quality}/${relativePath}`;
}

export default function ResponsiveSvg({ src, priority: _priority, ...props }: ResponsiveSvgProps) {
  return (
    <picture className="responsive-svg">
      <source media="(max-width: 700px)" srcSet={variantPath(src, "low-quality")} />
      <Image
        {...props}
        src={variantPath(src, "high-quality")}
        loading={_priority ? "eager" : "lazy"}
      />
    </picture>
  );
}
