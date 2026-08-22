import test from "node:test";
import assert from "node:assert/strict";
import { GRAVITAS_PORTAL_URL } from "./gravitas-notice.ts";

test("Gravitas portal URL points to official VIT Gravitas site", () => {
  assert.equal(GRAVITAS_PORTAL_URL, "https://gravitas.vit.ac.in");
});
