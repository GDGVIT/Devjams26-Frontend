"use client";

import { FooterHeader } from "../footer/FooterHeader";
import { FooterArcadeHUD } from "../footer/FooterArcadeHUD";
import { FooterArcadeBoard } from "../footer/FooterArcadeBoard";

export function Footer() {
  return (
    <footer className="relative w-full py-6 sm:py-8 md:py-10 bg-black text-white px-3 sm:px-4 md:px-6 lg:px-8 overflow-hidden border-t border-white/10 flex flex-col justify-start md:justify-between md:min-h-screen">
      <div className="w-full flex-1 flex flex-col justify-start md:justify-between max-w-[1600px] mx-auto gap-5 sm:gap-7 md:gap-8">
        {/* Header, Socials, and Contact Us */}
        <FooterHeader />

        {/* Arcade Section: HUD + Board */}
        <div className="w-full flex flex-col mt-2 sm:mt-4 md:mt-auto pt-1">
          <FooterArcadeHUD />
          <FooterArcadeBoard />
        </div>
      </div>
    </footer>
  );
}
