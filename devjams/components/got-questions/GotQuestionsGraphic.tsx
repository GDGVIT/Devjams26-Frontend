"use client";

import { motion, MotionValue, useTransform } from "motion/react";

interface GotQuestionsGraphicProps {
  apexX: MotionValue<number>;
  apexY: MotionValue<number>;
}

// 16 baseline Y coordinates for horizontal background lines
const LINE_BASELINE_Y = [
  30, 70, 110, 150, 190, 230, 270, 310, 350, 390, 430, 470, 510, 550, 590, 630
];

function BentLine({ y0, apexX, apexY }: { y0: number; apexX: MotionValue<number>; apexY: MotionValue<number> }) {
  const d = useTransform([apexX, apexY], (values: number[]) => {
    const x = values[0] ?? 600;
    const y = values[1] ?? 0;
    // Only bend a line toward the apex if the apex is BELOW the line's baseline.
    // Math.max(y, y0) means:
    //   - if apexY < y0: vertex snaps to y0 → flat horizontal line (State 1)
    //   - if apexY >= y0: vertex drops to apexY → V-shape converging to apex
    const vertexY = Math.max(y, y0);
    return `M 0 ${y0} L ${x.toFixed(1)} ${vertexY.toFixed(1)} L 1000 ${y0}`;
  });

  return (
    <motion.path
      d={d as any}
      stroke="url(#spectrumGradient)"
      strokeWidth="1.5"
      strokeOpacity="0.85"
      fill="none"
    />
  );
}

export function GotQuestionsGraphic({ apexX, apexY }: GotQuestionsGraphicProps) {
  // Polygon path definition starting at top edge (y=0) to apex (apexX, apexY)
  const trianglePath = useTransform([apexX, apexY], (values: number[]) => {
    const x = values[0] ?? 600;
    const y = values[1] ?? 0;
    return `M 0 0 L 1000 0 L ${x.toFixed(1)} ${y.toFixed(1)} Z`;
  });

  return (
    <svg
      viewBox="0 0 1000 650"
      className="w-full h-full select-none pointer-events-none"
      preserveAspectRatio="none"
    >
      <defs>
        {/* User-defined spectrum gradient (top-left to top-right vector so all 7 colors are fully visible inside the triangle):
            #FA3E2C (Minimal Red) → #CC518B (Pink) → #4285F4 (Blue) → #57CAFF (Sky Blue) → #34A853 (Green) → #5CDB6D (Light Green) → #F9AB00 (Minimal Yellow) */}
        <linearGradient
          id="spectrumGradient"
          gradientUnits="userSpaceOnUse"
          x1="0" y1="0" x2="1000" y2="200"
        >
          <stop offset="0%"   stopColor="#FA3E2C" />
          <stop offset="5%"   stopColor="#CC518B" />
          <stop offset="22%"  stopColor="#4285F4" />
          <stop offset="44%"  stopColor="#57CAFF" />
          <stop offset="66%"  stopColor="#34A853" />
          <stop offset="82%"  stopColor="#5CDB6D" />
          <stop offset="92%"  stopColor="#F9AB00" />
          <stop offset="100%" stopColor="#F9AB00" />
        </linearGradient>
      </defs>

      {/* Background Bending Lines — coloured by position matching spectrum */}
      <g>
        {LINE_BASELINE_Y.map((y0) => (
          <BentLine key={y0} y0={y0} apexX={apexX} apexY={apexY} />
        ))}
      </g>

      {/* Triangle fill — matching spectrum gradient */}
      <motion.path d={trianglePath as any} fill="url(#spectrumGradient)" />
    </svg>
  );
}




