"use client";

import { motion } from "motion/react";

export function HeroCTA() {
  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, scale: 0.85, y: 15 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay: 1.1,
        type: "spring",
        stiffness: 220,
        damping: 18,
      }}
      whileHover={{
        scale: 1.07,
        backgroundColor: "#ffffff",
        boxShadow: "0 0 35px rgba(255,255,255,0.45)",
      }}
      whileTap={{ scale: 0.94 }}
      className="cursor-pointer bg-white text-black font-bold text-lg rounded-full flex items-center justify-center transition-shadow shadow-[0_0_20px_rgba(255,255,255,0.25)] relative z-30"
      style={{
        width: "243px",
        height: "55px",
        fontFamily: '"Google Sans", var(--font-google-sans), sans-serif',
      }}
    >
      Idea Submission
    </motion.button>
  );
}
