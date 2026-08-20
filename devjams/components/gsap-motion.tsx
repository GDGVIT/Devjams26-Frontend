"use client";

import gsap from "gsap";
import { useLenis } from "lenis/react";
import {
  createElement,
  forwardRef,
  Fragment,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useCallback,
  useRef,
  useState,
  type CSSProperties,
  type PropsWithChildren,
  type ReactNode,
  type Ref,
  type RefObject,
} from "react";

export interface MotionValue<T> {
  get(): T;
  set(value: T): void;
  on(event: "change", callback: (value: T) => void): () => void;
}

type AnimationTarget = Record<string, unknown>;
type MotionStyle = CSSProperties & Record<string, unknown>;

export interface MotionProps {
  initial?: false | AnimationTarget | string;
  animate?: AnimationTarget | string;
  exit?: AnimationTarget | string;
  whileInView?: AnimationTarget | string;
  whileHover?: AnimationTarget;
  whileTap?: AnimationTarget;
  variants?: Record<string, AnimationTarget>;
  viewport?: { once?: boolean; margin?: string; amount?: number };
  transition?: Record<string, unknown>;
  layoutId?: string;
  style?: MotionStyle;
  [key: string]: unknown;
}

function createValue<T>(initial: T): MotionValue<T> {
  let current = initial;
  const listeners = new Set<(value: T) => void>();
  return {
    get: () => current,
    set: (value) => {
      if (Object.is(current, value)) return;
      current = value;
      listeners.forEach((listener) => listener(value));
    },
    on: (_, callback) => {
      listeners.add(callback);
      return () => listeners.delete(callback);
    },
  };
}

export function useMotionValue<T>(initial: T) {
  const [value] = useState(() => createValue(initial));
  return value;
}

function clamp(value: number) {
  return Math.min(1, Math.max(0, value));
}

function mapRange(value: number, input: number[], output: Array<number | string>) {
  if (input.length < 2 || output.length < 2) return output[0] ?? value;
  if (value <= input[0]) return output[0];
  if (value >= input[input.length - 1]) return output[output.length - 1];
  for (let index = 1; index < input.length; index += 1) {
    if (value <= input[index]) {
      const progress = (value - input[index - 1]) / (input[index] - input[index - 1]);
      const start = output[index - 1];
      const end = output[index];
      if (typeof start === "number" && typeof end === "number") {
        return start + (end - start) * progress;
      }
      const startValue = Number.parseFloat(String(start));
      const endValue = Number.parseFloat(String(end));
      const unit = String(start).replace(String(startValue), "");
      return `${startValue + (endValue - startValue) * progress}${unit}`;
    }
  }
  return output[output.length - 1];
}

export function useTransform<T, R>(value: MotionValue<T>, mapper: (value: T) => R): MotionValue<R>;
export function useTransform<T, R>(values: MotionValue<T>[], mapper: (values: T[]) => R): MotionValue<R>;
export function useTransform(value: MotionValue<number>, input: number[], output: number[]): MotionValue<number>;
export function useTransform(value: MotionValue<number>, input: number[], output: Array<number | string>): MotionValue<number | string>;
export function useTransform<TInput>(
  source: MotionValue<TInput> | MotionValue<TInput>[],
  inputOrMapper: number[] | ((value: never) => unknown),
  output?: Array<number | string>,
): MotionValue<unknown> {
  const sourceValues = Array.isArray(source) ? source : [source];
  const derive = () => {
    if (Array.isArray(inputOrMapper)) {
      return mapRange(sourceValues[0].get() as number, inputOrMapper, output ?? []);
    }
    const mapper = inputOrMapper as (value: unknown | unknown[]) => unknown;
    return mapper(sourceValues.length === 1 ? sourceValues[0].get() : sourceValues.map((item) => item.get()));
  };
  const derived = useMotionValue(derive());

  useEffect(() => {
    const update = () => derived.set(derive());
    const cleanups = sourceValues.map((item) => item.on("change", update));
    update();
    return () => cleanups.forEach((cleanup) => cleanup());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [derived, inputOrMapper, output, sourceValues]);

  return derived;
}

function documentPosition(element: HTMLElement) {
  const rect = element.getBoundingClientRect();
  return { top: rect.top + window.scrollY, bottom: rect.bottom + window.scrollY };
}

function offsetPoint(element: HTMLElement, point: string, viewportHeight: number) {
  const position = documentPosition(element);
  const [edge, anchor] = point.split(" ");
  const elementPoint = edge === "end" ? position.bottom : position.top;
  const viewportPoint = anchor === "end" ? viewportHeight : anchor === "center" ? viewportHeight / 2 : anchor === "start" ? 0 : viewportHeight * Number(anchor);
  return elementPoint - viewportPoint;
}

export function useScroll(options?: { target?: RefObject<HTMLElement | null>; offset?: string[] }) {
  const scrollY = useMotionValue(0);
  const scrollYProgress = useMotionValue(0);
  const targetOption = options?.target;
  const offsetStart = options?.offset?.[0] ?? "start end";
  const offsetEnd = options?.offset?.[1] ?? "end start";
  const targetRef = useRef<HTMLElement | null>(null);
  const offsetsRef = useRef(options?.offset ?? ["start end", "end start"]);
  const rangeRef = useRef<{ element: HTMLElement; start: number; end: number } | null>(null);

  const refreshRange = useCallback(() => {
    const target = targetRef.current;
    if (!target) {
      rangeRef.current = null;
      return;
    }

    const offsets = offsetsRef.current;
    rangeRef.current = {
      element: target,
      start: offsetPoint(target, offsets[0], window.innerHeight),
      end: offsetPoint(target, offsets[1], window.innerHeight),
    };
  }, []);

  const updateFromLenis = useCallback((lenis: { scroll: number }) => {
    const currentScroll = lenis.scroll;
    scrollY.set(currentScroll);

    const target = targetRef.current;
    if (!target) {
      scrollYProgress.set(
        currentScroll /
          Math.max(1, document.documentElement.scrollHeight - window.innerHeight),
      );
      return;
    }

    if (rangeRef.current?.element !== target) refreshRange();
    const range = rangeRef.current;
    if (!range) return;
    scrollYProgress.set(
      clamp((currentScroll - range.start) / Math.max(1, range.end - range.start)),
    );
  }, [refreshRange, scrollY, scrollYProgress]);

  // Read Lenis directly so scroll-linked values update on the same frame as smooth scrolling.
  useLenis(updateFromLenis, []);

  useEffect(() => {
    targetRef.current = targetOption?.current ?? null;
    offsetsRef.current = [offsetStart, offsetEnd];
    refreshRange();
    window.addEventListener("resize", refreshRange);
    const fontsReady = document.fonts?.ready.then(refreshRange);
    return () => {
      window.removeEventListener("resize", refreshRange);
      void fontsReady;
    };
  }, [targetOption, offsetStart, offsetEnd, refreshRange]);

  return { scrollY, scrollYProgress };
}

type PendingMotionUpdate = {
  styles: Record<string, unknown>;
  attributes: Record<string, unknown>;
};

const pendingMotionUpdates = new Map<HTMLElement, PendingMotionUpdate>();
let motionFlushQueued = false;

function flushMotionUpdates() {
  motionFlushQueued = false;
  pendingMotionUpdates.forEach(({ styles, attributes }, element) => {
    if (Object.keys(styles).length > 0) gsap.set(element, { ...styles, force3D: true });
    Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, String(value)));
  });
  pendingMotionUpdates.clear();
}

// Flush on a microtask instead of the next rAF: Lenis already runs inside the
// GSAP ticker's rAF, so this applies scroll-linked styles in the same frame
// instead of one frame late (which reads as lag while smooth scrolling).
function scheduleMotionFlush() {
  if (motionFlushQueued) return;
  motionFlushQueued = true;
  if (typeof queueMicrotask === "function") {
    queueMicrotask(flushMotionUpdates);
  } else {
    Promise.resolve().then(flushMotionUpdates);
  }
}

function queueMotionStyle(element: HTMLElement, key: string, value: unknown) {
  const pending = pendingMotionUpdates.get(element) ?? { styles: {}, attributes: {} };
  pending.styles[key] = value;
  pendingMotionUpdates.set(element, pending);
  scheduleMotionFlush();
}

function queueMotionAttribute(element: HTMLElement, key: string, value: unknown) {
  const pending = pendingMotionUpdates.get(element) ?? { styles: {}, attributes: {} };
  pending.attributes[key] = value;
  pendingMotionUpdates.set(element, pending);
  scheduleMotionFlush();
}

function cancelMotionStyles(element: HTMLElement) {
  const pending = pendingMotionUpdates.get(element);
  if (!pending) return;
  pending.styles = {};
  if (Object.keys(pending.attributes).length === 0) pendingMotionUpdates.delete(element);
}

function cancelMotionAttributes(element: HTMLElement) {
  const pending = pendingMotionUpdates.get(element);
  if (!pending) return;
  pending.attributes = {};
  if (Object.keys(pending.styles).length === 0) pendingMotionUpdates.delete(element);
}

function isMotionValue(value: unknown): value is MotionValue<unknown> {
  return typeof value === "object" && value !== null && "get" in value && "on" in value;
}

function resolveTarget(value: false | AnimationTarget | string | undefined, variants?: Record<string, AnimationTarget>) {
  if (!value) return undefined;
  if (typeof value === "string") return variants?.[value];
  return value;
}

function gsapTarget(target: AnimationTarget) {
  const result: AnimationTarget = {};
  Object.entries(target).forEach(([key, value]) => {
    result[key] = isMotionValue(value) ? value.get() : value;
  });
  return result;
}

function parseGsapEase(ease: unknown): string {
  if (typeof ease === "string") {
    if (ease === "easeInOut") return "power1.inOut";
    if (ease === "easeOut") return "power1.out";
    if (ease === "easeIn") return "power1.in";
    if (ease === "linear") return "none";
    return ease;
  }
  if (Array.isArray(ease) && ease.length === 4) {
    const [, y1, , y2] = ease;
    if (Number(y1) > 0.8 || Number(y2) > 0.8) return "power2.out";
    return "power1.out";
  }
  return "power2.out";
}

function gsapTransition(transition?: Record<string, unknown>) {
  if (!transition) return { force3D: true, ease: "power2.out" };
  if (transition.type === "spring") {
    const stiffness = typeof transition.stiffness === "number" ? transition.stiffness : 200;
    const damping = typeof transition.damping === "number" ? transition.damping : 20;
    const overshoot = Math.max(1, Math.min(2.5, stiffness / (damping * 6)));
    return {
      duration: typeof transition.duration === "number" ? transition.duration : 0.6,
      ease: `back.out(${overshoot.toFixed(1)})`,
      force3D: true,
    };
  }
  return {
    duration: typeof transition.duration === "number" ? transition.duration : 0.4,
    delay: typeof transition.delay === "number" ? transition.delay : undefined,
    ease: parseGsapEase(transition.ease),
    repeat: transition.repeat === Infinity ? -1 : undefined,
    force3D: true,
  };
}

function MotionElement({ as, ...props }: MotionProps & { as: string }) {
  const elementRef = useRef<HTMLElement | null>(null);
  const { ref, initial, animate, exit, whileInView, whileHover, whileTap, variants, viewport, transition, style, layoutId, children, ...domProps } = props;
  useImperativeHandle(ref as Ref<HTMLElement>, () => elementRef.current as HTMLElement);

  useLayoutEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const initialTarget = resolveTarget(initial, variants);
    const animateTarget = resolveTarget(animate, variants);
    const inViewTarget = resolveTarget(whileInView, variants) ?? animateTarget;
    if (initialTarget) gsap.set(element, { ...gsapTarget(initialTarget), force3D: true });

    let activeAnimation: gsap.core.Tween | gsap.core.Timeline | undefined;
    const run = () => {
      if (inViewTarget) {
        activeAnimation?.kill();
        const targetVars = gsapTarget(inViewTarget);
        const arrayProps = Object.entries(targetVars).filter(([, v]) => Array.isArray(v));

        if (arrayProps.length > 0) {
          const [propName, rawKeyframes] = arrayProps[0] as [string, (number | string)[]];
          const trans = gsapTransition(transition);

          if (rawKeyframes.length === 3 && rawKeyframes[0] === rawKeyframes[2]) {
            // Yoyo float / pulse animation (e.g. y: [0, -8, 0])
            activeAnimation = gsap.to(element, {
              [propName]: rawKeyframes[1],
              duration: (trans.duration ?? 3) / 2,
              repeat: trans.repeat ?? -1,
              yoyo: true,
              ease: "sine.inOut",
              delay: trans.delay,
              force3D: true,
            });
          } else {
            // Multi-step keyframes timeline (never pass ease to timeline constructor)
            const tl = gsap.timeline({
              repeat: trans.repeat ?? 0,
              delay: trans.delay ?? 0,
            });
            const stepDuration = (trans.duration ?? 1) / Math.max(1, rawKeyframes.length - 1);
            rawKeyframes.forEach((val, idx) => {
              if (idx === 0) {
                gsap.set(element, { [propName]: val, force3D: true });
              } else {
                tl.to(element, {
                  [propName]: val,
                  duration: stepDuration,
                  ease: trans.ease ?? "power1.inOut",
                  force3D: true,
                });
              }
            });
            activeAnimation = tl;
          }
        } else {
          activeAnimation = gsap.to(element, {
            ...targetVars,
            ...gsapTransition(transition),
          });
        }
      }
    };

    let observer: IntersectionObserver | undefined;
    if (whileInView) {
      observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          run();
          if (viewport?.once !== false) observer?.disconnect();
        }
      }, { threshold: viewport?.amount ?? 0.1, rootMargin: viewport?.margin });
      observer.observe(element);
    } else {
      run();
    }

    const hoverTarget = whileHover ? gsapTarget(whileHover) : null;
    const tapTarget = whileTap ? gsapTarget(whileTap) : null;
    const onEnter = hoverTarget ? () => gsap.to(element, { ...hoverTarget, duration: 0.2, force3D: true }) : undefined;
    const onLeave = hoverTarget ? () => gsap.to(element, { ...gsapTarget(resolveTarget(animate, variants) ?? {}), duration: 0.2, force3D: true }) : undefined;
    const onPointerDown = tapTarget ? () => gsap.to(element, { ...tapTarget, duration: 0.12, force3D: true }) : undefined;
    const onPointerUp = tapTarget ? () => gsap.to(element, { ...gsapTarget(resolveTarget(animate, variants) ?? {}), duration: 0.12, force3D: true }) : undefined;
    if (onEnter) element.addEventListener("pointerenter", onEnter);
    if (onLeave) element.addEventListener("pointerleave", onLeave);
    if (onPointerDown) element.addEventListener("pointerdown", onPointerDown);
    if (onPointerUp) element.addEventListener("pointerup", onPointerUp);
    return () => {
      activeAnimation?.kill();
      observer?.disconnect();
      if (onEnter) element.removeEventListener("pointerenter", onEnter);
      if (onLeave) element.removeEventListener("pointerleave", onLeave);
      if (onPointerDown) element.removeEventListener("pointerdown", onPointerDown);
      if (onPointerUp) element.removeEventListener("pointerup", onPointerUp);
    };
  }, [animate, exit, initial, layoutId, transition, variants, viewport, whileHover, whileInView, whileTap]);

  useLayoutEffect(() => {
    const element = elementRef.current;
    if (!element || !style) return;

    const subscriptions = Object.entries(style)
      .filter(([, value]) => isMotionValue(value))
      .map(([key, value]) =>
        (value as MotionValue<unknown>).on("change", (next) => {
          queueMotionStyle(element, key, next);
        })
      );

    gsap.set(element, { ...gsapTarget(style as AnimationTarget), force3D: true });
    return () => {
      subscriptions.forEach((unsubscribe) => unsubscribe());
      cancelMotionStyles(element);
    };
  }, [style]);

  useLayoutEffect(() => {
    const element = elementRef.current;
    if (!element) return;
    const subscriptions = Object.entries(domProps)
      .filter(([, value]) => isMotionValue(value))
      .map(([key, value]) =>
        (value as MotionValue<unknown>).on("change", (next) => {
          queueMotionAttribute(element, key, next);
        })
      );
    return () => {
      subscriptions.forEach((unsubscribe) => unsubscribe());
      cancelMotionAttributes(element);
    };
  }, [domProps]);

  const renderedProps = Object.fromEntries(
    Object.entries(domProps).map(([key, value]) => [key, isMotionValue(value) ? value.get() : value]),
  );

  // The host ref is consumed by the layout effects above.
  // eslint-disable-next-line react-hooks/refs
  return createElement(as, {
    ...renderedProps,
    ref: elementRef,
  }, children as ReactNode);
}

const MotionComponent = forwardRef<HTMLElement, MotionProps & { as?: string }>((props, ref) => (
  <MotionElement {...props} as={typeof props.as === "string" ? props.as : "div"} ref={ref} />
));
MotionComponent.displayName = "GsapMotionElement";

function createMotionComponent(tag: string) {
  const component = forwardRef<HTMLElement, MotionProps>((props, ref) => (
    <MotionElement {...props} as={tag} ref={ref} />
  ));
  component.displayName = `GsapMotion(${tag})`;
  return component;
}

export const motion = new Proxy({} as Record<string, typeof MotionComponent>, {
  get: (_, tag: string) => createMotionComponent(tag),
});

export function useMotionValueEvent<T>(value: MotionValue<T>, event: "change", callback: (latest: T) => void) {
  useEffect(() => value.on(event, callback), [callback, event, value]);
}

export function AnimatePresence({ children }: PropsWithChildren<{ mode?: string }>) {
  return <Fragment>{children}</Fragment>;
}
