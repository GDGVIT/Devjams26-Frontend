export type SponsorTier = "diamond" | "gold" | "silver" | "bronze";

export interface Sponsor {
  id: string;
  /** Tier label rendered under the card. */
  tier: SponsorTier;
  name: string;
  logo: string;
  /**
   * The supplied logo is the dark-on-light variant, so it disappears against
   * the card. Setting this flattens it to solid white via a CSS filter. Drop it
   * once a proper light-on-dark asset lands — see SponsorCard.
   */
  invertLogo?: boolean;
  /** Optional site to link the card to. */
  url?: string;
  /** Stands the pixel dino on the card's top edge. */
  dino?: boolean;
}

/**
 * The layout reserves three tiers. Only the tiers listed here render, so the
 * row stays centred while Silver and Bronze are still unannounced — add an
 * entry and it slots in without touching the layout.
 */
export const SPONSORS: Sponsor[] = [
  {
    id: "reka",
    tier: "diamond",
    name: "Reka",
    logo: "/assets/reka-spons.svg",
    url: "https://reka.ai/",
  },
  {
    id: "exasol",
    tier: "gold",
    name: "Exasol",
    logo: "/exasol-light.svg",
    url: "https://www.exasol.com/",
    dino: true,
  },
  {
    id: "aems",
    tier: "bronze",
    name: "AEMS",
    logo: "/bronze-logo.svg",
    url: "https://www.aemsinfra.com/",
  },
];

export const TIER_LABEL: Record<SponsorTier, string> = {
  diamond: "DIAMOND",
  gold: "GOLD",
  silver: "SILVER",
  bronze: "BRONZE",
};
