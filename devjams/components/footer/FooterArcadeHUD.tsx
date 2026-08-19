"use client";

import { motion } from "../gsap-motion";

export function FooterArcadeHUD() {
  return (
    <div className="w-full flex flex-col font-mono select-none mb-2 sm:mb-2.5">
      {/* Row 1: 1UP */}
      <div className="text-white text-lg sm:text-xl md:text-2xl font-bold tracking-wider leading-tight">
        1UP
      </div>

      {/* Row 2: 10 READY! + Spectrum Gradient Bar */}
      <div className="flex items-center gap-3.5 sm:gap-4.5 mt-0.5 sm:mt-1">
        <div className="flex items-center gap-2.5 text-xl sm:text-2xl md:text-3xl font-black leading-none">
          <span className="text-white font-mono tracking-wider">10</span>
          <span className="text-[#FBBC04] font-black tracking-widest">
            READY!
          </span>
        </div>

        {/* Half-line spectrum gradient divider bar */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="h-[4.5px] sm:h-[6px] w-56 sm:w-76 md:w-96 max-w-[50%] rounded-full origin-left"
          style={{
            background:
              "linear-gradient(90deg, #3186FF 0%, #FC413D 35%, #FBBC04 65%, #00B95C 100%)",
          }}
        />
      </div>
    </div>
  );
}
