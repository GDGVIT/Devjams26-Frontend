"use client";

import Image from "next/image";
import { motion } from "motion/react";

export default function Home() {
  const logoLetters = [
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

  const trackIcons = [
    { src: "/assets/android.svg", alt: "Android Track", width: 260, height: 159, className: "w-[210px] sm:w-[260px] -mr-8 sm:-mr-12 z-10" },
    { src: "/assets/web.svg", alt: "Web Track", width: 288, height: 288, className: "w-[220px] sm:w-[280px] -mr-8 sm:-mr-12 z-20" },
    { src: "/assets/gemini.svg", alt: "Gemini Track", width: 301, height: 301, className: "w-[230px] sm:w-[290px] -mr-8 sm:-mr-12 z-30" },
    { src: "/assets/cloud.svg", alt: "Cloud Track", width: 278, height: 203, className: "w-[220px] sm:w-[275px] z-40" },
  ];

  return (
    <main className="relative min-h-screen w-full bg-black text-white flex flex-col items-center justify-center overflow-x-hidden px-4 py-10 select-none">
      <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-[1100px]">
        {/* DevJams '26 Logo Container - Placed ON TOP (z-30) */}
        <div className="relative z-30 w-[955.5px] h-[170.98px] max-w-full scale-[0.36] min-[440px]:scale-[0.52] sm:scale-[0.72] md:scale-[0.88] lg:scale-100 transition-all origin-center">
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

        {/* 4 Track SVGs Row - Positioned BEHIND DevJams '26 (z-10) */}
        <div className="relative z-10 flex items-center justify-center -mt-8 sm:-mt-14 md:-mt-20 scale-[0.75] sm:scale-90 md:scale-100 origin-center pointer-events-none">
          {trackIcons.map((icon, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                duration: 0.6,
                delay: 0.5 + index * 0.1,
                ease: "easeOut",
              }}
              className={`relative flex items-center justify-center mix-blend-screen ${icon.className}`}
            >
              <motion.div
                animate={{ y: [0, index % 2 === 0 ? -8 : 8, 0] }}
                transition={{
                  duration: 4 + index * 0.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <Image
                  src={icon.src}
                  alt={icon.alt}
                  width={icon.width}
                  height={icon.height}
                  priority
                  className="object-contain"
                />
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Tagline Text */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9, ease: "easeOut" }}
          className="mt-2 sm:mt-4 mb-8 text-center relative z-30"
          style={{
            color: "#FFF",
            textAlign: "center",
            fontFamily: '"Google Sans", var(--font-google-sans), sans-serif',
            fontSize: "clamp(26px, 4.5vw, 48px)",
            fontStyle: "normal",
            fontWeight: 700,
            lineHeight: "normal",
            letterSpacing: "-2.4px",
          }}
        >
          HACK PACK, DEVJAMS’ BACK.
        </motion.h1>

        {/* Idea Submission Button */}
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
      </div>
    </main>
  );
}
