"use client";

import { useRef } from "react";
import { TracksHeader } from "../tracks/TracksHeader";
import { TRACKS_DATA } from "../tracks/TracksData";
import { TrackCarousel } from "../ui/TrackCarousel";
import { useScroll } from "../gsap-motion";

export function Tracks() {
  const sectionRef = useRef<HTMLDivElement>(null);

  // Track scroll progress across the sticky container for desktop
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  return (
    <section
      id="tracks"
      ref={sectionRef}
      className="relative w-full bg-black md:h-[320vh]"
    >
      {/* ========================================================================= */}
      {/* Desktop Sticky Pinned Viewport: cards move as user scrolls down the page  */}
      {/* ========================================================================= */}
      <div className="hidden md:flex sticky top-0 h-screen w-full flex-col items-center justify-center overflow-hidden px-4 py-8">
        <TracksHeader />

        <div className="w-full max-w-[1400px] mx-auto mt-2">
          <TrackCarousel
            tracks={TRACKS_DATA}
            scrollProgress={scrollYProgress}
            sectionRef={sectionRef}
          />
        </div>
      </div>

      {/* ========================================================================= */}
      {/* Mobile Flow View: normal section height with swipeable carousel           */}
      {/* ========================================================================= */}
      <div className="flex md:hidden flex-col items-center w-full py-10 sm:py-14 px-3 overflow-hidden">
        <TracksHeader />

        <div className="w-full max-w-sm mx-auto mt-2">
          <TrackCarousel tracks={TRACKS_DATA} />
        </div>
      </div>
    </section>
  );
}
