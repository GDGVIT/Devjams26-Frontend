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
 * (android, cloud, ded, umbrella, maps) resolve to baked PNGs
 * through AssetImage; sponsc2 is a small real vector shipped as-is.
 */
const DECORATIONS: Deco[] = [
  { src: "/assets/android.svg", width: 260, height: 159 },
  { src: "/assets/cloud.svg", width: 278, height: 203 },
  { src: "/assets/ded.svg", width: 92, height: 63 },
  { src: "/assets/sponsc2.svg", width: 68, height: 70 },
  { src: "/assets/umbrella.svg", width: 310, height: 222 },
  { src: "/assets/maps.svg", width: 365, height: 465, size: 48 },
];

/** Every decoration shares the dino's footprint so the scatter reads evenly. */
const DECO_WIDTH = 60;

/**
 * Regions the scatter may use. Measured against the rendered section, the card
 * row and its tier labels occupy x 15.8-84.2%, y 31.8-81.6% — the previous
 * bottom bands ran straight through that, so a decoration landing on a tier
 * label was certain rather than unlucky. These sit in the gutters around it,
 * with roughly half a decoration's width (~2%) of clearance on each side.
 */
const QUADRANTS: Array<{ x: [number, number]; y: [number, number] }> = [
  { x: [3, 27], y: [3, 27] }, // top-left, clear of the centred heading
  { x: [73, 97], y: [3, 27] }, // top-right
  { x: [3, 13], y: [34, 78] }, // left gutter, beside the cards
  { x: [87, 97], y: [34, 78] }, // right gutter
  { x: [10, 90], y: [85, 95] }, // below the tier labels
];

/** Six decorations, one per slot: top-left, top-right, both gutters, and two
 *  along the bottom band. The dino lives on the Exasol card, not the scatter. */
const SLOT_QUADRANTS = [0, 1, 2, 3, 4, 4];

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
  const quadrant = QUADRANTS[SLOT_QUADRANTS[index]];
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
