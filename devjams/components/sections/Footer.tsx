"use client";

import { FooterHeader } from "../footer/FooterHeader";
import { FooterArcadeHUD } from "../footer/FooterArcadeHUD";
import { FooterArcadeBoard } from "../footer/FooterArcadeBoard";

export function Footer() {
  return (
    <footer id="contact" className="relative w-full pt-16 sm:pt-20 md:pt-24 pb-8 sm:pb-10 md:pb-12 bg-black text-white px-4 sm:px-6 md:px-8 lg:px-12 border-t border-white/10 flex flex-col justify-start">
      <div className="w-full flex flex-col max-w-[1600px] mx-auto gap-6 sm:gap-8 md:gap-9">
        {/* Header, Socials, and Contact Us */}
        <FooterHeader />

        {/* Arcade Section: HUD + Board */}
        <div className="w-full flex flex-col pt-1">
          <FooterArcadeHUD />
          <FooterArcadeBoard />
        </div>
      </div>
    </footer>
  );
}
