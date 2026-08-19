"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "../gsap-motion";
import { FAQ_CATEGORIES } from "../faqs/FAQsData";
import { FAQsHeader } from "../faqs/FAQsHeader";
import { FAQsTabs } from "../faqs/FAQsTabs";
import { FAQsList } from "../faqs/FAQsList";

export function FAQs() {
  const [activeCategoryId, setActiveCategoryId] = useState<string>("general");
  const sectionRef = useRef<HTMLDivElement>(null);

  // Scroll tracking to trigger 3D Card Flip entrance as we arrive from the GotQuestions screen
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "start 0.25"],
  });

  // 3D Card Flip entrance transforms: rotates from 40deg forward to 0deg flat
  const rotateX = useTransform(scrollYProgress, [0, 0.75, 1], [40, 0, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.75, 1], [0.92, 1, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.35, 0.8], [0.2, 0.9, 1]);

  const activeCategory =
    FAQ_CATEGORIES.find((cat) => cat.id === activeCategoryId) || FAQ_CATEGORIES[0];

  return (
    <section 
      ref={sectionRef} 
      id="faqs-section"
      className="relative w-full min-h-screen py-8 sm:py-12 md:py-16 bg-black text-white overflow-hidden flex flex-col justify-start [perspective:1400px]"
    >
      <motion.div
        style={{
          rotateX,
          scale,
          opacity,
          transformOrigin: "top center",
        }}
        className="w-full flex flex-col items-center flex-1 justify-start relative"
      >
        {/* Full-bleed Header with top-left Web + Maps and centered FAQs title */}
        <FAQsHeader />

        {/* Padded inner container for tabs + content */}
        <div className="max-w-[960px] w-full mx-auto px-4 sm:px-8 flex flex-col items-center z-10 pb-16 sm:pb-20">
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
        <div className="absolute -bottom-4 -right-4 sm:-bottom-8 sm:-right-8 flex items-center mix-blend-screen pointer-events-none z-20">
          {/* Gemini Star */}
          <div
            className="relative"
            style={{
              width: "clamp(130px, 26vw, 250px)",
              height: "clamp(130px, 26vw, 250px)",
              marginRight: "clamp(-32px, -6.5vw, -60px)",
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
              width: "clamp(120px, 24vw, 230px)",
              height: "clamp(120px, 24vw, 230px)",
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
    </section>
  );
}

