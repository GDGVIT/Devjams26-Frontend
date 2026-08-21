import test from "node:test";
import assert from "node:assert/strict";
import { portalApi } from "./portalApi.ts";

const storage = new Map();
globalThis.window = globalThis;
globalThis.localStorage = {
  getItem: (key) => storage.get(key) ?? null,
  setItem: (key, value) => storage.set(key, value),
  removeItem: (key) => storage.delete(key),
};

test("joins a team with the upstream eight-digit join code contract", async () => {
  let joinRequest;
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async (url, options = {}) => {
    if (String(url).endsWith("/participant/team/join")) {
      joinRequest = options;
      return new Response(JSON.stringify({
        message: "joined team",
        team_id: "team-1",
        team_name: "Synced Team",
        team_size: 2,
      }), { headers: { "content-type": "application/json" } });
    }
    return new Response(JSON.stringify({ team_id: "team-1", team_name: "Synced Team", members: [] }), {
      headers: { "content-type": "application/json" },
    });
  };

  try {
    await portalApi.joinTeam("12345678");
    assert.deepEqual(JSON.parse(String(joinRequest.body)), { join_code: "12345678" });
  } finally {
    globalThis.fetch = originalFetch;
  }
});
