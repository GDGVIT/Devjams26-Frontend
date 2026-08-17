"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { GotQuestionsGraphic } from "../got-questions/GotQuestionsGraphic";
import { GotQuestionsHeading } from "../got-questions/GotQuestionsHeading";
import { GotQuestionsSubHeading } from "../got-questions/GotQuestionsSubHeading";

export function GotQuestions() {
  const sectionRef = useRef<HTMLDivElement>(null);

  // Scroll tracking across pinned sticky 350vh viewport
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Apex interpolation matching States 1 -> 2 -> 3 -> 4:
  // State 1 (progress 0.0): apexX = 550, apexY = 0 (collapsed at top edge, flat horizontal lines)
  // State 2 (progress 0.3): apexX = 550, apexY = 160 (shallow V-shape enters top edge, lines bend)
  // State 3 (progress 0.6): apexX = 480, apexY = 400 (deep V-shape extends down)
  // State 4 (progress 1.0): apexX = 260, apexY = 650 (apex touches the bottom edge at x=260)
  const apexX = useTransform(scrollYProgress, [0, 0.6, 1], [550, 480, 260]);
  const apexY = useTransform(scrollYProgress, [0, 0.3, 0.6, 1], [0, 160, 400, 650]);

  // Geometric clip-path mask matching the triangle polygon expansion in real time
  // SVG viewBox is 1000 x 650 -> apexX / 10 = %, apexY / 6.5 = %
  const clipPath = useTransform([apexX, apexY], (values: number[]) => {
    const x = ((values[0] ?? 550) / 10).toFixed(2);
    const y = ((values[1] ?? 0) / 6.5).toFixed(2);
    return `polygon(0% 0%, 100% 0%, ${x}% ${y}%)`;
  });

  return (
    <section 
      ref={sectionRef} 
      className="relative w-full h-[350vh] bg-black text-white"
    >
      <div className="sticky top-0 w-full h-screen flex items-center justify-center overflow-hidden bg-black">
        {/* Dynamic SVG Graphic Canvas */}
        <GotQuestionsGraphic apexX={apexX} apexY={apexY} />

        {/* Text Overlay Container clipped by the expanding orange triangle shape */}
        <motion.div 
          style={{ clipPath }}
          className="absolute inset-0 pointer-events-none"
        >
          {/* Main Heading */}
          <GotQuestionsHeading />

          {/* Sub Heading */}
          <GotQuestionsSubHeading />
        </motion.div>
      </div>
    </section>
  );
}



