"use client";

import { motion, AnimatePresence } from "../gsap-motion";
import { FAQCategory } from "./FAQsData";

interface FAQsListProps {
  category: FAQCategory;
}

export function FAQsList({ category }: FAQsListProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={category.id}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="w-full max-w-full flex flex-col items-start text-left mt-3 sm:mt-5 overflow-hidden px-1 sm:px-2"
      >
        {/* Question & Answer List */}
        <div className="w-full flex flex-col gap-6 sm:gap-8 md:gap-10 items-start text-left">
          {category.items.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.28, delay: index * 0.05 }}
              className="flex flex-col items-start text-left w-full max-w-full sm:max-w-[620px] md:max-w-[800px]"
            >
              {/* Question */}
              <h4
                className="font-medium font-[500] text-white mb-1.5 sm:mb-2 leading-snug break-words"
                style={{
                  fontFamily: "var(--font-google-sans), sans-serif",
                  fontSize: "clamp(2rem, 3.5vw, 36px)",
                }}
              >
                {item.question}
              </h4>

              {/* Answer */}
              <p
                className="font-normal text-gray-300 leading-relaxed w-full break-words opacity-90"
                style={{
                  fontFamily: "var(--font-google-sans), sans-serif",
                  fontSize: "clamp(1rem, 2.5vw, 24px)",
                }}
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
