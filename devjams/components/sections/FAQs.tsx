"use client";

import { useRef, useState } from "react";
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
      className="relative w-full min-h-screen py-4 sm:py-6 md:py-8 bg-black text-white overflow-hidden flex flex-col justify-start [perspective:1400px]"
    >
      <motion.div
        style={{
          rotateX,
          scale,
          opacity,
          transformOrigin: "top center",
        }}
        className="w-full flex flex-col items-center"
      >
        {/* Full-bleed Header — icons touch viewport edges */}
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
    </section>
  );
}
