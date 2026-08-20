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

      {/* Group 1948755623 - Left Form Container */}
      <div
        className="absolute z-20 flex flex-col justify-between"
        style={{
          width: "590px",
          height: "296px",
          left: "94px",
          top: "calc(50% - 296px / 2)",
        }}
      >
        {/* Title: Join A Team */}
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
          Join A Team
        </h1>

        {/* Subtitle / Prompt: Enter Your Team's Code */}
        <p
          className="text-white font-normal m-0 select-none"
          style={{
            fontFamily: 'var(--font-google-sans), "Google Sans", sans-serif',
            fontSize: "24px",
            lineHeight: "1.2",
            width: "561.3px",
            height: "36px",
            display: "flex",
            alignItems: "center",
          }}
        >
          Enter Your Team’s Code
        </p>

        {/* Form with Input and Submit Button */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-[590px]">
          {/* Input Field */}
          <input
            type="text"
            value={teamCode}
            onChange={(e) => setTeamCode(e.target.value)}
            placeholder="Enter code here"
            className="w-[590px] h-[59px] bg-transparent text-white placeholder-white/40 border border-white/40 focus:border-white focus:outline-none transition-colors"
            style={{
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

      {/* Right Side 3 Logos Box - Scaled down with glowing blend and vertical overlap */}
      <div
        className="absolute right-[5vw] top-0 bottom-0 pointer-events-none z-10 flex flex-col items-center justify-center py-[2vh] overflow-hidden"
        style={{
          width: "min(400px, 28vw)",
          height: "100vh",
        }}
        aria-hidden="true"
      >
        {/* Web Track Logo (Top) */}
        <div
          className="relative w-full flex items-center justify-center flex-shrink-0"
          style={{
            height: "29vh",
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

        {/* Maps Logo (Middle with vertical overlap on Web and Android) */}
        <div
          className="relative w-full flex items-center justify-center flex-shrink-0 -my-[4.5vh]"
          style={{
            height: "31vh",
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

        {/* Android Track Logo (Bottom) */}
        <div
          className="relative w-full flex items-center justify-center flex-shrink-0"
          style={{
            height: "22vh",
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
