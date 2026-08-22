"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { motion, useScroll, useTransform } from "../gsap-motion";
import { GotQuestionsGraphic } from "../got-questions/GotQuestionsGraphic";
import { GotQuestionsHeading } from "../got-questions/GotQuestionsHeading";
import { GotQuestionsSubHeading } from "../got-questions/GotQuestionsSubHeading";
import { FAQ_CATEGORIES } from "../faqs/FAQsData";
import { FAQsHeader } from "../faqs/FAQsHeader";
import { FAQsTabs } from "../faqs/FAQsTabs";
import { FAQsList } from "../faqs/FAQsList";

function FAQContent() {
  const [activeCategoryId, setActiveCategoryId] = useState("general");
  const activeCategory =
    FAQ_CATEGORIES.find((category) => category.id === activeCategoryId) ?? FAQ_CATEGORIES[0];

  return (
    <div className="relative z-10 max-w-[960px] w-full mx-auto px-2 sm:px-4 flex flex-col items-center pb-8 sm:pb-12">
      <FAQsTabs
        categories={FAQ_CATEGORIES}
        activeCategoryId={activeCategoryId}
        onSelectCategory={setActiveCategoryId}
      />
      <FAQsList category={activeCategory} />
      <a
        href="http://dscv.it/dj26-discord"
        target="_blank"
        rel="noopener noreferrer"
        className="group mt-10 inline-flex items-center gap-2 text-left text-base font-medium text-white/80 transition-colors hover:text-white sm:mt-14 sm:text-lg"
      >
        <span>For more queries, raise a ticket on Discord</span>
        <ArrowRight
          aria-hidden="true"
          className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1 sm:h-5 sm:w-5"
        />
      </a>
    </div>
  );
}

export function GotQuestions() {
  const introRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: introRef,
    offset: ["start start", "end start"],
  });

  // The sticky panel is one viewport tall inside a 240vh track, so it releases
  // at progress (240 - 100) / 240 = 0.583 and spends the last 100vh scrolling
  // away. Everything below is timed against that: the gradient holds through
  // the release and only dissolves while the panel wipes up, so the FAQ block
  // is revealed underneath a live gradient rather than after a stretch of
  // black. Previously the graphic finished fading at 0.85 of a 320vh track,
  // which left ~48vh of an empty black panel reading as its own section.
  // Keep in step with the h-[240vh] class below — Tailwind needs that literal.
  const TRACK_VH = 240;
  const STICKY_RELEASE = (TRACK_VH - 100) / TRACK_VH;

  // Stage 1: triangle apex drops to the bottom edge
  const apexX = useTransform(scrollYProgress, [0, 0.17, 0.34], [550, 480, 260]);
  const apexY = useTransform(scrollYProgress, [0, 0.11, 0.22, 0.34], [0, 160, 380, 650]);

  // Stage 2: full-screen gradient expansion, lines fade — both complete before
  // the panel releases, so the reveal never happens mid-wipe.
  const fullGradientOpacity = useTransform(scrollYProgress, [0.36, 0.52], [0, 1]);
  const linesOpacity = useTransform(scrollYProgress, [0.36, 0.48], [1, 0]);

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

  // Stage 3: both dissolve during the wipe, after STICKY_RELEASE, so the panel
  // is never a plain black rectangle sitting still on screen.
  const graphicOpacity = useTransform(scrollYProgress, [STICKY_RELEASE + 0.16, 0.98], [1, 0]);
  const textOpacity = useTransform(scrollYProgress, [STICKY_RELEASE + 0.1, 0.92], [1, 0]);

  return (
    <section id="got-questions" className="relative w-full bg-black text-white">
      <div ref={introRef} className="relative h-[240vh]">
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

      <div id="faqs" className="relative min-h-screen overflow-hidden bg-black py-4 sm:py-6 md:py-8 px-4 sm:px-8">
        <FAQsHeader />
        <FAQContent />

        <div
          className="absolute flex items-center mix-blend-screen pointer-events-none z-10 md:hidden"
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
