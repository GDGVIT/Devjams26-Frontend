"use client";

import { motion, MotionValue } from "motion/react";

interface GotQuestionsGraphicProps {
  apexX: MotionValue<number>;
  apexY: MotionValue<number>;
}

export function GotQuestionsGraphic({ apexX, apexY }: GotQuestionsGraphicProps) {
  // Triangle path definition starting at top edge (y=0)
  const trianglePath = useTransform(
    [apexX, apexY],
    ([x, y]) => `M 0 0 L 1000 0 L ${x} ${y} Z`
  );

  // Left radiating lines (5 cleanly-spaced lines)
  const leftLine1 = useTransform([apexX, apexY], ([x, y]) => `M 0 0 L ${x} ${y}`);
  const leftLine2 = useTransform([apexX, apexY], ([x, y]) => `M 0 150 L ${x} ${y}`);
  const leftLine3 = useTransform([apexX, apexY], ([x, y]) => `M 0 300 L ${x} ${y}`);
  const leftLine4 = useTransform([apexX, apexY], ([x, y]) => `M 0 450 L ${x} ${y}`);
  const leftLine5 = useTransform([apexX, apexY], ([x, y]) => `M 0 600 L ${x} ${y}`);

  // Right radiating lines (6 cleanly-spaced lines)
  const rightLine1 = useTransform([apexX, apexY], ([x, y]) => `M 1000 0 L ${x} ${y}`);
  const rightLine2 = useTransform([apexX, apexY], ([x, y]) => `M 1000 130 L ${x} ${y}`);
  const rightLine3 = useTransform([apexX, apexY], ([x, y]) => `M 1000 260 L ${x} ${y}`);
  const rightLine4 = useTransform([apexX, apexY], ([x, y]) => `M 1000 390 L ${x} ${y}`);
  const rightLine5 = useTransform([apexX, apexY], ([x, y]) => `M 1000 520 L ${x} ${y}`);
  const rightLine6 = useTransform([apexX, apexY], ([x, y]) => `M 1000 650 L ${x} ${y}`);

  return (
    <svg 
      viewBox="0 0 1000 650" 
      className="w-full h-full select-none pointer-events-none"
      preserveAspectRatio="none"
    >
      <defs>
        {/* Main horizontal gradient across full coordinate width */}
        <linearGradient id="mainGradient" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="1000" y2="0">
          <stop offset="0%" stopColor="#c0392b" />
          <stop offset="25%" stopColor="#9b59b6" />
          <stop offset="60%" stopColor="#2980b9" />
          <stop offset="100%" stopColor="#2ecc71" />
        </linearGradient>
      </defs>

      {/* Main Inverted Triangle */}
      <motion.path d={trianglePath} fill="url(#mainGradient)" />

      {/* Left Radiating Lines */}
      <motion.path d={leftLine1} stroke="url(#mainGradient)" strokeWidth="1.5" strokeOpacity="0.8" />
      <motion.path d={leftLine2} stroke="url(#mainGradient)" strokeWidth="1.5" strokeOpacity="0.8" />
      <motion.path d={leftLine3} stroke="url(#mainGradient)" strokeWidth="1.5" strokeOpacity="0.8" />
      <motion.path d={leftLine4} stroke="url(#mainGradient)" strokeWidth="1.5" strokeOpacity="0.8" />
      <motion.path d={leftLine5} stroke="url(#mainGradient)" strokeWidth="1.5" strokeOpacity="0.8" />

      {/* Right Radiating Lines */}
      <motion.path d={rightLine1} stroke="url(#mainGradient)" strokeWidth="1.5" strokeOpacity="0.8" />
      <motion.path d={rightLine2} stroke="url(#mainGradient)" strokeWidth="1.5" strokeOpacity="0.8" />
      <motion.path d={rightLine3} stroke="url(#mainGradient)" strokeWidth="1.5" strokeOpacity="0.8" />
      <motion.path d={rightLine4} stroke="url(#mainGradient)" strokeWidth="1.5" strokeOpacity="0.8" />
      <motion.path d={rightLine5} stroke="url(#mainGradient)" strokeWidth="1.5" strokeOpacity="0.8" />
      <motion.path d={rightLine6} stroke="url(#mainGradient)" strokeWidth="1.5" strokeOpacity="0.8" />
    </svg>
  );
}

import { useTransform } from "motion/react";
