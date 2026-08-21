"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "@/components/gsap-motion";
import AssetImage from "@/components/AssetImage";
import { portalApi } from "@/services/portalApi";
const COUNTRY_CODES = [
  { code: "+91", country: "India", flag: "🇮🇳" },
  { code: "+1", country: "USA / Canada", flag: "🇺🇸" },
  { code: "+44", country: "UK", flag: "🇬🇧" },
  { code: "+61", country: "Australia", flag: "🇦🇺" },
  { code: "+65", country: "Singapore", flag: "🇸🇬" },
  { code: "+971", country: "UAE", flag: "🇦🇪" },
  { code: "+49", country: "Germany", flag: "🇩🇪" },
  { code: "+33", country: "France", flag: "🇫🇷" },
  { code: "+81", country: "Japan", flag: "🇯🇵" },
  { code: "+86", country: "China", flag: "🇨🇳" },
  { code: "+966", country: "Saudi Arabia", flag: "🇸🇦" },
  { code: "+60", country: "Malaysia", flag: "🇲🇾" },
  { code: "+62", country: "Indonesia", flag: "🇮🇩" },
  { code: "+880", country: "Bangladesh", flag: "🇧🇩" },
  { code: "+94", country: "Sri Lanka", flag: "🇱🇰" },
  { code: "+977", country: "Nepal", flag: "🇳🇵" },
];

export default function OnboardingPage() {
  const router = useRouter();

  // Form State matching the reference screenshot (lazy initialized from stored data)
  const [name, setName] = useState(() => portalApi.getInternalOnboarding()?.name || "");
  const [registrationNumber, setRegistrationNumber] = useState(() => portalApi.getInternalOnboarding()?.registrationNumber || "");
  const [countryCode, setCountryCode] = useState("+91");
  const [contactNumber, setContactNumber] = useState(() => {
    const existing = portalApi.getInternalOnboarding()?.contactNumber || "";
    return existing.replace(/^\+\d+\s*/, "");
  });
  const [email, setEmail] = useState(() => portalApi.getInternalOnboarding()?.email || "");
  const [gender, setGender] = useState(() => portalApi.getInternalOnboarding()?.gender || "");
  const [hostelBlock, setHostelBlock] = useState(() => portalApi.getInternalOnboarding()?.hostelBlock || "");
  const [roomNumber, setRoomNumber] = useState(() => portalApi.getInternalOnboarding()?.roomNumber || "");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }

    // Reg No validation: 2 digits, 3 letters (case-insensitive), 4 digits (e.g. 25BCE2055)
    const regNoPattern = /^[0-9]{2}[A-Za-z]{3}[0-9]{4}$/;
    if (!regNoPattern.test(registrationNumber.trim())) {
      setError("Registration Number must be 2 digits, 3 letters, and 4 digits (e.g. 25BCE2055).");
      return;
    }

    const cleanPhone = contactNumber.trim().replace(/\D/g, "");
    if (!cleanPhone || cleanPhone.length < 7 || cleanPhone.length > 15) {
      setError("Please enter a valid contact number.");
      return;
    }

    // General email format validation (accepting any valid domain)
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!gender.trim()) {
      setError("Please select your gender.");
      return;
    }
    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    setLoading(true);
    try {
      await portalApi.saveInternalOnboarding({
        name: name.trim(),
        registrationNumber: registrationNumber.trim().toUpperCase(),
        contactNumber: `${countryCode} ${contactNumber.trim()}`,
        email: email.trim().toLowerCase(),
        gender: gender.trim(),
        hostelBlock: hostelBlock.trim(),
        roomNumber: roomNumber.trim(),
      });

      router.push("/portal/join-create");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to save onboarding details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen w-full bg-black text-white flex flex-col justify-between overflow-x-hidden p-4 sm:p-8 select-none">
      {/* Top-Left Web Graphic */}
      <div className="absolute -top-16 -left-16 sm:-top-20 sm:-left-20 w-36 h-36 sm:w-52 sm:h-52 md:w-64 md:h-64 pointer-events-none z-0 opacity-40 sm:opacity-70">
        <AssetImage
          src="/assets/web.svg"
          alt="Web Track Decoration"
          width={288}
          height={288}
          priority
          className="w-full h-full object-contain filter drop-shadow-[0_0_20px_rgba(66,133,244,0.3)]"
        />
      </div>

      {/* Top-Right Gear Graphic */}
      <div className="absolute -top-16 -right-16 sm:-top-20 sm:-right-20 w-40 h-40 sm:w-56 sm:h-56 md:w-72 md:h-72 pointer-events-none z-0 opacity-40 sm:opacity-70">
        <AssetImage
          src="/assets/gear.svg"
          alt="Gear Decoration"
          width={337}
          height={337}
          priority
          className="w-full h-full object-contain filter drop-shadow-[0_0_20px_rgba(251,188,4,0.3)]"
        />
      </div>

      {/* Main Container */}
      <div className="relative z-20 max-w-4xl w-full mx-auto my-auto py-6 sm:py-10">
        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl sm:text-4xl md:text-5xl font-medium text-center text-white mb-8 sm:mb-12 tracking-tight"
          style={{
            fontFamily: '"Google Sans", var(--font-google-sans), sans-serif',
          }}
        >
          Onboarding
        </motion.h1>

        {error && (
          <div className="mb-6 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs sm:text-sm flex items-center gap-2">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* Onboarding Form */}
        <form onSubmit={handleSubmit} className="space-y-8 sm:space-y-10">
          {/* SECTION 1: Personal Details */}
          <div className="space-y-3 sm:space-y-4">
            <h2
              className="text-xl sm:text-2xl font-medium text-white tracking-tight"
              style={{
                fontFamily: '"Google Sans", var(--font-google-sans), sans-serif',
              }}
            >
              Personal Details
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-sm sm:text-base font-normal text-white mb-2">
                  Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Neeraj"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-[#2D2D2D] hover:bg-[#333333] focus:bg-[#333333] border border-transparent focus:border-white/20 text-white placeholder-neutral-500 text-sm sm:text-base focus:outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm sm:text-base font-normal text-white mb-2">
                  Registration Number
                </label>
                <input
                  type="text"
                  placeholder="e.g. 25BCE2055"
                  value={registrationNumber}
                  onChange={(e) => setRegistrationNumber(e.target.value.toUpperCase().slice(0, 9))}
                  required
                  maxLength={9}
                  className="w-full px-4 py-3 rounded-xl bg-[#2D2D2D] hover:bg-[#333333] focus:bg-[#333333] border border-transparent focus:border-white/20 text-white placeholder-neutral-500 text-sm sm:text-base focus:outline-none transition-all uppercase"
                />
              </div>
            </div>
          </div>

          {/* SECTION 2: Contact Details */}
          <div className="space-y-3 sm:space-y-4">
            <h2
              className="text-xl sm:text-2xl font-medium text-white tracking-tight"
              style={{
                fontFamily: '"Google Sans", var(--font-google-sans), sans-serif',
              }}
            >
              Contact Details
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-sm sm:text-base font-normal text-white mb-2">
                  Contact Number
                </label>
                <div className="flex items-center gap-2">
                  <select
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    className="w-[125px] sm:w-[140px] px-3 py-3 rounded-xl bg-[#2D2D2D] hover:bg-[#333333] focus:bg-[#333333] border border-transparent focus:border-white/20 text-white text-sm sm:text-base focus:outline-none transition-all cursor-pointer flex-shrink-0"
                  >
                    {COUNTRY_CODES.map((c) => (
                      <option key={c.code} value={c.code} className="bg-[#1E1E22] text-white">
                        {c.flag} {c.code}
                      </option>
                    ))}
                  </select>
                  <input
                    type="tel"
                    placeholder="9876543210"
                    value={contactNumber}
                    onChange={(e) => setContactNumber(e.target.value.replace(/[^\d\s-]/g, ""))}
                    required
                    className="flex-1 px-4 py-3 rounded-xl bg-[#2D2D2D] hover:bg-[#333333] focus:bg-[#333333] border border-transparent focus:border-white/20 text-white placeholder-neutral-500 text-sm sm:text-base focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm sm:text-base font-normal text-white mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="e.g. neeraj@vitstudent.ac.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-[#2D2D2D] hover:bg-[#333333] focus:bg-[#333333] border border-transparent focus:border-white/20 text-white placeholder-neutral-500 text-sm sm:text-base focus:outline-none transition-all"
                />
              </div>
            </div>
          </div>

          {/* SECTION 3: Hostel Details */}
          <div className="space-y-3 sm:space-y-4">
            <h2
              className="text-xl sm:text-2xl font-medium text-white tracking-tight"
              style={{
                fontFamily: '"Google Sans", var(--font-google-sans), sans-serif',
              }}
            >
              Hostel Details
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              <div>
                <label className="block text-sm sm:text-base font-normal text-white mb-2">
                  Gender
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-[#2D2D2D] hover:bg-[#333333] focus:bg-[#333333] border border-transparent focus:border-white/20 text-white text-sm sm:text-base focus:outline-none transition-all cursor-pointer"
                >
                  <option value="" disabled className="bg-[#1E1E22] text-neutral-500">
                    Select Gender
                  </option>
                  <option value="Male" className="bg-[#1E1E22] text-white">
                    Male
                  </option>
                  <option value="Female" className="bg-[#1E1E22] text-white">
                    Female
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-sm sm:text-base font-normal text-white mb-2">
                  Hostel Block:
                </label>
                <input
                  type="text"
                  placeholder="e.g. D Block"
                  value={hostelBlock}
                  onChange={(e) => setHostelBlock(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[#2D2D2D] hover:bg-[#333333] focus:bg-[#333333] border border-transparent focus:border-white/20 text-white placeholder-neutral-500 text-sm sm:text-base focus:outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm sm:text-base font-normal text-white mb-2">
                  Room Number
                </label>
                <input
                  type="text"
                  placeholder="e.g. 402"
                  value={roomNumber}
                  onChange={(e) => setRoomNumber(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[#2D2D2D] hover:bg-[#333333] focus:bg-[#333333] border border-transparent focus:border-white/20 text-white placeholder-neutral-500 text-sm sm:text-base focus:outline-none transition-all"
                />
              </div>
            </div>
          </div>

          {/* Bottom Action CTA Button */}
          <div className="pt-6 sm:pt-8 flex justify-center">
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="group w-full sm:w-auto min-w-[320px] sm:min-w-[440px] md:min-w-[500px] h-[58px] sm:h-[64px] px-8 sm:px-14 rounded-full bg-[#2A2A2E]/90 hover:bg-white text-white hover:text-black border border-white/10 hover:border-transparent font-normal flex items-center justify-center gap-3 transition-colors duration-200 cursor-pointer disabled:opacity-50 select-none shadow-[0_4px_20px_rgba(0,0,0,0.5)]"
              style={{
                fontFamily: '"Google Sans", var(--font-google-sans), sans-serif',
                fontSize: "22.5px",
              }}
            >
              <span className="whitespace-nowrap">
                {loading ? "Saving..." : "Continue To Join or Create Page"}
              </span>
              <svg
                className="w-5 h-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M7 17L17 7M17 7H9M17 7V15" />
              </svg>
            </motion.button>
          </div>
        </form>
      </div>
    </main>
  );
}
