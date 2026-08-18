"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

interface CharacterState {
  x: number;
  y: number;
  rotation: number;
  scale: number;
}

interface GhostState {
  id: number;
  x: number;
  y: number;
  color: string;
  isFleeing: boolean;
}

interface ScorePopup {
  id: number;
  x: number;
  y: number;
  text: string;
}

const GHOST_COLORS = ["#F97316", "#06B6D4", "#EF4444", "#EC4899"];

// Convert 1D perimeter progress [0..1) into 2D coordinates & angle along the outer perimeter corridors
function getTrackCoord(s: number): { x: number; y: number; rot: number } {
  const normS = ((s % 1) + 1) % 1;

  // Segment 1 (Top Corridor - comfortably above logo): 0.00 -> 0.35
  if (normS < 0.35) {
    const r = normS / 0.35;
    return { x: 5 + r * 90, y: 7.5, rot: 0 };
  }
  // Segment 2 (Right Corridor - comfortably right of '6'): 0.35 -> 0.50
  else if (normS < 0.50) {
    const r = (normS - 0.35) / 0.15;
    return { x: 95, y: 7.5 + r * 83, rot: 90 };
  }
  // Segment 3 (Bottom Corridor - comfortably below descenders with zero clipping): 0.50 -> 0.85
  else if (normS < 0.85) {
    const r = (normS - 0.50) / 0.35;
    return { x: 95 - r * 90, y: 90.5, rot: 180 };
  }
  // Segment 4 (Left Corridor - comfortably left of 'D'): 0.85 -> 1.00
  else {
    const r = (normS - 0.85) / 0.15;
    return { x: 5, y: 90.5 - r * 83, rot: 270 };
  }
}

export function FooterArcadeBoard() {
  const [pacman, setPacman] = useState<CharacterState>({ x: 5, y: 7.5, rotation: 0, scale: 1 });
  const [ghosts, setGhosts] = useState<GhostState[]>([
    { id: 0, x: 45, y: 7.5, color: "#F97316", isFleeing: false },
    { id: 1, x: 95, y: 45, color: "#06B6D4", isFleeing: false },
    { id: 2, x: 45, y: 90.5, color: "#EF4444", isFleeing: false },
  ]);
  const [popups, setPopups] = useState<ScorePopup[]>([]);

  const simRef = useRef({
    pacman: { s: 0.02, speed: 0.035, eatsCount: 0, scale: 1 },
    ghosts: [
      { id: 0, s: 0.25, dir: 1, speed: 0.024, color: "#F97316", timer: 3 },
      { id: 1, s: 0.58, dir: -1, speed: 0.026, color: "#06B6D4", timer: 4 },
      { id: 2, s: 0.85, dir: 1, speed: 0.023, color: "#EF4444", timer: 2 },
    ],
    nextPopupId: 0,
  });

  useEffect(() => {
    let animationFrameId: number;
    let lastTime = performance.now();

    // Exact on-contact collision threshold calibrated to enlarged sprites
    const EAT_THRESHOLD = 0.016;

    const updateSimulation = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      const state = simRef.current;

      // 1. Advance Ghosts along track
      state.ghosts.forEach((g) => {
        g.timer -= dt;

        // Circular distance from Pac-Man to Ghost
        const dClockwise = (g.s - state.pacman.s + 1) % 1;
        const dCounter = (state.pacman.s - g.s + 1) % 1;
        const distToPac = Math.min(dClockwise, dCounter);

        // If Pac-Man is close, ghost tries to flee
        if (distToPac < 0.18) {
          g.dir = dClockwise <= dCounter ? 1 : -1;
        } else if (g.timer <= 0) {
          // Change direction periodically
          g.dir = Math.random() < 0.5 ? 1 : -1;
          g.timer = 3 + Math.random() * 4;
        }

        // Advance ghost position
        g.s = ((g.s + g.dir * g.speed * dt) % 1 + 1) % 1;
      });

      // 2. Pac-Man Chase AI: Find closest ghost along track
      let targetGhost = state.ghosts[0];
      let minDistance = 1;
      let chaseDir = 1;

      state.ghosts.forEach((g) => {
        const dClockwise = (g.s - state.pacman.s + 1) % 1;
        const dCounter = (state.pacman.s - g.s + 1) % 1;
        const shortest = Math.min(dClockwise, dCounter);

        if (shortest < minDistance) {
          minDistance = shortest;
          targetGhost = g;
          chaseDir = dClockwise <= dCounter ? 1 : -1;
        }
      });

      // Advance Pac-Man in chase direction
      state.pacman.s = ((state.pacman.s + chaseDir * state.pacman.speed * dt) % 1 + 1) % 1;

      // 3. Check for EATING EVENT: Pac-Man catches ghost
      state.ghosts.forEach((g) => {
        const dClockwise = (g.s - state.pacman.s + 1) % 1;
        const dCounter = (state.pacman.s - g.s + 1) % 1;
        const dist = Math.min(dClockwise, dCounter);

        if (dist < EAT_THRESHOLD) {
          // GHOST EATEN!
          state.pacman.eatsCount += 1;
          // Pac-Man grows with a strict maximum cap (limit growth to 1.3x)
          const MAX_PACMAN_SCALE = 1.3;
          state.pacman.scale = Math.min(1 + state.pacman.eatsCount * 0.05, MAX_PACMAN_SCALE);

          // Get location of eaten ghost for score popup
          const eatenCoord = getTrackCoord(g.s);
          const scoreValue = 200 * Math.min(state.pacman.eatsCount, 8);
          const popupId = state.nextPopupId++;

          setPopups((prev) => [
            ...prev.slice(-4), // keep last 4 popups
            { id: popupId, x: eatenCoord.x, y: eatenCoord.y, text: `+${scoreValue}` },
          ]);

          // Auto-remove popup after 900ms
          setTimeout(() => {
            setPopups((prev) => prev.filter((p) => p.id !== popupId));
          }, 900);

          // RESPAWN A NEW GHOST on the opposite side of the track
          g.s = ((state.pacman.s + 0.45 + (Math.random() * 0.1 - 0.05)) % 1 + 1) % 1;
          g.dir = Math.random() < 0.5 ? 1 : -1;
          g.speed = 0.045 + Math.random() * 0.012;
          // Pick a fresh random color
          g.color = GHOST_COLORS[Math.floor(Math.random() * GHOST_COLORS.length)];
          g.timer = 2 + Math.random() * 3;
        }
      });

      // Visual coordinates calculation
      const pacCoord = getTrackCoord(state.pacman.s);
      const visualRot = chaseDir === 1 ? pacCoord.rot : (pacCoord.rot + 180) % 360;

      const renderedGhosts: GhostState[] = state.ghosts.map((g) => {
        const coord = getTrackCoord(g.s);
        const dClockwise = (g.s - state.pacman.s + 1) % 1;
        const dCounter = (state.pacman.s - g.s + 1) % 1;
        const dist = Math.min(dClockwise, dCounter);
        return {
          id: g.id,
          x: coord.x,
          y: coord.y,
          color: g.color,
          isFleeing: dist < 0.18,
        };
      });

      setPacman({
        x: pacCoord.x,
        y: pacCoord.y,
        rotation: visualRot,
        scale: state.pacman.scale,
      });

      setGhosts(renderedGhosts);

      animationFrameId = requestAnimationFrame(updateSimulation);
    };

    animationFrameId = requestAnimationFrame(updateSimulation);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <div className="relative w-full rounded-2xl sm:rounded-3xl bg-[#09090b] border border-white/20 p-4 sm:p-6 md:p-8 overflow-hidden select-none shadow-2xl">
      {/* Top Dash Pills Row */}
      <div className="w-full flex items-center justify-between gap-1.5 sm:gap-2.5 mb-1.5 sm:mb-2 opacity-30">
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className="flex-1 h-1 sm:h-2 rounded-full border border-white/40"
          />
        ))}
      </div>

      {/* Dotted Grid Mesh Background */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.4) 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      />

      {/* Central DevJams '26 Gradient SVG Logo with dedicated padding to prevent text overlap */}
      <div className="relative z-10 w-full max-w-full flex items-center justify-center py-6 sm:py-8 md:py-10 px-8 sm:px-12 md:px-16 pointer-events-none">
        <svg
          viewBox="0 0 960 180"
          className="w-full h-auto max-w-[1150px] drop-shadow-[0_0_20px_rgba(255,255,255,0.1)]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="grad-D" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3B7DED" />
              <stop offset="50%" stopColor="#3186FF" />
              <stop offset="100%" stopColor="#749BFF" />
            </linearGradient>

            {/* Mask and Filter from /assets/logo/gdglogo.svg */}
            <mask id="mask0_1227_1702" style={{ maskType: "alpha" }} maskUnits="userSpaceOnUse" x="4" y="5" width="67" height="39">
              <rect x="9.25168" y="16.8596" width="33.429" height="14.2227" rx="7.11135" transform="rotate(30.5381 9.25168 16.8596)" fill="url(#paint0_linear_1227_1702)"/>
              <rect width="33.429" height="14.2227" rx="7.11135" transform="matrix(-0.759465 0.650548 0.650548 0.759465 63.9023 12.0569)" fill="url(#paint1_linear_1227_1702)"/>
              <rect width="33.429" height="14.2227" rx="7.11135" transform="matrix(-0.759465 0.650548 0.650548 0.759465 63.9023 12.0569)" fill="url(#paint2_linear_1227_1702)"/>
              <rect width="33.429" height="14.676" rx="7.33802" transform="matrix(0.759465 -0.650548 -0.650548 -0.759465 11.2584 36.8733)" fill="url(#paint3_linear_1227_1702)"/>
              <rect x="65.083" y="32.6555" width="33.429" height="15.4285" rx="7.71426" transform="rotate(-149.462 65.083 32.6555)" fill="url(#paint4_linear_1227_1702)"/>
              <rect x="65.083" y="32.6555" width="33.429" height="15.4285" rx="7.71426" transform="rotate(-149.462 65.083 32.6555)" fill="url(#paint5_linear_1227_1702)"/>
            </mask>

            <filter id="filter0_f_1227_1702" x="-32.5409" y="-46.5095" width="151.027" height="149.007" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
              <feFlood floodOpacity="0" result="BackgroundImageFix"/>
              <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
              <feGaussianBlur stdDeviation="15" result="effect1_foregroundBlur_1227_1702"/>
            </filter>

            <linearGradient id="paint0_linear_1227_1702" x1="41.4372" y1="24.2591" x2="31.5354" y2="13.5413" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FB413B"/>
              <stop offset="1" stopColor="#FF64A0"/>
            </linearGradient>
            <linearGradient id="paint1_linear_1227_1702" x1="0" y1="7.11135" x2="33.429" y2="7.11135" gradientUnits="userSpaceOnUse">
              <stop stopColor="#EA4335"/>
              <stop offset="0.197115" stopColor="#FF7DAF"/>
              <stop offset="0.365385" stopColor="#F9AB00"/>
              <stop offset="0.5" stopColor="#FFD427"/>
              <stop offset="0.644231" stopColor="#34A853"/>
              <stop offset="0.783654" stopColor="#5CDB6D"/>
              <stop offset="0.923077" stopColor="#4285F4"/>
              <stop offset="1" stopColor="#57CAFF"/>
            </linearGradient>
            <linearGradient id="paint2_linear_1227_1702" x1="33.429" y1="7.29574" x2="-1.00166" y2="6.29592" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FAD917"/>
              <stop offset="0.457033" stopColor="#F74B47"/>
              <stop offset="0.706224" stopColor="#F74B47"/>
              <stop offset="1" stopColor="#FF64A0"/>
            </linearGradient>
            <linearGradient id="paint3_linear_1227_1702" x1="33.429" y1="7.52828" x2="-1.00343" y2="6.5593" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FAD917"/>
              <stop offset="0.457033" stopColor="#F74B47"/>
              <stop offset="0.9675" stopColor="#F74B47"/>
            </linearGradient>
            <linearGradient id="paint4_linear_1227_1702" x1="65.083" y1="40.3698" x2="98.512" y2="40.3698" gradientUnits="userSpaceOnUse">
              <stop stopColor="#EA4335"/>
              <stop offset="0.197115" stopColor="#FF7DAF"/>
              <stop offset="0.365385" stopColor="#F9AB00"/>
              <stop offset="0.5" stopColor="#FFD427"/>
              <stop offset="0.644231" stopColor="#34A853"/>
              <stop offset="0.783654" stopColor="#5CDB6D"/>
              <stop offset="0.923077" stopColor="#4285F4"/>
              <stop offset="1" stopColor="#57CAFF"/>
            </linearGradient>
            <linearGradient id="paint5_linear_1227_1702" x1="97.7572" y1="39.6789" x2="66.0616" y2="39.015" gradientUnits="userSpaceOnUse">
              <stop stopColor="#338BFD"/>
              <stop offset="1" stopColor="#3AC566"/>
            </linearGradient>

            <linearGradient id="grad-e" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFEE48" />
              <stop offset="45%" stopColor="#FBBC04" />
              <stop offset="100%" stopColor="#FC413D" />
            </linearGradient>

            <linearGradient id="grad-v" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FC413D" />
              <stop offset="40%" stopColor="#E43E2B" />
              <stop offset="100%" stopColor="#749BFF" />
            </linearGradient>

            <linearGradient id="grad-J" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2BA24C" />
              <stop offset="100%" stopColor="#00B95C" />
            </linearGradient>

            <linearGradient id="grad-a" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFEE48" />
              <stop offset="50%" stopColor="#FFE432" />
              <stop offset="100%" stopColor="#FBBC04" />
            </linearGradient>

            <linearGradient id="grad-m" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#749BFF" />
              <stop offset="50%" stopColor="#3186FF" />
              <stop offset="100%" stopColor="#3B7DED" />
            </linearGradient>

            <linearGradient id="grad-s" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FC413D" />
              <stop offset="100%" stopColor="#E43E2B" />
            </linearGradient>

            <linearGradient id="grad-quote" x1="50%" y1="0%" x2="20%" y2="100%">
              <stop offset="0%" stopColor="#FC413D" />
              <stop offset="35%" stopColor="#FBBC04" />
              <stop offset="100%" stopColor="#FFE432" />
            </linearGradient>

            <linearGradient id="grad-2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2BA24C" />
              <stop offset="100%" stopColor="#00B95C" />
            </linearGradient>

            <linearGradient id="grad-6" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#749BFF" />
              <stop offset="50%" stopColor="#3186FF" />
              <stop offset="100%" stopColor="#3B7DED" />
            </linearGradient>
          </defs>

          {/* Letter D */}
          <g transform="translate(-0.25, 8.53)" style={{ mixBlendMode: "screen" }}>
            <path
              d="M0.350006 162.647V0.350006H55.3678C72.6462 0.350006 87.4995 3.82563 99.9277 10.7769C112.508 17.577 122.132 27.0972 128.801 39.3374C135.621 51.4266 139.031 65.4802 139.031 81.4983C139.031 97.5164 135.621 111.646 128.801 123.886C122.132 136.126 112.508 145.646 99.9277 152.446C87.4995 159.246 72.6462 162.647 55.3678 162.647H0.350006ZM31.0418 133.633H54.0038C65.9773 133.633 75.9806 131.517 84.0135 127.286C92.0464 122.904 98.0332 116.783 101.974 108.925C106.066 101.068 108.112 91.9251 108.112 81.4983C108.112 70.9203 106.066 61.7779 101.974 54.0711C98.0332 46.2131 92.0464 40.1686 84.0135 35.9374C75.9806 31.5551 65.9773 29.3639 54.0038 29.3639H31.0418V133.633Z"
              fill="url(#grad-D)"
              fillOpacity="0.88"
            />
          </g>

          {/* Letter e */}
          <g transform="translate(114.1, 47.96)" style={{ mixBlendMode: "screen" }}>
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M60.8433 123.288C49.2129 123.288 38.7908 120.642 29.5771 115.349C20.5144 110.057 13.3398 102.798 8.05327 93.5741C2.91776 84.35 0.350006 73.8406 0.350006 62.0458C0.350006 51.0071 2.91776 40.8001 8.05327 31.4247C13.1888 22.0494 20.2124 14.5642 29.124 8.96926C38.0356 3.22309 48.2311 0.350006 59.7105 0.350006C72.0961 0.350006 82.5182 2.99627 90.9767 8.2888C99.4352 13.5813 105.855 20.6884 110.235 29.6101C114.615 38.3806 116.805 48.134 116.805 58.8703C116.805 61.2897 116.73 63.4067 116.579 65.2213C116.428 66.8847 116.277 68.0944 116.126 68.8504L29.376 68.2474C30.0138 72.8839 31.2892 77.0165 33.2022 80.6452C36.072 85.9378 39.9237 90.0206 44.7571 92.8937C49.7415 95.6155 55.2547 96.9765 61.2965 96.9765C68.3955 96.9765 74.3618 95.4643 79.1952 92.44C84.0286 89.2645 87.8047 85.3329 90.5235 80.6452L114.54 92.44C109.102 101.967 102.003 109.527 93.2423 115.122C84.4818 120.566 73.6821 123.288 60.8433 123.288ZM85.9922 39.8171C87.3516 42.539 88.1068 45.1853 88.2579 47.756H30.6348C31.2511 45.6625 32.0313 43.6967 32.9756 41.8586C35.6944 36.4148 39.395 32.1808 44.0774 29.1565C48.9108 26.1322 54.1974 24.62 59.937 24.62C64.3173 24.62 68.169 25.3761 71.4919 26.8883C74.966 28.2492 77.9113 30.0638 80.328 32.332C82.7448 34.6002 84.6328 37.0953 85.9922 39.8171Z"
              fill="url(#grad-e)"
              fillOpacity="0.85"
            />
          </g>

          {/* Exact GDG Logo from /assets/logo/gdglogo.svg */}
          <g transform="translate(166, 6)" style={{ mixBlendMode: "screen" }}>
            <g mask="url(#mask0_1227_1702)">
              <g filter="url(#filter0_f_1227_1702)">
                <path d="M12.5165 47.2439C19.0849 48.9463 19.026 41.3211 21.0289 33.5929C23.0318 25.8655 26.3375 20.9611 19.7691 19.2587C13.2008 17.5562 6.2525 22.4412 4.24871 30.1687C2.24669 37.8968 5.94813 45.5414 12.5165 47.2439Z" fill="#FFE432"/>
                <path d="M38.6292 20.0505C47.3791 19.2815 53.8361 11.4076 53.0502 2.46485C52.2642 -6.47871 44.5337 -13.105 35.783 -12.3359C27.0323 -11.5669 20.5744 -3.69286 21.3603 5.24985C22.1462 14.1926 29.8776 20.8196 38.6292 20.0505Z" fill="#FC413D"/>
                <path d="M37.018 72.3761C46.1135 71.1274 52.1748 60.5625 50.5563 48.7798C48.9387 36.9969 40.2525 28.4575 31.1571 29.7071C22.0616 30.9567 16.0003 41.5208 17.6188 53.3035C19.2372 65.0862 27.9226 73.6258 37.018 72.3761Z" fill="#00B95C"/>
                <path d="M37.016 72.376C46.1115 71.1273 52.1728 60.5624 50.5543 48.7797C48.9367 36.9969 40.2505 28.4574 31.1551 29.707C22.0596 30.9566 15.9983 41.5207 17.6167 53.3034C19.2352 65.0861 27.9206 73.6257 37.016 72.376Z" fill="#00B95C"/>
                <path d="M44.3262 62.4114C51.5741 57.0789 52.6915 46.2877 46.8213 38.308C40.951 30.3274 22.8124 17.7862 15.5636 23.1179C8.31487 28.4513 14.701 49.6375 20.5712 57.618C26.4431 65.5976 37.0774 67.744 44.3262 62.4114Z" fill="#00B95C"/>
                <path d="M74.1639 35.1994C82.771 34.443 89.1583 27.1102 88.43 18.8224C87.7015 10.5338 80.1332 4.42749 71.526 5.18392C62.9189 5.94034 56.5316 13.2731 57.26 21.5617C57.9884 29.8503 65.5567 35.9558 74.1639 35.1994Z" fill="#3186FF"/>
                <path d="M5.6658 39.4636C14.1213 44.7935 25.533 41.8858 31.1552 32.9672C36.7774 24.0494 34.4816 12.4983 26.0261 7.16848C17.5705 1.83781 6.15961 4.74537 0.536632 13.6641C-5.08557 22.5818 -2.78883 34.1337 5.6658 39.4636Z" fill="#FBBC04"/>
                <path d="M47.0557 44.803C57.0865 50.4755 69.4668 47.5624 74.7065 38.2947C79.947 29.0278 76.0629 16.9177 66.0312 11.2453C55.9994 5.5712 43.6201 8.48597 38.3795 17.752C33.1399 27.0197 37.0232 39.1298 47.0549 44.8031L47.0557 44.803Z" fill="#3186FF"/>
                <path d="M60.2369 -2.38256C62.9311 0.678217 60.3971 7.31112 54.5784 12.4341C48.7588 17.5572 41.8577 19.2286 39.1636 16.1687C36.4693 13.107 39.0024 6.47335 44.8212 1.35122C50.6408 -3.77184 57.5427 -5.44335 60.236 -2.38334L60.2369 -2.38256Z" fill="#749BFF"/>
                <path d="M61.2071 13.7357C70.0443 3.96524 72.2844 -8.40828 66.2115 -13.9013C60.1387 -19.3943 48.0509 -15.9281 39.2138 -6.15769C30.3767 3.61275 28.1357 15.9863 34.2094 21.4793C40.2823 26.9722 52.37 23.5061 61.2071 13.7357Z" fill="#FC413D"/>
                <path d="M14.9083 40.5788C20.9869 44.1692 27.6065 44.214 29.6946 40.6799C31.7826 37.1449 24.1106 25.8844 18.032 22.2941C11.9543 18.7037 7.98979 22.5411 5.90254 26.0752C3.81451 29.6102 8.82979 36.9885 14.9083 40.5788Z" fill="#FFEE48"/>
              </g>
            </g>
          </g>

          {/* Letter v */}
          <g transform="translate(193.51, 55.68)" style={{ mixBlendMode: "screen" }}>
            <path
              d="M49.4734 115.648L0.528809 0.350006H34.2915L63.5224 75.4065H65.3351L95.0191 0.350006H128.329L78.9309 115.648H49.4734Z"
              fill="url(#grad-v)"
              fillOpacity="0.85"
            />
          </g>

          {/* Letter J */}
          <g transform="translate(271.25, 4.66)" style={{ mixBlendMode: "screen" }}>
            <path
              d="M54.0183 166.582C41.2052 166.582 29.9748 163.1 20.3273 156.136C10.8305 149.021 4.19777 139.407 0.429199 127.295L28.4674 115.713C30.4271 122.829 33.5926 128.279 37.9642 132.064C42.3357 135.698 47.6871 137.514 54.0183 137.514C60.9525 137.514 66.3792 135.244 70.2985 130.702C74.3686 126.16 76.4036 119.801 76.4036 111.626V0.350006H106.929V111.399C106.929 123.51 104.517 133.654 99.6934 141.829C95.0204 150.005 88.6892 156.212 80.6998 160.451C72.7104 164.539 63.8166 166.582 54.0183 166.582Z"
              fill="url(#grad-J)"
              fillOpacity="0.88"
            />
          </g>

          {/* Letter a */}
          <g transform="translate(353.18, 47.52)" style={{ mixBlendMode: "screen" }}>
            <path
              d="M42.1769 123.288C34.0376 123.288 26.8027 121.7 20.4721 118.525C14.2923 115.198 9.39363 110.586 5.77617 104.688C2.15871 98.791 0.349976 91.9864 0.349976 84.2744C0.349976 76.26 2.38479 69.3797 6.45443 63.6335C10.6748 57.8874 16.2517 53.4265 23.1852 50.251C30.2694 47.0755 38.1072 45.4877 46.6987 45.4877C51.3713 45.4877 55.5916 45.7901 59.3598 46.395C63.2787 46.8487 66.7455 47.4535 69.76 48.2096C72.7746 48.9657 75.2616 49.7973 77.221 50.7046V45.7145C77.221 39.5147 74.8848 34.449 70.2122 30.5174C65.5396 26.4346 59.1337 24.3932 50.9944 24.3932C45.5682 24.3932 40.2928 25.6785 35.168 28.2492C30.194 30.6686 26.049 33.9198 22.733 38.0026L3.74135 23.0323C7.50954 18.1934 11.8806 14.1106 16.8546 10.7838C21.8286 7.3059 27.3302 4.73525 33.3593 3.07188C39.3884 1.2573 45.719 0.350006 52.351 0.350006C69.9861 0.350006 83.4008 4.43281 92.5952 12.5984C101.79 20.764 106.387 32.71 106.387 48.4364V123.288H77.221V107.864H75.4123C73.3021 110.586 70.6644 113.156 67.4991 115.576C64.3338 117.844 60.641 119.659 56.4206 121.02C52.2002 122.532 47.4523 123.288 42.1769 123.288ZM49.1857 100.152C55.2148 100.152 60.2642 98.8667 64.3338 96.296C68.5542 93.5741 71.7195 90.0962 73.8296 85.8622C76.0906 81.6281 77.221 77.1673 77.221 72.4796C73.905 70.8163 70.1368 69.5309 65.9165 68.6236C61.6961 67.5651 57.4003 67.0359 53.0292 67.0359C44.287 67.0359 38.258 68.6992 34.942 72.026C31.6259 75.3527 29.9679 79.4355 29.9679 84.2744C29.9679 88.8108 31.5506 92.5912 34.7158 95.6155C38.0318 98.6398 42.8552 100.152 49.1857 100.152Z"
              fill="url(#grad-a)"
              fillOpacity="0.88"
            />
          </g>

          {/* Letter m */}
          <g transform="translate(448.28, 51.62)" style={{ mixBlendMode: "screen" }}>
            <path
              d="M0.349976 119.584V3.97688H28.2474V18.4844H30.0619C32.4812 14.8575 35.4297 11.684 38.9074 8.96383C42.3851 6.24367 46.3165 4.128 50.7015 2.6168C55.2376 1.1056 60.0762 0.350006 65.2172 0.350006C73.6847 0.350006 80.867 2.31457 86.764 6.24368C92.8123 10.1728 97.046 15.0086 99.4653 20.7512C102.943 15.1597 107.857 10.3995 114.208 6.47036C120.71 2.39012 128.724 0.350006 138.25 0.350006C151.707 0.350006 161.762 4.43024 168.415 12.5907C175.219 20.7512 178.621 31.6318 178.621 45.2326V119.584H149.136V50.6729C149.136 43.268 147.397 37.6766 143.92 33.8986C140.442 29.9695 135.755 28.0049 129.858 28.0049C124.717 28.0049 120.18 29.4406 116.249 32.3118C112.469 35.032 109.52 38.8856 107.404 43.8725C105.438 48.8595 104.455 54.6776 104.455 61.3269V119.584H74.7432V50.6729C74.7432 43.268 72.9287 37.6766 69.2998 33.8986C65.822 29.9695 60.8323 28.0049 54.3304 28.0049C49.4918 28.0049 45.1824 29.4406 41.4023 32.3118C37.7734 35.032 34.9761 38.8856 33.0104 43.8725C31.0447 48.8595 30.0619 54.6776 30.0619 61.3269V119.584H0.349976Z"
              fill="url(#grad-m)"
              fillOpacity="0.88"
            />
          </g>

          {/* Letter s */}
          <g transform="translate(607.61, 47.96)" style={{ mixBlendMode: "screen" }}>
            <path
              d="M52.8499 123.288C42.8681 123.288 34.323 121.851 27.2147 118.978C20.2577 116.105 14.5862 112.325 10.2002 107.637C5.81425 102.949 2.56261 97.8082 0.445251 92.2132L26.9879 80.6452C29.5589 86.089 33.0375 90.2474 37.4235 93.1205C41.8094 95.8424 46.9515 97.2033 52.8499 97.2033C57.6896 97.2033 62.0755 96.4472 66.0078 94.9351C69.94 93.2717 71.9061 90.323 71.9061 86.089C71.9061 83.0647 70.8475 80.7208 68.7301 79.0575C66.764 77.2429 64.2685 75.882 61.2437 74.9747C58.2189 73.9162 55.1185 73.0845 51.9425 72.4796L38.3309 69.5309C32.735 68.3212 27.4416 66.2042 22.4507 63.1799C17.4598 60.0044 13.3763 56.0728 10.2002 51.3851C7.17541 46.5462 5.66305 41.0269 5.66305 34.827C5.66305 27.8712 7.62918 21.8226 11.5614 16.6812C15.6449 11.5399 21.0895 7.53272 27.8953 4.65964C34.8524 1.78655 42.49 0.350006 50.8082 0.350006C58.5215 0.350006 65.4785 1.2573 71.6793 3.07188C77.8802 4.88646 83.2491 7.68394 87.7863 11.4643C92.3235 15.0935 95.9533 19.7812 98.6756 25.5273L73.2673 36.6416C70.8475 32.1052 67.6714 28.9297 63.7392 27.1151C59.9582 25.3005 55.8747 24.3932 51.4888 24.3932C46.3466 24.3932 42.2631 25.3761 39.2383 27.3419C36.2135 29.3077 34.7011 31.6515 34.7011 34.3734C34.7011 37.2465 36.2135 39.7415 39.2383 41.8586C42.2631 43.9756 45.8928 45.5633 50.1276 46.6218L67.1421 50.7046C78.6363 53.4265 87.257 57.8118 93.0041 63.8604C98.9025 69.909 101.852 77.1673 101.852 85.6353C101.852 93.1961 99.6587 99.8496 95.2727 105.596C90.8868 111.191 84.9885 115.576 77.5777 118.751C70.1669 121.776 61.9243 123.288 52.8499 123.288Z"
              fill="url(#grad-s)"
              fillOpacity="0.88"
            />
          </g>

          {/* Letter ' (Quote) */}
          <g transform="translate(724.43, 1.98)" style={{ mixBlendMode: "screen" }}>
            <path
              d="M 24 1 C 33.39 1 41 8.61 41 18 C 41 22.5 39.5 27 38 31 L 24 53 L 10 43 L 15 28 C 10.1 26 7 21.4 7 18 C 7 8.61 14.61 1 24 1 Z"
              fill="url(#grad-quote)"
              fillOpacity="0.9"
            />
          </g>

          {/* Letter 2 */}
          <g transform="translate(773.45, 4.66)" style={{ mixBlendMode: "screen" }}>
            <path
              d="M1.78691 166.582V139.558C2.08957 139.255 3.45151 137.893 5.87275 135.471C8.294 132.897 11.3205 129.642 14.9524 125.706C18.7356 121.769 22.7458 117.53 26.983 112.988C31.3715 108.446 35.6087 104.056 39.6946 99.8169C43.9317 95.4265 47.7149 91.4902 51.0441 88.0081C54.3733 84.526 56.7945 81.9522 58.3078 80.2869C63.6043 74.6852 67.3119 69.5378 69.4304 64.8445C71.549 59.9999 72.6083 55.0038 72.6083 49.8564C72.6083 46.5257 71.776 43.195 70.1114 39.8643C68.4468 36.5336 65.9499 33.8084 62.6207 31.6889C59.4428 29.418 55.5839 28.2825 51.0441 28.2825C46.5043 28.2825 42.6454 29.1909 39.4675 31.0076C36.2897 32.8244 33.7171 35.171 31.7498 38.0475C29.7825 40.924 28.2693 44.0276 27.21 47.3583L0.424988 36.2308C1.63561 32.1431 3.60288 27.9797 6.32678 23.7406C9.05068 19.5016 12.5312 15.641 16.7684 12.1589C21.0055 8.52537 25.9993 5.64885 31.7498 3.52931C37.6516 1.40978 44.2344 0.350006 51.4981 0.350006C62.0911 0.350006 71.1707 2.62094 78.7371 7.16282C86.4548 11.7047 92.3566 17.6091 96.4425 24.8761C100.68 32.1431 102.798 40.0157 102.798 48.4938C102.798 54.8524 101.663 61.1354 99.3933 67.3426C97.2747 73.3984 94.3239 79.1514 90.5407 84.6017C86.9088 90.0519 82.823 95.1994 78.2832 100.044C76.1646 102.466 73.6677 105.116 70.7924 107.992C68.0685 110.869 65.269 113.897 62.3937 117.076C59.5185 120.104 56.7189 123.056 53.995 125.933C51.2711 128.809 48.7742 131.459 46.5043 133.881C44.3857 136.152 42.6454 137.893 41.2835 139.104L41.9645 140.467H104.841V166.582H1.78691Z"
              fill="url(#grad-J)"
              fillOpacity="0.88"
            />
          </g>

          {/* Letter 6 */}
          <g transform="translate(844.59, 0)" style={{ mixBlendMode: "screen" }}>
            <path
              d="M56.2517 171.347C47.6165 171.347 39.7387 169.836 32.6184 166.815C25.6497 163.642 19.7413 159.488 14.8935 154.351C10.1971 149.517 6.56123 143.701 3.98582 136.902C1.56189 129.953 0.349976 123.004 0.349976 116.055C0.349976 105.631 2.54665 95.8863 6.94001 86.822C11.3334 77.7577 16.4842 68.5423 22.3925 59.1758C25.2709 54.6436 28.2251 49.8848 31.255 44.8994C34.2849 39.914 37.3906 34.9287 40.572 29.9433C43.9049 24.8068 47.162 19.7459 50.3434 14.7605C53.5248 9.77512 56.7062 5.01634 59.8876 0.484161L83.0664 16.3468C80.794 19.9725 78.2943 23.9759 75.5674 28.357C72.8405 32.587 69.962 36.9681 66.9321 41.5003C64.0537 46.0325 61.251 50.4136 58.5241 54.6436C55.7972 58.8736 53.2976 62.726 51.0251 66.2006L52.3886 67.5603C54.0551 66.8049 55.873 66.2762 57.8424 65.974C59.8119 65.5208 61.9328 65.2942 64.2052 65.2942C72.0829 65.2942 79.582 67.5603 86.7022 72.0925C93.8225 76.6246 99.6551 82.8186 104.2 90.6744C108.745 98.3791 111.017 107.217 111.017 117.188C111.017 124.892 109.502 132.068 106.472 138.715C103.594 145.363 99.5794 151.103 94.4285 155.938C89.2777 160.772 83.3693 164.549 76.7035 167.268C70.1893 169.987 63.372 171.347 56.2517 171.347ZM55.57 144.154C60.2664 144.154 64.5839 143.021 68.5228 140.755C72.4617 138.338 75.6431 135.09 78.067 131.011C80.6425 126.932 81.9302 122.4 81.9302 117.414C81.9302 112.278 80.6425 107.67 78.067 103.591C75.6431 99.361 72.386 96.0374 68.2956 93.6203C64.3568 91.2031 60.1149 89.9945 55.57 89.9945C51.1766 89.9945 46.9348 91.2031 42.8444 93.6203C38.9055 96.0374 35.6484 99.361 33.073 103.591C30.649 107.67 29.4371 112.278 29.4371 117.414C29.4371 122.4 30.649 126.932 33.073 131.011C35.6484 135.09 38.9055 138.338 42.8444 140.755C46.7833 143.021 51.0252 144.154 55.57 144.154Z"
              fill="url(#grad-6)"
              fillOpacity="0.88"
            />
          </g>
        </svg>
      </div>

      {/* --- FLOATING SCORE POPUPS --- */}
      {popups.map((popup) => (
        <div
          key={popup.id}
          className="absolute z-30 pointer-events-none text-yellow-400 font-mono font-bold text-xs sm:text-sm animate-bounce"
          style={{
            left: `${popup.x}%`,
            top: `${popup.y - 3}%`,
            transform: "translate(-50%, -100%)",
          }}
        >
          {popup.text}
        </div>
      ))}

      {/* --- DYNAMIC ARCADE CHASE & EAT ANIMATION (USING OFFICIAL ASSETS) --- */}
      {/* 1. Pac-Man (Rendered from official pacman.svg asset) */}
      <div
        className="absolute w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 z-20 pointer-events-none transition-transform duration-75 ease-out filter drop-shadow-[0_0_12px_rgba(255,228,50,0.4)]"
        style={{
          left: `${pacman.x}%`,
          top: `${pacman.y}%`,
          transform: `translate(-50%, -50%) rotate(${pacman.rotation + 180}deg) scale(${pacman.scale})`,
        }}
      >
        <Image
          src="/assets/logo/pacman.svg"
          alt="Pac-Man"
          width={51}
          height={50}
          className="w-full h-full object-contain pointer-events-none"
        />
      </div>

      {/* 2. Ghosts (Rendered from official ghost.svg & ghost1.svg assets) */}
      {ghosts.map((ghost) => (
        <div
          key={ghost.id}
          className="absolute w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 z-20 pointer-events-none transition-transform duration-75 filter drop-shadow-[0_0_12px_rgba(255,255,255,0.3)]"
          style={{
            left: `${ghost.x}%`,
            top: `${ghost.y}%`,
            transform: "translate(-50%, -50%)",
          }}
        >
          <Image
            src={ghost.id % 2 === 1 ? "/assets/logo/ghost1.svg" : "/assets/logo/ghost.svg"}
            alt="Ghost"
            width={47}
            height={47}
            className="w-full h-full object-contain pointer-events-none"
          />
        </div>
      ))}
    </div>
  );
}
