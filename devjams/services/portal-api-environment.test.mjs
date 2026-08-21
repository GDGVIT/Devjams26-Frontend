import test from "node:test";
import assert from "node:assert/strict";
import { portalApi } from "./portalApi.ts";

test("requires NEXT_PUBLIC_BACKEND_URL", () => {
  const configured = process.env.NEXT_PUBLIC_BACKEND_URL;
  delete process.env.NEXT_PUBLIC_BACKEND_URL;

  try {
    assert.throws(() => portalApi.getBaseUrl(), /NEXT_PUBLIC_BACKEND_URL must be set/);
  } finally {
    if (configured === undefined) {
      delete process.env.NEXT_PUBLIC_BACKEND_URL;
    } else {
      process.env.NEXT_PUBLIC_BACKEND_URL = configured;
    }
  }
});
