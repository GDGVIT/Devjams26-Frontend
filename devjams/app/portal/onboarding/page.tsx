"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "@/components/gsap-motion";
import AssetImage from "@/components/AssetImage";
import { portalApi } from "@/services/portalApi";
const COUNTRY_CODES = [
  { code: "+91", country: "India", flag: "🇮🇳" },

  { code: "+93", country: "Afghanistan", flag: "🇦🇫" },
  { code: "+355", country: "Albania", flag: "🇦🇱" },
  { code: "+213", country: "Algeria", flag: "🇩🇿" },
  { code: "+1684", country: "American Samoa", flag: "🇦🇸" },
  { code: "+376", country: "Andorra", flag: "🇦🇩" },
  { code: "+244", country: "Angola", flag: "🇦🇴" },
  { code: "+1264", country: "Anguilla", flag: "🇦🇮" },
  { code: "+1268", country: "Antigua and Barbuda", flag: "🇦🇬" },
  { code: "+54", country: "Argentina", flag: "🇦🇷" },
  { code: "+374", country: "Armenia", flag: "🇦🇲" },
  { code: "+297", country: "Aruba", flag: "🇦🇼" },
  { code: "+247", country: "Ascension Island", flag: "🇦🇨" },
  { code: "+61", country: "Australia", flag: "🇦🇺" },
  { code: "+43", country: "Austria", flag: "🇦🇹" },
  { code: "+994", country: "Azerbaijan", flag: "🇦🇿" },

  { code: "+1242", country: "Bahamas", flag: "🇧🇸" },
  { code: "+973", country: "Bahrain", flag: "🇧🇭" },
  { code: "+880", country: "Bangladesh", flag: "🇧🇩" },
  { code: "+1246", country: "Barbados", flag: "🇧🇧" },
  { code: "+375", country: "Belarus", flag: "🇧🇾" },
  { code: "+32", country: "Belgium", flag: "🇧🇪" },
  { code: "+501", country: "Belize", flag: "🇧🇿" },
  { code: "+229", country: "Benin", flag: "🇧🇯" },
  { code: "+1441", country: "Bermuda", flag: "🇧🇲" },
  { code: "+975", country: "Bhutan", flag: "🇧🇹" },
  { code: "+591", country: "Bolivia", flag: "🇧🇴" },
  { code: "+599", country: "Bonaire, Sint Eustatius and Saba", flag: "🇧🇶" },
  { code: "+387", country: "Bosnia and Herzegovina", flag: "🇧🇦" },
  { code: "+267", country: "Botswana", flag: "🇧🇼" },
  { code: "+55", country: "Brazil", flag: "🇧🇷" },
  { code: "+1284", country: "British Virgin Islands", flag: "🇻🇬" },
  { code: "+673", country: "Brunei", flag: "🇧🇳" },
  { code: "+359", country: "Bulgaria", flag: "🇧🇬" },
  { code: "+226", country: "Burkina Faso", flag: "🇧🇫" },
  { code: "+257", country: "Burundi", flag: "🇧🇮" },

  { code: "+238", country: "Cabo Verde", flag: "🇨🇻" },
  { code: "+855", country: "Cambodia", flag: "🇰🇭" },
  { code: "+237", country: "Cameroon", flag: "🇨🇲" },
  { code: "+1", country: "Canada", flag: "🇨🇦" },
  { code: "+1345", country: "Cayman Islands", flag: "🇰🇾" },
  { code: "+236", country: "Central African Republic", flag: "🇨🇫" },
  { code: "+235", country: "Chad", flag: "🇹🇩" },
  { code: "+56", country: "Chile", flag: "🇨🇱" },
  { code: "+86", country: "China", flag: "🇨🇳" },
  { code: "+57", country: "Colombia", flag: "🇨🇴" },
  { code: "+269", country: "Comoros", flag: "🇰🇲" },
  { code: "+242", country: "Congo", flag: "🇨🇬" },
  { code: "+243", country: "DR Congo", flag: "🇨🇩" },
  { code: "+682", country: "Cook Islands", flag: "🇨🇰" },
  { code: "+506", country: "Costa Rica", flag: "🇨🇷" },
  { code: "+225", country: "Côte d'Ivoire", flag: "🇨🇮" },
  { code: "+385", country: "Croatia", flag: "🇭🇷" },
  { code: "+53", country: "Cuba", flag: "🇨🇺" },
  { code: "+599", country: "Curaçao", flag: "🇨🇼" },
  { code: "+357", country: "Cyprus", flag: "🇨🇾" },
  { code: "+420", country: "Czechia", flag: "🇨🇿" },

  { code: "+45", country: "Denmark", flag: "🇩🇰" },
  { code: "+246", country: "Diego Garcia", flag: "🇩🇬" },
  { code: "+253", country: "Djibouti", flag: "🇩🇯" },
  { code: "+1767", country: "Dominica", flag: "🇩🇲" },
  { code: "+1", country: "Dominican Republic", flag: "🇩🇴" },

  { code: "+593", country: "Ecuador", flag: "🇪🇨" },
  { code: "+20", country: "Egypt", flag: "🇪🇬" },
  { code: "+503", country: "El Salvador", flag: "🇸🇻" },
  { code: "+240", country: "Equatorial Guinea", flag: "🇬🇶" },
  { code: "+291", country: "Eritrea", flag: "🇪🇷" },
  { code: "+372", country: "Estonia", flag: "🇪🇪" },
  { code: "+268", country: "Eswatini", flag: "🇸🇿" },
  { code: "+251", country: "Ethiopia", flag: "🇪🇹" },

  { code: "+500", country: "Falkland Islands", flag: "🇫🇰" },
  { code: "+298", country: "Faroe Islands", flag: "🇫🇴" },
  { code: "+679", country: "Fiji", flag: "🇫🇯" },
  { code: "+358", country: "Finland", flag: "🇫🇮" },
  { code: "+33", country: "France", flag: "🇫🇷" },
  { code: "+594", country: "French Guiana", flag: "🇬🇫" },
  { code: "+689", country: "French Polynesia", flag: "🇵🇫" },
  { code: "+262", country: "Réunion", flag: "🇷🇪" },
  { code: "+262", country: "Mayotte", flag: "🇾🇹" },

  { code: "+241", country: "Gabon", flag: "🇬🇦" },
  { code: "+220", country: "Gambia", flag: "🇬🇲" },
  { code: "+995", country: "Georgia", flag: "🇬🇪" },
  { code: "+49", country: "Germany", flag: "🇩🇪" },
  { code: "+233", country: "Ghana", flag: "🇬🇭" },
  { code: "+350", country: "Gibraltar", flag: "🇬🇮" },
  { code: "+30", country: "Greece", flag: "🇬🇷" },
  { code: "+299", country: "Greenland", flag: "🇬🇱" },
  { code: "+1473", country: "Grenada", flag: "🇬🇩" },
  { code: "+590", country: "Guadeloupe", flag: "🇬🇵" },
  { code: "+1671", country: "Guam", flag: "🇬🇺" },
  { code: "+502", country: "Guatemala", flag: "🇬🇹" },
  { code: "+224", country: "Guinea", flag: "🇬🇳" },
  { code: "+245", country: "Guinea-Bissau", flag: "🇬🇼" },
  { code: "+592", country: "Guyana", flag: "🇬🇾" },

  { code: "+509", country: "Haiti", flag: "🇭🇹" },
  { code: "+504", country: "Honduras", flag: "🇭🇳" },
  { code: "+852", country: "Hong Kong", flag: "🇭🇰" },
  { code: "+36", country: "Hungary", flag: "🇭🇺" },

  { code: "+354", country: "Iceland", flag: "🇮🇸" },
  { code: "+62", country: "Indonesia", flag: "🇮🇩" },
  { code: "+98", country: "Iran", flag: "🇮🇷" },
  { code: "+964", country: "Iraq", flag: "🇮🇶" },
  { code: "+353", country: "Ireland", flag: "🇮🇪" },
  { code: "+972", country: "Israel", flag: "🇮🇱" },
  { code: "+39", country: "Italy", flag: "🇮🇹" },

  { code: "+1", country: "Jamaica", flag: "🇯🇲" },
  { code: "+81", country: "Japan", flag: "🇯🇵" },
  { code: "+962", country: "Jordan", flag: "🇯🇴" },

  { code: "+7", country: "Kazakhstan", flag: "🇰🇿" },
  { code: "+254", country: "Kenya", flag: "🇰🇪" },
  { code: "+686", country: "Kiribati", flag: "🇰🇮" },
  { code: "+850", country: "North Korea", flag: "🇰🇵" },
  { code: "+82", country: "South Korea", flag: "🇰🇷" },
  { code: "+383", country: "Kosovo", flag: "🇽🇰" },
  { code: "+965", country: "Kuwait", flag: "🇰🇼" },
  { code: "+996", country: "Kyrgyzstan", flag: "🇰🇬" },

  { code: "+856", country: "Laos", flag: "🇱🇦" },
  { code: "+371", country: "Latvia", flag: "🇱🇻" },
  { code: "+961", country: "Lebanon", flag: "🇱🇧" },
  { code: "+266", country: "Lesotho", flag: "🇱🇸" },
  { code: "+231", country: "Liberia", flag: "🇱🇷" },
  { code: "+218", country: "Libya", flag: "🇱🇾" },
  { code: "+423", country: "Liechtenstein", flag: "🇱🇮" },
  { code: "+370", country: "Lithuania", flag: "🇱🇹" },
  { code: "+352", country: "Luxembourg", flag: "🇱🇺" },

  { code: "+853", country: "Macao", flag: "🇲🇴" },
  { code: "+261", country: "Madagascar", flag: "🇲🇬" },
  { code: "+265", country: "Malawi", flag: "🇲🇼" },
  { code: "+60", country: "Malaysia", flag: "🇲🇾" },
  { code: "+960", country: "Maldives", flag: "🇲🇻" },
  { code: "+223", country: "Mali", flag: "🇲🇱" },
  { code: "+356", country: "Malta", flag: "🇲🇹" },
  { code: "+692", country: "Marshall Islands", flag: "🇲🇭" },
  { code: "+596", country: "Martinique", flag: "🇲🇶" },
  { code: "+222", country: "Mauritania", flag: "🇲🇷" },
  { code: "+230", country: "Mauritius", flag: "🇲🇺" },
  { code: "+52", country: "Mexico", flag: "🇲🇽" },
  { code: "+691", country: "Micronesia", flag: "🇫🇲" },
  { code: "+373", country: "Moldova", flag: "🇲🇩" },
  { code: "+377", country: "Monaco", flag: "🇲🇨" },
  { code: "+976", country: "Mongolia", flag: "🇲🇳" },
  { code: "+382", country: "Montenegro", flag: "🇲🇪" },
  { code: "+1664", country: "Montserrat", flag: "🇲🇸" },
  { code: "+212", country: "Morocco", flag: "🇲🇦" },
  { code: "+258", country: "Mozambique", flag: "🇲🇿" },
  { code: "+95", country: "Myanmar", flag: "🇲🇲" },

  { code: "+264", country: "Namibia", flag: "🇳🇦" },
  { code: "+674", country: "Nauru", flag: "🇳🇷" },
  { code: "+977", country: "Nepal", flag: "🇳🇵" },
  { code: "+31", country: "Netherlands", flag: "🇳🇱" },
  { code: "+687", country: "New Caledonia", flag: "🇳🇨" },
  { code: "+64", country: "New Zealand", flag: "🇳🇿" },
  { code: "+505", country: "Nicaragua", flag: "🇳🇮" },
  { code: "+227", country: "Niger", flag: "🇳🇪" },
  { code: "+234", country: "Nigeria", flag: "🇳🇬" },
  { code: "+683", country: "Niue", flag: "🇳🇺" },
  { code: "+672", country: "Norfolk Island", flag: "🇳🇫" },
  { code: "+389", country: "North Macedonia", flag: "🇲🇰" },
  { code: "+1670", country: "Northern Mariana Islands", flag: "🇲🇵" },
  { code: "+47", country: "Norway", flag: "🇳🇴" },

  { code: "+968", country: "Oman", flag: "🇴🇲" },

  { code: "+92", country: "Pakistan", flag: "🇵🇰" },
  { code: "+680", country: "Palau", flag: "🇵🇼" },
  { code: "+970", country: "Palestine", flag: "🇵🇸" },
  { code: "+507", country: "Panama", flag: "🇵🇦" },
  { code: "+675", country: "Papua New Guinea", flag: "🇵🇬" },
  { code: "+595", country: "Paraguay", flag: "🇵🇾" },
  { code: "+51", country: "Peru", flag: "🇵🇪" },
  { code: "+63", country: "Philippines", flag: "🇵🇭" },
  { code: "+48", country: "Poland", flag: "🇵🇱" },
  { code: "+351", country: "Portugal", flag: "🇵🇹" },
  { code: "+1", country: "Puerto Rico", flag: "🇵🇷" },

  { code: "+974", country: "Qatar", flag: "🇶🇦" },

  { code: "+40", country: "Romania", flag: "🇷🇴" },
  { code: "+7", country: "Russia", flag: "🇷🇺" },
  { code: "+250", country: "Rwanda", flag: "🇷🇼" },

  { code: "+290", country: "Saint Helena", flag: "🇸🇭" },
  { code: "+1869", country: "Saint Kitts and Nevis", flag: "🇰🇳" },
  { code: "+1758", country: "Saint Lucia", flag: "🇱🇨" },
  { code: "+508", country: "Saint Pierre and Miquelon", flag: "🇵🇲" },
  { code: "+1784", country: "Saint Vincent and the Grenadines", flag: "🇻🇨" },
  { code: "+685", country: "Samoa", flag: "🇼🇸" },
  { code: "+378", country: "San Marino", flag: "🇸🇲" },
  { code: "+239", country: "São Tomé and Príncipe", flag: "🇸🇹" },
  { code: "+966", country: "Saudi Arabia", flag: "🇸🇦" },
  { code: "+221", country: "Senegal", flag: "🇸🇳" },
  { code: "+381", country: "Serbia", flag: "🇷🇸" },
  { code: "+248", country: "Seychelles", flag: "🇸🇨" },
  { code: "+232", country: "Sierra Leone", flag: "🇸🇱" },
  { code: "+65", country: "Singapore", flag: "🇸🇬" },
  { code: "+1721", country: "Sint Maarten", flag: "🇸🇽" },
  { code: "+421", country: "Slovakia", flag: "🇸🇰" },
  { code: "+386", country: "Slovenia", flag: "🇸🇮" },
  { code: "+677", country: "Solomon Islands", flag: "🇸🇧" },
  { code: "+252", country: "Somalia", flag: "🇸🇴" },
  { code: "+27", country: "South Africa", flag: "🇿🇦" },
  { code: "+211", country: "South Sudan", flag: "🇸🇸" },
  { code: "+34", country: "Spain", flag: "🇪🇸" },
  { code: "+94", country: "Sri Lanka", flag: "🇱🇰" },
  { code: "+249", country: "Sudan", flag: "🇸🇩" },
  { code: "+597", country: "Suriname", flag: "🇸🇷" },
  { code: "+46", country: "Sweden", flag: "🇸🇪" },
  { code: "+41", country: "Switzerland", flag: "🇨🇭" },
  { code: "+963", country: "Syria", flag: "🇸🇾" },

  { code: "+886", country: "Taiwan", flag: "🇹🇼" },
  { code: "+992", country: "Tajikistan", flag: "🇹🇯" },
  { code: "+255", country: "Tanzania", flag: "🇹🇿" },
  { code: "+66", country: "Thailand", flag: "🇹🇭" },
  { code: "+670", country: "Timor-Leste", flag: "🇹🇱" },
  { code: "+228", country: "Togo", flag: "🇹🇬" },
  { code: "+690", country: "Tokelau", flag: "🇹🇰" },
  { code: "+676", country: "Tonga", flag: "🇹🇴" },
  { code: "+1868", country: "Trinidad and Tobago", flag: "🇹🇹" },
  { code: "+216", country: "Tunisia", flag: "🇹🇳" },
  { code: "+90", country: "Türkiye", flag: "🇹🇷" },
  { code: "+993", country: "Turkmenistan", flag: "🇹🇲" },
  { code: "+1649", country: "Turks and Caicos Islands", flag: "🇹🇨" },
  { code: "+688", country: "Tuvalu", flag: "🇹🇻" },

  { code: "+256", country: "Uganda", flag: "🇺🇬" },
  { code: "+380", country: "Ukraine", flag: "🇺🇦" },
  { code: "+971", country: "UAE", flag: "🇦🇪" },
  { code: "+44", country: "UK", flag: "🇬🇧" },
  { code: "+1", country: "USA", flag: "🇺🇸" },
  { code: "+1340", country: "US Virgin Islands", flag: "🇻🇮" },
  { code: "+598", country: "Uruguay", flag: "🇺🇾" },
  { code: "+998", country: "Uzbekistan", flag: "🇺🇿" },

  { code: "+678", country: "Vanuatu", flag: "🇻🇺" },
  { code: "+39", country: "Vatican City", flag: "🇻🇦" },
  { code: "+58", country: "Venezuela", flag: "🇻🇪" },
  { code: "+84", country: "Vietnam", flag: "🇻🇳" },

  { code: "+681", country: "Wallis and Futuna", flag: "🇼🇫" },

  { code: "+967", country: "Yemen", flag: "🇾🇪" },

  { code: "+260", country: "Zambia", flag: "🇿🇲" },
  { code: "+263", country: "Zimbabwe", flag: "🇿🇼" },
];

export const mhBlocks = Array.from({ length: 20 }, (_, i) => `MH-${String.fromCharCode(65 + i)}`).filter(
  (block) => !["MH-I", "MH-O", "MH-S"].includes(block)
);

export const lhBlocks = [
  ...Array.from({ length: 10 }, (_, i) => `LH-${String.fromCharCode(65 + i)}`).filter(
    (block) => block !== "LH-I"
  ),
  "LH-S",
].filter((v, i, a) => a.indexOf(v) === i);

export const allHostelBlocks = [...mhBlocks, ...lhBlocks, "Day Boarder"];

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

    if (!hostelBlock.trim()) {
      setError("Please select your hostel block or Day Boarder.");
      return;
    }

    if (hostelBlock !== "Day Boarder" && !roomNumber.trim()) {
      setError("Please enter your room number.");
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
      <div className="absolute -top-16 -left-16 sm:-top-20 sm:-left-20 w-36 h-36 sm:w-52 sm:h-52 md:w-64 md:h-64 pointer-events-none z-0">
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
      <div className="absolute -top-16 -right-16 sm:-top-20 sm:-right-20 w-40 h-40 sm:w-56 sm:h-56 md:w-72 md:h-72 pointer-events-none z-0">
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
                  placeholder="e.g. Neeraj Sathish Kumar"
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
                    {COUNTRY_CODES.map((c, idx) => (
                      <option key={`${c.country}-${c.code}-${idx}`} value={c.code} className="bg-[#1E1E22] text-white">
                        {c.flag} {c.code} ({c.country})
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
                  Hostel Block
                </label>
                <select
                  value={hostelBlock}
                  onChange={(e) => {
                    const val = e.target.value;
                    setHostelBlock(val);
                    if (val === "Day Boarder") {
                      setRoomNumber("N/A");
                    } else if (roomNumber === "N/A") {
                      setRoomNumber("");
                    }
                  }}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-[#2D2D2D] hover:bg-[#333333] focus:bg-[#333333] border border-transparent focus:border-white/20 text-white text-sm sm:text-base focus:outline-none transition-all cursor-pointer"
                >
                  <option value="" disabled className="bg-[#1E1E22] text-neutral-500">
                    Select Block
                  </option>
                  {gender === "Male" ? (
                    <>
                      <optgroup label="Men's Hostel" className="bg-[#1E1E22] text-amber-400 font-semibold">
                        {mhBlocks.map((block) => (
                          <option key={block} value={block} className="bg-[#1E1E22] text-white font-normal">
                            {block}
                          </option>
                        ))}
                      </optgroup>
                      <option value="Day Boarder" className="bg-[#1E1E22] text-white">
                        Day Boarder
                      </option>
                    </>
                  ) : gender === "Female" ? (
                    <>
                      <optgroup label="Ladies' Hostel" className="bg-[#1E1E22] text-amber-400 font-semibold">
                        {lhBlocks.map((block) => (
                          <option key={block} value={block} className="bg-[#1E1E22] text-white font-normal">
                            {block}
                          </option>
                        ))}
                      </optgroup>
                      <option value="Day Boarder" className="bg-[#1E1E22] text-white">
                        Day Boarder
                      </option>
                    </>
                  ) : (
                    <>
                      <optgroup label="Men's Hostel" className="bg-[#1E1E22] text-amber-400 font-semibold">
                        {mhBlocks.map((block) => (
                          <option key={block} value={block} className="bg-[#1E1E22] text-white font-normal">
                            {block}
                          </option>
                        ))}
                      </optgroup>
                      <optgroup label="Ladies' Hostel" className="bg-[#1E1E22] text-amber-400 font-semibold">
                        {lhBlocks.map((block) => (
                          <option key={block} value={block} className="bg-[#1E1E22] text-white font-normal">
                            {block}
                          </option>
                        ))}
                      </optgroup>
                      <option value="Day Boarder" className="bg-[#1E1E22] text-white">
                        Day Boarder
                      </option>
                    </>
                  )}
                </select>
              </div>
              <div>
                <label className="block text-sm sm:text-base font-normal text-white mb-2">
                  Room Number
                </label>
                <input
                  type="text"
                  placeholder={hostelBlock === "Day Boarder" ? "N/A (Day Boarder)" : "e.g. 402"}
                  value={roomNumber}
                  disabled={hostelBlock === "Day Boarder"}
                  onChange={(e) => setRoomNumber(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[#2D2D2D] hover:bg-[#333333] focus:bg-[#333333] border border-transparent focus:border-white/20 text-white placeholder-neutral-500 text-sm sm:text-base focus:outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
