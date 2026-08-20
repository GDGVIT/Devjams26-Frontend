"use client";

import AssetImage from "../AssetImage";
import Image from "next/image";
import { motion } from "../gsap-motion";

interface DecorationProps {
  index: number;
}

export function PreviousEventsDecorations({ index }: DecorationProps) {
  if (index === 0) {
    return (
      <motion.div 
        className="hidden md:block absolute left-[2%] lg:left-[6%] xl:left-[10%] top-1/2 -translate-y-1/2 z-0 pointer-events-none"
        initial={{ scale: 0.85, opacity: 0.5 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: false, amount: 0.2 }}
        transition={{ duration: 0.6 }}
      >
        <AssetImage
          src="/assets/logo/triangle.svg"
          alt="Triangle Mesh Graphic"
          width={281}
          height={281}
          className="w-[200px] lg:w-[270px] xl:w-[300px] h-auto object-contain filter drop-shadow-[0_0_30px_rgba(242,125,30,0.25)] opacity-95"
        />
      </motion.div>
    );
  }

  if (index === 1) {
    return (
      <motion.div 
        className="hidden md:flex flex-col gap-6 lg:gap-8 absolute right-[2%] lg:right-[6%] xl:right-[10%] top-1/2 -translate-y-1/2 z-0 pointer-events-none"
        initial={{ scale: 0.85, opacity: 0.5 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: false, amount: 0.2 }}
        transition={{ duration: 0.6 }}
      >
        {/* Top Circle */}
        <AssetImage
          src="/assets/logo/circle.svg"
          alt="Circle Mesh Graphic Top"
          width={170}
          height={170}
          className="w-[150px] lg:w-[180px] xl:w-[200px] h-auto object-contain filter drop-shadow-[0_0_30px_rgba(78,128,235,0.25)] self-center opacity-95"
        />

        {/* Bottom Circle */}
        <AssetImage
          src="/assets/logo/circle.svg"
          alt="Circle Mesh Graphic Bottom"
          width={170}
          height={170}
          className="w-[170px] lg:w-[220px] xl:w-[240px] h-auto object-contain filter drop-shadow-[0_0_30px_rgba(173,90,170,0.25)] self-center opacity-95"
        />
      </motion.div>
    );
  }

  if (index === 2) {
    return (
      <motion.div 
        className="hidden md:block absolute left-[2%] lg:left-[6%] xl:left-[10%] top-1/2 -translate-y-1/2 z-0 pointer-events-none"
        initial={{ scale: 0.85, opacity: 0.5 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: false, amount: 0.2 }}
        transition={{ duration: 0.6 }}
      >
        <Image
          src="/assets/logo/flower.svg"
          alt="Flower Mesh Graphic"
          width={257}
          height={257}
          className="w-[210px] lg:w-[270px] xl:w-[310px] h-auto object-contain filter drop-shadow-[0_0_30px_rgba(242,200,30,0.25)] opacity-95"
        />
      </motion.div>
    );
  }

  return null;
}
