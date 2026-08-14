"use client";

import { motion } from "motion/react";

export function TracksHeader() {
  return (
    <motion.div 
      className="text-center mb-4 relative z-10"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">Tracks</h2>
    </motion.div>
  );
}
