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
    <div className="w-full max-w-full my-4 sm:my-6 px-2 flex justify-center overflow-x-auto no-scrollbar">
      <div className="flex items-center justify-center min-w-max mx-auto gap-2 sm:gap-4 p-1.5 rounded-full bg-transparent">
        {categories.map((cat) => {
          const isActive = cat.id === activeCategoryId;

          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`relative min-w-[120px] sm:min-w-[170px] md:w-[220px] h-[42px] sm:h-[52px] rounded-full flex items-center justify-center transition-colors duration-200 outline-none select-none cursor-pointer whitespace-nowrap px-4 ${
                isActive ? "text-black" : "text-white hover:text-white/80"
              }`}
              style={{
                fontFamily: "var(--font-google-sans), sans-serif",
                fontSize: "clamp(0.95rem, 1.8vw, 22px)",
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
