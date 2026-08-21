import test from "node:test";
import assert from "node:assert/strict";
import { memberActionFor } from "./team-member-actions.ts";

const me = { name: "Me", email: "me@example.com" };
const teammate = { name: "Teammate", email: "teammate@example.com" };

test("self member row exposes leave action", () => {
  assert.equal(memberActionFor(me, "ME@example.com", false), "leave");
});

test("leader member row exposes management action", () => {
  assert.equal(memberActionFor(teammate, me.email, true), "manage");
});

test("non-leader cannot manage another member", () => {
  assert.equal(memberActionFor(teammate, me.email, false), null);
});
