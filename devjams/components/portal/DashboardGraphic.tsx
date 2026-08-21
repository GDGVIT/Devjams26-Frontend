"use client";

import Image from "next/image";
import AssetImage from "@/components/AssetImage";

export function DashboardGraphic() {
  return (
    <div className="relative w-full max-w-full flex items-center justify-center pointer-events-none select-none my-2 sm:my-8 px-4 sm:px-6 overflow-visible">
      {/* Single Unified Center-Aligned Container with all 6 elements (Left Bracket, Umbrella, Gemini, Maps, Antigravity, Right Bracket) */}
      <div className="relative flex items-center justify-center mix-blend-screen scale-[0.52] min-[360px]:scale-[0.58] min-[400px]:scale-[0.68] min-[480px]:scale-[0.82] sm:scale-100 md:scale-110 lg:scale-[1.22] origin-center flex-shrink-0 transition-transform">
        {/* Left Bracket { (With whitespace after) */}
        <div className="relative flex items-center justify-center mr-2 sm:mr-4 md:mr-6 z-10 w-[55px] sm:w-[85px] md:w-[105px] h-[200px] sm:h-[275px] md:h-[325px]">
          <Image
            src="/assets/leftbracket.svg.svg"
            alt="Left Bracket"
            width={110}
            height={285}
            priority
            className="w-full h-full object-contain filter drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]"
          />
        </div>

        {/* Umbrella Arcs (Subtle overlap) */}
        <div className="relative flex items-center justify-center -mr-2 sm:-mr-3 md:-mr-4 z-20 w-[115px] sm:w-[175px] md:w-[210px] h-[85px] sm:h-[130px] md:h-[155px]">
          <Image
            src="/assets/umbrella.svg.svg"
            alt="Umbrella Graphic"
            width={310}
            height={222}
            priority
            className="w-full h-full object-contain filter drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]"
          />
        </div>

        {/* Gemini / Star Track (Subtle overlap) */}
        <div className="relative flex items-center justify-center -mr-2 sm:-mr-3 md:-mr-4 z-30 w-[105px] sm:w-[160px] md:w-[190px] h-[105px] sm:h-[160px] md:h-[190px]">
          <Image
            src="/assets/gemini.svg"
            alt="Gemini Star"
            width={301}
            height={301}
            priority
            className="w-full h-full object-contain filter drop-shadow-[0_0_15px_rgba(251,188,4,0.3)]"
          />
        </div>

        {/* Maps Pin (Subtle overlap) */}
        <div className="relative flex items-center justify-center -mr-2 sm:-mr-3 md:-mr-4 z-40 w-[110px] sm:w-[170px] md:w-[205px] h-[135px] sm:h-[200px] md:h-[240px]">
          <AssetImage
            src="/assets/maps.svg"
            alt="Maps Pin"
            width={365}
            height={465}
            priority
            className="w-full h-full object-contain filter drop-shadow-[0_0_15px_rgba(66,133,244,0.3)]"
          />
        </div>

        {/* Antigravity Arch (With whitespace before right bracket) */}
        <div className="relative flex items-center justify-center mr-2 sm:mr-4 md:mr-6 z-30 w-[105px] sm:w-[160px] md:w-[190px] h-[105px] sm:h-[160px] md:h-[190px]">
          <Image
            src="/assets/antigravity.svg.svg"
            alt="Antigravity Graphic"
            width={299}
            height={276}
            priority
            className="w-full h-full object-contain filter drop-shadow-[0_0_15px_rgba(234,67,53,0.3)]"
          />
        </div>

        {/* Right Bracket } */}
        <div className="relative flex items-center justify-center z-20 w-[55px] sm:w-[85px] md:w-[105px] h-[200px] sm:h-[275px] md:h-[325px]">
          <Image
            src="/assets/rightbracet.svg.svg"
            alt="Right Bracket"
            width={110}
            height={285}
            priority
            className="w-full h-full object-contain filter drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]"
          />
        </div>
      </div>
    </div>
  );
}
