"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { portalApi } from "../../services/portalApi";

interface InternalAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function InternalAuthModal({ isOpen, onClose, onSuccess }: InternalAuthModalProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [regNo, setRegNo] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate VIT Email
    const cleanedEmail = email.trim().toLowerCase();
    if (!cleanedEmail) {
      setError("Please enter your VIT student email address.");
      return;
    }
    if (!cleanedEmail.endsWith("@vitstudent.ac.in") && !cleanedEmail.endsWith("@vit.ac.in")) {
      setError("Please use your official VIT email (@vitstudent.ac.in or @vit.ac.in).");
      return;
    }

    setLoading(true);
    try {
      await portalApi.loginInternal({
        email: cleanedEmail,
        registrationNumber: regNo.trim().toUpperCase(),
        password: password,
      });

      if (onSuccess) {
        onSuccess();
      } else {
        router.push("/portal/submit");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to sign in. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleVITLogin = async () => {
    setLoading(true);
    setError("");
    try {
      // In production with OAuth, this triggers the VIT Google SSO
      await portalApi.loginInternal({
        email: email.trim().toLowerCase() || "student@vitstudent.ac.in",
        registrationNumber: regNo.trim().toUpperCase() || "23BCE1001",
      });
      if (onSuccess) {
        onSuccess();
      } else {
        router.push("/portal/submit");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Google sign-in failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-md bg-[#121214] border border-white/15 rounded-3xl p-6 sm:p-8 text-white shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-gradient-to-b from-blue-500/20 to-transparent blur-2xl pointer-events-none" />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 text-neutral-400 hover:text-white transition-colors w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-lg"
          aria-label="Close modal"
        >
          ✕
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            VIT Student Portal
          </div>
          <h3 className="text-2xl font-bold tracking-tight text-white">
            Internal Participant Login
          </h3>
          <p className="text-sm text-neutral-400 mt-1">
            Sign in with your official VIT student credentials
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* Google SSO Button */}
        <button
          type="button"
          onClick={handleGoogleVITLogin}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-full bg-white text-black font-semibold text-sm hover:bg-neutral-100 transition shadow-[0_0_20px_rgba(255,255,255,0.15)] disabled:opacity-50 mb-5 cursor-pointer"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
            />
            <path
              fill="#FBBC05"
              d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
            />
            <path
              fill="#EA4335"
              d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
            />
          </svg>
          Continue with VIT Google Account
        </button>

        <div className="relative flex items-center justify-center my-4">
          <div className="border-t border-white/10 w-full" />
          <span className="bg-[#121214] px-3 text-xs text-neutral-500 uppercase tracking-wider">
            or enter details
          </span>
          <div className="border-t border-white/10 w-full" />
        </div>

        {/* Credentials Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1.5">
              VIT Email Address
            </label>
            <input
              type="email"
              placeholder="e.g. yourname.2023@vitstudent.ac.in"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-blue-500 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1.5">
              Registration Number
            </label>
            <input
              type="text"
              placeholder="e.g. 23BCE1001"
              value={regNo}
              onChange={(e) => setRegNo(e.target.value.toUpperCase())}
              required
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-blue-500 uppercase transition"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1.5">
              Password / Access Code
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-blue-500 transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 px-4 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-sm transition shadow-[0_0_20px_rgba(59,130,246,0.3)] disabled:opacity-50 cursor-pointer"
          >
            {loading ? "Signing in..." : "Sign In & Continue"}
          </button>
        </form>
      </div>
    </div>
  );
}
