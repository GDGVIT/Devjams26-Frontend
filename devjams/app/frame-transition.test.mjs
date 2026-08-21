import test from "node:test";
import assert from "node:assert/strict";
import {
  FRAME_THREE_LOGO_HEIGHT,
  FRAME_THREE_LOGOS,
  FRAME_THREE_MOBILE_SHAPES,
  heroTransitionWindowAt,
  FRAME_REFERENCE_WIDTH,
  FRAME_TWO_MOBILE_SHAPES,
  FRAME_TWO_SHAPES,
  FRAME_TWO_RAW_SHAPES,
  FRAME_TWO_LOGO_CENTER_X,
  FRAME_TWO_MAPS_LEFT,
  FRAME_FOUR_CONTENT_ENTER_OFFSET,
  FRAME_FOUR_LOGO_ORDER,
  FRAME_FOUR_LOGO_Z_INDEX,
  FRAME_FOUR_SHAPES,
  FRAME_FOUR_LOGO_CENTER_X,
  FRAME_FOUR_MOBILE_LOGO_CENTER_X,
  FRAME_FOUR_MOBILE_SHAPES,
  FRAME_FOUR_MOBILE_ROTATIONS,
  frameFourContentOffsetAt,
  frameFourSharedLogoTransformAt,
  frameScaleAtViewport,
  mobileFrameScaleAtViewport,
  mobileFrameVerticalScaleAtViewport,
  scaleMobileShapeBoundsAtViewport,
  geminiOpacityAt,
  halfVisibleScrollAt,
  frameThreeTransitionWindowAt,
  FRAME_THREE_DWELL_VIEWPORTS,
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

test("Frame 4 mobile logos match scaled dimensions, shifted gear/gemini up, and cloud connected below gemini with 10% increased size", () => {
  assert.equal(mobileFrameScaleAtViewport(375), 1);
  assert.equal(mobileFrameScaleAtViewport(320), 320 / 375);
  assert.equal(mobileFrameVerticalScaleAtViewport(812), 1);

  assert.ok(Math.abs(FRAME_FOUR_MOBILE_SHAPES.gemini.width - 358.481 * 0.8) < 1e-4);
  assert.ok(Math.abs(FRAME_FOUR_MOBILE_SHAPES.gemini.height - 358.481 * 0.8) < 1e-4);
  assert.ok(Math.abs(FRAME_FOUR_MOBILE_SHAPES.cloud.width - 270.0621) < 1e-4);
  assert.ok(Math.abs(FRAME_FOUR_MOBILE_SHAPES.cloud.height - 197.1834) < 1e-4);
  assert.ok(Math.abs(FRAME_FOUR_MOBILE_SHAPES.gear.width - 467.447 * 0.8) < 1e-4);
  assert.ok(Math.abs(FRAME_FOUR_MOBILE_SHAPES.gear.height - 467.448 * 0.8) < 1e-4);
  assert.equal(FRAME_FOUR_MOBILE_ROTATIONS.gear, 15.364);

  const shapes = Object.values(FRAME_FOUR_MOBILE_SHAPES);
  assert.ok(shapes.every((shape) => shape.x + shape.width <= 375));
  assert.ok(Math.min(...shapes.map((shape) => shape.y)) <= 0);
  // Cloud is placed directly below Gemini (y = 480)
  assert.equal(FRAME_FOUR_MOBILE_SHAPES.cloud.y, 480);
  // Order: gear (top) < gemini (middle) < cloud (bottom)
  assert.ok(FRAME_FOUR_MOBILE_SHAPES.gear.y < FRAME_FOUR_MOBILE_SHAPES.gemini.y);
  assert.ok(FRAME_FOUR_MOBILE_SHAPES.gemini.y < FRAME_FOUR_MOBILE_SHAPES.cloud.y);
});

test("Frame 4 mobile logos share a unified vertical center axis", () => {
  const shapes = Object.values(FRAME_FOUR_MOBILE_SHAPES);
  const centers = shapes.map((shape) => shape.x + shape.width / 2);
  assert.ok(
    centers.every(
      (center) => Math.abs(center - FRAME_FOUR_MOBILE_LOGO_CENTER_X) < 1e-6,
    ),
  );
});

test("Frame 2 mobile logos share a right-side vertical axis with balanced visual size and overlap", () => {
  const shapes = Object.values(FRAME_TWO_MOBILE_SHAPES);
  const centers = shapes.map((shape) => shape.x + shape.width / 2);

  assert.ok(centers.every((center) => Math.abs(center - 350) < 1e-6));
  assert.ok(Math.min(...shapes.map((shape) => shape.y)) <= 0);
  assert.ok(Math.max(...shapes.map((shape) => shape.y + shape.height)) >= 800);

  const webBottom = FRAME_TWO_MOBILE_SHAPES.web.y + FRAME_TWO_MOBILE_SHAPES.web.height;
  assert.ok(webBottom > FRAME_TWO_MOBILE_SHAPES.maps.y, "web and maps must overlap vertically");

  const mapsBottom = FRAME_TWO_MOBILE_SHAPES.maps.y + FRAME_TWO_MOBILE_SHAPES.maps.height;
  assert.ok(mapsBottom > FRAME_TWO_MOBILE_SHAPES.android.y, "maps and android must overlap vertically");
});

test("Frame 3 mobile logos match Figma dimensions and chain horizontally aligned on center row", () => {
  assert.equal(FRAME_THREE_MOBILE_SHAPES.web.width, 96.549);
  assert.equal(FRAME_THREE_MOBILE_SHAPES.web.height, 96.549);
  assert.equal(FRAME_THREE_MOBILE_SHAPES.maps.width, 75.723);
  assert.equal(FRAME_THREE_MOBILE_SHAPES.maps.height, 96.574);
  assert.equal(FRAME_THREE_MOBILE_SHAPES.gemini.width, 97.623);
  assert.equal(FRAME_THREE_MOBILE_SHAPES.gemini.height, 97.623);
  assert.equal(FRAME_THREE_MOBILE_SHAPES.gear.width, 116.903);
  assert.equal(FRAME_THREE_MOBILE_SHAPES.gear.height, 116.902);

  const shapes = Object.values(FRAME_THREE_MOBILE_SHAPES);
  assert.ok(shapes.every((s) => s.x >= 0 && s.x + s.width <= 375));
  const rowYCenters = shapes.map((shape) => shape.y + shape.height / 2);
  assert.ok(rowYCenters.every((center) => Math.abs(center - 330) < 1e-3));
});

test("Frame 3 mobile logos have equal horizontal overlap between adjacent logos", () => {
  const web = FRAME_THREE_MOBILE_SHAPES.web;
  const maps = FRAME_THREE_MOBILE_SHAPES.maps;
  const gemini = FRAME_THREE_MOBILE_SHAPES.gemini;
  const gear = FRAME_THREE_MOBILE_SHAPES.gear;

  const overlapWebMaps = web.x + web.width - maps.x;
  const overlapMapsGemini = maps.x + maps.width - gemini.x;
  const overlapGeminiGear = gemini.x + gemini.width - gear.x;

  assert.ok(Math.abs(overlapWebMaps - overlapMapsGemini) < 1e-3);
  assert.ok(Math.abs(overlapMapsGemini - overlapGeminiGear) < 1e-3);
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
test("mobile Web keeps its aspect ratio in the Frame 3 row", () => {
  const web = FRAME_THREE_MOBILE_SHAPES.web;

  assert.equal(web.width, web.height);
  assert.ok(Math.abs(web.height - FRAME_THREE_MOBILE_SHAPES.maps.height) < 0.1);
  assert.ok(web.x >= 0);
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

test("VIT logos render above the text layer", () => {
  assert.ok(FRAME_FOUR_LOGO_Z_INDEX > 10);
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
  const shapes = Object.values(FRAME_TWO_SHAPES);
  const centers = shapes.map((shape) => shape.x + shape.width / 2);

  assert.ok(centers.every((center) => Math.abs(center - FRAME_TWO_LOGO_CENTER_X) < 1e-9));
  assert.equal(
    FRAME_TWO_MAPS_LEFT,
    FRAME_TWO_LOGO_CENTER_X - FRAME_TWO_RAW_SHAPES.maps.width / 2,
  );
  assert.equal(frameTwoMapsOpacityAt(0), 0);
  assert.ok(frameTwoMapsOpacityAt(0.5) > frameTwoMapsOpacityAt(0.4));
  assert.equal(frameTwoMapsOpacityAt(1), 1);
});
test("Frame 2 shape targets preserve source heights and vertical spacing", () => {
  assert.deepEqual(FRAME_TWO_RAW_SHAPES.web, {
    x: 866.7959,
    y: 0.4502,
    width: 453.8907,
    height: 453.8907,
  });
  assert.deepEqual(FRAME_TWO_RAW_SHAPES.maps, {
    x: 911.1626,
    y: 387.2815,
    width: 364.106,
    height: 464.3671,
  });
  assert.deepEqual(FRAME_TWO_RAW_SHAPES.android, {
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

test("Frame 3 all 4 logos maintain exact horizontal center row alignment across multiple viewports", () => {
  const viewports = [
    { w: 320, h: 568 },
    { w: 360, h: 640 },
    { w: 375, h: 667 },
    { w: 375, h: 812 },
    { w: 390, h: 844 },
    { w: 412, h: 915 },
    { w: 414, h: 896 },
    { w: 430, h: 932 },
    { w: 480, h: 800 },
    { w: 540, h: 720 },
    { w: 600, h: 960 },
    { w: 700, h: 1000 },
    { w: 768, h: 1024 },
    { w: 834, h: 1194 },
    { w: 1024, h: 768 },
    { w: 1280, h: 800 },
    { w: 1440, h: 900 },
    { w: 1920, h: 1080 },
    { w: 2560, h: 1440 },
  ];

  for (const { w, h } of viewports) {
    const isMobile = w <= 700;
    const frameScale = frameScaleAtViewport(w);
    const mobileScale = mobileFrameScaleAtViewport(w);
    const scale = isMobile ? mobileScale : frameScale;

    const shapes = isMobile
      ? Object.values(FRAME_THREE_MOBILE_SHAPES)
      : Object.values(FRAME_THREE_LOGOS);
    const centers = shapes.map((s) => (s.y + s.height / 2) * scale);
    const maxDiff = Math.max(...centers) - Math.min(...centers);
    assert.ok(
      maxDiff < 1e-3,
      `Frame 3 row misalignment at ${w}x${h}: diff=${maxDiff}`,
    );
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

test("scroll progress maps linearly across its window", () => {
  assert.equal(scrollTransitionProgressAt(449, 450, 900), 0);
  assert.equal(scrollTransitionProgressAt(450, 450, 900), 0);
  assert.equal(scrollTransitionProgressAt(675, 450, 900), 0.5);
  assert.equal(scrollTransitionProgressAt(900, 450, 900), 1);
});

test("the hero morph lands before the About section is well into view", () => {
  // A 390x740 phone: hero is one viewport, About starts right after it.
  const viewportHeight = 740;
  const w = heroTransitionWindowAt({
    heroStart: 0,
    heroHeight: viewportHeight,
    frameTwoStart: viewportHeight,
    viewportHeight,
  });

  // It used to end at frameTwoStart (740), by which point the About section had
  // been on screen for most of a viewport with its shapes still parked at the
  // hero — a measured 616px hole, 83% of the screen, at scrollY 463.
  assert.ok(w.end < viewportHeight, `expected the morph to finish before ${viewportHeight}, got ${w.end}`);

  // At the offset that used to be worst, the morph is now essentially done.
  const p = scrollTransitionProgressAt(463, w.start, w.end);
  assert.ok(p > 0.9, `expected the morph to be settled by scrollY 463, got ${p.toFixed(2)}`);

  // And it must not begin the instant the page moves, or the hero comes apart
  // while it is still the only thing on screen.
  assert.ok(w.start > viewportHeight * 0.1, `morph starts too early at ${w.start}`);
  assert.ok(w.start < w.end);
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

test("Frame 4 uses the requested left-side logo order and unified center alignment", () => {
  assert.deepEqual(FRAME_FOUR_LOGO_ORDER, ["gear", "gemini", "cloud"]);
  const shapes = Object.values(FRAME_FOUR_SHAPES);
  const centers = shapes.map((shape) => shape.x + shape.width / 2);
  assert.ok(centers.every((center) => Math.abs(center - FRAME_FOUR_LOGO_CENTER_X) < 1e-9));
});
test("Frame 2 and Frame 4 logos maintain exact vertical center alignment across multiple viewports", () => {
  const viewports = [
    { w: 320, h: 568 },
    { w: 360, h: 640 },
    { w: 375, h: 812 },
    { w: 390, h: 844 },
    { w: 412, h: 915 },
    { w: 414, h: 896 },
    { w: 430, h: 932 },
    { w: 480, h: 800 },
    { w: 540, h: 720 },
    { w: 600, h: 960 },
    { w: 700, h: 1000 },
    { w: 768, h: 1024 },
    { w: 834, h: 1194 },
    { w: 1024, h: 768 },
    { w: 1280, h: 800 },
    { w: 1440, h: 900 },
    { w: 1920, h: 1080 },
    { w: 2560, h: 1440 },
  ];

  for (const { w, h } of viewports) {
    const isMobile = w <= 700;
    const frameScale = frameScaleAtViewport(w);
    const mobileScale = mobileFrameScaleAtViewport(w);
    const scale = isMobile ? mobileScale : frameScale;

    // Frame 2
    const f2Shapes = isMobile
      ? Object.values(FRAME_TWO_MOBILE_SHAPES)
      : Object.values(FRAME_TWO_SHAPES);
    const f2Centers = f2Shapes.map((s) => (s.x + s.width / 2) * scale);
    const f2MaxDiff = Math.max(...f2Centers) - Math.min(...f2Centers);
    assert.ok(
      f2MaxDiff < 1e-6,
      `Frame 2 misalignment at ${w}x${h}: diff=${f2MaxDiff}`,
    );

    // Frame 4 (desktop, tablet, and mobile all share common center line)
    const f4Shapes = isMobile
      ? Object.values(FRAME_FOUR_MOBILE_SHAPES)
      : Object.values(FRAME_FOUR_SHAPES);
    const f4Centers = f4Shapes.map((s) => (s.x + s.width / 2) * scale);
    const f4MaxDiff = Math.max(...f4Centers) - Math.min(...f4Centers);
    assert.ok(
      f4MaxDiff < 1e-6,
      `Frame 4 misalignment at ${w}x${h}: diff=${f4MaxDiff}`,
    );
  }
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

test("mobile gets a real scroll distance for the About -> About GDG morph", () => {
  // A 390x740 phone: frames are 100svh, About is 125svh (globals.css).
  const viewportHeight = 740;
  const frameTwoTop = 740;
  const frameThreeTop = frameTwoTop + Math.max(viewportHeight * 1.25, 750);

  const window = frameThreeTransitionWindowAt({
    frameTwoTop,
    frameThreeTop,
    frameThreeHeight: viewportHeight,
    viewportHeight,
  });

  const distance = window.end - window.start;
  // The old section-derived window collapsed to 0.15 x viewport — 111px here.
  assert.ok(
    distance > viewportHeight * 0.5,
    `expected more than half a viewport of scroll, got ${distance}px`,
  );
  // And it never begins before the About composition has assembled.
  assert.ok(window.start >= frameTwoTop);
});

test("the morph holds briefly on the assembled About before starting", () => {
  const viewportHeight = 640;
  const frameTwoTop = 640;
  const frameThreeTop = frameTwoTop + Math.max(viewportHeight * 1.25, 750);

  const window = frameThreeTransitionWindowAt({
    frameTwoTop,
    frameThreeTop,
    frameThreeHeight: viewportHeight,
    viewportHeight,
  });

  assert.equal(
    window.start,
    frameTwoTop + viewportHeight * FRAME_THREE_DWELL_VIEWPORTS,
  );
  assert.ok(window.start < window.end);
});

test("desktop spans its existing section without extra page height", () => {
  // A 1440x900 desktop: every frame stays 1024px, as it always was.
  const viewportHeight = 900;
  const frameTwoTop = 900;
  const frameThreeTop = frameTwoTop + 1024;

  const window = frameThreeTransitionWindowAt({
    frameTwoTop,
    frameThreeTop,
    frameThreeHeight: 1024,
    viewportHeight,
  });

  // Was 197px, because the old start point sat 439px into the section.
  assert.ok(
    window.end - window.start > viewportHeight * 0.5,
    `expected more than half a viewport of scroll, got ${window.end - window.start}px`,
  );
  // The morph still lands exactly where it always did.
  assert.equal(window.end, halfVisibleScrollAt(frameThreeTop, 1024, viewportHeight));
  // The dwell is the only stretch where nothing moves; keep it short.
  assert.ok(window.start - frameTwoTop <= viewportHeight * 0.2);
});

test("the window never inverts on a very short viewport", () => {
  const viewportHeight = 300;
  const frameTwoTop = 300;
  const window = frameThreeTransitionWindowAt({
    frameTwoTop,
    frameThreeTop: frameTwoTop + 400,
    frameThreeHeight: 300,
    viewportHeight,
  });
  assert.ok(window.start <= window.end);
});
