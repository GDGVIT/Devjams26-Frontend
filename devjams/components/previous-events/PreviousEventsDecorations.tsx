"use client";

import { motion } from "motion/react";

interface DecorationProps {
  index: number;
}

export function PreviousEventsDecorations({ index }: DecorationProps) {
  if (index === 0) {
    return (
      <motion.div 
        className="hidden md:block absolute left-[5%] lg:left-[10%] top-1/3 -translate-y-1/2 z-0"
        initial={{ scale: 0.8, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.7 }}
      >
        <svg width="220" height="220" viewBox="0 0 100 100" style={{ transform: "rotate(15deg)" }}>
          <path d="M90 50L15 90L15 10Z" fill="url(#grad-1)" />
          <defs>
            <linearGradient id="grad-1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="50%" stopColor="#22c55e" />
              <stop offset="100%" stopColor="#f59e0b" />
            </linearGradient>
          </defs>
        </svg>
      </motion.div>
    );
  }

  if (index === 1) {
    return (
      <motion.div 
        className="hidden md:flex flex-col gap-8 absolute right-[5%] lg:right-[15%] top-0 bottom-0 justify-center z-0"
        initial={{ scale: 0.8, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.7 }}
      >
        <svg width="130" height="130" viewBox="0 0 100 100" className="ml-12">
          <circle cx="50" cy="50" r="50" fill="url(#grad-2)" />
          <defs>
            <linearGradient id="grad-2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#22c55e" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
          </defs>
        </svg>
        <svg width="180" height="180" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="50" fill="url(#grad-3)" />
          <defs>
            <linearGradient id="grad-3" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="50%" stopColor="#a855f7" />
              <stop offset="100%" stopColor="#22c55e" />
            </linearGradient>
          </defs>
        </svg>
      </motion.div>
    );
  }

  if (index === 2) {
    return (
      <motion.div 
        className="hidden md:block absolute left-[5%] lg:left-[10%] top-1/2 -translate-y-1/2 z-0"
        initial={{ scale: 0.8, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.7 }}
      >
        <svg width="220" height="220" viewBox="0 0 100 100">
          <path d="M50 20 C 70 0, 100 30, 80 50 C 100 70, 70 100, 50 80 C 30 100, 0 70, 20 50 C 0 30, 30 0, 50 20 Z" fill="url(#grad-4)" />
          <defs>
            <linearGradient id="grad-4" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="50%" stopColor="#22c55e" />
              <stop offset="100%" stopColor="#ef4444" />
            </linearGradient>
          </defs>
        </svg>
      </motion.div>
    );
  }

  return null;
}
