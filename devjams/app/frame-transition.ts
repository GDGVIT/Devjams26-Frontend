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
