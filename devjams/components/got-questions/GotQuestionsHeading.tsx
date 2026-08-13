"use client";

import { motion, MotionValue } from "motion/react";

interface GotQuestionsHeadingProps {
  x: MotionValue<string>;
  y: MotionValue<string>;
}

export function GotQuestionsHeading({ x, y }: GotQuestionsHeadingProps) {
  return (
    <motion.div
      style={{
        position: "absolute",
        left: x,
        top: y,
      }}
      className="transform -translate-x-1/2 -translate-y-1/2 text-white font-extrabold text-3xl sm:text-5xl md:text-6xl tracking-tight drop-shadow-lg whitespace-nowrap"
    >
      Got Questions?
    </motion.div>
  );
}
