import test from "node:test";
import assert from "node:assert/strict";
import {
  FRAME_THREE_LOGO_HEIGHT,
  FRAME_THREE_LOGOS,
  FRAME_ONE_ANIMATION_START_PROGRESS,
  FRAME_TWO_SHAPES,
  FRAME_TWO_LOGO_CENTER_X,
  FRAME_TWO_MAPS_LEFT,
  FRAME_TWO_MAPS_RIGHT_NUDGE,
  FRAME_FOUR_CONTENT_ENTER_OFFSET,
  FRAME_FOUR_LOGO_ORDER,
  FRAME_FOUR_SHAPES,
  frameFourContentOffsetAt,
  frameFourSharedLogoTransformAt,
  geminiOpacityAt,
  halfVisibleScrollAt,
  alignShapeBoundsX,
  frameTwoMapEntryTransformAt,
  frameTwoMapsOpacityAt,
  interpolateShapeBounds,
  scrollTransitionProgressAt,
  shapeTransformAt,
  HERO_TRACK_ENTRY_DELAYS,
  smoothScrollProgressAt,
  uniformShapeTransformAt,
  FRAME_THREE_EDGE_LOGO_OFFSETS,
  FRAME_TWO_CONTENT_ENTER_OFFSET,
  heroMenuShouldCollapseAtScroll,
} from "./frame-transition.ts";

test("Frame 2 content enters from the side and Frame 3 logos enter from opposite edges", () => {
  assert.ok(FRAME_TWO_CONTENT_ENTER_OFFSET.x < 0);
  assert.equal(FRAME_TWO_CONTENT_ENTER_OFFSET.y, 0);
  assert.ok(FRAME_THREE_EDGE_LOGO_OFFSETS.gemini < 0);
  assert.ok(FRAME_THREE_EDGE_LOGO_OFFSETS.gear > 0);
});

test("all four hero track logos have staggered entry delays", () => {
  assert.equal(HERO_TRACK_ENTRY_DELAYS.length, 4);
  assert.deepEqual(HERO_TRACK_ENTRY_DELAYS, [0.5, 0.6, 0.7, 0.8]);
});
test("Frame 2 map enters from the right while scaling into place", () => {
  assert.deepEqual(frameTwoMapEntryTransformAt(0), {
    x: 320,
    scale: 0.72,
  });
  assert.deepEqual(frameTwoMapEntryTransformAt(1), {
    x: 0,
    scale: 1,
  });

  const midpoint = frameTwoMapEntryTransformAt(0.5);
  assert.ok(midpoint.x > 0 && midpoint.x < 320);
  assert.ok(midpoint.scale > 0.72 && midpoint.scale < 1);
});

test("Frame 2 logos share one vertical center and smooth map visibility", () => {
  const aligned = Object.values(FRAME_TWO_SHAPES).map((shape) =>
    alignShapeBoundsX(shape, FRAME_TWO_LOGO_CENTER_X),
  );
  const centers = aligned.map((shape) => shape.x + shape.width / 2);

  assert.ok(centers.every((center) => Math.abs(center - FRAME_TWO_LOGO_CENTER_X) < 1e-9));
  assert.equal(
    FRAME_TWO_MAPS_LEFT,
    FRAME_TWO_LOGO_CENTER_X -
      FRAME_TWO_SHAPES.maps.width / 2 +
      FRAME_TWO_MAPS_RIGHT_NUDGE,
  );
  assert.equal(frameTwoMapsOpacityAt(0), 0);
  assert.ok(frameTwoMapsOpacityAt(0.5) > frameTwoMapsOpacityAt(0.4));
  assert.equal(frameTwoMapsOpacityAt(1), 1);
});
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

test("Frame 3 logo row preserves its horizontal bounds", () => {
  const logos = Object.values(FRAME_THREE_LOGOS);
  const left = Math.min(...logos.map((logo) => logo.x));
  const right = Math.max(...logos.map((logo) => logo.x + logo.width));

  assert.ok(Math.abs(left - 228) < 1e-9);
  assert.ok(Math.abs(right - (228 + 1003.7384033203125)) < 1e-9);
});

test("Frame 3 icons share one rendered height", () => {
  for (const logo of Object.values(FRAME_THREE_LOGOS)) {
    assert.equal(logo.height, FRAME_THREE_LOGO_HEIGHT);
  }
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

test("logo transforms preserve aspect ratio while resizing", () => {
  const start = { x: 0, y: 0, width: 200, height: 100 };
  const target = { x: 300, y: 400, width: 400, height: 300 };

  assert.deepEqual(uniformShapeTransformAt(start, target, 1), {
    x: 400,
    y: 500,
    scaleX: 2,
    scaleY: 2,
  });
});

test("section transitions finish when half the section is visible", () => {
  assert.equal(halfVisibleScrollAt(900, 1024, 900), 512);
  assert.equal(halfVisibleScrollAt(1924, 1024, 900), 1536);
});

test("Frame 1 animation starts at 50% and settles before the Frame 2 hold", () => {
  assert.equal(FRAME_ONE_ANIMATION_START_PROGRESS, 0.5);
  assert.equal(scrollTransitionProgressAt(449, 450, 900), 0);
  assert.equal(scrollTransitionProgressAt(450, 450, 900), 0);
  assert.equal(scrollTransitionProgressAt(675, 450, 900), 0.5);
  assert.equal(scrollTransitionProgressAt(900, 450, 900), 1);
});

test("scroll easing softens both transition ends", () => {
  assert.equal(smoothScrollProgressAt(0), 0);
  assert.ok(smoothScrollProgressAt(0.25) < 0.25);
  assert.equal(smoothScrollProgressAt(0.5), 0.5);
  assert.ok(smoothScrollProgressAt(0.75) > 0.75);
  assert.equal(smoothScrollProgressAt(1), 1);
});
test("Gemini fades continuously across the requested scroll range", () => {
  assert.equal(geminiOpacityAt(0), 1);
  assert.equal(geminiOpacityAt(0.25), 0.85);
  assert.equal(geminiOpacityAt(0.5), 0.5);
  assert.ok(Math.abs(geminiOpacityAt(0.75) - 0.15) < 1e-9);
  assert.equal(geminiOpacityAt(1), 0);
});

test("Frame 4 uses the requested left-side logo order and mirrored bounds", () => {
  assert.deepEqual(FRAME_FOUR_LOGO_ORDER, ["gear", "gemini", "cloud"]);
  assert.deepEqual(FRAME_FOUR_SHAPES, {
    gear: {
      x: 119.3134,
      y: 30.4502,
      width: 453.8907,
      height: 453.8907,
    },
    gemini: {
      x: 164.7314,
      y: 347.2815,
      width: 364.106,
      height: 464.3671,
    },
    cloud: {
      x: 112.373,
      y: 739.2776,
      width: 467.627,
      height: 285.7433,
    },
  });
});

test("Frame 4 content enters from the right and settles in place", () => {
  assert.equal(FRAME_FOUR_CONTENT_ENTER_OFFSET.x, 160);
  assert.equal(FRAME_FOUR_CONTENT_ENTER_OFFSET.y, 0);
  assert.equal(frameFourContentOffsetAt(0), 160);
  assert.equal(frameFourContentOffsetAt(1), 0);
  assert.ok(frameFourContentOffsetAt(0.5) > 0);
  assert.ok(frameFourContentOffsetAt(0.5) < 160);
});

test("Frame 3 gear and Gemini use shared transforms into Frame 4", () => {
  const gearStart = frameFourSharedLogoTransformAt(
    FRAME_THREE_LOGOS.gear,
    FRAME_FOUR_SHAPES.gear,
    0,
  );
  const gearEnd = frameFourSharedLogoTransformAt(
    FRAME_THREE_LOGOS.gear,
    FRAME_FOUR_SHAPES.gear,
    1,
  );
  const geminiEnd = frameFourSharedLogoTransformAt(
    FRAME_THREE_LOGOS.gemini,
    FRAME_FOUR_SHAPES.gemini,
    1,
  );

  assert.deepEqual(gearStart, {
    x: 0,
    y: 0,
    scaleX: 1,
    scaleY: 1,
  });
  assert.ok(gearEnd.x < 0);
  assert.ok(gearEnd.y < 0);
  assert.ok(gearEnd.scaleX > 1);
  assert.ok(geminiEnd.y > 0);
  assert.ok(geminiEnd.scaleX > 1);
});

test("hero menu collapses after scrolling and never auto-expands", () => {
  assert.equal(heroMenuShouldCollapseAtScroll(0), false);
  assert.equal(heroMenuShouldCollapseAtScroll(1), true);
  assert.equal(heroMenuShouldCollapseAtScroll(640), true);
});
