import test from "node:test";
import assert from "node:assert/strict";
import { memberActionFor } from "./team-member-actions.ts";

const me = { id: "64d8f9237bfc2f0e8f000001", name: "Me", email: "me@example.com" };
const teammate = { id: "64d8f9237bfc2f0e8f000002", name: "Teammate", email: "teammate@example.com" };

test("self member row exposes leave action by participant ID", () => {
  assert.equal(memberActionFor(me, me.id, false), "leave");
});

test("leader member row exposes management action by participant ID", () => {
  assert.equal(memberActionFor(teammate, me.id, true), "manage");
});

test("non-leader cannot manage another member", () => {
  assert.equal(memberActionFor(teammate, me.id, false), null);
});
