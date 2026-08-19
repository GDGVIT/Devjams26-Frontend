"use client";

import { motion } from "../gsap-motion";
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
    <div className="w-full flex justify-center mt-3 sm:mt-4 mb-8 sm:mb-11 md:mb-14 px-2 select-none z-20">
      <div className="inline-flex items-center justify-center gap-3 sm:gap-6 p-1 rounded-full bg-transparent">
        {categories.map((cat) => {
          const isActive = cat.id === activeCategoryId;

          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`relative px-7 sm:px-9 py-2.5 sm:py-3 rounded-full flex items-center justify-center transition-colors duration-200 outline-none cursor-pointer whitespace-nowrap ${
                isActive ? "text-black" : "text-white/90 hover:text-white"
              }`}
              style={{
                fontFamily: "var(--font-google-sans), sans-serif",
                fontSize: "clamp(1.02rem, 1.6vw, 1.25rem)",
                fontWeight: isActive ? 500 : 400,
              }}
            >
              {isActive && (
                <motion.div
                  layoutId="activeFaqTab"
                  className="absolute inset-0 bg-white rounded-full shadow-[0_2px_14px_rgba(255,255,255,0.2)] z-0"
                  transition={{ type: "spring", stiffness: 420, damping: 32 }}
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


