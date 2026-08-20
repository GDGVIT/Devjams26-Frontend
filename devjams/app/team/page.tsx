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
    <main className="relative min-h-screen w-full bg-black text-white flex flex-col items-center justify-start overflow-x-hidden overflow-y-auto select-none pb-16">
      {/* 1440x1024 Desktop Reference Frame Canvas */}
      <div className="relative w-full max-w-[1440px] min-h-[1024px] flex-shrink-0">
        {/* Group 1948755624 - Top 4 Logos Blend Banner (gear, web, gemini, cursor) */}
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
            <Image
              src="/assets/low-quality/gear.svg"
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
            <Image
              src="/assets/low-quality/web.svg"
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
            <Image
              src="/assets/low-quality/gemini.svg"
              alt="Gemini Track"
              width={244}
              height={244}
              priority
              className="w-full h-full object-contain"
            />
          </div>

          {/* 4. Cursor Logo (left: 974px in 1440 canvas, width: 170.37px, height: 205.22px, top: -62px -> local left: 678px, top: 73px) */}
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
            <Image
              src="/assets/low-quality/cursor.svg"
              alt="Cursor"
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
          <div className="flex flex-col items-start w-[1072px] h-[191px]">
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
            <div className="flex flex-row items-center w-[1072px] h-[119px] gap-[79px]">
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
                <div className="absolute left-0 top-[60.65px] w-[587px] h-[56px] bg-[#343434] rounded-[8px] flex flex-row items-center px-[29.05px] py-[5.81px] box-border">
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

                {/* Frame 1948754657 - Team Code Box with Copy Clipboard Button */}
                <div className="absolute left-0 top-[62.65px] w-[406px] h-[52px] bg-[#343434] rounded-[8px] flex flex-row items-center justify-between px-[29.05px] py-[5.81px] box-border">
                  <span
                    className="text-white/60 font-normal leading-[31px]"
                    style={{
                      fontFamily: 'var(--font-google-sans), "Google Sans", sans-serif',
                      fontSize: "24px",
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

          {/* Frame 1948755613 - Members Block */}
          <div className="flex flex-col items-start w-[465px] h-[377px] gap-[15px]">
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
            <div className="flex flex-col items-start w-[465px] h-[290px] gap-[22px]">
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
                    onClick={() => setMemberToRemove(member)}
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
