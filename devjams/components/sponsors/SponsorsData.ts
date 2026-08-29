export type SponsorTier = "diamond" | "platinum" | "gold" | "silver" | "bronze";

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
  /** Decoration asset sitting on top of the card. */
  topDeco?: string;
  /** Decoration asset sitting at the bottom of the card. */
  bottomDeco?: string;
}

export const SPONSORS: Sponsor[] = [
  {
    id: "reka",
    tier: "diamond",
    name: "Reka",
    logo: "/assets/reka-spons.svg",
    url: "https://reka.ai/",
    dino: true,
  },
  {
    id: "bank-of-india",
    tier: "platinum",
    name: "Bank of India",
    logo: "/assets/bank-of-india.svg",
    url: "https://bankofindia.co.in/",
    topDeco: "/assets/sponsc1.svg",
  },
  {
    id: "exasol",
    tier: "gold",
    name: "Exasol",
    logo: "/assets/exasol-light.svg",
    url: "https://www.exasol.com/",
  },
  {
    id: "bank-of-baroda",
    tier: "silver",
    name: "Bank of Baroda",
    logo: "/assets/bank-of-baroda.svg",
    url: "https://www.bankofbaroda.in/",
    bottomDeco: "/assets/sponsc2.svg",
  },
  {
    id: "aems",
    tier: "bronze",
    name: "AEMS",
    logo: "/assets/bronze-logo.svg",
    url: "https://www.aemsinfra.com/",
  },
];

export const TIER_LABEL: Record<SponsorTier, string> = {
  diamond: "DIAMOND",
  platinum: "PLATINUM",
  gold: "GOLD",
  silver: "SILVER",
  bronze: "BRONZE",
};
