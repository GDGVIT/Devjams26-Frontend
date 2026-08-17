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
        <h3
          className="font-medium font-[500] text-white mb-2 sm:mb-3 md:mb-4 tracking-tight leading-tight"
          style={{ fontSize: "clamp(28px, 3.8vw, 48px)" }}
        >
          {category.name}:
        </h3>

        {/* Question & Answer List */}
        <div className="w-full flex flex-col gap-3 sm:gap-4 md:gap-5">
          {category.items.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: index * 0.04 }}
              className="flex flex-col items-start text-left w-full border-b border-white/10 pb-2.5 sm:pb-3.5 last:border-b-0"
            >
              <h4
                className="font-normal font-[400] text-white mb-1 leading-snug break-words"
                style={{ fontSize: "clamp(20px, 2.7vw, 36px)" }}
              >
                {item.question}
              </h4>
              <p
                className="font-normal font-[400] text-gray-300 leading-relaxed w-full max-w-full break-words"
                style={{ fontSize: "clamp(15px, 1.8vw, 24px)" }}
              >
                {item.answer}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
