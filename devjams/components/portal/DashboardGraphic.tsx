"use client";

import Image from "next/image";
import AssetImage from "@/components/AssetImage";

export function DashboardGraphic() {
  return (
    <div className="relative w-full max-w-full flex items-center justify-center pointer-events-none select-none my-2 sm:my-8 px-4 sm:px-6 overflow-visible">
      {/* Single Unified Center-Aligned Container with deeply overlapping elements matching Figma specs */}
      <div className="relative flex items-center justify-center scale-[0.68] min-[360px]:scale-[0.75] min-[400px]:scale-[0.84] min-[480px]:scale-[0.96] sm:scale-[1.18] md:scale-[1.28] lg:scale-[1.38] xl:scale-[1.45] origin-center flex-shrink-0 transition-transform">
        {/* Left Bracket { */}
        <div
          className="relative flex items-center justify-center -mr-5 sm:-mr-8 md:-mr-11 z-10 w-[48px] sm:w-[75px] md:w-[95px] h-[170px] sm:h-[250px] md:h-[300px]"
          style={{ mixBlendMode: "plus-lighter" }}
        >
          <AssetImage
            src="/assets/leftbracket.svg"
            alt="Left Bracket"
            width={110}
            height={285}
            priority
            className="w-full h-full object-contain filter drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]"
          />
        </div>

        {/* Umbrella Arcs */}
        <div
          className="relative flex items-center justify-center -mr-9 sm:-mr-15 md:-mr-18 z-20 w-[110px] sm:w-[170px] md:w-[210px] h-[80px] sm:h-[125px] md:h-[155px]"
          style={{ mixBlendMode: "plus-lighter" }}
        >
          <AssetImage
            src="/assets/umbrella.svg"
            alt="Umbrella Graphic"
            width={310}
            height={222}
            priority
            className="w-full h-full object-contain filter drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]"
          />
        </div>

        {/* Gemini / Star Track */}
        <div
          className="relative flex items-center justify-center -mr-9 sm:-mr-15 md:-mr-18 z-30 w-[100px] sm:w-[155px] md:w-[190px] h-[100px] sm:h-[155px] md:h-[190px]"
          style={{ mixBlendMode: "plus-lighter" }}
        >
          <Image
            src="/assets/gemini.svg"
            alt="Gemini Star"
            width={301}
            height={301}
            priority
            className="w-full h-full object-contain filter drop-shadow-[0_0_15px_rgba(251,188,4,0.3)]"
          />
        </div>

        {/* Maps Pin */}
        <div
          className="relative flex items-center justify-center -mr-9 sm:-mr-15 md:-mr-18 z-40 w-[105px] sm:w-[165px] md:w-[200px] h-[130px] sm:h-[200px] md:h-[245px]"
          style={{ mixBlendMode: "plus-lighter" }}
        >
          <AssetImage
            src="/assets/maps.svg"
            alt="Maps Pin"
            width={365}
            height={465}
            priority
            className="w-full h-full object-contain filter drop-shadow-[0_0_15px_rgba(66,133,244,0.3)]"
          />
        </div>

        {/* Antigravity Arch */}
        <div
          className="relative flex items-center justify-center -mr-5 sm:-mr-8 md:-mr-11 z-30 w-[105px] sm:w-[165px] md:w-[200px] h-[105px] sm:h-[165px] md:h-[200px]"
          style={{ mixBlendMode: "plus-lighter" }}
        >
          <Image
            src="/assets/antigravity.svg"
            alt="Antigravity Graphic"
            width={299}
            height={276}
            priority
            className="w-full h-full object-contain filter drop-shadow-[0_0_15px_rgba(234,67,53,0.3)]"
          />
        </div>

        {/* Right Bracket } */}
        <div
          className="relative flex items-center justify-center z-20 w-[48px] sm:w-[75px] md:w-[95px] h-[170px] sm:h-[250px] md:h-[300px]"
          style={{ mixBlendMode: "plus-lighter" }}
        >
          <AssetImage
            src="/assets/rightbracket.svg"
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
