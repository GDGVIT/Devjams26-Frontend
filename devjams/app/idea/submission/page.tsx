"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "../../../components/gsap-motion";
import { Info } from "lucide-react";
import { GDGLockup } from "@/components/portal/GDGLockup";
import { portalApi } from "@/services/portalApi";
import { lockedSubmissionStatus } from "../../idea-submission-status";


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
  const [isSaving, setIsSaving] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [isLeader, setIsLeader] = useState(true);
  const [teamMemberCount, setTeamMemberCount] = useState(0);
  const [submitConfirmationOpen, setSubmitConfirmationOpen] = useState(false);
  const [lastEditedBy, setLastEditedBy] = useState("");
  const [lastEditedAt, setLastEditedAt] = useState("");
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
        setTeamMemberCount(team?.members?.length ?? 0);
        const cachedSub = await portalApi.getSubmission(me.id);
        if (team?.idea) {
          setShortDescription(team.idea.short_description);
          setLongDescription(team.idea.long_description);
          setLinks(team.idea.links);
          setLastEditedBy(team.idea.last_edited_by_name || "");
          setLastEditedAt(team.idea.updated_at || "");
          const tracks = team.idea.tracks
            .split(",")
            .map((track) => track.trim())
            .filter(Boolean);
          if (tracks.length > 0) {
            setSelectedTracks(tracks);
          }
        } else if (cachedSub) {
          setShortDescription(cachedSub.shortSummary || "");
          setLongDescription(cachedSub.problemStatement || "");
        }

        const submittedNow = Boolean(team?.idea_submitted || team?.idea?.is_submitted);
        setIsLocked(submittedNow);
      } catch (err: unknown) {
        console.warn("Failed to load idea submission:", err);
      }
    };


    loadSubmissionData();
  }, [router]);
  const teamTooSmall = teamMemberCount < 2;

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

  const handleSave = async () => {
    if (isLocked) return;
    if (teamTooSmall) {
      setError("At least two team members are required before saving an idea.");
      return;
    }
    setError("");
    setIsSaving(true);
    try {
      const response = await portalApi.saveIdea({
        short_description: shortDescription.trim(),
        long_description: longDescription.trim(),
        links: links.trim(),
        tracks: selectedTracks.join(", "),
      });
      setLastEditedBy(response.idea?.last_edited_by_name || portalApi.getSession()?.name || "");
      setLastEditedAt(response.idea?.updated_at || new Date().toISOString());
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to save idea draft.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLocked) return;
    if (teamTooSmall) {
      setError("At least two team members are required before submitting an idea.");
      return;
    }
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
    setSubmitConfirmationOpen(true);
  };

  const confirmSubmit = async () => {
    if (teamTooSmall) {
      setError("At least two team members are required before submitting an idea.");
      return;
    }
    setSubmitConfirmationOpen(false);
    setIsSubmitting(true);
    try {
      const trimmedShort = shortDescription.trim();
      const trimmedLong = longDescription.trim();
      const response = await portalApi.submitIdea({
        short_description: trimmedShort,
        long_description: trimmedLong || trimmedShort,
        links: links.trim(),
        tracks: selectedTracks.join(", "),
      });

      const rawLinks = links.split(",").map((l) => l.trim()).filter(Boolean);
      let githubLink = "";
      let figmaLink = "";
      for (const l of rawLinks) {
        if (l.includes("github.com")) githubLink = l;
        else if (l.includes("figma.com")) figmaLink = l;
        else if (!githubLink) githubLink = l;
        else if (!figmaLink) figmaLink = l;
      }

      await portalApi.saveSubmission({
        shortSummary: trimmedShort,
        problemStatement: trimmedLong || trimmedShort,
        githubUrl: githubLink,
        figmaUrl: figmaLink,
        status: "submitted",
        isLocked: true,
      }, false);

      setLastEditedBy(response.idea?.last_edited_by_name || portalApi.getSession()?.name || "");
      setLastEditedAt(response.idea?.updated_at || new Date().toISOString());
      setIsLocked(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to submit idea.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="relative min-h-screen w-full bg-black text-white flex flex-col items-center justify-start overflow-x-hidden overflow-y-auto select-none p-4 sm:p-6 md:p-10 pb-20">
      {/* Top Left GDG Lockup */}
      <header
        className="absolute top-4 sm:top-6 md:top-8 left-4 sm:left-6 md:left-10 z-30"
        aria-label="Google Developer Groups"
      >
        <GDGLockup />
      </header>

      {/* Top Right Profile Link */}
      <Link
        href="/profile"
        className="absolute right-4 top-4 sm:right-6 sm:top-6 md:right-10 md:top-8 inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-white/90 hover:text-white transition-all group z-30"
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
        className="fixed md:relative bottom-6 sm:bottom-8 md:bottom-auto left-1/2 md:left-auto -translate-x-1/2 md:translate-x-0 translate-y-0 md:translate-y-0 pointer-events-none z-10 w-full max-w-[370px] md:max-w-[848px] h-[135px] md:h-[clamp(140px,22vw,314px)] md:-mt-[clamp(24px,5vw,135px)] flex items-center justify-center overflow-visible flex-shrink-0"
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
      <div className="w-full max-w-[1072px] mx-auto flex flex-col items-center justify-start gap-[clamp(12px,1.8vh,24px)] z-20 px-1 sm:px-3 md:px-0 pt-12 sm:pt-13 md:pt-0 pb-25 md:pb-0">
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
            <svg
              className="w-5 h-5 shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="4" y="10" width="16" height="10" rx="2" />
              <path d="M8 10V7a4 4 0 0 1 8 0v3" />
            </svg>
            <div>
              <p className="font-semibold">{lockedSubmissionStatus.headline}</p>
              <p className="text-xs text-emerald-400/80 mt-0.5">
                {lockedSubmissionStatus.detail}
              </p>
            </div>
          </div>
        )}

        {/* Idea submission requires a complete team */}
        {!isLocked && teamTooSmall && (
          <div className="w-full p-3.5 sm:p-4 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs sm:text-sm flex items-center gap-3">
            <Info className="h-5 w-5 shrink-0" aria-hidden="true" />
            <div>
              <p className="font-medium">At least two team members are required before saving or submitting an idea.</p>
              <p className="text-xs text-amber-400/80 mt-0.5">
                Invite another participant to your team, then return here to continue.
              </p>
            </div>
          </div>
        )}

        {/* Leader Info Banner if not leader */}
        {!isLocked && !isLeader && !teamTooSmall && (
          <div className="w-full p-3.5 sm:p-4 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs sm:text-sm flex items-center gap-3">
            <Info className="h-5 w-5 shrink-0" aria-hidden="true" />
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
              disabled={isLocked || isSubmitting || isSaving}
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
              disabled={isLocked || isSubmitting || isSaving}
              placeholder="Detailed architecture, features, problem statement and solution..."
              className="w-full bg-[#343434] text-white rounded-[4px] sm:rounded-[8px] px-3.5 sm:px-7 py-2 sm:py-3 text-[clamp(12px,1.6vw,18px)] focus:outline-none focus:ring-1 focus:ring-white/40 resize-none min-h-[85px] sm:min-h-[125px] h-[85px] sm:h-[125px] transition-all placeholder:text-neutral-500 disabled:opacity-75 disabled:cursor-not-allowed"
              style={{
                fontFamily: "var(--font-google-sans), 'Google Sans', sans-serif",
              }}
            />
          </div>

          {/* Field 3: Links (Optional) */}
          <div className="w-full flex flex-col items-start gap-1.5 sm:gap-2.5">
            <label
              htmlFor="links"
              className="text-white font-normal capitalize text-[clamp(16px,2vw,32px)] leading-[1.3] flex items-center gap-2"
              style={{
                fontFamily: "var(--font-google-sans), 'Google Sans', sans-serif",
              }}
            >
              <span>Links</span>
              <span className="text-xs sm:text-sm font-normal text-white/50 lowercase">
                (optional)
              </span>
            </label>
            <input
              id="links"
              type="text"
              value={links}
              onChange={(e) => setLinks(e.target.value)}
              disabled={isLocked || isSubmitting || isSaving}
              placeholder="https://drive.google.com/"
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
                if (!isLocked) {
                  setIsTracksOpen((prev) => !prev);
                }
              }}
              className={`w-full min-h-[32px] sm:min-h-[56px] bg-[#343434] text-white rounded-[4px] sm:rounded-[8px] px-3.5 sm:px-6 py-1.5 sm:py-2.5 flex items-center justify-between border border-transparent transition-all select-none ${
                isLocked
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
                      {!isLocked && (
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

              {!isLocked && (
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
              {isTracksOpen && !isLocked && (
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

          {/* Draft and submission actions */}
          <div className="pt-2 flex flex-wrap items-center gap-3 sm:gap-4">
            <Link href="/team">
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="font-medium text-[clamp(12px,1.6vw,20px)] rounded-full px-5 sm:px-8 py-1.5 sm:py-2.5 flex items-center justify-center gap-2 bg-[#343434] text-white hover:bg-[#444444] border border-white/10 shadow-md transition-all cursor-pointer select-none"
                style={{
                  fontFamily: "var(--font-google-sans), 'Google Sans', sans-serif",
                  minWidth: "100px",
                  height: "36px",
                }}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="stroke-current flex-shrink-0"
                >
                  <path
                    d="M11.5 8H4.5M4.5 8L8.5 4M4.5 8L8.5 12"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span>Back</span>
              </motion.div>
            </Link>

            {!isLocked && (
              <motion.button
                type="button"
                onClick={handleSave}
                disabled={teamTooSmall || isSaving || isSubmitting}
                whileHover={!teamTooSmall && !isSaving && !isSubmitting ? { scale: 1.03 } : {}}
                whileTap={!teamTooSmall && !isSaving && !isSubmitting ? { scale: 0.97 } : {}}
                className="font-medium text-[clamp(12px,1.6vw,20px)] rounded-full px-5 sm:px-8 py-1.5 sm:py-2.5 flex items-center justify-center gap-2 bg-neutral-700 text-white hover:bg-neutral-600 disabled:opacity-60 disabled:cursor-not-allowed shadow-md transition-all"
                style={{
                  fontFamily: "var(--font-google-sans), 'Google Sans', sans-serif",
                  minWidth: "120px",
                  height: "36px",
                }}
              >
                {isSaving ? "Saving..." : "Save Draft"}
              </motion.button>
            )}

            {isLeader && (
              <motion.button
                type="submit"
                disabled={isLocked || teamTooSmall || isSubmitting || isSaving}
                whileHover={!isLocked && !teamTooSmall && !isSubmitting && !isSaving ? { scale: 1.03 } : {}}
                whileTap={!isLocked && !teamTooSmall && !isSubmitting && !isSaving ? { scale: 0.97 } : {}}
                className={`font-medium text-[clamp(12px,1.6vw,20px)] rounded-full px-5 sm:px-8 py-1.5 sm:py-2.5 flex items-center justify-center gap-2 border-none shadow-md transition-all ${
                  isLocked
                    ? "bg-emerald-600 text-white cursor-not-allowed opacity-90"
                    : "bg-white text-black hover:bg-neutral-100 disabled:opacity-60 disabled:cursor-not-allowed"
                }`}
                style={{
                  fontFamily: "var(--font-google-sans), 'Google Sans', sans-serif",
                  minWidth: "120px",
                  height: "36px",
                }}
              >
                {isLocked
                  ? lockedSubmissionStatus.buttonLabel
                  : isSubmitting
                  ? "Submitting..."
                  : "Submit Proposal"}
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
            )}
          </div>

          {lastEditedBy && (
            <p className="text-xs sm:text-sm text-neutral-400" role="status">
              Last edited by {lastEditedBy}
              {lastEditedAt ? ` on ${new Date(lastEditedAt).toLocaleString()}` : ""}
            </p>
          )}
</form>
      </div>
      {submitConfirmationOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" role="dialog" aria-modal="true" aria-labelledby="submit-confirmation-title">
          <div className="w-full max-w-md rounded-2xl border border-neutral-700 bg-[#202020] p-6 shadow-2xl">
            <h2 id="submit-confirmation-title" className="text-xl font-semibold">Submit this proposal?</h2>
            <p className="mt-3 text-sm text-neutral-300">
              Submission is final. After you confirm, your team&apos;s idea will be locked and no member can edit it.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setSubmitConfirmationOpen(false)}
                className="rounded-full bg-neutral-700 px-4 py-2 text-sm text-white hover:bg-neutral-600"
              >
                Review Draft
              </button>
              <button
                type="button"
                onClick={confirmSubmit}
                className="rounded-full bg-white px-4 py-2 text-sm font-medium text-black hover:bg-neutral-100"
              >
                Confirm Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
