"use client";

import { FooterHeader } from "../footer/FooterHeader";
import { FooterArcadeHUD } from "../footer/FooterArcadeHUD";
import { FooterArcadeBoard } from "../footer/FooterArcadeBoard";

export function Footer() {
  return (
    <footer className="relative w-full min-h-screen py-3 sm:py-5 md:py-6 bg-black text-white px-2 sm:px-4 md:px-6 lg:px-8 overflow-hidden border-t border-white/10 flex flex-col justify-between">
      <div className="w-full flex-1 flex flex-col justify-between max-w-[1600px] mx-auto">
        {/* Header, Socials, and Contact Us */}
        <FooterHeader />

        {/* Arcade Section: HUD + Board */}
        <div className="w-full flex flex-col mt-auto pt-1">
          <FooterArcadeHUD />
          <FooterArcadeBoard />
        </div>
      </div>
    </footer>
  );
}
