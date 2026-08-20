"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import ResponsiveSvg from "../../components/ResponsiveSvg";
import { motion } from "../../components/gsap-motion";

export default function CreateTeamPage() {
  const [teamName, setTeamName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamName.trim()) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <main className="relative min-h-screen w-full bg-black text-white flex flex-col justify-between p-6 sm:p-10 lg:p-14 overflow-x-hidden select-none">
      {/* Top Left GDG Lockup */}
      <header className="relative z-30 w-fit" aria-label="Google Developer Groups">
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

      {/* Main Responsive Content Grid (No Hardcoded Screen Sizes) */}
      <div className="w-full max-w-[1440px] mx-auto my-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center justify-between z-20 py-8">
        {/* Left Column: Form Container */}
        <div className="col-span-12 lg:col-span-7 flex flex-col justify-center max-w-[590px] w-full">
          {/* Title: Create A Team */}
          <h1
            className="text-white font-bold tracking-tight leading-[1.08] text-4xl sm:text-5xl lg:text-6xl m-0"
            style={{
              fontFamily: 'var(--font-google-sans), "Google Sans", sans-serif',
            }}
          >
            Create A Team
          </h1>

          {/* Subtitle / Prompt: Enter Your Team's Name */}
          <p
            className="text-white/70 font-normal m-0 text-lg sm:text-xl lg:text-2xl mt-3 sm:mt-4 leading-normal"
            style={{
              fontFamily: 'var(--font-google-sans), "Google Sans", sans-serif',
            }}
          >
            Enter Your Team’s Name
          </p>

          {/* Form with Input and Submit Button */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-5 sm:gap-6 w-full mt-6 sm:mt-8">
            {/* Input Field */}
            <input
              type="text"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder="Enter team name"
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

        {/* Right Column: 3 Logos Stack (Proportionally Scaled with Screen Blend & Overlap) */}
        <div className="col-span-12 lg:col-span-5 flex items-center justify-center lg:justify-end">
          <div
            className="relative pointer-events-none z-10 w-full max-w-[420px] lg:max-w-[460px] h-[480px] sm:h-[580px] lg:h-[680px] xl:h-[760px] flex items-center justify-center overflow-visible"
            aria-hidden="true"
          >
            {/* Web Track Logo */}
            <div
              className="absolute top-0 right-0 w-[84%] aspect-square flex items-center justify-center"
              style={{
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
                className="w-full h-full object-contain"
              />
            </div>

            {/* Maps Logo (Middle with natural overlap) */}
            <div
              className="absolute top-[34%] right-[8%] w-[68%] aspect-[364/464] flex items-center justify-center"
              style={{
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
                className="w-full h-full object-contain"
              />
            </div>

            {/* Android Track Logo (Bottom with natural overlap) */}
            <div
              className="absolute bottom-0 right-0 w-[88%] aspect-[468/286] flex items-center justify-center"
              style={{
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
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
