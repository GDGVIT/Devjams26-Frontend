"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "../../components/gsap-motion";

export default function ProfilePage() {
  const router = useRouter();

  return (
    <main className="relative min-h-screen w-full bg-black text-white flex flex-col items-center justify-start overflow-x-hidden overflow-y-auto select-none p-6 md:p-10 pb-20">
      {/* Top Floating Graphics Banner (Group 1948755625) */}
      <div
        className="relative pointer-events-none z-10 w-full max-w-[1440px] h-[clamp(110px,16vw,220px)] -mt-[clamp(24px,4vw,60px)] flex items-center justify-between overflow-visible px-4 sm:px-8"
        aria-hidden="true"
      >
        {/* 1. Left Pair: NotebookLLM + Cursor */}
        <div className="relative w-[30%] max-w-[260px] h-full flex items-center justify-start">
          {/* NotebookLLM */}
          <div
            className="absolute left-0 top-[10%] w-[55%] aspect-square flex items-center justify-center"
            style={{
              mixBlendMode: "screen",
              filter: "brightness(1.15) saturate(1.05)",
            }}
          >
            <Image
              src="/assets/baked/notebookllm.png"
              alt="NotebookLLM"
              width={176}
              height={120}
              priority
              className="w-full h-full object-contain"
            />
          </div>

          {/* Cursor (Overlapping to right of NotebookLLM) */}
          <div
            className="absolute left-[38%] top-[12%] w-[58%] aspect-[171/144] flex items-center justify-center"
            style={{
              mixBlendMode: "screen",
              filter: "brightness(1.15) saturate(1.05)",
            }}
          >
            <Image
              src="/assets/baked/cursor.png"
              alt="Cursor"
              width={171}
              height={144}
              priority
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        {/* 2. Middle Pair: Antigravity + Folder */}
        <div className="relative w-[34%] max-w-[320px] h-full flex items-center justify-center">
          {/* Antigravity Arch */}
          <div
            className="absolute left-[5%] top-[5%] w-[65%] aspect-[299/276] flex items-center justify-center"
            style={{
              mixBlendMode: "screen",
              filter: "brightness(1.12) saturate(1.05)",
            }}
          >
            <Image
              src="/assets/baked/antigravity.png"
              alt="Antigravity"
              width={299}
              height={276}
              priority
              className="w-full h-full object-contain"
            />
          </div>

          {/* Folder Graphic (Overlapping right of Antigravity) */}
          <div
            className="absolute left-[45%] top-[15%] w-[52%] aspect-[149/121] flex items-center justify-center"
            style={{
              mixBlendMode: "screen",
              filter: "brightness(1.12) saturate(1.05)",
            }}
          >
            <Image
              src="/assets/baked/folder.png"
              alt="Folder"
              width={149}
              height={121}
              priority
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        {/* 3. Right Pair: Maps + Four-Petal */}
        <div className="relative w-[30%] max-w-[260px] h-full flex items-center justify-end">
          {/* Maps Pin */}
          <div
            className="absolute right-[38%] top-[10%] w-[52%] aspect-[365/465] flex items-center justify-center"
            style={{
              mixBlendMode: "screen",
              filter: "brightness(1.15) saturate(1.05)",
            }}
          >
            <Image
              src="/assets/baked/maps.png"
              alt="Maps"
              width={165}
              height={210}
              priority
              className="w-full h-full object-contain"
            />
          </div>

          {/* Four-Petal Flower Graphic (Overlapping right of Maps) */}
          <div
            className="absolute right-0 top-[12%] w-[54%] aspect-square flex items-center justify-center"
            style={{
              mixBlendMode: "screen",
              filter: "brightness(1.15) saturate(1.05)",
            }}
          >
            <Image
              src="/assets/four-petal.png"
              alt="Four Petal"
              width={153}
              height={194}
              priority
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      </div>

      {/* Main Content Container (Frame 1948755611) */}
      <div className="w-full max-w-[1072px] flex flex-col items-start gap-[clamp(24px,3.5vh,36px)] mt-2 z-20">
        {/* Profile Page Title */}
        <h1
          className="text-white font-bold tracking-normal leading-[1.2] text-center capitalize m-0 select-none w-full text-[clamp(36px,4.5vw,64px)]"
          style={{
            fontFamily: "var(--font-google-sans), 'Google Sans', sans-serif",
          }}
        >
          Profile Page
        </h1>

        {/* Section 1: Contact Details */}
        <div className="w-full flex flex-col items-start gap-4 sm:gap-6">
          <h2
            className="text-white font-normal capitalize text-[clamp(28px,3.5vw,48px)] leading-[1.3] m-0"
            style={{
              fontFamily: "var(--font-google-sans), 'Google Sans', sans-serif",
            }}
          >
            Contact Details
          </h2>

          {/* Row 1: Name & Email Address */}
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-14">
            {/* Name Field */}
            <div className="w-full flex flex-col items-start gap-2">
              <label
                className="text-white font-normal capitalize text-[clamp(18px,2vw,32px)] leading-[1.3]"
                style={{
                  fontFamily: "var(--font-google-sans), 'Google Sans', sans-serif",
                }}
              >
                Name
              </label>
              <div
                className="w-full bg-[#343434] text-white/60 rounded-[8px] px-6 py-3.5 h-[56px] flex items-center text-[18px] sm:text-[24px] font-normal select-text"
                style={{
                  fontFamily: "var(--font-google-sans), 'Google Sans', sans-serif",
                }}
              >
                DEVJAMS
              </div>
            </div>

            {/* Email Address Field */}
            <div className="w-full flex flex-col items-start gap-2">
              <label
                className="text-white font-normal capitalize text-[clamp(18px,2vw,32px)] leading-[1.3]"
                style={{
                  fontFamily: "var(--font-google-sans), 'Google Sans', sans-serif",
                }}
              >
                Email Address
              </label>
              <div
                className="w-full bg-[#343434] text-white/60 rounded-[8px] px-6 py-3.5 h-[56px] flex items-center text-[18px] sm:text-[24px] font-normal select-text"
                style={{
                  fontFamily: "var(--font-google-sans), 'Google Sans', sans-serif",
                }}
              >
                GHY618
              </div>
            </div>
          </div>

          {/* Row 2: Team Name & Team Code */}
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-14 mt-1 sm:mt-2">
            {/* Team Name Field */}
            <div className="w-full flex flex-col items-start gap-2">
              <label
                className="text-white font-normal capitalize text-[clamp(18px,2vw,32px)] leading-[1.3]"
                style={{
                  fontFamily: "var(--font-google-sans), 'Google Sans', sans-serif",
                }}
              >
                Team Name
              </label>
              <div
                className="w-full bg-[#343434] text-white/60 rounded-[8px] px-6 py-3.5 h-[56px] flex items-center text-[18px] sm:text-[24px] font-normal select-text"
                style={{
                  fontFamily: "var(--font-google-sans), 'Google Sans', sans-serif",
                }}
              >
                DEVJAMS
              </div>
            </div>

            {/* Team Code Field */}
            <div className="w-full flex flex-col items-start gap-2">
              <label
                className="text-white font-normal capitalize text-[clamp(18px,2vw,32px)] leading-[1.3]"
                style={{
                  fontFamily: "var(--font-google-sans), 'Google Sans', sans-serif",
                }}
              >
                Team Code
              </label>
              <div
                className="w-full bg-[#343434] text-white/60 rounded-[8px] px-6 py-3.5 h-[56px] flex items-center text-[18px] sm:text-[24px] font-normal select-text"
                style={{
                  fontFamily: "var(--font-google-sans), 'Google Sans', sans-serif",
                }}
              >
                GHY618
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Attendance History (Frame 1948755614) */}
        <div className="w-full flex flex-col items-start gap-4 sm:gap-5 mt-2">
          <h2
            className="text-white font-normal capitalize text-[clamp(28px,3.5vw,48px)] leading-[1.3] m-0"
            style={{
              fontFamily: "var(--font-google-sans), 'Google Sans', sans-serif",
            }}
          >
            Attendance History
          </h2>

          {/* Attendance Rows Stack */}
          <div className="w-full max-w-[465px] flex flex-col items-start gap-2 sm:gap-2.5">
            {/* 1. Morning Half */}
            <div
              className="w-full bg-[#343434] text-white/60 rounded-[8px] px-6 py-3.5 h-[56px] flex items-center justify-between text-[18px] sm:text-[24px] font-normal"
              style={{
                fontFamily: "var(--font-google-sans), 'Google Sans', sans-serif",
              }}
            >
              <span>Morning Half</span>
            </div>

            {/* 2. Evening Half */}
            <div
              className="w-full bg-[#343434] text-white/60 rounded-[8px] px-6 py-3.5 h-[56px] flex items-center justify-between text-[18px] sm:text-[24px] font-normal"
              style={{
                fontFamily: "var(--font-google-sans), 'Google Sans', sans-serif",
              }}
            >
              <span>Evening Half</span>
            </div>

            {/* 3. Overnight */}
            <div
              className="w-full bg-[#343434] text-white/60 rounded-[8px] px-6 py-3.5 h-[56px] flex items-center justify-between text-[18px] sm:text-[24px] font-normal"
              style={{
                fontFamily: "var(--font-google-sans), 'Google Sans', sans-serif",
              }}
            >
              <span>Overnight</span>
            </div>
          </div>
        </div>

        {/* Section 3: Back Button (Frame 1948754781) */}
        <div className="pt-2">
          <motion.button
            type="button"
            onClick={() => router.back()}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="bg-white text-black font-medium text-[clamp(18px,2vw,23px)] rounded-[35px] px-6 py-2 flex items-center justify-center gap-2.5 cursor-pointer border-none shadow-md hover:bg-neutral-100 transition-all"
            style={{
              fontFamily: "var(--font-google-sans), 'Google Sans', sans-serif",
              minWidth: "131px",
              height: "44px",
            }}
          >
            {/* Back Arrow Vector (←) */}
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current flex-shrink-0"
            >
              <path
                d="M11.5 8H4.5M4.5 8L8.5 4M4.5 8L8.5 12"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>Back</span>
          </motion.button>
        </div>
      </div>
    </main>
  );
}
