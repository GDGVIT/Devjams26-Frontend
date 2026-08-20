"use client";

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

      {/* Right Side 3 Logos (Only these 3 logos fitted to screen) */}
      <div
        className="absolute right-0 top-0 bottom-0 pointer-events-none z-10 flex flex-col items-end justify-between h-full overflow-hidden"
        style={{
          width: "min(468px, 40vw)",
        }}
        aria-hidden="true"
      >
        {/* Web Track Logo */}
        <div
          className="relative flex-shrink-0"
          style={{
            width: "clamp(260px, 32vw, 454px)",
            height: "clamp(260px, 32vw, 454px)",
            marginTop: "-2%",
            marginRight: "-2%",
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

        {/* Maps Logo */}
        <div
          className="relative flex-shrink-0 -my-[18%]"
          style={{
            width: "clamp(210px, 26vw, 364px)",
            height: "clamp(260px, 33vw, 464px)",
            marginRight: "6%",
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

        {/* Android Track Logo */}
        <div
          className="relative flex-shrink-0"
          style={{
            width: "clamp(260px, 33vw, 468px)",
            height: "clamp(160px, 20vw, 286px)",
            marginBottom: "-2%",
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
    </main>
  );
}
