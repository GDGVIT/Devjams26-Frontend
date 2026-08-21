"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AssetImage from "../../components/AssetImage";
import { motion } from "../../components/gsap-motion";
import { portalApi } from "@/services/portalApi";

export default function JoinPage() {
  const router = useRouter();
  const [teamCode, setTeamCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const checkAuth = async () => {
      const token = portalApi.getToken();
      if (!token && !portalApi.getSession()) {
        router.push("/portal");
        return;
      }
      try {
        const me = await portalApi.fetchMe();
        if (me?.teamId) {
          router.push("/team");
        }
      } catch {
        // Continue
      }
    };
    checkAuth();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const trimmed = teamCode.trim();
    if (!trimmed) {
      setError("Please enter your team code.");
      return;
    }

    setIsSubmitting(true);
    try {
      await portalApi.joinTeam(trimmed);
      router.push("/team");
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Failed to join team. Please try again.";
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
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
        className="absolute left-[clamp(20px,5vw,94px)] top-1/2 -translate-y-1/2 z-20 flex flex-col justify-center w-[min(590px,calc(100vw-40px))] max-w-[220px] sm:max-w-[320px] md:max-w-[590px]"
      >
        {/* Title: Join A Team */}
        <h1
          className="text-white font-bold tracking-tight leading-[1.15] text-3xl sm:text-5xl lg:text-6xl m-0"
          style={{
            fontFamily: 'var(--font-google-sans), "Google Sans", sans-serif',
          }}
        >
          Join A Team
        </h1>

        {/* Subtitle / Prompt: Enter Your Team's Code */}
        <p
          className="text-white/70 font-normal m-0 text-sm sm:text-lg lg:text-2xl mt-2 sm:mt-4 leading-normal"
          style={{
            fontFamily: 'var(--font-google-sans), "Google Sans", sans-serif',
          }}
        >
          Enter your team code
        </p>

        {error && (
          <div className="mt-3 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs sm:text-sm">
            {error}
          </div>
        )}

        {/* Form with Input and Submit Button */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5 sm:gap-6 w-full mt-4 sm:mt-8">
          {/* Input Field */}
          <input
            type="text"
            value={teamCode}
            onChange={(e) => setTeamCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 6))}
            placeholder="e.g.: GHY618"
            maxLength={6}
            pattern="[A-Z0-9]{6}"
            title="Enter the six-character uppercase invite code."
            className="w-full h-9 sm:h-[48px] md:h-[59px] bg-[#343434] md:bg-transparent text-white placeholder-white/40 border border-transparent md:border-white/40 focus:border-white focus:outline-none transition-colors rounded-[9.08px] px-3.5 sm:px-6 md:px-9 text-xs sm:text-base md:text-xl"
            style={{
              fontFamily: 'var(--font-google-sans), "Google Sans", sans-serif',
            }}
            required
            disabled={isSubmitting}
          />

          {/* Submit Button */}
          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={isSubmitting}
            className="w-full h-9 sm:h-[42px] md:h-[48px] bg-white text-black flex items-center justify-center cursor-pointer hover:bg-neutral-100 transition-all border-none rounded-[25.8px] md:rounded-[35px] shadow-lg px-4 sm:px-6 gap-2 sm:gap-3.5 disabled:opacity-50"
          >
            <span
              className="text-xs sm:text-base md:text-xl font-normal leading-none text-center whitespace-nowrap"
              style={{
                fontFamily: 'var(--font-google-sans), "Google Sans", sans-serif',
                letterSpacing: "0.02em",
              }}
            >
              {isSubmitting ? "Joining Team..." : "Continue To Team Page"}
            </span>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-3.5 h-3.5 sm:w-5 sm:h-5 flex-shrink-0"
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

      {/* Right Side 3 Logos Stack - Positioned on right edge with only left 50% on screen in mobile, fully on screen in desktop */}
      <div
        className="absolute right-0 translate-x-[50%] md:right-[clamp(16px,4.5vw,70px)] md:translate-x-0 top-0 bottom-0 h-screen pointer-events-none z-10 flex flex-col items-center justify-center overflow-hidden w-[280px] sm:w-[320px] md:w-[clamp(250px,27vw,390px)]"
        aria-hidden="true"
      >
        {/* 1. Web Track Logo */}
        <div
          className="relative w-full aspect-square flex items-center justify-center flex-shrink-0"
          style={{
            mixBlendMode: "screen",
            filter: "brightness(1.12) saturate(1.05)",
          }}
        >
          <AssetImage
            src="/assets/web.svg"
            alt="Web Track"
            width={908}
            height={908}
            priority
            className="w-full h-full object-contain"
          />
        </div>

        {/* 2. Maps Logo (Overlaps Web bottom by 22%) */}
        <div
          className="relative w-full aspect-[730/930] flex items-center justify-center flex-shrink-0 -mt-[22%]"
          style={{
            mixBlendMode: "screen",
            filter: "brightness(1.12) saturate(1.05)",
          }}
        >
          <AssetImage
            src="/assets/maps.svg"
            alt="Google Maps"
            width={730}
            height={930}
            priority
            className="w-full h-full object-contain"
          />
        </div>

        {/* 3. Android Track Logo (Overlaps Maps bottom pin by 26%) */}
        <div
          className="relative w-full aspect-[936/572] flex items-center justify-center flex-shrink-0 -mt-[26%]"
          style={{
            mixBlendMode: "screen",
            filter: "brightness(1.12) saturate(1.05)",
          }}
        >
          <AssetImage
            src="/assets/android.svg"
            alt="Android Track"
            width={936}
            height={572}
            priority
            className="w-full h-full object-contain"
          />
        </div>
      </div>
    </main>
  );
}
