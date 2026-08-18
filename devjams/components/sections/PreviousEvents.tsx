"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { EventCard } from "../ui/EventCard";
import { EVENTS } from "../previous-events/PreviousEventsData";
import { PreviousEventsHeader } from "../previous-events/PreviousEventsHeader";
import { PreviousEventsDecorations } from "../previous-events/PreviousEventsDecorations";

export function PreviousEvents() {
  const sectionRef = useRef<HTMLDivElement>(null);

  // Track scroll progress across the whole section
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start center", "end center"],
  });

  // Map scroll progress to a percentage along the timeline (0% top → 100% bottom)
  const dotTop = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section ref={sectionRef} className="relative w-full py-12 sm:py-16 md:py-24 bg-black overflow-hidden px-3 sm:px-6 md:px-8">
      <div className="max-w-6xl mx-auto relative">
        {/* Composable Header */}
        <PreviousEventsHeader />

        <div className="relative w-full flex flex-col items-center">
          {/* Central Timeline Line - wider with exact smooth gradient matching Figma reference */}
          <div 
            className="absolute left-3 sm:left-5 md:left-1/2 top-0 bottom-0 w-6 sm:w-9 md:w-12 lg:w-14 md:-translate-x-1/2 rounded-full opacity-95 shadow-[0_0_28px_rgba(242,125,30,0.3)]"
            style={{
              background: "linear-gradient(180deg, #F27D1E 0%, #DC4855 24%, #AD5AAA 50%, #4E80EB 76%, #F2C81E 100%)"
            }}
          />

          {/* Only Single Scroll-Driven Glowing White Dot */}
          <div className="absolute left-3 sm:left-5 md:left-1/2 top-3 bottom-3 sm:top-5 sm:bottom-5 md:top-8 md:bottom-8 w-6 sm:w-9 md:w-12 lg:w-14 md:-translate-x-1/2 flex justify-center pointer-events-none z-30">
            <motion.div
              className="absolute w-4 h-4 sm:w-6 sm:h-6 md:w-8 md:h-8 lg:w-9 lg:h-9 rounded-full bg-white shadow-[0_0_14px_4px_rgba(255,255,255,0.9)] md:shadow-[0_0_24px_6px_rgba(255,255,255,0.95)] -translate-y-1/2"
              style={{ top: dotTop }}
            />
          </div>

          <div className="w-full flex flex-col gap-10 sm:gap-16 md:gap-32 relative z-10">
            {EVENTS.map((event, index) => {
              const isEven = index % 2 !== 0;
              const alignment = isEven ? "left" : "right";

              return (
                <div
                  key={event.id}
                  className={`w-full flex ${
                    isEven ? "md:justify-start" : "md:justify-end"
                  } justify-start pl-8 sm:pl-16 md:pl-0 relative`}
                >
                  {/* Composable Decorative Background SVG */}
                  <PreviousEventsDecorations index={index} />

                  {/* Composable Event Card */}
                  <div className="w-full md:w-[45%] flex relative z-10">
                    <EventCard
                      title={event.title}
                      description={event.description}
                      imageUrl={event.imageUrl}
                      alignment={alignment}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
