"use client";

import Image from "next/image";
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
} from "motion/react";
import type { MotionValue } from "motion/react";
import FoldText from "./components/FoldText";
import SplitText from "./components/SplitText";
import { useCallback, useLayoutEffect, useMemo, useRef } from "react";
import {
  FRAME_ONE_ANIMATION_START_PROGRESS,
  FRAME_THREE_EDGE_LOGO_OFFSETS,
  FRAME_THREE_LOGOS,
  FRAME_TWO_CONTENT_ENTER_OFFSET,
  FRAME_TWO_LOGO_CENTER_X,
  FRAME_TWO_MAPS_LEFT,
  FRAME_TWO_SHAPES,
  HERO_TRACK_ENTRY_DELAYS,
  alignShapeBoundsX,
  geminiOpacityAt,
  halfVisibleScrollAt,
  frameTwoMapEntryTransformAt,
  frameTwoMapsOpacityAt,
  interpolateShapeBounds,
  scrollTransitionProgressAt,
  smoothScrollProgressAt,
  uniformShapeTransformAt,
  type ShapeBounds,
} from "./frame-transition";
type ShapeKey = "web" | "android";

type ShapeMotionValues = {
  x: MotionValue<number>;
  y: MotionValue<number>;
  scaleX: MotionValue<number>;
  scaleY: MotionValue<number>;
};

type FrameThreeGeometry = {
  heroStart: number;
  heroHeight: number;
  frameTwoStart: number;
  frameTwoHeight: number;
  viewportHeight: number;
  frameTwoLoadEnd: number;
  frameThreeTransitionEnd: number;
  heroWeb: ShapeBounds;
  frameTwoWeb: ShapeBounds;
  frameTwoMaps: ShapeBounds;
  frameThreeWeb: ShapeBounds;
  frameThreeMaps: ShapeBounds;
};

function readNaturalBounds(element: HTMLElement): ShapeBounds {
  const previousTransform = element.style.transform;
  element.style.transform = "none";
  const rect = element.getBoundingClientRect();
  element.style.transform = previousTransform;

  return {
    x: rect.left + window.scrollX,
    y: rect.top + window.scrollY,
    width: rect.width,
    height: rect.height,
  };
}

export default function Home() {
  const heroRef = useRef<HTMLElement>(null);
  const frameTwoRef = useRef<HTMLElement>(null);
  const frameThreeRef = useRef<HTMLElement>(null);
  const webRef = useRef<HTMLDivElement>(null);
  const androidRef = useRef<HTMLDivElement>(null);
  const mapsRef = useRef<HTMLDivElement>(null);
  const shapeStartRef = useRef<Partial<Record<ShapeKey, ShapeBounds>>>({});
  const shapeTargetRef = useRef<Partial<Record<ShapeKey, ShapeBounds>>>({});
  const frameThreeGeometryRef = useRef<FrameThreeGeometry | null>(null);

  const { scrollY } = useScroll();

  const webX = useMotionValue(0);
  const webY = useMotionValue(0);
  const webScaleX = useMotionValue(1);
  const webScaleY = useMotionValue(1);
  const androidX = useMotionValue(0);
  const androidY = useMotionValue(0);
  const androidScaleX = useMotionValue(1);
  const androidScaleY = useMotionValue(1);
  const geminiOpacity = useMotionValue(1);
  const geminiScale = useMotionValue(1);
  const cloudOpacity = useMotionValue(1);
  const mapsOpacity = useMotionValue(0);
  const aboutOpacity = useMotionValue(0);
  const aboutX = useMotionValue(FRAME_TWO_CONTENT_ENTER_OFFSET.x);
  const aboutY = useMotionValue(36);

  const mapsFrameThreeX = useMotionValue(0);
  const mapsFrameThreeY = useMotionValue(0);
  const mapsFrameThreeScaleX = useMotionValue(1);
  const mapsFrameThreeScaleY = useMotionValue(1);
  const androidFrameThreeOpacity = useMotionValue(1);
  const frameThreeGeminiX = useMotionValue(FRAME_THREE_EDGE_LOGO_OFFSETS.gemini);
  const frameThreeGeminiRotate = useMotionValue(-180);
  const frameThreeGeminiOpacity = useMotionValue(0);
  const frameThreeGearX = useMotionValue(FRAME_THREE_EDGE_LOGO_OFFSETS.gear);
  const frameThreeGearRotate = useMotionValue(180);
  const frameThreeGearOpacity = useMotionValue(0);

  const shapeMotionValues = useMemo<Record<ShapeKey, ShapeMotionValues>>(
    () => ({
      web: { x: webX, y: webY, scaleX: webScaleX, scaleY: webScaleY },
      android: {
        x: androidX,
        y: androidY,
        scaleX: androidScaleX,
        scaleY: androidScaleY,
      },
    }),
    [
      androidScaleX,
      androidScaleY,
      androidX,
      androidY,
      webScaleX,
      webScaleY,
      webX,
      webY,
    ],
  );

  const syncScrollProgress = useCallback(
    (pageScroll: number) => {
      const geometry = frameThreeGeometryRef.current;
      if (!geometry) return;

      const transitionProgress = scrollTransitionProgressAt(
        pageScroll,
        geometry.heroStart +
          geometry.heroHeight * FRAME_ONE_ANIMATION_START_PROGRESS,
        geometry.frameTwoStart,
      );
      const clampedProgress = smoothScrollProgressAt(transitionProgress);

      (Object.keys(shapeMotionValues) as ShapeKey[]).forEach((key) => {
        const start = shapeStartRef.current[key];
        const target = shapeTargetRef.current[key];
        if (!start || !target) return;

        const transform = uniformShapeTransformAt(
          start,
          target,
          clampedProgress,
        );
        shapeMotionValues[key].x.set(transform.x);
        shapeMotionValues[key].y.set(transform.y);
        shapeMotionValues[key].scaleX.set(transform.scaleX);
        shapeMotionValues[key].scaleY.set(transform.scaleY);
      });

      geminiOpacity.set(geminiOpacityAt(clampedProgress));
      geminiScale.set(1 - clampedProgress * 0.28);

      const cloudFadeProgress = Math.min(
        1,
        Math.max(0, (clampedProgress - 0.65) / 0.35),
      );
      cloudOpacity.set(1 - cloudFadeProgress);

      const mapEntry = frameTwoMapEntryTransformAt(clampedProgress);
      mapsFrameThreeX.set(mapEntry.x);
      mapsFrameThreeScaleX.set(mapEntry.scale);
      mapsFrameThreeScaleY.set(mapEntry.scale);
      mapsOpacity.set(frameTwoMapsOpacityAt(clampedProgress));

      const aboutProgress = Math.min(
        1,
        Math.max(0, (clampedProgress - 0.4) / 0.38),
      );
      aboutOpacity.set(aboutProgress);
      aboutX.set(FRAME_TWO_CONTENT_ENTER_OFFSET.x * (1 - aboutProgress));
      aboutY.set(36 * (1 - aboutProgress));
    },
    [
      aboutOpacity,
      aboutX,
      aboutY,
      cloudOpacity,
      geminiOpacity,
      geminiScale,
      mapsOpacity,
      mapsFrameThreeScaleX,
      mapsFrameThreeScaleY,
      mapsFrameThreeX,
      shapeMotionValues,
    ],
  );

  const syncFrameThreeScroll = useCallback(
    (pageScroll: number) => {
      const geometry = frameThreeGeometryRef.current;
      if (!geometry) return;

      const rawTransitionProgress = Math.min(
        1,
        Math.max(
          0,
          (pageScroll - geometry.frameTwoLoadEnd) /
            (geometry.frameThreeTransitionEnd - geometry.frameTwoLoadEnd),
        ),
      );
      const transitionProgress = smoothScrollProgressAt(rawTransitionProgress);

      if (pageScroll < geometry.frameTwoLoadEnd) {
        mapsFrameThreeY.set(0);
        androidFrameThreeOpacity.set(1);
        frameThreeGeminiX.set(FRAME_THREE_EDGE_LOGO_OFFSETS.gemini);
        frameThreeGeminiRotate.set(-180);
        frameThreeGeminiOpacity.set(0);
        frameThreeGearX.set(FRAME_THREE_EDGE_LOGO_OFFSETS.gear);
        frameThreeGearRotate.set(180);
        frameThreeGearOpacity.set(0);
        return;
      }

      const webBounds = interpolateShapeBounds(
        geometry.frameTwoWeb,
        geometry.frameThreeWeb,
        transitionProgress,
      );
      const webTransform = uniformShapeTransformAt(
        geometry.heroWeb,
        webBounds,
        1,
      );
      webX.set(webTransform.x);
      webY.set(webTransform.y);
      webScaleX.set(webTransform.scaleX);
      webScaleY.set(webTransform.scaleY);

      const mapsBounds = interpolateShapeBounds(
        geometry.frameTwoMaps,
        geometry.frameThreeMaps,
        transitionProgress,
      );
      const mapsTransform = uniformShapeTransformAt(
        geometry.frameTwoMaps,
        mapsBounds,
        1,
      );
      mapsFrameThreeX.set(mapsTransform.x);
      mapsFrameThreeY.set(mapsTransform.y);
      mapsFrameThreeScaleX.set(mapsTransform.scaleX);
      mapsFrameThreeScaleY.set(mapsTransform.scaleY);
      mapsOpacity.set(1);

      androidFrameThreeOpacity.set(1 - transitionProgress);
      frameThreeGeminiX.set(
        FRAME_THREE_EDGE_LOGO_OFFSETS.gemini * (1 - transitionProgress),
      );
      frameThreeGeminiRotate.set(-180 * (1 - transitionProgress));
      frameThreeGeminiOpacity.set(transitionProgress);
      frameThreeGearX.set(
        FRAME_THREE_EDGE_LOGO_OFFSETS.gear * (1 - transitionProgress),
      );
      frameThreeGearRotate.set(180 * (1 - transitionProgress));
      frameThreeGearOpacity.set(transitionProgress);
    },
    [
      androidFrameThreeOpacity,
      frameThreeGeminiOpacity,
      frameThreeGeminiRotate,
      frameThreeGeminiX,
      frameThreeGearOpacity,
      frameThreeGearRotate,
      frameThreeGearX,
      mapsFrameThreeScaleX,
      mapsFrameThreeScaleY,
      mapsFrameThreeX,
      mapsFrameThreeY,
      mapsOpacity,
      webScaleX,
      webScaleY,
      webX,
      webY,
    ],
  );

  useMotionValueEvent(scrollY, "change", syncScrollProgress);
  useMotionValueEvent(scrollY, "change", syncFrameThreeScroll);

  useLayoutEffect(() => {
    const measureTransition = () => {
      const hero = heroRef.current;
      const frame = frameTwoRef.current;
      const frameThree = frameThreeRef.current;
      const web = webRef.current;
      const android = androidRef.current;
      const maps = mapsRef.current;
      if (!hero || !frame || !frameThree || !web || !android || !maps) return;

      const heroRect = hero.getBoundingClientRect();
      const frameRect = frame.getBoundingClientRect();
      const frameThreeRect = frameThree.getBoundingClientRect();
      const frameScale = frameRect.width / 1440;
      const heroPageTop = heroRect.top + window.scrollY;
      const framePageTop = frameRect.top + window.scrollY;
      const framePageLeft = frameRect.left + window.scrollX;
      const frameThreePageTop = frameThreeRect.top + window.scrollY;
      const frameThreePageLeft = frameThreeRect.left + window.scrollX;
      const targetBounds = (
        shape: ShapeBounds,
        sectionLeft: number,
        sectionTop: number,
        sectionScale: number,
      ): ShapeBounds => ({
        x: sectionLeft + shape.x * sectionScale,
        y: sectionTop + shape.y * sectionScale,
        width: shape.width * sectionScale,
        height: shape.height * sectionScale,
      });

      shapeStartRef.current = {
        web: readNaturalBounds(web),
        android: readNaturalBounds(android),
      };
      shapeTargetRef.current = {
        web: targetBounds(
          alignShapeBoundsX(FRAME_TWO_SHAPES.web, FRAME_TWO_LOGO_CENTER_X),
          framePageLeft,
          framePageTop,
          frameScale,
        ),
        android: targetBounds(
          alignShapeBoundsX(FRAME_TWO_SHAPES.android, FRAME_TWO_LOGO_CENTER_X),
          framePageLeft,
          framePageTop,
          frameScale,
        ),
      };

      frameThreeGeometryRef.current = {
        heroStart: heroPageTop,
        heroHeight: heroRect.height,
        frameTwoStart: framePageTop,
        frameTwoHeight: frameRect.height,
        viewportHeight: window.innerHeight,
        frameTwoLoadEnd:
          framePageTop + frameRect.height - window.innerHeight,
        frameThreeTransitionEnd: halfVisibleScrollAt(
          frameThreePageTop,
          frameThreeRect.height,
          window.innerHeight,
        ),
        heroWeb: shapeStartRef.current.web!,
        frameTwoWeb: shapeTargetRef.current.web!,
        frameTwoMaps: readNaturalBounds(maps),
        frameThreeWeb: targetBounds(
          FRAME_THREE_LOGOS.web,
          frameThreePageLeft,
          frameThreePageTop,
          frameThreeRect.width / 1440,
        ),
        frameThreeMaps: targetBounds(
          FRAME_THREE_LOGOS.maps,
          frameThreePageLeft,
          frameThreePageTop,
          frameThreeRect.width / 1440,
        ),
      };

      syncScrollProgress(scrollY.get());
      syncFrameThreeScroll(scrollY.get());
    };

    measureTransition();
    const resizeObserver = new ResizeObserver(measureTransition);
    if (heroRef.current) resizeObserver.observe(heroRef.current);
    if (frameTwoRef.current) resizeObserver.observe(frameTwoRef.current);
    if (frameThreeRef.current) resizeObserver.observe(frameThreeRef.current);
    if (mapsRef.current) resizeObserver.observe(mapsRef.current);
    window.addEventListener("resize", measureTransition);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", measureTransition);
    };
  }, [
    scrollY,
    syncFrameThreeScroll,
    syncScrollProgress,
  ]);

  const logoLetters = [
    { src: "/assets/logo/D.svg", alt: "D", left: -0.25, top: 8.53, width: 138.68, height: 162.3, zIndex: 10 },
    { src: "/assets/logo/e.svg", alt: "e", left: 114.1, top: 47.96, width: 116.46, height: 122.94, zIndex: 9 },
    { src: "/assets/logo/v.svg", alt: "v", left: 193.51, top: 55.68, width: 127.8, height: 115.3, zIndex: 8 },
    { src: "/assets/logo/J.svg", alt: "J", left: 271.25, top: 4.66, width: 106.5, height: 166.23, zIndex: 7 },
    { src: "/assets/logo/a.svg", alt: "a", left: 353.18, top: 47.52, width: 106.04, height: 122.94, zIndex: 6 },
    { src: "/assets/logo/m.svg", alt: "m", left: 448.28, top: 51.62, width: 178.27, height: 119.23, zIndex: 5 },
    { src: "/assets/logo/s.svg", alt: "s", left: 607.61, top: 47.96, width: 101.41, height: 122.94, zIndex: 4 },
    { src: "/assets/logo/'.svg", alt: "'", left: 724.43, top: 1.98, width: 41.39, height: 54.74, zIndex: 3 },
    { src: "/assets/logo/2.svg", alt: "2", left: 773.45, top: 4.66, width: 104.42, height: 166.23, zIndex: 2 },
    { src: "/assets/logo/6.svg", alt: "6", left: 844.59, top: 0, width: 110.67, height: 170.86, zIndex: 1 },
  ];

  const trackIcons = [
    { src: "/assets/android.svg", alt: "Android Track", width: 260, height: 159, className: "w-[210px] sm:w-[260px] -mr-8 sm:-mr-12 z-10" },
    { src: "/assets/web.svg", alt: "Web Track", width: 288, height: 288, className: "w-[220px] sm:w-[280px] -mr-8 sm:-mr-12 z-20" },
    { src: "/assets/gemini.svg", alt: "Gemini Track", width: 301, height: 301, className: "w-[230px] sm:w-[290px] -mr-8 sm:-mr-12 z-30" },
    { src: "/assets/cloud.svg", alt: "Cloud Track", width: 278, height: 203, className: "w-[220px] sm:w-[275px] z-40" },
  ];

  return (
    <main className="relative min-h-screen w-full bg-black text-white flex flex-col items-center overflow-x-clip select-none">
      <section
        ref={heroRef}
        className="relative z-10 flex flex-col items-center justify-center min-h-screen w-full max-w-[1440px] px-4 py-10"
      >
        <header className="hero-header" aria-label="Google Developer Groups">
          <div className="hero-gdg-lockup">
            <Image
              src="/assets/gdg-logo-white.svg"
              alt=""
              width={46}
              height={23}
              priority
              className="hero-gdg-lockup__icon"
            />
            <span className="hero-gdg-lockup__wordmark" aria-hidden="true">
              <Image
                src="/assets/gdg-lockup-line.png"
                alt=""
                width={3003}
                height={300}
                priority
                className="hero-gdg-lockup__wordmark-image"
              />
            </span>
            <span className="hero-gdg-lockup__name">
              Vellore Institute of Technology
            </span>
          </div>
        </header>

        {/* DevJams '26 Logo Container - Placed ON TOP (z-30) */}
        <div className="relative z-30 w-[955.5px] h-[170.98px] max-w-full scale-[0.36] min-[440px]:scale-[0.52] sm:scale-[0.72] md:scale-[0.88] lg:scale-100 transition-all origin-center">
          {logoLetters.map((letter, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: -30, scale: 0.85 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              whileHover={{ y: -6, scale: 1.04, transition: { duration: 0.2 } }}
              transition={{
                duration: 0.55,
                delay: index * 0.045 + 0.1,
                ease: [0.215, 0.61, 0.355, 1],
              }}
              className="absolute cursor-pointer"
              style={{
                left: `${letter.left}px`,
                top: `${letter.top}px`,
                width: `${letter.width}px`,
                height: `${letter.height}px`,
                zIndex: letter.zIndex,
              }}
            >
              <Image
                src={letter.src}
                alt={`DevJams '26 - ${letter.alt}`}
                width={letter.width}
                height={letter.height}
                priority
                className="w-full h-full object-contain filter drop-shadow-[0_0_12px_rgba(255,255,255,0.15)]"
              />
            </motion.div>
          ))}
        </div>

        {/* The original Hero row stays intact at progress 0; Motion transforms take over only while scrolling. */}
        <div className="relative z-10 flex items-center justify-center -mt-8 sm:-mt-14 md:-mt-20 scale-[0.75] sm:scale-90 md:scale-100 origin-center pointer-events-none">
          {trackIcons.map((icon, index) => {
            const shapeKey = index === 0 ? "android" : index === 1 ? "web" : undefined;
            const shapeRef = shapeKey === "android" ? androidRef : shapeKey === "web" ? webRef : undefined;

            return (
              <motion.div
                key={index}
                ref={shapeRef}
                initial={{ opacity: 0, y: 40, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                  duration: 0.6,
                  delay: 0.5 + index * 0.1,
                  ease: "easeOut",
                }}
                style={
                  shapeKey
                    ? {
                        x: shapeMotionValues[shapeKey].x,
                        y: shapeMotionValues[shapeKey].y,
                        scaleX: shapeMotionValues[shapeKey].scaleX,
                        scaleY: shapeMotionValues[shapeKey].scaleY,
                        opacity: shapeKey === "android" ? androidFrameThreeOpacity : 1,
                      }
                    : index === 2
                      ? { opacity: geminiOpacity, scale: geminiScale }
                      : { opacity: cloudOpacity }
                }
                className={`relative flex items-center justify-center mix-blend-screen ${icon.className}`}
              >
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{
                    duration: 0.6,
                    delay: HERO_TRACK_ENTRY_DELAYS[index],
                    ease: "easeOut",
                  }}
                >
                  <motion.div
                    animate={{ y: [0, index % 2 === 0 ? -8 : 8, 0] }}
                    transition={{
                      duration: 4 + index * 0.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <Image
                      src={icon.src}
                      alt={icon.alt}
                      width={icon.width}
                      height={icon.height}
                      priority
                      className="object-contain"
                    />
                  </motion.div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>

        {/* Tagline Text */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9, ease: "easeOut" }}
          className="mt-2 sm:mt-4 mb-8 text-center relative z-30"
          style={{
            color: "#FFF",
            textAlign: "center",
            fontFamily: '"Google Sans", var(--font-google-sans), sans-serif',
            fontSize: "clamp(26px, 4.5vw, 48px)",
            fontStyle: "normal",
            fontWeight: 700,
            lineHeight: "normal",
            letterSpacing: "-2.4px",
          }}
        >
          HACK PACK, DEVJAMS’ BACK.
        </motion.h1>

        {/* Idea Submission Button */}
        <motion.button
          type="button"
          initial={{ opacity: 0, scale: 0.85, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{
            duration: 0.5,
            delay: 1.1,
            type: "spring",
            stiffness: 220,
            damping: 18,
          }}
          whileHover={{
            scale: 1.07,
            backgroundColor: "#ffffff",
            boxShadow: "0 0 35px rgba(255,255,255,0.45)",
          }}
          whileTap={{ scale: 0.94 }}
          className="cursor-pointer bg-white text-black font-bold text-lg rounded-full flex items-center justify-center transition-shadow shadow-[0_0_20px_rgba(255,255,255,0.25)] relative z-30"
          style={{
            width: "243px",
            height: "55px",
            fontFamily: '"Google Sans", var(--font-google-sans), sans-serif',
          }}
        >
          Idea Submission
        </motion.button>
      </section>

      <section ref={frameTwoRef} className="about-devjams">
        <motion.div
          className="about-devjams__content"
          style={{ opacity: aboutOpacity, x: aboutX, y: aboutY }}
        >
          <h2 className="about-devjams__title">About DevJams</h2>
          <p className="about-devjams__description">
            DevJams is the flagship hackathon organized by GDG-VIT, a 48-hour intensive coding event designed to push the boundaries of innovation and develop practical problem-solving skills.
          </p>
        </motion.div>
      </section>

      <motion.div
        ref={mapsRef}
        className="about-devjams__shape about-devjams__shape--pin"
        style={{
          left: FRAME_TWO_MAPS_LEFT,
          opacity: mapsOpacity,
          x: mapsFrameThreeX,
          y: mapsFrameThreeY,
          scaleX: mapsFrameThreeScaleX,
          scaleY: mapsFrameThreeScaleY,
        }}
        aria-hidden="true"
      >
        <Image
          src="/assets/maps.svg"
          alt=""
          width={365}
          height={465}
          className="about-devjams__shape-image"
        />
      </motion.div>

      <section ref={frameThreeRef} className="frame-three">
        <h2 className="frame-three__title">
          <FoldText
            text="About GDG"
            splitBy="char"
            hinge="top"
            trigger="scroll"
            duration={0.65}
            stagger={0.045}
            ease="power3.out"
            perspective={700}
            creaseShading={0.55}
            fontSize="clamp(2rem, 5vw, 4rem)"
            fontWeight={700}
            color="#ffffff"
          />
        </h2>
        <SplitText
          tag="p"
          text="Fueled by curiosity and a bit of chaos, we are a community of coders who love to push limits, designers who bring ideas to life, and managers who turn vision into reality. We build crazy things that matter."
          className="frame-three__description"
          delay={35}
          duration={0.8}
          ease="power3.out"
          splitType="words, chars"
          from={{ opacity: 0, y: 40 }}
          to={{ opacity: 1, y: 0 }}
          threshold={0.1}
          rootMargin="-100px"
          textAlign="center"
        />
        <div className="frame-three__logos" aria-label="GDG tracks">
          <motion.div
            className="frame-three__logo frame-three__logo--gemini"
            style={{
              x: frameThreeGeminiX,
              rotate: frameThreeGeminiRotate,
              opacity: frameThreeGeminiOpacity,
            }}
          >
            <Image
              src="/assets/gemini.svg"
              alt="Gemini"
              width={301}
              height={301}
              className="frame-three__logo-image"
            />
          </motion.div>
          <motion.div
            className="frame-three__logo frame-three__logo--gear"
            style={{
              x: frameThreeGearX,
              rotate: frameThreeGearRotate,
              opacity: frameThreeGearOpacity,
            }}
          >
            <Image
              src="/assets/gear.svg"
              alt="Gear"
              width={337}
              height={337}
              className="frame-three__logo-image"
            />
          </motion.div>
        </div>
      </section>
    </main>
  );
}
