export type ShapeBounds = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export function menuDefaultsOpenAtViewport(viewportWidth: number): boolean {
  return viewportWidth > 700;
}
export const FRAME_REFERENCE_WIDTH = 1440;

export function frameScaleAtViewport(viewportWidth: number): number {
  return Math.min(1, Math.max(0, viewportWidth / FRAME_REFERENCE_WIDTH));
}

export function scaleShapeBounds(shape: ShapeBounds, scale: number): ShapeBounds {
  return {
    x: shape.x * scale,
    y: shape.y * scale,
    width: shape.width * scale,
    height: shape.height * scale,
  };
}
export const MOBILE_FRAME_REFERENCE_WIDTH = 375;
export const MOBILE_FRAME_REFERENCE_HEIGHT = 812;

export function mobileFrameScaleAtViewport(viewportWidth: number): number {
  return Math.min(
    1,
    Math.max(0, viewportWidth / MOBILE_FRAME_REFERENCE_WIDTH),
  );
}

export function mobileFrameVerticalScaleAtViewport(viewportHeight: number): number {
  return Math.max(0, viewportHeight / MOBILE_FRAME_REFERENCE_HEIGHT);
}

export function scaleMobileShapeBoundsAtViewport(
  shape: ShapeBounds,
  viewportWidth: number,
  viewportHeight: number,
): ShapeBounds {
  const horizontalScale = mobileFrameScaleAtViewport(viewportWidth);
  const verticalScale = mobileFrameVerticalScaleAtViewport(viewportHeight);

  return {
    x: shape.x * horizontalScale,
    y: shape.y * verticalScale,
    width: shape.width * horizontalScale,
    height: shape.height * verticalScale,
  };
}

export const FRAME_TWO_MOBILE_SHAPES = {
  web: {
    x: 125,
    y: -20,
    width: 250,
    height: 280,
  },
  maps: {
    x: 75,
    y: 220,
    width: 300,
    height: 390,
  },
  android: {
    x: 10,
    y: 610,
    width: 365,
    height: 202,
  },
} as const satisfies Record<string, ShapeBounds>;

export const FRAME_FOUR_MOBILE_SHAPES = {
  gear: {
    x: -20,
    y: -20,
    width: 250,
    height: 280,
  },
  gemini: {
    x: -20,
    y: 220,
    width: 300,
    height: 390,
  },
  cloud: {
    x: -20,
    y: 610,
    width: 365,
    height: 202,
  },
} as const satisfies Record<string, ShapeBounds>;
export const FRAME_THREE_MOBILE_SHAPES = {
  web: {
    x: 74.8828125,
    y: 85.9375,
    width: 60.9375,
    height: 67.96875,
  },
  maps: {
    x: 124.5703125,
    y: 85.9375,
    width: 65.625,
    height: 67.96875,
  },
  gemini: {
    x: 178.9453125,
    y: 85.9375,
    width: 67.96875,
    height: 67.96875,
  },
  gear: {
    x: 235.6640625,
    y: 85.9375,
    width: 64.453125,
    height: 67.96875,
  },
} as const satisfies Record<string, ShapeBounds>;

export type ShapeTransform = {
  x: number;
  y: number;
  scaleX: number;
  scaleY: number;
};

export const FRAME_TWO_SHAPES = {
  web: {
    x: 866.7959,
    y: 0.4502,
    width: 453.8907,
    height: 453.8907,
  },
  maps: {
    x: 911.1626,
    y: 387.2815,
    width: 364.106,
    height: 464.3671,
  },
  android: {
    x: 860,
    y: 739.2776,
    width: 467.627,
    height: 285.7433,
  },
} as const satisfies Record<string, ShapeBounds>;
export const FRAME_TWO_LOGO_CENTER_X =
  Object.values(FRAME_TWO_SHAPES).reduce(
    (center, shape) => center + shape.x + shape.width / 2,
    0,
  ) / Object.values(FRAME_TWO_SHAPES).length;

export const FRAME_TWO_MAPS_RIGHT_NUDGE = 40;
export const FRAME_TWO_MAPS_LEFT =
  FRAME_TWO_LOGO_CENTER_X -
  FRAME_TWO_SHAPES.maps.width / 2 +
  FRAME_TWO_MAPS_RIGHT_NUDGE;

export function alignShapeBoundsX(
  shape: ShapeBounds,
  centerX: number,
): ShapeBounds {
  return {
    ...shape,
    x: centerX - shape.width / 2,
  };
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

export const FRAME_TWO_MAP_ENTRY_OFFSET_X = 320;
export const FRAME_TWO_MAP_ENTRY_START_SCALE = 0.72;

export function frameTwoMapEntryTransformAt(progress: number) {
  const p = smoothScrollProgressAt(progress);
  return {
    x: FRAME_TWO_MAP_ENTRY_OFFSET_X * (1 - p),
    scale:
      FRAME_TWO_MAP_ENTRY_START_SCALE +
      (1 - FRAME_TWO_MAP_ENTRY_START_SCALE) * p,
  };
}

export const FRAME_ONE_ANIMATION_START_PROGRESS = 0.5;
export const FRAME_TWO_CONTENT_ENTER_OFFSET = {
  x: -160,
  y: 0,
};

export const FRAME_THREE_EDGE_LOGO_OFFSETS = {
  gemini: -420,
  gear: 420,
};
export const HERO_TRACK_ENTRY_DELAYS = [0.5, 0.6, 0.7, 0.8] as const;
export const FRAME_THREE_LOGO_HEIGHT = 261;

export const FRAME_THREE_LOGOS = {
  gemini: {
    x: 687.15,
    y: 330,
    width: 261,
    height: FRAME_THREE_LOGO_HEIGHT,
  },
  web: {
    x: 287.55,
    y: 330,
    width: 234,
    height: FRAME_THREE_LOGO_HEIGHT,
  },
  maps: {
    x: 478.35,
    y: 330,
    width: 252,
    height: FRAME_THREE_LOGO_HEIGHT,
  },
  gear: {
    x: 904.95,
    y: 330,
    width: 247.5,
    height: FRAME_THREE_LOGO_HEIGHT,
  },
} as const satisfies Record<string, ShapeBounds>;

export function frameThreeMapsShapeAtViewport(isMobile: boolean): ShapeBounds {
  return isMobile ? FRAME_THREE_MOBILE_SHAPES.maps : FRAME_THREE_LOGOS.maps;
}

export const FRAME_FOUR_LOGO_Z_INDEX = 20;
export const FRAME_FOUR_LOGO_ORDER = ["gear", "gemini", "cloud"] as const;
export const FRAME_FOUR_SHAPES = {
  gear: {
    x: 80,
    y: 12.294572,
    width: 514.7120538,
    height: 514.7120538,
  },
  gemini: {
    x: 143.80822,
    y: 333.350487,
    width: 405.249978,
    height: 516.8405823,
  },
  cloud: {
    x: 112.373,
    y: 739.2776,
    width: 467.627,
    height: 285.7433,
  },
} as const satisfies Record<string, ShapeBounds>;

export const FRAME_FOUR_CONTENT_ENTER_OFFSET = {
  x: 160,
  y: 0,
} as const;

export function frameFourContentOffsetAt(progress: number) {
  return FRAME_FOUR_CONTENT_ENTER_OFFSET.x * (1 - smoothScrollProgressAt(progress));
}

const GEMINI_FADE_STOPS = [
  [0, 1],
  [0.25, 0.85],
  [0.5, 0.5],
  [0.75, 0.15],
  [1, 0],
] as const;

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

export function shapeTransformAt(
  start: ShapeBounds,
  target: ShapeBounds,
  progress: number,
): ShapeTransform {
  const current = interpolateShapeBounds(start, target, progress);
  const startCenterX = start.x + start.width / 2;
  const startCenterY = start.y + start.height / 2;

  return {
    x: current.x + current.width / 2 - startCenterX,
    y: current.y + current.height / 2 - startCenterY,
    scaleX: current.width / start.width,
    scaleY: current.height / start.height,
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
  const scale = Math.min(
    current.width / start.width,
    current.height / start.height,
  );

  return {
    x: current.x + current.width / 2 - startCenterX,
    y: current.y + current.height / 2 - startCenterY,
    scaleX: scale,
    scaleY: scale,
  };
}

export function frameFourSharedLogoTransformAt(
  start: ShapeBounds,
  target: ShapeBounds,
  progress: number,
) {
  return uniformShapeTransformAt(start, target, progress);
}

export function halfVisibleScrollAt(
  sectionTop: number,
  sectionHeight: number,
  viewportHeight: number,
) {
  return sectionTop + sectionHeight / 2 - viewportHeight;
}

export function sectionProgressAt(
  sectionTop: number,
  sectionHeight: number,
  viewportHeight: number,
  scrollY: number,
) {
  const start = sectionTop - viewportHeight;
  return Math.min(1, Math.max(0, (scrollY - start) / sectionHeight));
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

export function geminiOpacityAt(progress: number) {
  const p = Math.min(1, Math.max(0, progress));

  for (let index = 1; index < GEMINI_FADE_STOPS.length; index += 1) {
    const [endProgress, endOpacity] = GEMINI_FADE_STOPS[index];
    const [startProgress, startOpacity] = GEMINI_FADE_STOPS[index - 1];

    if (p <= endProgress) {
      const segmentProgress =
        (p - startProgress) / (endProgress - startProgress);
      return startOpacity + (endOpacity - startOpacity) * segmentProgress;
    }
  }

  return 0;
}

export function heroMenuShouldCollapseAtScroll(scrollY: number) {
  return scrollY > 0;
}
