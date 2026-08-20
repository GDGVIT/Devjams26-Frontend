"use client";

import { useState } from "react";
import { motion } from "../gsap-motion";
import { DashboardGraphic } from "./DashboardGraphic";
import { JoinTeamModal } from "./JoinTeamModal";
import { CreateTeamModal } from "./CreateTeamModal";

export function TeamChoiceView() {
  const [joinModalOpen, setJoinModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);

  return (
    <main className="relative min-h-screen w-full bg-black text-white flex flex-col items-center justify-center overflow-hidden px-4 py-8 select-none">
      {/* Ambient background glows */}
      <div className="absolute -top-32 -left-32 w-[520px] h-[520px] bg-gradient-to-br from-blue-600/15 via-purple-600/10 to-transparent rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-[580px] h-[580px] bg-gradient-to-tl from-amber-600/15 via-emerald-600/10 to-transparent rounded-full blur-[150px] pointer-events-none" />

      {/* Main Container */}
      <div className="relative z-20 flex flex-col items-center justify-center w-full max-w-5xl mx-auto">
        {/* "Dashboard" Heading matching reference screenshot */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white mb-2 sm:mb-4 text-center"
          style={{
            fontFamily: '"Google Sans", var(--font-google-sans), sans-serif',
          }}
        >
          Dashboard
        </motion.h1>

        {/* Center Graphic */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
          className="w-full flex justify-center"
        >
          <DashboardGraphic />
        </motion.div>

        {/* Action Buttons Row matching reference design */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35, ease: "easeOut" }}
          className="relative z-30 mt-8 sm:mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 w-full px-4 max-w-5xl"
        >
          {/* Continue To Join */}
          <motion.button
            type="button"
            onClick={() => setJoinModalOpen(true)}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className="group w-full sm:w-auto min-w-[280px] sm:min-w-[340px] md:min-w-[380px] h-[60px] sm:h-[66px] px-8 sm:px-12 rounded-full bg-[#2A2A2E]/90 hover:bg-white text-white hover:text-black border border-white/10 hover:border-transparent font-semibold text-base sm:text-lg md:text-[21px] flex items-center justify-center gap-3 sm:gap-4 transition-colors duration-200 shadow-[0_4px_20px_rgba(0,0,0,0.5)] cursor-pointer select-none"
            style={{
              fontFamily: '"Google Sans", var(--font-google-sans), sans-serif',
            }}
          >
            <span className="whitespace-nowrap">Continue To Join</span>
            <svg
              className="w-5 h-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M7 17L17 7M17 7H9M17 7V15" />
            </svg>
          </motion.button>

          {/* "or" separator */}
          <span className="text-white/60 text-sm sm:text-base font-normal px-2 select-none">
            or
          </span>

          {/* Continue To Create */}
          <motion.button
            type="button"
            onClick={() => setCreateModalOpen(true)}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className="group w-full sm:w-auto min-w-[280px] sm:min-w-[340px] md:min-w-[380px] h-[60px] sm:h-[66px] px-8 sm:px-12 rounded-full bg-[#2A2A2E]/90 hover:bg-white text-white hover:text-black border border-white/10 hover:border-transparent font-semibold text-base sm:text-lg md:text-[21px] flex items-center justify-center gap-3 sm:gap-4 transition-colors duration-200 shadow-[0_4px_20px_rgba(0,0,0,0.5)] cursor-pointer select-none"
            style={{
              fontFamily: '"Google Sans", var(--font-google-sans), sans-serif',
            }}
          >
            <span className="whitespace-nowrap">Continue To Create</span>
            <svg
              className="w-5 h-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M7 17L17 7M17 7H9M17 7V15" />
            </svg>
          </motion.button>
        </motion.div>
      </div>

      {/* Modals */}
      <JoinTeamModal
        isOpen={joinModalOpen}
        onClose={() => setJoinModalOpen(false)}
      />
      <CreateTeamModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
      />
    </main>
  );
}
