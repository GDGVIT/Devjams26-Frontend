import { TrackData } from "../ui/TrackCarousel";

export const TRACKS_DATA: TrackData[] = [
  {
    id: "aiml",
    // Reka sponsors this track, so the name carries through everywhere the
    // title is shown; the card also gets a sticker.
    title: "Reka AI/ML",
    sponsored: true,
    colorFrom: "#7AD97A",
    colorTo: "#3EA655",
    iconSrc: "/assets/logo/aiml.svg",
  },
  {
    id: "arvr",
    title: "AR/VR",
    colorFrom: "#82A7FF",
    colorTo: "#4D7DF0",
    iconSrc: "/assets/logo/arvr.svg",
  },
  {
    id: "fintech",
    title: "FinTech & Financial Institution",
    colorFrom: "#7AD97A",
    colorTo: "#3EA655",
    iconSrc: "/assets/logo/fintech.svg",
  },
  {
    id: "devtools",
    title: "Dev Tools & Infra",
    colorFrom: "#E85B69",
    colorTo: "#CF404E",
    iconSrc: "/assets/logo/devtools&infra.svg",
  },
  {
    id: "openinnovation",
    title: "Open Innovation",
    colorFrom: "#E2574C",
    colorTo: "#B84A88",
    iconSrc: "/assets/logo/openinnovation.svg",
  },
  {
    id: "multimedia",
    title: "Multimedia Tech",
    colorFrom: "#FDC926",
    colorTo: "#E6761A",
    iconSrc: "/assets/logo/multimedia.svg",
  },
];
