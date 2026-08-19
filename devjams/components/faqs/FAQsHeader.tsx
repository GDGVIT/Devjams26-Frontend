"use client";

import ResponsiveSvg from "../ResponsiveSvg";
import { motion } from "../gsap-motion";

export function FAQsHeader() {
  return (
    <div className="relative w-full flex items-center justify-between mb-2 sm:mb-4 select-none overflow-hidden py-1">
      {/* Left Corner: Android + Web — flush to left edge (No glow) */}
      <motion.div
        initial={{ opacity: 0, x: -30, scale: 0.85 }}
        whileInView={{ opacity: 1, x: 0, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.65, ease: [0.215, 0.61, 0.355, 1] }}
        className="flex items-center mix-blend-screen pointer-events-none flex-shrink-0 -ml-2 sm:-ml-4"
      >
        <div
          className="relative"
          style={{
            width: "clamp(42px, 8vw, 110px)",
            height: "clamp(42px, 8vw, 110px)",
            marginRight: "clamp(-8px, -1.6vw, -22px)",
            zIndex: 10,
          }}
        >
          <ResponsiveSvg
            src="/assets/android.svg"
            alt="Android Track"
            fill
            priority
            className="object-contain"
          />
        </div>
        <div
          className="relative"
          style={{
            width: "clamp(48px, 9.5vw, 130px)",
            height: "clamp(48px, 9.5vw, 130px)",
            zIndex: 20,
          }}
        >
          <ResponsiveSvg
            src="/assets/web.svg"
            alt="Web Track"
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
        className="absolute left-1/2 -translate-x-1/2 font-extrabold text-white tracking-tight text-center whitespace-nowrap z-30 text-4xl sm:text-5xl md:text-6xl"
      >
        FAQs
      </motion.h2>

      {/* Right Corner: Gemini + Cloud — flush to right edge (No glow) */}
      <motion.div
        initial={{ opacity: 0, x: 30, scale: 0.85 }}
        whileInView={{ opacity: 1, x: 0, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.65, ease: [0.215, 0.61, 0.355, 1] }}
        className="flex items-center mix-blend-screen pointer-events-none flex-shrink-0 -mr-2 sm:-mr-4"
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
          <ResponsiveSvg
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
          <ResponsiveSvg
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
