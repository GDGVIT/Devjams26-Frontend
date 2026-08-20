"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "@/components/gsap-motion";
import ResponsiveSvg from "@/components/ResponsiveSvg";
import { portalApi } from "@/services/portalApi";

export default function OnboardingPage() {
  const router = useRouter();

  // Form State matching the reference screenshot
  const [name, setName] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("");
  const [hostelBlock, setHostelBlock] = useState("");
  const [roomNumber, setRoomNumber] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Load pre-existing data if any
    const existing = portalApi.getInternalOnboarding();
    if (existing) {
      if (existing.name) setName(existing.name);
      if (existing.registrationNumber) setRegistrationNumber(existing.registrationNumber);
      if (existing.contactNumber) setContactNumber(existing.contactNumber);
      if (existing.email) setEmail(existing.email);
      if (existing.gender) setGender(existing.gender);
      if (existing.hostelBlock) setHostelBlock(existing.hostelBlock);
      if (existing.roomNumber) setRoomNumber(existing.roomNumber);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }
    if (!registrationNumber.trim()) {
      setError("Please enter your registration number.");
      return;
    }
    if (!contactNumber.trim()) {
      setError("Please enter your contact number.");
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
        contactNumber: contactNumber.trim(),
        email: email.trim().toLowerCase(),
        gender: gender.trim(),
        hostelBlock: hostelBlock.trim(),
        roomNumber: roomNumber.trim(),
      });

      router.push("/portal/join-create");
    } catch (err: any) {
      setError(err?.message || "Failed to save onboarding details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen w-full bg-black text-white flex flex-col justify-between overflow-x-hidden p-4 sm:p-8 select-none">
      {/* Top-Left Web Graphic */}
      <div className="absolute -top-10 -left-10 sm:-top-14 sm:-left-14 w-40 h-40 sm:w-60 sm:h-60 md:w-72 md:h-72 pointer-events-none z-10">
        <ResponsiveSvg
          src="/assets/web.svg"
          alt="Web Track Decoration"
          width={288}
          height={288}
          priority
          className="w-full h-full object-contain filter drop-shadow-[0_0_20px_rgba(66,133,244,0.3)]"
        />
      </div>

      {/* Top-Right Gear Graphic */}
      <div className="absolute -top-10 -right-10 sm:-top-14 sm:-right-14 w-44 h-44 sm:w-64 sm:h-64 md:w-80 md:h-80 pointer-events-none z-10">
        <ResponsiveSvg
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
          className="text-3xl sm:text-4xl md:text-5xl font-bold text-center text-white mb-8 sm:mb-12 tracking-tight"
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

        {/* Onboarding Form matching reference screenshot */}
        <form onSubmit={handleSubmit} className="space-y-8 sm:space-y-10">
          {/* SECTION 1: Personal Details */}
          <div className="space-y-3 sm:space-y-4">
            <h2
              className="text-xl sm:text-2xl font-bold text-white tracking-tight"
              style={{
                fontFamily: '"Google Sans", var(--font-google-sans), sans-serif',
              }}
            >
              Personal Details
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-sm sm:text-base font-medium text-white mb-2">
                  Name
                </label>
                <input
                  type="text"
                  placeholder="e.g : 12345"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-[#2D2D2D] hover:bg-[#333333] focus:bg-[#333333] border border-transparent focus:border-white/20 text-white placeholder-neutral-400 text-sm sm:text-base focus:outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm sm:text-base font-medium text-white mb-2">
                  Registration Number
                </label>
                <input
                  type="text"
                  placeholder="e.g : 12345"
                  value={registrationNumber}
                  onChange={(e) => setRegistrationNumber(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-[#2D2D2D] hover:bg-[#333333] focus:bg-[#333333] border border-transparent focus:border-white/20 text-white placeholder-neutral-400 text-sm sm:text-base focus:outline-none transition-all uppercase"
                />
              </div>
            </div>
          </div>

          {/* SECTION 2: Contact Details */}
          <div className="space-y-3 sm:space-y-4">
            <h2
              className="text-xl sm:text-2xl font-bold text-white tracking-tight"
              style={{
                fontFamily: '"Google Sans", var(--font-google-sans), sans-serif',
              }}
            >
              Contact Details
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-sm sm:text-base font-medium text-white mb-2">
                  Contact Number
                </label>
                <input
                  type="tel"
                  placeholder="e.g : 12345"
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-[#2D2D2D] hover:bg-[#333333] focus:bg-[#333333] border border-transparent focus:border-white/20 text-white placeholder-neutral-400 text-sm sm:text-base focus:outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm sm:text-base font-medium text-white mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="e.g : 12345"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-[#2D2D2D] hover:bg-[#333333] focus:bg-[#333333] border border-transparent focus:border-white/20 text-white placeholder-neutral-400 text-sm sm:text-base focus:outline-none transition-all"
                />
              </div>
            </div>
          </div>

          {/* SECTION 3: Hostel Details */}
          <div className="space-y-3 sm:space-y-4">
            <h2
              className="text-xl sm:text-2xl font-bold text-white tracking-tight"
              style={{
                fontFamily: '"Google Sans", var(--font-google-sans), sans-serif',
              }}
            >
              Hostel Details
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              <div>
                <label className="block text-sm sm:text-base font-medium text-white mb-2">
                  Gender
                </label>
                <input
                  type="text"
                  placeholder="e.g : 12345"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[#2D2D2D] hover:bg-[#333333] focus:bg-[#333333] border border-transparent focus:border-white/20 text-white placeholder-neutral-400 text-sm sm:text-base focus:outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm sm:text-base font-medium text-white mb-2">
                  Hostel Block:
                </label>
                <input
                  type="text"
                  placeholder="e.g : 12345"
                  value={hostelBlock}
                  onChange={(e) => setHostelBlock(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[#2D2D2D] hover:bg-[#333333] focus:bg-[#333333] border border-transparent focus:border-white/20 text-white placeholder-neutral-400 text-sm sm:text-base focus:outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm sm:text-base font-medium text-white mb-2">
                  Room Number
                </label>
                <input
                  type="text"
                  placeholder="e.g : 12345"
                  value={roomNumber}
                  onChange={(e) => setRoomNumber(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[#2D2D2D] hover:bg-[#333333] focus:bg-[#333333] border border-transparent focus:border-white/20 text-white placeholder-neutral-400 text-sm sm:text-base focus:outline-none transition-all"
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
              className="group w-full sm:w-auto min-w-[320px] sm:min-w-[440px] md:min-w-[500px] h-[58px] sm:h-[64px] px-8 sm:px-14 rounded-full bg-white hover:bg-neutral-100 text-black font-semibold flex items-center justify-center gap-3 transition-all cursor-pointer disabled:opacity-50 select-none shadow-[0_4px_20px_rgba(0,0,0,0.4)]"
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

      {/* Bottom faint watermark/label */}
      <div className="relative z-10 text-neutral-800 text-xs sm:text-sm pl-2 select-none">
        dashboard
      </div>
    </main>
  );
}
