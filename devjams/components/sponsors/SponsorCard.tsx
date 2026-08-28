"use client";

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

  const card = (
    <div className={`sponsor-card sponsor-card--${sponsor.tier}`}>
      {sponsor.dino && (
        /* Stands upright on the card's top edge, toward the left. */
        <AssetImage
          src="/assets/spons-dino.svg"
          alt=""
          width={138}
          height={146}
          sizes="(max-width: 700px) 60px, 80px"
          aria-hidden="true"
          className="sponsor-card__dino"
        />
      )}

      {sponsor.topDeco && (
        <AssetImage
          src={sponsor.topDeco}
          alt=""
          width={68}
          height={70}
          sizes="50px"
          aria-hidden="true"
          className="sponsor-card__top-deco"
        />
      )}

      {sponsor.bottomDeco && (
        <AssetImage
          src={sponsor.bottomDeco}
          alt=""
          width={136}
          height={136}
          sizes="60px"
          aria-hidden="true"
          className="sponsor-card__bottom-deco"
        />
      )}

      <AssetImage
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
          className="sponsor-link"
          aria-label={`${sponsor.name}, ${label} sponsor — opens in a new tab`}
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
