"use client";

import { motion } from "motion/react";

interface EventCardProps {
  title: string;
  description: string;
  imageUrl: string;
  alignment: "left" | "right";
}

export function EventCard({ title, description, imageUrl, alignment }: EventCardProps) {
  return (
    <motion.div 
      className={`flex flex-col gap-2.5 sm:gap-4 w-full max-w-[500px] group cursor-pointer items-start ${
        alignment === "right" ? "md:items-start" : "md:items-end"
      }`}
      initial="hidden"
      whileInView="visible"
      // Relaxed the trigger so it fires earlier and stays visible longer
      viewport={{ margin: "-15% 0px -15% 0px", amount: 0.1 }}
    >
      <motion.div 
        className="w-full overflow-hidden rounded-xl sm:rounded-2xl aspect-[16/10] border border-white/10 relative origin-center shadow-2xl"
        style={{ willChange: "transform, opacity" }}
        variants={{
          hidden: { scale: 0.85, opacity: 0, y: 30 },
          visible: { scale: 1, opacity: 1, y: 0 }
        }}
        transition={{ type: "spring", stiffness: 340, damping: 24, mass: 0.75 }}
      >
        <div 
          className="w-full h-full bg-cover bg-center transition-transform duration-500 hover:scale-105"
          style={{ 
            backgroundImage: `url(${imageUrl || 'https://via.placeholder.com/800x500/222/555?text=Event+Image'})` 
          }} 
        />
      </motion.div>
      
      <motion.div 
        className="flex flex-col w-full text-left items-start"
        style={{ willChange: "transform, opacity" }}
        variants={{
          hidden: { opacity: 0, y: 12 },
          visible: { opacity: 1, y: 0 }
        }}
        transition={{ duration: 0.35, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
      >
        <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1 sm:mb-2">{title}</h3>
        <p className="text-gray-300 text-xs sm:text-sm md:text-base leading-relaxed text-left w-full">
          {description}
        </p>
      </motion.div>
    </motion.div>
  );
}
