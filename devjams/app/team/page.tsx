"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "../../components/gsap-motion";
import { portalApi, type BackendTeamMember } from "@/services/portalApi";
import { memberActionFor } from "../team-member-actions";

export default function TeamPage() {
  const router = useRouter();
  const [teamName, setTeamName] = useState("DEVJAMS");
  const [teamCode, setTeamCode] = useState("");
  const [codeCopied, setCodeCopied] = useState(false);
  const [inviteCopied, setInviteCopied] = useState(false);
  const [memberToRemove, setMemberToRemove] = useState<BackendTeamMember | null>(null);
  const [memberToPromote, setMemberToPromote] = useState<BackendTeamMember | null>(null);
  const [memberMenu, setMemberMenu] = useState<BackendTeamMember | null>(null);
  const [leaveConfirmationOpen, setLeaveConfirmationOpen] = useState(false);
  const [members, setMembers] = useState<BackendTeamMember[]>([]);
  const [currentEmail, setCurrentEmail] = useState("");
  const [isLeader, setIsLeader] = useState(false);
  const [actionError, setActionError] = useState("");
  const [isManagingMembers, setIsManagingMembers] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTeamData = async () => {
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
        setCurrentEmail(me.email);

        const team = await portalApi.fetchTeam();
        if (team) {
          setTeamName(team.team_name || me.teamName || "My Team");
          setTeamCode(team.join_code || "");
          if (team.members && Array.isArray(team.members)) {
            setMembers(team.members);
          } else {
            setMembers([
              {
                name: me.name || "Team Leader",
                email: me.email,
              },
            ]);
          }
        } else {
          setTeamName(me.teamName || "My Team");
          setTeamCode("");
          setMembers([
            {
              name: me.name || "Team Leader",
              email: me.email,
            },
          ]);
        }
      } catch (err: unknown) {
        console.warn("Failed to load team data:", err);
      } finally {
        setLoading(false);
      }
    };

    loadTeamData();
  }, [router]);

  const refreshMembers = async () => {
    const team = await portalApi.fetchTeam();
    if (team) {
      setMembers(team.members);
    }
  };

  const confirmRemoveMember = async () => {
    if (!memberToRemove) return;
    setActionError("");
    setIsManagingMembers(true);
    try {
      await portalApi.removeTeamMember(memberToRemove.email);
      setMembers((previous) => previous.filter((member) => member.email !== memberToRemove.email));
      setMemberToRemove(null);
    } catch (err: unknown) {
      setActionError(err instanceof Error ? err.message : "Could not remove team member.");
    } finally {
      setIsManagingMembers(false);
    }
  };

  const transferLeadership = async (member: BackendTeamMember) => {
    setActionError("");
    setIsManagingMembers(true);
    try {
      await portalApi.transferTeamLeadership(member.email);
      setIsLeader(false);
      setMemberMenu(null);
      await refreshMembers();
    } catch (err: unknown) {
      setActionError(err instanceof Error ? err.message : "Could not transfer team leadership.");
    } finally {
      setIsManagingMembers(false);
    }
  };

  const leaveTeam = async () => {
    setActionError("");
    setIsManagingMembers(true);
    try {
      await portalApi.leaveTeam();
      router.replace("/portal/join-create");
    } catch (err: unknown) {
      setActionError(err instanceof Error ? err.message : "Could not leave team.");
    } finally {
      setIsManagingMembers(false);
    }
  };

  const confirmTransferLeadership = async () => {
    if (!memberToPromote) return;
    await transferLeadership(memberToPromote);
    setMemberToPromote(null);
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
                  className="text-white/80 font-normal text-[clamp(12px,1.6vw,24px)] leading-none"
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
                Join Code
              </span>

              {/* Team Code Box with Copy Clipboard Button */}
              <div className="w-full h-8 sm:h-14 bg-[#343434] rounded-[4px] sm:rounded-lg flex items-center justify-between px-3.5 sm:px-6 md:px-7">
                <span
                  className="text-white/80 font-normal text-[clamp(12px,1.6vw,24px)] leading-none"
                  style={{
                    fontFamily: 'var(--font-google-sans), "Google Sans", sans-serif',
                  }}
                >
                  {teamCode || "Unavailable"}
                </span>

                {/* Clipboard Icon Button */}
                <button
                  type="button"
                  onClick={copyTeamCode}
                  aria-label="Copy invite code"
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
        <div className="flex flex-col items-start w-full max-w-[580px] gap-2">
          {/* Members Heading */}
          <h2
            className="text-white font-normal leading-[1.3] capitalize m-0 flex items-center w-full text-[clamp(24px,3.2vw,48px)]"
            style={{
              fontFamily: 'var(--font-google-sans), "Google Sans", sans-serif',
            }}
          >
            Members
          </h2>

          {actionError && (
            <p role="alert" className="m-0 text-sm text-red-300">
              {actionError}
            </p>
          )}

          {/* Member Rows */}
          <div className="flex flex-col items-start w-full gap-3 mt-2">
            {loading ? (
              <div className="text-sm text-neutral-400">Loading team members...</div>
            ) : members.length === 0 ? (
              <div className="text-sm text-neutral-400">No members registered yet.</div>
            ) : (
              members.map((member, index) => {
                const action = memberActionFor(member, currentEmail, isLeader);
                const isMemberMenuOpen = memberMenu?.email === member.email;
                return (
                  <div
                    key={member.email || index}
                    className="w-full h-10 sm:h-14 bg-[#343434] rounded-[4px] sm:rounded-lg flex flex-row justify-between items-center px-3.5 sm:px-6 md:px-7 box-border flex-shrink-0"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span
                        className="text-white/90 font-normal text-[clamp(12px,1.6vw,20px)] leading-none truncate"
                        style={{
                          fontFamily: 'var(--font-google-sans), "Google Sans", sans-serif',
                        }}
                      >
                        {member.name}
                      </span>
                      {member.is_team_leader && (
                        <span className="text-[10px] sm:text-xs px-2 py-0.5 rounded-full font-medium bg-blue-500/20 text-blue-300 border border-blue-400/30">
                          Leader
                        </span>
                      )}
                    </div>

                    <div className="relative ml-3 flex shrink-0 items-center">
                      {action === "leave" && (
                        <button
                          type="button"
                          onClick={() => setLeaveConfirmationOpen(true)}
                          aria-label="Leave team"
                          className="w-7 h-7 flex items-center justify-center cursor-pointer bg-transparent border-none p-0 text-white/60 hover:text-red-300 transition-colors"
                        >
                          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                            <path d="M3 3L15 15M15 3L3 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                          </svg>
                        </button>
                      )}
                      {action === "manage" && (
                        <>
                          <button
                            type="button"
                            onClick={() => setMemberMenu(isMemberMenuOpen ? null : member)}
                            aria-label={`Manage member ${member.name}`}
                            aria-expanded={isMemberMenuOpen}
                            aria-haspopup="menu"
                            className="w-7 h-7 flex items-center justify-center cursor-pointer bg-transparent border-none p-0 text-white/60 hover:text-white transition-colors"
                          >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                              <circle cx="5" cy="12" r="1.8" />
                              <circle cx="12" cy="12" r="1.8" />
                              <circle cx="19" cy="12" r="1.8" />
                            </svg>
                          </button>
                          {isMemberMenuOpen && (
                            <div role="menu" className="absolute right-0 top-8 z-20 w-40 overflow-hidden rounded-lg border border-white/15 bg-[#252525] py-1 shadow-xl">
                              <button
                                type="button"
                                role="menuitem"
                                onClick={() => {
                                  setMemberMenu(null);
                                  setMemberToPromote(member);
                                }}
                                disabled={isManagingMembers}
                                className="w-full px-3 py-2 text-left text-sm text-white hover:bg-white/10 disabled:opacity-50"
                              >
                                Make leader
                              </button>
                              <button
                                type="button"
                                role="menuitem"
                                onClick={() => {
                                  setMemberMenu(null);
                                  setMemberToRemove(member);
                                }}
                                disabled={isManagingMembers}
                                className="w-full px-3 py-2 text-left text-sm text-red-300 hover:bg-red-500/10 disabled:opacity-50"
                              >
                                Remove member
                              </button>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Action Buttons Row: Invite & Go to Idea Submission */}
        <div className="flex flex-wrap items-center gap-4 mt-2">
          {/* Invite Button */}
          <motion.button
            type="button"
            onClick={handleInvite}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white text-black rounded-full flex items-center justify-center cursor-pointer border-none shadow-md hover:bg-neutral-100 transition-all px-5 sm:px-8 py-1.5 sm:py-2.5 min-w-[95px] sm:min-w-[138px] h-8 sm:h-11"
          >
            <span
              className="text-[clamp(12px,1.6vw,20px)] leading-none font-medium text-center"
              style={{
                fontFamily: 'var(--font-google-sans), "Google Sans", sans-serif',
                letterSpacing: "0.02em",
              }}
            >
              {inviteCopied ? "Copied Code!" : "Invite Members"}
            </span>
          </motion.button>

          {/* Proceed to Idea Submission */}
          <Link href="/idea/submission">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-[#343434] hover:bg-white text-white hover:text-black border border-white/10 hover:border-transparent rounded-full flex items-center justify-center cursor-pointer shadow-md transition-all px-5 sm:px-8 py-1.5 sm:py-2.5 min-w-[140px] h-8 sm:h-11 gap-2"
            >
              <span
                className="text-[clamp(12px,1.6vw,20px)] leading-none font-medium text-center"
                style={{
                  fontFamily: 'var(--font-google-sans), "Google Sans", sans-serif',
                  letterSpacing: "0.02em",
                }}
              >
                Idea Submission
              </span>
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </motion.div>
          </Link>
        </div>
      </div>

      <AnimatePresence>
        {memberToPromote && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMemberToPromote(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 12 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              role="dialog"
              aria-modal="true"
              aria-labelledby="make-leader-title"
              className="relative z-10 w-[440px] max-w-[92vw] bg-[#1E1E1E] border border-white/15 rounded-[20px] p-7 shadow-2xl flex flex-col items-center text-center gap-6"
            >
              <div className="w-12 h-12 rounded-full bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-300">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M12 9V14M12 17.5V18M12 3L2 21H22L12 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div className="flex flex-col gap-2">
                <h3 id="make-leader-title" className="text-white font-bold text-2xl m-0" style={{ fontFamily: 'var(--font-google-sans), "Google Sans", sans-serif' }}>
                  Make {memberToPromote.name} leader?
                </h3>
                <p className="text-white/60 text-sm m-0">
                  You will become a member. Only the new leader can manage the team.
                </p>
              </div>
              <div className="flex flex-row items-center justify-center gap-4 w-full pt-2">
                <button
                  type="button"
                  onClick={() => setMemberToPromote(null)}
                  disabled={isManagingMembers}
                  className="flex-1 h-11 rounded-[35px] border border-white/30 text-white font-medium text-base hover:bg-white/10 transition-colors cursor-pointer disabled:opacity-50"
                  style={{ fontFamily: 'var(--font-google-sans), "Google Sans", sans-serif' }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirmTransferLeadership}
                  disabled={isManagingMembers}
                  className="flex-1 h-11 rounded-[35px] bg-amber-300 text-black font-bold text-base hover:bg-amber-200 transition-colors border-none cursor-pointer shadow-lg shadow-amber-500/20 disabled:opacity-50"
                  style={{ fontFamily: 'var(--font-google-sans), "Google Sans", sans-serif' }}
                >
                  {isManagingMembers ? "Updating..." : "Make leader"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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
                  disabled={isManagingMembers}
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

      <AnimatePresence>
        {leaveConfirmationOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setLeaveConfirmationOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 12 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              role="dialog"
              aria-modal="true"
              aria-labelledby="leave-team-title"
              className="relative z-10 w-[440px] max-w-[92vw] bg-[#1E1E1E] border border-white/15 rounded-[20px] p-7 shadow-2xl flex flex-col items-center text-center gap-6"
            >
              <div className="w-12 h-12 rounded-full bg-red-500/15 border border-red-500/30 flex items-center justify-center text-[#EA4335]">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M12 9V14M12 17.5V18M12 3L2 21H22L12 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div className="flex flex-col gap-2">
                <h3 id="leave-team-title" className="text-white font-bold text-2xl m-0" style={{ fontFamily: 'var(--font-google-sans), "Google Sans", sans-serif' }}>
                  {isLeader ? "Transfer leadership first" : "Leave this team?"}
                </h3>
                <p className="text-white/60 text-sm m-0">
                  {isLeader
                    ? "Choose another member from the menu and make them leader before leaving."
                    : "You will lose access to this team and its idea submission."}
                </p>
              </div>
              <div className="flex flex-row items-center justify-center gap-4 w-full pt-2">
                <button
                  type="button"
                  onClick={() => setLeaveConfirmationOpen(false)}
                  className="flex-1 h-11 rounded-[35px] border border-white/30 text-white font-medium text-base hover:bg-white/10 transition-colors cursor-pointer"
                  style={{ fontFamily: 'var(--font-google-sans), "Google Sans", sans-serif' }}
                >
                  {isLeader ? "Close" : "Cancel"}
                </button>
                {!isLeader && (
                  <button
                    type="button"
                    onClick={leaveTeam}
                    disabled={isManagingMembers}
                    className="flex-1 h-11 rounded-[35px] bg-[#EA4335] text-white font-bold text-base hover:bg-[#d93025] transition-colors border-none cursor-pointer shadow-lg shadow-red-500/20 disabled:opacity-50"
                    style={{ fontFamily: 'var(--font-google-sans), "Google Sans", sans-serif' }}
                  >
                    {isManagingMembers ? "Leaving..." : "Leave team"}
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}
