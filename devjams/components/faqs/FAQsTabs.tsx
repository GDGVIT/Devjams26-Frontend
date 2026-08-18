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
    <div className="flex items-center justify-center w-full my-4 sm:my-6 px-2 overflow-x-auto">
      <div className="inline-flex items-center gap-2 sm:gap-4 p-1.5 rounded-full bg-transparent">
        {categories.map((cat) => {
          const isActive = cat.id === activeCategoryId;

          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`relative min-w-[150px] sm:min-w-[190px] md:w-[243px] h-[48px] sm:h-[55px] rounded-full flex items-center justify-center transition-colors duration-200 outline-none select-none cursor-pointer whitespace-nowrap px-4 ${
                isActive ? "text-black" : "text-white hover:text-white/80"
              }`}
              style={{
                fontFamily: "var(--font-google-sans), sans-serif",
                fontSize: "clamp(1.1rem, 2vw, 24px)",
                fontWeight: 400,
              }}
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
