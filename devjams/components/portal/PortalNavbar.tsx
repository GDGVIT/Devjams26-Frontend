"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { portalApi, type UserSession } from "../../services/portalApi";

export function PortalNavbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [session, setSession] = useState<UserSession | null>(null);

  useEffect(() => {
    setSession(portalApi.getSession());
  }, []);

  const handleLogout = () => {
    portalApi.logout();
    router.push("/portal");
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-black/70 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Lockup */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-xl font-bold tracking-tight text-white group-hover:text-amber-400 transition-colors">
              DevJams<span className="text-amber-400">’26</span>
            </span>
            <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-white/10 text-neutral-300 text-[11px] font-medium border border-white/10">
              Idea Portal
            </span>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              href="/portal/submit"
              className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                pathname === "/portal/submit"
                  ? "bg-white/15 text-white"
                  : "text-neutral-400 hover:text-white hover:bg-white/5"
              }`}
            >
              Submit Proposal
            </Link>
            <Link
              href="/portal/dashboard"
              className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                pathname === "/portal/dashboard"
                  ? "bg-white/15 text-white"
                  : "text-neutral-400 hover:text-white hover:bg-white/5"
              }`}
            >
              My Dashboard
            </Link>
            <Link
              href="/#tracks"
              className="px-3.5 py-1.5 rounded-lg text-sm font-medium text-neutral-400 hover:text-white hover:bg-white/5 transition-colors"
            >
              Tracks & Themes
            </Link>
          </nav>
        </div>

        {/* User Info & Actions */}
        <div className="flex items-center gap-3">
          {session ? (
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-xs font-semibold text-white truncate max-w-[160px]">
                  {session.name}
                </span>
                <span className="text-[10px] text-neutral-400">
                  {session.participantType === "internal"
                    ? `VIT (${session.registrationNumber || "Internal"})`
                    : "External Developer"}
                </span>
              </div>

              <span
                className={`px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
                  session.participantType === "internal"
                    ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                    : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                }`}
              >
                {session.participantType}
              </span>

              <button
                type="button"
                onClick={handleLogout}
                className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-red-500/10 border border-white/10 hover:border-red-500/30 text-xs font-medium text-neutral-300 hover:text-red-400 transition-colors cursor-pointer"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <Link
              href="/portal"
              className="px-4 py-1.5 rounded-full bg-white text-black text-xs font-semibold hover:bg-neutral-200 transition"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
