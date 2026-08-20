"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties, ElementType } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText as GSAPSplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, GSAPSplitText, useGSAP);

type SplitTextProps = {
  tag?: ElementType;
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
  ease?: string;
  splitType?: string;
  from?: gsap.TweenVars;
  to?: gsap.TweenVars;
  threshold?: number;
  rootMargin?: string;
  textAlign?: CSSProperties["textAlign"];
  /**
   * Ceiling on the whole stagger window, in seconds. `delay` is per target, so
   * without a cap the reveal grows with the length of the copy — the About GDG
   * paragraph is 169 characters, which at 35ms each took 6.7s to finish and
   * read as a slow typewriter you scroll past mid-animation. The stagger is
   * compressed to fit this budget instead.
   */
  maxStaggerWindow?: number;
  onLetterAnimationComplete?: () => void;
};

type SplitElement = HTMLElement & {
  _rbsplitInstance?: { revert: () => void };
};

export default function SplitText({
  text,
  className = "",
  delay = 50,
  duration = 1.25,
  ease = "power3.out",
  splitType = "chars",
  from = { opacity: 0, y: 40 },
  to = { opacity: 1, y: 0 },
  threshold = 0.1,
  rootMargin = "-100px",
  textAlign = "center",
  tag = "p",
  maxStaggerWindow = 0.5,
  onLetterAnimationComplete,
}: SplitTextProps) {
  const ref = useRef<SplitElement>(null);
  const animationCompletedRef = useRef(false);
  const onCompleteRef = useRef(onLetterAnimationComplete);
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    onCompleteRef.current = onLetterAnimationComplete;
  }, [onLetterAnimationComplete]);
  useEffect(() => {
    let active = true;
    const markFontsLoaded = () => {
      if (active) setFontsLoaded(true);
    };

    if (document.fonts.status === "loaded") {
      queueMicrotask(markFontsLoaded);
    } else {
      document.fonts.ready.then(markFontsLoaded);
    }

    return () => {
      active = false;
    };
  }, []);

  useGSAP(
    () => {
      if (!ref.current || !text || !fontsLoaded) return;
      if (animationCompletedRef.current) return;

      const element = ref.current;
      element._rbsplitInstance?.revert();
      element._rbsplitInstance = undefined;

      const startPct = (1 - threshold) * 100;
      const marginMatch = /^(-?\d+(?:\.\d+)?)(px|em|rem|%)?$/.exec(rootMargin);
      const marginValue = marginMatch ? parseFloat(marginMatch[1]) : 0;
      const marginUnit = marginMatch?.[2] || "px";
      const sign =
        marginValue === 0
          ? ""
          : marginValue < 0
            ? `-=${Math.abs(marginValue)}${marginUnit}`
            : `+=${marginValue}${marginUnit}`;
      const start = `top ${startPct}%${sign}`;

      let targets: Element[] = [];
      const assignTargets = (instance: {
        chars: Element[];
        words: Element[];
        lines: Element[];
      }) => {
        if (splitType.includes("chars") && instance.chars.length) targets = instance.chars;
        if (!targets.length && splitType.includes("words") && instance.words.length) targets = instance.words;
        if (!targets.length && splitType.includes("lines") && instance.lines.length) targets = instance.lines;
        if (!targets.length) targets = instance.chars || instance.words || instance.lines;
      };

      const splitInstance = new GSAPSplitText(element, {
        type: splitType,
        smartWrap: true,
        autoSplit: splitType === "lines",
        linesClass: "split-line",
        wordsClass: "split-word",
        charsClass: "split-char",
        reduceWhiteSpace: false,
        onSplit: (instance) => {
          assignTargets(instance);

          // Someone scrolling past should see the copy resolve, not watch it
          // type itself out. Skip straight to the resting state when the reader
          // has asked for less motion.
          if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            gsap.set(targets, { ...to, clearProps: "willChange" });
            animationCompletedRef.current = true;
            onCompleteRef.current?.();
            return undefined;
          }

          const steps = Math.max(1, targets.length - 1);
          const stagger = Math.min(delay / 1000, maxStaggerWindow / steps);

          return gsap.fromTo(
            targets,
            { ...from },
            {
              ...to,
              duration,
              ease,
              stagger,
              scrollTrigger: {
                trigger: element,
                start,
                once: true,
                fastScrollEnd: true,
                anticipatePin: 0.4,
              },
              onComplete: () => {
                animationCompletedRef.current = true;
                onCompleteRef.current?.();
              },
              willChange: "transform, opacity",
              force3D: true,
            },
          );
        },
      });

      element._rbsplitInstance = splitInstance;

      return () => {
        ScrollTrigger.getAll().forEach((scrollTrigger) => {
          if (scrollTrigger.trigger === element) scrollTrigger.kill();
        });
        splitInstance.revert();
        element._rbsplitInstance = undefined;
      };
    },
    {
      dependencies: [
        text,
        delay,
        duration,
        ease,
        splitType,
        JSON.stringify(from),
        JSON.stringify(to),
        threshold,
        rootMargin,
        maxStaggerWindow,
        fontsLoaded,
      ],
      scope: ref,
    },
  );

  const Tag = tag as ElementType;
  return (
    <Tag
      ref={ref}
      style={{
        textAlign,
        overflow: "hidden",
        display: "inline-block",
        whiteSpace: "normal",
        wordWrap: "break-word",
        willChange: "transform, opacity",
      }}
      className={`split-parent ${className}`.trim()}
    >
      {text}
    </Tag>
  );
}
