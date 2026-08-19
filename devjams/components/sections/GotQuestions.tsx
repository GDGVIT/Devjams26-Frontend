"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "../gsap-motion";
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

  // Scroll tracking across pinned sticky viewport
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Stage 1: Triangle apex drops down to bottom edge (0.00 -> 0.35)
  const apexX = useTransform(scrollYProgress, [0, 0.18, 0.35], [550, 480, 260]);
  const apexY = useTransform(scrollYProgress, [0, 0.11, 0.23, 0.35], [0, 160, 380, 650]);

  // Stage 2: Full-screen gradient expansion & line fade (0.37 -> 0.50)
  const fullGradientOpacity = useTransform(scrollYProgress, [0.37, 0.50], [0, 1]);
  const linesOpacity = useTransform(scrollYProgress, [0.37, 0.47], [1, 0]);
  const textOpacity = useTransform(scrollYProgress, [0.39, 0.49], [1, 0]);

  // Stage 3: Complete 180° 3D Card Flip from GotQuestions to FAQs (0.52 -> 0.72)
  const cardRotateX = useTransform(scrollYProgress, [0.52, 0.72], [0, 180]);
  const cardScale = useTransform(scrollYProgress, [0.52, 0.62, 0.72], [1, 0.9, 1]);

  // Pointer events management: enable FAQs interaction once flipped
  const isFlipped = useTransform(scrollYProgress, (p) => p >= 0.62);

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
      id="faqs"
      className="relative w-full h-[150vh] md:h-[200vh] bg-black text-white"
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
            className="absolute inset-0 w-full h-full flex flex-col items-center justify-start overflow-y-auto no-scrollbar bg-black py-5 sm:py-7 md:py-9 px-4 sm:px-8 relative"
          >
            {/* Top Row: Full-bleed Header with Web + Maps at top-left and Centered FAQs Title */}
            <FAQsHeader />

            {/* Middle Container for Tabs + Generous Content utilizing whitespace */}
            <div className="max-w-[960px] w-full mx-auto px-2 sm:px-4 flex flex-col items-center z-10 pb-16 sm:pb-20">
              {/* Tab Switcher */}
              <FAQsTabs
                categories={FAQ_CATEGORIES}
                activeCategoryId={activeCategoryId}
                onSelectCategory={setActiveCategoryId}
              />

              {/* FAQ Content List */}
              <FAQsList category={activeCategory} />
            </div>

            {/* Bottom-Right Corner Decorative SVGs (Gemini Star + Gear) */}
            <div
              className="absolute flex items-center mix-blend-screen pointer-events-none z-10"
              style={{
                right: "clamp(-45px, -6vw, -25px)",
                bottom: "clamp(-40px, -5vw, -20px)",
              }}
            >
              {/* Gemini Star */}
              <div
                className="relative"
                style={{
                  width: "clamp(105px, 22vw, 210px)",
                  height: "clamp(105px, 22vw, 210px)",
                  marginRight: "clamp(-26px, -5.5vw, -50px)",
                  zIndex: 20,
                }}
              >
                <Image
                  src="/assets/gemini.svg"
                  alt="Gemini Star"
                  fill
                  priority
                  className="object-contain"
                />
              </div>
              {/* Gear */}
              <div
                className="relative"
                style={{
                  width: "clamp(100px, 20vw, 195px)",
                  height: "clamp(100px, 20vw, 195px)",
                  zIndex: 10,
                }}
              >
                <Image
                  src="/assets/gear.svg"
                  alt="Gear Track"
                  fill
                  priority
                  className="object-contain"
                />
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
