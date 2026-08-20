"use client";

import { motion } from "../gsap-motion";
import AssetImage from "../AssetImage";
export interface TrackIcon {
  src: string;
  alt: string;
  width: number;
  height: number;
  className: string;
}

const trackIcons: TrackIcon[] = [
  { src: "/assets/android.svg", alt: "Android Track", width: 260, height: 159, className: "w-[130px] min-[380px]:w-[170px] sm:w-[260px] -mr-6 min-[380px]:-mr-8 sm:-mr-12 z-10" },
  { src: "/assets/web.svg", alt: "Web Track", width: 288, height: 288, className: "w-[140px] min-[380px]:w-[180px] sm:w-[280px] -mr-6 min-[380px]:-mr-8 sm:-mr-12 z-20" },
  { src: "/assets/gemini.svg", alt: "Gemini Track", width: 301, height: 301, className: "w-[145px] min-[380px]:w-[185px] sm:w-[290px] -mr-6 min-[380px]:-mr-8 sm:-mr-12 z-30" },
  { src: "/assets/cloud.svg", alt: "Cloud Track", width: 278, height: 203, className: "w-[140px] min-[380px]:w-[175px] sm:w-[275px] z-40" },
];

export function HeroTrackIcons() {
  return (
    <div className="relative z-10 flex items-center justify-center -mt-4 min-[380px]:-mt-8 sm:-mt-14 md:-mt-20 scale-[0.65] min-[380px]:scale-[0.78] sm:scale-90 md:scale-100 origin-center pointer-events-none max-w-full">
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
            <AssetImage
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
  );
}
