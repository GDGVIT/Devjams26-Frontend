"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { GotQuestionsGraphic } from "../got-questions/GotQuestionsGraphic";
import { GotQuestionsHeading } from "../got-questions/GotQuestionsHeading";
import { GotQuestionsSubHeading } from "../got-questions/GotQuestionsSubHeading";
import { FAQ_CATEGORIES } from "../faqs/FAQsData";
import { FAQsHeader } from "../faqs/FAQsHeader";
import { FAQsTabs } from "../faqs/FAQsTabs";
import { FAQsList } from "../faqs/FAQsList";

export function GotQuestions() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeCategoryId, setActiveCategoryId] = useState<string>("general");

  const activeCategory =
    FAQ_CATEGORIES.find((cat) => cat.id === activeCategoryId) || FAQ_CATEGORIES[0];

  // Scroll tracking across pinned sticky 450vh viewport
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Stage 1: Triangle apex drops down to bottom edge (0.00 -> 0.42)
  const apexX = useTransform(scrollYProgress, [0, 0.22, 0.42], [550, 480, 260]);
  const apexY = useTransform(scrollYProgress, [0, 0.14, 0.28, 0.42], [0, 160, 380, 650]);

  // Stage 2: Full-screen gradient expansion & line fade (0.48 -> 0.62)
  const fullGradientOpacity = useTransform(scrollYProgress, [0.48, 0.62], [0, 1]);
  const linesOpacity = useTransform(scrollYProgress, [0.48, 0.58], [1, 0]);
  const textOpacity = useTransform(scrollYProgress, [0.52, 0.62], [1, 0]);

  // Stage 3: Complete 180° 3D Card Flip from GotQuestions to FAQs (0.65 -> 0.90)
  const cardRotateX = useTransform(scrollYProgress, [0.65, 0.90], [0, 180]);
  const cardScale = useTransform(scrollYProgress, [0.65, 0.775, 0.90], [1, 0.88, 1]);

  // Pointer events management: enable FAQs interaction only once flipped
  const isFlipped = useTransform(scrollYProgress, (p) => p >= 0.775);

  // Dynamic clipPath for the text overlay during triangle drop & expansion:
  const clipPath = useTransform([apexX, apexY, fullGradientOpacity], (values: number[]) => {
    const full = values[2] ?? 0;
    if (full >= 0.99) {
      return "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)";
    }
    const xVal = values[0] ?? 550;
    const yVal = values[1] ?? 0;
    const xPct = (xVal / 10).toFixed(2);
    const yPct = (yVal / 6.5).toFixed(2);

    if (full > 0) {
      const leftX = (Number(xPct) * (1 - full)).toFixed(2);
      const rightX = (Number(xPct) + (100 - Number(xPct)) * full).toFixed(2);
      return `polygon(0% 0%, 100% 0%, ${rightX}% 100%, ${leftX}% 100%)`;
    }
    return `polygon(0% 0%, 100% 0%, ${xPct}% ${yPct}%)`;
  });

  return (
    <section 
      ref={sectionRef} 
      className="relative w-full h-[450vh] bg-black text-white"
    >
      {/* 3D Perspective Viewport */}
      <div 
        className="sticky top-0 w-full h-screen flex items-center justify-center overflow-hidden bg-black"
        style={{ perspective: "1500px" }}
      >
        {/* 3D Flipper Card Container */}
        <motion.div
          style={{
            rotateX: cardRotateX,
            scale: cardScale,
            transformStyle: "preserve-3d",
          }}
          className="relative w-full h-full"
        >
          {/* ================= FRONT FACE: Got Questions ================= */}
          <div
            style={{
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              transform: "rotateX(0deg)",
            }}
            className="absolute inset-0 w-full h-full flex items-center justify-center bg-black overflow-hidden"
          >
            {/* Dynamic SVG Graphic Canvas with Expanding Gradient */}
            <GotQuestionsGraphic 
              apexX={apexX} 
              apexY={apexY} 
              linesOpacity={linesOpacity}
              fullGradientOpacity={fullGradientOpacity}
            />

            {/* Text Overlay Container */}
            <motion.div 
              style={{ clipPath, opacity: textOpacity }}
              className="absolute inset-0 pointer-events-none"
            >
              {/* Main Heading */}
              <GotQuestionsHeading />

              {/* Sub Heading */}
              <GotQuestionsSubHeading />
            </motion.div>
          </div>

          {/* ================= BACK FACE: FAQs Section ================= */}
          <motion.div
            style={{
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              transform: "rotateX(180deg)",
              pointerEvents: isFlipped ? "auto" : "none",
            }}
            className="absolute inset-0 w-full h-full flex flex-col justify-start overflow-y-auto bg-black py-4 sm:py-6 md:py-8 px-2 sm:px-4"
          >
            {/* Full-bleed Header */}
            <FAQsHeader />

            {/* Padded inner container for tabs + content */}
            <div className="max-w-[1300px] w-full mx-auto px-4 sm:px-8 md:px-12 flex flex-col items-center">
              {/* Tab Switcher */}
              <FAQsTabs
                categories={FAQ_CATEGORIES}
                activeCategoryId={activeCategoryId}
                onSelectCategory={setActiveCategoryId}
              />

              {/* FAQ Content List */}
              <FAQsList category={activeCategory} />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
