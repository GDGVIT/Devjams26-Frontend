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
    <main className="relative min-h-screen w-full bg-black text-white flex items-center justify-center overflow-x-hidden overflow-y-auto select-none p-6 md:p-10 lg:p-12">
      {/* Top Left GDG Lockup */}
      <header
        className="absolute top-6 md:top-8 left-6 md:left-12 lg:left-[clamp(40px,6.5vw,94px)] z-30"
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

      {/* Main Responsive 2-Column Desktop Grid Container */}
      <div className="relative w-full max-w-[1440px] min-h-[calc(100vh-64px)] flex flex-col md:flex-row items-center justify-between gap-8 lg:gap-16 px-4 md:px-8 lg:px-[clamp(24px,5vw,70px)] py-16">
        {/* Left Form Container (Group 1948755623) */}
        <div className="flex flex-col justify-center w-full max-w-[590px] z-20">
          {/* Title: Create A Team */}
          <h1
            className="text-white font-bold tracking-normal leading-[1.1] select-none m-0 text-[clamp(36px,4.5vw,64px)]"
            style={{
              fontFamily: 'var(--font-google-sans), "Google Sans", sans-serif',
            }}
          >
            Create A Team
          </h1>

          {/* Subtitle / Prompt: Enter Your Team's Name */}
          <p
            className="text-white font-normal m-0 select-none text-[clamp(18px,1.8vw,24px)] leading-[1.3] mt-[clamp(8px,1.2vh,12px)]"
            style={{
              fontFamily: 'var(--font-google-sans), "Google Sans", sans-serif',
            }}
          >
            Enter Your Team’s Name
          </p>

          {/* Form with Input and Submit Button */}
          <form onSubmit={handleSubmit} className="flex flex-col w-full mt-[clamp(14px,2.2vh,24px)]">
            {/* Input Field */}
            <input
              type="text"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder="Enter team name"
              className="w-full h-[clamp(50px,5.8vh,59px)] bg-transparent text-white placeholder-white/40 border border-white/40 focus:border-white focus:outline-none transition-colors rounded-[9.08px] px-[clamp(20px,2.5vw,36px)] py-2 text-[clamp(16px,1.5vw,20px)]"
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
              className="w-full h-[clamp(44px,5vh,48px)] bg-white text-black flex items-center justify-center cursor-pointer hover:bg-neutral-100 transition-all border-none rounded-[35px] mt-[clamp(16px,2.6vh,26px)] px-6 md:px-12 gap-[14px]"
            >
              <span
                className="text-[clamp(16px,1.6vw,24px)] leading-none text-center font-normal whitespace-nowrap"
                style={{
                  fontFamily: 'var(--font-google-sans), "Google Sans", sans-serif',
                  letterSpacing: "0.02em",
                }}
              >
                {isSubmitting ? "Continuing..." : "Continue To Team Page"}
              </span>
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 md:w-[22px] md:h-[22px] flex-shrink-0"
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

        {/* Right Side 3 Logos Stack (Fluid Responsive Desktop Column) */}
        <div
          className="relative pointer-events-none z-10 hidden md:flex flex-col items-center justify-center flex-shrink-0 w-[clamp(280px,32vw,468px)] min-h-[clamp(500px,80vh,880px)] overflow-visible"
          aria-hidden="true"
        >
          {/* Web Track Logo */}
          <div
            className="relative w-full flex-shrink-0 flex items-center justify-center"
            style={{
              width: "clamp(260px, 30vw, 454px)",
              height: "clamp(260px, 30vw, 454px)",
              mixBlendMode: "screen",
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

          {/* Maps Logo (Middle with vertical overlap) */}
          <div
            className="relative w-full flex-shrink-0 flex items-center justify-center -mt-[clamp(60px,8vw,110px)]"
            style={{
              width: "clamp(210px, 25vw, 364px)",
              height: "clamp(260px, 31vw, 464px)",
              mixBlendMode: "screen",
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

          {/* Android Track Logo (Bottom with vertical overlap) */}
          <div
            className="relative w-full flex-shrink-0 flex items-center justify-center -mt-[clamp(50px,7vw,100px)]"
            style={{
              width: "clamp(260px, 31vw, 468px)",
              height: "clamp(160px, 19vw, 286px)",
              mixBlendMode: "screen",
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
    </main>
  );
}
