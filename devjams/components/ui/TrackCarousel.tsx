"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";

export interface TrackData {
  id: string;
  title: string;
  colorFrom: string;
  colorTo: string;
  iconSrc?: string;
  iconNode?: React.ReactNode;
  iconType?: "svg" | "placeholder" | "custom";
}

interface TrackCarouselProps {
  tracks: TrackData[];
}

export function TrackCarousel({ tracks }: TrackCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % tracks.length);
  }, [tracks.length]);

  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + tracks.length) % tracks.length);
  }, [tracks.length]);

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

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const touchEnd = e.changedTouches[0].clientX;
    const distance = touchStart - touchEnd;
    const minSwipeDistance = 40;

    if (distance > minSwipeDistance) {
      handleNext();
    } else if (distance < -minSwipeDistance) {
      handlePrev();
    }
    setTouchStart(null);
  };

  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Don't trigger section navigation if clicking explicit button elements
    if ((e.target as HTMLElement).closest("button")) {
      return;
    }
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    if (clickX > rect.width / 2) {
      handleNext();
    } else {
      handlePrev();
    }
  };

  // A helper function to determine the visual styling of each card
  const getCardStyles = (index: number) => {
    const diff = index - activeIndex;
    const absDiff = Math.abs(diff);
    const spacingStep = isMobile ? 38 : 60;
    
    // Active card
    if (diff === 0) {
      return {
        x: 0,
        y: 0,
        z: 0,
        rotateY: 0,
        scale: 1,
        zIndex: 50,
        opacity: 1,
      };
    }

    // Right side cards
    if (diff > 0) {
      return {
        x: `${spacingStep + (diff - 1) * spacingStep}%`,
        y: 0,
        z: -150 * diff,
        rotateY: isMobile ? -30 : -40,
        scale: 1 - 0.05 * diff,
        zIndex: 50 - diff,
        opacity: absDiff > 3 ? 0 : 1 - 0.15 * diff,
      };
    }

    // Left side cards
    return {
      x: `-${spacingStep + (absDiff - 1) * spacingStep}%`,
      y: 0,
      z: -150 * absDiff,
      rotateY: isMobile ? 30 : 40,
      scale: 1 - 0.05 * absDiff,
      zIndex: 50 - absDiff,
      opacity: absDiff > 3 ? 0 : 1 - 0.15 * absDiff,
    };
  };

  return (
    <div 
      onClick={handleContainerClick}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="relative w-full flex flex-col items-center justify-center py-6 sm:py-10 overflow-hidden sm:overflow-visible cursor-pointer select-none group"
      style={{ perspective: 1200 }}
    >
      <div 
        className="relative w-full max-w-xs sm:max-w-sm aspect-square flex items-center justify-center h-[290px] sm:h-[350px] md:h-[400px]"
        style={{ transformStyle: "preserve-3d" }}
      >
        <AnimatePresence>
          {tracks.map((track, index) => {
            const styles = getCardStyles(index);
            
            return (
              <motion.div
                key={track.id}
                className="absolute inset-0 m-auto w-[230px] h-[230px] min-[400px]:w-[260px] min-[400px]:h-[260px] sm:w-[280px] sm:h-[280px] md:w-[320px] md:h-[320px] rounded-xl flex flex-col items-center justify-center overflow-hidden border border-white/20"
                style={{ 
                  background: `linear-gradient(135deg, ${track.colorFrom}, ${track.colorTo})`,
                  boxShadow: index === activeIndex ? "0 25px 60px -15px rgba(0,0,0,0.8), 0 0 20px rgba(255,255,255,0.15)" : "0 10px 30px rgba(0,0,0,0.6)",
                  transformStyle: "preserve-3d"
                }}
                initial={false}
                animate={{
                  x: styles.x,
                  y: styles.y,
                  z: styles.z,
                  rotateY: styles.rotateY,
                  scale: styles.scale,
                  opacity: styles.opacity,
                  zIndex: styles.zIndex,
                }}
                transition={{
                  type: "spring",
                  stiffness: 260,
                  damping: 25,
                  mass: 1
                }}
              >
                <div className="w-full h-full flex flex-col items-center justify-center p-4 sm:p-6 gap-4 sm:gap-8">
                  {/* Track Title */}
                  <h3 
                    className="text-black font-extrabold text-2xl sm:text-3xl text-center leading-tight tracking-tight drop-shadow-sm"
                    style={{ transform: "translateZ(30px)" }} // 3D pop effect for text
                  >
                    {track.title}
                  </h3>
                  
                  {/* Track Icon */}
                  <div 
                    className="w-28 h-28 sm:w-36 sm:h-36 relative flex items-center justify-center"
                    style={{ transform: "translateZ(50px)" }} // 3D pop effect for image
                  >
                    {track.iconType === "custom" && track.iconNode ? (
                      track.iconNode
                    ) : track.iconSrc && track.iconType === "svg" ? (
                      <Image 
                        src={track.iconSrc} 
                        alt={track.title} 
                        fill 
                        className="object-contain filter brightness-0 drop-shadow-2xl"
                      />
                    ) : (
                      // Placeholder if no icon
                      <div className="w-20 h-20 sm:w-24 sm:h-24 bg-black/90 rounded-2xl flex items-center justify-center text-white font-bold text-3xl sm:text-4xl shadow-2xl">
                        ?
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Progress Dots / Status */}
      <div className="mt-12 sm:mt-20 flex items-center gap-2 sm:gap-4 bg-white/5 border border-white/10 px-4 sm:px-8 py-2.5 sm:py-3 rounded-full backdrop-blur-md shadow-2xl max-w-[95vw]">
        <span className="text-white font-semibold text-xs sm:text-sm whitespace-nowrap">
          Tracks - {activeIndex}/{tracks.length - 1}
        </span>
        <div className="w-[1px] h-4 bg-white/20 mx-1 sm:mx-2" />
        <div className="flex gap-2 sm:gap-3 overflow-x-auto">
          {tracks.map((_, idx) => (
            <button
              key={idx}
              onClick={(e) => {
                e.stopPropagation();
                setActiveIndex(idx);
              }}
              className={`rounded-full transition-all duration-300 border border-white/20 ${
                idx === activeIndex ? "w-6 sm:w-8 h-2 sm:h-2.5 bg-gradient-to-r from-purple-500 to-blue-500 border-transparent shadow-[0_0_10px_rgba(168,85,247,0.5)]" : "w-2 sm:w-2.5 h-2 sm:h-2.5 bg-transparent hover:bg-white/20"
              }`}
              aria-label={`Go to track ${idx}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

