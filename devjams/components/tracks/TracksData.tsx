import React from "react";
import { TrackData } from "../ui/TrackCarousel";

export const CursorIcon = () => (
  <svg viewBox="0 0 24 24" className="w-full h-full drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)]">
    <path d="M5.5 3.21V20.8c0 .45.54.67.85.35l4.86-4.86 3.82 7.64c.15.3.52.42.82.27l2.42-1.21c.3-.15.42-.52.27-.82l-3.82-7.64h6.82c.45 0 .67-.54.35-.85L6.35 2.85c-.24-.24-.85-.07-.85.36z" fill="black" />
  </svg>
);

export const TetrisIcon = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)]">
    <rect x="40" y="40" width="20" height="25" rx="3" fill="black" />
    <circle cx="50" cy="52.5" r="3" fill="white" />
    <rect x="15" y="40" width="20" height="25" rx="3" fill="black" />
    <circle cx="25" cy="52.5" r="3" fill="white" />
    <rect x="65" y="40" width="20" height="25" rx="3" fill="black" />
    <circle cx="75" cy="52.5" r="3" fill="white" />
    <rect x="40" y="70" width="20" height="25" rx="3" fill="black" />
    <rect x="65" y="10" width="20" height="25" rx="3" fill="black" />
  </svg>
);

export const CatStackIcon = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)]">
    <path d="M 10 40 L 35 15 L 50 30 L 65 15 L 90 40 L 50 70 Z" fill="black" stroke="black" strokeWidth="4" strokeLinejoin="round" />
    <circle cx="35" cy="40" r="4" fill="white" />
    <circle cx="65" cy="40" r="4" fill="white" />
    <path d="M 46 48 L 54 48 L 50 53 Z" fill="white" />
    <path d="M 44 54 Q 50 60 56 54" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" />
    <path d="M 15 55 L 50 80 L 85 55" stroke="black" strokeWidth="10" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M 15 70 L 50 95 L 85 70" stroke="black" strokeWidth="10" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const DinoIcon = () => (
  <svg viewBox="0 0 24 24" className="w-full h-full drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)]">
    <path 
      fill="black" 
      d="M13 2h9v7h-2V7h-1V6h-1V5h-1V4h-1V3h-3v1h-1v1h-1v1h-1v1h-1v1H8v1H7v1H6v1H5v1H4v1H3v1H2v1H1v1h1v1h1v1h1v1h1v1h1v1h1v1h1v-1h1v-1h1v-1h1v-1h1v-1h1v-1h1v-1h1v-1h1V8h1V7h1V6h1V5h1V4h1V3h1V2z" 
    />
    <circle cx="16.5" cy="4.5" r="0.75" fill="white" />
  </svg>
);


export const TRACKS_DATA: TrackData[] = [
  {
    id: "t1",
    title: "Open Innovation",
    colorFrom: "#FA3E2C", 
    colorTo: "#CC518B", 
    iconNode: <DinoIcon />,
    iconType: "custom",
  },
  {
    id: "t2",
    title: "Android",
    colorFrom: "#F9AB00", 
    colorTo: "#FFD427", 
    iconSrc: "/assets/android.svg",
    iconType: "svg",
  },
  {
    id: "t3",
    title: "Web 3.0",
    colorFrom: "#34A853", 
    colorTo: "#5CDB6D", 
    iconSrc: "/assets/gemini.svg", 
    iconType: "svg",
  },
  {
    id: "t4",
    title: "UI/UX",
    colorFrom: "#4285F4", 
    colorTo: "#57CAFF", 
    iconNode: <CursorIcon />,
    iconType: "custom",
  },
  {
    id: "t5",
    title: "Game Dev",
    colorFrom: "#EA4335", 
    colorTo: "#FF7DAF", 
    iconNode: <TetrisIcon />,
    iconType: "custom",
  },
  {
    id: "t6",
    title: "Cloud",
    colorFrom: "#F9AB00", 
    colorTo: "#FFD427", 
    iconNode: <CatStackIcon />,
    iconType: "custom",
  },
];
