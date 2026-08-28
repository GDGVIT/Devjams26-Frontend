"use client";

import AssetImage from "../AssetImage";

export default function SponsorDecorations() {
  return (
    <>
      {/* Top-Right Ded (Pixel bird with colorful tail) */}
      <AssetImage
        src="/assets/ded.svg"
        alt=""
        width={92}
        height={63}
        aria-hidden="true"
        className="sponsors__deco sponsors__deco--ded"
      />

      {/* Left Gutter Cloud */}
      <AssetImage
        src="/assets/cloud.svg"
        alt=""
        width={278}
        height={203}
        aria-hidden="true"
        className="sponsors__deco sponsors__deco--cloud"
      />

      {/* Right Gutter Antigravity Logo */}
      <AssetImage
        src="/assets/antigravity.svg"
        alt=""
        width={299}
        height={276}
        aria-hidden="true"
        className="sponsors__deco sponsors__deco--antigravity"
      />

      {/* Bottom-Right Android head */}
      <AssetImage
        src="/assets/android.svg"
        alt=""
        width={260}
        height={159}
        aria-hidden="true"
        className="sponsors__deco sponsors__deco--android"
      />
    </>
  );
}

