"use client";

import Image from "next/image";
import { motion } from "../gsap-motion";

export function FAQsHeader() {
  return (
    <div className="relative w-full flex items-center justify-center pt-2 sm:pt-4 mb-2 sm:mb-4 select-none">
      {/* Top-Left Corner: Web Globe + Maps Pin (bleeding off top-left edge without overlapping text) */}
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
            width: "clamp(95px, 20vw, 175px)",
            height: "clamp(95px, 20vw, 175px)",
            marginRight: "clamp(-24px, -5vw, -45px)",
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
            width: "clamp(100px, 22vw, 190px)",
            height: "clamp(100px, 22vw, 190px)",
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
        className="font-bold text-white tracking-tight text-center whitespace-nowrap z-30"
        style={{
          fontFamily: "var(--font-google-sans), sans-serif",
          fontSize: "clamp(2.2rem, 5.5vw, 3.75rem)",
          fontWeight: 700,
        }}
      >
        FAQs
      </motion.h2>
    </div>
  );
}

