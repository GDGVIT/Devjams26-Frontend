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
  const introRef = useRef<HTMLDivElement>(null);
  const [activeCategoryId, setActiveCategoryId] = useState("general");
  const activeCategory =
    FAQ_CATEGORIES.find((category) => category.id === activeCategoryId) ?? FAQ_CATEGORIES[0];

  const { scrollYProgress } = useScroll({
    target: introRef,
    offset: ["start start", "end start"],
  });

  // Stage 1: triangle apex drops to the bottom edge (0.00 -> 0.35)
  const apexX = useTransform(scrollYProgress, [0, 0.18, 0.35], [550, 480, 260]);
  const apexY = useTransform(scrollYProgress, [0, 0.11, 0.23, 0.35], [0, 160, 380, 650]);

  // Stage 2: full-screen gradient expansion, lines fade (0.37 -> 0.50)
  const fullGradientOpacity = useTransform(scrollYProgress, [0.37, 0.5], [0, 1]);
  const linesOpacity = useTransform(scrollYProgress, [0.37, 0.47], [1, 0]);

  // Text is clipped to the expanding colorful triangle, so it stays hidden
  // until the cover reveals it.
  const clipPath = useTransform(
    [apexX, apexY, fullGradientOpacity],
    (values: number[]) => {
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
    },
  );

  // Stage 3: screen is fully colorful -> fade to black (0.45 -> 0.85)
  const graphicOpacity = useTransform(scrollYProgress, [0.45, 0.85], [1, 0]);
  const textOpacity = useTransform(scrollYProgress, [0.45, 0.78], [1, 0]);

  return (
    <section id="faqs" className="relative w-full bg-black text-white">
      <div ref={introRef} className="relative h-[320vh]">
        <div className="sticky top-0 h-screen overflow-hidden bg-black">
          <motion.div
            className="absolute inset-0"
            style={{ opacity: graphicOpacity }}
            aria-hidden="true"
          >
            <GotQuestionsGraphic
              apexX={apexX}
              apexY={apexY}
              linesOpacity={linesOpacity}
              fullGradientOpacity={fullGradientOpacity}
            />
          </motion.div>

          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{ clipPath, opacity: textOpacity }}
          >
            <GotQuestionsHeading />
            <GotQuestionsSubHeading />
          </motion.div>
        </div>
      </div>

      <div className="relative min-h-screen overflow-hidden bg-black py-4 sm:py-6 md:py-8 px-4 sm:px-8">
        <FAQsHeader />

        <div className="relative z-10 max-w-[960px] w-full mx-auto px-2 sm:px-4 flex flex-col items-center pb-8 sm:pb-12">
          <FAQsTabs
            categories={FAQ_CATEGORIES}
            activeCategoryId={activeCategoryId}
            onSelectCategory={setActiveCategoryId}
          />
          <FAQsList category={activeCategory} />
        </div>

        <div
          className="absolute flex items-center mix-blend-screen pointer-events-none z-10"
          style={{ right: "clamp(-45px, -6vw, -25px)", bottom: "clamp(-40px, -5vw, -20px)" }}
          aria-hidden="true"
        >
          <div
            className="relative"
            style={{
              width: "clamp(105px, 22vw, 210px)",
              height: "clamp(105px, 22vw, 210px)",
              marginRight: "clamp(-26px, -5.5vw, -50px)",
              zIndex: 20,
            }}
          >
            <Image src="/assets/gemini.svg" alt="" fill className="object-contain" />
          </div>
          <div
            className="relative"
            style={{
              width: "clamp(100px, 20vw, 195px)",
              height: "clamp(100px, 20vw, 195px)",
              zIndex: 10,
            }}
          >
            <Image src="/assets/gear.svg" alt="" fill className="object-contain" />
          </div>
        </div>
      </div>
    </section>
  );
}
