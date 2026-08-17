"use client";

import { motion } from "motion/react";
import { FAQCategory } from "./FAQsData";

interface FAQsTabsProps {
  categories: FAQCategory[];
  activeCategoryId: string;
  onSelectCategory: (id: string) => void;
}

export function FAQsTabs({
  categories,
  activeCategoryId,
  onSelectCategory,
}: FAQsTabsProps) {
  return (
    <div className="flex items-center justify-center w-full my-1 sm:my-2 px-2">
      <div className="inline-flex items-center gap-1 sm:gap-2 p-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
        {categories.map((cat) => {
          const isActive = cat.id === activeCategoryId;

          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`relative px-5 sm:px-8 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold transition-colors duration-200 outline-none select-none cursor-pointer whitespace-nowrap ${
                isActive ? "text-black" : "text-white/70 hover:text-white"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeFaqTab"
                  className="absolute inset-0 bg-white rounded-full shadow-lg z-0"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <span className="relative z-10">{cat.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
