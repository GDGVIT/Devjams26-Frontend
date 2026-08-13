"use client";

import { motion } from "motion/react";
import { EventCard } from "../ui/EventCard";
import { EVENTS } from "../previous-events/PreviousEventsData";
import { PreviousEventsHeader } from "../previous-events/PreviousEventsHeader";
import { PreviousEventsDecorations } from "../previous-events/PreviousEventsDecorations";

export function PreviousEvents() {
  return (
    <section className="relative w-full py-24 bg-black overflow-hidden px-4 md:px-8">
      <div className="max-w-6xl mx-auto relative">
        {/* Composable Header */}
        <PreviousEventsHeader />

        <div className="relative w-full flex flex-col items-center">
          {/* Central Timeline Line */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-12 md:-translate-x-1/2 bg-gradient-to-b from-orange-400 via-purple-500 to-blue-500 rounded-full opacity-90" />

          <div className="w-full flex flex-col gap-16 md:gap-32 relative z-10">
            {EVENTS.map((event, index) => {
              const isEven = index % 2 !== 0;
              const alignment = isEven ? "left" : "right";

              return (
                <div 
                  key={event.id} 
                  className={`w-full flex ${
                    isEven ? "md:justify-start" : "md:justify-end"
                  } justify-start pl-14 md:pl-0 relative`}
                >
                  {/* Composable Decorative Background SVG */}
                  <PreviousEventsDecorations index={index} />

                  {/* Timeline Dot */}
                  <motion.div 
                    className="absolute left-[14px] md:left-1/2 w-6 h-6 rounded-full bg-white top-[40%] md:top-1/2 -translate-y-1/2 shadow-[0_0_15px_rgba(255,255,255,0.8)] z-20 md:-translate-x-1/2" 
                    initial={{ scale: 0, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  />

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
