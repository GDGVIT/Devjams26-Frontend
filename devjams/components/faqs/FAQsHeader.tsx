"use client";

import ResponsiveSvg from "../ResponsiveSvg";
import { motion } from "../gsap-motion";

export function FAQsHeader() {
  return (
    <div className="relative w-full flex flex-col items-center justify-center pt-2 sm:pt-4 mb-2 sm:mb-4 select-none">
      {/* Left Corner: Web Globe + Maps Pin */}
      <motion.div
        initial={{ opacity: 0, x: -25, scale: 0.9 }}
        whileInView={{ opacity: 1, x: 0, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.65, ease: [0.215, 0.61, 0.355, 1] }}
        className="absolute flex items-center mix-blend-screen pointer-events-none z-10"
        style={{
          left: "clamp(-45px, -6vw, -25px)",
          top: "clamp(-35px, -5vw, -20px)",
        }}
      >
        {/* Web Globe */}
        <div
          className="relative"
          style={{
            width: "clamp(80px, 16vw, 150px)",
            height: "clamp(80px, 16vw, 150px)",
            marginRight: "clamp(-20px, -4vw, -38px)",
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
        {/* Maps Pin */}
        <div
          className="relative"
          style={{
            width: "clamp(85px, 18vw, 160px)",
            height: "clamp(85px, 18vw, 160px)",
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

      {/* Main Title: FAQs (between the two corner groups) */}
      <motion.h2
        initial={{ opacity: 0, y: -15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="font-bold text-white tracking-tight text-center whitespace-nowrap z-30 px-2 mt-2 md:mt-0"
        style={{
          fontFamily: "var(--font-google-sans), sans-serif",
          fontSize: "clamp(3.2rem, 6.2vw, 5.2rem)",
          fontWeight: 700,
        }}
      >
        FAQs
      </motion.h2>

      {/* Right Corner: Gemini + Cloud — mirror of the left group */}
      <motion.div
        initial={{ opacity: 0, x: 30, scale: 0.85 }}
        whileInView={{ opacity: 1, x: 0, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.65, ease: [0.215, 0.61, 0.355, 1] }}
        className="absolute flex items-center mix-blend-screen pointer-events-none z-10 hidden md:flex"
        style={{
          right: "clamp(-45px, -6vw, -25px)",
          top: "clamp(-35px, -5vw, -20px)",
        }}
      >
        <div
          className="relative"
          style={{
            width: "clamp(80px, 16vw, 150px)",
            height: "clamp(80px, 16vw, 150px)",
            marginRight: "clamp(-20px, -4vw, -38px)",
            zIndex: 10,
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
            width: "clamp(85px, 18vw, 160px)",
            height: "clamp(85px, 18vw, 160px)",
            zIndex: 20,
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

