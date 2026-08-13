"use client";

import { Hero } from "../components/sections/Hero";
import { Tracks } from "../components/sections/Tracks";
import { PreviousEvents } from "../components/sections/PreviousEvents";
import { GotQuestions } from "../components/sections/GotQuestions";

export default function Home() {
  return (
    <div className="bg-black min-h-screen">
      {/* Hero Section */}
      <Hero />

      {/* Tracks Section */}
      <Tracks />

      {/* Previous Events Section */}
      <PreviousEvents />

      {/* Got Questions Section */}
      <GotQuestions />
    </div>
  );
}
