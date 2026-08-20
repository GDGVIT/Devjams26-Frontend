"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import ResponsiveSvg from "../../components/ResponsiveSvg";
import { motion } from "../../components/gsap-motion";

type Member = {
  id: string;
  name: string;
};

export default function TeamPage() {
  const [teamName] = useState("DEVJAMS");
  const [teamCode] = useState("GHY618");
  const [copied, setCopied] = useState(false);
  const [members, setMembers] = useState<Member[]>([
    { id: "1", name: "DEVJAMS" },
    { id: "2", name: "DEVJAMS" },
    { id: "3", name: "DEVJAMS" },
    { id: "4", name: "DEVJAMS" },
  ]);

  const removeMember = (id: string) => {
    setMembers((prev) => prev.filter((m) => m.id !== id));
  };

  const handleInvite = () => {
    navigator.clipboard.writeText(teamCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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

        {/* Group 1948755624 - Top 4 Logos Blend Banner (gear, web, gemini, maps/cursor) */}
        <div
          className="absolute pointer-events-none z-10"
          style={{
            width: "848.37px",
            height: "313.6px",
            left: "calc(50% - 848.37px / 2 + 0.18px)",
            top: "-135px",
          }}
          aria-hidden="true"
        >
          {/* 1. Gear Logo (left: 296px in 1440 canvas, width: 313.6px, top: -135px) */}
          <div
            className="absolute"
            style={{
              width: "313.6px",
              height: "313.6px",
              left: "0px",
              top: "0px",
              mixBlendMode: "screen",
              filter: "brightness(1.12) saturate(1.05)",
            }}
          >
            <ResponsiveSvg
              src="/assets/gear.svg"
              alt="Gear"
              width={314}
              height={314}
              priority
              className="w-full h-full object-contain"
            />
          </div>

          {/* 2. Web Track Logo (left: 572px in 1440 canvas, width: 231.62px, top: -87px -> local left: 276px, top: 48px) */}
          <div
            className="absolute"
            style={{
              width: "231.62px",
              height: "231.62px",
              left: "276px",
              top: "48px",
              mixBlendMode: "screen",
              filter: "brightness(1.12) saturate(1.05)",
            }}
          >
            <ResponsiveSvg
              src="/assets/web.svg"
              alt="Web Track"
              width={232}
              height={232}
              priority
              className="w-full h-full object-contain"
            />
          </div>

          {/* 3. Gemini Track Logo (left: 767px in 1440 canvas, width: 244.16px, top: -98px -> local left: 471px, top: 37px) */}
          <div
            className="absolute"
            style={{
              width: "244.16px",
              height: "244.16px",
              left: "471px",
              top: "37px",
              mixBlendMode: "screen",
              filter: "brightness(1.12) saturate(1.05)",
            }}
          >
            <ResponsiveSvg
              src="/assets/gemini.svg"
              alt="Gemini Track"
              width={244}
              height={244}
              priority
              className="w-full h-full object-contain"
            />
          </div>

          {/* 4. Maps / Cursor Logo (left: 974px in 1440 canvas, width: 170.37px, height: 205.22px, top: -62px -> local left: 678px, top: 73px) */}
          <div
            className="absolute"
            style={{
              width: "170.37px",
              height: "205.22px",
              left: "678px",
              top: "73px",
              mixBlendMode: "screen",
              filter: "brightness(1.12) saturate(1.05)",
            }}
          >
            <ResponsiveSvg
              src="/assets/maps.svg"
              alt="Maps Cursor"
              width={170}
              height={205}
              priority
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        {/* Team Page Title */}
        <h1
          className="absolute text-white font-bold tracking-normal leading-[150%] text-center capitalize m-0 select-none flex items-center justify-center"
          style={{
            width: "1072px",
            height: "99.15px",
            left: "184px",
            top: "180px",
            fontFamily: 'var(--font-google-sans), "Google Sans", sans-serif',
            fontSize: "64px",
          }}
        >
          Team Page
        </h1>

        {/* Frame 1948755614 - Main Team Content Container */}
        <div
          className="absolute flex flex-col items-start gap-[25px]"
          style={{
            width: "1072px",
            height: "609.85px",
            left: "184px",
            top: "301px",
          }}
        >
          {/* Frame 1948755611 - Team Details Block */}
          <div
            className="flex flex-col items-start w-[1072px] h-[191px]"
          >
            {/* Team Details Section Heading */}
            <h2
              className="text-white font-normal leading-[150%] capitalize m-0 flex items-center w-[1072px] h-[72px]"
              style={{
                fontFamily: 'var(--font-google-sans), "Google Sans", sans-serif',
                fontSize: "48px",
              }}
            >
              Team Details
            </h2>

            {/* Frame 1948754746 - Fields Row (Name & Team Code) */}
            <div
              className="flex flex-row items-center w-[1072px] h-[119px] gap-[79px]"
            >
              {/* Group 1948754767 - Name Field */}
              <div className="relative w-[587px] h-[114.3px]">
                {/* Name Label */}
                <span
                  className="absolute left-0 top-[2.35px] text-white font-normal leading-[150%] capitalize h-[48px] w-[546.75px] flex items-center"
                  style={{
                    fontFamily: 'var(--font-google-sans), "Google Sans", sans-serif',
                    fontSize: "32px",
                  }}
                >
                  Name
                </span>

                {/* Frame 1948754657 - Name Box */}
                <div
                  className="absolute left-0 top-[60.65px] w-[587px] h-[56px] bg-[#343434] rounded-[8px] flex flex-row items-center px-[29.05px] py-[5.81px] box-border"
                >
                  <span
                    className="text-white/60 font-normal leading-[31px]"
                    style={{
                      fontFamily: 'var(--font-google-sans), "Google Sans", sans-serif',
                      fontSize: "24px",
                    }}
                  >
                    {teamName}
                  </span>
                </div>
              </div>

              {/* Group 1948754769 - Team Code Field */}
              <div className="relative w-[406px] h-[110.3px]">
                {/* Team Code Label */}
                <span
                  className="absolute left-0 top-[4.35px] text-white font-normal leading-[150%] capitalize h-[48px] w-[378.16px] flex items-center"
                  style={{
                    fontFamily: 'var(--font-google-sans), "Google Sans", sans-serif',
                    fontSize: "32px",
                  }}
                >
                  Team Code
                </span>

                {/* Frame 1948754657 - Team Code Box */}
                <div
                  className="absolute left-0 top-[62.65px] w-[406px] h-[52px] bg-[#343434] rounded-[8px] flex flex-row items-center px-[29.05px] py-[5.81px] box-border"
                >
                  <span
                    className="text-white/60 font-normal leading-[31px]"
                    style={{
                      fontFamily: 'var(--font-google-sans), "Google Sans", sans-serif',
                      fontSize: "24px",
                    }}
                  >
                    {teamCode}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Frame 1948755613 - Members Block */}
          <div
            className="flex flex-col items-start w-[465px] h-[377px] gap-[15px]"
          >
            {/* Members Heading */}
            <h2
              className="text-white font-normal leading-[150%] capitalize m-0 flex items-center w-[465px] h-[72px]"
              style={{
                fontFamily: 'var(--font-google-sans), "Google Sans", sans-serif',
                fontSize: "48px",
              }}
            >
              Members
            </h2>

            {/* Frame 1948755612 - Member Rows */}
            <div
              className="flex flex-col items-start w-[465px] h-[290px] gap-[22px]"
            >
              {members.map((member) => (
                <div
                  key={member.id}
                  className="w-[465px] h-[56px] bg-[#343434] rounded-[8px] flex flex-row justify-between items-center px-[29.05px] py-[5.81px] box-border flex-shrink-0"
                >
                  <span
                    className="text-white/60 font-normal leading-[31px]"
                    style={{
                      fontFamily: 'var(--font-google-sans), "Google Sans", sans-serif',
                      fontSize: "24px",
                    }}
                  >
                    {member.name}
                  </span>

                  {/* Remove Button / Cross Icon */}
                  <button
                    type="button"
                    onClick={() => removeMember(member.id)}
                    aria-label={`Remove member ${member.name}`}
                    className="relative w-[17.68px] h-[17.68px] flex items-center justify-center cursor-pointer bg-transparent border-none p-0 hover:opacity-100 opacity-60 transition-opacity"
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 18 18"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-[18px] h-[18px]"
                    >
                      <line
                        x1="2"
                        y1="2"
                        x2="16"
                        y2="16"
                        stroke="rgba(255, 255, 255, 0.61)"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                      <line
                        x1="16"
                        y1="2"
                        x2="2"
                        y2="16"
                        stroke="rgba(255, 255, 255, 0.61)"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Invite Button */}
        <motion.button
          type="button"
          onClick={handleInvite}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="absolute bg-white text-black rounded-[35px] flex items-center justify-center cursor-pointer border-none shadow-md hover:bg-neutral-100 transition-all"
          style={{
            left: "184px",
            top: "904px",
            width: "138.32px",
            height: "44px",
            padding: "7px 21px 7px 19px",
            gap: "10px",
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-google-sans), "Google Sans", sans-serif',
              fontWeight: 500,
              fontSize: "23px",
              lineHeight: "29.79px",
              letterSpacing: "0.02em",
              textAlign: "center",
            }}
          >
            {copied ? "Copied!" : "Invite"}
          </span>
        </motion.button>
      </div>
    </main>
  );
}
