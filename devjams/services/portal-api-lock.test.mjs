import test from "node:test";
import assert from "node:assert/strict";
import "./test-environment.mjs";
import { portalApi } from "./portalApi.ts";

const storage = new Map([
  ["devjams26_jwt_token", "participant-token"],
  ["devjams26_portal_session", JSON.stringify({
    id: "participant-1",
    name: "Participant",
    email: "participant@example.test",
    participantType: "internal",
    teamId: "team-1",
    token: "participant-token",
  })],
  ["devjams26_portal_team", JSON.stringify({
    team_id: "team-1",
    team_name: "Locked Team",
    idea_submitted: true,
    members: [],
  })],
]);

globalThis.window = globalThis;
globalThis.localStorage = {
  getItem: (key) => storage.get(key) ?? null,
  setItem: (key, value) => storage.set(key, value),
  removeItem: (key) => storage.delete(key),
};

test("does not fall back to a local idea after a locked-team conflict", async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => new Response(
    JSON.stringify({ error: "team is locked after idea submission" }),
    { status: 409, headers: { "content-type": "application/json" } },
  );

  try {
    await assert.rejects(
      portalApi.submitIdea({
        short_description: "Updated idea",
        long_description: "Updated idea details",
        links: "",
        tracks: "Web",
      }),
      (error) => error?.message === "team is locked after idea submission" && error?.status === 409,
    );
    assert.equal(JSON.parse(storage.get("devjams26_portal_team")).idea, undefined);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("saves a draft for any team member without submitting it", async () => {
  const originalFetch = globalThis.fetch;
  const requests = [];
  globalThis.fetch = async (url, options = {}) => {
    requests.push({ url: String(url), options });
    if (String(url).endsWith("/participant/team/idea")) {
      return new Response(
        JSON.stringify({
          message: "idea draft saved",
          idea: {
            short_description: "Draft",
            long_description: "Draft details",
            links: "",
            tracks: "Web",
            is_submitted: false,
            last_edited_by_name: "Participant",
          },
        }),
        { status: 200, headers: { "content-type": "application/json" } },
      );
    }
    return new Response(
      JSON.stringify({ team_id: "team-1", team_name: "Draft Team", idea_submitted: false, members: [] }),
      { status: 200, headers: { "content-type": "application/json" } },
    );
  };

  try {
    const response = await portalApi.saveIdea({
      short_description: "Draft",
      long_description: "Draft details",
      links: "",
      tracks: "Web",
    });
    assert.equal(response.message, "idea draft saved");
    const saveRequest = requests.find(({ url }) => url.endsWith("/participant/team/idea"));
    assert.deepEqual(JSON.parse(saveRequest.options.body), {
      short_description: "Draft",
      long_description: "Draft details",
      links: "",
      tracks: "Web",
      submit: false,
    });
  } finally {
    globalThis.fetch = originalFetch;
  }
});
