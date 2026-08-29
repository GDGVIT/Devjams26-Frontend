"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "../gsap-motion";
import { HeroLogo } from "../hero/HeroLogo";
import { HeroTrackIcons } from "../hero/HeroTrackIcons";
import { portalAuthErrorMessage } from "../../app/portal-auth-state";
import { nextPortalRoute, portalApi } from "../../services/portalApi";
import { GDGLockup } from "./GDGLockup";

export function PortalLogin() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  // Which button was clicked. `loading` disables both so a second click cannot
  // start a competing redirect, but only the chosen one should say it is busy.
  const [pendingType, setPendingType] = useState<"internal" | "external" | null>(null);
  const [error, setError] = useState("");
  const callbackHandled = useRef(false);

  useEffect(() => {
    const parameters = new URLSearchParams(window.location.search);
    const requestedRedirect = parameters.get("redirect");
    if (requestedRedirect) {
      portalApi.rememberLoginRedirect(requestedRedirect);
    }
    const oauthCode = parameters.get("oauth_code");
    const authError = parameters.get("auth_error");

    if (authError || oauthCode) {
      if (callbackHandled.current) return;
      callbackHandled.current = true;
      window.history.replaceState(null, "", window.location.pathname);

      if (authError) {
        void Promise.resolve().then(() => setError(portalAuthErrorMessage(authError)));
        return;
      }

      if (!oauthCode) return;

      void Promise.resolve().then(() => setLoading(true));
      portalApi
        .completeGoogleLogin(oauthCode)
        .then((session) => {
          const redirect = portalApi.getLoginRedirect();
          portalApi.clearLoginRedirect();
          router.replace(redirect ?? nextPortalRoute(session));
        })
        .catch((reason: unknown) => {
          setError(reason instanceof Error ? reason.message : "Google sign-in could not be completed.");
          setLoading(false);
        });
      return;
    }

    const restoreSession = async () => {
      if (!portalApi.getToken()) return;
      try {
        const session = await portalApi.fetchMe();
        if (session) {
          const redirect = portalApi.getLoginRedirect();
          portalApi.clearLoginRedirect();
          router.replace(redirect ?? nextPortalRoute(session));
        }
      } catch {
        portalApi.logout();
      }
    };
    void restoreSession();
  }, [router]);

  const beginGoogleLogin = (type: "internal" | "external") => {
    setError("");
    const requestedRedirect = new URLSearchParams(window.location.search).get("redirect");
    if (requestedRedirect) {
      portalApi.rememberLoginRedirect(requestedRedirect);
    }
    setPendingType(type);
    setLoading(true);
    window.location.assign(portalApi.googleOAuthStartUrl(type));
  };


  return (
    <main className="relative min-h-screen w-full bg-black text-white flex flex-col items-center justify-center overflow-hidden px-4 py-8 select-none">
      {/* Top Left GDG Lockup */}
      <header
        className="absolute top-6 md:top-8 left-[clamp(20px,5vw,60px)] z-40"
        aria-label="Google Developer Groups"
      >
        <GDGLockup />
      </header>

      <div className="absolute -top-32 -left-32 w-[520px] h-[520px] bg-gradient-to-br from-amber-600/20 via-orange-600/10 to-transparent rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-[580px] h-[580px] bg-gradient-to-tl from-emerald-600/15 via-yellow-600/10 to-transparent rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-blue-900/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="relative z-20 flex flex-col items-center justify-center w-full max-w-5xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-white text-2xl sm:text-3xl md:text-4xl font-medium tracking-tight mb-2 sm:mb-4 text-center z-30"
          style={{ fontFamily: '"Google Sans", var(--font-google-sans), sans-serif' }}
        >
          Login
        </motion.h1>

        <div className="relative w-full flex flex-col items-center justify-center my-2 sm:my-6 overflow-visible px-4 sm:px-6 md:px-8">
          <HeroLogo />
          <HeroTrackIcons />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
          className="relative z-30 mt-5 sm:mt-8 md:mt-10 flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-6 w-full px-4 max-w-5xl"
        >
          <div className="w-full sm:w-auto flex justify-center">
            <motion.button
              type="button"
              disabled={loading}
              onClick={() => beginGoogleLogin("internal")}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="group w-full max-w-[266px] sm:max-w-none sm:w-auto sm:min-w-[340px] md:min-w-[420px] h-7 sm:h-[58px] md:h-[64px] px-3 sm:px-10 rounded-full bg-[#343434] text-white border border-white/10 font-normal flex items-center justify-center gap-2 sm:gap-4 transition-colors duration-200 shadow-[0_4px_20px_rgba(0,0,0,0.5)] cursor-pointer select-none text-[12px] sm:text-[18px] md:text-[22.5px] disabled:opacity-60"
              style={{ fontFamily: '"Google Sans", var(--font-google-sans), sans-serif' }}
            >
              <span className="whitespace-nowrap">{pendingType === "internal" ? "Redirecting to Google..." : "Continue As Internal Participant"}</span>
              <svg className="w-3.5 h-3.5 sm:w-5 sm:h-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M7 17L17 7M17 7H9M17 7V15" />
              </svg>
            </motion.button>
          </div>

          <span className="text-white font-medium text-base sm:text-xl md:text-[22.5px] px-1 select-none leading-none my-0.5 sm:my-0" style={{ fontFamily: '"Google Sans", var(--font-google-sans), sans-serif' }}>
            or
          </span>

          <div className="w-full sm:w-auto flex justify-center">
            <motion.button
              type="button"
              disabled={loading}
              onClick={() => beginGoogleLogin("external")}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="group w-full max-w-[266px] sm:max-w-none sm:w-auto sm:min-w-[340px] md:min-w-[420px] h-7 sm:h-[58px] md:h-[64px] px-3 sm:px-10 rounded-full bg-white hover:bg-neutral-200 text-black border-none font-normal flex items-center justify-center gap-2 sm:gap-4 transition-colors duration-200 shadow-[0_4px_20px_rgba(0,0,0,0.5)] cursor-pointer select-none text-[12px] sm:text-[18px] md:text-[22.5px] disabled:opacity-60"
              style={{ fontFamily: '"Google Sans", var(--font-google-sans), sans-serif' }}
            >
              <span className="whitespace-nowrap">{pendingType === "external" ? "Redirecting to Google..." : "Continue As External Participant"}</span>
              <svg className="w-3.5 h-3.5 sm:w-5 sm:h-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M7 17L17 7M17 7H9M17 7V15" />
              </svg>
            </motion.button>
          </div>
        </motion.div>
      </div>

    </main>
  );
}
