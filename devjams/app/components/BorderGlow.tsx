"use client";

import { useCallback, useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import "./BorderGlow.css";

type BorderGlowProps = {
  children: ReactNode;
  className?: string;
  edgeSensitivity?: number;
  glowColor?: string;
  backgroundColor?: string;
  borderRadius?: number;
  glowRadius?: number;
  glowIntensity?: number;
  coneSpread?: number;
  animated?: boolean;
  colors?: string[];
  fillOpacity?: number;
};

type BorderGlowStyle = CSSProperties & Record<`--${string}`, string | number>;

const gradientPositions = [
  "80% 55%",
  "69% 34%",
  "8% 6%",
  "41% 38%",
  "86% 85%",
  "82% 18%",
  "51% 4%",
];
const gradientKeys = [
  "--gradient-one",
  "--gradient-two",
  "--gradient-three",
  "--gradient-four",
  "--gradient-five",
  "--gradient-six",
  "--gradient-seven",
] as const;
const colorMap = [0, 1, 2, 3, 0, 1, 2];

function parseHsl(hsl: string) {
  const match = hsl.match(/([\d.]+)\s*([\d.]+)%?\s*([\d.]+)%?/);
  if (!match) return { h: 40, s: 80, l: 80 };
  return { h: Number(match[1]), s: Number(match[2]), l: Number(match[3]) };
}

function buildGlowVars(glowColor: string, intensity: number) {
  const { h, s, l } = parseHsl(glowColor);
  const opacities = [100, 60, 50, 40, 30, 20, 10];
  const keys = ["", "-60", "-50", "-40", "-30", "-20", "-10"];
  return Object.fromEntries(
    opacities.map((opacity, index) => [
      `--glow-color${keys[index]}`,
      `hsl(${h}deg ${s}% ${l}% / ${Math.min(opacity * intensity, 100)}%)`,
    ]),
  );
}

function buildGradientVars(colors: string[]) {
  const safeColors = colors.length > 0 ? colors : ["#c084fc"];
  const vars: Record<string, string> = {};
  for (let index = 0; index < gradientPositions.length; index += 1) {
    const color = safeColors[Math.min(colorMap[index], safeColors.length - 1)];
    vars[gradientKeys[index]] = `radial-gradient(at ${gradientPositions[index]}, ${color} 0px, transparent 50%)`;
  }
  vars["--gradient-base"] = `linear-gradient(${safeColors[0]} 0 100%)`;
  return vars;
}

function easeOutCubic(value: number) {
  return 1 - (1 - value) ** 3;
}

function easeInCubic(value: number) {
  return value ** 3;
}

function animateValue({
  start = 0,
  end = 100,
  duration = 1000,
  delay = 0,
  ease = easeOutCubic,
  onUpdate,
  onEnd,
}: {
  start?: number;
  end?: number;
  duration?: number;
  delay?: number;
  ease?: (value: number) => number;
  onUpdate: (value: number) => void;
  onEnd?: () => void;
}) {
  let frame = 0;
  const timeout = window.setTimeout(() => {
    const startedAt = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - startedAt) / duration, 1);
      onUpdate(start + (end - start) * ease(progress));
      if (progress < 1) frame = window.requestAnimationFrame(tick);
      else onEnd?.();
    };
    frame = window.requestAnimationFrame(tick);
  }, delay);

  return () => {
    window.clearTimeout(timeout);
    window.cancelAnimationFrame(frame);
  };
}

export default function BorderGlow({
  children,
  className = "",
  edgeSensitivity = 30,
  glowColor = "40 80 80",
  backgroundColor = "#120F17",
  borderRadius = 28,
  glowRadius = 40,
  glowIntensity = 1,
  coneSpread = 25,
  animated = false,
  colors = ["#c084fc", "#f472b6", "#38bdf8"],
  fillOpacity = 0.5,
}: BorderGlowProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const getCenter = useCallback((element: HTMLElement) => {
    const { width, height } = element.getBoundingClientRect();
    return [width / 2, height / 2] as const;
  }, []);

  const getEdgeProximity = useCallback(
    (element: HTMLElement, x: number, y: number) => {
      const [centerX, centerY] = getCenter(element);
      const dx = x - centerX;
      const dy = y - centerY;
      const xRatio = dx === 0 ? Infinity : centerX / Math.abs(dx);
      const yRatio = dy === 0 ? Infinity : centerY / Math.abs(dy);
      return Math.min(Math.max(1 / Math.min(xRatio, yRatio), 0), 1);
    },
    [getCenter],
  );

  const getCursorAngle = useCallback(
    (element: HTMLElement, x: number, y: number) => {
      const [centerX, centerY] = getCenter(element);
      const dx = x - centerX;
      const dy = y - centerY;
      if (dx === 0 && dy === 0) return "0deg";
      const angle = Math.atan2(dy, dx) * (180 / Math.PI) + 90;
      return `${angle < 0 ? angle + 360 : angle}deg`;
    },
    [getCenter],
  );

  const handlePointerMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      const card = cardRef.current;
      if (!card) return;
      const rect = card.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      card.style.setProperty("--edge-proximity", `${(getEdgeProximity(card, x, y) * 100).toFixed(3)}`);
      card.style.setProperty("--cursor-angle", getCursorAngle(card, x, y));
    },
    [getCursorAngle, getEdgeProximity],
  );

  useEffect(() => {
    if (!animated || !cardRef.current) return;
    const card = cardRef.current;
    card.classList.add("sweep-active");
    card.style.setProperty("--cursor-angle", "110deg");

    const cleanups = [
      animateValue({ duration: 500, onUpdate: (value) => card.style.setProperty("--edge-proximity", `${value}`) }),
      animateValue({
        ease: easeInCubic,
        duration: 1500,
        end: 50,
        onUpdate: (value) => card.style.setProperty("--cursor-angle", `${(465 - 110) * (value / 100) + 110}deg`),
      }),
      animateValue({
        ease: easeOutCubic,
        delay: 1500,
        duration: 2250,
        start: 50,
        end: 100,
        onUpdate: (value) => card.style.setProperty("--cursor-angle", `${(465 - 110) * (value / 100) + 110}deg`),
      }),
      animateValue({
        ease: easeInCubic,
        delay: 2500,
        duration: 1500,
        start: 100,
        end: 0,
        onUpdate: (value) => card.style.setProperty("--edge-proximity", `${value}`),
        onEnd: () => card.classList.remove("sweep-active"),
      }),
    ];

    return () => {
      cleanups.forEach((cleanup) => cleanup());
      card.classList.remove("sweep-active");
    };
  }, [animated]);

  const style: BorderGlowStyle = {
    "--card-bg": backgroundColor,
    "--edge-sensitivity": edgeSensitivity,
    "--border-radius": `${borderRadius}px`,
    "--glow-padding": `${glowRadius}px`,
    "--cone-spread": coneSpread,
    "--fill-opacity": fillOpacity,
    ...buildGlowVars(glowColor, glowIntensity),
    ...buildGradientVars(colors),
  };

  return (
    <div
      ref={cardRef}
      onPointerMove={handlePointerMove}
      className={`border-glow-card ${className}`.trim()}
      style={style}
    >
      <span className="edge-light" />
      <div className="border-glow-inner">{children}</div>
    </div>
  );
}
