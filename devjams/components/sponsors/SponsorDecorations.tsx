"use client";

import AssetImage from "../AssetImage";

interface Deco {
  src: string;
  /** Intrinsic viewBox dimensions of the source asset. */
  width: number;
  height: number;
  /**
   * Display width in px. Defaults to the shared 60px dino footprint; maps is
   * taller-than-wide, so it gets a narrower box to match the dino's visual
   * height instead.
   */
  size?: number;
}

/**
 * Decorative assets scattered around the section. Heavy Figma exports
 * (android, cloud, ded, spons-dino, umbrella, maps) resolve to baked PNGs
 * through AssetImage; sponsc1/sponsc2 are small real vectors shipped as-is.
 */
const DECORATIONS: Deco[] = [
  { src: "/assets/android.svg", width: 260, height: 159 },
  { src: "/assets/cloud.svg", width: 278, height: 203 },
  { src: "/assets/ded.svg", width: 92, height: 63 },
  { src: "/assets/spons-dino.svg", width: 69, height: 73 },
  { src: "/assets/sponsc1.svg", width: 65, height: 65 },
  { src: "/assets/sponsc2.svg", width: 68, height: 70 },
  { src: "/assets/umbrella.svg", width: 310, height: 222 },
  { src: "/assets/maps.svg", width: 365, height: 465, size: 48 },
];

/** Every decoration shares the dino's footprint so the scatter reads evenly. */
const DECO_WIDTH = 60;

/**
 * Two decorations per quadrant, in reading order: top-left, top-right,
 * bottom-left, bottom-right. Ranges keep clear of the section edges and the
 * centred heading.
 */
const QUADRANTS: Array<{ x: [number, number]; y: [number, number] }> = [
  { x: [4, 42], y: [4, 32] },
  { x: [58, 94], y: [4, 32] },
  { x: [4, 42], y: [68, 94] },
  { x: [58, 94], y: [68, 94] },
];

/** Minimum centre-to-centre spacing between any two decorations. */
const MIN_DIST = 18;

function shuffle<T>(items: T[]): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

const rand = (min: number, max: number) => min + Math.random() * (max - min);

/**
 * This module is only ever evaluated in the browser (the parent imports it
 * with ssr: false), so Math.random is hydration-safe and the scatter re-rolls
 * on every page load.
 */
const placed: Array<{ x: number; y: number }> = [];

const SCATTER = shuffle(DECORATIONS).map((deco, index) => {
  const quadrant = QUADRANTS[index >> 1];
  let x = rand(quadrant.x[0], quadrant.x[1]);
  let y = rand(quadrant.y[0], quadrant.y[1]);
  // Rejection sample until the centre is MIN_DIST clear of every deco placed
  // so far; give up after 200 tries and keep the last candidate.
  for (
    let attempt = 0;
    attempt < 200 && placed.some((p) => Math.hypot(p.x - x, p.y - y) < MIN_DIST);
    attempt++
  ) {
    x = rand(quadrant.x[0], quadrant.x[1]);
    y = rand(quadrant.y[0], quadrant.y[1]);
  }
  placed.push({ x, y });
  const displayWidth = deco.size ?? DECO_WIDTH;
  const rotation = (Math.random() * 2 - 1) * 14; // deg
  return { ...deco, x, y, displayWidth, rotation };
});

export default function SponsorDecorations() {
  return (
    <>
      {SCATTER.map((deco) => (
        <AssetImage
          key={deco.src}
          src={deco.src}
          alt=""
          width={deco.width}
          height={deco.height}
          aria-hidden="true"
          className="sponsors__deco"
          style={
            {
              left: `${deco.x}%`,
              top: `${deco.y}%`,
              width: `${deco.displayWidth}px`,
              "--deco-rot": `${deco.rotation}deg`,
            } as React.CSSProperties
          }
        />
      ))}
    </>
  );
}
