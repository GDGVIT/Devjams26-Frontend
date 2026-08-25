import test from "node:test";
import assert from "node:assert/strict";
import "./test-environment.mjs";
import { portalApi } from "./portalApi.ts";

const storage = new Map();
globalThis.window = globalThis;
globalThis.localStorage = {
  getItem: (key) => storage.get(key) ?? null,
  setItem: (key, value) => storage.set(key, value),
  removeItem: (key) => storage.delete(key),
};

test("joins a team with a case-insensitive six-character invite code", async () => {
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
    await portalApi.joinTeam(" a1b2c3 ");
    assert.deepEqual(JSON.parse(String(joinRequest.body)), { invite_code: "A1B2C3" });
  } finally {
    globalThis.fetch = originalFetch;
  }
});
test("makes the first joiner leader when joining an empty team", async () => {
  portalApi.saveSession({
    id: "participant-1",
    name: "First Joiner",
    email: "first@example.edu",
    participantType: "external",
  });
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async (url) => {
    if (String(url).endsWith("/participant/team/join")) {
      return new Response(JSON.stringify({
        message: "joined team",
        team_id: "team-empty",
        team_name: "Empty Team",
        team_size: 1,
      }), { headers: { "content-type": "application/json" } });
    }
    return new Response(JSON.stringify({
      team_id: "team-empty",
      team_name: "Empty Team",
      members: [{
        id: "participant-1",
        name: "First Joiner",
        email: "first@example.edu",
      }],
    }), { headers: { "content-type": "application/json" } });
  };

  try {
    await portalApi.joinTeam("a1b2c3");
    assert.equal(portalApi.getSession()?.isTeamLeader, true);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("repairs a populated team that has no leader and leaves empty teams leaderless", async () => {
  portalApi.saveSession({
    id: "participant-1",
    name: "First Member",
    email: "first@example.edu",
    participantType: "external",
  });
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async (url) => {
    if (String(url).endsWith("/participant/team")) {
      return new Response(JSON.stringify({
        team_id: "team-populated",
        team_name: "Populated Team",
        members: [
          { id: "participant-1", name: "First Member", email: "first@example.edu" },
          { id: "participant-2", name: "Second Member", email: "second@example.edu" },
        ],
      }), { headers: { "content-type": "application/json" } });
    }
    throw new Error(`Unexpected request: ${String(url)}`);
  };

  try {
    const populatedTeam = await portalApi.fetchTeam();
    assert.equal(populatedTeam?.members[0].is_team_leader, true);
    assert.equal(populatedTeam?.members[1].is_team_leader, false);
  } finally {
    globalThis.fetch = originalFetch;
  }

  globalThis.fetch = async (url) => {
    if (String(url).endsWith("/participant/team")) {
      return new Response(JSON.stringify({
        team_id: "team-empty",
        team_name: "Empty Team",
        members: [],
      }), { headers: { "content-type": "application/json" } });
    }
    throw new Error(`Unexpected request: ${String(url)}`);
  };

  try {
    const emptyTeam = await portalApi.fetchTeam();
    assert.deepEqual(emptyTeam?.members, []);
  } finally {
    globalThis.fetch = originalFetch;
  }
});
