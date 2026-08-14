import test from "node:test";
import assert from "node:assert/strict";
import {
  FRAME_TWO_SHAPES,
  geminiOpacityAt,
  interpolateShapeBounds,
  shapeTransformAt,
} from "./frame-transition.ts";

test("Frame 2 shape targets preserve the supplied Figma bounds", () => {
  assert.deepEqual(FRAME_TWO_SHAPES.web, {
    x: 866.7959,
    y: 0.4502,
    width: 453.8907,
    height: 453.8907,
  });
  assert.deepEqual(FRAME_TWO_SHAPES.maps, {
    x: 911.1626,
    y: 387.2815,
    width: 364.106,
    height: 464.3671,
  });
  assert.deepEqual(FRAME_TWO_SHAPES.android, {
    x: 860,
    y: 739.2776,
    width: 467.627,
    height: 285.7433,
  });
});

test("shape transforms interpolate position and size from measured hero bounds", () => {
  const heroBounds = { x: 100, y: 200, width: 200, height: 100 };
  const targetBounds = { x: 500, y: 600, width: 400, height: 300 };

  assert.deepEqual(interpolateShapeBounds(heroBounds, targetBounds, 0.5), {
    x: 300,
    y: 400,
    width: 300,
    height: 200,
  });
  assert.deepEqual(shapeTransformAt(heroBounds, targetBounds, 1), {
    x: 500,
    y: 500,
    scaleX: 2,
    scaleY: 3,
  });
});

test("Gemini fades continuously across the requested scroll range", () => {
  assert.equal(geminiOpacityAt(0), 1);
  assert.equal(geminiOpacityAt(0.25), 0.85);
  assert.equal(geminiOpacityAt(0.5), 0.5);
  assert.ok(Math.abs(geminiOpacityAt(0.75) - 0.15) < 1e-9);
  assert.equal(geminiOpacityAt(1), 0);
});
