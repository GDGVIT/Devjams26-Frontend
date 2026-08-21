"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "../../components/gsap-motion";
import { portalApi, type UserSession } from "@/services/portalApi";

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      const token = portalApi.getToken();
      if (!token && !portalApi.getSession()) {
        router.push("/portal");
        return;
      }

      try {
        const me = await portalApi.fetchMe();
        if (me) {
          setProfile(me);
        } else {
          setProfile(portalApi.getSession());
        }
      } catch (err: unknown) {
        console.warn("Failed to fetch profile:", err);
        setProfile(portalApi.getSession());
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [router]);

  const handleLogout = () => {
    portalApi.logout();
    router.push("/portal");
  };

  const isCheckedIn = profile?.isCheckedIn;

  const profileFields = profile?.participantType === "external"
    ? [
        ["Gender", profile?.gender],
        ["College Name", profile?.collegeName],
        ["College Address", profile?.collegeAddress],
        ["College Roll Number", profile?.collegeRollNumber],
      ]
    : [
        ["Hostel Block", profile?.hostelBlock],
        ["Room Number", profile?.roomNumber],
      ];

  return (
    <div className="relative min-h-screen w-full bg-black text-white flex flex-col items-center justify-start select-none overflow-x-hidden pb-20">
      {/* Top Floating Graphics Banner: Left (notebookllm + cursor), Center (antigravity + folder), Right (maps + four-petal) */}
      <div
        className="absolute top-0 left-0 right-0 w-full pointer-events-none z-10 select-none overflow-visible"
        aria-hidden="true"
      >
        {/* 1. Left Pair (Align Top-Left Corner with Bleed) */}
        <div className="absolute left-0 -top-2 sm:-top-5 flex items-center justify-start">
          <div
            className="relative h-[clamp(75px,11vw,140px)] w-auto aspect-[176/120] flex items-center justify-center -ml-4 sm:-ml-8"
            style={{
              mixBlendMode: "screen",
              filter: "brightness(1.15) saturate(1.05)",
            }}
          >
            <Image
              src="/assets/baked/notebookllm.png"
              alt="NotebookLLM"
              width={176}
              height={120}
              priority
              className="w-full h-full object-contain"
            />
          </div>
          <div
            className="relative h-[clamp(75px,11vw,140px)] w-auto aspect-[41/53] flex items-center justify-center -ml-[30%]"
            style={{
              mixBlendMode: "screen",
              filter: "brightness(1.15) saturate(1.05)",
            }}
          >
            <Image
              src="/assets/baked/cursor.png"
              alt="Cursor"
              width={171}
              height={221}
              priority
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        {/* 2. Center Pair (Align Top-Center) */}
        <div className="absolute left-1/2 -translate-x-1/2 top-0 sm:top-1 flex items-center justify-center">
          <div
            className="relative h-[clamp(75px,11vw,140px)] w-auto aspect-[299/276] flex items-center justify-center"
            style={{
              mixBlendMode: "screen",
              filter: "brightness(1.12) saturate(1.05)",
            }}
          >
            <Image
              src="/assets/antigravity.svg"
              alt="Antigravity"
              width={299}
              height={276}
              priority
              className="w-full h-full object-contain"
            />
          </div>
          <div
            className="relative h-[clamp(75px,11vw,140px)] w-auto aspect-[149/121] flex items-center justify-center -ml-[30%]"
            style={{
              mixBlendMode: "screen",
              filter: "brightness(1.12) saturate(1.05)",
            }}
          >
            <Image
              src="/assets/folder.svg"
              alt="Folder"
              width={149}
              height={121}
              priority
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        {/* 3. Right Pair (Align Top-Right Corner with Bleed) */}
        <div className="absolute right-0 -top-2 sm:-top-5 flex items-center justify-end">
          <div
            className="relative h-[clamp(75px,11vw,140px)] w-auto aspect-[365/465] flex items-center justify-center"
            style={{
              mixBlendMode: "screen",
              filter: "brightness(1.15) saturate(1.05)",
            }}
          >
            <Image
              src="/assets/baked/maps.png"
              alt="Maps"
              width={165}
              height={210}
              priority
              className="w-full h-full object-contain"
            />
          </div>
          <div
            className="relative h-[clamp(75px,11vw,140px)] w-auto aspect-square flex items-center justify-center -ml-[30%] -mr-4 sm:-mr-8"
            style={{
              mixBlendMode: "screen",
              filter: "brightness(1.15) saturate(1.05)",
            }}
          >
            <Image
              src="/assets/four-petal.png"
              alt="Four Petal"
              width={153}
              height={194}
              priority
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      </div>

      {/* Main Content Container (Semantic Main) */}
      <main className="w-full max-w-[1072px] mx-auto flex flex-col items-start gap-[clamp(18px,3vh,36px)] z-20 pt-[clamp(75px,11vw,155px)] px-4 sm:px-6 md:px-0">
        <div className="w-full flex items-center justify-between">
          <h1
            className="text-white font-bold tracking-normal leading-[1.2] text-left capitalize m-0 select-none text-[clamp(36px,4.5vw,64px)]"
            style={{
              fontFamily: "var(--font-google-sans), 'Google Sans', sans-serif",
            }}
          >
            Profile Page
          </h1>

          <button
            type="button"
            onClick={handleLogout}
            className="px-4 py-1.5 rounded-full bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-xs sm:text-sm font-medium transition cursor-pointer"
          >
            Sign Out
          </button>
        </div>

        {/* Section 1: Contact Details */}
        <div className="w-full flex flex-col items-start gap-2.5 sm:gap-6">
          <h2
            className="text-white font-normal capitalize text-[clamp(24px,3.5vw,48px)] leading-[1.3] m-0"
            style={{
              fontFamily: "var(--font-google-sans), 'Google Sans', sans-serif",
            }}
          >
            Contact Details
          </h2>

          {/* Row 1: Name & Email Address */}
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-14">
            {/* Name Field */}
            <div className="w-full flex flex-col items-start gap-2">
              <label
                className="text-white font-normal capitalize text-[clamp(16px,2vw,32px)] leading-[1.3]"
                style={{
                  fontFamily: "var(--font-google-sans), 'Google Sans', sans-serif",
                }}
              >
                Name
              </label>
              <div
                className="w-full bg-[#343434] text-white/90 rounded-[4px] sm:rounded-[8px] px-3.5 sm:px-6 py-2 sm:py-3.5 min-h-[32px] sm:min-h-[56px] h-[32px] sm:h-[56px] flex items-center text-[clamp(12px,1.6vw,22px)] font-normal select-text"
                style={{
                  fontFamily: "var(--font-google-sans), 'Google Sans', sans-serif",
                }}
              >
                {loading ? "Loading..." : profile?.name || "Participant"}
              </div>
            </div>

            {/* Email Address Field */}
            <div className="w-full flex flex-col items-start gap-2">
              <label
                className="text-white font-normal capitalize text-[clamp(16px,2vw,32px)] leading-[1.3]"
                style={{
                  fontFamily: "var(--font-google-sans), 'Google Sans', sans-serif",
                }}
              >
                Email Address
              </label>
              <div
                className="w-full bg-[#343434] text-white/90 rounded-[4px] sm:rounded-[8px] px-3.5 sm:px-6 py-2 sm:py-3.5 min-h-[32px] sm:min-h-[56px] h-[32px] sm:h-[56px] flex items-center text-[clamp(12px,1.6vw,22px)] font-normal select-text truncate"
                style={{
                  fontFamily: "var(--font-google-sans), 'Google Sans', sans-serif",
                }}
              >
                {loading ? "Loading..." : profile?.email || "N/A"}
              </div>
            </div>
          </div>

          {/* Row 2: Internal registration number and gender, followed by mobile */}
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-14 mt-1 sm:mt-2">
            {profile?.participantType === "internal" && (
              <div className="w-full flex flex-col items-start gap-2">
                <label
                  className="text-white font-normal capitalize text-[clamp(16px,2vw,32px)] leading-[1.3]"
                  style={{
                    fontFamily: "var(--font-google-sans), 'Google Sans', sans-serif",
                  }}
                >
                  Registration Number
                </label>
                <div
                  className="w-full bg-[#343434] text-white/90 rounded-[4px] sm:rounded-[8px] px-3.5 sm:px-6 py-2 sm:py-3.5 min-h-[32px] sm:min-h-[56px] h-[32px] sm:h-[56px] flex items-center text-[clamp(12px,1.6vw,22px)] font-normal select-text"
                  style={{
                    fontFamily: "var(--font-google-sans), 'Google Sans', sans-serif",
                  }}
                >
                  {loading ? "Loading..." : profile.registrationNumber || "N/A"}
                </div>
              </div>
            )}
            {profile?.participantType === "internal" && (
              <div className="w-full flex flex-col items-start gap-2">
                <label
                  className="text-white font-normal capitalize text-[clamp(16px,2vw,32px)] leading-[1.3]"
                  style={{
                    fontFamily: "var(--font-google-sans), 'Google Sans', sans-serif",
                  }}
                >
                  Gender
                </label>
                <div
                  className="w-full bg-[#343434] text-white/90 rounded-[4px] sm:rounded-[8px] px-3.5 sm:px-6 py-2 sm:py-3.5 min-h-[32px] sm:min-h-[56px] h-[32px] sm:h-[56px] flex items-center text-[clamp(12px,1.6vw,22px)] font-normal select-text"
                  style={{
                    fontFamily: "var(--font-google-sans), 'Google Sans', sans-serif",
                  }}
                >
                  {loading ? "Loading..." : profile.gender || "N/A"}
                </div>
              </div>
            )}

            {/* Phone Field */}
            <div className="w-full flex flex-col items-start gap-2 md:col-span-2">
              <label
                className="text-white font-normal capitalize text-[clamp(16px,2vw,32px)] leading-[1.3]"
                style={{
                  fontFamily: "var(--font-google-sans), 'Google Sans', sans-serif",
                }}
              >
                Phone Number
              </label>
              <div
                className="w-full bg-[#343434] text-white/90 rounded-[4px] sm:rounded-[8px] px-3.5 sm:px-6 py-2 sm:py-3.5 min-h-[32px] sm:min-h-[56px] h-[32px] sm:h-[56px] flex items-center text-[clamp(12px,1.6vw,22px)] font-normal select-text"
                style={{
                  fontFamily: "var(--font-google-sans), 'Google Sans', sans-serif",
                }}
              >
                {loading ? "Loading..." : profile?.phone || "N/A"}
              </div>
            </div>
          </div>

          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-14 mt-1 sm:mt-2">
            {profileFields.map(([label, value]) => (
              <div key={label} className="w-full flex flex-col items-start gap-2">
                <label
                  className="text-white font-normal capitalize text-[clamp(16px,2vw,32px)] leading-[1.3]"
                  style={{
                    fontFamily: "var(--font-google-sans), 'Google Sans', sans-serif",
                  }}
                >
                  {label}
                </label>
                <div
                  className="w-full bg-[#343434] text-white/90 rounded-[4px] sm:rounded-[8px] px-3.5 sm:px-6 py-2 sm:py-3.5 min-h-[32px] sm:min-h-[56px] h-[32px] sm:h-[56px] flex items-center text-[clamp(12px,1.6vw,22px)] font-normal select-text"
                  style={{
                    fontFamily: "var(--font-google-sans), 'Google Sans', sans-serif",
                  }}
                >
                  {loading ? "Loading..." : value || "N/A"}
                </div>
              </div>
            ))}
          </div>

          {/* Row 4: Team Name & Team Code */}
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-14 mt-1 sm:mt-2">
            {/* Team Name Field */}
            <div className="w-full flex flex-col items-start gap-2">
              <label
                className="text-white font-normal capitalize text-[clamp(16px,2vw,32px)] leading-[1.3]"
                style={{
                  fontFamily: "var(--font-google-sans), 'Google Sans', sans-serif",
                }}
              >
                Team Name
              </label>
              <div
                className="w-full bg-[#343434] text-white/90 rounded-[4px] sm:rounded-[8px] px-3.5 sm:px-6 py-2 sm:py-3.5 min-h-[32px] sm:min-h-[56px] h-[32px] sm:h-[56px] flex items-center text-[clamp(12px,1.6vw,22px)] font-normal select-text"
                style={{
                  fontFamily: "var(--font-google-sans), 'Google Sans', sans-serif",
                }}
              >
                {loading ? "Loading..." : profile?.teamName || "Not in team"}
              </div>
            </div>

            {/* Team Code Field */}
            <div className="w-full flex flex-col items-start gap-2">
              <label
                className="text-white font-normal capitalize text-[clamp(16px,2vw,32px)] leading-[1.3]"
                style={{
                  fontFamily: "var(--font-google-sans), 'Google Sans', sans-serif",
                }}
              >
                Team Code
              </label>
              <div
                className="w-full bg-[#343434] text-white/90 rounded-[4px] sm:rounded-[8px] px-3.5 sm:px-6 py-2 sm:py-3.5 min-h-[32px] sm:min-h-[56px] h-[32px] sm:h-[56px] flex items-center text-[clamp(12px,1.6vw,22px)] font-normal select-text"
                style={{
                  fontFamily: "var(--font-google-sans), 'Google Sans', sans-serif",
                }}
              >
                {loading ? "Loading..." : profile?.teamId || "N/A"}
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Attendance History */}
        <div className="w-full flex flex-col items-start gap-2.5 sm:gap-5 mt-1 sm:mt-2">
          <h2
            className="text-white font-normal capitalize text-[clamp(24px,3.5vw,48px)] leading-[1.3] m-0"
            style={{
              fontFamily: "var(--font-google-sans), 'Google Sans', sans-serif",
            }}
          >
            Attendance History
          </h2>

          {/* Attendance Rows Stack */}
          <div className="w-full max-w-[580px] flex flex-col items-start gap-2.5 sm:gap-3">
            {/* 1. Overall Status */}
            <div
              className="w-full bg-[#343434] text-white/90 rounded-[4px] sm:rounded-[8px] px-3.5 sm:px-6 py-2 sm:py-3.5 min-h-[32px] sm:min-h-[56px] h-[32px] sm:h-[56px] flex items-center justify-between text-[clamp(12px,1.6vw,20px)] font-normal"
              style={{
                fontFamily: "var(--font-google-sans), 'Google Sans', sans-serif",
              }}
            >
              <span>Hackathon Check-in</span>
              <span
                className={`text-xs sm:text-sm px-2.5 py-1 rounded-full font-medium ${
                  isCheckedIn
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                    : "bg-amber-500/15 text-amber-400 border border-amber-500/25"
                }`}
              >
                {isCheckedIn ? "Checked In" : "Pending Scan"}
              </span>
            </div>

            {/* 2. Morning Session */}
            <div
              className="w-full bg-[#343434] text-white/90 rounded-[4px] sm:rounded-[8px] px-3.5 sm:px-6 py-2 sm:py-3.5 min-h-[32px] sm:min-h-[56px] h-[32px] sm:h-[56px] flex items-center justify-between text-[clamp(12px,1.6vw,20px)] font-normal"
              style={{
                fontFamily: "var(--font-google-sans), 'Google Sans', sans-serif",
              }}
            >
              <span>Morning Session</span>
              <span
                className={`text-xs sm:text-sm px-2.5 py-1 rounded-full font-medium ${
                  isCheckedIn
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                    : "bg-neutral-600/30 text-neutral-400 border border-neutral-600/40"
                }`}
              >
                {isCheckedIn ? "Present" : "Pending"}
              </span>
            </div>

            {/* 3. Evening Session */}
            <div
              className="w-full bg-[#343434] text-white/90 rounded-[4px] sm:rounded-[8px] px-3.5 sm:px-6 py-2 sm:py-3.5 min-h-[32px] sm:min-h-[56px] h-[32px] sm:h-[56px] flex items-center justify-between text-[clamp(12px,1.6vw,20px)] font-normal"
              style={{
                fontFamily: "var(--font-google-sans), 'Google Sans', sans-serif",
              }}
            >
              <span>Evening Session</span>
              <span
                className={`text-xs sm:text-sm px-2.5 py-1 rounded-full font-medium ${
                  isCheckedIn
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                    : "bg-neutral-600/30 text-neutral-400 border border-neutral-600/40"
                }`}
              >
                {isCheckedIn ? "Present" : "Pending"}
              </span>
            </div>
          </div>
        </div>

        {/* Section 3: Back Button */}
        <div className="pt-2">
          <motion.button
            type="button"
            onClick={() => router.back()}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="bg-white text-black font-medium text-[clamp(12px,1.6vw,20px)] rounded-full px-5 sm:px-7 py-1.5 sm:py-2.5 flex items-center justify-center gap-2 cursor-pointer border-none shadow-md hover:bg-neutral-100 transition-all"
            style={{
              fontFamily: "var(--font-google-sans), 'Google Sans', sans-serif",
              minWidth: "95px",
              height: "36px",
            }}
          >
            {/* Back Arrow Vector (←) */}
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
          </motion.button>
        </div>
      </main>
    </div>
  );
}
