"use client";

import { TracksHeader } from "../tracks/TracksHeader";
import { TRACKS_DATA } from "../tracks/TracksData";
import { TrackCarousel } from "../ui/TrackCarousel";

export function Tracks() {
  return (
    <section className="relative w-full py-24 bg-black overflow-hidden flex flex-col items-center">
      {/* Composable Tracks Section Header */}
      <TracksHeader />

      {/* Composable Track Carousel */}
      <div className="w-full max-w-[1400px] mx-auto px-4 mt-12">
        <TrackCarousel tracks={TRACKS_DATA} />
      </div>
    </section>
  );
}
