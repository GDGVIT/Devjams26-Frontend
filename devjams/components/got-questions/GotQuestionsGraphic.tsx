"use client";

import { motion, MotionValue, useTransform } from "motion/react";

interface GotQuestionsGraphicProps {
  apexX: MotionValue<number>;
  apexY: MotionValue<number>;
}

// 18 baseline Y coordinates for horizontal background lines fanning from apex
const LINE_BASELINE_Y = [
  25, 60, 95, 130, 165, 200, 235, 270, 305, 340, 375, 410, 445, 480, 515, 550, 585, 620
];

function BentLine({ y0, apexX, apexY }: { y0: number; apexX: MotionValue<number>; apexY: MotionValue<number> }) {
  const d = useTransform([apexX, apexY], (values: number[]) => {
    const x = values[0] ?? 550;
    const y = values[1] ?? 0;
    // Only bend a line toward the apex if the apex is BELOW the line's baseline.
    // Math.max(y, y0) means:
    //   - if apexY < y0: vertex snaps to y0 → flat horizontal line
    //   - if apexY >= y0: vertex drops to apexY → V-shape converging to apex
    const vertexY = Math.max(y, y0);
    return `M 0 ${y0} L ${x.toFixed(1)} ${vertexY.toFixed(1)} L 1000 ${y0}`;
  });

  return (
    <motion.path
      d={d as any}
      stroke="url(#linesSpectrumGradient)"
      strokeWidth="1.75"
      strokeOpacity="0.9"
      fill="none"
    />
  );
}

export function GotQuestionsGraphic({ apexX, apexY }: GotQuestionsGraphicProps) {
  // Polygon path definition starting at top edge (0 0 to 1000 0) to apex (apexX, apexY)
  const trianglePath = useTransform([apexX, apexY], (values: number[]) => {
    const x = values[0] ?? 550;
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
        {/* Lines Spectrum Gradient matching the ray colors from left (Crimson/Red) to apex to right (Amber -> Lime -> Green -> Cyan -> Blue) */}
        <linearGradient
          id="linesSpectrumGradient"
          gradientUnits="userSpaceOnUse"
          x1="0"
          y1="0"
          x2="1000"
          y2="0"
        >
          <stop offset="0%" stopColor="#DC2626" />
          <stop offset="15%" stopColor="#B91C1C" />
          <stop offset="28%" stopColor="#991B1B" />
          <stop offset="35%" stopColor="#EA580C" />
          <stop offset="48%" stopColor="#F59E0B" />
          <stop offset="60%" stopColor="#84CC16" />
          <stop offset="72%" stopColor="#10B981" />
          <stop offset="85%" stopColor="#06B6D4" />
          <stop offset="95%" stopColor="#38BDF8" />
          <stop offset="100%" stopColor="#3B82F6" />
        </linearGradient>

        {/* Base linear gradient across the top boundary of the triangle */}
        <linearGradient
          id="triangleBaseGradient"
          gradientUnits="userSpaceOnUse"
          x1="0"
          y1="0"
          x2="1000"
          y2="0"
        >
          <stop offset="0%" stopColor="#DC2626" />
          <stop offset="30%" stopColor="#7C3AED" />
          <stop offset="60%" stopColor="#0284C7" />
          <stop offset="85%" stopColor="#10B981" />
          <stop offset="100%" stopColor="#22C55E" />
        </linearGradient>

        {/* Central Warm Sunset Glow — positioned towards center-right so left stays deep red */}
        <radialGradient
          id="centerOrangeGlow"
          cx="54%"
          cy="60%"
          r="42%"
          fx="54%"
          fy="60%"
        >
          <stop offset="0%" stopColor="#FF7A18" stopOpacity="0.75" />
          <stop offset="40%" stopColor="#EA580C" stopOpacity="0.45" />
          <stop offset="75%" stopColor="#991B1B" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#450A0A" stopOpacity="0" />
        </radialGradient>

        {/* Left Rich Red Radial Glow */}
        <radialGradient
          id="leftRedGlow"
          cx="18%"
          cy="45%"
          r="45%"
          fx="18%"
          fy="45%"
        >
          <stop offset="0%" stopColor="#E11D48" stopOpacity="0.85" />
          <stop offset="45%" stopColor="#DC2626" stopOpacity="0.7" />
          <stop offset="80%" stopColor="#991B1B" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#450A0A" stopOpacity="0" />
        </radialGradient>

        {/* Top Purple Radial Highlight */}
        <radialGradient
          id="topPurpleGlow"
          cx="48%"
          cy="12%"
          r="42%"
          fx="48%"
          fy="12%"
        >
          <stop offset="0%" stopColor="#6366F1" stopOpacity="0.9" />
          <stop offset="50%" stopColor="#4F46E5" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#312E81" stopOpacity="0" />
        </radialGradient>

        {/* Soft Gaussian blur for mesh gradient blending */}
        <filter id="meshGlow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="65" result="blur" />
        </filter>

        {/* Dynamic triangle clip path */}
        <clipPath id="triangleClip">
          <motion.path d={trianglePath as any} />
        </clipPath>
      </defs>

      {/* Background Bending Lines — coloured by position matching spectrum */}
      <g>
        {LINE_BASELINE_Y.map((y0) => (
          <BentLine key={y0} y0={y0} apexX={apexX} apexY={apexY} />
        ))}
      </g>

      {/* Triangle fill with layered mesh gradient */}
      <g clipPath="url(#triangleClip)">
        {/* Base Gradient Layer */}
        <rect width="1000" height="650" fill="url(#triangleBaseGradient)" />

        {/* Blurred Color Blobs for rich mesh transition */}
        <g filter="url(#meshGlow)">
          {/* Upper Left Deep Red / Crimson Blob */}
          <ellipse cx="140" cy="180" rx="220" ry="200" fill="#E11D48" opacity="0.95" />

          {/* Lower Left Rich Crimson / Red Blob extending all the way down to apex */}
          <ellipse cx="180" cy="440" rx="210" ry="230" fill="#DC2626" opacity="0.95" />
          
          {/* Left Flank Base Red */}
          <ellipse cx="80" cy="320" rx="160" ry="240" fill="#B91C1C" opacity="0.9" />
          
          {/* Upper Center Indigo / Purple Blob */}
          <ellipse cx="480" cy="80" rx="240" ry="160" fill="#6366F1" opacity="0.9" />
          
          {/* Top-Right Sky Blue / Cyan Blob */}
          <ellipse cx="850" cy="100" rx="230" ry="190" fill="#00A8FF" opacity="0.95" />
          
          {/* Mid-Right Emerald Green Blob */}
          <ellipse cx="820" cy="360" rx="210" ry="230" fill="#10B981" opacity="0.95" />
          
          {/* Lime / Yellow-Green Accent on Right Flank */}
          <ellipse cx="720" cy="470" rx="170" ry="170" fill="#84CC16" opacity="0.85" />
          
          {/* Warm Amber / Sunset Orange Glow — centered more to the middle-right */}
          <ellipse cx="500" cy="430" rx="200" ry="180" fill="#FF7A18" opacity="0.85" />
          
          {/* Apex Convergence Dark Crimson / Burgundy */}
          <ellipse cx="260" cy="620" rx="180" ry="140" fill="#7F1D1D" opacity="0.95" />
        </g>

        {/* Layered Radial Light Highlights */}
        <rect width="1000" height="650" fill="url(#leftRedGlow)" />
        <rect width="1000" height="650" fill="url(#centerOrangeGlow)" />
        <rect width="1000" height="650" fill="url(#topPurpleGlow)" opacity="0.6" />
      </g>
    </svg>
  );
}




