"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { PortalNavbar } from "@/components/portal/PortalNavbar";
import {
  portalApi,
  type IdeaSubmission,
  type UserSession,
} from "@/services/portalApi";

export default function PortalDashboardPage() {
  const router = useRouter();
  const [session] = useState<UserSession | null>(() => portalApi.getSession());
  const [submission, setSubmission] = useState<IdeaSubmission | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session) {
      router.push("/portal");
      return;
    }

    portalApi.getSubmission(session.id).then((sub) => {
      setSubmission(sub);
      setLoading(false);
    });
  }, [router, session]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm text-neutral-400 font-medium">Loading dashboard...</span>
        </div>
      </div>
    );
  }

  const trackInfo = submission ? portalApi.getTrackDetails(submission.track) : null;

  return (
    <div className="min-h-screen bg-[#0A0A0C] text-white flex flex-col">
      <PortalNavbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-white/10 text-neutral-300 font-medium border border-white/10">
                {session?.participantType === "internal" ? "VIT Internal Participant" : "External Participant"}
              </span>
              <span className="text-xs text-neutral-500">•</span>
              <span className="text-xs text-neutral-400">DevJams &apos;26 Candidate</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
              Welcome, {session?.name || "Hacker"}!
            </h1>
            <p className="text-xs sm:text-sm text-neutral-400 mt-1">
              Track your hackathon proposal, team roster, and evaluation status.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/portal/submit"
              className="px-5 py-2.5 rounded-full bg-amber-400 hover:bg-amber-300 text-black font-semibold text-xs sm:text-sm transition shadow-[0_0_20px_rgba(251,188,4,0.25)]"
            >
              {submission ? "Edit Proposal" : "Submit Proposal →"}
            </Link>
          </div>
        </div>

        {/* If No Submission Yet */}
        {!submission ? (
          <div className="bg-[#121216] border border-white/10 rounded-3xl p-8 sm:p-12 text-center max-w-2xl mx-auto my-8">
            <div className="w-16 h-16 rounded-2xl bg-amber-400/10 border border-amber-400/20 text-amber-400 flex items-center justify-center text-3xl mx-auto mb-4">
              💡
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              No Proposal Submitted Yet
            </h2>
            <p className="text-sm text-neutral-400 mb-6 max-w-md mx-auto leading-relaxed">
              You haven&apos;t submitted your idea for DevJams &apos;26 yet. Select a track, form your team, and submit your proposal before the deadline!
            </p>
            <Link
              href="/portal/submit"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-300 hover:to-orange-300 text-black font-bold text-sm transition shadow-[0_0_25px_rgba(251,188,4,0.3)]"
            >
              Start Idea Submission →
            </Link>
          </div>
        ) : (
          /* Submission Overview */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column: Project Overview */}
            <div className="lg:col-span-2 space-y-6">
              {/* Main Proposal Card */}
              <div className="bg-[#121216] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-5">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-green-500/20 text-green-400 border border-green-500/30">
                        {submission.status === "submitted" ? "✓ Submitted" : submission.status.toUpperCase()}
                      </span>
                      {trackInfo && (
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/10 text-neutral-300 border border-white/10 flex items-center gap-1.5">
                          <Image
                            src={trackInfo.icon}
                            alt={trackInfo.name}
                            width={14}
                            height={14}
                            className="object-contain"
                          />
                          {trackInfo.name}
                        </span>
                      )}
                    </div>
                    <h2 className="text-2xl font-bold text-white tracking-tight">
                      {submission.title || "Untitled Project"}
                    </h2>
                  </div>

                  <Link
                    href="/portal/submit"
                    className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-xs font-semibold text-white transition self-start"
                  >
                    Edit Submission
                  </Link>
                </div>

                {/* Pitch */}
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-amber-400 mb-1.5">
                    Summary / Pitch
                  </h3>
                  <p className="text-sm text-neutral-300 leading-relaxed">
                    {submission.shortSummary || "No summary provided."}
                  </p>
                </div>

                {/* Problem Statement */}
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5">
                    Problem Statement
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed bg-white/5 p-4 rounded-2xl border border-white/5">
                    {submission.problemStatement || "No problem statement provided."}
                  </p>
                </div>

                {/* Proposed Solution */}
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5">
                    Proposed Solution & Architecture
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed bg-white/5 p-4 rounded-2xl border border-white/5 whitespace-pre-line">
                    {submission.proposedSolution || "No solution details provided."}
                  </p>
                </div>

                {/* Tech Stack */}
                {submission.techStack && submission.techStack.length > 0 && (
                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">
                      Technologies & Tools
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {submission.techStack.map((tech) => (
                        <span
                          key={tech}
                          className="px-3 py-1 rounded-full bg-white/10 border border-white/10 text-xs text-neutral-200"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Links & Artifacts */}
              <div className="bg-[#121216] border border-white/10 rounded-3xl p-6 space-y-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Submission Deliverables & Links
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {submission.githubUrl ? (
                    <a
                      href={submission.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-between transition group"
                    >
                      <span className="text-xs font-medium text-neutral-300">GitHub Repository</span>
                      <span className="text-xs text-neutral-500 group-hover:text-white transition">↗</span>
                    </a>
                  ) : (
                    <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 text-xs text-neutral-500">
                      GitHub Repo: Not provided
                    </div>
                  )}

                  {submission.figmaUrl ? (
                    <a
                      href={submission.figmaUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-between transition group"
                    >
                      <span className="text-xs font-medium text-neutral-300">Figma Prototype</span>
                      <span className="text-xs text-neutral-500 group-hover:text-white transition">↗</span>
                    </a>
                  ) : (
                    <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 text-xs text-neutral-500">
                      Figma Link: Not provided
                    </div>
                  )}

                  {submission.presentationUrl ? (
                    <a
                      href={submission.presentationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-between transition group"
                    >
                      <span className="text-xs font-medium text-neutral-300">Pitch Deck / Slides</span>
                      <span className="text-xs text-neutral-500 group-hover:text-white transition">↗</span>
                    </a>
                  ) : (
                    <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 text-xs text-neutral-500">
                      Presentation: Not provided
                    </div>
                  )}

                  {submission.demoUrl ? (
                    <a
                      href={submission.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-between transition group"
                    >
                      <span className="text-xs font-medium text-neutral-300">Demo Video</span>
                      <span className="text-xs text-neutral-500 group-hover:text-white transition">↗</span>
                    </a>
                  ) : (
                    <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 text-xs text-neutral-500">
                      Demo Video: Not provided
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column: Team Roster & Timeline */}
            <div className="space-y-6">
              {/* Team Card */}
              <div className="bg-[#121216] border border-white/10 rounded-3xl p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div>
                    <h3 className="text-base font-bold text-white">
                      {submission.teamName || "Team"}
                    </h3>
                    <p className="text-xs text-neutral-400">
                      {submission.members.length + 1} Member(s)
                    </p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-amber-400/10 text-amber-400 text-[11px] font-semibold border border-amber-400/20">
                    Active
                  </span>
                </div>

                <div className="space-y-3">
                  {/* Leader */}
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-white">{submission.leaderName}</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-400 text-black font-bold">
                          LEAD
                        </span>
                      </div>
                      <span className="text-[11px] text-neutral-400 block truncate max-w-[170px]">
                        {submission.leaderEmail}
                      </span>
                    </div>
                    {submission.leaderPhone && (
                      <span className="text-[10px] text-neutral-400">{submission.leaderPhone}</span>
                    )}
                  </div>

                  {/* Members */}
                  {submission.members.map((member, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between"
                    >
                      <div>
                        <span className="text-xs font-semibold text-white block">
                          {member.name || `Member ${idx + 2}`}
                        </span>
                        <span className="text-[11px] text-neutral-400 block truncate max-w-[170px]">
                          {member.email || "No email"}
                        </span>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-neutral-300">
                        {member.role || "Member"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Timeline Status */}
              <div className="bg-[#121216] border border-white/10 rounded-3xl p-6 space-y-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Evaluation Timeline
                </h3>
                <div className="space-y-4 relative pl-4 before:absolute before:left-1.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-white/10">
                  <div className="relative">
                    <span className="absolute -left-4 top-1 w-2.5 h-2.5 rounded-full bg-green-400 ring-4 ring-green-400/20" />
                    <h4 className="text-xs font-bold text-white">Round 1: Idea Submission</h4>
                    <p className="text-[11px] text-green-400 font-medium">Completed / Submitted</p>
                  </div>

                  <div className="relative">
                    <span className="absolute -left-4 top-1 w-2.5 h-2.5 rounded-full bg-amber-400 ring-4 ring-amber-400/20 animate-pulse" />
                    <h4 className="text-xs font-bold text-white">Round 2: Idea Evaluation & Review</h4>
                    <p className="text-[11px] text-amber-400 font-medium">In Progress</p>
                  </div>

                  <div className="relative opacity-60">
                    <span className="absolute -left-4 top-1 w-2.5 h-2.5 rounded-full bg-white/20" />
                    <h4 className="text-xs font-bold text-neutral-300">Round 3: 48-Hour Hackathon</h4>
                    <p className="text-[11px] text-neutral-500">Upcoming</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
