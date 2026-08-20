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
    <main className="relative h-screen w-screen bg-black text-white flex items-center justify-center overflow-hidden select-none">
      {/* 1440x1024 Desktop Reference Frame Canvas - Exact Screen Height Container */}
      <div className="relative w-full max-w-[1440px] h-screen max-h-screen overflow-hidden flex-shrink-0">
        {/* Top Left GDG Lockup */}
        <header className="absolute top-8 left-[94px] z-30" aria-label="Google Developer Groups">
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

        {/* Group 1948755623 - Left Form Container (Exact Figma Dimensions & Gaps) */}
        <div
          className="absolute z-20 flex flex-col"
          style={{
            width: "590px",
            height: "296px",
            left: "94px",
            top: "calc(50% - 296px / 2)",
          }}
        >
          {/* Title: Create A Team */}
          <h1
            className="text-white font-bold tracking-normal leading-none select-none m-0"
            style={{
              fontFamily: 'var(--font-google-sans), "Google Sans", sans-serif',
              fontSize: "64px",
              width: "457.996px",
              height: "81px",
              display: "flex",
              alignItems: "center",
            }}
          >
            Create A Team
          </h1>

          {/* Subtitle / Prompt: Enter Your Team's Name (top: 455, gap: 10px from title bottom 445) */}
          <p
            className="text-white font-normal m-0 select-none"
            style={{
              fontFamily: 'var(--font-google-sans), "Google Sans", sans-serif',
              fontSize: "24px",
              lineHeight: "1.2",
              width: "561.303px",
              height: "54px",
              marginTop: "10px",
              display: "flex",
              alignItems: "center",
            }}
          >
            Enter Your Team’s Name
          </p>

          {/* Form with Input (top: 528, gap: 19px from subtitle bottom 509) and Submit Button (top: 612, gap: 25px from input bottom 587) */}
          <form onSubmit={handleSubmit} className="flex flex-col w-[590px]">
            {/* Input Field */}
            <input
              type="text"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder="Enter team name"
              className="w-[590px] h-[59px] bg-transparent text-white placeholder-white/40 border border-white/40 focus:border-white focus:outline-none transition-colors"
              style={{
                marginTop: "19px",
                borderRadius: "9.08px",
                padding: "7.26px 36.31px",
                fontFamily: 'var(--font-google-sans), "Google Sans", sans-serif',
                fontSize: "20px",
              }}
              required
            />

            {/* Frame 1948754780 - Submit Button */}
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={isSubmitting}
              className="w-[590px] h-[48px] bg-white text-black flex items-center justify-center cursor-pointer hover:bg-neutral-100 transition-all border-none"
              style={{
                marginTop: "25px",
                borderRadius: "35px",
                padding: "9px 111px",
                gap: "14px",
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-google-sans), "Google Sans", sans-serif',
                  fontWeight: 400,
                  fontSize: "24px",
                  lineHeight: "29.79px",
                  letterSpacing: "0.02em",
                  textAlign: "center",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  whiteSpace: "nowrap",
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
                className="w-[22px] h-[22px] flex-shrink-0"
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

        {/* Right Side 3 Logos Stack (Exact Figma Coordinates & Dimensions, Web 70% on screen) */}
        {/* Web Track Logo */}
        <div
          className="absolute pointer-events-none z-10"
          style={{
            width: "453.8907px",
            height: "453.8907px",
            left: "886.8px",
            top: "-136.17px",
            mixBlendMode: "screen",
          }}
          aria-hidden="true"
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

        {/* Maps Logo */}
        <div
          className="absolute pointer-events-none z-10"
          style={{
            width: "364.106px",
            height: "464.3671px",
            left: "931.16px",
            top: "250.66px",
            mixBlendMode: "screen",
          }}
          aria-hidden="true"
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

        {/* Android Track Logo */}
        <div
          className="absolute pointer-events-none z-10"
          style={{
            width: "467.627px",
            height: "285.7412px",
            left: "880px",
            top: "602.66px",
            mixBlendMode: "screen",
          }}
          aria-hidden="true"
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
    </main>
  );
}
