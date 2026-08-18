"use client";

import { useState, useEffect, useRef, useCallback, type MouseEvent } from "react";
import { motion } from "../gsap-motion";
import Image from "next/image";

export interface TrackData {
  id: string;
  title: string;
  colorFrom: string;
  colorTo: string;
  iconSrc: string;
}

interface TrackCarouselProps {
  tracks: TrackData[];
}

export function TrackCarousel({ tracks }: TrackCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % tracks.length);
  }, [tracks.length]);

  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + tracks.length) % tracks.length);
  }, [tracks.length]);

  // Keyboard arrow keys navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        handleNext();
      } else if (e.key === "ArrowLeft") {
        handlePrev();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleNext, handlePrev]);

  // Mouse wheel horizontal scrolling
  const handleWheel = (e: React.WheelEvent) => {
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY) || Math.abs(e.deltaY) > 20) {
      if (e.deltaX > 25 || e.deltaY > 25) {
        handleNext();
      } else if (e.deltaX < -25 || e.deltaY < -25) {
        handlePrev();
      }
    }
  };

  // Drag & Swipe handling
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.pageX);
    setScrollLeft(activeIndex);
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setIsDragging(false);
    const diff = startX - e.pageX;
    if (diff > 45) {
      handleNext();
    } else if (diff < -45) {
      handlePrev();
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setStartX(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = startX - e.changedTouches[0].clientX;
    if (diff > 40) {
      handleNext();
    } else if (diff < -40) {
      handlePrev();
    }
  };

  // 3D positioning for carousel items
  const getCardStyles = (index: number) => {
    const diff = index - activeIndex;
    const absDiff = Math.abs(diff);
    
    // Spacing between cards in percentage
    const step = 65;

    if (diff === 0) {
      return {
        x: 0,
        z: 0,
        rotateY: 0,
        scale: 1,
        zIndex: 40,
        opacity: 1,
      };
    }

    if (diff > 0) {
      return {
        x: `${step + (diff - 1) * (step * 0.75)}%`,
        z: -120 * diff,
        rotateY: -25,
        scale: Math.max(1 - 0.08 * diff, 0.7),
        zIndex: 40 - diff,
        opacity: absDiff > 2 ? 0 : 1 - 0.25 * diff,
      };
    }

    return {
      x: `-${step + (absDiff - 1) * (step * 0.75)}%`,
      z: -120 * absDiff,
      rotateY: 25,
      scale: Math.max(1 - 0.08 * absDiff, 0.7),
      zIndex: 40 - absDiff,
      opacity: absDiff > 2 ? 0 : 1 - 0.25 * absDiff,
    };
  };

  return (
    <div 
      ref={containerRef}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="relative w-full flex flex-col items-center justify-center pt-0 pb-2 select-none cursor-grab active:cursor-grabbing"
      style={{ perspective: "1400px" }}
    >
      {/* 3D Horizontal Carousel Track */}
      <div 
        className="relative w-full max-w-sm sm:max-w-md h-[260px] sm:h-[310px] md:h-[350px] flex items-center justify-center"
        style={{ transformStyle: "preserve-3d" }}
      >
        {tracks.map((track, index) => {
          const styles = getCardStyles(index);
          const isActive = index === activeIndex;

          return (
            <motion.div
              key={track.id}
              onClick={(e: MouseEvent<HTMLDivElement>) => {
                e.stopPropagation();
                setActiveIndex(index);
              }}
              className="absolute inset-0 m-auto w-[240px] h-[240px] sm:w-[300px] sm:h-[300px] md:w-[340px] md:h-[340px] rounded-md sm:rounded-lg md:rounded-xl flex flex-col items-center justify-between p-5 sm:p-7 md:p-8 border border-white/20 transition-shadow duration-300"
              style={{
                background: `linear-gradient(135deg, ${track.colorFrom} 0%, ${track.colorTo} 100%)`,
                boxShadow: isActive 
                  ? "0 30px 60px -12px rgba(0,0,0,0.85), 0 0 25px rgba(255,255,255,0.2)" 
                  : "0 15px 35px rgba(0,0,0,0.6)",
                transformStyle: "preserve-3d",
              }}
              initial={false}
              animate={{
                x: styles.x,
                z: styles.z,
                rotateY: styles.rotateY,
                scale: styles.scale,
                opacity: styles.opacity,
                zIndex: styles.zIndex,
              }}
              transition={{
                type: "spring",
                stiffness: 280,
                damping: 26,
                mass: 1,
              }}
            >
              {/* Track Heading */}
              <h3 
                className="text-black font-extrabold text-lg sm:text-2xl md:text-3xl text-center leading-tight tracking-tight drop-shadow-sm"
                style={{ transform: "translateZ(30px)" }}
              >
                {track.title}
              </h3>

              {/* Vector Icon in Center */}
              <div 
                className="relative w-[130px] h-[130px] sm:w-[160px] sm:h-[160px] md:w-[190px] md:h-[190px] flex items-center justify-center my-auto"
                style={{ transform: "translateZ(45px)" }}
              >
                <Image
                  src={track.iconSrc}
                  alt={track.title}
                  width={220}
                  height={220}
                  className="w-full h-full object-contain pointer-events-none drop-shadow-xl"
                />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Rainbow-Border Progress Pill matching Reference Design */}
      <div className="mt-5 sm:mt-7 relative p-[1.5px] rounded-full overflow-hidden shadow-2xl group">
        {/* Rainbow gradient border background */}
        <div 
          className="absolute inset-0 rounded-full"
          style={{
            background: "linear-gradient(90deg, #FC413D 0%, #F27D1E 25%, #F2C81E 50%, #0EBC61 75%, #4E80EB 100%)",
          }}
        />

        {/* Inner Pill Container */}
        <div className="relative flex items-center gap-3 sm:gap-5 bg-black/95 px-5 sm:px-8 py-2.5 sm:py-3 rounded-full backdrop-blur-md">
          {/* Tracks Counter Text */}
          <span className="text-white font-bold text-sm sm:text-base tracking-wide whitespace-nowrap">
            Tracks - {activeIndex}/{tracks.length - 1}
          </span>

          {/* Dots Indicator */}
          <div className="flex items-center gap-2 sm:gap-3">
            {tracks.map((_, idx) => {
              const isCurrent = idx === activeIndex;

              return (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveIndex(idx);
                  }}
                  className="relative flex items-center justify-center p-0.5 cursor-pointer focus:outline-none transition-transform duration-200 hover:scale-110"
                  aria-label={`Go to track ${idx}`}
                >
                  {isCurrent ? (
                    /* Active: Concentric Double Circle ◎ */
                    <div className="w-4 h-4 rounded-full border-2 border-white flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-white" />
                    </div>
                  ) : (
                    /* Inactive: Single Clean Outline Circle ○ */
                    <div className="w-3.5 h-3.5 rounded-full border border-white/70 hover:border-white transition-colors" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
