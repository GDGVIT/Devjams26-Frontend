"use client";

import { motion } from "motion/react";

export function TracksHeader() {
  return (
    <motion.div 
      className="text-center mb-1 sm:mb-2 relative z-10"
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <h2 
        className="text-white tracking-tight"
        style={{
          fontFamily: "var(--font-google-sans), sans-serif",
          fontSize: "clamp(2.5rem, 5vw, 64px)",
          fontWeight: 500,
          lineHeight: 1.05,
        }}
      >
        Tracks
      </h2>
    </motion.div>
  );
}
