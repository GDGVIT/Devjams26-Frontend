"use client";

import { HeroLogo } from "../hero/HeroLogo";
import { HeroTrackIcons } from "../hero/HeroTrackIcons";
import { HeroTagline } from "../hero/HeroTagline";
import { HeroCTA } from "../hero/HeroCTA";

export function Hero() {
  return (
    <main className="relative min-h-screen w-full bg-black text-white flex flex-col items-center justify-center overflow-x-hidden px-4 py-10 select-none">
      <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-[1100px]">
        {/* DevJams '26 Logo */}
        <HeroLogo />

        {/* 4 Floating Track SVGs */}
        <HeroTrackIcons />

        {/* Tagline Heading */}
        <HeroTagline />

        {/* Idea Submission CTA Button */}
        <HeroCTA />
      </div>
    </main>
  );
}
