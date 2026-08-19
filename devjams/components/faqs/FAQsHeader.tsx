"use client";

import Image from "next/image";
import { motion } from "../gsap-motion";

export function FAQsHeader() {
  return (
    <div className="relative w-full flex items-center justify-between mb-3 sm:mb-5 select-none overflow-hidden py-1">
      {/* Left Corner: Web + Maps Pin — matches mockups */}
      <motion.div
        initial={{ opacity: 0, x: -30, scale: 0.85 }}
        whileInView={{ opacity: 1, x: 0, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.65, ease: [0.215, 0.61, 0.355, 1] }}
        className="flex items-center mix-blend-screen pointer-events-none flex-shrink-0 -ml-2 sm:-ml-3"
      >
        {/* Web Globe */}
        <div
          className="relative"
          style={{
            width: "clamp(56px, 12vw, 120px)",
            height: "clamp(56px, 12vw, 120px)",
            marginRight: "clamp(-14px, -3vw, -28px)",
            zIndex: 10,
          }}
        >
          <Image
            src="/assets/web.svg"
            alt="Web Track"
            fill
            priority
            className="object-contain"
          />
        </div>
        {/* Maps Pin */}
        <div
          className="relative"
          style={{
            width: "clamp(58px, 13vw, 130px)",
            height: "clamp(58px, 13vw, 130px)",
            zIndex: 20,
          }}
        >
          <Image
            src="/assets/maps.svg"
            alt="Maps Track"
            fill
            priority
            className="object-contain"
          />
        </div>
      </motion.div>

      {/* Main Title: FAQs */}
      <motion.h2
        initial={{ opacity: 0, y: -15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="absolute left-1/2 -translate-x-1/2 font-extrabold text-white tracking-tight text-center whitespace-nowrap z-30 text-3xl sm:text-4xl md:text-5xl lg:text-6xl"
      >
        FAQs
      </motion.h2>

      {/* Right Corner (Desktop only) */}
      <motion.div
        initial={{ opacity: 0, x: 30, scale: 0.85 }}
        whileInView={{ opacity: 1, x: 0, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.65, ease: [0.215, 0.61, 0.355, 1] }}
        className="hidden md:flex items-center mix-blend-screen pointer-events-none flex-shrink-0 -mr-2 sm:-mr-4"
      >
        <div
          className="relative"
          style={{
            width: "clamp(48px, 9.5vw, 130px)",
            height: "clamp(48px, 9.5vw, 130px)",
            marginRight: "clamp(-8px, -1.6vw, -22px)",
            zIndex: 20,
          }}
        >
          <Image
            src="/assets/gemini.svg"
            alt="Gemini Track"
            fill
            priority
            className="object-contain"
          />
        </div>
        <div
          className="relative"
          style={{
            width: "clamp(42px, 8vw, 110px)",
            height: "clamp(42px, 8vw, 110px)",
            zIndex: 10,
          }}
        >
          <Image
            src="/assets/cloud.svg"
            alt="Cloud Track"
            fill
            priority
            className="object-contain"
          />
        </div>
      </motion.div>
    </div>
  );
}
