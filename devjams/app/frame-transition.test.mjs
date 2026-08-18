import test from "node:test";
import assert from "node:assert/strict";
import {
  FRAME_THREE_LOGO_HEIGHT,
  FRAME_THREE_LOGOS,
  FRAME_THREE_MOBILE_SHAPES,
  FRAME_ONE_ANIMATION_START_PROGRESS,
  FRAME_REFERENCE_WIDTH,
  FRAME_TWO_MOBILE_SHAPES,
  FRAME_TWO_SHAPES,
  FRAME_TWO_LOGO_CENTER_X,
  FRAME_TWO_MAPS_LEFT,
  FRAME_TWO_MAPS_RIGHT_NUDGE,
  FRAME_FOUR_CONTENT_ENTER_OFFSET,
  FRAME_FOUR_LOGO_ORDER,
  FRAME_FOUR_SHAPES,
  FRAME_FOUR_MOBILE_SHAPES,
  frameFourContentOffsetAt,
  frameFourSharedLogoTransformAt,
  frameScaleAtViewport,
  mobileFrameScaleAtViewport,
  mobileFrameVerticalScaleAtViewport,
  scaleMobileShapeBoundsAtViewport,
  geminiOpacityAt,
  halfVisibleScrollAt,
  alignShapeBoundsX,
  frameTwoMapEntryTransformAt,
  frameTwoMapsOpacityAt,
  interpolateShapeBounds,
  scaleShapeBounds,
  scrollTransitionProgressAt,
  shapeTransformAt,
  HERO_TRACK_ENTRY_DELAYS,
  smoothScrollProgressAt,
  uniformShapeTransformAt,
  FRAME_THREE_EDGE_LOGO_OFFSETS,
  FRAME_TWO_CONTENT_ENTER_OFFSET,
  heroMenuShouldCollapseAtScroll,
  menuDefaultsOpenAtViewport,
  frameThreeMapsShapeAtViewport,
} from "./frame-transition.ts";

test("menu opens by default only above the mobile breakpoint", () => {
  assert.equal(menuDefaultsOpenAtViewport(375), false);
  assert.equal(menuDefaultsOpenAtViewport(700), false);
  assert.equal(menuDefaultsOpenAtViewport(701), true);
  assert.equal(menuDefaultsOpenAtViewport(1440), true);
});
test("responsive frame scale clamps to the shared reference width", () => {
  const mobileScale = frameScaleAtViewport(320);

  assert.ok(Number.isFinite(mobileScale));
  assert.ok(mobileScale > 0);
  assert.equal(frameScaleAtViewport(FRAME_REFERENCE_WIDTH), 1);
  assert.equal(frameScaleAtViewport(1920), 1);
});

test("shape bounds scaling preserves zero and identity behavior", () => {
  const bounds = { x: 12, y: 24, width: 48, height: 96 };

  assert.deepEqual(scaleShapeBounds(bounds, 0), {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });
  assert.deepEqual(scaleShapeBounds(bounds, 1), bounds);
});

test("Frame 4 mobile artwork fills the left edge and full frame height", () => {
  assert.equal(mobileFrameScaleAtViewport(375), 1);
  assert.equal(mobileFrameScaleAtViewport(320), 320 / 375);
  assert.equal(mobileFrameVerticalScaleAtViewport(812), 1);

  const shapes = Object.values(FRAME_FOUR_MOBILE_SHAPES);
  assert.ok(shapes.every((shape) => shape.x >= -20));
  assert.ok(shapes.every((shape) => shape.x + shape.width <= 375));
  assert.ok(Math.min(...shapes.map((shape) => shape.y)) <= 0);
  assert.ok(Math.max(...shapes.map((shape) => shape.y + shape.height)) >= 812);
  assert.ok(shapes[0].y < shapes[1].y);
  assert.ok(shapes[1].y < shapes[2].y);
});

test("Frame 2 mobile artwork fills the right edge and full frame height", () => {
  const shapes = Object.values(FRAME_TWO_MOBILE_SHAPES);

  assert.ok(shapes.every((shape) => shape.x >= 0));
  assert.ok(shapes.every((shape) => shape.x + shape.width <= 375));
  assert.ok(Math.min(...shapes.map((shape) => shape.y)) <= 0);
  assert.ok(Math.max(...shapes.map((shape) => shape.y + shape.height)) >= 812);
  assert.ok(shapes[0].y < shapes[1].y);
  assert.ok(shapes[1].y < shapes[2].y);
});

test("mobile shape bounds keep horizontal and vertical frame scales separate", () => {
  assert.deepEqual(
    scaleMobileShapeBoundsAtViewport(
      { x: 125, y: -20, width: 250, height: 280 },
      320,
      812,
    ),
    {
      x: 320 / 375 * 125,
      y: -20,
      width: 320 / 375 * 250,
      height: 280,
    },
  );
});

test("mobile Web handoff aligns with the Frame 3 four-logo row", () => {
  const web = FRAME_THREE_MOBILE_SHAPES.web;
  const frameScale = 375 / FRAME_REFERENCE_WIDTH;
  const frameThreeWeb = FRAME_THREE_LOGOS.web;

  assert.ok(Math.abs(web.x - frameThreeWeb.x * frameScale) < 1e-6);
  assert.ok(Math.abs(web.y - frameThreeWeb.y * frameScale) < 1e-6);
  assert.ok(Math.abs(web.width - frameThreeWeb.width * frameScale) < 1e-6);
  assert.ok(web.x + web.width <= 375);
  assert.ok(web.y + web.height <= 812);
});

test("mobile Frame 3 maps use the compact four-logo row target", () => {
  assert.deepEqual(
    frameThreeMapsShapeAtViewport(true),
    FRAME_THREE_MOBILE_SHAPES.maps,
  );
  assert.deepEqual(
    frameThreeMapsShapeAtViewport(false),
    FRAME_THREE_LOGOS.maps,
  );
});
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

test("Frame 3 logo row uses reduced overlapping desktop bounds", () => {
  const logos = Object.values(FRAME_THREE_LOGOS);
  const left = Math.min(...logos.map((logo) => logo.x));
  const right = Math.max(...logos.map((logo) => logo.x + logo.width));

  assert.ok(Math.abs(left - 287.55) < 1e-9);
  assert.ok(Math.abs(right - 1152.45) < 1e-9);
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
