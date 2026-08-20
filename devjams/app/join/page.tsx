"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import ResponsiveSvg from "../../components/ResponsiveSvg";
import { motion } from "../../components/gsap-motion";

export default function JoinPage() {
  const [teamCode, setTeamCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamCode.trim()) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <main className="relative h-screen w-screen bg-black text-white overflow-hidden select-none">
      {/* Top Left GDG Lockup */}
      <header
        className="absolute top-6 md:top-8 left-[clamp(24px,6.5vw,94px)] z-30"
        aria-label="Google Developer Groups"
      >
        <Link href="/" className="cursor-pointer flex items-center">
          <motion.div
            className="hero-gdg-lockup"
            initial={false}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
          >
            <Image
              src="/assets/gdg-logo-white.svg"
              alt="GDG Logo"
              width={46}
              height={23}
              priority
              className="hero-gdg-lockup__icon"
            />
            <span className="hero-gdg-lockup__wordmark" aria-hidden="true">
              <Image
                src="/assets/gdg-lockup-line.png"
                alt="Google Developer Groups on Campus - VIT Chennai"
                width={3003}
                height={300}
                priority
                className="hero-gdg-lockup__wordmark-image"
              />
            </span>
            <span className="hero-gdg-lockup__name">
              Vellore Institute of Technology
            </span>
          </motion.div>
        </Link>
      </header>

      {/* Left Form Container - Vertically Centered with Screen Size */}
      <div
        className="absolute left-[clamp(24px,6.5vw,94px)] top-1/2 -translate-y-1/2 z-20 flex flex-col justify-center w-[min(590px,calc(100vw-48px))] max-w-[590px]"
      >
        {/* Title: Join A Team */}
        <h1
          className="text-white font-bold tracking-tight leading-[1.08] text-4xl sm:text-5xl lg:text-6xl m-0"
          style={{
            fontFamily: 'var(--font-google-sans), "Google Sans", sans-serif',
          }}
        >
          Join A Team
        </h1>

        {/* Subtitle / Prompt: Enter Your Team's Code */}
        <p
          className="text-white/70 font-normal m-0 text-lg sm:text-xl lg:text-2xl mt-3 sm:mt-4 leading-normal"
          style={{
            fontFamily: 'var(--font-google-sans), "Google Sans", sans-serif',
          }}
        >
          Enter Your Team’s Code
        </p>

        {/* Form with Input and Submit Button */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 sm:gap-6 w-full mt-6 sm:mt-8">
          {/* Input Field */}
          <input
            type="text"
            value={teamCode}
            onChange={(e) => setTeamCode(e.target.value)}
            placeholder="Enter code here"
            className="w-full h-14 sm:h-[59px] bg-transparent text-white placeholder-white/40 border border-white/40 focus:border-white focus:outline-none transition-colors rounded-[9.08px] px-6 sm:px-9 text-lg sm:text-xl"
            style={{
              fontFamily: 'var(--font-google-sans), "Google Sans", sans-serif',
            }}
            required
          />

          {/* Frame 1948754780 - Submit Button */}
          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={isSubmitting}
            className="w-full h-12 sm:h-[48px] bg-white text-black flex items-center justify-center cursor-pointer hover:bg-neutral-100 transition-all border-none rounded-[35px] shadow-lg px-6 gap-3.5"
          >
            <span
              className="text-lg sm:text-xl font-normal leading-none text-center whitespace-nowrap"
              style={{
                fontFamily: 'var(--font-google-sans), "Google Sans", sans-serif',
                letterSpacing: "0.02em",
              }}
            >
              {isSubmitting ? "Continuing..." : "Continue To Team Page"}
            </span>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 flex-shrink-0"
              aria-hidden="true"
            >
              <path
                d="M7 17L17 7M17 7H7M17 7V17"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </motion.button>
        </form>
      </div>

      {/* Right Side 3 Logos Stack - Perfectly Relative Aligned Vertical, 20% Blend with each other, Dynamically Covering 100% Screen Height */}
      <div
        className="absolute right-[clamp(16px,4vw,60px)] top-0 bottom-0 h-screen pointer-events-none z-10 hidden md:flex flex-col items-center justify-between py-[1vh] overflow-hidden w-[clamp(280px,32vw,460px)]"
        aria-hidden="true"
      >
        {/* 1. Web Track Logo (Top, 70% visible on screen, 30% shifted up) */}
        <div
          className="relative w-full flex-shrink-0 flex items-center justify-center -mt-[11.4vh]"
          style={{
            height: "38vh",
            mixBlendMode: "screen",
            filter: "brightness(1.12) saturate(1.05)",
          }}
        >
          <ResponsiveSvg
            src="/assets/web.svg"
            alt="Web Track"
            width={454}
            height={454}
            priority
            className="max-h-full max-w-full object-contain"
          />
        </div>

        {/* 2. Maps Logo (Vertically Centered in Screen, Shifted Down by 20%) */}
        <div
          className="relative w-full flex-shrink-0 flex items-center justify-center my-auto"
          style={{
            height: "39vh",
            transform: "translateY(20%)",
            mixBlendMode: "screen",
            filter: "brightness(1.12) saturate(1.05)",
          }}
        >
          <ResponsiveSvg
            src="/assets/maps.svg"
            alt="Google Maps"
            width={365}
            height={465}
            priority
            className="max-h-full max-w-full object-contain"
          />
        </div>

        {/* 3. Android Track Logo (Bottom, dynamically scaled in vh) */}
        <div
          className="relative w-full flex-shrink-0 flex items-center justify-center"
          style={{
            height: "31vh",
            mixBlendMode: "screen",
            filter: "brightness(1.12) saturate(1.05)",
          }}
        >
          <ResponsiveSvg
            src="/assets/android.svg"
            alt="Android Track"
            width={468}
            height={286}
            priority
            className="max-h-full max-w-full object-contain"
          />
        </div>
      </div>
    </main>
  );
}
