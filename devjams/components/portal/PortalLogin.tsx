"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "../gsap-motion";
import { HeroLogo } from "../hero/HeroLogo";
import { HeroTrackIcons } from "../hero/HeroTrackIcons";
import { ExternalAuthModal } from "./ExternalAuthModal";

export function PortalLogin() {
  const [externalModalOpen, setExternalModalOpen] = useState(false);

  return (
    <main className="relative min-h-screen w-full bg-black text-white flex flex-col items-center justify-center overflow-hidden px-4 py-8 select-none">
      {/* Ambient background glows matching reference design */}
      <div className="absolute -top-32 -left-32 w-[520px] h-[520px] bg-gradient-to-br from-amber-600/20 via-orange-600/10 to-transparent rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-[580px] h-[580px] bg-gradient-to-tl from-emerald-600/15 via-yellow-600/10 to-transparent rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-blue-900/10 rounded-full blur-[160px] pointer-events-none" />


      {/* Main Content Container */}
      <div className="relative z-20 flex flex-col items-center justify-center w-full max-w-5xl mx-auto">
        {/* "Login" Heading */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-white text-2xl sm:text-3xl md:text-4xl font-medium tracking-tight mb-2 sm:mb-4 text-center z-30"
          style={{
            fontFamily: '"Google Sans", var(--font-google-sans), sans-serif',
          }}
        >
          Login
        </motion.h1>

        {/* Center Graphic Box: DevJams '26 Logo + Floating Track Icons (Group 1948755620) */}
        <div className="relative w-full flex flex-col items-center justify-center my-2 sm:my-6 overflow-visible">
          <HeroLogo />
          <HeroTrackIcons />
        </div>

        {/* Action Buttons Row matching mobile and desktop Figma specs */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
          className="relative z-30 mt-6 sm:mt-10 md:mt-12 flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-6 w-full px-4 max-w-5xl"
        >
          {/* Continue As Internal Participant */}
          <Link href="/portal/onboarding" className="w-full sm:w-auto flex justify-center">
            <motion.div
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="group w-full max-w-[266px] sm:max-w-none sm:w-auto sm:min-w-[340px] md:min-w-[420px] h-7 sm:h-[58px] md:h-[64px] px-3 sm:px-10 rounded-full bg-[#343434] hover:bg-white text-white hover:text-black border border-white/10 hover:border-transparent font-normal flex items-center justify-center gap-2 sm:gap-4 transition-colors duration-200 shadow-[0_4px_20px_rgba(0,0,0,0.5)] cursor-pointer select-none text-[12px] sm:text-[18px] md:text-[22.5px]"
              style={{
                fontFamily: '"Google Sans", var(--font-google-sans), sans-serif',
              }}
            >
              <span className="whitespace-nowrap">Continue As Internal Participant</span>
              <svg
                className="w-3.5 h-3.5 sm:w-5 sm:h-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M7 17L17 7M17 7H9M17 7V15" />
              </svg>
            </motion.div>
          </Link>

          {/* "or" separator */}
          <span
            className="text-white font-medium text-base sm:text-xl md:text-[22.5px] px-1 select-none leading-none my-0.5 sm:my-0"
            style={{
              fontFamily: '"Google Sans", var(--font-google-sans), sans-serif',
            }}
          >
            or
          </span>

          {/* Continue As External Participant */}
          <div className="w-full sm:w-auto flex justify-center">
            <motion.button
              type="button"
              onClick={() => setExternalModalOpen(true)}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="group w-full max-w-[266px] sm:max-w-none sm:w-auto sm:min-w-[340px] md:min-w-[420px] h-7 sm:h-[58px] md:h-[64px] px-3 sm:px-10 rounded-full bg-white hover:bg-neutral-200 text-black border-none font-normal flex items-center justify-center gap-2 sm:gap-4 transition-colors duration-200 shadow-[0_4px_20px_rgba(0,0,0,0.5)] cursor-pointer select-none text-[12px] sm:text-[18px] md:text-[22.5px]"
              style={{
                fontFamily: '"Google Sans", var(--font-google-sans), sans-serif',
              }}
            >
              <span className="whitespace-nowrap">Continue As External Participant</span>
              <svg
                className="w-3.5 h-3.5 sm:w-5 sm:h-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M7 17L17 7M17 7H9M17 7V15" />
              </svg>
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* External Auth Modal */}
      <ExternalAuthModal
        isOpen={externalModalOpen}
        onClose={() => setExternalModalOpen(false)}
      />
    </main>
  );
}
