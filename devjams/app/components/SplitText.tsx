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
  onLetterAnimationComplete?: () => void;
};

type SplitElement = HTMLElement & {
  _rbsplitInstance?: { revert: () => void };
};

export default function SplitText({
  text,
  className = "",
  delay = 25,
  duration = 0.6,
  ease = "power3.out",
  splitType = "words",
  from = { opacity: 0, y: 30 },
  to = { opacity: 1, y: 0 },
  threshold = 0.1,
  rootMargin = "-100px",
  textAlign = "center",
  tag = "p",
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
          return gsap.fromTo(
            targets,
            { ...from },
            {
              ...to,
              duration,
              ease,
              stagger: delay / 1000,
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
