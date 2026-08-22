"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, MotionValue } from "../gsap-motion";
import { EventCard } from "../ui/EventCard";
import { EVENTS } from "../previous-events/PreviousEventsData";
import { PreviousEventsHeader } from "../previous-events/PreviousEventsHeader";
import { PreviousEventsDecorations } from "../previous-events/PreviousEventsDecorations";

function EventRow({
  event,
  index,
  scrollYProgress,
}: {
  event: (typeof EVENTS)[0];
  index: number;
  scrollYProgress: MotionValue<number>;
}) {
  const isEven = index % 2 !== 0;
  const alignment = isEven ? "left" : "right";

  // Appearance timing synchronized with the moving white dot:
  // Event 0 (top): Appears as dot arrives (0.00 -> 0.15)
  // Event 1 (middle): Hidden until dot reaches middle (0.30 -> 0.46)
  // Event 2 (bottom): Hidden until dot reaches bottom (0.62 -> 0.80)
  const startProgress = index === 0 ? 0.0 : index === 1 ? 0.30 : 0.62;
  const endProgress = index === 0 ? 0.15 : index === 1 ? 0.46 : 0.80;

  const opacity = useTransform(scrollYProgress, [startProgress, endProgress], [0, 1]);
  const scale = useTransform(scrollYProgress, [startProgress, endProgress], [0.82, 1]);
  const y = useTransform(scrollYProgress, [startProgress, endProgress], [35, 0]);

  return (
    <div
      className={`w-full flex ${
        isEven ? "md:justify-start" : "md:justify-end"
      } justify-start pl-10 sm:pl-14 md:pl-0 pr-2 md:pr-0 relative`}
    >
      {/* Decorative Background SVGs (Triangle, Circles, Flower on Desktop) */}
      <PreviousEventsDecorations index={index} />

      {/* Composable Event Card */}
      <motion.div
        style={{ opacity, scale, y }}
        className="w-full md:w-[45%] flex justify-start md:block relative z-10"
      >
        <EventCard
          title={event.title}
          description={event.description}
          imageUrl={event.imageUrl}
          alignment={alignment}
        />
      </motion.div>
    </div>
  );
}

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
    <section
      id="gallery"
      ref={sectionRef}
      className="relative w-full py-16 sm:py-20 md:py-28 bg-black overflow-hidden px-4 sm:px-6 md:px-8"
    >
      <div className="max-w-6xl mx-auto relative">
        {/* Composable Header */}
        <PreviousEventsHeader />

        <div className="relative w-full flex flex-col items-center mt-6 sm:mt-10 md:mt-12">
          {/* Central Timeline Line - left-aligned on mobile, centered on desktop */}
          <div
            className="absolute left-3.5 sm:left-5 md:left-1/2 top-0 bottom-0 w-6 sm:w-4 md:w-12 lg:w-14 -translate-x-1/2 rounded-full opacity-95 shadow-[0_0_28px_rgba(242,125,30,0.3)]"
            style={{
              background:
                "linear-gradient(180deg, #F27D1E 0%, #DC4855 24%, #AD5AAA 50%, #4E80EB 76%, #F2C81E 100%)",
            }}
          />

          {/* Dynamic Scroll-Driven Glowing White Dot */}
          <div className="absolute left-3.5 sm:left-5 md:left-1/2 -translate-x-1/2 top-3 bottom-3 sm:top-5 sm:bottom-5 md:top-8 md:bottom-8 w-3.5 sm:w-4 md:w-12 lg:w-14 flex justify-center pointer-events-none z-30">
            <motion.div
              className="absolute w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-8 md:h-8 lg:w-9 lg:h-9 rounded-full bg-white shadow-[0_0_14px_4px_rgba(255,255,255,0.95)] md:shadow-[0_0_24px_6px_rgba(255,255,255,0.95)] -translate-y-1/2"
              style={{ top: dotTop }}
            />
          </div>

          {/* Event Cards with generous whitespace & spacing */}
          <div className="w-full flex flex-col gap-20 sm:gap-24 md:gap-36 relative z-10">
            {EVENTS.map((event, index) => (
              <EventRow
                key={event.id}
                event={event}
                index={index}
                scrollYProgress={scrollYProgress}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
