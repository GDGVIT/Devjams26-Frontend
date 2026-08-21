"use client";

import { motion, MotionValue, useTransform } from "../gsap-motion";

interface GotQuestionsGraphicProps {
  apexX: MotionValue<number>;
  apexY: MotionValue<number>;
  linesOpacity?: MotionValue<number>;
  fullGradientOpacity?: MotionValue<number>;
}

// 14 cleanly spaced baseline Y coordinates
const LINE_BASELINE_Y = [
  25, 65, 110, 155, 200, 245, 290, 335, 380, 425, 470, 515, 555, 595
];

// Color palette mapping the right rays to the exact spectrum: Blue -> Cyan -> Green -> Yellow -> Orange -> Red
const LINE_RIGHT_COLORS = [
  "#AD5AAA", // 0: Top Purple / Violet
  "#749BFF", // 1: Periwinkle
  "#4E80EB", // 2: Blue
  "#3186FF", // 3: Google Blue
  "#1BB2E0", // 4: Cyan
  "#0EBC61", // 5: Green
  "#28C758", // 6: Fresh Green
  "#62D648", // 7: Lime Green
  "#A7DF32", // 8: Yellow Green
  "#F2C81E", // 9: Bright Yellow
  "#F27D1E", // 10: Sunset Orange
  "#FBBC04", // 11: Amber
  "#DC4855", // 12: Coral Red
  "#FC413D", // 13: Red
];

function BentLine({ 
  y0, 
  index, 
  apexX, 
  apexY 
}: { 
  y0: number; 
  index: number; 
  apexX: MotionValue<number>; 
  apexY: MotionValue<number>; 
}) {
  const d = useTransform([apexX, apexY], (values: number[]) => {
    const x = values[0] ?? 550;
    const y = values[1] ?? 0;
    // When apex drops, lines bend toward the apex. When y reaches 650, all lines converge into (x, y) at the bottom.
    const vertexY = Math.max(y, y0);
    return `M 0 ${y0} L ${x.toFixed(1)} ${vertexY.toFixed(1)} L 1000 ${y0}`;
  });

  return (
    <motion.path
      d={d}
      stroke={`url(#lineGrad_${index})`}
      strokeWidth="1.6"
      strokeOpacity="0.88"
      fill="none"
    />
  );
}

export function GotQuestionsGraphic({ 
  apexX, 
  apexY,
  linesOpacity,
  fullGradientOpacity 
}: GotQuestionsGraphicProps) {
  // Polygon path definition: starts as triangle, then expands to full-screen rectangle on transition
  const trianglePath = useTransform([apexX, apexY, fullGradientOpacity || apexY], (values: number[]) => {
    const x = values[0] ?? 550;
    const y = values[1] ?? 0;
    const full = values[2] !== undefined && fullGradientOpacity ? values[2] : 0;
    
    if (full >= 0.99) {
      return "M 0 0 L 1000 0 L 1000 650 L 0 650 Z";
    }
    if (full > 0) {
      const leftX = (x * (1 - full)).toFixed(1);
      const rightX = (x + (1000 - x) * full).toFixed(1);
      return `M 0 0 L 1000 0 L ${rightX} 650 L ${leftX} 650 Z`;
    }
    return `M 0 0 L 1000 0 L ${x.toFixed(1)} ${y.toFixed(1)} Z`;
  });

  return (
    <svg
      viewBox="0 0 1000 650"
      className="w-full h-full select-none pointer-events-none"
      preserveAspectRatio="none"
    >
      <defs>
        {/* Soft, wide-transition line gradients matching the exact palette tokens */}
        {LINE_RIGHT_COLORS.map((rightColor, index) => (
          <linearGradient
            key={`lineGrad_${index}`}
            id={`lineGrad_${index}`}
            gradientUnits="userSpaceOnUse"
            x1="0"
            y1="0"
            x2="1000"
            y2="0"
          >
            <stop offset="0%" stopColor="#DC4855" />
            <stop offset="18%" stopColor="#DC4855" />
            <stop offset="35%" stopColor={index > 8 ? "#F27D1E" : index < 4 ? "#AD5AAA" : "#0EBC61"} stopOpacity="0.9" />
            <stop offset="55%" stopColor={rightColor} />
            <stop offset="100%" stopColor={rightColor} />
          </linearGradient>
        ))}

        {/* Dynamic triangle / full-screen expanding clip path */}
        <clipPath id="triangleClip">
          <motion.path d={trianglePath} />
        </clipPath>
      </defs>

      {/* Background Bending Lines with fade-out as full-screen gradient expands */}
      <motion.g style={{ opacity: linesOpacity ?? 1 }}>
        {LINE_BASELINE_Y.map((y0, idx) => (
          <BentLine key={y0} y0={y0} index={idx} apexX={apexX} apexY={apexY} />
        ))}
      </motion.g>

      {/*
        Triangle fill that seamlessly expands into the full-screen liquid mesh.

        The mesh is a pre-blurred image rather than nine ellipses under an
        feGaussianBlur. The artwork never changes — only the clip does — but
        keeping the filter inline meant the browser re-ran a 48px blur over a
        full-screen region on every scroll frame, which is what made this
        section crawl on mobile. Source lives in assets-src/faq-mesh.svg.
      */}
      <g clipPath="url(#triangleClip)">
        <image
          href="/assets/baked/faq-mesh.png"
          width="1000"
          height="650"
          preserveAspectRatio="none"
        />
      </g>
    </svg>
  );
}
