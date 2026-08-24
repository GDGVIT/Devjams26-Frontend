import test from "node:test";
import assert from "node:assert/strict";
import { memberActionFor } from "./team-member-actions.ts";

const me = { id: "64d8f9237bfc2f0e8f000001", name: "Me", email: "me@participant.test" };
const teammate = { id: "64d8f9237bfc2f0e8f000002", name: "Teammate", email: "teammate@participant.test" };

test("self member row exposes leave action by participant ID", () => {
  assert.equal(memberActionFor(me, me.id, false), "leave");
});

test("leader member row exposes management action by participant ID", () => {
  assert.equal(memberActionFor(teammate, me.id, true), "manage");
});

test("non-leader cannot manage another member", () => {
  assert.equal(memberActionFor(teammate, me.id, false), null);
});

test("submitted team still exposes member actions", () => {
  assert.equal(memberActionFor(me, me.id, false, true), "leave");
  assert.equal(memberActionFor(teammate, me.id, true, true), "manage");
});

test("submitted idea warns before removing the final teammate", async () => {
  const { shouldWarnSubmittedIdeaRemoval } = await import("./team-member-actions.ts");
  assert.equal(shouldWarnSubmittedIdeaRemoval(true, 2), true);
  assert.equal(shouldWarnSubmittedIdeaRemoval(true, 3), false);
  assert.equal(shouldWarnSubmittedIdeaRemoval(false, 2), false);
});

test("non-leader X requests leader removal when leaving is disabled", async () => {
  const { memberActionFor } = await import("./team-member-actions.ts");
  assert.equal(memberActionFor(me, me.id, false, false), "request-leave");
  assert.equal(memberActionFor(me, me.id, true, false), "leave");
});
