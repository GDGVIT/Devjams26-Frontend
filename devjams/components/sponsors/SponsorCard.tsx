"use client";

import { useId } from "react";
import Image from "next/image";
import AssetImage from "../AssetImage";
import { motion } from "../gsap-motion";
import { TIER_LABEL, type Sponsor } from "./SponsorsData";

interface SponsorCardProps {
  sponsor: Sponsor;
  /** Staggers the entry when more than one tier is present. */
  index?: number;
}

export function SponsorCard({ sponsor, index = 0 }: SponsorCardProps) {
  const label = TIER_LABEL[sponsor.tier];
  // Unique clipPath id so multiple cards don't collide — the Figma export
  // uses a single global id (bgblur_0_2104_9537_clip_path).
  const clipId = `bgblur_${useId().replace(/:/g, "_")}`;

  const card = (
    <div className={`sponsor-card sponsor-card--${sponsor.tier}`}>
      {/* Figma card background: 350×480 rx24 #202124 with 22.55px backdrop blur.
          Inlined so the blur + fill live exactly as exported. For bronze this
          is the spec; gold/silver reuse the same shape for visual consistency. */}
      <svg
        className="sponsor-card__bg"
        width="350"
        height="480"
        viewBox="0 0 350 480"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        preserveAspectRatio="none"
      >
        <foreignObject x="-45.1" y="-45.1" width="440.2" height="570.2">
          <div
            style={
              {
                backdropFilter: "blur(22.55px)",
                clipPath: `url(#${clipId})`,
                height: "100%",
                width: "100%",
              } as React.CSSProperties
            }
          />
        </foreignObject>
        <rect
          data-figma-bg-blur-radius="45.1"
          width="350"
          height="480"
          rx="24"
          fill="#202124"
        />
        <defs>
          <clipPath id={clipId} transform="translate(45.1 45.1)">
            <rect width="350" height="480" rx="24" />
          </clipPath>
        </defs>
      </svg>

      {sponsor.dino && (
        /* Stands upright on the card's top edge, toward the left. */
        <AssetImage
          src="/assets/spons-dino.svg"
          alt=""
          width={138}
          height={146}
          sizes="68px"
          aria-hidden="true"
          className="sponsor-card__dino"
        />
      )}

      <Image
        src={sponsor.logo}
        alt={`${sponsor.name} — ${label} sponsor`}
        width={1693}
        height={405}
        sizes="(max-width: 700px) 190px, 240px"
        className={`sponsor-card__logo${sponsor.invertLogo ? " sponsor-card__logo--invert" : ""}`}
      />
    </div>
  );

  return (
    <motion.div
      className="sponsor-slot"
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.5, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }}
    >
      {sponsor.url ? (
        <a
          href={sponsor.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${sponsor.name}, ${label} sponsor`}
        >
          {card}
        </a>
      ) : (
        card
      )}

      <p className={`sponsor-tier sponsor-tier--${sponsor.tier}`}>{label}</p>
    </motion.div>
  );
}
