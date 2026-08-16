"use client";

import { motion, AnimatePresence } from "motion/react";
import { FAQCategory } from "./FAQsData";

interface FAQsListProps {
  category: FAQCategory;
}

export function FAQsList({ category }: FAQsListProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={category.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="w-full flex flex-col items-start text-left mt-2 sm:mt-4"
      >
        {/* Active Category Title (e.g. General:) */}
        <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-3 sm:mb-4 tracking-tight">
          {category.name}:
        </h3>

        {/* Question & Answer List */}
        <div className="w-full flex flex-col gap-3.5 sm:gap-4 md:gap-5">
          {category.items.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: index * 0.04 }}
              className="flex flex-col items-start text-left w-full border-b border-white/10 pb-3 sm:pb-4 last:border-b-0"
            >
              <h4 className="text-base sm:text-lg md:text-xl font-bold text-white mb-1 leading-snug break-words">
                {item.question}
              </h4>
              <p className="text-gray-300 text-xs sm:text-sm md:text-base leading-relaxed w-full max-w-full break-words">
                {item.answer}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
