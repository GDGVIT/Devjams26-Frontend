"use client";

import Image from "next/image";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useScroll,
} from "../components/gsap-motion";
import type { MotionValue } from "../components/gsap-motion";
import FoldText from "./components/FoldText";
import SplitText from "./components/SplitText";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import {
  FRAME_FOUR_CONTENT_ENTER_OFFSET,
  FRAME_FOUR_MOBILE_SHAPES,
  FRAME_FOUR_SHAPES,
  FRAME_ONE_ANIMATION_START_PROGRESS,
  FRAME_REFERENCE_WIDTH,
  FRAME_THREE_EDGE_LOGO_OFFSETS,
  FRAME_THREE_MOBILE_SHAPES,
  FRAME_THREE_LOGOS,
  FRAME_TWO_LOGO_CENTER_X,
  FRAME_TWO_MAPS_LEFT,
  FRAME_TWO_MOBILE_SHAPES,
  FRAME_TWO_SHAPES,
  FRAME_TWO_CONTENT_ENTER_OFFSET,
  HERO_TRACK_ENTRY_DELAYS,
  alignShapeBoundsX,
  frameFourContentOffsetAt,
  frameFourSharedLogoTransformAt,
  frameScaleAtViewport,
  frameTwoMapEntryTransformAt,
  frameTwoMapsOpacityAt,
  geminiOpacityAt,
  halfVisibleScrollAt,
  interpolateShapeBounds,
  mobileFrameScaleAtViewport,
  mobileFrameVerticalScaleAtViewport,
  scaleMobileShapeBoundsAtViewport,
  scaleShapeBounds,
  heroMenuShouldCollapseAtScroll,
  scrollTransitionProgressAt,
  smoothScrollProgressAt,
  uniformShapeTransformAt,
  type ShapeBounds,
} from "./frame-transition";
type ShapeKey = "web" | "android";
import { Tracks } from "../components/sections/Tracks";
import { PreviousEvents } from "../components/sections/PreviousEvents";
import { GotQuestions } from "../components/sections/GotQuestions";
import { Footer } from "../components/sections/Footer";

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
  frameFourStart: number;
  frameFourHeight: number;
  frameThreePageLeft: number;
  frameThreePageTop: number;
  frameThreeScale: number;
  frameFourPageLeft: number;
  frameFourPageTop: number;
  frameFourScale: number;
  frameFourMobileScale: number;
  heroTrackScale: number;
  isMobile: boolean;
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
const FRAME_FOUR_START_SHAPES = {
  cloud: {
    x: 1480,
    y: FRAME_FOUR_SHAPES.cloud.y,
    width: 278,
    height: 203,
  },
} as const;
export default function Home() {
  const heroRef = useRef<HTMLElement>(null);
  const frameTwoRef = useRef<HTMLElement>(null);
  const frameThreeRef = useRef<HTMLElement>(null);
  const frameFourRef = useRef<HTMLElement>(null);
  const webRef = useRef<HTMLDivElement>(null);
  const androidRef = useRef<HTMLDivElement>(null);
  const mapsRef = useRef<HTMLDivElement>(null);
  const trackIconsRef = useRef<HTMLDivElement>(null);
  const shapeStartRef = useRef<Partial<Record<ShapeKey, ShapeBounds>>>({});
  const shapeTargetRef = useRef<Partial<Record<ShapeKey, ShapeBounds>>>({});
  const frameThreeGeometryRef = useRef<FrameThreeGeometry | null>(null);
  const [menuOpen, setMenuOpen] = useState(true);
  const [viewportWidth, setViewportWidth] = useState(FRAME_REFERENCE_WIDTH);
  const [viewportHeight, setViewportHeight] = useState(812);
  useEffect(() => {
    if (!menuOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [menuOpen]);
  const frameScale = frameScaleAtViewport(viewportWidth);
  const mobileFrameScale = mobileFrameScaleAtViewport(viewportWidth);
  const mobileFrameVerticalScale =
    mobileFrameVerticalScaleAtViewport(viewportHeight);
  const isMobileViewport = viewportWidth <= 700;
  const isCompactViewport = viewportWidth <= 1024;
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
  const frameThreeWebOpacity = useMotionValue(1);
  const frameFourCloudX = useMotionValue(0);
  const frameFourCloudY = useMotionValue(0);
  const frameFourCloudScale = useMotionValue(1);
  const frameFourCloudOpacity = useMotionValue(0);
  const frameFourAboutOpacity = useMotionValue(0);
  const frameFourAboutX = useMotionValue<number>(FRAME_FOUR_CONTENT_ENTER_OFFSET.x);
  const frameFourAboutY = useMotionValue<number>(36);
  const mapsFrameThreeY = useMotionValue(0);
  const mapsFrameThreeScaleX = useMotionValue(1);
  const mapsFrameThreeScaleY = useMotionValue(1);
  const androidFrameThreeOpacity = useMotionValue(1);
  const frameThreeGeminiX = useMotionValue(FRAME_THREE_EDGE_LOGO_OFFSETS.gemini);
  const frameThreeGeminiRotate = useMotionValue(-180);
  const frameThreeGeminiOpacity = useMotionValue(0);
  const frameThreeGeminiY = useMotionValue(0);
  const frameThreeGeminiScaleX = useMotionValue(1);
  const frameThreeGeminiScaleY = useMotionValue(1);
  const frameThreeGearY = useMotionValue(0);
  const frameThreeGearScaleX = useMotionValue(1);
  const frameThreeGearScaleY = useMotionValue(1);
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
      const heroTrackScale = geometry.heroTrackScale || 1;

      (Object.keys(shapeMotionValues) as ShapeKey[]).forEach((key) => {
        const start = shapeStartRef.current[key];
        const target = shapeTargetRef.current[key];
        if (!start || !target) return;

        const transform = uniformShapeTransformAt(
          start,
          target,
          clampedProgress,
        );
        shapeMotionValues[key].x.set(transform.x / heroTrackScale);
        shapeMotionValues[key].y.set(transform.y / heroTrackScale);
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
      aboutX.set(
        isCompactViewport
          ? 0
          : FRAME_TWO_CONTENT_ENTER_OFFSET.x * (1 - aboutProgress),
      );
      aboutY.set(36 * (1 - aboutProgress));
    },
    [
      aboutOpacity,
      aboutX,
      aboutY,
      cloudOpacity,
      geminiOpacity,
      geminiScale,
      isCompactViewport,
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
      const heroTrackScale = geometry.heroTrackScale || 1;
      webX.set(webTransform.x / heroTrackScale);
      webY.set(webTransform.y / heroTrackScale);
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
  const syncFrameFourScroll = useCallback(
    (pageScroll: number) => {
      const geometry = frameThreeGeometryRef.current;
      if (!geometry) return;

      const transitionStart =
        geometry.frameFourStart - geometry.viewportHeight;
      const rawProgress = Math.min(
        1,
        Math.max(0, (pageScroll - transitionStart) / geometry.frameFourHeight),
      );
      const progress = smoothScrollProgressAt(rawProgress);

      if (pageScroll < transitionStart) {
        frameFourCloudOpacity.set(0);
        frameFourAboutOpacity.set(0);
        frameFourAboutX.set(
          isCompactViewport ? 0 : FRAME_FOUR_CONTENT_ENTER_OFFSET.x,
        );
        frameFourAboutY.set(36);
        return;
      }

      const absoluteBounds = (
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
      const absoluteMobileBounds = (
        shape: ShapeBounds,
        sectionLeft: number,
        sectionTop: number,
      ): ShapeBounds => ({
        x: sectionLeft + shape.x * geometry.frameFourMobileScale,
        y:
          sectionTop +
          shape.y *
            mobileFrameVerticalScaleAtViewport(geometry.viewportHeight),
        width: shape.width * geometry.frameFourMobileScale,
        height:
          shape.height *
          mobileFrameVerticalScaleAtViewport(geometry.viewportHeight),
      });
      const frameFourShapes = geometry.isMobile
        ? FRAME_FOUR_MOBILE_SHAPES
        : FRAME_FOUR_SHAPES;
      const targetBounds = (
        shape: ShapeBounds,
        sectionLeft: number,
        sectionTop: number,
      ): ShapeBounds =>
        geometry.isMobile
          ? absoluteMobileBounds(shape, sectionLeft, sectionTop)
          : absoluteBounds(
              shape,
              sectionLeft,
              sectionTop,
              geometry.frameFourScale,
            );

      const sourceGear = absoluteBounds(
        FRAME_THREE_LOGOS.gear,
        geometry.frameThreePageLeft,
        geometry.frameThreePageTop,
        geometry.frameThreeScale,
      );
      const targetGear = targetBounds(
        frameFourShapes.gear,
        geometry.frameFourPageLeft,
        geometry.frameFourPageTop,
      );
      const gearTransform = frameFourSharedLogoTransformAt(
        sourceGear,
        targetGear,
        progress,
      );
      frameThreeGearX.set(gearTransform.x);
      frameThreeGearY.set(gearTransform.y);
      frameThreeGearScaleX.set(gearTransform.scaleX);
      frameThreeGearScaleY.set(gearTransform.scaleY);
      frameThreeGearRotate.set(0);
      frameThreeGearOpacity.set(1);

      const sourceGemini = absoluteBounds(
        FRAME_THREE_LOGOS.gemini,
        geometry.frameThreePageLeft,
        geometry.frameThreePageTop,
        geometry.frameThreeScale,
      );
      const targetGemini = targetBounds(
        frameFourShapes.gemini,
        geometry.frameFourPageLeft,
        geometry.frameFourPageTop,
      );
      const geminiTransform = frameFourSharedLogoTransformAt(
        sourceGemini,
        targetGemini,
        progress,
      );
      frameThreeGeminiX.set(geminiTransform.x);
      frameThreeGeminiY.set(geminiTransform.y);
      frameThreeGeminiScaleX.set(geminiTransform.scaleX);
      frameThreeGeminiScaleY.set(geminiTransform.scaleY);
      frameThreeGeminiRotate.set(0);
      frameThreeGeminiOpacity.set(1);

      const cloudStart = absoluteBounds(
        FRAME_FOUR_START_SHAPES.cloud,
        geometry.frameFourPageLeft,
        geometry.frameFourPageTop,
        geometry.frameFourScale,
      );
      const cloudTarget = targetBounds(
        frameFourShapes.cloud,
        geometry.frameFourPageLeft,
        geometry.frameFourPageTop,
      );
      const cloudTransform = uniformShapeTransformAt(
        cloudStart,
        cloudTarget,
        progress,
      );
      frameFourCloudX.set(cloudTransform.x);
      frameFourCloudY.set(cloudTransform.y);
      frameFourCloudScale.set(cloudTransform.scaleX);
      frameFourCloudOpacity.set(progress);
      frameFourAboutOpacity.set(progress);

      frameThreeWebOpacity.set(1 - progress);
      mapsOpacity.set(1 - progress);
      frameFourAboutX.set(
        isCompactViewport ? 0 : frameFourContentOffsetAt(progress),
      );
      frameFourAboutY.set(36 * (1 - progress));
    },
    [
      frameFourAboutOpacity,
      frameFourAboutX,
      frameFourAboutY,
      frameFourCloudOpacity,
      frameFourCloudScale,
      frameFourCloudX,
      frameFourCloudY,
      frameThreeGeminiOpacity,
      frameThreeGeminiRotate,
      frameThreeGeminiScaleX,
      frameThreeGeminiScaleY,
      frameThreeGeminiX,
      frameThreeGeminiY,
      frameThreeGearOpacity,
      frameThreeGearRotate,
      frameThreeGearScaleX,
      frameThreeGearScaleY,
      frameThreeGearX,
      frameThreeGearY,
      frameThreeWebOpacity,
      isCompactViewport,
      mapsOpacity,
    ],
  );


  useLayoutEffect(() => {
    const measureTransition = () => {
      const hero = heroRef.current;
      const frame = frameTwoRef.current;
      const frameThree = frameThreeRef.current;
      const frameFour = frameFourRef.current;
      const web = webRef.current;
      const android = androidRef.current;
      const maps = mapsRef.current;
      const trackIcons = trackIconsRef.current;
      if (
        !hero ||
        !frame ||
        !frameThree ||
        !frameFour ||
        !web ||
        !android ||
        !maps ||
        !trackIcons
      ) return;
      const currentViewportWidth = window.innerWidth;
      const currentViewportHeight = window.innerHeight;
      setViewportWidth((width) =>
        width === currentViewportWidth ? width : currentViewportWidth,
      );
      setViewportHeight((height) =>
        height === currentViewportHeight ? height : currentViewportHeight,
      );
      const heroRect = hero.getBoundingClientRect();
      const frameRect = frame.getBoundingClientRect();
      const frameThreeRect = frameThree.getBoundingClientRect();
      const frameFourRect = frameFour.getBoundingClientRect();
      const trackRect = trackIcons.getBoundingClientRect();
      const heroTrackScale =
        trackIcons.offsetWidth > 0
          ? trackRect.width / trackIcons.offsetWidth
          : 1;
      const frameScale = frameScaleAtViewport(currentViewportWidth);
      const mobileFrameScale = mobileFrameScaleAtViewport(currentViewportWidth);
      const isMobile = currentViewportWidth <= 700;
      const heroPageTop = heroRect.top + window.scrollY;
      const framePageTop = frameRect.top + window.scrollY;
      const framePageLeft = frameRect.left + window.scrollX;
      const frameThreePageTop = frameThreeRect.top + window.scrollY;
      const frameThreePageLeft = frameThreeRect.left + window.scrollX;
      const frameFourPageTop = frameFourRect.top + window.scrollY;
      const targetBounds = (
        shape: ShapeBounds,
        sectionLeft: number,
        sectionTop: number,
        sectionScale: number,
        mobileShape = false,
      ): ShapeBounds => {
        const scaled = mobileShape
          ? scaleMobileShapeBoundsAtViewport(
              shape,
              currentViewportWidth,
              currentViewportHeight,
            )
          : scaleShapeBounds(shape, sectionScale);
        return {
          ...scaled,
          x: sectionLeft + scaled.x,
          y: sectionTop + scaled.y,
        };
      };

      shapeStartRef.current = {
        web: readNaturalBounds(web),
        android: readNaturalBounds(android),
      };
      const frameTwoTargetScale = isMobile ? mobileFrameScale : frameScale;
      const frameTwoWebShape = isMobile
        ? FRAME_TWO_MOBILE_SHAPES.web
        : alignShapeBoundsX(FRAME_TWO_SHAPES.web, FRAME_TWO_LOGO_CENTER_X);
      const frameTwoAndroidShape = isMobile
        ? FRAME_TWO_MOBILE_SHAPES.android
        : alignShapeBoundsX(
            FRAME_TWO_SHAPES.android,
            FRAME_TWO_LOGO_CENTER_X,
          );
      shapeTargetRef.current = {
        web: targetBounds(
          frameTwoWebShape,
          framePageLeft,
          framePageTop,
          frameTwoTargetScale,
          isMobile,
        ),
        android: targetBounds(
          frameTwoAndroidShape,
          framePageLeft,
          framePageTop,
          frameTwoTargetScale,
          isMobile,
        ),
      };
      frameThreeGeometryRef.current = {
        heroStart: heroPageTop,
        heroHeight: heroRect.height,
        frameTwoStart: framePageTop,
        frameTwoHeight: frameRect.height,
        frameFourStart: frameFourPageTop,
        frameFourHeight: frameFourRect.height,
        frameThreePageLeft,
        frameThreePageTop,
        frameThreeScale: frameScale,
        heroTrackScale,
        frameFourPageLeft: frameFourRect.left + window.scrollX,
        frameFourPageTop,
        frameFourScale: frameScale,
        frameFourMobileScale: mobileFrameScale,
        isMobile,
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
          isMobile ? FRAME_THREE_MOBILE_SHAPES.web : FRAME_THREE_LOGOS.web,
          frameThreePageLeft,
          frameThreePageTop,
          isMobile ? mobileFrameScale : frameScale,
          isMobile,
        ),
        frameThreeMaps: targetBounds(
          FRAME_THREE_LOGOS.maps,
          frameThreePageLeft,
          frameThreePageTop,
          frameScale,
        ),
      };
      syncScrollProgress(scrollY.get());
      syncFrameThreeScroll(scrollY.get());
      syncFrameFourScroll(scrollY.get());
    };
    measureTransition();
    const resizeObserver = new ResizeObserver(measureTransition);
    if (heroRef.current) resizeObserver.observe(heroRef.current);
    if (frameTwoRef.current) resizeObserver.observe(frameTwoRef.current);
    if (frameThreeRef.current) resizeObserver.observe(frameThreeRef.current);
    if (frameFourRef.current) resizeObserver.observe(frameFourRef.current);
    if (mapsRef.current) resizeObserver.observe(mapsRef.current);
    const handleScroll = () => {
      const pageScroll = window.scrollY;
      syncScrollProgress(pageScroll);
      syncFrameThreeScroll(pageScroll);
      syncFrameFourScroll(pageScroll);
      if (heroMenuShouldCollapseAtScroll(pageScroll)) setMenuOpen(false);
    };
    window.addEventListener("resize", measureTransition);
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", measureTransition);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [
    scrollY,
    syncFrameFourScroll,
    syncFrameThreeScroll,
    syncScrollProgress,
    viewportWidth,
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
    <main
      className="relative min-h-screen w-full bg-black text-white flex flex-col items-center overflow-x-clip select-none"
      style={{ "--frame-scale": frameScale } as CSSProperties}
    >
      <section
        ref={heroRef}
        id="home"
        className="relative z-10 flex flex-col items-center justify-center min-h-screen w-full max-w-[1440px] px-4 py-10"
      >
        <header className="hero-header" aria-label="Google Developer Groups">
          <div className="hero-header__row">
          <motion.div
            className="hero-gdg-lockup"
            initial={false}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
          >
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
          </motion.div>
          </div>
        </header>
          <motion.button
            type="button"
            initial={false}
            animate={{ opacity: 1, x: 0, scale: isMobileViewport ? 0.64 : 1 }}
            transition={{ duration: 0.55, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className={`hero-menu${menuOpen ? " hero-menu--open" : ""}`}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="primary-navigation-sheet"
            aria-pressed={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <Image
              src="/assets/dino-menu.svg"
              alt=""
              width={63.955}
              height={68.768}
              priority
              className="hero-menu__dino"
            />
            <svg
              className="hero-menu__mark"
              xmlns="http://www.w3.org/2000/svg"
              width="60"
              height="55"
              viewBox="0 0 60 55"
              fill="none"
              aria-hidden="true"
            >
              <path d="M17.465 0.615787L19.1528 1.68895L17.1208 11.336L25.008 5.41198L26.6957 6.48514L20.8016 15.7548L19.6332 15.0119L24.5367 7.30012L24.5107 7.2836L16.7121 13.1545L15.6605 12.4858L17.6688 2.93318L17.6428 2.91667L12.7393 10.6284L11.5709 9.88547L17.465 0.615787Z" fill="white"/>
              <path d="M32.2433 24.9556C31.4734 25.4392 30.7203 25.6186 29.9841 25.4938C29.2479 25.369 28.5709 24.9776 27.9532 24.3196C27.5179 23.856 27.2136 23.382 27.0402 22.8976C26.8738 22.4207 26.8165 21.94 26.868 21.4555C26.9196 20.9709 27.0761 20.4933 27.3377 20.0227C27.6063 19.5595 27.9541 19.1133 28.3813 18.6842C28.8224 18.27 29.2894 17.9582 29.7822 17.7488C30.275 17.5394 30.7683 17.428 31.2621 17.4145C31.763 17.4085 32.2426 17.4999 32.7011 17.6885C33.1665 17.8845 33.5853 18.1807 33.9574 18.5771C34.4418 19.093 34.7335 19.621 34.8326 20.1611C34.9461 20.7016 34.9332 21.2273 34.7937 21.7381C34.6613 22.2564 34.4357 22.7354 34.1171 23.1752C33.8055 23.6226 33.4669 24.0037 33.1014 24.3187L29.0262 19.978C28.7649 20.2092 28.55 20.4672 28.3813 20.7522C28.2201 21.0301 28.1201 21.328 28.081 21.6461C28.0495 21.9571 28.0901 22.2777 28.2031 22.6078C28.316 22.9378 28.5199 23.2599 28.8148 23.574C29.1939 23.9778 29.5962 24.219 30.0219 24.2978C30.4545 24.384 30.9001 24.2892 31.3587 24.0134L32.2433 24.9556Z" fill="white"/>
              <path d="M39.9783 29.8745L40.4978 30.9903L39.3542 31.5228L39.3671 31.5507C40.4706 31.6365 41.2713 32.2141 41.7692 33.2834C41.99 33.7576 42.1089 34.183 42.1259 34.5598C42.1429 34.9365 42.0803 35.2767 41.9391 35.5802C41.7976 35.8837 41.5814 36.1484 41.2906 36.3743C41.0135 36.6052 40.6796 36.8115 40.2891 36.9933L35.547 39.2013L34.995 38.0158L39.8766 35.7429C40.3229 35.5351 40.6156 35.2404 40.7547 34.8588C40.8939 34.4772 40.8574 34.0587 40.6452 33.603C40.4764 33.2404 40.2734 32.9503 40.0362 32.7326C39.8034 32.5242 39.5436 32.3793 39.2568 32.2978C38.97 32.2163 38.6655 32.1942 38.3432 32.2311C38.0346 32.2729 37.7177 32.3696 37.3922 32.5212L33.3196 34.4174L32.7676 33.2319L39.9783 29.8745Z" fill="white"/>
              <path d="M36.5274 51.7389L36.4904 50.5087L37.7514 50.4707L37.7505 50.44C37.2501 50.178 36.8755 49.8352 36.6267 49.4117C36.3882 48.9879 36.2602 48.4838 36.2426 47.8995C36.2269 47.3766 36.2804 46.9389 36.4032 46.5863C36.5365 46.2334 36.7276 45.9455 36.9775 45.7225C37.2273 45.4995 37.5251 45.3366 37.8709 45.2339C38.2272 45.141 38.6207 45.0881 39.0513 45.0752L44.2798 44.9179L44.3192 46.225L38.9369 46.387C38.4448 46.4018 38.0595 46.557 37.7811 46.8527C37.5027 47.1484 37.371 47.5474 37.3861 48.0498C37.3982 48.4496 37.47 48.7912 37.6017 49.0745C37.7336 49.3682 37.9153 49.6089 38.1467 49.7969C38.3781 49.9849 38.6439 50.1206 38.944 50.2039C39.2546 50.2972 39.5893 50.3384 39.9482 50.3277L44.4386 50.1925L44.4779 51.4997L36.5274 51.7389Z" fill="white"/>
              <path d="M32.7789 22.4843C32.97 22.283 33.1196 22.0572 33.2278 21.8068C33.3422 21.5632 33.4013 21.3141 33.4052 21.0595C33.422 20.8054 33.3833 20.5524 33.2891 20.3003C33.2078 20.0488 33.0671 19.8144 32.8669 19.5972C32.6604 19.3733 32.432 19.2072 32.1816 19.099C31.9443 18.9914 31.6984 18.9356 31.4437 18.9318C31.1891 18.928 30.9358 18.9732 30.6837 19.0675C30.4384 19.1555 30.2077 19.2866 29.9916 19.4607L32.7789 22.4843Z" fill="black"/>
            </svg>
          </motion.button>
        <AnimatePresence>
          {menuOpen ? (
            <>
              <motion.button
                type="button"
                className="hero-nav__backdrop"
                aria-label="Close navigation"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={() => setMenuOpen(false)}
              />
              <motion.nav
                id="primary-navigation-sheet"
                className="hero-nav"
                initial={isMobileViewport ? { x: "100%", opacity: 0 } : false}
                animate={{ width: "var(--hero-nav-open-width)", opacity: 1, x: 0 }}
                exit={{ x: "100%", opacity: 0 }}
                transition={{ duration: 0.34, ease: [0.16, 1, 0.3, 1] }}
                style={{ transformOrigin: "right center" }}
                role={isMobileViewport ? "dialog" : undefined}
                aria-modal={isMobileViewport ? true : undefined}
                aria-label="Primary navigation"
              >
                <div className="hero-nav__sheet-head">
                  <h2 className="hero-nav__sheet-title">Menu</h2>
                  <button
                    type="button"
                    className="hero-nav__close"
                    aria-label="Close navigation"
                    onClick={() => setMenuOpen(false)}
                  >
                    <span aria-hidden="true">×</span>
                  </button>
                </div>
              <motion.div
                className="hero-nav__links"
                initial={false}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 28 }}
                transition={{ duration: 0.22, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              >
                <a className="hero-nav__link hero-nav__link--active" href="#home" onClick={() => setMenuOpen(false)}>
                  Home
                </a>
                <a className="hero-nav__link" href="#about" onClick={() => setMenuOpen(false)}>
                  About
                </a>
                <a className="hero-nav__link" href="#tracks" onClick={() => setMenuOpen(false)}>
                  Tracks
                </a>
                <a className="hero-nav__link" href="#gallery" onClick={() => setMenuOpen(false)}>
                  Gallery
                </a>
                <a className="hero-nav__link" href="#faqs" onClick={() => setMenuOpen(false)}>
                  FAQs
                </a>
                <a className="hero-nav__link" href="#contact" onClick={() => setMenuOpen(false)}>
                  Contact
                </a>
              </motion.div>
              </motion.nav>
            </>
          ) : null}
        </AnimatePresence>

        <div className="hero-content">
        {/* DevJams '26 Logo Container - Placed ON TOP (z-30) */}
        <div className="hero-logo-canvas relative z-30 w-[955.5px] h-[170.98px] max-w-full scale-[0.36] min-[440px]:scale-[0.52] sm:scale-[0.72] md:scale-[0.88] lg:scale-100 transition-all origin-center">
          {logoLetters.map((letter, index) => (
            <motion.div
              key={index}
              initial={false}
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
        <div
          ref={trackIconsRef}
          className="hero-track-icons relative z-10 flex items-center justify-center -mt-8 sm:-mt-14 md:-mt-20 scale-[0.75] sm:scale-90 md:scale-100 origin-center pointer-events-none"
        >
          {trackIcons.map((icon, index) => {
            const shapeKey = index === 0 ? "android" : index === 1 ? "web" : undefined;
            const shapeRef = shapeKey === "android" ? androidRef : shapeKey === "web" ? webRef : undefined;

            return (
              <motion.div
                key={index}
                ref={shapeRef}
                initial={false}
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
                        zIndex: 20,
                        opacity:
                          shapeKey === "android"
                            ? androidFrameThreeOpacity
                            : frameThreeWebOpacity,
                      }
                    : index === 2
                      ? { opacity: geminiOpacity, scale: geminiScale }
                      : { opacity: cloudOpacity }
                }
                className={`relative flex items-center justify-center mix-blend-screen ${icon.className}`}
              >
                <motion.div
                  initial={false}
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
        {/* Idea Submission Button */}
        <motion.button
          type="button"
          initial={false}
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
            width: "min(243px, calc(100vw - 32px))",
            height: "55px",
            fontFamily: '"Google Sans", var(--font-google-sans), sans-serif',
          }}
        >
          Idea Submission
        </motion.button>


        </div>
      </section>

      <section id="about" ref={frameTwoRef} className="about-devjams">
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
          left: isMobileViewport
            ? FRAME_TWO_MOBILE_SHAPES.maps.x * mobileFrameScale
            : FRAME_TWO_MAPS_LEFT * frameScale,
          top: isMobileViewport
            ? `calc(100vh + ${FRAME_TWO_MOBILE_SHAPES.maps.y * mobileFrameVerticalScale}px)`
            : undefined,
          width: isMobileViewport
            ? FRAME_TWO_MOBILE_SHAPES.maps.width * mobileFrameScale
            : undefined,
          height: isMobileViewport
            ? FRAME_TWO_MOBILE_SHAPES.maps.height * mobileFrameVerticalScale
            : undefined,
          opacity: mapsOpacity,
          x: mapsFrameThreeX,
          y: mapsFrameThreeY,
          scaleX: mapsFrameThreeScaleX,
          scaleY: mapsFrameThreeScaleY,
          zIndex: isMobileViewport ? 5 : 20,
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

      <section id="tracks" ref={frameThreeRef} className="frame-three">
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
              y: frameThreeGeminiY,
              scaleX: frameThreeGeminiScaleX,
              scaleY: frameThreeGeminiScaleY,
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
              y: frameThreeGearY,
              scaleX: frameThreeGearScaleX,
              scaleY: frameThreeGearScaleY,
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

      <section id="about-vit" ref={frameFourRef} className="frame-four">
        <motion.div
          className="frame-four__content"
          style={{
            opacity: frameFourAboutOpacity,
            x: frameFourAboutX,
            y: frameFourAboutY,
          }}
        >
          <h2 className="frame-four__title">About VIT</h2>
          <p className="frame-four__description">
            VIT, ranked 11th in NIRF engineering, is a premier Indian university attracting talent from across the nation and abroad. Known for its cultural diversity, it combines innovative education with world-class infrastructure and cutting-edge technology.
          </p>
        </motion.div>

        <div className="frame-four__logos" aria-label="VIT tracks">
          <motion.div
            className="frame-four__logo frame-four__logo--cloud"
            style={{
              left: FRAME_FOUR_START_SHAPES.cloud.x * frameScale,
              top: FRAME_FOUR_START_SHAPES.cloud.y * frameScale,
              width: FRAME_FOUR_START_SHAPES.cloud.width * frameScale,
              height: FRAME_FOUR_START_SHAPES.cloud.height * frameScale,
              x: frameFourCloudX,
              y: frameFourCloudY,
              scale: frameFourCloudScale,
              opacity: frameFourCloudOpacity,
            }}
          >
            <Image
              src="/assets/cloud.svg"
              alt="Cloud"
              width={278}
              height={203}
              className="frame-four__logo-image"
            />
          </motion.div>
        </div>
      </section>
      {/* Remaining site sections */}
      <Tracks />
      <PreviousEvents />
      <GotQuestions />

      {/* Footer Section */}
      <Footer />

    </main>
  );
}
