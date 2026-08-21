"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "../../../components/gsap-motion";
import { portalApi } from "@/services/portalApi";

const ALL_TRACKS = [
  "AIML",
  "Web",
  "Android",
  "Cloud",
  "FinTech",
  "DevTools & Infra",
  "AR/VR",
  "Open Innovation",
  "Multimedia",
];

export default function IdeaSubmissionPage() {
  const router = useRouter();
  const [shortDescription, setShortDescription] = useState("");
  const [longDescription, setLongDescription] = useState("");
  const [links, setLinks] = useState("");
  const [selectedTracks, setSelectedTracks] = useState<string[]>(["Web", "AIML"]);
  const [isTracksOpen, setIsTracksOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [isLeader, setIsLeader] = useState(true);
  const [error, setError] = useState("");

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsTracksOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const loadSubmissionData = async () => {
      const token = portalApi.getToken();
      if (!token && !portalApi.getSession()) {
        router.push("/portal");
        return;
      }

      try {
        const me = await portalApi.fetchMe();
        if (!me?.teamId) {
          router.push("/portal/join-create");
          return;
        }

        setIsLeader(!!me.isTeamLeader);

        const team = await portalApi.fetchTeam();
        const cachedSub = await portalApi.getSubmission(me.id);

        if (team) {
          const hasIdea =
            !!team.problem_statement || !!team.github_link || !!team.figma_link;

          if (hasIdea || cachedSub?.isLocked) {
            setIsLocked(true);
            setSubmitted(true);
          }

          if (team.problem_statement) {
            setLongDescription(team.problem_statement);
            if (!shortDescription) {
              setShortDescription(
                team.problem_statement.slice(0, 120) +
                  (team.problem_statement.length > 120 ? "..." : "")
              );
            }
          }

          const linksList: string[] = [];
          if (team.github_link) linksList.push(team.github_link);
          if (team.figma_link) linksList.push(team.figma_link);
          if (linksList.length > 0) {
            setLinks(linksList.join(", "));
          }
        }

        if (cachedSub) {
          if (cachedSub.shortSummary && !shortDescription) {
            setShortDescription(cachedSub.shortSummary);
          }
          if (cachedSub.problemStatement && !longDescription) {
            setLongDescription(cachedSub.problemStatement);
          }
        }
      } catch (err: unknown) {
        console.warn("Failed to load idea submission:", err);
      }
    };

    loadSubmissionData();
  }, [router, shortDescription, longDescription]);

  const removeTrack = (track: string) => {
    if (isLocked) return;
    setSelectedTracks((prev) => prev.filter((t) => t !== track));
  };

  const addTrack = (track: string) => {
    if (isLocked) return;
    if (!selectedTracks.includes(track)) {
      setSelectedTracks((prev) => [...prev, track]);
    }
    setIsTracksOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLocked) return;
    if (!isLeader) {
      setError("Only the Team Leader can submit the project proposal.");
      return;
    }

    const trimmedShort = shortDescription.trim();
    const trimmedLong = longDescription.trim();
    if (!trimmedShort && !trimmedLong) {
      setError("Please enter a short or long description of your idea.");
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      const statement = trimmedLong || trimmedShort;
      await portalApi.submitIdea(statement);

      // Parse links for github and figma
      const rawLinks = links.split(",").map((l) => l.trim()).filter(Boolean);
      let githubLink = "";
      let figmaLink = "";
      for (const l of rawLinks) {
        if (l.includes("github.com")) githubLink = l;
        else if (l.includes("figma.com")) figmaLink = l;
        else if (!githubLink) githubLink = l;
        else if (!figmaLink) figmaLink = l;
      }

      if (githubLink || figmaLink) {
        await portalApi.updateTeamLinks({
          problem_statement: statement,
          github_link: githubLink || undefined,
          figma_link: figmaLink || undefined,
        }).catch(() => null);
      }

      await portalApi.saveSubmission({
        shortSummary: trimmedShort,
        problemStatement: statement,
        githubUrl: githubLink,
        figmaUrl: figmaLink,
        status: "submitted",
        isLocked: true,
      }, false);

      setIsLocked(true);
      setSubmitted(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to submit idea.";
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="relative min-h-screen w-full bg-black text-white flex flex-col items-center justify-start overflow-x-hidden overflow-y-auto select-none p-4 sm:p-6 md:p-10 pb-20">
      {/* Top Right Profile Link */}
      <Link
        href="/profile"
        className="absolute right-6 top-6 md:right-10 md:top-8 inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-white/90 hover:text-white transition-all group z-30"
        aria-label="User Profile"
      >
        <span
          className="text-[16px] md:text-[18px] font-medium tracking-wide"
          style={{ fontFamily: "var(--font-google-sans), 'Google Sans', sans-serif" }}
        >
          Profile
        </span>
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-white group-hover:scale-105 transition-transform"
        >
          <circle cx="12" cy="8" r="4" />
          <path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />
        </svg>
      </Link>

      {/* 4 Logos Blend Banner: Top on Desktop, Anchored to bottom of screen on Mobile */}
      <div
        className="fixed md:relative bottom-0 md:bottom-auto left-1/2 md:left-auto -translate-x-1/2 md:translate-x-0 translate-y-[40%] md:translate-y-0 pointer-events-none z-10 w-full max-w-[340px] md:max-w-[848px] h-[124px] md:h-[clamp(140px,22vw,314px)] md:-mt-[clamp(24px,5vw,135px)] flex items-center justify-center overflow-visible flex-shrink-0"
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

      {/* Main Form Content Container */}
      <div className="w-full max-w-[1072px] mx-auto my-auto flex flex-col items-center justify-center gap-[clamp(14px,2vh,24px)] z-20 px-1 sm:px-3 md:px-0 py-6 sm:py-0">
        <h1
          className="text-white font-bold tracking-normal leading-[1.2] text-center capitalize m-0 select-none w-full text-[clamp(36px,4.5vw,64px)]"
          style={{
            fontFamily: "var(--font-google-sans), 'Google Sans', sans-serif",
          }}
        >
          Idea Submission
        </h1>

        {/* Locked / Submitted Status Banner */}
        {isLocked && (
          <div className="w-full p-3.5 sm:p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs sm:text-sm flex items-center gap-3">
            <span className="text-base sm:text-lg">🔒</span>
            <div>
              <p className="font-semibold">Your idea has been submitted and locked for review.</p>
              <p className="text-xs text-emerald-400/80 mt-0.5">
                Submissions are one-time and final. Mentor evaluation will proceed based on these details.
              </p>
            </div>
          </div>
        )}

        {/* Leader Info Banner if not leader */}
        {!isLocked && !isLeader && (
          <div className="w-full p-3.5 sm:p-4 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs sm:text-sm flex items-center gap-3">
            <span className="text-base sm:text-lg">ℹ️</span>
            <div>
              <p className="font-medium">Only the Team Leader can submit the project proposal.</p>
              <p className="text-xs text-amber-400/80 mt-0.5">
                You can review the draft details below while your team leader finalizes the submission.
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className="w-full p-3.5 sm:p-4 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs sm:text-sm">
            {error}
          </div>
        )}

        {/* Form Fields Container */}
        <form
          onSubmit={handleSubmit}
          className="w-full flex flex-col items-start gap-[clamp(14px,2.2vh,28px)] mt-1 sm:mt-2"
        >
          {/* Field 1: Short Description */}
          <div className="w-full flex flex-col items-start gap-1.5 sm:gap-2.5">
            <label
              htmlFor="shortDescription"
              className="text-white font-normal capitalize text-[clamp(16px,2vw,32px)] leading-[1.3]"
              style={{
                fontFamily: "var(--font-google-sans), 'Google Sans', sans-serif",
              }}
            >
              Short Description
            </label>
            <textarea
              id="shortDescription"
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              disabled={isLocked || isSubmitting || (!isLeader && !isLocked)}
              placeholder="Brief summary of your project..."
              className="w-full bg-[#343434] text-white rounded-[4px] sm:rounded-[8px] px-3.5 sm:px-7 py-2 sm:py-3 text-[clamp(12px,1.6vw,18px)] focus:outline-none focus:ring-1 focus:ring-white/40 resize-none min-h-[41px] sm:min-h-[82px] h-[41px] sm:h-[82px] transition-all placeholder:text-neutral-500 disabled:opacity-75 disabled:cursor-not-allowed"
              style={{
                fontFamily: "var(--font-google-sans), 'Google Sans', sans-serif",
              }}
            />
          </div>

          {/* Field 2: Long Description */}
          <div className="w-full flex flex-col items-start gap-1.5 sm:gap-2.5">
            <label
              htmlFor="longDescription"
              className="text-white font-normal capitalize text-[clamp(16px,2vw,32px)] leading-[1.3]"
              style={{
                fontFamily: "var(--font-google-sans), 'Google Sans', sans-serif",
              }}
            >
              Long Description
            </label>
            <textarea
              id="longDescription"
              value={longDescription}
              onChange={(e) => setLongDescription(e.target.value)}
              disabled={isLocked || isSubmitting || (!isLeader && !isLocked)}
              placeholder="Detailed architecture, features, problem statement and solution..."
              className="w-full bg-[#343434] text-white rounded-[4px] sm:rounded-[8px] px-3.5 sm:px-7 py-2 sm:py-3 text-[clamp(12px,1.6vw,18px)] focus:outline-none focus:ring-1 focus:ring-white/40 resize-none min-h-[85px] sm:min-h-[125px] h-[85px] sm:h-[125px] transition-all placeholder:text-neutral-500 disabled:opacity-75 disabled:cursor-not-allowed"
              style={{
                fontFamily: "var(--font-google-sans), 'Google Sans', sans-serif",
              }}
            />
          </div>

          {/* Field 3: Links */}
          <div className="w-full flex flex-col items-start gap-1.5 sm:gap-2.5">
            <label
              htmlFor="links"
              className="text-white font-normal capitalize text-[clamp(16px,2vw,32px)] leading-[1.3]"
              style={{
                fontFamily: "var(--font-google-sans), 'Google Sans', sans-serif",
              }}
            >
              Links
            </label>
            <input
              id="links"
              type="text"
              value={links}
              onChange={(e) => setLinks(e.target.value)}
              disabled={isLocked || isSubmitting || (!isLeader && !isLocked)}
              placeholder="GitHub repo, Figma, demo URLs (comma separated)..."
              className="w-full bg-[#343434] text-white rounded-[4px] sm:rounded-[8px] px-3.5 sm:px-7 py-1.5 sm:py-3 text-[clamp(12px,1.6vw,18px)] focus:outline-none focus:ring-1 focus:ring-white/40 min-h-[32px] sm:min-h-[56px] h-[32px] sm:h-[56px] transition-all placeholder:text-neutral-500 disabled:opacity-75 disabled:cursor-not-allowed"
              style={{
                fontFamily: "var(--font-google-sans), 'Google Sans', sans-serif",
              }}
            />
          </div>

          {/* Field 4: Tracks */}
          <div className="w-full flex flex-col items-start gap-1.5 sm:gap-2.5 relative" ref={dropdownRef}>
            <label
              className="text-white font-normal capitalize text-[clamp(16px,2vw,32px)] leading-[1.3]"
              style={{
                fontFamily: "var(--font-google-sans), 'Google Sans', sans-serif",
              }}
            >
              Tracks
            </label>

            {/* Custom Interactive Chip Dropdown Input Box */}
            <div
              onClick={() => {
                if (!isLocked && (isLeader || isLocked)) {
                  setIsTracksOpen((prev) => !prev);
                }
              }}
              className={`w-full min-h-[32px] sm:min-h-[56px] bg-[#343434] text-white rounded-[4px] sm:rounded-[8px] px-3.5 sm:px-6 py-1.5 sm:py-2.5 flex items-center justify-between border border-transparent transition-all select-none ${
                isLocked || (!isLeader && !isLocked)
                  ? "opacity-75 cursor-not-allowed"
                  : "cursor-pointer hover:border-white/20"
              }`}
            >
              {/* Chips container */}
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2.5">
                {selectedTracks.length === 0 ? (
                  <span className="text-neutral-500 text-[12px] sm:text-[18px]">
                    Select tracks...
                  </span>
                ) : (
                  selectedTracks.map((track) => (
                    <span
                      key={track}
                      className="inline-flex items-center gap-1 sm:gap-2 px-2.5 sm:px-3.5 py-0.5 sm:py-1 rounded-full border border-white/60 text-white text-[9px] sm:text-[16px] font-normal transition-colors bg-black/20"
                      style={{
                        fontFamily: "var(--font-google-sans), 'Google Sans', sans-serif",
                      }}
                      onClick={(e) => {
                        if (!isLocked) {
                          e.stopPropagation();
                          removeTrack(track);
                        }
                      }}
                    >
                      {track}
                      {!isLocked && isLeader && (
                        <span
                          className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full text-white/80 hover:text-white hover:bg-white/20 transition-colors"
                          aria-label={`Remove ${track}`}
                        >
                          ×
                        </span>
                      )}
                    </span>
                  ))
                )}
              </div>

              {!isLocked && isLeader && (
                <svg
                  width="16"
                  height="9"
                  viewBox="0 0 20 11"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className={`transition-transform duration-200 text-white/60 flex-shrink-0 ml-2 ${
                    isTracksOpen ? "rotate-180" : ""
                  }`}
                >
                  <path
                    d="M1.5 1.5L10 9.5L18.5 1.5"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </div>

            {/* Dropdown Menu Options */}
            <AnimatePresence>
              {isTracksOpen && !isLocked && isLeader && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.98 }}
                  transition={{ duration: 0.15 }}
                  className="absolute left-0 right-0 top-full mt-1.5 bg-[#252525] border border-neutral-700 rounded-[8px] shadow-xl p-2 z-50 flex flex-wrap gap-2 max-h-56 overflow-y-auto"
                >
                  {ALL_TRACKS.map((track) => {
                    const isSelected = selectedTracks.includes(track);
                    return (
                      <button
                        type="button"
                        key={track}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (isSelected) {
                            removeTrack(track);
                          } else {
                            addTrack(track);
                          }
                        }}
                        className={`px-3 py-1.5 rounded-[18px] text-[14px] font-normal transition-all cursor-pointer ${
                          isSelected
                            ? "bg-white text-black font-medium"
                            : "bg-[#343434] text-white hover:bg-[#444444]"
                        }`}
                        style={{
                          fontFamily: "var(--font-google-sans), 'Google Sans', sans-serif",
                        }}
                      >
                        {track} {isSelected ? "✓" : "+"}
                      </button>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Submit Button */}
          <div className="pt-2 flex items-center gap-4">
            <motion.button
              type="submit"
              disabled={isLocked || isSubmitting || !isLeader}
              whileHover={!isLocked && isLeader ? { scale: 1.03 } : {}}
              whileTap={!isLocked && isLeader ? { scale: 0.97 } : {}}
              className={`font-medium text-[clamp(12px,1.6vw,20px)] rounded-full px-5 sm:px-8 py-1.5 sm:py-2.5 flex items-center justify-center gap-2 border-none shadow-md transition-all ${
                isLocked
                  ? "bg-emerald-600 text-white cursor-not-allowed opacity-90"
                  : !isLeader
                  ? "bg-neutral-600 text-neutral-300 cursor-not-allowed"
                  : "bg-white text-black hover:bg-neutral-100 cursor-pointer"
              }`}
              style={{
                fontFamily: "var(--font-google-sans), 'Google Sans', sans-serif",
                minWidth: "120px",
                height: "36px",
              }}
            >
              <span>
                {isLocked
                  ? "Idea Submitted (Locked)"
                  : isSubmitting
                  ? "Submitting..."
                  : submitted
                  ? "Submitted!"
                  : "Submit Proposal"}
              </span>
              {!isLocked && (
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="stroke-current flex-shrink-0"
                >
                  <path
                    d="M4.5 11.5L11.5 4.5M11.5 4.5H5.5M11.5 4.5V10.5"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </motion.button>
          </div>
        </form>
      </div>
    </main>
  );
}
