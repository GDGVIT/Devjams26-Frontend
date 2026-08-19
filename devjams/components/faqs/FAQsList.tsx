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
        className="w-full max-w-[920px] mx-auto flex flex-col items-start text-left px-2 sm:px-4 z-10"
      >
        {/* Question & Answer List with generous whitespace and larger bold font */}
        <div className="w-full flex flex-col gap-9 sm:gap-12 md:gap-16 items-start text-left">
          {category.items.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.06 }}
              className="flex flex-col items-start text-left w-full"
            >
              {/* Question */}
              <h3
                className="font-medium text-white mb-3 sm:mb-3.5 leading-snug break-words tracking-normal text-left"
                style={{
                  fontFamily: "var(--font-google-sans), sans-serif",
                  fontSize: "clamp(1.75rem, 3.8vw, 2.75rem)",
                  fontWeight: 500,
                }}
              >
                {item.question}
              </h3>

              {/* Answer */}
              <p
                className="font-normal text-gray-300 leading-relaxed max-w-[880px] break-words text-left opacity-95"
                style={{
                  fontFamily: "var(--font-google-sans), sans-serif",
                  fontSize: "clamp(1.18rem, 2.4vw, 1.6rem)",
                  lineHeight: "1.65",
                  fontWeight: 400,
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



