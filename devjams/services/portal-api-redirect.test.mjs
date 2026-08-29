import test from "node:test";
import assert from "node:assert/strict";
import { portalApi, portalLoginPath } from "./portalApi.ts";

const storage = new Map();
globalThis.window = globalThis;
globalThis.localStorage = {
  getItem: (key) => storage.get(key) ?? null,
  setItem: (key, value) => storage.set(key, value),
  removeItem: (key) => storage.delete(key),
};

test("builds a safe login URL for protected participant paths", () => {
  assert.equal(portalLoginPath("/profile"), "/portal?redirect=%2Fprofile");
  assert.equal(
    portalLoginPath("/submissions/project-intake?from=qr"),
    "/portal?redirect=%2Fsubmissions%2Fproject-intake%3Ffrom%3Dqr",
  );
});

test("rejects external login redirect targets", () => {
  assert.equal(portalLoginPath("https://evil.example"), "/portal");
  assert.equal(portalLoginPath("//evil.example"), "/portal");
});

test("persists the intended participant redirect through OAuth", () => {
  portalApi.rememberLoginRedirect("/team");
  assert.equal(portalApi.getLoginRedirect(), "/team");
  portalApi.clearLoginRedirect();
  assert.equal(portalApi.getLoginRedirect(), null);
});
