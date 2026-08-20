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
        {/* Question & Answer List */}
        <div className="w-full flex flex-col gap-5 sm:gap-7 md:gap-8 items-start text-left">
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
                className="font-medium text-white mb-2 sm:mb-2.5 leading-snug break-words tracking-normal text-left text-[30px] sm:text-[30px] md:text-[clamp(1.4rem,1.9vw,1.75rem)]"
                style={{
                  fontFamily: "var(--font-google-sans), sans-serif",
                  fontWeight: 500,
                }}
              >
                {item.question}
              </h3>

              {/* Answer */}
              <p
                className="font-normal text-gray-300 leading-relaxed max-w-[880px] break-words text-left opacity-90 text-[18px] sm:text-[18px] md:text-[clamp(1.08rem,1.28vw,1.22rem)]"
                style={{
                  fontFamily: "var(--font-google-sans), sans-serif",
                  lineHeight: "1.6",
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



