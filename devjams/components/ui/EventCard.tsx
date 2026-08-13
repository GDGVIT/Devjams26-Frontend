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
      className={`flex flex-col gap-4 w-full max-w-[500px] group cursor-pointer ${
        alignment === "right" ? "items-start" : "items-end"
      }`}
      initial="hidden"
      whileInView="visible"
      // Relaxed the trigger so it fires earlier and stays visible longer
      viewport={{ margin: "-15% 0px -15% 0px", amount: 0.1 }}
    >
      <motion.div 
        className="w-full overflow-hidden rounded-2xl aspect-[16/10] border border-white/10 relative origin-center shadow-2xl"
        variants={{
          hidden: { scale: 0.75, opacity: 0.3, y: 40 },
          visible: { scale: 1, opacity: 1, y: 0 }
        }}
        transition={{ type: "spring", stiffness: 280, damping: 18, mass: 1 }}
      >
        <div 
          className="w-full h-full bg-cover bg-center transition-transform duration-500 hover:scale-105"
          style={{ 
            backgroundImage: `url(${imageUrl || 'https://via.placeholder.com/800x500/222/555?text=Event+Image'})` 
          }} 
        />
      </motion.div>
      
      <motion.div 
        className={`flex flex-col w-full ${alignment === "right" ? "text-left items-start" : "text-right items-end"}`}
        variants={{
          hidden: { opacity: 0, y: 15 },
          visible: { opacity: 1, y: 0 }
        }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">{title}</h3>
        <p className="text-gray-400 text-sm md:text-base leading-relaxed text-left w-full">
          {description}
        </p>
      </motion.div>
    </motion.div>
  );
}
