"use client";

import Image from "next/image";
import { motion } from "motion/react";

export interface LogoLetter {
  src: string;
  alt: string;
  left: number;
  top: number;
  width: number;
  height: number;
  zIndex: number;
}

const logoLetters: LogoLetter[] = [
  { src: "/assets/logo/D.svg", alt: "D", left: -0.25, top: 8.53, width: 138.68, height: 162.3, zIndex: 10 },
  { src: "/assets/logo/e.svg", alt: "e", left: 114.1, top: 47.96, width: 116.46, height: 122.94, zIndex: 9 },
  { src: "/assets/logo/v.svg", alt: "v", left: 193.51, top: 55.68, width: 127.8, height: 115.3, zIndex: 8 },
  { src: "/assets/logo/J.svg", alt: "J", left: 271.25, top: 4.66, width: 106.5, height: 166.23, zIndex: 7 },
  { src: "/assets/logo/a.svg", alt: "a", left: 353.18, top: 47.52, width: 106.04, height: 122.94, zIndex: 6 },
  { src: "/assets/logo/m.svg", alt: "m", left: 448.28, top: 51.62, width: 178.27, height: 119.23, zIndex: 5 },
  { src: "/assets/logo/s.svg", alt: "s", left: 607.61, top: 47.96, width: 101.41, height: 122.94, zIndex: 4 },
  { src: "/assets/logo/'.svg", alt: "'", left: 724.43, top: 1.98, width: 41.39, height: 54.74, zIndex: 3 },
  { src: "/assets/logo/2.svg", alt: "2", left: 773.45, top: 4.66, width: 104.42, height: 166.23, zIndex: 2 },
  { src: "/assets/logo/6.svg", alt: "6", left: 844.59, top: 0, width: 110.67, height: 170.86, zIndex: 1 },
];

export function HeroLogo() {
  return (
    <div className="relative z-30 w-[955.5px] h-[170.98px] max-w-full scale-[0.30] min-[360px]:scale-[0.38] min-[440px]:scale-[0.52] sm:scale-[0.72] md:scale-[0.88] lg:scale-100 -my-10 min-[360px]:-my-6 sm:my-0 transition-all origin-center">
      {logoLetters.map((letter, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: -30, scale: 0.85 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          whileHover={{ y: -6, scale: 1.04, transition: { duration: 0.2 } }}
          transition={{
            duration: 0.55,
            delay: index * 0.045 + 0.1,
            ease: [0.215, 0.61, 0.355, 1],
          }}
          className="absolute cursor-pointer"
          style={{
            left: `${letter.left}px`,
            top: `${letter.top}px`,
            width: `${letter.width}px`,
            height: `${letter.height}px`,
            zIndex: letter.zIndex,
          }}
        >
          <Image
            src={letter.src}
            alt={`DevJams '26 - ${letter.alt}`}
            width={letter.width}
            height={letter.height}
            priority
            className="w-full h-full object-contain filter drop-shadow-[0_0_12px_rgba(255,255,255,0.15)]"
          />
        </motion.div>
      ))}
    </div>
  );
}
