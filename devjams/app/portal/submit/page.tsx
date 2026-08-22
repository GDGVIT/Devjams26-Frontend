"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { PortalNavbar } from "@/components/portal/PortalNavbar";
import {
  portalApi,
  type TeamMember,
  type TrackType,
  type UserSession,
} from "@/services/portalApi";

const AVAILABLE_TRACKS: {
  id: TrackType;
  title: string;
  badge: string;
  icon: string;
  description: string;
  color: string;
}[] = [
  {
    id: "android",
    title: "Android Development",
    badge: "Mobile & Devices",
    icon: "/assets/android.svg",
    description: "Modern Android experiences, Jetpack Compose, Kotlin, wearable integration, on-device intelligence.",
    color: "hover:border-green-500/50 hover:bg-green-500/5",
  },
  {
    id: "web",
    title: "Web Development",
    badge: "Fullstack & Edge",
    icon: "/assets/web.svg",
    description: "High-performance web apps, responsive frontend architectures, APIs, WebAssembly, and interactive platforms.",
    color: "hover:border-blue-500/50 hover:bg-blue-500/5",
  },
  {
    id: "gemini",
    title: "AI / ML & Gemini",
    badge: "GenAI & Models",
    icon: "/assets/gemini.svg",
    description: "Multimodal AI, agentic systems, Google Gemini API, computer vision, NLP, and intelligent assistants.",
    color: "hover:border-amber-500/50 hover:bg-amber-500/5",
  },
  {
    id: "cloud",
    title: "Cloud & DevOps",
    badge: "Infrastructure & Scale",
    icon: "/assets/cloud.svg",
    description: "Google Cloud Platform, serverless, microservices, containerization, CI/CD, and robust distributed systems.",
    color: "hover:border-purple-500/50 hover:bg-purple-500/5",
  },
  {
    id: "open-innovation",
    title: "Open Innovation",
    badge: "Hardware, Web3, & More",
    icon: "/assets/logo/openinnovation.svg",
    description: "Multidisciplinary hacks, IoT/Embedded systems, cybersecurity, fintech, healthtech, and creative moonshots.",
    color: "hover:border-rose-500/50 hover:bg-rose-500/5",
  },
];

export default function SubmitProposalPage() {
  const router = useRouter();
  const [session] = useState<UserSession | null>(() => portalApi.getSession());
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [error, setError] = useState("");

  // Form State
  const [activeStep, setActiveStep] = useState<1 | 2 | 3 | 4>(1);
  const [teamName, setTeamName] = useState("");
  const [leaderName] = useState(() => portalApi.getSession()?.name || "");
  const [leaderEmail] = useState(() => portalApi.getSession()?.email || "");
  const [leaderPhone, setLeaderPhone] = useState("");
  const [leaderRegNo] = useState(() => portalApi.getSession()?.registrationNumber || "");
  const [members, setMembers] = useState<TeamMember[]>([]);

  const [selectedTrack, setSelectedTrack] = useState<TrackType>("web");

  const [projectTitle, setProjectTitle] = useState("");
  const [shortSummary, setShortSummary] = useState("");
  const [problemStatement, setProblemStatement] = useState("");
  const [proposedSolution, setProposedSolution] = useState("");
  const [techStackInput, setTechStackInput] = useState("");
  const [techStack, setTechStack] = useState<string[]>(["React", "Next.js", "Node.js"]);

  const [githubUrl, setGithubUrl] = useState("");
  const [figmaUrl, setFigmaUrl] = useState("");
  const [demoUrl, setDemoUrl] = useState("");
  const [presentationUrl, setPresentationUrl] = useState("");

  useEffect(() => {
    if (!session) {
      router.push("/portal");
      return;
    }

    // Load existing draft if any
    portalApi.getSubmission(session.id).then((sub) => {
      if (sub) {
        if (sub.teamName) setTeamName(sub.teamName);
        if (sub.leaderPhone) setLeaderPhone(sub.leaderPhone);
        if (sub.members && sub.members.length > 0) setMembers(sub.members);
        if (sub.track) setSelectedTrack(sub.track);
        if (sub.title) setProjectTitle(sub.title);
        if (sub.shortSummary) setShortSummary(sub.shortSummary);
        if (sub.problemStatement) setProblemStatement(sub.problemStatement);
        if (sub.proposedSolution) setProposedSolution(sub.proposedSolution);
        if (sub.techStack && sub.techStack.length > 0) setTechStack(sub.techStack);
        if (sub.githubUrl) setGithubUrl(sub.githubUrl);
        if (sub.figmaUrl) setFigmaUrl(sub.figmaUrl);
        if (sub.demoUrl) setDemoUrl(sub.demoUrl);
        if (sub.presentationUrl) setPresentationUrl(sub.presentationUrl);
      }
      setLoading(false);
    });
  }, [router, session]);

  const addMember = () => {
    // Teams are 2 to 4 people in total. The signed-in user is the leader and is
    // not part of `members`, so this list holds 1 to 3 additional people.
    if (members.length >= 3) {
      setError("Maximum team size is 4 (you + 3 members).");
      return;
    }
    setMembers([...members, { name: "", email: "", role: "Developer" }]);
  };

  const updateMember = (index: number, field: keyof TeamMember, value: string) => {
    const updated = [...members];
    updated[index] = { ...updated[index], [field]: value };
    setMembers(updated);
  };

  const removeMember = (index: number) => {
    setMembers(members.filter((_, i) => i !== index));
  };

  const addTechTag = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && techStackInput.trim()) {
      e.preventDefault();
      if (!techStack.includes(techStackInput.trim())) {
        setTechStack([...techStack, techStackInput.trim()]);
      }
      setTechStackInput("");
    }
  };

  const removeTechTag = (tag: string) => {
    setTechStack(techStack.filter((t) => t !== tag));
  };

  const validateForm = (isSubmitting = false): boolean => {
    setError("");
    if (!teamName.trim()) {
      setError("Please enter a Team Name.");
      setActiveStep(1);
      return false;
    }
    if (!leaderPhone.trim()) {
      setError("Please provide a contact phone number for the Team Lead.");
      setActiveStep(1);
      return false;
    }
    if (isSubmitting) {
      // Lower bound of the 2 to 4 team size. Only enforced on final submission
      // so an incomplete roster can still be saved as a draft.
      if (members.length < 1) {
        setError("Teams need at least 2 people. Add at least one more member.");
        setActiveStep(1);
        return false;
      }
      if (!projectTitle.trim()) {
        setError("Please enter a Project Title.");
        setActiveStep(3);
        return false;
      }
      if (!shortSummary.trim() || shortSummary.length < 30) {
        setError("Please provide a short summary / elevator pitch (at least 30 characters).");
        setActiveStep(3);
        return false;
      }
      if (!problemStatement.trim()) {
        setError("Please describe the Problem Statement.");
        setActiveStep(3);
        return false;
      }
      if (!proposedSolution.trim()) {
        setError("Please outline your Proposed Solution & Architecture.");
        setActiveStep(3);
        return false;
      }
    }
    return true;
  };

  const handleSaveDraft = async () => {
    if (!validateForm(false)) return;
    setSubmitting(true);
    try {
      await portalApi.saveSubmission(
        {
          teamName,
          leaderName,
          leaderEmail,
          leaderPhone,
          leaderRegNo,
          members,
          track: selectedTrack,
          title: projectTitle,
          shortSummary,
          problemStatement,
          proposedSolution,
          techStack,
          githubUrl,
          figmaUrl,
          demoUrl,
          presentationUrl,
        },
        true
      );
      alert("Draft saved successfully!");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to save draft.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitProposal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm(true)) return;

    setSubmitting(true);
    try {
      await portalApi.saveSubmission(
        {
          teamName,
          leaderName,
          leaderEmail,
          leaderPhone,
          leaderRegNo,
          members,
          track: selectedTrack,
          title: projectTitle,
          shortSummary,
          problemStatement,
          proposedSolution,
          techStack,
          githubUrl,
          figmaUrl,
          demoUrl,
          presentationUrl,
        },
        false
      );
      setSuccessModalOpen(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to submit proposal.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm text-neutral-400 font-medium">Loading portal...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0C] text-white flex flex-col">
      <PortalNavbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8">
        {/* Top Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
                Submit Your Idea Proposal
              </h1>
              <p className="text-sm text-neutral-400 mt-1">
                DevJams ’26 Round 1 Idea Submission & Evaluation
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleSaveDraft}
                disabled={submitting}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-xs font-semibold text-white transition disabled:opacity-50 cursor-pointer"
              >
                Save Draft
              </button>
              <Link
                href="/portal/dashboard"
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-neutral-300 transition"
              >
                View Dashboard
              </Link>
            </div>
          </div>

          {/* Stepper Bar */}
          <div className="grid grid-cols-4 gap-2 sm:gap-4 mt-6">
            {[
              { num: 1, label: "Team Details" },
              { num: 2, label: "Track Selection" },
              { num: 3, label: "Idea & Solution" },
              { num: 4, label: "Links & Review" },
            ].map((step) => (
              <button
                key={step.num}
                type="button"
                onClick={() => setActiveStep(step.num as 1 | 2 | 3 | 4)}
                className={`flex flex-col sm:flex-row items-center gap-2 p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                  activeStep === step.num
                    ? "bg-white/10 border-white/30 text-white shadow-[0_0_20px_rgba(255,255,255,0.05)]"
                    : "bg-white/5 border-white/5 text-neutral-400 hover:text-white"
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                    activeStep === step.num
                      ? "bg-amber-400 text-black"
                      : "bg-white/10 text-neutral-300"
                  }`}
                >
                  {step.num}
                </div>
                <span className="text-xs sm:text-sm font-medium text-center sm:text-left truncate">
                  {step.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 shrink-0" aria-hidden="true" />
            <span>{error}</span>
          </div>
        )}

        {/* Step Content Form */}
        <form onSubmit={handleSubmitProposal} className="space-y-6">
          {/* STEP 1: TEAM DETAILS */}
          {activeStep === 1 && (
            <div className="bg-[#121216] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 animate-in fade-in duration-200">
              <div>
                <h2 className="text-xl font-bold text-white mb-1">Team Information</h2>
                <p className="text-xs text-neutral-400">
                  Provide your team name, contact details, and member roster (teams are 2 to 4 people, including you).
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                    Team Name <span className="text-amber-400">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. ByteCraft Innovators"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-amber-400 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                    Team Leader Phone / WhatsApp <span className="text-amber-400">*</span>
                  </label>
                  <input
                    type="tel"
                    placeholder="+91 9876543210"
                    value={leaderPhone}
                    onChange={(e) => setLeaderPhone(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-amber-400 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                    Team Leader Name
                  </label>
                  <input
                    type="text"
                    value={leaderName}
                    disabled
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/5 text-neutral-400 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                    Team Leader Email
                  </label>
                  <input
                    type="email"
                    value={leaderEmail}
                    disabled
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/5 text-neutral-400 text-sm"
                  />
                </div>
              </div>

              {/* Members Section */}
              <div className="pt-4 border-t border-white/10">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-sm font-semibold text-white">Team Members</h3>
                    <p className="text-xs text-neutral-400">Add 1 to 3 additional team members</p>
                  </div>
                  <button
                    type="button"
                    onClick={addMember}
                    disabled={members.length >= 3}
                    className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-medium text-white transition disabled:opacity-40 cursor-pointer"
                  >
                    + Add Member
                  </button>
                </div>

                {members.length === 0 ? (
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-center text-xs text-neutral-400">
                    No additional members added. Click &quot;+ Add Member&quot; to add teammates.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {members.map((member, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-2xl bg-white/5 border border-white/10 grid grid-cols-1 sm:grid-cols-4 gap-3 items-center"
                      >
                        <div>
                          <label className="block text-[11px] text-neutral-400 mb-1">Name</label>
                          <input
                            type="text"
                            placeholder="Full Name"
                            value={member.name}
                            onChange={(e) => updateMember(idx, "name", e.target.value)}
                            className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] text-neutral-400 mb-1">Email</label>
                          <input
                            type="email"
                            placeholder="Email Address"
                            value={member.email}
                            onChange={(e) => updateMember(idx, "email", e.target.value)}
                            className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] text-neutral-400 mb-1">Role</label>
                          <input
                            type="text"
                            placeholder="e.g. Frontend / ML"
                            value={member.role}
                            onChange={(e) => updateMember(idx, "role", e.target.value)}
                            className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400"
                          />
                        </div>

                        <div className="flex justify-end sm:pt-4">
                          <button
                            type="button"
                            onClick={() => removeMember(idx)}
                            className="text-xs text-red-400 hover:text-red-300 p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 transition cursor-pointer"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="button"
                  onClick={() => setActiveStep(2)}
                  className="px-6 py-2.5 rounded-full bg-amber-400 hover:bg-amber-300 text-black font-semibold text-sm transition cursor-pointer"
                >
                  Continue to Track Selection →
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: TRACK SELECTION */}
          {activeStep === 2 && (
            <div className="bg-[#121216] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 animate-in fade-in duration-200">
              <div>
                <h2 className="text-xl font-bold text-white mb-1">Select Hackathon Track</h2>
                <p className="text-xs text-neutral-400">
                  Choose the primary domain/track your idea addresses.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {AVAILABLE_TRACKS.map((track) => (
                  <div
                    key={track.id}
                    onClick={() => setSelectedTrack(track.id)}
                    className={`p-5 rounded-2xl border transition-all cursor-pointer flex items-start gap-4 ${
                      selectedTrack === track.id
                        ? "bg-white/15 border-amber-400 shadow-[0_0_25px_rgba(251,188,4,0.15)]"
                        : `bg-white/5 border-white/10 ${track.color}`
                    }`}
                  >
                    <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center p-2 shrink-0">
                      <Image
                        src={track.icon}
                        alt={track.title}
                        width={40}
                        height={40}
                        className="w-full h-full object-contain"
                      />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-base font-bold text-white">{track.title}</h3>
                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-white/10 text-neutral-300">
                          {track.badge}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                        {track.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-between pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setActiveStep(1)}
                  className="px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/15 text-white font-medium text-sm transition cursor-pointer"
                >
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={() => setActiveStep(3)}
                  className="px-6 py-2.5 rounded-full bg-amber-400 hover:bg-amber-300 text-black font-semibold text-sm transition cursor-pointer"
                >
                  Continue to Idea Details →
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: IDEA & SOLUTION */}
          {activeStep === 3 && (
            <div className="bg-[#121216] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 animate-in fade-in duration-200">
              <div>
                <h2 className="text-xl font-bold text-white mb-1">Project & Solution Proposal</h2>
                <p className="text-xs text-neutral-400">
                  Detail your innovative idea, the problem it tackles, and your technical implementation.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                    Project Title <span className="text-amber-400">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. GeminiMed: Autonomous Clinical AI Triage"
                    value={projectTitle}
                    onChange={(e) => setProjectTitle(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-amber-400 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                    Elevator Pitch / Short Summary (1-2 sentences) <span className="text-amber-400">*</span>
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Briefly describe what your project does and who it helps..."
                    value={shortSummary}
                    onChange={(e) => setShortSummary(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-amber-400 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                    Problem Statement <span className="text-amber-400">*</span>
                  </label>
                  <textarea
                    rows={4}
                    placeholder="What specific problem, bottleneck, or inefficiency does this solve?"
                    value={problemStatement}
                    onChange={(e) => setProblemStatement(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-amber-400 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                    Proposed Solution & Technical Architecture <span className="text-amber-400">*</span>
                  </label>
                  <textarea
                    rows={5}
                    placeholder="Describe how your solution works, core features, algorithms, data flow, and architecture..."
                    value={proposedSolution}
                    onChange={(e) => setProposedSolution(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-amber-400 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                    Technologies / Tech Stack (Press Enter to add tag)
                  </label>
                  <input
                    type="text"
                    placeholder="Type technology (e.g. Next.js, TensorFlow, Flutter, Docker) and press Enter"
                    value={techStackInput}
                    onChange={(e) => setTechStackInput(e.target.value)}
                    onKeyDown={addTechTag}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-amber-400 transition"
                  />
                  <div className="flex flex-wrap gap-2 mt-2.5">
                    {techStack.map((tech) => (
                      <span
                        key={tech}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-xs text-neutral-200"
                      >
                        {tech}
                        <button
                          type="button"
                          onClick={() => removeTechTag(tech)}
                          className="text-neutral-400 hover:text-white cursor-pointer"
                        >
                          ✕
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-between pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setActiveStep(2)}
                  className="px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/15 text-white font-medium text-sm transition cursor-pointer"
                >
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={() => setActiveStep(4)}
                  className="px-6 py-2.5 rounded-full bg-amber-400 hover:bg-amber-300 text-black font-semibold text-sm transition cursor-pointer"
                >
                  Continue to Links & Review →
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: LINKS & REVIEW */}
          {activeStep === 4 && (
            <div className="bg-[#121216] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 animate-in fade-in duration-200">
              <div>
                <h2 className="text-xl font-bold text-white mb-1">Deliverables & Final Submission</h2>
                <p className="text-xs text-neutral-400">
                  Add optional repository, prototype, and presentation links, then submit your idea.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                    GitHub / GitLab Repository URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://github.com/your-team/project"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-amber-400 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                    Figma / Design Prototype URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://figma.com/file/..."
                    value={figmaUrl}
                    onChange={(e) => setFigmaUrl(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-amber-400 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                    Pitch Deck / Presentation URL (Google Drive / DocSend)
                  </label>
                  <input
                    type="url"
                    placeholder="https://drive.google.com/..."
                    value={presentationUrl}
                    onChange={(e) => setPresentationUrl(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-amber-400 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                    Demo Video URL (YouTube / Loom)
                  </label>
                  <input
                    type="url"
                    placeholder="https://youtube.com/watch?v=..."
                    value={demoUrl}
                    onChange={(e) => setDemoUrl(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-amber-400 transition"
                  />
                </div>
              </div>

              {/* Submission Summary Card */}
              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-amber-400">
                  Submission Summary
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <span className="text-neutral-400 block">Team:</span>
                    <span className="font-medium text-white">{teamName || "Not set"}</span>
                  </div>
                  <div>
                    <span className="text-neutral-400 block">Track:</span>
                    <span className="font-medium text-white capitalize">{selectedTrack}</span>
                  </div>
                  <div>
                    <span className="text-neutral-400 block">Members:</span>
                    <span className="font-medium text-white">{members.length + 1} person(s)</span>
                  </div>
                  <div>
                    <span className="text-neutral-400 block">Title:</span>
                    <span className="font-medium text-white truncate block">{projectTitle || "Not set"}</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-between pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setActiveStep(3)}
                  className="px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/15 text-white font-medium text-sm transition cursor-pointer"
                >
                  ← Back
                </button>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleSaveDraft}
                    disabled={submitting}
                    className="px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-medium text-sm transition cursor-pointer"
                  >
                    Save as Draft
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-8 py-3 rounded-full bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-300 hover:to-orange-300 text-black font-bold text-sm transition shadow-[0_0_25px_rgba(251,188,4,0.3)] disabled:opacity-50 cursor-pointer"
                  >
                    {submitting ? "Submitting..." : "Submit Idea Proposal 🚀"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </form>
      </main>

      {/* Success Modal */}
      {successModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-md bg-[#121216] border border-white/15 rounded-3xl p-8 text-center text-white shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-green-500/20 border border-green-500/30 text-green-400 flex items-center justify-center text-2xl mx-auto mb-4 animate-bounce">
              ✓
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">
              Proposal Submitted!
            </h3>
            <p className="text-xs text-neutral-300 mb-6 leading-relaxed">
              Your idea proposal for <span className="text-amber-400 font-semibold">{projectTitle || "DevJams '26"}</span> has been successfully registered. You can monitor evaluation status and update details from your dashboard.
            </p>
            <div className="flex flex-col gap-2.5">
              <Link
                href="/portal/dashboard"
                className="w-full py-3 rounded-full bg-amber-400 hover:bg-amber-300 text-black font-bold text-sm transition"
              >
                Go to My Dashboard
              </Link>
              <Link
                href="/"
                className="w-full py-2.5 rounded-full bg-white/10 hover:bg-white/15 text-white text-xs font-medium transition"
              >
                Return to Home
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
