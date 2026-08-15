"use client";

import { motion } from "motion/react";

export function PreviousEventsHeader() {
  return (
    <motion.div 
      className="text-center mb-10 sm:mb-16 md:mb-24"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight">Previous Events</h2>
    </motion.div>
  );
}
