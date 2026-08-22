"use client";

import { useEffect } from "react";
import { AlertCircle, ExternalLink, ArrowRight, X } from "lucide-react";
import { motion, AnimatePresence } from "../gsap-motion";

export { GRAVITAS_PORTAL_URL } from "@/app/gravitas-notice";
import { GRAVITAS_PORTAL_URL } from "@/app/gravitas-notice";

export interface GravitasNoticeModalProps {
  isOpen: boolean;
  participantType: "internal" | "external" | null;
  onClose: () => void;
  onProceed: () => void;
  loading?: boolean;
}

export function GravitasNoticeModal({
  isOpen,
  participantType,
  onClose,
  onProceed,
  loading = false,
}: GravitasNoticeModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="gravitas-modal-title"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
            className="relative z-10 w-full max-w-lg bg-[#141418] border border-white/15 rounded-3xl p-6 sm:p-8 text-white shadow-[0_0_60px_rgba(0,0,0,0.85)] flex flex-col gap-5 overflow-hidden"
          >
            {/* Top Ambient Glow */}
            <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-64 h-32 bg-gradient-to-b from-amber-500/20 via-orange-500/10 to-transparent blur-2xl pointer-events-none" />

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="absolute top-5 right-5 text-neutral-400 hover:text-white transition-colors w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center cursor-pointer"
              aria-label="Close dialog"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header / Badge */}
            <div className="flex flex-col items-start gap-3">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/25 text-amber-300 text-xs font-medium">
                  <AlertCircle className="w-3.5 h-3.5" />
                  Gravitas Registration Required
                </span>
                {participantType && (
                  <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-neutral-300 text-xs font-normal">
                    {participantType === "internal" ? "Internal VIT" : "External"}
                  </span>
                )}
              </div>

              <h2
                id="gravitas-modal-title"
                className="text-xl sm:text-2xl font-bold tracking-tight text-white m-0"
                style={{
                  fontFamily: '"Google Sans", var(--font-google-sans), sans-serif',
                }}
              >
                Register on Gravitas First
              </h2>
            </div>

            {/* Explanatory Content */}
            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed m-0">
              Before submitting your idea or forming a team on this portal, you must first be registered for the <strong className="text-white">DevJams &apos;26</strong> event on the official <strong className="text-white">Gravitas portal</strong>.
            </p>

            {/* Two-step Walkthrough */}
            <div className="flex flex-col gap-2.5 text-xs sm:text-sm">
              {/* Step 1 */}
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex flex-col gap-2">
                <div className="flex items-center gap-2 font-medium text-amber-300">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-amber-400/20 text-xs font-bold text-amber-400">
                    1
                  </span>
                  <span>Register for DevJams on Gravitas</span>
                </div>
                <p className="text-xs text-neutral-400 pl-7 m-0">
                  Visit <span className="text-neutral-200 underline font-mono">gravitas.vit.ac.in</span>, navigate to the DevJams event link, and complete your registration.
                </p>
                <div className="pl-7 pt-1">
                  <a
                    href={GRAVITAS_PORTAL_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-400 hover:bg-amber-300 text-black font-semibold text-xs transition shadow-sm"
                  >
                    <span>Visit gravitas.vit.ac.in</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Step 2 */}
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex flex-col gap-1.5">
                <div className="flex items-center gap-2 font-medium text-emerald-300">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-400/20 text-xs font-bold text-emerald-400">
                    2
                  </span>
                  <span>Sign In &amp; Create Idea Submission</span>
                </div>
                <p className="text-xs text-neutral-400 pl-7 m-0">
                  Once registered on Gravitas, sign in with Google to create or join your team and submit your project proposal.
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs sm:text-sm font-medium transition cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={loading}
                onClick={onProceed}
                className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-white hover:bg-neutral-100 text-black text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition shadow-md disabled:opacity-60 cursor-pointer"
                style={{
                  fontFamily: '"Google Sans", var(--font-google-sans), sans-serif',
                }}
              >
                <span>{loading ? "Redirecting..." : "I've Registered — Continue with Google"}</span>
                {!loading && <ArrowRight className="w-4 h-4" />}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
