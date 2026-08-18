"use client";

import { motion } from "../gsap-motion";

export function HeroTagline() {
  return (
    <motion.h1
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.9, ease: "easeOut" }}
      className="mt-2 sm:mt-4 mb-8 text-center relative z-30"
      style={{
        color: "#FFF",
        textAlign: "center",
        fontFamily: '"Google Sans", var(--font-google-sans), sans-serif',
        fontSize: "clamp(18px, 4.5vw, 48px)",
        fontStyle: "normal",
        fontWeight: 700,
        lineHeight: "1.2",
        letterSpacing: "-0.04em",
      }}
    >
      HACK PACK, DEVJAMS’ BACK.
    </motion.h1>
  );
}
