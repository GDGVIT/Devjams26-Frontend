import test from "node:test";
import assert from "node:assert/strict";
import { portalAuthErrorMessage } from "./portal-auth-state.ts";

test("maps an unregistered Google account to an actionable portal error", () => {
  assert.equal(
    portalAuthErrorMessage("participant_not_registered"),
    "This Google account is not registered for DevJams. Sign in with the account used for registration.",
  );
});

test("maps an internal account mismatch without exposing OAuth details", () => {
  assert.equal(
    portalAuthErrorMessage("wrong_google_account"),
    "Internal participant access requires your VIT Google account.",
  );
});

test("uses a generic message for unknown OAuth failures", () => {
  assert.equal(
    portalAuthErrorMessage("unexpected"),
    "Google sign-in could not be completed. Please try again.",
  );
});
