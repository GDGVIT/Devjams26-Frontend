"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "../../components/gsap-motion";

export default function ProfilePage() {
  const router = useRouter();

  return (
    <main className="relative min-h-screen w-full bg-black text-white flex flex-col items-center justify-start overflow-x-hidden overflow-y-auto select-none p-4 sm:p-6 md:p-10 pb-20">
      {/* Top Floating Graphics Banner (Group 1948755625: width: 1564.97px, height: 215.75px) */}
      <div
        className="relative pointer-events-none z-10 w-full max-w-[1565px] aspect-[1565/216] -mt-[clamp(16px,3vw,35px)] flex items-center justify-center overflow-visible select-none"
        aria-hidden="true"
      >
        <div className="relative w-full h-full">
          {/* 1. Left: NotebookLLM (left: -62px / -3.96%, top: 24px / 11.12%, width: 175.8px / 11.23%, height: 119.83px / 55.54%) */}
          <div
            className="absolute flex items-center justify-center"
            style={{
              left: "-3.96%",
              top: "11.12%",
              width: "11.23%",
              height: "55.54%",
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

          {/* 2. Left: Cursor (left: 86.38px / 5.52%, top: 31.26px / 14.49%, width: 93.72px / 5.99%, height: 112.9px / 52.33%) */}
          <div
            className="absolute flex items-center justify-center"
            style={{
              left: "5.52%",
              top: "14.49%",
              width: "5.99%",
              height: "52.33%",
              mixBlendMode: "screen",
              filter: "brightness(1.15) saturate(1.05)",
            }}
          >
            <Image
              src="/assets/baked/cursor.png"
              alt="Cursor"
              width={94}
              height={113}
              priority
              className="w-full h-full object-contain"
            />
          </div>

          {/* 3. Middle: Antigravity (left: 41.63%, top: 31px / 14.37%, width: 258.25px / 16.50%, height: 127.41px / 59.05%) */}
          <div
            className="absolute flex items-center justify-center"
            style={{
              left: "41.63%",
              top: "14.37%",
              width: "16.50%",
              height: "59.05%",
              mixBlendMode: "screen",
              filter: "brightness(1.12) saturate(1.05)",
            }}
          >
            <Image
              src="/assets/baked/antigravity.png"
              alt="Antigravity"
              width={258}
              height={127}
              priority
              className="w-full h-full object-contain"
            />
          </div>

          {/* 4. Middle: Folder (left: 698.88px / 44.66%, top: 31px / 14.37%, width: 148.38px / 9.48%, height: 120.03px / 55.63%) */}
          <div
            className="absolute flex items-center justify-center"
            style={{
              left: "44.66%",
              top: "14.37%",
              width: "9.48%",
              height: "55.63%",
              mixBlendMode: "screen",
              filter: "brightness(1.12) saturate(1.05)",
            }}
          >
            <Image
              src="/assets/baked/folder.png"
              alt="Folder"
              width={148}
              height={120}
              priority
              className="w-full h-full object-contain"
            />
          </div>

          {/* 5. Right: Maps (left: 1256px / 80.26%, top: -22px / -10.20%, width: 246.97px / 15.78%, height: 215.75px / 100%) */}
          <div
            className="absolute flex items-center justify-center"
            style={{
              left: "80.26%",
              top: "-10.20%",
              width: "15.78%",
              height: "100%",
              mixBlendMode: "screen",
              filter: "brightness(1.15) saturate(1.05)",
            }}
          >
            <Image
              src="/assets/baked/maps.png"
              alt="Maps"
              width={247}
              height={216}
              priority
              className="w-full h-full object-contain"
            />
          </div>

          {/* 6. Right: Four-Petal (left: 1287.22px / 82.25%, top: -22px / -10.20%, width: 165.24px / 10.56%, height: 165.24px / 76.59%, rotate: 112.41deg) */}
          <div
            className="absolute flex items-center justify-center"
            style={{
              left: "82.25%",
              top: "-10.20%",
              width: "10.56%",
              height: "76.59%",
              transform: "rotate(112.41deg)",
              mixBlendMode: "screen",
              filter: "brightness(1.15) saturate(1.05)",
            }}
          >
            <Image
              src="/assets/four-petal.png"
              alt="Four Petal"
              width={165}
              height={165}
              priority
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      </div>
      <div className="w-full max-w-[1072px] mx-auto flex flex-col items-start gap-[clamp(20px,3.5vh,36px)] mt-2 z-20 px-1 sm:px-3 md:px-0">
        {/* Profile Page Title */}
        <h1
          className="text-white font-bold tracking-normal leading-[1.2] text-center capitalize m-0 select-none w-full text-[clamp(32px,5vw,64px)]"
          style={{
            fontFamily: "var(--font-google-sans), 'Google Sans', sans-serif",
          }}
        >
          Profile Page
        </h1>

        {/* Section 1: Contact Details */}
        <div className="w-full flex flex-col items-start gap-3 sm:gap-6">
          <h2
            className="text-white font-normal capitalize text-[clamp(24px,3.5vw,48px)] leading-[1.3] m-0"
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
                className="w-full bg-[#343434] text-white/60 rounded-[8px] px-4 sm:px-6 py-2.5 sm:py-3.5 min-h-[48px] sm:min-h-[56px] flex items-center text-[clamp(16px,1.8vw,24px)] font-normal select-text"
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
                className="w-full bg-[#343434] text-white/60 rounded-[8px] px-4 sm:px-6 py-2.5 sm:py-3.5 min-h-[48px] sm:min-h-[56px] flex items-center text-[clamp(16px,1.8vw,24px)] font-normal select-text"
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
                className="w-full bg-[#343434] text-white/60 rounded-[8px] px-4 sm:px-6 py-2.5 sm:py-3.5 min-h-[48px] sm:min-h-[56px] flex items-center text-[clamp(16px,1.8vw,24px)] font-normal select-text"
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
                className="w-full bg-[#343434] text-white/60 rounded-[8px] px-4 sm:px-6 py-2.5 sm:py-3.5 min-h-[48px] sm:min-h-[56px] flex items-center text-[clamp(16px,1.8vw,24px)] font-normal select-text"
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
        <div className="w-full flex flex-col items-start gap-3 sm:gap-5 mt-1 sm:mt-2">
          <h2
            className="text-white font-normal capitalize text-[clamp(24px,3.5vw,48px)] leading-[1.3] m-0"
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
              className="w-full bg-[#343434] text-white/60 rounded-[8px] px-4 sm:px-6 py-2.5 sm:py-3.5 min-h-[48px] sm:min-h-[56px] flex items-center justify-between text-[clamp(16px,1.8vw,24px)] font-normal"
              style={{
                fontFamily: "var(--font-google-sans), 'Google Sans', sans-serif",
              }}
            >
              <span>Morning Half</span>
            </div>

            {/* 2. Evening Half */}
            <div
              className="w-full bg-[#343434] text-white/60 rounded-[8px] px-4 sm:px-6 py-2.5 sm:py-3.5 min-h-[48px] sm:min-h-[56px] flex items-center justify-between text-[clamp(16px,1.8vw,24px)] font-normal"
              style={{
                fontFamily: "var(--font-google-sans), 'Google Sans', sans-serif",
              }}
            >
              <span>Evening Half</span>
            </div>

            {/* 3. Overnight */}
            <div
              className="w-full bg-[#343434] text-white/60 rounded-[8px] px-4 sm:px-6 py-2.5 sm:py-3.5 min-h-[48px] sm:min-h-[56px] flex items-center justify-between text-[clamp(16px,1.8vw,24px)] font-normal"
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
            className="bg-white text-black font-medium text-[clamp(16px,1.8vw,23px)] rounded-[35px] px-5 sm:px-6 py-2 flex items-center justify-center gap-2 cursor-pointer border-none shadow-md hover:bg-neutral-100 transition-all"
            style={{
              fontFamily: "var(--font-google-sans), 'Google Sans', sans-serif",
              minWidth: "120px",
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
