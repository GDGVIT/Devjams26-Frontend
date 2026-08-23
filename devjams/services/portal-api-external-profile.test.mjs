import test from "node:test";
import assert from "node:assert/strict";
import { backendUrl } from "./test-environment.mjs";
import { isLockedInternalOAuthIdentity, nextPortalRoute, portalApi } from "./portalApi.ts";

const storage = new Map();
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

test("serializes an external onboarding PATCH without hostel keys", async () => {
  let patch;
  await withFetch(async (url, options = {}) => {
    if (String(url).endsWith("/participant/me") && options.method === "PATCH") {
      patch = JSON.parse(String(options.body));
      return new Response(null, { status: 204 });
    }
    return new Response(JSON.stringify({
      id: "external-1",
      name: "External Participant",
      email: "participant@example.edu",
      participant_type: "external",
      phone: "+91 9876543210",
      gender: "Female",
      college_name: "Example College",
      college_address: "Chennai",
      college_roll_number: "EX-42",
    }), { headers: { "content-type": "application/json" } });
  }, async () => {
    await portalApi.saveOnboarding({
      participantType: "external",
      name: "External Participant",
      contactNumber: "+91 9876543210",
      email: "participant@example.edu",
      gender: "Female",
      collegeName: "Example College",
      collegeAddress: "Chennai",
      collegeRollNumber: "EX-42",
    });
  });

  assert.deepEqual(patch, {
    name: "External Participant",
    phone: "+91 9876543210",
    gender: "Female",
    college_name: "Example College",
    college_address: "Chennai",
    college_roll_number: "EX-42",
  });
  assert.equal("email" in patch, false);
  assert.equal("registration_number" in patch, false);
  assert.equal("hostel_block" in patch, false);
  assert.equal("room_number" in patch, false);
});

test("maps external participant data without hostel session fields", async () => {
  await withFetch(async () => new Response(JSON.stringify({
    id: "external-1",
    name: "External Participant",
    email: "participant@example.edu",
    participant_type: "external",
    phone: "+91 9876543210",
    registration_number: "EXT-42",
    gender: "Female",
    college_name: "Example College",
    college_address: "Chennai",
    college_roll_number: "EX-42",
  }), { headers: { "content-type": "application/json" } }), async () => {
    const session = await portalApi.fetchMe();
    assert.equal(session?.id, "external-1");
    assert.equal(session?.name, "External Participant");
    assert.equal(session?.email, "participant@example.edu");
    assert.equal(session?.participantType, "external");
    assert.equal(session?.gender, "Female");
    assert.equal(session?.phone, "+91 9876543210");
    assert.equal(session?.collegeName, "Example College");
    assert.equal(session?.collegeAddress, "Chennai");
    assert.equal(session?.collegeRollNumber, "EX-42");
    assert.equal("registrationNumber" in session, false);
    assert.equal("hostelBlock" in session, false);
    assert.equal("roomNumber" in session, false);
  });
});

test("serializes the established internal onboarding PATCH", async () => {
  let patch;
  await withFetch(async (url, options = {}) => {
    if (String(url).endsWith("/participant/me") && options.method === "PATCH") {
      patch = JSON.parse(String(options.body));
      return new Response(null, { status: 204 });
    }
    return new Response(JSON.stringify({
      id: "internal-1",
      name: "Internal Participant",
      email: "participant@vitstudent.ac.in",
      participant_type: "internal",
    }), { headers: { "content-type": "application/json" } });
  }, async () => {
    await portalApi.saveOnboarding({
      participantType: "internal",
      name: "Internal Participant",
      registrationNumber: "22BCE0001",
      contactNumber: "+91 9876543210",
      email: "participant@vitstudent.ac.in",
      gender: "Male",
      hostelBlock: "MH-A",
      roomNumber: "402",
    });
  });

  assert.deepEqual(patch, {
    name: "Internal Participant",
    registration_number: "22BCE0001",
    phone: "+91 9876543210",
    gender: "Male",
    hostel_block: "MH-A",
    room_number: "402",
  });
  assert.equal("email" in patch, false);
});

test("routes authenticated participants through onboarding before team selection", () => {
  assert.equal(
    nextPortalRoute({
      participantType: "internal",
      phone: "1",
      gender: "Male",
      hostelBlock: "MH-A",
      roomNumber: "402",
    }),
    "/portal/onboarding",
  );
  assert.equal(
    nextPortalRoute({
      participantType: "external",
      phone: "1",
      gender: "Female",
      collegeName: "College",
      collegeAddress: "Chennai",
      collegeRollNumber: "42",
    }),
    "/portal/onboarding",
  );
  assert.equal(
    nextPortalRoute({
      participantType: "external",
      phone: "1",
      gender: "Female",
      collegeName: "College",
      collegeAddress: "Chennai",
    }),
    "/portal/onboarding",
  );
  assert.equal(
    nextPortalRoute({
      participantType: "internal",
      teamId: "team-1",
    }),
    "/team",
  );
});

test("locks only internal identities with a valid OAuth registration suffix", () => {
  assert.equal(isLockedInternalOAuthIdentity("internal", "25BCE2055"), true);
  assert.equal(isLockedInternalOAuthIdentity("internal", "Neeraj"), false);
  assert.equal(isLockedInternalOAuthIdentity("external", "25BCE2055"), false);
});

test("Google login locks only identities parsed from the OAuth name", async () => {
  const cases = [
    { registration_number: "25BCE2055", expected: true },
    { registration_number: undefined, expected: false },
  ];

  for (const testCase of cases) {
    await withFetch(async (url) => {
      if (String(url).endsWith("/auth/participant/google/exchange")) {
        return new Response(JSON.stringify({
          token: "oauth-token",
          user: {
            id: "internal-1",
            name: "Neeraj Sathish Kumar",
            email: "participant@vitstudent.ac.in",
            role: "participant",
            participant_type: "internal",
            registration_number: testCase.registration_number,
          },
        }), { headers: { "content-type": "application/json" } });
      }
      return new Response(JSON.stringify({
        id: "internal-1",
        name: "Neeraj Sathish Kumar",
        email: "participant@vitstudent.ac.in",
        participant_type: "internal",
        registration_number: testCase.registration_number,
      }), { headers: { "content-type": "application/json" } });
    }, async () => {
      await portalApi.completeGoogleLogin("oauth-code");
      assert.equal(portalApi.getSession()?.oauthIdentityLocked, testCase.expected);
    });
  }
});
test("serializes participant IDs for team management", async () => {
  const requests = [];
  await withFetch(async (url, options = {}) => {
    requests.push({ url: String(url), method: options.method, body: JSON.parse(String(options.body)) });
    return new Response(null, { status: 204 });
  }, async () => {
    await portalApi.transferTeamLeadership("64d8f9237bfc2f0e8f000001");
    await portalApi.removeTeamMember("64d8f9237bfc2f0e8f000002");
  });

  assert.deepEqual(requests, [
    {
      url: `${backendUrl}/participant/team/leader`,
      method: "PATCH",
      body: { member_id: "64d8f9237bfc2f0e8f000001" },
    },
    {
      url: `${backendUrl}/participant/team/members`,
      method: "DELETE",
      body: { member_id: "64d8f9237bfc2f0e8f000002" },
    },
  ]);
});
