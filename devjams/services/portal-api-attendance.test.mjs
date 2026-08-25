import test from "node:test";
import assert from "node:assert/strict";
import { backendUrl } from "./test-environment.mjs";
import { portalApi } from "./portalApi.ts";

const storage = new Map([
  ["devjams26_jwt_token", "participant-token"],
]);
globalThis.window = globalThis;
globalThis.localStorage = {
  getItem: (key) => storage.get(key) ?? null,
  setItem: (key, value) => storage.set(key, value),
  removeItem: (key) => storage.delete(key),
};

async function withFetch(handler, run) {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = handler;
  try {
    await run();
  } finally {
    globalThis.fetch = originalFetch;
  }
}

test("fetches the authenticated participant attendance status", async () => {
  let requestedUrl;
  let requestedOptions;

  await withFetch(async (url, options) => {
    requestedUrl = String(url);
    requestedOptions = options;
    return new Response(JSON.stringify({
      checked_in: true,
      checked_in_at: "2026-08-25T12:34:56Z",
    }), { headers: { "content-type": "application/json" } });
  }, async () => {
    const status = await portalApi.fetchAttendanceStatus();

    assert.deepEqual(status, {
      isCheckedIn: true,
      checkedInAt: "2026-08-25T12:34:56Z",
    });
  });

  assert.equal(requestedUrl, `${backendUrl}/participant/attendance/status`);
  assert.equal(requestedOptions.method, "GET");
  assert.equal(requestedOptions.headers.Authorization, "Bearer participant-token");
});

test("fetches ordered participant attendance history", async () => {
  let requestedUrl;

  await withFetch(async (url, options) => {
    requestedUrl = String(url);
    assert.equal(options.method, "GET");
    return new Response(JSON.stringify({
      checkins: [
        { timestamp: "2026-08-25T10:00:00Z" },
        { timestamp: "2026-08-25T11:30:00Z" },
      ],
    }), { headers: { "content-type": "application/json" } });
  }, async () => {
    const history = await portalApi.fetchAttendanceHistory();

    assert.deepEqual(history, [
      { timestamp: "2026-08-25T10:00:00Z" },
      { timestamp: "2026-08-25T11:30:00Z" },
    ]);
  });

  assert.equal(requestedUrl, `${backendUrl}/participant/attendance/history`);
});
