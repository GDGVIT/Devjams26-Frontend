"use client";

import { motion } from "motion/react";

export function FooterArcadeHUD() {
  return (
    <div className="w-full flex flex-col font-mono select-none mb-2 sm:mb-3">
      {/* Row 1: 1UP */}
      <div className="text-white text-xs sm:text-sm md:text-base font-semibold tracking-wider leading-tight">
        1UP
      </div>

      {/* Row 2: 10 READY! + Spectrum Gradient Bar */}
      <div className="flex items-center gap-3 sm:gap-4 mt-0.5 sm:mt-1">
        <div className="flex items-center gap-2 text-sm sm:text-base md:text-lg font-bold leading-none">
          <span className="text-white font-mono tracking-wider">10</span>
          <span className="text-[#FBBF24] font-extrabold tracking-widest">
            READY!
          </span>
        </div>

        {/* Half-line spectrum gradient divider bar */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="h-[3.5px] sm:h-[5px] w-44 sm:w-64 md:w-80 max-w-[50%] rounded-full origin-left"
          style={{
            background:
              "linear-gradient(90deg, #5B6BFF 0%, #D9534F 35%, #F0AD4E 65%, #5CB85C 100%)",
          }}
        />
      </div>
    </div>
  );
}
