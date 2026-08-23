import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const source = readFileSync(new URL("./idea/submission/page.tsx", import.meta.url), "utf8");

test("idea submission starts with no selected tracks", () => {
  assert.match(source, /useState<string\[\]>\(\[\]\)/);
  assert.doesNotMatch(source, /useState<string\[\]>\(\["Web", "AI\/ML"\]\)/);
});

test("idea submission exposes exactly the six configured tracks", () => {
  const tracks = [...source.matchAll(/^\s+"([^"]+)",?$/gm)].map((match) => match[1]);
  assert.deepEqual(tracks.slice(0, 6), [
    "AI/ML",
    "FinTech",
    "DevTools & Infra",
    "AR/VR",
    "Open Innovation",
    "Multimedia Tech",
  ]);
});
