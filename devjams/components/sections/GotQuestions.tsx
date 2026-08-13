"use client";

import { useRef } from "react";
import { useScroll, useTransform } from "motion/react";
import { GotQuestionsGraphic } from "../got-questions/GotQuestionsGraphic";
import { GotQuestionsHeading } from "../got-questions/GotQuestionsHeading";
import { GotQuestionsSubHeading } from "../got-questions/GotQuestionsSubHeading";

export function GotQuestions() {
  const sectionRef = useRef<HTMLDivElement>(null);

  // Scroll tracking across section viewport
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 80%", "start 10%"],
  });

  // Apex interpolation: Initial (850, 540) -> Final (240, 650)
  const apexX = useTransform(scrollYProgress, [0, 1], [850, 240]);
  const apexY = useTransform(scrollYProgress, [0, 1], [540, 650]);

  // Text Animations
  const gotQuestionsX = useTransform(scrollYProgress, [0, 1], ["54%", "62%"]);
  const gotQuestionsY = useTransform(scrollYProgress, [0, 1], ["22%", "16%"]);

  // Sub-heading visibility trigger on scroll
  const breakItDownOpacity = useTransform(scrollYProgress, [0.55, 0.85], [0, 1]);
  const breakItDownY = useTransform(scrollYProgress, [0.55, 0.85], [30, 0]);

  return (
    <section 
      ref={sectionRef} 
      className="relative w-full h-screen bg-black text-white overflow-hidden"
    >
      <div className="relative w-full h-full flex items-center justify-center overflow-hidden bg-black">
        {/* Composable SVG Graphic Canvas */}
        <GotQuestionsGraphic apexX={apexX} apexY={apexY} />

        {/* Text Overlay Container */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          {/* Composable Main Heading */}
          <GotQuestionsHeading x={gotQuestionsX} y={gotQuestionsY} />

          {/* Composable Sub Heading */}
          <GotQuestionsSubHeading opacity={breakItDownOpacity} y={breakItDownY} />
        </div>
      </div>
    </section>
  );
}
