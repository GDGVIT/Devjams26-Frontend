"use client";

import { useState, useEffect, useRef, useCallback, type RefObject } from "react";
import Image from "next/image";
import { type MotionValue } from "../gsap-motion";

export interface TrackData {
  id: string;
  title: string;
  colorFrom: string;
  colorTo: string;
  iconSrc: string;
}

interface TrackCarouselProps {
  tracks: TrackData[];
  scrollProgress?: MotionValue<number>;
  sectionRef?: RefObject<HTMLElement | null>;
}

export function TrackCarousel({ tracks, scrollProgress, sectionRef }: TrackCarouselProps) {
  // Mobile active index & gestures
  const [mobileActiveIndex, setMobileActiveIndex] = useState(0);
  const [mobileSmoothedFloat, setMobileSmoothedFloat] = useState(0);
  const mobileTargetFloatRef = useRef(0);
  const mobileCurrentFloatRef = useRef(0);
  const mobileRafIdRef = useRef<number | null>(null);

  const touchStartXRef = useRef(0);
  const isDraggingMobileRef = useRef(false);

  // Desktop smooth continuous progress tracking with lerping (RAF)
  const [desktopSmoothedFloat, setDesktopSmoothedFloat] = useState(0);
  const desktopTargetFloatRef = useRef(0);
  const desktopCurrentFloatRef = useRef(0);
  const desktopRafIdRef = useRef<number | null>(null);

  // 1. Desktop RAF loop for smooth momentum
  useEffect(() => {
    if (!scrollProgress) return;

    const updateTarget = (latest: number) => {
      desktopTargetFloatRef.current = latest * (tracks.length - 1);
    };

    const initial = scrollProgress.get();
    desktopTargetFloatRef.current = initial * (tracks.length - 1);
    desktopCurrentFloatRef.current = initial * (tracks.length - 1);
    setDesktopSmoothedFloat(initial * (tracks.length - 1));

    const unsubscribe = scrollProgress.on("change", updateTarget);

    const lerpLoop = () => {
      const diff = desktopTargetFloatRef.current - desktopCurrentFloatRef.current;
      if (Math.abs(diff) > 0.0005) {
        desktopCurrentFloatRef.current += diff * 0.14;
        setDesktopSmoothedFloat(desktopCurrentFloatRef.current);
      } else if (desktopCurrentFloatRef.current !== desktopTargetFloatRef.current) {
        desktopCurrentFloatRef.current = desktopTargetFloatRef.current;
        setDesktopSmoothedFloat(desktopCurrentFloatRef.current);
      }
      desktopRafIdRef.current = requestAnimationFrame(lerpLoop);
    };

    desktopRafIdRef.current = requestAnimationFrame(lerpLoop);

    return () => {
      unsubscribe();
      if (desktopRafIdRef.current) {
        cancelAnimationFrame(desktopRafIdRef.current);
      }
    };
  }, [scrollProgress, tracks.length]);

  // 2. Mobile RAF loop for smooth 3D coverflow animations and touch-dragging
  useEffect(() => {
    const lerpLoop = () => {
      const diff = mobileTargetFloatRef.current - mobileCurrentFloatRef.current;
      if (Math.abs(diff) > 0.0005) {
        mobileCurrentFloatRef.current += diff * 0.16;
        setMobileSmoothedFloat(mobileCurrentFloatRef.current);
      } else if (mobileCurrentFloatRef.current !== mobileTargetFloatRef.current) {
        mobileCurrentFloatRef.current = mobileTargetFloatRef.current;
        setMobileSmoothedFloat(mobileCurrentFloatRef.current);
      }
      mobileRafIdRef.current = requestAnimationFrame(lerpLoop);
    };

    mobileRafIdRef.current = requestAnimationFrame(lerpLoop);

    return () => {
      if (mobileRafIdRef.current) {
        cancelAnimationFrame(mobileRafIdRef.current);
      }
    };
  }, []);

  // Update target when mobile active index changes programmatically
  const setMobileIndex = useCallback(
    (index: number) => {
      const clamped = Math.max(0, Math.min(tracks.length - 1, index));
      setMobileActiveIndex(clamped);
      mobileTargetFloatRef.current = clamped;
    },
    [tracks.length]
  );

  // Mobile navigation handlers
  const handleMobileNext = useCallback(() => {
    setMobileActiveIndex((prev) => {
      const next = (prev + 1) % tracks.length;
      mobileTargetFloatRef.current = next;
      return next;
    });
  }, [tracks.length]);

  const handleMobilePrev = useCallback(() => {
    setMobileActiveIndex((prev) => {
      const prevIdx = (prev - 1 + tracks.length) % tracks.length;
      mobileTargetFloatRef.current = prevIdx;
      return prevIdx;
    });
  }, [tracks.length]);

  // Desktop dot click -> smooth window scroll to matching track percentage
  const handleDesktopSelectDot = useCallback(
    (index: number) => {
      const section = sectionRef?.current;
      if (!section) return;
      const sectionTop = section.offsetTop;
      const scrollableDistance = section.offsetHeight - window.innerHeight;
      const targetScroll = sectionTop + (index / (tracks.length - 1)) * scrollableDistance;
      window.scrollTo({
        top: Math.max(0, targetScroll),
        behavior: "smooth",
      });
    },
    [sectionRef, tracks.length]
  );

  // Mobile Touch Handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
    isDraggingMobileRef.current = true;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDraggingMobileRef.current) return;
    const currentX = e.touches[0].clientX;
    const delta = currentX - touchStartXRef.current;
    // Real-time 3D drag interpolation
    const newTarget = mobileActiveIndex - delta / 180;
    mobileTargetFloatRef.current = Math.max(-0.5, Math.min(tracks.length - 0.5, newTarget));
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!isDraggingMobileRef.current) return;
    isDraggingMobileRef.current = false;
    const delta = (e.changedTouches?.[0]?.clientX || touchStartXRef.current) - touchStartXRef.current;

    if (delta < -40) {
      handleMobileNext();
    } else if (delta > 40) {
      handleMobilePrev();
    } else {
      mobileTargetFloatRef.current = mobileActiveIndex;
    }
  };

  const desktopActiveIndex = Math.min(
    tracks.length - 1,
    Math.max(0, Math.round(desktopSmoothedFloat))
  );

  // 3. Mobile 3D Coverflow Card Styling (Continuous and smooth)
  const getMobileCardStyle = (index: number) => {
    const d = index - mobileSmoothedFloat;
    const absD = Math.abs(d);
    const sign = Math.sign(d) || 1;

    // Smooth horizontal offset
    const offsetX =
      d === 0
        ? 0
        : sign *
          Math.min(300, absD * 120 + Math.pow(Math.min(1, absD), 0.75) * 35);

    // Inward rotation: left (+angle), right (-angle)
    const rotateY =
      d === 0
        ? 0
        : -sign *
          Math.min(
            48,
            Math.pow(Math.min(1, absD), 0.75) * 44 + Math.max(0, absD - 1) * 3
          );

    // Scale
    const scale = Math.max(
      0.68,
      1 - Math.pow(Math.min(1, absD), 0.8) * 0.16 - Math.max(0, absD - 1) * 0.06
    );

    // Depth Z
    const translateZ =
      35 -
      Math.min(
        110,
        Math.pow(Math.min(1, absD), 0.8) * 40 + Math.max(0, absD - 1) * 30
      );

    const zIndex = Math.round(50 - absD * 6);

    const opacity = Math.max(
      0.35,
      1 - Math.pow(Math.min(1, absD), 0.8) * 0.18 - Math.max(0, absD - 1) * 0.2
    );

    return {
      transform: `translate3d(calc(-50% + ${offsetX.toFixed(2)}px), -50%, ${translateZ.toFixed(2)}px) rotateY(${rotateY.toFixed(2)}deg) scale(${scale.toFixed(3)})`,
      zIndex,
      opacity,
      boxShadow:
        absD < 0.3
          ? "0 20px 50px -10px rgba(0,0,0,0.9), 0 0 25px rgba(255,255,255,0.18)"
          : "0 12px 30px rgba(0,0,0,0.7)",
    };
  };

  // 4. Desktop 3D Coverflow Card Styling (Continuous and smooth)
  const getDesktopCardStyle = (index: number) => {
    const d = index - desktopSmoothedFloat;
    const absD = Math.abs(d);
    const sign = Math.sign(d) || 1;

    // Smooth horizontal offset
    const offsetX =
      d === 0
        ? 0
        : sign *
          Math.min(520, absD * 190 + Math.pow(Math.min(1, absD), 0.75) * 60);

    // Inward rotation: left (+angle), right (-angle)
    const rotateY =
      d === 0
        ? 0
        : -sign *
          Math.min(
            50,
            Math.pow(Math.min(1, absD), 0.75) * 46 + Math.max(0, absD - 1) * 3
          );

    // Scale
    const scale = Math.max(
      0.72,
      1 - Math.pow(Math.min(1, absD), 0.8) * 0.12 - Math.max(0, absD - 1) * 0.05
    );

    // Depth Z
    const translateZ =
      45 -
      Math.min(
        130,
        Math.pow(Math.min(1, absD), 0.8) * 45 + Math.max(0, absD - 1) * 35
      );

    const zIndex = Math.round(50 - absD * 6);

    const opacity = Math.max(
      0.38,
      1 - Math.pow(Math.min(1, absD), 0.8) * 0.14 - Math.max(0, absD - 1) * 0.16
    );

    return {
      transform: `translate3d(calc(-50% + ${offsetX.toFixed(2)}px), -50%, ${translateZ.toFixed(2)}px) rotateY(${rotateY.toFixed(2)}deg) scale(${scale.toFixed(3)})`,
      zIndex,
      opacity,
      boxShadow:
        absD < 0.3
          ? "0 28px 70px -10px rgba(0,0,0,0.9), 0 0 35px rgba(255,255,255,0.18)"
          : "0 18px 40px rgba(0,0,0,0.7)",
      cursor: absD < 0.3 ? "default" : "pointer",
    };
  };

  return (
    <div className="relative w-full flex flex-col items-center justify-center select-none">
      {/* ========================================================================= */}
      {/* 1. MOBILE VIEW (< md): 3D Coverflow Carousel with Touch Drag & Chevrons   */}
      {/* ========================================================================= */}
      <div
        className="flex md:hidden flex-col items-center w-full max-w-sm px-2"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Main 3D Viewport with Floating Left/Right Chevrons */}
        <div className="relative w-full h-[250px] sm:h-[280px] flex items-center justify-center my-2">
          {/* Left Arrow Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleMobilePrev();
            }}
            className="absolute left-0 top-1/2 -translate-y-1/2 flex items-center justify-center w-10 h-10 text-white hover:text-white/80 active:scale-90 transition-all cursor-pointer focus:outline-none z-50 group"
            aria-label="Previous Track"
          >
            <svg
              className="w-7 h-7 text-white transition-transform group-hover:-translate-x-0.5 drop-shadow-lg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>

          {/* 3D Coverflow Card Stage */}
          <div
            className="relative w-full h-full flex items-center justify-center"
            style={{ perspective: "950px", transformStyle: "preserve-3d" }}
          >
            {tracks.map((track, index) => {
              const styles = getMobileCardStyle(index);

              return (
                <div
                  key={track.id}
                  onClick={() => setMobileIndex(index)}
                  className="absolute left-1/2 top-1/2 w-[185px] h-[185px] sm:w-[210px] sm:h-[210px] rounded-[24px] sm:rounded-[28px] flex flex-col items-center justify-between p-5 sm:p-6 border border-white/25 will-change-transform"
                  style={{
                    background: `linear-gradient(135deg, ${track.colorFrom} 0%, ${track.colorTo} 100%)`,
                    transform: styles.transform,
                    zIndex: styles.zIndex,
                    opacity: styles.opacity,
                    boxShadow: styles.boxShadow,
                    transformStyle: "preserve-3d",
                    backfaceVisibility: "hidden",
                  }}
                >
                  {/* Track Vector Icon */}
                  <div className="relative w-[110px] h-[110px] sm:w-[130px] sm:h-[130px] flex items-center justify-center my-auto pointer-events-none">
                    <Image
                      src={track.iconSrc}
                      alt={track.title}
                      width={180}
                      height={180}
                      priority
                      className="w-full h-full object-contain drop-shadow-lg"
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Arrow Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleMobileNext();
            }}
            className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center justify-center w-10 h-10 text-white hover:text-white/80 active:scale-90 transition-all cursor-pointer focus:outline-none z-50 group"
            aria-label="Next Track"
          >
            <svg
              className="w-7 h-7 text-white transition-transform group-hover:translate-x-0.5 drop-shadow-lg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>

        {/* Active Track Title below card */}
        <div className="w-full h-[36px] overflow-hidden flex items-center justify-center mt-1 mb-4 px-4">
          <span className="text-white font-medium text-lg sm:text-xl leading-tight tracking-tight transition-all duration-300">
            {tracks[mobileActiveIndex]?.title}
          </span>
        </div>

        {/* Mobile Rainbow Progress Pill */}
        <div className="relative p-[1.5px] rounded-full overflow-hidden shadow-2xl group z-30">
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background:
                "linear-gradient(90deg, #FC413D 0%, #F27D1E 25%, #F2C81E 50%, #0EBC61 75%, #4E80EB 100%)",
            }}
          />
          <div className="relative flex items-center gap-3 sm:gap-5 bg-black/95 px-5 sm:px-7 py-2 sm:py-2.5 rounded-full backdrop-blur-md">
            <span className="text-white font-bold text-xs sm:text-sm tracking-wide whitespace-nowrap">
              Tracks - {mobileActiveIndex}/{tracks.length}
            </span>
            <div className="flex items-center gap-2 sm:gap-2.5">
              {tracks.map((_, idx) => {
                const isCurrent = idx === mobileActiveIndex;
                return (
                  <button
                    key={idx}
                    onClick={(e) => {
                      e.stopPropagation();
                      setMobileIndex(idx);
                    }}
                    className="relative flex items-center justify-center p-0.5 cursor-pointer focus:outline-none transition-transform duration-200 hover:scale-125"
                    aria-label={`Go to track ${idx}`}
                  >
                    {isCurrent ? (
                      <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full border-2 border-white flex items-center justify-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-white" />
                      </div>
                    ) : (
                      <div className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full border border-white/60 hover:border-white transition-colors" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. DESKTOP VIEW (md:+): Scroll-Driven 3D Coverflow                         */}
      {/* ========================================================================= */}
      <div className="hidden md:flex flex-col items-center w-full max-w-[1300px]">
        {/* Central 3D / Stacked Card Viewport */}
        <div
          className="relative w-full h-[380px] md:h-[420px] lg:h-[460px] flex items-center justify-center"
          style={{ perspective: "1400px", transformStyle: "preserve-3d" }}
        >
          {tracks.map((track, index) => {
            const styles = getDesktopCardStyle(index);

            return (
              <div
                key={track.id}
                onClick={() => handleDesktopSelectDot(index)}
                className="absolute left-1/2 top-1/2 w-[270px] h-[270px] md:w-[300px] md:h-[300px] lg:w-[330px] lg:h-[330px] rounded-[32px] md:rounded-[38px] flex flex-col items-center justify-between p-7 md:p-9 border border-white/25 will-change-transform"
                style={{
                  background: `linear-gradient(135deg, ${track.colorFrom} 0%, ${track.colorTo} 100%)`,
                  transform: styles.transform,
                  zIndex: styles.zIndex,
                  opacity: styles.opacity,
                  boxShadow: styles.boxShadow,
                  cursor: styles.cursor,
                  transformStyle: "preserve-3d",
                  backfaceVisibility: "hidden",
                }}
              >
                {/* Track Title inside Card */}
                <h3 className="text-black font-extrabold text-2xl lg:text-3xl text-center leading-tight tracking-tight drop-shadow-sm pointer-events-none">
                  {track.title}
                </h3>

                {/* Centered Track Vector Icon */}
                <div className="relative w-[140px] h-[140px] md:w-[165px] md:h-[165px] flex items-center justify-center my-auto pointer-events-none">
                  <Image
                    src={track.iconSrc}
                    alt={track.title}
                    width={240}
                    height={240}
                    priority
                    className="w-full h-full object-contain drop-shadow-xl"
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Desktop Rainbow Progress Pill */}
        <div className="mt-4 md:mt-6 relative p-[1.5px] rounded-full overflow-hidden shadow-2xl group z-50">
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background:
                "linear-gradient(90deg, #FC413D 0%, #F27D1E 25%, #F2C81E 50%, #0EBC61 75%, #4E80EB 100%)",
            }}
          />
          <div className="relative flex items-center gap-4 md:gap-6 bg-black/95 px-6 md:px-8 py-2.5 md:py-3 rounded-full backdrop-blur-md">
            <span className="text-white font-bold text-sm md:text-base tracking-wide whitespace-nowrap">
              Tracks - {desktopActiveIndex}/{tracks.length}
            </span>
            <div className="flex items-center gap-2.5 md:gap-3">
              {tracks.map((_, idx) => {
                const isCurrent = idx === desktopActiveIndex;
                return (
                  <button
                    key={idx}
                    onClick={() => handleDesktopSelectDot(idx)}
                    className="relative flex items-center justify-center p-0.5 cursor-pointer focus:outline-none transition-transform duration-200 hover:scale-125"
                    aria-label={`Scroll to track ${idx}`}
                  >
                    {isCurrent ? (
                      <div className="w-4 h-4 rounded-full border-2 border-white flex items-center justify-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-white" />
                      </div>
                    ) : (
                      <div className="w-3.5 h-3.5 rounded-full border border-white/60 hover:border-white transition-colors" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
