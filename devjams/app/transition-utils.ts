export type ShapeBounds = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type ShapeTransform = {
  x: number;
  y: number;
  scaleX: number;
  scaleY: number;
};

export function menuDefaultsOpenAtViewport(viewportWidth: number): boolean {
  return viewportWidth > 700;
}

export const FRAME_REFERENCE_WIDTH = 1440;
export const MOBILE_FRAME_REFERENCE_WIDTH = 375;
export const MOBILE_FRAME_REFERENCE_HEIGHT = 812;

export function frameScaleAtViewport(viewportWidth: number): number {
  return Math.min(1, Math.max(0, viewportWidth / FRAME_REFERENCE_WIDTH));
}

export function mobileFrameScaleAtViewport(viewportWidth: number): number {
  return Math.min(1, Math.max(0, viewportWidth / MOBILE_FRAME_REFERENCE_WIDTH));
}

export function mobileFrameVerticalScaleAtViewport(viewportHeight: number): number {
  return Math.max(0, viewportHeight / MOBILE_FRAME_REFERENCE_HEIGHT);
}

export function frameTwoMapsOpacityAt(progress: number) {
  const p = Math.min(1, Math.max(0, progress));
  const rawOpacity =
    p <= 0.35
      ? 0
      : p <= 0.6
        ? ((p - 0.35) / 0.25) * 0.45
        : p <= 0.85
          ? 0.45 + ((p - 0.6) / 0.25) * 0.4
          : 0.85 + ((p - 0.85) / 0.15) * 0.15;

  return smoothScrollProgressAt(rawOpacity);
}

const FRAME_TWO_MAP_ENTRY_OFFSET_X = 320;
const FRAME_TWO_MAP_ENTRY_START_SCALE = 0.72;

export function frameTwoMapEntryTransformAt(progress: number) {
  const p = smoothScrollProgressAt(progress);
  return {
    x: FRAME_TWO_MAP_ENTRY_OFFSET_X * (1 - p),
    scale: FRAME_TWO_MAP_ENTRY_START_SCALE + (1 - FRAME_TWO_MAP_ENTRY_START_SCALE) * p,
  };
}

export const FRAME_ONE_ANIMATION_START_PROGRESS = 0.5;
export const FRAME_TWO_CONTENT_ENTER_OFFSET = { x: -160, y: 0 };
export const FRAME_THREE_EDGE_LOGO_OFFSETS = { gemini: -420, gear: 420 };
export const HERO_TRACK_ENTRY_DELAYS = [0.5, 0.6, 0.7, 0.8] as const;
export const FRAME_FOUR_CONTENT_ENTER_OFFSET = { x: 160, y: 0 } as const;

export function frameFourContentOffsetAt(progress: number) {
  return FRAME_FOUR_CONTENT_ENTER_OFFSET.x * (1 - smoothScrollProgressAt(progress));
}

export function interpolateShapeBounds(
  start: ShapeBounds,
  target: ShapeBounds,
  progress: number,
): ShapeBounds {
  const p = Math.min(1, Math.max(0, progress));
  return {
    x: start.x + (target.x - start.x) * p,
    y: start.y + (target.y - start.y) * p,
    width: start.width + (target.width - start.width) * p,
    height: start.height + (target.height - start.height) * p,
  };
}

export function uniformShapeTransformAt(
  start: ShapeBounds,
  target: ShapeBounds,
  progress: number,
): ShapeTransform {
  const current = interpolateShapeBounds(start, target, progress);
  const startCenterX = start.x + start.width / 2;
  const startCenterY = start.y + start.height / 2;
  const scale = Math.min(current.width / start.width, current.height / start.height);

  return {
    x: current.x + current.width / 2 - startCenterX,
    y: current.y + current.height / 2 - startCenterY,
    scaleX: scale,
    scaleY: scale,
  };
}

export function halfVisibleScrollAt(
  sectionTop: number,
  sectionHeight: number,
  viewportHeight: number,
) {
  return sectionTop + sectionHeight / 2 - viewportHeight;
}

export function scrollTransitionProgressAt(
  scrollY: number,
  start: number,
  end: number,
) {
  if (end <= start) return scrollY >= end ? 1 : 0;
  return Math.min(1, Math.max(0, (scrollY - start) / (end - start)));
}

export function smoothScrollProgressAt(progress: number) {
  const p = Math.min(1, Math.max(0, progress));
  return p * p * (3 - 2 * p);
}

const GEMINI_FADE_STOPS = [
  [0, 1],
  [0.25, 0.85],
  [0.5, 0.5],
  [0.75, 0.15],
  [1, 0],
] as const;

export function geminiOpacityAt(progress: number) {
  const p = Math.min(1, Math.max(0, progress));

  for (let index = 1; index < GEMINI_FADE_STOPS.length; index += 1) {
    const [endProgress, endOpacity] = GEMINI_FADE_STOPS[index];
    const [startProgress, startOpacity] = GEMINI_FADE_STOPS[index - 1];

    if (p <= endProgress) {
      const segmentProgress = (p - startProgress) / (endProgress - startProgress);
      return startOpacity + (endOpacity - startOpacity) * segmentProgress;
    }
  }

  return 0;
}

export function heroMenuShouldCollapseAtScroll(scrollY: number) {
  return scrollY > 0;
}
