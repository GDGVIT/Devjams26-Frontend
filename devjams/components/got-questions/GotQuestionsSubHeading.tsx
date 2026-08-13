"use client";

import { motion, MotionValue } from "motion/react";

interface GotQuestionsSubHeadingProps {
  opacity: MotionValue<number>;
  y: MotionValue<number>;
}

export function GotQuestionsSubHeading({ opacity, y }: GotQuestionsSubHeadingProps) {
  return (
    <motion.div
      style={{
        opacity,
        y,
      }}
      className="absolute left-[18%] sm:left-[21%] md:left-[23%] bottom-[20%] sm:bottom-[23%] text-white font-extrabold text-2xl sm:text-4xl md:text-5xl tracking-tight leading-tight max-w-[210px] sm:max-w-[270px] md:max-w-[310px] drop-shadow-lg"
    >
      Let’s break it down.
    </motion.div>
  );
}
