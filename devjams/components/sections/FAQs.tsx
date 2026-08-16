"use client";

import { useState } from "react";
import { FAQ_CATEGORIES } from "../faqs/FAQsData";
import { FAQsHeader } from "../faqs/FAQsHeader";
import { FAQsTabs } from "../faqs/FAQsTabs";
import { FAQsList } from "../faqs/FAQsList";

export function FAQs() {
  const [activeCategoryId, setActiveCategoryId] = useState<string>("general");

  const activeCategory =
    FAQ_CATEGORIES.find((cat) => cat.id === activeCategoryId) || FAQ_CATEGORIES[0];

  return (
    <section className="relative w-full min-h-screen py-6 sm:py-8 md:py-10 bg-black text-white overflow-hidden flex flex-col justify-start">
      {/* Full-bleed Header — icons touch viewport edges */}
      <FAQsHeader />

      {/* Padded inner container for tabs + content */}
      <div className="max-w-[1200px] w-full mx-auto px-4 sm:px-8 md:px-12 flex flex-col items-center">
        {/* Tab Switcher */}
        <FAQsTabs
          categories={FAQ_CATEGORIES}
          activeCategoryId={activeCategoryId}
          onSelectCategory={setActiveCategoryId}
        />

        {/* FAQ Content List */}
        <FAQsList category={activeCategory} />
      </div>
    </section>
  );
}
