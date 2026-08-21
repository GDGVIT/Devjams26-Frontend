"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { portalApi, type TrackType } from "@/services/portalApi";

interface CreateTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateTeamModal({ isOpen, onClose }: CreateTeamModalProps) {
  const router = useRouter();
  const [teamName, setTeamName] = useState("");
  const [track, setTrack] = useState<TrackType>("web");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamName.trim()) {
      setError("Please enter a team name.");
      return;
    }

    setLoading(true);
    try {
      await portalApi.createTeam(teamName.trim(), []);
      router.push("/team");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to create team.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div
        className="relative w-full max-w-md bg-[#141418] border border-white/15 rounded-3xl p-6 sm:p-8 text-white shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 text-neutral-400 hover:text-white transition-colors w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-lg cursor-pointer"
        >
          ✕
        </button>

        <div className="text-center mb-6">
          <h3 className="text-2xl font-medium tracking-tight text-white">
            Create Your Hackathon Team
          </h3>
          <p className="text-xs text-neutral-400 mt-1">
            You will be designated as the Team Leader.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-normal text-neutral-300 mb-1.5">
              Team Name
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
            <label className="block text-xs font-normal text-neutral-300 mb-1.5">
              Primary Track Domain
            </label>
            <select
              value={track}
              onChange={(e) => setTrack(e.target.value as TrackType)}
              className="w-full px-4 py-2.5 rounded-xl bg-[#222228] border border-white/10 text-white text-sm focus:outline-none focus:border-amber-400 transition cursor-pointer"
            >
              <option value="android">Android Development</option>
              <option value="web">Web Development</option>
              <option value="gemini">AI / ML & Gemini</option>
              <option value="cloud">Cloud & DevOps</option>
              <option value="open-innovation">Open Innovation</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 px-4 rounded-full bg-[#2A2A2E]/90 text-white border border-white/10 font-normal text-sm transition-colors duration-200 shadow-[0_4px_20px_rgba(0,0,0,0.5)] disabled:opacity-50 cursor-pointer"
          >
            {loading ? "Creating Team..." : "Create Team & Continue to Proposal 🚀"}
          </button>
        </form>
      </div>
    </div>
  );
}
