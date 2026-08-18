"use client";

import Image from "next/image";
import { motion } from "../gsap-motion";

interface DecorationProps {
  index: number;
}

export function PreviousEventsDecorations({ index }: DecorationProps) {
  if (index === 0) {
    return (
      <motion.div 
        className="hidden md:block absolute left-[3%] lg:left-[8%] top-1/2 -translate-y-1/2 z-0 pointer-events-none"
        initial={{ scale: 0.8, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.7 }}
      >
        <Image
          src="/assets/logo/triangle.svg"
          alt="Triangle Mesh Graphic"
          width={281}
          height={281}
          className="w-[180px] lg:w-[250px] h-auto object-contain filter drop-shadow-[0_0_24px_rgba(255,255,255,0.12)]"
        />
      </motion.div>
    );
  }

  if (index === 1) {
    return (
      <motion.div 
        className="hidden md:flex flex-col gap-8 absolute right-[3%] lg:right-[8%] top-1/2 -translate-y-1/2 z-0 pointer-events-none"
        initial={{ scale: 0.8, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.7 }}
      >
        {/* Top Circle */}
        <Image
          src="/assets/logo/circle.svg"
          alt="Circle Mesh Graphic Top"
          width={170}
          height={170}
          className="w-[140px] lg:w-[170px] h-auto object-contain filter drop-shadow-[0_0_24px_rgba(255,255,255,0.12)] self-center"
        />

        {/* Bottom Circle */}
        <Image
          src="/assets/logo/circle.svg"
          alt="Circle Mesh Graphic Bottom"
          width={170}
          height={170}
          className="w-[160px] lg:w-[210px] h-auto object-contain filter drop-shadow-[0_0_24px_rgba(255,255,255,0.12)] self-center"
        />
      </motion.div>
    );
  }

  if (index === 2) {
    return (
      <motion.div 
        className="hidden md:block absolute left-[3%] lg:left-[8%] top-1/2 -translate-y-1/2 z-0 pointer-events-none"
        initial={{ scale: 0.8, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.7 }}
      >
        <Image
          src="/assets/logo/flower.svg"
          alt="Flower Mesh Graphic"
          width={257}
          height={257}
          className="w-[190px] lg:w-[250px] h-auto object-contain filter drop-shadow-[0_0_24px_rgba(255,255,255,0.12)]"
        />
      </motion.div>
    );
  }

  return null;
}
