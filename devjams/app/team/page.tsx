"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "../../components/gsap-motion";

type Member = {
  id: string;
  name: string;
};

export default function TeamPage() {
  const [teamName] = useState("DEVJAMS");
  const [teamCode] = useState("GHY618");
  const [codeCopied, setCodeCopied] = useState(false);
  const [inviteCopied, setInviteCopied] = useState(false);
  const [memberToRemove, setMemberToRemove] = useState<Member | null>(null);
  const [members, setMembers] = useState<Member[]>([
    { id: "1", name: "DEVJAMS" },
    { id: "2", name: "DEVJAMS" },
    { id: "3", name: "DEVJAMS" },
    { id: "4", name: "DEVJAMS" },
  ]);

  const confirmRemoveMember = () => {
    if (!memberToRemove) return;
    setMembers((prev) => prev.filter((m) => m.id !== memberToRemove.id));
    setMemberToRemove(null);
  };

  const copyTeamCode = () => {
    navigator.clipboard.writeText(teamCode);
    setCodeCopied(true);
    setTimeout(() => setCodeCopied(false), 2000);
  };

  const handleInvite = () => {
    navigator.clipboard.writeText(teamCode);
    setInviteCopied(true);
    setTimeout(() => setInviteCopied(false), 2000);
  };

  // Close modal on Escape
  useEffect(() => {
    if (!memberToRemove) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMemberToRemove(null);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [memberToRemove]);

  return (
    <main className="relative min-h-screen w-full bg-black text-white flex flex-col items-center justify-start overflow-x-hidden overflow-y-auto select-none p-4 sm:p-6 md:p-10 pb-20">
      {/* Top 4 Logos Blend Banner (Group 1948755624) */}
      <div
        className="relative pointer-events-none z-10 w-full max-w-[848px] h-[clamp(100px,18vw,314px)] -mt-[clamp(24px,5vw,135px)] flex items-center justify-center overflow-visible"
        aria-hidden="true"
      >
        <div className="relative w-full h-full flex items-center justify-center">
          {/* 1. Gear Logo */}
          <div
            className="absolute left-0 top-0 w-[37%] aspect-square flex items-center justify-center"
            style={{
              mixBlendMode: "screen",
              filter: "brightness(1.12) saturate(1.05)",
            }}
          >
            <Image
              src="/assets/gear.svg"
              alt="Gear"
              width={314}
              height={314}
              priority
              className="w-full h-full object-contain"
            />
          </div>

          {/* 2. Web Track Logo */}
          <div
            className="absolute left-[32.5%] top-[15%] w-[27.3%] aspect-square flex items-center justify-center"
            style={{
              mixBlendMode: "screen",
              filter: "brightness(1.12) saturate(1.05)",
            }}
          >
            <Image
              src="/assets/baked/web.png"
              alt="Web Track"
              width={232}
              height={232}
              priority
              className="w-full h-full object-contain"
            />
          </div>

          {/* 3. Gemini Track Logo */}
          <div
            className="absolute left-[55.5%] top-[11.8%] w-[28.8%] aspect-square flex items-center justify-center"
            style={{
              mixBlendMode: "screen",
              filter: "brightness(1.12) saturate(1.05)",
            }}
          >
            <Image
              src="/assets/gemini.svg"
              alt="Gemini Track"
              width={244}
              height={244}
              priority
              className="w-full h-full object-contain"
            />
          </div>

          {/* 4. Cursor Logo */}
          <div
            className="absolute left-[80%] top-[23.3%] w-[20%] aspect-[41/53] flex items-center justify-center"
            style={{
              mixBlendMode: "screen",
              filter: "brightness(1.12) saturate(1.05)",
            }}
          >
            <Image
              src="/assets/baked/cursor.png"
              alt="Cursor"
              width={170}
              height={220}
              priority
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      </div>

      {/* Main Responsive Content Container (Frame 1948755614) */}
      <div className="w-full max-w-[1072px] mx-auto flex flex-col items-start gap-[clamp(18px,3vh,36px)] mt-2 z-20 px-1 sm:px-3 md:px-0">
        {/* Team Page Title */}
        <h1
          className="text-white font-bold tracking-normal leading-[1.2] text-center capitalize m-0 select-none w-full text-[clamp(36px,4.5vw,64px)]"
          style={{
            fontFamily: 'var(--font-google-sans), "Google Sans", sans-serif',
          }}
        >
          Team Page
        </h1>

        {/* Team Details Block (Frame 1948755611) */}
        <div className="flex flex-col items-start w-full gap-2">
          {/* Team Details Section Heading */}
          <h2
            className="text-white font-normal leading-[1.3] capitalize m-0 flex items-center w-full text-[clamp(24px,3.2vw,48px)]"
            style={{
              fontFamily: 'var(--font-google-sans), "Google Sans", sans-serif',
            }}
          >
            Team Details
          </h2>

          {/* Fields Row (Name & Team Code) */}
          <div className="flex flex-col md:flex-row items-stretch md:items-end w-full gap-[clamp(20px,5vw,79px)] mt-2">
            {/* Name Field */}
            <div className="flex-1 flex flex-col gap-2">
              <span
                className="text-white font-normal leading-normal capitalize text-[clamp(16px,2vw,32px)]"
                style={{
                  fontFamily: 'var(--font-google-sans), "Google Sans", sans-serif',
                }}
              >
                Name
              </span>

              {/* Name Box */}
              <div className="w-full h-8 sm:h-14 bg-[#343434] rounded-[4px] sm:rounded-lg flex items-center px-3.5 sm:px-6 md:px-7">
                <span
                  className="text-white/60 font-normal text-[clamp(12px,1.6vw,24px)] leading-none"
                  style={{
                    fontFamily: 'var(--font-google-sans), "Google Sans", sans-serif',
                  }}
                >
                  {teamName}
                </span>
              </div>
            </div>

            {/* Team Code Field */}
            <div className="w-full md:w-[clamp(280px,30vw,406px)] flex flex-col gap-2">
              <span
                className="text-white font-normal leading-normal capitalize text-[clamp(16px,2vw,32px)]"
                style={{
                  fontFamily: 'var(--font-google-sans), "Google Sans", sans-serif',
                }}
              >
                Team Code
              </span>

              {/* Team Code Box with Copy Clipboard Button */}
              <div className="w-full h-8 sm:h-14 bg-[#343434] rounded-[4px] sm:rounded-lg flex items-center justify-between px-3.5 sm:px-6 md:px-7">
                <span
                  className="text-white/60 font-normal text-[clamp(12px,1.6vw,24px)] leading-none"
                  style={{
                    fontFamily: 'var(--font-google-sans), "Google Sans", sans-serif',
                  }}
                >
                  {teamCode}
                </span>

                {/* Clipboard Icon Button */}
                <button
                  type="button"
                  onClick={copyTeamCode}
                  aria-label="Copy team code"
                  className="flex items-center gap-1.5 cursor-pointer bg-transparent border-none p-1 text-white/60 hover:text-white transition-colors"
                >
                  {codeCopied ? (
                    <span className="text-xs text-green-400 font-medium select-none">
                      Copied!
                    </span>
                  ) : null}
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5 flex-shrink-0"
                  >
                    <path
                      d="M16 4H18C19.1046 4 20 4.89543 20 6V20C20 21.1046 19.1046 22 18 22H8C6.89543 22 6 21.1046 6 20V18"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <rect
                      x="4"
                      y="2"
                      width="12"
                      height="16"
                      rx="2"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Members Block (Frame 1948755613) */}
        <div className="flex flex-col items-start w-full max-w-[465px] gap-2">
          {/* Members Heading */}
          <h2
            className="text-white font-normal leading-[1.3] capitalize m-0 flex items-center w-full text-[clamp(24px,3.2vw,48px)]"
            style={{
              fontFamily: 'var(--font-google-sans), "Google Sans", sans-serif',
            }}
          >
            Members
          </h2>

          {/* Member Rows */}
          <div className="flex flex-col items-start w-full gap-4 mt-2">
            {members.map((member) => (
              <div
                key={member.id}
                className="w-full h-8 sm:h-14 bg-[#343434] rounded-[4px] sm:rounded-lg flex flex-row justify-between items-center px-3.5 sm:px-6 md:px-7 box-border flex-shrink-0"
              >
                <span
                  className="text-white/60 font-normal text-[clamp(12px,1.6vw,24px)] leading-none"
                  style={{
                    fontFamily: 'var(--font-google-sans), "Google Sans", sans-serif',
                  }}
                >
                  {member.name}
                </span>

                {/* Remove Button / Cross Icon */}
                <button
                  type="button"
                  onClick={() => setMemberToRemove(member)}
                  aria-label={`Remove member ${member.name}`}
                  className="relative w-5 h-5 flex items-center justify-center cursor-pointer bg-transparent border-none p-0 hover:opacity-100 opacity-60 transition-opacity"
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

        {/* Invite Button */}
        {/* Invite Button (Component 62) */}
        <motion.button
          type="button"
          onClick={handleInvite}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-white text-black rounded-full flex items-center justify-center cursor-pointer border-none shadow-md hover:bg-neutral-100 transition-all px-5 sm:px-8 py-1.5 sm:py-2.5 min-w-[95px] sm:min-w-[138px] h-8 sm:h-11 mt-2"
        >
          <span
            className="text-[clamp(12px,1.6vw,23px)] leading-none font-medium text-center"
            style={{
              fontFamily: 'var(--font-google-sans), "Google Sans", sans-serif',
              letterSpacing: "0.02em",
            }}
          >
            {inviteCopied ? "Copied!" : "Invite"}
          </span>
        </motion.button>
      </div>

      {/* Remove Member Confirmation Modal Popup */}
      <AnimatePresence>
        {memberToRemove && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMemberToRemove(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />

            {/* Modal Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 12 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="relative z-10 w-[440px] max-w-[92vw] bg-[#1E1E1E] border border-white/15 rounded-[20px] p-7 shadow-2xl flex flex-col items-center text-center gap-6"
            >
              {/* Warning Icon */}
              <div className="w-12 h-12 rounded-full bg-red-500/15 border border-red-500/30 flex items-center justify-center text-[#EA4335]">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6"
                >
                  <path
                    d="M12 9V14M12 17.5V18M12 3L2 21H22L12 3Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              {/* Message */}
              <div className="flex flex-col gap-2">
                <h3
                  className="text-white font-bold text-2xl m-0"
                  style={{
                    fontFamily:
                      'var(--font-google-sans), "Google Sans", sans-serif',
                  }}
                >
                  Sure you want to remove {memberToRemove.name}?
                </h3>
                <p className="text-white/60 text-sm m-0">
                  This action will remove the member from your team.
                </p>
              </div>

              {/* Action Buttons: Cancel | Remove */}
              <div className="flex flex-row items-center justify-center gap-4 w-full pt-2">
                <button
                  type="button"
                  onClick={() => setMemberToRemove(null)}
                  className="flex-1 h-11 rounded-[35px] border border-white/30 text-white font-medium text-base hover:bg-white/10 transition-colors cursor-pointer"
                  style={{
                    fontFamily:
                      'var(--font-google-sans), "Google Sans", sans-serif',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirmRemoveMember}
                  className="flex-1 h-11 rounded-[35px] bg-[#EA4335] text-white font-bold text-base hover:bg-[#d93025] transition-colors border-none cursor-pointer shadow-lg shadow-red-500/20"
                  style={{
                    fontFamily:
                      'var(--font-google-sans), "Google Sans", sans-serif',
                  }}
                >
                  Remove
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}
